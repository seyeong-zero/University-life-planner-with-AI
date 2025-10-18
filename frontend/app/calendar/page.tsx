"use client";

import { useState } from "react";
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  Event,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enGB } from "date-fns/locale/en-GB";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { "en-GB": enGB };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([
    {
      title: "CS Assignment Due",
      start: new Date(2025, 9, 20, 10, 0),
      end: new Date(2025, 9, 20, 12, 0),
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-cream p-4 rounded-xl shadow flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-black">
           Your Calendar
        </h2>
        <button
          className="px-4 py-2 bg-raspberry text-black rounded-lg hover:bg-mauve transition"
          onClick={() => alert("Add new task modal coming soon!")}
        >
          + Add Task
        </button>
      </div>

      <div className="bg-white border-bluegrey border-3 rounded-xl shadow overflow-hidden">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          className="custom-calendar"
        />
      </div>
    </div>
  );
}