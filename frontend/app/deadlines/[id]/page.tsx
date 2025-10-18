"use client";

import { useRouter, notFound } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const deadlines = [
  {
    id: "w1",
    title: "Project Proposal",
    date: "Oct 21",
    details: "Submit your proposal document via the student portal.",
    strictness: 70,
  },
  {
    id: "w2",
    title: "Research Paper",
    date: "Oct 28",
    details: "Upload your research paper as a PDF file.",
    strictness: 90,
  },
  {
    id: "w3",
    title: "Final Presentation",
    date: "Nov 5",
    details: "Prepare slides and present in class.",
    strictness: 40,
  },
];

export default function DeadlinePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const item = deadlines.find((d) => d.id === params.id);

  if (!item) return notFound();

  const data = [
    { name: "Strictness", value: item.strictness },
    { name: "Flexibility", value: 100 - item.strictness },
  ];

  return (
    <div className="p-8 min-h-screen bg-gray-50 flex flex-col gap-8 md:flex-row">
      
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full md:w-1/2 flex flex-col">
        <h3 className="text-xl font-bold text-blue-700 mb-4">🤖 AI say</h3>
        <p className="text-gray-600 mb-6">
          this task{" "}
          <span className="font-medium text-blue-600">{item.strictness}%</span>{" "}
          strick.
        </p>

        <div className="flex-1 min-h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 40 }}>
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full md:w-1/2">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{item.title}</h2>
        <p className="text-gray-600 mb-2">
          📅 Date: <span className="font-medium">{item.date}</span>
        </p>
        <p className="text-gray-700 mb-6">{item.details}</p>

        <button
          onClick={() => router.back()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl shadow transition"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}