import { supabase } from "@/lib/supabaseClient";
import DashboardClient from "./DashboardClient";

type TaskCard = {
  uuid: string;
  title: string;
  description?: string;
  est_hours: number;
  deadline: string;
  created_at: string;
  updated_at?: string;
  strictness: boolean;
  type: "work" | "event";
  location?: string;
};

export default async function DashboardPage() {
  // ✅ Fetch data from Supabase
  const { data: cw, error: cwError } = await supabase
    .from("coursework")
    .select("*");

  const { data: ev, error: evError } = await supabase
    .from("events")
    .select("*");

  if (cwError) console.error("❌ Error fetching coursework:", cwError);
  if (evError) console.error("❌ Error fetching events:", evError);

  // ✅ Format Coursework
  const cwTasks: TaskCard[] = (cw ?? []).map((c: any) => ({
    uuid: c.id,
    title: c.title ?? "Untitled coursework",
    description: c.description ?? "",
    est_hours: Number(c.est_hours ?? 0),
    deadline: c.deadline_at ?? c.created_at,
    created_at: c.created_at,
    updated_at: c.updated_at,
    strictness: !!c.strictness,
    type: "work",
  }));

  // ✅ Format Events
  const evTasks: TaskCard[] = (ev ?? []).map((e: any) => ({
    uuid: e.id,
    title: e.title ?? "Event",
    description: e.description ?? "",
    est_hours: 0,
    deadline: e.start_at ?? e.created_at,
    created_at: e.created_at ?? e.start_at,
    strictness: false,
    type: "event",
    location: e.location ?? "",
  }));

  const allTasks: TaskCard[] = [...cwTasks, ...evTasks];

  // ✅ Pass to Client Component
  return <DashboardClient initialTasks={allTasks} />;
}
