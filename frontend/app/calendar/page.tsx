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
import AddEventModal from "../components/EventModal"; 

const locales = { "en-GB": enGB };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

function CustomToolbar({ label, onNavigate, onView, view }: any) {
  const views = ["month", "week", "day"];

  return (
    <div className="flex flex-wrap items-center justify-between bg-[var(--color-a)] p-4 rounded-t-2xl border-b-2 border-[var(--color-c)] shadow-sm">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigate("PREV")}
          className="px-3 py-1.5 rounded-full bg-[var(--color-c)] text-white hover:bg-[var(--color-b)] transition-all"
        >
          ‹
        </button>
        <span className="text-lg font-semibold text-[var(--color-e)] px-3">
          {label}
        </span>
        <button
          onClick={() => onNavigate("NEXT")}
          className="px-3 py-1.5 rounded-full bg-[var(--color-c)] text-white hover:bg-[var(--color-b)] transition-all"
        >
          ›
        </button>
      </div>

      <div className="flex items-center gap-2 mt-2 sm:mt-0">
        {views.map((v) => (
          <button
            key={v}
            onClick={() => onView(v)}
            className={`px-4 py-2 rounded-full transition-all shadow-sm hover:shadow-md hover:scale-105 ${
              view === v
                ? "bg-[var(--color-d)] text-[var(--color-a)]"
                : "bg-[var(--color-c)] text-white hover:bg-[var(--color-b)]"
            }`}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([
    {
      title: "CS Assignment Due",
      start: new Date(2025, 9, 20, 10, 0),
      end: new Date(2025, 9, 20, 12, 0),
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddEvent = (eventData: { title: string; start: string; end: string }) => {
    setEvents([
      ...events,
      {
        title: eventData.title,
        start: new Date(eventData.start),
        end: new Date(eventData.end),
      },
    ]);
  };

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
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl shadow border border-[var(--color-c)] overflow-hidden">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          components={{
            toolbar: CustomToolbar,
          }}
        />
      </div>

      {/* Modal */}
      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddEvent={handleAddEvent}
      />
    </div>
  );
}