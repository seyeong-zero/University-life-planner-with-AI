"use client";

import { useState } from "react";
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  Event as BigEvent,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enGB } from "date-fns/locale/en-GB";
import "react-big-calendar/lib/css/react-big-calendar.css";
import WorkModal from "../components/WorkModal";
import EventModal from "../components/EventModal";
import CustomToolbar from "../components/CustomToolbar";
import * as workDistr from "../api/workDistr";

interface Props {
  initialEvents: CustomEvent[];
}

export interface CustomEvent extends BigEvent {
  id: string;
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
  const [events] = useState<CustomEvent[]>(
    initialEvents.map((e) => ({
      ...e,
      start: new Date(e.start),
      end: new Date(e.end),
    }))
  );

  // State for modals
  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CustomEvent | null>(null);

  // When clicking on a calendar event
  const handleSelectEvent = (event: CustomEvent) => {
    if (event.type === "Event") {
      setSelectedEvent(event);
      setIsEventModalOpen(true);
    }
    // Optionally handle other types if needed
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[var(--color-c)] p-4 rounded-xl shadow flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Your Calendar</h2>
        <button
          className="px-4 py-2 bg-[var(--color-d)] text-[var(--color-a)] rounded-lg hover:bg-[var(--color-e)] transition"
          onClick={() => setIsWorkModalOpen(true)}
        >
          + Add Task
        </button>

        <button
          className="px-4 py-2 bg-[var(--color-d)] text-[var(--color-a)] rounded-lg hover:bg-[var(--color-e)] transition"
          onClick={() => workDistr.reSchedule()}
        >
          Booty Call Gemi
        </button>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl shadow border border-[var(--color-c)] overflow-hidden">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          defaultDate={new Date()}
          components={{ toolbar: CustomToolbar }}
          style={{ height: 600 }}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={(event: CustomEvent) => {
            let backgroundColor = "var(--color-b)";
            let textColor = "white";

            if (event.type === "Coursework") backgroundColor = "var(--color-c)";
            else if (event.type === "Exam") backgroundColor = "var(--color-d)";
            else if (event.type === "ai") backgroundColor = "var(--color-a)";
            else if (event.type === "Event") {
              backgroundColor = "var(--color-d)";
              textColor = "var(--color-a)";
            }

            return {
              style: {
                backgroundColor,
                color: textColor,
                borderRadius: "8px",
                border: "none",
                padding: "2px 6px",
                fontWeight: 500,
              },
            };
          }}
        />
      </div>

      {/* Work Modal */}
      <WorkModal
        isOpen={isWorkModalOpen}
        onClose={() => setIsWorkModalOpen(false)}
      />

      {/* Event Modal */}
      {selectedEvent && (
        <EventModal
          isOpen={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          event={selectedEvent}
        />
      )}
    </div>
  );
}
