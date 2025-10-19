import { supabase } from "@/lib/supabaseClient";
import DashboardClient from "./DashboardClient";

type TaskCard = {
  uuid: string;
  title: string;
  est_hours: number;
  hours: number; 
  deadline: string;
  created_at: string;
  strictness: boolean;
  type: "work" | "event" | "ai";
};

export default async function DashboardPage() {
 
  const { data: cw, error: cwError } = await supabase
    .from("coursework")
    .select("*")
    .order("deadline", { ascending: true });

  if (cwError) console.error(" Error fetching coursework:", cwError);

 
  const { data: ev, error: evError } = await supabase.from("events").select("*");
  if (evError) console.error(" Error fetching events:", evError);

  const { data: ai, error: aiError } = await supabase.from("work_distribution").select("*");
  if (aiError) console.error("Error fetching AI tasks:", aiError);


  const cwTasks: TaskCard[] = (cw ?? []).map((c: any) => ({
    uuid: `cw-${c.id}`,
    title: c.title ?? "Untitled Coursework",
    est_hours: Number(c.est_hours ?? 0),
    hours: Number(c.hours ?? 0), 
    deadline: c.deadline ?? c.created_at,
    created_at: c.created_at,
    strictness: !!c.strictness,
    type: "work",
  }));


  const evTasks: TaskCard[] = (ev ?? []).map((e: any) => ({
    uuid: `ev-${e.id}`,
    title: e.title ?? "Event",
    est_hours: 0,
    hours: 0,
    deadline: e.start_at ?? e.created_at,
    created_at: e.created_at ?? e.start_at,
    strictness: false,
    type: "event",
  }));


  const aiTasks: TaskCard[] = (ai ?? []).map((a: any) => ({
    uuid: `ai-${a.taskid}`,
    title: `AI Task for ${a.taskid}`,
    est_hours: Number(a.hours_required ?? 0),
    hours: Number(a.hours_completed ?? 0),
    deadline: a.time_end,
    created_at: a.time_start,
    strictness: false,
    type: "ai",
  }));


  const allTasks: TaskCard[] = [...cwTasks, ...evTasks, ...aiTasks];


  return <DashboardClient initialTasks={allTasks} />;
}

