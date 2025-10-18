
import React from "react";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (event: {
    title: string;
    type: string;
    description: string;
    deadline: string;
    estimatedTime: number;
    strictness: boolean;
  }) => void;
}


export default function EventModal({
  isOpen,
  onClose,
  onAddEvent,
}: EventModalProps) {
  const [form, setForm] = React.useState({
    title: "",
    type: "",
    description: "",
    deadline: "",
    estimatedTime: 1,
    strictness: false,
  });

  const handleSubmit = () => {
    if (!form.title || !form.type || !form.deadline || !form.estimatedTime) {
      alert("Please fill in all required fields!");
      return;
    }
    onAddEvent(form);
    setForm({
      title: "",
      type: "",
      description: "",
      deadline: "",
      estimatedTime: 1,
      strictness: false,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[var(--color-a)] rounded-2xl shadow-xl p-6 w-full max-w-md space-y-4">
        <h3 className="text-xl font-semibold text-[var(--color-e)]">
          Add New Task
        </h3>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-e)] mb-1">
            Title
          </label>
          <input
            type="text"
            placeholder="Task title"
            className="w-full p-2 rounded-lg border border-[var(--color-c)] focus:outline-none focus:ring-2 focus:ring-[var(--color-b)]"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-e)] mb-1">
            Type
          </label>
          <select
            className="w-full p-2 rounded-lg border border-[var(--color-c)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-b)]"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="">Select Task Type</option>
            <option value="Assignment">📚 Assignment</option>
            <option value="Exam">🧠 Exam</option>
            <option value="Meeting">💬 Meeting</option>
            <option value="Personal">🌸 Personal</option>
            <option value="Other">✨ Other</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-e)] mb-1">
            Description
          </label>
          <textarea
            placeholder="Add some details about this task..."
            className="w-full p-2 rounded-lg border border-[var(--color-c)] focus:outline-none focus:ring-2 focus:ring-[var(--color-b)]"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-e)] mb-1">
            Deadline
          </label>
          <input
            type="datetime-local"
            className="w-full p-2 rounded-lg border border-[var(--color-c)] focus:outline-none focus:ring-2 focus:ring-[var(--color-b)]"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          />
        </div>

        {/* Estimated Time */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-e)] mb-1">
            Estimated Time (hours)
          </label>
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
        </div>

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
            onClick={handleSubmit}
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}