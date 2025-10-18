"use client";

import { useState } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enGB } from "date-fns/locale/en-GB";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventModal from "../components/EventModal";

interface Props {
  initialEvents: CustomEvent[];
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
    const [events, setEvents] = useState<CustomEvent[]>(initialEvents || []);
    const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-[var(--color-c)] p-4 rounded-xl shadow flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Your Calendar</h2>
        <button
          className="px-4 py-2 bg-[var(--color-d)] text-[var(--color-a)] rounded-lg hover:bg-[var(--color-e)] transition"
          onClick={() => setIsModalOpen(true)}
        >
          + Add Task
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border border-[var(--color-c)] overflow-hidden">
        <BigCalendar
          localizer={localizer}
          events={events as any}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
        />
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}