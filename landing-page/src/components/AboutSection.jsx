import React from "react";
import { motion } from "motion/react";
import { Info, Sparkles, Code, GraduationCap } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="relative py-24 px-6 w-full">
      <div className="max-w-5xl mx-auto flex flex-col gap-12">
        {/* Section Header */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-xs uppercase font-bold tracking-widest text-indigo-400 mb-3"
          >
            Mission
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="text-4xl md:text-5xl text-white font-medium tracking-tight mb-4"
          >
            About ExamPrep AI
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-white/60 text-sm md:text-base max-w-xl mx-auto leading-relaxed"
          >
            A technology platform built to redefine how high-performing students process, review, and retain academic syllabus content.
          </motion.p>
        </div>

        {/* About Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Main Description */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col gap-5 text-left"
          >
            <h3 className="text-white text-xl font-bold tracking-tight">
              Study Smarter, Retain Longer, and Score Higher
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
              ExamPrep AI was born out of a simple observation: students spend more time organizing, structuring, and rewriting notes than actually practicing and testing themselves. We wanted to flip the equation.
            </p>
            <p className="text-white/70 text-sm leading-relaxed">
              By combining Google's Gemini models with modular learning interfaces, we instantly convert passive lectures and dense textbook readings into active study centers. Students can chat, take custom quizzes, flip card decks, read summaries, and track diagnostics all in one visual cockpit.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <Info className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wider">
                Built for students, by students.
              </span>
            </div>
          </motion.div>

          {/* Tech Stack/Details Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="liquid-glass border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col gap-6 text-left"
          >
            <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
              <Code className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">AI Integrations & Tech Stack</span>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">Large Language Models</span>
                <span className="text-xs text-white font-semibold">Gemini 2.5 Flash</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">Video Streaming Engine</span>
                <span className="text-xs text-white font-semibold">HLS.js Protocol</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">Motion Transitions</span>
                <span className="text-xs text-white font-semibold">Framer Motion</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">Layout System</span>
                <span className="text-xs text-white font-semibold">Tailwind CSS v4</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">Application State</span>
                <span className="text-xs text-white font-semibold">React 19 Core</span>
              </div>
            </div>

            {/* Platform Emblem */}
            <div className="mt-2 p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center gap-3">
              <GraduationCap className="w-5 h-5 text-indigo-400 shrink-0" />
              <span className="text-[11px] text-white/50 leading-relaxed font-semibold">
                Platform fully optimized for Chrome, Firefox, Edge, Safari, iOS, and Android formats.
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
