import React from "react";
import { motion } from "motion/react";
import { BarChart3, TrendingUp, Calendar, Zap, Award } from "lucide-react";

const AnalyticsSection = () => {
  return (
    <section id="analytics" className="relative py-24 px-6 border-b border-white/5 w-full">
      <div className="max-w-5xl mx-auto flex flex-col gap-12">
        {/* Section Header */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-xs uppercase font-bold tracking-widest text-indigo-400 mb-3"
          >
            Insights
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="text-4xl md:text-5xl text-white font-medium tracking-tight mb-4"
          >
            Intelligent Study Analytics
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-white/60 text-sm md:text-base max-w-xl mx-auto leading-relaxed"
          >
            Track your weekly revision time, visualize topic completion averages, and follow diagnostic recommendations to optimize your scores.
          </motion.p>
        </div>

        {/* Analytics Display Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Weekly Progress Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="liquid-glass border border-white/5 rounded-2xl p-6 flex flex-col gap-4 text-left"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Weekly Study Hours</span>
              <BarChart3 className="w-4 h-4 text-indigo-400" />
            </div>
            {/* Mock Chart Columns */}
            <div className="flex items-end justify-between h-32 pt-4 border-b border-white/5">
              <div className="w-6 bg-white/5 rounded-t h-[30%]"></div>
              <div className="w-6 bg-white/10 rounded-t h-[55%]"></div>
              <div className="w-6 bg-indigo-500/20 rounded-t h-[75%] border-t border-indigo-400/30"></div>
              <div className="w-6 bg-white/10 rounded-t h-[45%]"></div>
              <div className="w-6 bg-purple-500/30 rounded-t h-[90%] border-t border-purple-400/40"></div>
              <div className="w-6 bg-white/5 rounded-t h-[20%]"></div>
              <div className="w-6 bg-indigo-500/40 rounded-t h-[100%] border-t border-indigo-400/50"></div>
            </div>
            <div className="flex justify-between text-[10px] text-white/40">
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
              <span>S</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18% increase from last week</span>
            </div>
          </motion.div>

          {/* Card 2: Subject Performance Marks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="liquid-glass border border-white/5 rounded-2xl p-6 flex flex-col gap-4 justify-between text-left"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Average Performance</span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="flex items-center gap-6 my-auto justify-center">
              {/* Circular Gauge */}
              <div className="w-24 h-24 rounded-full border-4 border-emerald-500/25 flex flex-col items-center justify-center relative shrink-0">
                <span className="text-2xl font-extrabold text-emerald-400 leading-none">92%</span>
                <span className="text-[9px] text-white/40 font-semibold uppercase tracking-wider mt-1">Grade A</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <h4 className="text-white text-xs font-bold uppercase tracking-wider">Newtonian Mechanics</h4>
                <p className="text-white/60 text-[11px] leading-relaxed">
                  Strong grasp on Gravity. Needs review on angular momentum topics.
                </p>
              </div>
            </div>

            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[92%] rounded-full"></div>
            </div>
          </motion.div>

          {/* Card 3: Study Streak Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
            className="liquid-glass border border-white/5 rounded-2xl p-6 flex flex-col gap-4 text-left"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Daily Study Streak</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>

            <div className="flex flex-col gap-4 my-auto">
              <div className="flex gap-4 items-center">
                <span className="text-3xl font-extrabold text-amber-400 leading-none">12 Days</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 leading-normal">
                  Active Study Streak
                </span>
              </div>
              {/* Calendar Row Mock */}
              <div className="grid grid-cols-7 gap-2">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      i < 5 ? "bg-amber-500/20 border border-amber-400/30 text-amber-300" : "bg-white/5 border border-white/5 text-white/30"
                    }`}>
                      {i + 10}
                    </div>
                    <span className="text-[8px] text-white/30 font-medium">
                      {["M","T","W","T","F","S","S"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-white/60 leading-normal flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Next target: 15-day milestone</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsSection;
