import { supabase } from "../../lib/supabaseClient";
import CalendarClient from "./ClientCalendar";

interface CustomEvent {
  title: string;
  start: string; 
  end: string;
  type: string;
  description?: string;
  strictness?: boolean;
}

export default async function CalendarPage() {
  // Fetch events from Supabase
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("start", { ascending: true });

  if (error) {
    console.error(error);
  }

  // map dates to strings
  const events: CustomEvent[] =
    data?.map((e: any) => ({
      title: e.title,
      start: e.start,
      end: e.end,
      type: e.type,
      description: e.description,
      strictness: e.strictness,
    })) || [];

  return <CalendarClient initialEvents={events} />;
}