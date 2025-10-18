from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from supabase import create_client, Client
from dotenv import load_dotenv
import os

# --- init ---
load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supa: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next dev origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- models matching your table columns ---
class CourseworkIn(BaseModel):
    title: str
    course: str | None = None
    strictness: str = Field(default="flexible", pattern="^(strict|flexible)$")
    est_hours: float = 1
    min_session_minutes: int = 30
    max_session_minutes: int = 120
    deadline_at: str | None = None      # ISO like "2025-10-24T12:00:00Z"
    status: str = "open"                # optional; default in DB is 'open'
    uncertainty: float = 0.2            # optional; default in DB is 0.2

@app.get("/health")
def health():
    try:
        supa.table("coursework").select("id").limit(1).execute()
        return {"ok": True, "db_connected": True}
    except Exception as e:
        return {"ok": False, "error": str(e)}

@app.post("/coursework")
def add_coursework(body: CourseworkIn):
    # Insert into Supabase and return inserted row
    res = supa.table("coursework").insert(body.model_dump()).execute()
    return {"inserted": res.data[0] if res.data else None}
