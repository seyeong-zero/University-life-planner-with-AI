"use client";
import { useMemo, useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type TaskCard = {
  uuid: string;
  title: string;
  est_hours: number;
  hours: number;
  deadline: string;
  created_at: string;
  strictness: boolean;
  type: "work" | "event" | "ai";
};

export default function DashboardClient({
  initialTasks,
}: {
  initialTasks: TaskCard[];
}) {
  const [tasks, setTasks] = useState<TaskCard[]>(initialTasks);
  const [hydrated, setHydrated] = useState(false);
  const [activeTask, setActiveTask] = useState<TaskCard | null>(null);
  const [inputHours, setInputHours] = useState("");

  useEffect(() => setHydrated(true), []);


  const calculateDaysLeft = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    return Math.max(
      0,
      Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    );
  };


  const calculateProgress = (hours: number, est_hours: number) => {
    if (!est_hours || est_hours <= 0) return 0;
    return Math.min(100, (hours / est_hours) * 100);
  };

  const deadlines = useMemo(
    () => tasks.filter((t) => t.type === "work" || t.type === "ai"),
    [tasks]
  );
  const events = useMemo(() => tasks.filter((t) => t.type === "event"), [tasks]);

  
  const handleAddHours = async (uuid: string) => {
    const added = parseFloat(inputHours);
    if (isNaN(added) || added <= 0) return alert("Please enter valid hours!");

    const updatedTasks = tasks.map((t) =>
      t.uuid === uuid ? { ...t, hours: t.hours + added } : t
    );
    setTasks(updatedTasks);
    setInputHours("");
    setActiveTask(null);

    await supabase
      .from("coursework")
      .update({ hours: added })
      .eq("id", uuid.replace(/^cw-/, ""));
  };

  if (!hydrated)
    return <div className="p-6 text-gray-400 text-center">Loading dashboard...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       
        <div className="bg-white shadow rounded-2xl p-4 h-[600px] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Coursework & AI Tasks</h3>
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
                    <p
                      className={`font-semibold ${
                        d.type === "ai" ? "text-green-700" : "text-blue-700"
                      }`}
                    >
                      {d.title}
                    </p>
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
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                      <div
                        className={`h-2.5 rounded-full ${
                          d.type === "ai" ? "bg-green-500" : "bg-blue-500"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-sm font-medium text-gray-600">
                      {d.hours}/{d.est_hours} hours completed
                    </p>
                  </div>
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

      
      {activeTask && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Add Hours Worked for
            </h3>
            <p className="text-blue-600 font-semibold mb-4">{activeTask.title}</p>

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
