"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleView = (type: string, id: string) => {
    router.push(`/${type}/${id}`);
  };

  // ✅ Deadlines 데이터 (네 포맷 기반)
  const deadlines = [
    { taskID: "w1", deadline: "2025-10-25", strictness: false, timeRequire: 10 },
    { taskID: "w2", deadline: "2025-11-01", strictness: true, timeRequire: 25 },
    { taskID: "w3", deadline: "2025-11-10", strictness: false, timeRequire: 5 },
  ];

  // ✅ Events 데이터 (네 포맷 기반)
  const events = [
    { taskID: "e1", startTime: "2025-10-20T12:00", endTime: "2025-10-20T14:00" },
    { taskID: "e2", startTime: "2025-10-25T15:00", endTime: "2025-10-25T18:00" },
    { taskID: "e3", startTime: "2025-11-02T10:00", endTime: "2025-11-02T13:00" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <p className="text-gray-600 mb-6">
        Welcome back! Here’s an overview of your recent activity.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deadlines Section */}
        <div className="bg-white shadow rounded-2xl p-4 h-[500px] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Deadlines</h3>
          <ul className="space-y-4 text-gray-700">
            {deadlines.map((d) => (
              <li key={d.taskID} className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span>📅</span>
                  <span>
                    {d.taskID.toUpperCase()} — due {d.deadline}
                    <br />
                    <span className="text-sm text-gray-500">
                      {d.strictness ? "Strict" : "Flexible"} • {d.timeRequire}h required
                    </span>
                  </span>
                </div>
                <button
                  onClick={() => handleView("deadlines", d.taskID)}
                  className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-xl shadow"
                >
                  View
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Events Section */}
        <div className="bg-white shadow rounded-2xl p-4 h-[500px] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Events</h3>
          <ul className="space-y-4 text-gray-700">
            {events.map((e) => (
              <li key={e.taskID} className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span>🎉</span>
                  <span>
                    {e.taskID.toUpperCase()}
                    <br />
                    <span className="text-sm text-gray-500">
                      {e.startTime.slice(0, 16)} → {e.endTime.slice(0, 16)}
                    </span>
                  </span>
                </div>
                <button
                  onClick={() => handleView("events", e.taskID)}
                  className="text-sm bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-xl shadow"
                >
                  View
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
