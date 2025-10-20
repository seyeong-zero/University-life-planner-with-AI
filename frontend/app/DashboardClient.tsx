"use client";
import { useMemo, useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

// -------------------------------
// Type definition for a task card
// -------------------------------
type TaskCard = {
  uuid: string;          // Unique frontend ID (e.g., "cw-1")
  title: string;         // Task title
  est_hours: number;     // Estimated total hours
  hours: number;         // Completed hours
  deadline: string;      // Deadline (ISO string)
  created_at: string;    // Created timestamp
  strictness: boolean;   // Deadline strictness flag
  type: "work" | "event"; // Task category
};

// -------------------------------
// DashboardClient Component
// -------------------------------
export default function DashboardClient({
  initialTasks,
}: {
  initialTasks: TaskCard[];
}) {
  const [tasks, setTasks] = useState<TaskCard[]>(initialTasks || []);
  const [hydrated, setHydrated] = useState(false);
  const [activeTask, setActiveTask] = useState<TaskCard | null>(null);
  const [inputHours, setInputHours] = useState("");

  // Ensure component renders only after hydration
  useEffect(() => setHydrated(true), []);

  // -------------------------------
  // Calculate days left until deadline
  // -------------------------------
  const calculateDaysLeft = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    return Math.max(
      0,
      Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    );
  };

  // -------------------------------
  // Calculate task completion percentage
  // -------------------------------
  const calculateProgress = (hours: number, est_hours: number) => {
    if (!est_hours || est_hours <= 0) return 0;
    return Math.min(100, (hours / est_hours) * 100);
  };

  // -------------------------------
  // Coursework tasks only (sorted by deadline)
  // -------------------------------
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

  // -------------------------------
  // Events list (sorted by deadline)
  // -------------------------------
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

  // -------------------------------
  // ✅ Handle adding hours (no RPC, direct cumulative update)
  // -------------------------------
  const handleAddHours = async (uuid: string) => {
    const added = parseFloat(inputHours);
    if (isNaN(added) || added <= 0) return alert("Please enter valid hours!");

    // 현재 task 찾기
    const currentTask = tasks.find((t) => t.uuid === uuid);
    if (!currentTask) return;

    // 누적된 총 시간 계산
    const newHours = currentTask.hours + added;

    // 1️⃣ UI 먼저 업데이트 (즉각 반응성 제공)
    const updatedTasks = tasks.map((t) =>
      t.uuid === uuid ? { ...t, hours: newHours } : t
    );
    setTasks(updatedTasks);
    setInputHours("");
    setActiveTask(null);

    // 2️⃣ Supabase에 누적값 저장 (RPC 대신 update)
    const { error } = await supabase
      .from("coursework")
      .update({ hours: newHours }) // ✅ 기존 hours + 추가값으로 누적
      .eq("id", uuid.replace(/^cw-/, ""));

    if (error) {
      console.error("❌ Supabase update error:", error);
      alert("Error saving data to database.");
    }
  };

  // Render loading state until hydrated
  if (!hydrated)
    return (
      <div className="p-6 text-gray-400 text-center">Loading dashboard...</div>
    );

  // -------------------------------
  // Render dashboard
  // -------------------------------
  return (
    <div className="p-6">
      {/* Title */}
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>

      {/* Two columns: Coursework + Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coursework Tasks */}
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
                  <div className="w-full pr-3">
                    <p className="font-semibold text-blue-700">{d.title}</p>
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
                    <p className="flex items-center text-sm text-gray-900 font-semibold mb-2">
                      <Clock className="w-4 h-4 mr-1 text-red-500" />
                      {daysLeft} days left
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                      <div
                        className="h-2.5 rounded-full bg-blue-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-sm font-medium text-gray-600">
                      {d.hours}/{d.est_hours} hours completed
                    </p>
                  </div>

                  {/* +Add Button */}
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

        {/* Events */}
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

      {/* Add Hours Modal */}
      {activeTask && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Add Hours Worked for
            </h3>
            <p className="text-blue-600 font-semibold mb-4">
              {activeTask.title}
            </p>

            <input
              type="number"
              placeholder="Enter hours"
              className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-center"
              value={inputHours}
              onChange={(e) => setInputHours(e.target.value)}
            />

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
