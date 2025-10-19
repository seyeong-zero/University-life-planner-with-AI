"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  open: boolean;
  onClose: () => void;
  data?: {
    id: string;                 // can be "cw-<uuid>" or "<uuid>"
    title: string;
    deadlineISO?: string;       // ISO string
    description?: string;
    est_hours?: number;
    hours?: number;             // completed hours column
  };
  onCompleted?: (id: string) => void; // parent removes from calendar
};

export default function ViewTaskCard({ open, onClose, data, onCompleted }: Props) {
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
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

  const handleToggle = async () => {
    const next = !completed;
    setCompleted(next);
    if (!next) return;

    try {
      setSaving(true);

      // If ids are like "cw-<uuid>", strip the prefix for DB delete
      const uuid = data.id.startsWith("cw-") ? data.id.slice(3) : data.id;

      const { error } = await supabase
        .from("coursework")
        .delete()
        .eq("id", uuid);

      if (error) throw error;

      // Tell parent to remove this from the calendar and close
      onCompleted?.(data.id);
      onClose();
    } catch (e) {
      console.error(e);
      alert("Could not delete this task. Please try again.");
      setCompleted(false);
    } finally {
      setSaving(false);
    }
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

        {typeof data.est_hours === "number" && (
          <p className="text-[var(--color-e)] mb-2">
            <span className="font-semibold">Estimated hours:</span>{" "}
            {Number.isFinite(data.est_hours) ? data.est_hours : "—"}
          </p>
        )}

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
            <input
              type="checkbox"
              checked={completed}
              onChange={handleToggle}
              disabled={saving}
            />
            Fully Completed
          </label>

          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-[var(--color-d)] text-[var(--color-a)] hover:bg-[var(--color-e)] transition disabled:opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
