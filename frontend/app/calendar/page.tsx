import { supabase } from "../../lib/supabaseClient";
import CalendarClient from "./ClientCalendar";

interface TaskEvent {
  title: string;
  deadline: string;          
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
  const events: TaskEvent[] =
    data?.map((e: any) => ({
      title: e.title,
      type: e.type,
      start: e.start,
      deadline:e.string,
      description: e.description,
      strictness: e.strictness,
    })) || [];

  return <CalendarClient initialEvents={events as any[]} />;
}