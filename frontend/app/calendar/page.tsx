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
  // Fetch events from Supabase
  const { data, error } = await supabase
    .from("coursework")
    .select("*")
    .order("start", { ascending: true });

  if (error) {
    console.error(error);
  }

  // map dates to strings
  const events: TaskEvent[] =
    data?.map((e: any) => ({
      title: e.title,
      start: e.start,
      deadline:e.string,
      description: e.description,
      strictness: e.strictness,
    })) || [];

  return <CalendarClient initialEvents={events as any[]} />;
}