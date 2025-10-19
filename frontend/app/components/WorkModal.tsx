"use client";
import React from "react";
import { supabase } from "@/lib/supabaseClient";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TaskType = "" | "Work" | "Exam" | "Event";

const initialForm = {
  title: "",
  type: "" as TaskType,
  description: "",
  // coursework fields
  deadline: "",
  estimatedTime: 1,
  strictness: false,
  // event fields
  start_at: "",
  end_at: "",
  location: "",  
};

export default function EventModal({ isOpen, onClose }: EventModalProps) {
  const [form, setForm] = React.useState(initialForm);
  const [saving, setSaving] = React.useState(false);

  if (!isOpen) return null;

  const toISO = (v: string) => (v ? new Date(v).toISOString() : null);

  const handleAdd = async () => {
    try {
      setSaving(true);

      if (form.type === "Event") {
        // minimal validation
        const startISO = toISO(form.start_at || form.deadline);
        const endISO = toISO(form.end_at);
        if (!startISO || !endISO) {
          alert("Please provide both start and end time for the event.");
          return;
        }
        if (new Date(startISO) >= new Date(endISO)) {
          alert("Event end time must be after start time.");
          return;
        }

        const { data, error } = await supabase.from("events").insert([
          {
            title: form.title,
            start_at: startISO,
            end_at: endISO,
            category: form.category || "other",
            // created_at default is now()
          },
        ]);

        if (error) throw error;
        console.log("Event inserted:", data);
      } else {
        // Treat Work/Exam as coursework
        const deadlineISO = toISO(form.deadline);
        const { data, error } = await supabase.from("coursework").insert([
          {
            title: form.title,
            est_hours: form.estimatedTime,
            deadline_at: deadlineISO, // nullable allowed
            strictness: !!form.strictness, // bool
            // other columns use table defaults
          },
        ]);

        if (error) throw error;
        console.log("Coursework inserted:", data);
      }

      // reset and close
      setForm(initialForm);
      onClose();
    } catch (err) {
      console.error("Insert failed:", err);
      alert("Could not save. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  const isEvent = form.type === "Event";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[var(--color-a)] rounded-2xl shadow-xl p-6 w-full max-w-md space-y-4">
        <h3 className="text-xl font-semibold text-[var(--color-e)]">
          Add New Task
        </h3>

        {/* Title */}
        <input
          type="text"
          placeholder="Task title"
          className="w-full p-2 rounded-lg border border-[var(--color-c)] focus:outline-none focus:ring-2 focus:ring-[var(--color-b)]"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        {/* Type (also acts as event category when Event) */}
        <select
          className="w-full p-2 rounded-lg border border-[var(--color-c)] focus:outline-none focus:ring-2 focus:ring-[var(--color-b)]"
          value={form.type}
          onChange={(e) =>
            setForm({
              ...form,
              type: e.target.value as TaskType,
              // light reset of time fields when switching
              start_at: "",
              end_at: "",
            })
          }
        >
          <option value="">Select Task Type</option>
          <option value="Work">Work</option>
          <option value="Exam">Exam</option>
          <option value="Event">Event</option>
        </select>

        {/* Description (not stored yet, kept for UX; safe to keep) */}
        <textarea
          placeholder="Task description"
          className="w-full p-2 rounded-lg border border-[var(--color-c)] focus:outline-none focus:ring-2 focus:ring-[var(--color-b)]"
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {/* Deadline */}
        <input
          type="datetime-local"
          className="w-full p-2 rounded-lg border border-[var(--color-c)] focus:outline-none focus:ring-2 focus:ring-[var(--color-b)]"
          value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
        />

        {/* Estimated Completion Time */}
        <input
          type="number"
          min={0.5}
          step={0.5}
          className="w-full p-2 rounded-lg border border-[var(--color-c)] focus:outline-none focus:ring-2 focus:ring-[var(--color-b)]"
          value={form.estimatedTime}
          onChange={(e) =>
            setForm({ ...form, estimatedTime: parseFloat(e.target.value) })
          }
        />

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[var(--color-e)]">
                Strict Mode
              </label>
              <button
                type="button"
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-all ${
                  form.strictness ? "bg-[var(--color-d)]" : "bg-[var(--color-c)]"
                }`}
                onClick={() =>
                  setForm((prev) => ({ ...prev, strictness: !prev.strictness }))
                }
              >
                <span
                  className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                    form.strictness ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <button
            className="px-4 py-2 rounded-lg bg-[var(--color-c)] text-white hover:bg-[var(--color-b)] transition"
            onClick={() => {
              setForm(initialForm);
              onClose();
            }}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-[var(--color-d)] text-[var(--color-a)] hover:bg-[var(--color-e)] transition"
            onClick={handleAdd}
            disabled={saving}
          >
            {saving ? "Saving..." : "Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
