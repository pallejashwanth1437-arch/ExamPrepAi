import React from "react";
import { motion } from "motion/react";
import { Zap, BrainCircuit, Clock } from "lucide-react";

const stats = [
  {
    icon: <Zap className="w-5 h-5 text-indigo-400" />,
    value: "10x Faster",
    label: "Study Workflow",
  },
  {
    icon: <BrainCircuit className="w-5 h-5 text-purple-400" />,
    value: "AI Powered",
    label: "Learning Assistance",
  },
  {
    icon: <Clock className="w-5 h-5 text-blue-400" />,
    value: "24/7",
    label: "Personal Study Companion",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.8,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const StatsCards = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mx-auto px-4 mt-6"
    >
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          variants={cardVariants}
          whileHover={{
            scale: 1.05,
            borderColor: "rgba(165, 180, 252, 0.3)",
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            boxShadow: "0 0 30px rgba(99, 102, 241, 0.12)",
          }}
          className="liquid-glass border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center justify-center gap-3 transition-colors duration-300 backdrop-blur-md cursor-default"
        >
          {/* Circular Icon Container */}
          <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center mb-1">
            {stat.icon}
          </div>

          {/* Heading Value */}
          <h3 className="text-white text-lg md:text-xl font-bold tracking-tight">
            {stat.value}
          </h3>

          {/* Subtext Label */}
          <p className="text-white/60 text-xs md:text-sm font-medium tracking-wide">
            {stat.label}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsCards;
