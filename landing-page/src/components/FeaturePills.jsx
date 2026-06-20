import React from "react";
import { motion } from "motion/react";

const pills = [
  { text: "PDF Study Chat", emoji: "📄" },
  { text: "AI Quiz Generator", emoji: "🧠" },
  { text: "Smart Flashcards", emoji: "🃏" },
  { text: "Study Summaries", emoji: "📝" },
  { text: "Exam Prediction", emoji: "🎯" },
  { text: "Learning Analytics", emoji: "📊" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.6,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 18,
    },
  },
};

const FeaturePills = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto px-4"
    >
      {pills.map((pill, idx) => (
        <motion.div
          key={idx}
          variants={itemVariants}
          whileHover={{
            y: -5,
            scale: 1.03,
            backgroundColor: "rgba(255, 255, 255, 0.07)",
            borderColor: "rgba(165, 180, 252, 0.25)",
            boxShadow: "0 0 20px rgba(99, 102, 241, 0.15)",
          }}
          className="flex items-center gap-2.5 px-4 py-2 text-[12px] md:text-[13px] font-medium text-white/90 border border-white/10 rounded-full bg-white/[0.03] backdrop-blur-md cursor-pointer transition-colors duration-300"
        >
          <span className="text-[14px] md:text-[15px] select-none">{pill.emoji}</span>
          <span>{pill.text}</span>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FeaturePills;
