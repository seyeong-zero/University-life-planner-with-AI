
import React from "react";
import { supabase } from "@/lib/supabaseClient";
import * as workDistr from "./../api/workDistr";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EventModal({
    isOpen,
    onClose,
  }: EventModalProps) {
  const [form, setForm] = React.useState({
    title: "",
    type: "",
    description: "",
    deadline: "",
    estimatedTime: 1,
    strictness: false,
  });

  const handleAddEvent = async () => {
    // Insert into Supabase
    const { data, error } = await supabase.from("coursework").insert([
      {
        title: form.title,
        type: form.type,
        description: form.description,
        deadline: form.deadline,
        est_hours: form.estimatedTime,
        strictness: form.strictness,
      },
    ]);

    // Call api to get work distribution
    workDistr.test()

    if (error) {
      console.error("Error inserting event:", error);
    } else {
      console.log("Event inserted:", data);
      setForm({
        title: "",
        type: "",
        description: "",
        deadline: "",
        estimatedTime: 1,
        strictness: false,
      });

    }
  };

  if (!isOpen) return null;

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

        {/* Type */}
        <select
          className="w-full p-2 rounded-lg border border-[var(--color-c)] focus:outline-none focus:ring-2 focus:ring-[var(--color-b)]"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="">Select Task Type</option>
          <option value="Work">Work</option>
          <option value="Exam">Exam</option>
          <option value="Event">Event</option>
        </select>

        {/* Description */}
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

        {/* Strictness Toggle */}
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

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <button
            className="px-4 py-2 rounded-lg bg-[var(--color-c)] text-white hover:bg-[var(--color-b)] transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-[var(--color-d)] text-[var(--color-a)] hover:bg-[var(--color-e)] transition"
            onClick={handleAddEvent}
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}