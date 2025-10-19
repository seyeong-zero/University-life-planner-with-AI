"use client";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Clock, Calendar, CheckCircle } from "lucide-react";

type TaskCard = {
  uuid: string;
  title: string;
  est_hours: number;
  deadline: string;
  created_at: string;
  strictness: boolean;
  type: "work" | "event";
};

export default function DashboardClient({
  initialTasks,
}: {
  initialTasks: TaskCard[];
}) {
  const router = useRouter();
  const [tasks] = useState<TaskCard[]>(initialTasks);
  const [hydrated, setHydrated] = useState(false);
  const [doneTask, setDoneTask] = useState<string | null>(null); // ✅ top-level hook

  useEffect(() => setHydrated(true), []);

  // ✅ Safe date formatting
  const formatDate = (date: string) => {
    if (typeof window === "undefined") return "";
    try {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(new Date(date));
    } catch {
      return date;
    }
  };

  // ✅ Calculate progress and days left
  const calculateProgress = (created_at: string, deadline: string) => {
    const now = new Date();
    const created = new Date(created_at);
    const end = new Date(deadline);

    const totalDuration = end.getTime() - created.getTime();
    const elapsed = now.getTime() - created.getTime();

    if (isNaN(totalDuration) || totalDuration <= 0) {
      return { percentage: 100, daysLeft: 0 };
    }

    const percentage = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
    const daysLeft = Math.max(
      0,
      Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    );

    return { percentage: Number(percentage.toFixed(2)), daysLeft };
  };

  const deadlines = useMemo(() => tasks.filter((t) => t.type === "work"), [tasks]);
  const events = useMemo(() => tasks.filter((t) => t.type === "event"), [tasks]);

  if (!hydrated) {
    return <div className="p-6 text-gray-400 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deadlines Section */}
        <div className="bg-white shadow rounded-2xl p-4 h-[500px] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Deadlines</h3>
          <ul className="space-y-6 text-gray-700">
            {deadlines.map((d) => {
              const { percentage, daysLeft } = calculateProgress(d.created_at, d.deadline);
              return (
                <li key={d.uuid} className="flex justify-between items-start">
                  <div className="w-full pr-3">
                    <p className="font-semibold text-blue-700">{d.title}</p>
                    <p className="flex items-center text-sm text-gray-800 mb-1 font-medium">
                      <Calendar className="w-4 h-4 mr-1 text-blue-600" />
                      Deadline: {formatDate(d.deadline)}
                    </p>
                    <p className="flex items-center text-sm text-gray-900 font-semibold mb-2">
                      <Clock className="w-4 h-4 mr-1 text-blue-700" />
                      {daysLeft} days left
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                      <div
                        className="bg-blue-500 h-2.5 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  {/* ✅ Done button with black text */}
                  <button
                    onClick={() => setDoneTask(d.title)}
                    className="flex items-center gap-1 text-sm bg-green-100 hover:bg-green-200 text-black px-3 py-1 rounded-xl shadow self-center"
                  >
                    <CheckCircle className="w-4 h-4 text-green-700" />
                    Done
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Events Section */}
        <div className="bg-white shadow rounded-2xl p-4 h-[500px] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Events</h3>
          <ul className="space-y-6 text-gray-700">
            {events.map((e) => {
              const { percentage, daysLeft } = calculateProgress(e.created_at, e.deadline);
              return (
                <li key={e.uuid} className="flex justify-between items-start">
                  <div className="w-full pr-3">
                    <p className="font-semibold text-purple-700">{e.title}</p>
                    <p className="flex items-center text-sm text-gray-800 mb-1 font-medium">
                      <Calendar className="w-4 h-4 mr-1 text-purple-600" />
                      {formatDate(e.deadline)}
                    </p>
                    <p className="flex items-center text-sm text-gray-900 font-semibold mb-2">
                      <Clock className="w-4 h-4 mr-1 text-purple-700" />
                      {daysLeft} days left
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                      <div
                        className="bg-purple-500 h-2.5 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setDoneTask(e.title)}
                    className="flex items-center gap-1 text-sm bg-green-100 hover:bg-green-200 text-black px-3 py-1 rounded-xl shadow self-center"
                  >
                    <CheckCircle className="w-4 h-4 text-green-700" />
                    Done
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* ✅ Popup */}
      {doneTask && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm text-center">
            <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              You are done!
            </h3>
            <p className="text-gray-600 mb-4">
              Task <span className="font-semibold">{doneTask}</span> is completed 🎉
            </p>
            <button
              onClick={() => setDoneTask(null)}
              className="bg-green-100 hover:bg-green-200 text-black px-4 py-2 rounded-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
