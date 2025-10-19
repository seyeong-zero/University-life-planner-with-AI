"use client";

import { useState } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer, Event as BigEvent } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enGB } from "date-fns/locale/en-GB";
import "react-big-calendar/lib/css/react-big-calendar.css";
import WorkModal from "../components/WorkModal";
import CustomToolbar from "../components/CustomToolbar";
import * as workDistr from "./../api/workDistr";

interface Props {
  initialEvents: CustomEvent[];
}

export interface CustomEvent extends BigEvent {
  title: string;
  start: Date;
  end: Date;
  type: string;
  description?: string;
  strictness?: boolean;
}

const locales = { "en-GB": enGB };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function CalendarClient({ initialEvents }: Props) {
  // Ensure start/end are Date objects
  const [events, setEvents] = useState<CustomEvent[]>(
    initialEvents.map((e) => ({
      ...e,
      start: new Date(e.start),
      end: new Date(e.end),
    }))
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[var(--color-c)] p-4 rounded-xl shadow flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Your Calendar</h2>
        <button
          className="px-4 py-2 bg-[var(--color-d)] text-[var(--color-a)] rounded-lg hover:bg-[var(--color-e)] transition"
          onClick={() => setIsModalOpen(true)}
        >
          + Add Task
        </button>

        <button
          className="px-4 py-2 bg-[var(--color-d)] text-[var(--color-a)] rounded-lg hover:bg-[var(--color-e)] transition"
          onClick={() => workDistr.test()}
        >
          Call Gemini
        </button>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl shadow border border-[var(--color-c)] overflow-hidden">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          components={{ toolbar: CustomToolbar }}
          style={{ height: 600 }}
          eventPropGetter={(event: CustomEvent) => {
            let backgroundColor = "var(--color-b)";
            if (event.type === "Work") backgroundColor = "var(--color-c)";
            else if (event.type === "Exam") backgroundColor = "var(--color-d)";
            else if (event.type === "Event") backgroundColor = "var(--color-e)";

            return {
              style: {
                backgroundColor,
                color: "white",
                borderRadius: "8px",
                border: "none",
                padding: "2px 5px",
              },
            };
          }}
        />
      </div>

      {/* Modal */}
      <WorkModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}