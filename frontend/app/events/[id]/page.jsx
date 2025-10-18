"use client"; // ✅ 클라이언트 이벤트(onClick) 허용
import { notFound } from "next/navigation";

const events = [
  { 
    id: 1, 
    title: "AI Workshop", 
    date: "Oct 20", 
    details: "Hands-on workshop exploring machine learning models and neural networks." 
  },
  { 
    id: 2, 
    title: "Networking Night", 
    date: "Oct 25", 
    details: "Meet peers, professors, and industry experts in an evening of networking and discussions." 
  },
  { 
    id: 3, 
    title: "Hackathon", 
    date: "Nov 2", 
    details: "24-hour team-based coding challenge. Showcase your creativity and problem-solving skills." 
  },
];

export default function EventPage({ params }) {
  const id = parseInt(params.id);
  const event = events.find((e) => e.id === id);

  if (!event) return notFound();

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-3xl font-bold mb-4 text-purple-700">{event.title}</h2>
        <p className="text-gray-600 mb-2">
          📅 <span className="font-semibold">Date:</span> {event.date}
        </p>
        <p className="text-gray-700 mb-6">{event.details}</p>

        <button
          onClick={() => history.back()}
          className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-xl shadow transition"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
