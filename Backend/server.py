from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import os

app = FastAPI()

# ✅ CORS (Next.js 접근 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 개발 중 전체 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Gemini API 연결
API_KEY = "AIzaSyBEiKusGv-8XGvTu8xwPVryL_v6ZWPx6SY"  # 여기에 실제 키 입력
genai.configure(api_key=API_KEY)

# ✅ 모델 설정 (정확한 이름 사용)
model = genai.GenerativeModel("gemini-1.5-flash")

@app.get("/")
def root():
    return {"message": "Backend running"}

@app.post("/ask_ai")
async def ask_ai(request: Request):
    try:
        body = await request.json()
        question = body.get("question", "")

        if not question:
            return {"error": "No question provided"}

        # ✅ Gemini 모델 호출
        response = model.generate_content(question)

        # ✅ 응답 안전하게 추출
        answer = None
        if hasattr(response, "text") and response.text:
            answer = response.text
        elif hasattr(response, "candidates"):
            try:
                answer = response.candidates[0].content.parts[0].text
            except Exception:
                answer = None

        if not answer:
            answer = "⚠️ Gemini did not return a response."

        return {"answer": answer}

    except Exception as e:
        print("❌ Gemini Error:", str(e))
        return {"error": str(e)}

