"use client";

import { useState, useMemo } from "react";
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  Event as BigEvent,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enGB } from "date-fns/locale/en-GB";
import "react-big-calendar/lib/css/react-big-calendar.css";

import EventModal from "../components/WorkModal";
import CustomToolbar from "../components/CustomToolbar";
import ViewTaskCard from "../components/ViewTaskCard";   // coursework/event popup
import AIBlockCard from "../components/AIBlockCard";     // AI popup

interface Props {
  initialEvents: CustomEvent[];
}

export interface CustomEvent extends BigEvent {
  id: string;            // coursework: "cw-..." | event: "ev-..." | AI: taskid (uuid)
  title: string;
  start: Date | string;  // we normalize to Date below
  end: Date | string;
  type: string;          // "Coursework" | "Event" | "AI Task"
  description?: string;
  strictness?: boolean;
  // page.tsx does not give deadlineISO/startISO/endISO; we derive from start/end
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
  // normalize dates, keep original ids
  const [events, setEvents] = useState<CustomEvent[]>(
    initialEvents.map((e) => ({
      ...e,
      id: String(e.id),
      start: new Date(e.start),
      end: new Date(e.end),
    }))
  );

  const [isAddOpen, setIsAddOpen] = useState(false);

  // which popup to show
  const [selectedTask, setSelectedTask] = useState<CustomEvent | null>(null);
  const [selectedAI, setSelectedAI] = useState<CustomEvent | null>(null);

  // remove ONLY the clicked AI session (AI ids are taskid, not unique per row)
  const removeAISession = (taskid: string, startISO: string, endISO: string) => {
    const s = new Date(startISO).getTime();
    const e = new Date(endISO).getTime();
    setEvents((prev) =>
      prev.filter(
        (ev) =>
          !(
            ev.type === "AI Task" &&
            ev.id === taskid &&
            (ev.start as Date).getTime() === s &&
            (ev.end as Date).getTime() === e
          )
      )
    );
  };

  // just to verify what types we have
  useMemo(() => {
    console.log("[Calendar types]", Array.from(new Set(events.map((e) => e.type))));
  }, [events]);

  return (
    <div className="space-y-6">
      <div className="bg-[var(--color-c)] p-4 rounded-xl shadow flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Your Calendar</h2>
        <button
          className="px-4 py-2 bg-[var(--color-d)] text-[var(--color-a)] rounded-lg hover:bg-[var(--color-e)] transition"
          onClick={() => setIsAddOpen(true)}
        >
          + Add Task
        </button>
      </div>

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
          onSelectEvent={(evt) => {
            const e = evt as CustomEvent;
            const t = (e.type || "").toLowerCase();
            if (t === "ai task") {
              setSelectedAI(e);      // open AI popup
            } else {
              setSelectedTask(e);    // open coursework/event popup
            }
          }}
          eventPropGetter={(event: CustomEvent) => {
            const t = (event.type || "").toLowerCase();
            let bg = "var(--color-b)";
            let color = "white";
            if (t === "coursework") bg = "var(--color-c)";
            else if (t === "event") { bg = "var(--color-d)"; color = "var(--color-a)"; }
            else if (t === "ai task") bg = "var(--color-a)";
            return {
              style: {
                backgroundColor: bg,
                color,
                borderRadius: "8px",
                border: "none",
                padding: "2px 6px",
                fontWeight: 500,
              },
            };
          }}
        />
      </div>

      {/* your "Add Task" form */}
      <EventModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />

      {/* Coursework / Event read-only popup */}
      <ViewTaskCard
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        data={
          selectedTask
            ? {
                id: selectedTask.id,
                title: selectedTask.title,
                description: selectedTask.description,
                // show deadline as the event start (what page.tsx provided)
                deadlineISO: (selectedTask.start as Date).toISOString(),
                est_hours: (selectedTask as any).est_hours,
              }
            : undefined
        }
      />

      {/* AI Study Block popup */}
      <AIBlockCard
        open={!!selectedAI}
        onClose={() => setSelectedAI(null)}
        onRemoved={(/* id */) => {
          // Remove only this clicked block using (taskid + start + end)
          if (!selectedAI) return;
          removeAISession(
            selectedAI.id, // taskid
            (selectedAI.start as Date).toISOString(),
            (selectedAI.end as Date).toISOString()
          );
        }}
        data={
          selectedAI
            ? {
                // IMPORTANT: AI "id" here is the taskid (from page.tsx)
                id: selectedAI.id,
                title: selectedAI.title,
                description: selectedAI.description,
                startISO: (selectedAI.start as Date).toISOString(),
                endISO: (selectedAI.end as Date).toISOString(),
              }
            : undefined
        }
        // If your AI table is named "work_distribution", set it here:
        tableName="work_distribution"
      />
    </div>
  );
}
