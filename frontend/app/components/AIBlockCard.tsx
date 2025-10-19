"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  open: boolean;
  onClose: () => void;
  onRemoved: (id: string) => void;
  // Pass the AI block row
  data?: {
    id: string;              // uuid of the AI block row
    title: string;           // e.g. "Study: Algorithms"
    description?: string;    // optional
    startISO: string;        // ISO timestamp
    endISO: string;          // ISO timestamp
  };
  tableName?: string;        // default "scheduled_blocks" – change if yours differs
};

export default function AIBlockCard({
  open,
  onClose,
  onRemoved,
  data,
  tableName = "work_distribution",
}: Props) {
  const [checked, setChecked] = useState(false);
  const [saving, setSaving] = useState(false);
  if (!open || !data) return null;

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    });

  const durationHrs = Math.max(
    0,
    (new Date(data.endISO).getTime() - new Date(data.startISO).getTime()) /
      (1000 * 60 * 60)
  );

  const handleToggleCompleted = async () => {
    const next = !checked;
    setChecked(next);
    if (!next) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq("id", data.id);

      if (error) throw error;

      onRemoved(data.id); // remove from calendar UI
      onClose();
    } catch (e) {
      console.error(e);
      alert("Could not remove this AI session.");
      setChecked(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[var(--color-a)] rounded-2xl shadow-xl p-6 w-full max-w-2xl space-y-4">
        <h3 className="text-2xl font-semibold text-[var(--color-e)]">
          {data.title}
        </h3>

        <div className="text-[var(--color-e)] space-y-1">
          <p>
            <span className="font-semibold">Start:</span> {fmt(data.startISO)}
          </p>
          <p>
            <span className="font-semibold">End:</span> {fmt(data.endISO)}
          </p>
          <p>
            <span className="font-semibold">Duration:</span>{" "}
            {durationHrs.toFixed(1)} h
          </p>
        </div>

        {data.description && (
          <p className="text-[var(--color-e)]/90 whitespace-pre-wrap">
            {data.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 text-[var(--color-e)] font-medium">
            <input
              type="checkbox"
              checked={checked}
              onChange={handleToggleCompleted}
              disabled={saving}
            />
            Mark Completed (remove)
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
