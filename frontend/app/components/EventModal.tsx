"use client";

import React from "react";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (event: { title: string; start: string; end: string }) => void;
}

export default function AddEventModal({
  isOpen,
  onClose,
  onAddEvent,
}: AddEventModalProps) {
  const [form, setForm] = React.useState({
    title: "",
    start: "",
    end: "",
  });

  const handleSubmit = () => {
    if (!form.title || !form.start || !form.end) {
      alert("Please fill in all fields!");
      return;
    }
    onAddEvent(form);
    setForm({ title: "", start: "", end: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[var(--color-a)] rounded-2xl shadow-xl p-6 w-full max-w-md space-y-4">
        <h3 className="text-xl font-semibold text-[var(--color-e)]">
          Add New Task
        </h3>

        <input
          type="text"
          placeholder="Task title"
          className="w-full p-2 rounded-lg border border-[var(--color-c)] focus:outline-none focus:ring-2 focus:ring-[var(--color-b)]"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          type="datetime-local"
          className="w-full p-2 rounded-lg border border-[var(--color-c)] focus:outline-none focus:ring-2 focus:ring-[var(--color-b)]"
          value={form.start}
          onChange={(e) => setForm({ ...form, start: e.target.value })}
        />
        <input
          type="datetime-local"
          className="w-full p-2 rounded-lg border border-[var(--color-c)] focus:outline-none focus:ring-2 focus:ring-[var(--color-b)]"
          value={form.end}
          onChange={(e) => setForm({ ...form, end: e.target.value })}
        />

        <div className="flex justify-end gap-2 pt-2">
          <button
            className="px-4 py-2 rounded-lg bg-[var(--color-c)] text-white hover:bg-[var(--color-b)] transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-[var(--color-d)] text-[var(--color-a)] hover:bg-[var(--color-e)] transition"
            onClick={handleSubmit}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}