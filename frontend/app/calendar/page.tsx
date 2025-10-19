import { supabase } from "../../lib/supabaseClient";
import CalendarClient from "./ClientCalendar";

interface TaskEvent {
  title: string;
  start: Date;
  end: Date;
  type: string;
  description: string;
  strictness: boolean;
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
    title: e.title,
    start: new Date(e.deadline),
    end: new Date(e.deadline),
    description: e.description,
    type: "Coursework",
    strictness: e.strictness,
  }));

  const uniEvents: TaskEvent[] = (ev || []).map((e) => ({
    title: e.title,
    start: new Date(e.start_at),
    end: new Date(e.end_at),
    description: e.description || "",
    type: "Event",
    strictness: false,
  }));

  const allEvents = [...courseworkEvents, ...uniEvents];

  if (process.env.NODE_ENV === "development") {
    console.log("Events from Supabase:", allEvents);
  }

  return <CalendarClient initialEvents={allEvents} />;
}