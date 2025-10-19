"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type TaskCard = {
  uuid: string;
  title: string;
  description?: string;
  est_hours: number;
  deadline: string;
  created_at: string;
  updated_at?: string;
  strictness: boolean;
  type: "work" | "event";
  location?: string;
};

export default function HomePage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<TaskCard[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ✅ AI 질문 상태
  const [isAsking, setIsAsking] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleView = (id: string) => router.push(`/tasks/${id}`);

  useEffect(() => {
    (async () => {
      try {
        const { data: cw } = await supabase.from("coursework").select("*");
        const { data: ev } = await supabase.from("events").select("*");

        const cwTasks =
          (cw ?? []).map((c: any) => ({
            uuid: c.id,
            title: c.title ?? "Untitled coursework",
            est_hours: Number(c.est_hours ?? 0),
            deadline:
              c.deadline_at || c.latest_by || c.updated_at || c.created_at,
            created_at: c.created_at,
            updated_at: c.updated_at,
            strictness:
              typeof c.strictness === "boolean"
                ? c.strictness
                : String(c.strictness).toLowerCase() === "strict",
            type: "work",
          })) as TaskCard[];

        const evTasks =
          (ev ?? []).map((e: any) => ({
            uuid: e.id,
            title: e.title ?? "Event",
            est_hours: 0,
            deadline: e.start_at,
            created_at: e.created_at ?? e.start_at,
            strictness: false,
            type: "event",
          })) as TaskCard[];

        setTasks([...cwTasks, ...evTasks]);
      } catch (err: any) {
        setError(err.message ?? "Failed to load");
        setTasks([]);
      }
    })();
  }, []);

  // ✅ AI 질문 전송
  const handleAskAI = async () => {
  if (!question.trim()) return alert("Please type your question first!");
  setLoading(true);
  setAnswer(null);

  try {
    const res = await fetch("http://localhost:8000/ask_ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();
    setAnswer(data.answer ?? "⚠️ No response from AI.");
  } catch (err) {
    console.error(err);
    setAnswer("❌ Failed to connect to AI backend.");
  } finally {
    setLoading(false);
  }
};

  // ✅ 날짜 포맷
  const formatDate = (date: string) =>
    new Date(date).toLocaleString("en-US", {
      hour12: true,
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  const calculateProgress = (created_at: string, deadline: string) => {
    const now = new Date();
    const created = new Date(created_at);
    const end = new Date(deadline);
    const totalDuration = end.getTime() - created.getTime();
    const elapsed = now.getTime() - created.getTime();
    const percentage =
      totalDuration > 0
        ? Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100)
        : 100;
    const daysLeft = Math.max(
      0,
      Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    );
    return { percentage, daysLeft };
  };

  const deadlines = useMemo(
    () => (tasks ?? []).filter((t) => t.type === "work"),
    [tasks]
  );
  const events = useMemo(
    () => (tasks ?? []).filter((t) => t.type === "event"),
    [tasks]
  );

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <button
          onClick={() => setIsAsking(true)}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg shadow"
        >
          💬 Ask AI
        </button>
      </div>

      <p className="text-gray-600 mb-6">
        {error ? `Error: ${error}` : "Showing tasks from Supabase."}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deadlines Section */}
        <div className="bg-white shadow rounded-2xl p-4 h-[500px] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Deadlines</h3>
          {tasks === null ? (
            <p className="text-gray-500">Loading…</p>
          ) : (
            <ul className="space-y-6 text-gray-700">
              {deadlines.map((d) => {
                const { percentage, daysLeft } = calculateProgress(
                  d.created_at,
                  d.deadline
                );
                return (
                  <li key={d.uuid} className="flex justify-between items-start">
                    <div className="w-full pr-3">
                      <p className="font-semibold text-blue-700">{d.title}</p>
                      <p className="text-sm text-gray-500 mb-1">
                        {d.strictness ? "Strict" : "Flexible"} • {d.est_hours}h
                        estimated
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        Deadline: {formatDate(d.deadline)}
                      </p>
                      <p className="text-xs text-gray-400 mb-2">
                        {daysLeft} days left
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                        <div
                          className="bg-blue-500 h-2.5 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
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
          )}
        </div>

        {/* Events Section */}
        <div className="bg-white shadow rounded-2xl p-4 h-[500px] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Events</h3>
          {tasks === null ? (
            <p className="text-gray-500">Loading…</p>
          ) : (
            <ul className="space-y-6 text-gray-700">
              {events.map((e) => {
                const { percentage, daysLeft } = calculateProgress(
                  e.created_at,
                  e.deadline
                );
                return (
                  <li key={e.uuid} className="flex justify-between items-start">
                    <div className="w-full pr-3">
                      <p className="font-semibold text-purple-700">{e.title}</p>
                      <p className="text-sm text-gray-500 mb-1">
                        📅 {formatDate(e.deadline)}
                      </p>
                      <p className="text-xs text-gray-400 mb-2">
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
                      onClick={() => handleView(e.uuid)}
                      className="text-sm bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-xl shadow self-center"
                    >
                      View
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* ✅ Ask AI Modal */}
      {isAsking && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-purple-700">
              Ask Gemini AI
            </h3>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question here..."
              className="w-full h-24 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsAsking(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Close
              </button>
              <button
                onClick={handleAskAI}
                className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white"
              >
                {loading ? "Asking..." : "Ask"}
              </button>
            </div>
            {answer && (
              <div className="mt-4 bg-gray-50 border border-gray-200 p-4 rounded-lg text-gray-800 whitespace-pre-wrap">
                {answer}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
