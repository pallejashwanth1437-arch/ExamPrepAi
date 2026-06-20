import React from "react";
import { motion } from "motion/react";
import { FolderGit2, BookOpen, PenTool, ClipboardList, HelpCircle } from "lucide-react";

const resources = [
  {
    icon: <BookOpen className="w-4 h-4 text-indigo-400" />,
    title: "Newtonian Physics Study Guide",
    type: "Document Summary",
    path: "/app.html#summaries",
  },
  {
    icon: <ClipboardList className="w-4 h-4 text-purple-400" />,
    title: "Organic Chemistry MCQ Test",
    type: "Quiz Deck",
    path: "/app.html#quizzes",
  },
  {
    icon: <FolderGit2 className="w-4 h-4 text-blue-400" />,
    title: "Cell Biology Active Recall Deck",
    type: "Flashcard Session",
    path: "/app.html#flashcards",
  },
  {
    icon: <HelpCircle className="w-4 h-4 text-emerald-400" />,
    title: "Thermodynamics Forecast Predictions",
    type: "Predicted Exam",
    path: "/app.html#questions",
  },
];

const ResourcesSection = () => {
  return (
    <section id="resources" className="relative py-24 px-6 border-b border-white/5 w-full">
      <div className="max-w-5xl mx-auto flex flex-col gap-12">
        {/* Section Header */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-xs uppercase font-bold tracking-widest text-indigo-400 mb-3"
          >
            Study Guides
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="text-4xl md:text-5xl text-white font-medium tracking-tight mb-4"
          >
            Curated Study Resources
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-white/60 text-sm md:text-base max-w-xl mx-auto leading-relaxed"
          >
            Access sample materials, predictive guides, summaries, and quizzes generated directly by our AI engine.
          </motion.p>
        </div>

        {/* Resources List Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((res, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -15 : 15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{
                x: 4,
                borderColor: "rgba(255, 255, 255, 0.15)",
                backgroundColor: "rgba(255, 255, 255, 0.02)",
              }}
              className="liquid-glass border border-white/5 rounded-xl p-4 flex items-center justify-between gap-4 transition-all duration-300 text-left cursor-pointer"
              onClick={() => (window.location.href = res.path)}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-center shrink-0">
                  {res.icon}
                </div>
                <div className="min-w-0">
                  <h4 className="text-white text-xs md:text-sm font-semibold truncate">
                    {res.title}
                  </h4>
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block mt-1">
                    {res.type}
                  </span>
                </div>
              </div>
              <span className="text-xs text-indigo-400 font-semibold tracking-wide shrink-0">
                Study →
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;
