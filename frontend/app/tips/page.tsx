"use client";
import { Lightbulb, Info, Rocket, Brain } from "lucide-react";
import { motion } from "framer-motion";

export default function TipsPage() {
  const tips = [
    {
      icon: <Lightbulb className="w-6 h-6 text-yellow-500" />,
      title: "Purpose of Adaptive Timetable",
      desc: "Our system helps students automatically schedule their coursework and events efficiently using AI.",
    },
    {
      icon: <Brain className="w-6 h-6 text-purple-600" />,
      title: "How AI Helps You",
      desc: "The AI reads your coursework and event data from Supabase, then plans ideal study sessions with no schedule conflicts.",
    },
    {
      icon: <Rocket className="w-6 h-6 text-blue-500" />,
      title: "Getting Started",
      desc: "1️⃣ Add coursework via the calendar modal. 2️⃣ Let AI distribute study hours. 3️⃣ Track your progress on the dashboard.",
    },
    {
      icon: <Info className="w-6 h-6 text-green-600" />,
      title: "Tips for Best Results",
      desc: "Keep your deadlines accurate and use the 'Add Hours' button on Dashboard to record your daily study activity.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <motion.h1
        className="text-4xl font-bold text-center text-gray-800 mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        💡 Tips & Guide
      </motion.h1>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {tips.map((tip, idx) => (
          <motion.div
            key={idx}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="flex items-center mb-4">
              {tip.icon}
              <h3 className="ml-3 text-lg font-semibold text-gray-800">
                {tip.title}
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">{tip.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
