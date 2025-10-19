"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import * as workDistr from "../api/workDistr";
type Props = {
  open: boolean;
  onClose: () => void;
  onRemoved: (taskid: string, startISO: string, endISO: string) => void;
  data?: {
    id: string;           // coursework.id (taskid)
    title: string;
    description?: string;
    startISO: string;     // work_distribution.time_start
    endISO: string;       // work_distribution.time_end
  };
  tableName?: string;     // default "work_distribution"
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

  // Duration of this AI session (in hours)
  const durationHrs =
    (new Date(data.endISO).getTime() - new Date(data.startISO).getTime()) /
    (1000 * 60 * 60);

  const handleToggleCompleted = async () => {
    const next = !checked;
    setChecked(next);
    if (!next) return;

    try {
      setSaving(true);

      // 1️⃣ Delete this AI block from work_distribution
      const { error: delErr } = await supabase
        .from(tableName)
        .delete()
        .eq("taskid", data.id)
        .eq("time_start", data.startISO)
        .eq("time_end", data.endISO);

      if (delErr) throw delErr;

      // 2️⃣ Fetch the current logged hours from coursework
      const { data: cwData, error: fetchErr } = await supabase
        .from("coursework")
        .select("hours")
        .eq("id", data.id)
        .single();

      if (fetchErr) throw fetchErr;

      const currentHours = Number(cwData?.hours ?? 0);
      const newHours = currentHours + durationHrs;

      // 3️⃣ Update coursework.hours with the added session hours
      const { error: updErr } = await supabase
        .from("coursework")
        .update({ hours: newHours })
        .eq("id", data.id);

      if (updErr) throw updErr;

      // 4️⃣ Remove the AI block visually from the calendar
      onRemoved(data.id, data.startISO, data.endISO);
      onClose();
      workDistr.reSchedule()
    } catch (e) {
      console.error(e);
      alert("Could not complete & remove this AI session.");
      setChecked(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[var(--color-a)] rounded-2xl shadow-xl p-6 w-full max-w-2xl space-y-4">
        <h3 className="text-2xl font-semibold text-[var(--color-e)]">{data.title}</h3>

        <div className="text-[var(--color-e)] space-y-1">
          <p><span className="font-semibold">Start:</span> {fmt(data.startISO)}</p>
          <p><span className="font-semibold">End:</span> {fmt(data.endISO)}</p>
          <p><span className="font-semibold">Duration:</span> {durationHrs.toFixed(1)} h</p>
        </div>

        {data.description && (
          <p className="text-[var(--color-e)]/90 whitespace-pre-wrap">{data.description}</p>
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
