"use client";

import { notFound } from "next/navigation";

const deadlines = [
  { id: 1, title: "Project Proposal", date: "Oct 21", details: "Submit your proposal document via the student portal." },
  { id: 2, title: "Research Paper", date: "Oct 28", details: "Upload your research paper as a PDF file." },
  { id: 3, title: "Final Presentation", date: "Nov 5", details: "Prepare slides and present in class." },
];

export default function DeadlinePage({ params }) {
  const id = parseInt(params.id);
  const item = deadlines.find((d) => d.id === id);

  if (!item) return notFound();

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-3xl font-bold mb-4 text-blue-700">{item.title}</h2>
        <p className="text-gray-600 mb-2">📅 Date: <span className="font-medium">{item.date}</span></p>
        <p className="text-gray-700 mb-6">{item.details}</p>

        <button
          onClick={() => history.back()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl shadow transition"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
