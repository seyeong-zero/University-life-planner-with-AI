"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleView = (id: string) => {
    router.push(`/tasks/${id}`);
  };

  // Mock data using DB structure + location for events
  const tasks = [
    {
      uuid: "1a2b3c",
      title: "Project Proposal",
      description: "Write and submit the project proposal document.",
      est_hours: 10,
      deadline: "2025-10-25T12:00:00Z",
      created_at: "2025-10-10T10:00:00Z",
      updated_at: "2025-10-15T14:00:00Z",
      strictness: false,
      type: "work",
    },
    {
      uuid: "4d5e6f",
      title: "Research Paper",
      description: "Complete the research paper with proper references and formatting.",
      est_hours: 25,
      deadline: "2025-11-01T12:00:00Z",
      created_at: "2025-10-12T09:00:00Z",
      updated_at: "2025-10-14T16:00:00Z",
      strictness: true,
      type: "work",
    },
    {
      uuid: "7g8h9i",
      title: "AI Workshop",
      description: "Attend a hands-on AI workshop with team activities.",
      est_hours: 0,
      deadline: "2025-10-20T12:00:00Z",
      created_at: "2025-10-08T11:00:00Z",
      updated_at: "2025-10-09T15:00:00Z",
      strictness: false,
      type: "event",
      location: "London Campus, Room 304",
    },
    {
      uuid: "9k0l1m",
      title: "Networking Night",
      description: "Meet and connect with professionals in the AI field.",
      est_hours: 0,
      deadline: "2025-10-25T18:00:00Z",
      created_at: "2025-10-09T09:30:00Z",
      updated_at: "2025-10-10T11:00:00Z",
      strictness: false,
      type: "event",
      location: "Oxford Conference Hall",
    },
  ];

  // Separate works and events
  const deadlines = tasks.filter((t) => t.type === "work");
  const events = tasks.filter((t) => t.type === "event");

  // Format date (English, 12-hour format)
  const formatDate = (date: string) =>
    new Date(date).toLocaleString("en-US", {
      hour12: true,
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  // Calculate days left and progress percentage
  const calculateProgress = (created_at: string, deadline: string) => {
    const now = new Date();
    const created = new Date(created_at);
    const end = new Date(deadline);

    const totalDuration = end.getTime() - created.getTime();
    const elapsed = now.getTime() - created.getTime();

    const percentage = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
    const daysLeft = Math.max(
      0,
      Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    );

    return { percentage, daysLeft };
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <p className="text-gray-600 mb-6">
        Showing tasks formatted according to the database structure.
      </p>

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
                    <p className="text-sm text-gray-500 mb-1">
                      {d.strictness ? "Strict" : "Flexible"} • {d.est_hours}h estimated
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Deadline: {formatDate(d.deadline)}
                    </p>
                    <p className="text-xs text-gray-400 mb-2">{d.description}</p>
                    <p className="text-xs text-gray-400 mb-2">{daysLeft} days left</p>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                      <div
                        className="bg-blue-500 h-2.5 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleView(d.uuid)}
                    className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-xl shadow self-center"
                  >
                    View
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
                    <p className="text-sm text-gray-500 mb-1">
                      📅 {formatDate(e.deadline)}
                    </p>
                    {e.location && (
                      <p className="text-sm text-gray-500 mb-1">📍 {e.location}</p>
                    )}
                    <p className="text-xs text-gray-400 mb-2">{e.description}</p>
                    <p className="text-xs text-gray-400 mb-2">{daysLeft} days left</p>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                      <div
                        className="bg-purple-500 h-2.5 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleView(e.uuid)}
                    className="text-sm bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-xl shadow self-center"
                  >
                    View
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
