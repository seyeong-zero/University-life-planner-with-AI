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

  const { data, error } = await supabase
    .from("coursework")
    .select("*")
    .order("deadline", { ascending: true });

  if (error) {
    console.error()
  }

  // map dates to strings
  const events: TaskEvent[] = (data || []).map(e => ({
    title: e.title,
    start: new Date(e.deadline),
    end: new Date(e.deadline),
    description: e.description,
    type: e.type,
    strictness: e.strictness,
  }));

  return <CalendarClient initialEvents={events as any} />;
}

