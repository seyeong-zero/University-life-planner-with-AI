"use client"; // Ensures this component runs on the client side in Next.js

import { useMemo, useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react"; // Icons used for UI
import { supabase } from "@/lib/supabaseClient"; // Supabase client for database operations

// -------------------------------
// Type definition for a task card
// -------------------------------
type TaskCard = {
  uuid: string;          // Unique identifier for the task (frontend ID)
  title: string;         // Title or name of the task
  est_hours: number;     // Estimated total hours required for completion
  hours: number;         // Hours already completed
  deadline: string;      // Deadline date/time as an ISO string
  created_at: string;    // Timestamp of task creation
  strictness: boolean;   // Indicates how strict the deadline is (currently unused)
  type: "work" | "event"; // Only two types: coursework tasks and events (AI tasks removed)
};

// -------------------------------
// DashboardClient Component
// -------------------------------
export default function DashboardClient({
  initialTasks,
}: {
  initialTasks: TaskCard[];
}) {
  // State to store all current tasks (coursework + events)
  const [tasks, setTasks] = useState<TaskCard[]>(initialTasks);

  // Used to delay rendering until hydration completes on client side
  const [hydrated, setHydrated] = useState(false);

  // The task currently being edited in the “Add Hours” modal
  const [activeTask, setActiveTask] = useState<TaskCard | null>(null);

  // Controlled input for the number of hours user wants to add
  const [inputHours, setInputHours] = useState("");

  // Ensures hydration flag is set once component is mounted
  useEffect(() => setHydrated(true), []);

  // ----------------------------------------------------
  // Helper function to calculate how many days are left
  // until the given task’s deadline.
  // ----------------------------------------------------
  const calculateDaysLeft = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    return Math.max(
      0,
      Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) // Convert ms → days
    );
  };

  // ----------------------------------------------------
  // Helper function to calculate completion progress (%)
  // ----------------------------------------------------
  const calculateProgress = (hours: number, est_hours: number) => {
    if (!est_hours || est_hours <= 0) return 0;
    return Math.min(100, (hours / est_hours) * 100); // Clamp to 100%
  };

  // ----------------------------------------------------
  // Coursework Tasks (AI tasks have been removed)
  // Sort by deadline (earliest first)
  // ----------------------------------------------------
  const deadlines = useMemo(
    () =>
      tasks
        .filter((t) => t.type === "work")
        .sort(
          (a, b) =>
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        ),
    [tasks]
  );

  // ----------------------------------------------------
  // Events List — also sorted by deadline
  // ----------------------------------------------------
  const events = useMemo(
    () =>
      tasks
        .filter((t) => t.type === "event")
        .sort(
          (a, b) =>
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        ),
    [tasks]
  );

  // ----------------------------------------------------
  // Handle adding new working hours to a coursework task
  // ----------------------------------------------------
  const handleAddHours = async (uuid: string) => {
    const added = parseFloat(inputHours);

    // Validate user input
    if (isNaN(added) || added <= 0) return alert("Please enter valid hours!");

    // Find the task user is updating
    const currentTask = tasks.find((t) => t.uuid === uuid);
    if (!currentTask) return;

    // Calculate new total hours
    const newHours = currentTask.hours + added;

    // Update local state immediately for a smooth UX
    const updatedTasks = tasks.map((t) =>
      t.uuid === uuid ? { ...t, hours: newHours } : t
    );
    setTasks(updatedTasks);
    setInputHours("");
    setActiveTask(null);

    // Persist updated hours to Supabase
    const { error } = await supabase
      .from("coursework")
      .update({ hours: newHours }) // Overwrite with new total (not added incrementally)
      .eq("id", uuid.replace(/^cw-/, "")); // Match DB row by stripped UUID

    if (error) {
      console.error("Supabase update error:", error);
      alert("Error saving to database.");
    }
  };

  // ----------------------------------------------------
  // Prevents server-side mismatch by waiting until hydrated
  // ----------------------------------------------------
  if (!hydrated)
    return (
      <div className="p-6 text-gray-400 text-center">Loading dashboard...</div>
    );

  // ----------------------------------------------------
  // Component Rendering
  // ----------------------------------------------------
  return (
    <div className="p-6">
      {/* Main Title */}
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>

      {/* Two-column grid: Coursework (left) + Events (right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* -------------------------------------------- */}
        {/* Coursework Tasks Section */}
        {/* -------------------------------------------- */}
        <div className="bg-white shadow rounded-2xl p-4 h-[600px] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Coursework Tasks</h3>

          <ul className="space-y-8">
            {deadlines.map((d, index) => {
              const progress = calculateProgress(d.hours, d.est_hours);
              const daysLeft = calculateDaysLeft(d.deadline);

              return (
                <li
                  key={`${d.type}-${d.uuid}-${index}`}
                  className="flex justify-between items-start bg-gray-50 rounded-2xl shadow-sm p-6 mb-6 border border-gray-100 hover:shadow-md transition-all duration-300"
                >
                  {/* Left side: Task info */}
                  <div className="w-full pr-3">
                    {/* Title */}
                    <p className="font-semibold text-blue-700">{d.title}</p>

                    {/* Deadline info */}
                    <p className="flex items-center text-sm text-gray-800 mb-1 font-medium">
                      <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                      Deadline:{" "}
                      {new Date(d.deadline).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>

                    {/* Days left */}
                    <p className="flex items-center text-sm text-gray-900 font-semibold mb-2">
                      <Clock className="w-4 h-4 mr-1 text-red-500" />
                      {daysLeft} days left
                    </p>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                      <div
                        className="h-2.5 rounded-full bg-blue-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    {/* Progress text */}
                    <p className="text-sm font-medium text-gray-600">
                      {d.hours}/{d.est_hours} hours completed
                    </p>
                  </div>

                  {/* “Add” button to open modal */}
                  <button
                    onClick={() => setActiveTask(d)}
                    className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 text-black px-3 py-1 rounded-xl shadow self-center"
                  >
                    + Add
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* -------------------------------------------- */}
        {/* Events Section */}
        {/* -------------------------------------------- */}
        <div className="bg-white shadow rounded-2xl p-4 h-[600px] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Events</h3>
          <ul className="space-y-8">
            {events.map((e, index) => {
              const daysLeft = calculateDaysLeft(e.deadline);
              return (
                <li
                  key={`event-${e.uuid}-${index}`}
                  className="flex justify-between items-start bg-gray-50 rounded-2xl shadow-sm p-6 mb-6 border border-gray-100 hover:shadow-md transition-all duration-300"
                >
                  {/* Event Info */}
                  <div className="w-full pr-3">
                    <p className="font-semibold text-purple-700">{e.title}</p>
                    <p className="flex items-center text-sm text-gray-800 mb-1 font-medium">
                      <Calendar className="w-4 h-4 mr-1 text-purple-500" />
                      {new Date(e.deadline).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                    <p className="flex items-center text-sm text-gray-900 font-semibold mb-2">
                      <Clock className="w-4 h-4 mr-1 text-red-500" />
                      {daysLeft} days left
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* -------------------------------------------- */}
      {/* Add Hours Modal (appears when activeTask != null) */}
      {/* -------------------------------------------- */}
      {activeTask && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm text-center">
            {/* Modal Header */}
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Add Hours Worked for
            </h3>

            {/* Task title */}
            <p className="text-blue-600 font-semibold mb-4">
              {activeTask.title}
            </p>

            {/* Input field */}
            <input
              type="number"
              placeholder="Enter hours"
              className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-center"
              value={inputHours}
              onChange={(e) => setInputHours(e.target.value)}
            />

            {/* Action buttons */}
            <div className="flex justify-center gap-2">
              <button
                onClick={() => handleAddHours(activeTask.uuid)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                + Add
              </button>
              <button
                onClick={() => setActiveTask(null)}
                className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
