"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

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

  const durationHrs =
    (new Date(data.endISO).getTime() - new Date(data.startISO).getTime()) /
    (1000 * 60 * 60);

  const handleToggleCompleted = async () => {
  const next = !checked;
  setChecked(next);
  if (!next) return;

  try {
    setSaving(true);

    // 1) Try delete by the triple key directly.
    // NOTE: no .select("id") because this table has no id column.
    const { error: delErr1, count } = await supabase
      .from(tableName)
      .delete({ count: "exact" })                // ask for affected count
      .eq("taskid", data.id)
      .eq("time_start", data.startISO)
      .eq("time_end", data.endISO);

      let deleted = typeof count === "number" ? count > 0 : false;
     if (!delErr1 && !deleted) {
      // 1b) Fallback: find the closest matching row by window, then delete using
      // the server's exact timestamps (avoids precision/timezone mismatch).
      const startIso = new Date(data.startISO).toISOString();
      const endIso   = new Date(data.endISO).toISOString();

      const { data: candidates, error: findErr } = await supabase
        .from(tableName)
        .select("taskid,time_start,time_end")
        .eq("taskid", data.id)
        .gte("time_start", startIso)
        .lte("time_end", endIso)
        .order("time_start", { ascending: true })
        .limit(1);

      if (findErr) throw findErr;

if (candidates && candidates.length > 0) {
        const serverStart = candidates[0].time_start;
        const serverEnd   = candidates[0].time_end;

        const { error: delErr2, count: count2 } = await supabase
          .from(tableName)
          .delete({ count: "exact" })
          .eq("taskid", data.id)
          .eq("time_start", serverStart)
          .eq("time_end", serverEnd);

        if (delErr2) throw delErr2;
        deleted = typeof count2 === "number" ? count2 > 0 : false;
      }
    }
  if (!deleted) {
      console.warn("AI block not found/deleted on server; aborting progress update.");
      // Still close UI to avoid a stuck checkbox; remove this line if you prefer
      onClose();
      return;
    }     
      // 2) Subtract block duration from coursework.est_hours
      const { data: cwData, error: fetchErr } = await supabase
        .from("coursework")
        .select("est_hours")
        .eq("id", data.id)
        .single();
      if (fetchErr) throw fetchErr;

      const newEst = Math.max(0, Number(cwData?.est_hours ?? 0) - durationHrs);

      const { error: updErr } = await supabase
        .from("coursework")
        .update({ est_hours: newEst })
        .eq("id", data.id);
      if (updErr) throw updErr;

      // 3) Update UI
      onRemoved(data.id, data.startISO, data.endISO);
      onClose();
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
