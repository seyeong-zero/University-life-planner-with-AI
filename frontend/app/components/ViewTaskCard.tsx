"use client";
import React, { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  data?: {
    id: string;
    title: string;
    deadlineISO?: string;   // ISO string
    description?: string;
    est_hours?: number;
    hours?: number;
  
  };
  onCompleted?: (id: string) => void; // optional – wire to delete later
};

export default function ViewTaskCard({ open, onClose, data, onCompleted }: Props) {
  const [completed, setCompleted] = useState(false);
  if (!open || !data) return null;

  const fmt = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleString("en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "UTC",
        })
      : "—";

  const handleToggle = () => {
    const next = !completed;
    setCompleted(next);
    if (next && onCompleted) onCompleted(data.id);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[var(--color-a)] rounded-2xl shadow-xl p-6 w-full max-w-2xl">
        <h3 className="text-2xl font-semibold text-[var(--color-e)] mb-4">
          {data.title}
        </h3>

        <p className="text-[var(--color-e)] mb-2">
          <span className="font-semibold">Deadline:</span> {fmt(data.deadlineISO)}
        </p>
       
         
        {typeof data.est_hours === "number" ? (
  <p className="text-[var(--color-e)] mb-2">
    <span className="font-semibold">Estimated hours:</span>{" "}
    {Number.isFinite(data.est_hours) ? data.est_hours : "—"}
  </p>
) : null}

      {typeof data.hours === "number" && (
          <p className="text-[var(--color-e)] mb-4">
            <span className="font-semibold">Hours completed:</span>{" "}
            {Number.isFinite(data.hours) ? data.hours : "—"}
          </p>
        )}


        {data.description && (
          <p className="text-[var(--color-e)]/90 whitespace-pre-wrap mb-4">
            {data.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-4">
          <label className="flex items-center gap-2 text-[var(--color-e)] font-medium">
            <input type="checkbox" checked={completed} onChange={handleToggle} />
            Fully Completed
          </label>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[var(--color-d)] text-[var(--color-a)] hover:bg-[var(--color-e)] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
