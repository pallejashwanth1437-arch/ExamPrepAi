import React from "react";
import { motion } from "motion/react";
import { MessageSquare, Brain, Layers, FileText, Target, BarChart2 } from "lucide-react";

const features = [
  {
    icon: <MessageSquare className="w-5 h-5 text-indigo-400" />,
    title: "PDF Study Chat",
    description: "Upload academic materials and hold interactive study sessions. Ask complex questions, locate hidden definitions, and request step-by-step math or science breakdowns.",
    color: "rgba(99, 102, 241, 0.15)",
  },
  {
    icon: <Brain className="w-5 h-5 text-purple-400" />,
    title: "AI Quiz Generator",
    description: "Convert lecture notes or syllabus PDF chapters into interactive multiple-choice testing modules with instant grading, correction insights, and score sheets.",
    color: "rgba(168, 85, 247, 0.15)",
  },
  {
    icon: <Layers className="w-5 h-5 text-blue-400" />,
    title: "Smart Flashcards",
    description: "Create review flashcard decks in seconds. Flip card controls, track known items, and repeat critical terms to unlock active recall learning.",
    color: "rgba(59, 130, 246, 0.15)",
  },
  {
    icon: <FileText className="w-5 h-5 text-pink-400" />,
    title: "Study Summaries",
    description: "Condense long, verbose textbooks and slides into readable summaries. Focus on high-yield exam concepts and study guides without wasting time.",
    color: "rgba(236, 72, 153, 0.15)",
  },
  {
    icon: <Target className="w-5 h-5 text-emerald-400" />,
    title: "Exam Prediction",
    description: "Let our predictive algorithms analyze study briefs to forecast expected testing questions based on syllabus structures and topic frequencies.",
    color: "rgba(16, 185, 129, 0.15)",
  },
  {
    icon: <BarChart2 className="w-5 h-5 text-amber-400" />,
    title: "Learning Analytics",
    description: "Visualize weekly revision hours, topic strengths, average quiz marks, and active streaks. Stay accountable with simple visual graphs.",
    color: "rgba(245, 158, 11, 0.15)",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="relative py-24 px-6 border-b border-white/5 w-full">
      <div className="max-w-5xl mx-auto flex flex-col gap-12">
        {/* Section Header */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-xs uppercase font-bold tracking-widest text-indigo-400 mb-3"
          >
            Capabilities
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="text-4xl md:text-5xl text-white font-medium tracking-tight mb-4"
          >
            Comprehensive Learning Ecosystem
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-white/60 text-sm md:text-base max-w-xl mx-auto leading-relaxed"
          >
            A unified suite of AI study workflows engineered to maximize retention and minimize exam preparation stress.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{
                y: -5,
                borderColor: "rgba(255, 255, 255, 0.15)",
                boxShadow: `0 0 30px ${feat.color}`,
              }}
              className="liquid-glass border border-white/5 rounded-2xl p-6 flex flex-col gap-4 text-left transition-all duration-300"
            >
              {/* Icon container */}
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
                {feat.icon}
              </div>
              <h3 className="text-white text-base md:text-lg font-bold tracking-tight mt-1">
                {feat.title}
              </h3>
              <p className="text-white/70 text-xs md:text-sm leading-relaxed">
                {feat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
