import React from "react";
import { motion } from "motion/react";
import { MessageSquare, CheckCircle, Award, BarChart3 } from "lucide-react";

const FloatingDashboard = () => {
  return (
    <div className="absolute inset-0 z-5 pointer-events-none select-none overflow-hidden">
      {/* 1. Flashcard Component (Top Left) */}
      <motion.div
        initial={{ y: 0, rotate: -4 }}
        animate={{
          y: [-12, 12, -12],
          rotate: [-4, -2, -4],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[5%] md:left-[8%] top-[20%] md:top-[25%] w-[180px] md:w-[220px] liquid-glass rounded-xl p-4 opacity-15 md:opacity-20 blur-[1px] md:blur-[1.5px] scale-90 md:scale-100"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
          <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">Card 12/40</span>
          <Award className="w-3.5 h-3.5 text-indigo-400" />
        </div>
        <p className="text-white text-xs font-semibold leading-relaxed mb-3">
          What is the formula for escape velocity from Earth?
        </p>
        <div className="w-full h-7 bg-white/5 border border-white/10 rounded flex items-center justify-center">
          <span className="text-[9px] uppercase tracking-widest text-white/50">Tap to Reveal Answer</span>
        </div>
      </motion.div>

      {/* 2. PDF Chat Window (Bottom Left) */}
      <motion.div
        initial={{ y: 0, rotate: 3 }}
        animate={{
          y: [10, -10, 10],
          rotate: [3, 5, 3],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[3%] md:left-[6%] top-[55%] md:top-[60%] w-[200px] md:w-[240px] liquid-glass rounded-xl p-4 opacity-15 md:opacity-20 blur-[1.5px] md:blur-[2px] scale-90 md:scale-100"
      >
        <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-3">
          <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[10px] font-semibold text-white/70 truncate">Physics_Ch5_Notes.pdf</span>
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="bg-indigo-500/10 border border-indigo-500/10 rounded-lg p-2 max-w-[85%] self-end">
            <p className="text-[10px] text-indigo-200">Explain Newtonian gravity.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-2 max-w-[90%]">
            <p className="text-[10px] text-white/80 leading-normal">
              Every particle attracts every other particle with a force proportional...
            </p>
          </div>
        </div>
      </motion.div>

      {/* 3. Quiz Result Card (Top Right) */}
      <motion.div
        initial={{ y: 0, rotate: 2 }}
        animate={{
          y: [12, -12, 12],
          rotate: [2, 0, 2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[4%] md:right-[8%] top-[25%] md:top-[28%] w-[190px] md:w-[230px] liquid-glass rounded-xl p-4 opacity-15 md:opacity-25 blur-[1px] scale-90 md:scale-100"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">Quiz Completed</span>
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-dashed border-emerald-500/30 flex items-center justify-center shrink-0">
            <span className="text-[13px] font-bold text-emerald-400">95%</span>
          </div>
          <div>
            <h4 className="text-white text-xs font-semibold leading-tight">Ch. 3 Mechanics</h4>
            <span className="text-[9px] text-white/50">19/20 Correct • 4 mins</span>
          </div>
        </div>
      </motion.div>

      {/* 4. Analytics Widget (Bottom Right) */}
      <motion.div
        initial={{ y: 0, rotate: -3 }}
        animate={{
          y: [-10, 10, -10],
          rotate: [-3, -5, -3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[3%] md:right-[6%] top-[60%] md:top-[62%] w-[180px] md:w-[220px] liquid-glass rounded-xl p-4 opacity-15 md:opacity-20 blur-[1.5px] md:blur-[2.5px] scale-90 md:scale-100"
      >
        <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-3">
          <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-[10px] font-semibold text-white/70">Weekly Progress</span>
        </div>
        <div className="flex items-end gap-2 h-12 pt-2 justify-between">
          <div className="w-full bg-white/5 rounded-t h-[40%] border-t border-white/10"></div>
          <div className="w-full bg-white/10 rounded-t h-[65%] border-t border-white/15"></div>
          <div className="w-full bg-indigo-500/20 rounded-t h-[80%] border-t border-indigo-500/30"></div>
          <div className="w-full bg-white/10 rounded-t h-[50%] border-t border-white/15"></div>
          <div className="w-full bg-purple-500/30 rounded-t h-[95%] border-t border-purple-400/40"></div>
        </div>
        <div className="flex justify-between text-[8px] text-white/45 mt-2 font-medium">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>
      </motion.div>
    </div>
  );
};

export default FloatingDashboard;
