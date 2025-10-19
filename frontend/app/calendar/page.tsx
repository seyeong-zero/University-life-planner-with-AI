import { supabase } from "../../lib/supabaseClient";
import CalendarClient from "./ClientCalendar";

interface TaskEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: string;
  description: string;
  strictness: boolean;
  est_hours?: number;
}

export default async function CalendarPage() {
  const { data: cw, error: cwerror } = await supabase
    .from("coursework")
    .select("*")
    .order("deadline", { ascending: true });

  if (cwerror) console.error("Error fetching coursework:", cwerror);

  const { data: ev, error: everror } = await supabase
    .from("events")
    .select("*");

  if (everror) console.error("Error fetching events:", everror);

  const courseworkEvents: TaskEvent[] = (cw || []).map((e) => ({
    id: `cw-${e.id}`,
    title: e.title,
    start: new Date(e.deadline),
    end: new Date(e.deadline),
    description: e.description,
    type: "Work",
    strictness: e.strictness,
    est_hours: Number(e.est_hours ?? 0),
  }));

  const uniEvents: TaskEvent[] = (ev || []).map((e) => ({
    id:`ev-${e.id}`,
    title: e.title,
    start: new Date(e.start_at),
    end: new Date(e.end_at),
    description: e.description || "",
    type: "Event",
    strictness: false,
  }));

  const { data: ai, error: aiError } = await supabase.from("work_distribution").select("*");
  const { data: csw, error: cwError } = await supabase.from("coursework").select("*");

  // Use empty array if csw is null
  const cwMap = new Map((csw || []).map(c => [c.id, c.title]));

  // Map AI events
  const aiEvents: TaskEvent[] = (ai || []).map(e => ({
    id: e.taskid,
    title: cwMap.get(e.taskid) || "Untitled",
    start: new Date(e.time_start),
    end: new Date(e.time_end),
    description: e.description || "",
    type: "AI Task",
    strictness: false,
  }));

  const allEvents = [...courseworkEvents, ...uniEvents, ...aiEvents];

  if (process.env.NODE_ENV === "development") {
    console.log("Events from Supabase:", allEvents);
  }

  return <CalendarClient initialEvents={allEvents} />;
}
