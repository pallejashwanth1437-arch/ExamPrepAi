import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check, Play, Sparkles } from "lucide-react";
import FeaturePills from "./FeaturePills";
import StatsCards from "./StatsCards";

const Hero = ({ setActiveModal, onScrollTo }) => {
  const [formState, setFormState] = useState("button"); // "button" | "form" | "success"
  const [email, setEmail] = useState("");
  const [placeholderText, setPlaceholderText] = useState("");

  // Typewriter effect for form input placeholder
  useEffect(() => {
    let intervalId;
    let targetText = "";

    if (formState === "form") {
      targetText = "Enter your academic email address";
      setPlaceholderText("");
      let index = 0;
      intervalId = setInterval(() => {
        if (index <= targetText.length) {
          setPlaceholderText(targetText.slice(0, index));
          index++;
        } else {
          clearInterval(intervalId);
        }
      }, 55);
    } else if (formState === "success") {
      targetText = "Your early access request has been received";
      setPlaceholderText("");
      let index = 0;
      intervalId = setInterval(() => {
        if (index <= targetText.length) {
          setPlaceholderText(targetText.slice(0, index));
          index++;
        } else {
          clearInterval(intervalId);
        }
      }, 35);

      const timeoutId = setTimeout(() => {
        setFormState("button");
        setEmail("");
      }, 4000);

      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      };
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [formState]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setFormState("success");
    setEmail("");
  };

  return (
    <section className="relative flex-1 flex flex-col justify-start items-center px-6 pt-[125px] pb-4 z-10 w-full overflow-hidden min-h-[90vh]">
      <div className="text-center max-w-5xl mx-auto flex flex-col items-center justify-center w-full gap-4 sm:gap-5 md:gap-6">
        
        {/* 1. Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="flex items-center gap-1.5 px-3 py-1 bg-white/[0.02] border border-white/5 rounded-full select-none"
        >
          <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
          <p className="text-white/80 text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase">
            AI-Powered Exam Preparation Platform
          </p>
        </motion.div>

        {/* 2. Main Hero Heading */}
        <div className="relative group select-none">
          {/* Spotlight behind heading */}
          <div className="absolute inset-0 bg-indigo-500/5 rounded-full blur-[80px] -z-10 group-hover:bg-indigo-500/10 transition-colors duration-500" />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="text-shimmer text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-medium tracking-tight leading-[1.05] max-w-4xl"
          >
            Study Smarter.
            <br />
            Score Higher.
            <br />
            <span className="italic font-normal">Powered by AI.</span>
          </motion.h1>
        </div>

        {/* 3. Hero Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-white/70 text-xs md:text-[15px] max-w-[720px] leading-relaxed px-2"
        >
          Upload your study materials and let ExamPrep AI transform them into quizzes, flashcards, summaries, exam predictions, and intelligent study conversations—everything you need to ace your exams in one workspace.
        </motion.p>

        {/* 4. Feature Pills Component */}
        <FeaturePills />

        {/* 5. CTA Section & Email Capture */}
        <div className="min-h-[56px] w-full flex items-center justify-center relative mt-1">
          <AnimatePresence mode="wait">
            {formState === "button" ? (
              <motion.div
                key="cta-buttons"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col sm:flex-row items-center gap-4 justify-center"
              >
                {/* Primary CTA button */}
                <button
                  id="hero-get-access-btn"
                  onClick={() => setFormState("form")}
                  className="px-8 py-3 text-[14px] font-semibold text-black bg-white rounded-full hover:bg-white/95 hover:scale-103 shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-300 cursor-pointer"
                >
                  Start Studying Free
                </button>

                {/* Secondary CTA button */}
                <button
                  id="hero-watch-demo-btn"
                  onClick={() => setActiveModal("demo")}
                  className="px-8 py-3 text-[14px] font-semibold text-white/90 bg-white/[0.04] border border-white/10 rounded-full hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 flex items-center gap-2 cursor-pointer backdrop-blur-md"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-white/80" />
                  <span>Watch Demo</span>
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="email-form-capture"
                id="hero-email-form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSubmit}
                className="flex items-center gap-2 pl-5 pr-1.5 py-1.5 text-[14px] font-medium border border-white/20 rounded-full bg-white/[0.02] backdrop-blur-md w-full max-w-[360px] focus-within:border-white/40 transition-colors duration-300 mx-auto"
              >
                <input
                  type="email"
                  id="hero-email-input"
                  required
                  disabled={formState === "success"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholderText}
                  autoFocus
                  className="bg-transparent text-white placeholder-white/40 outline-none w-full border-none font-sans text-[13px] md:text-[14px]"
                />
                <button
                  type="submit"
                  id="hero-email-submit"
                  disabled={formState === "success"}
                  className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                    formState === "success"
                      ? "bg-white text-black"
                      : "bg-white text-black hover:scale-105"
                  } cursor-pointer shrink-0`}
                >
                  {formState === "success" ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* 6. Demo Link & Stats Cards */}
        <div className="w-full flex flex-col items-center gap-3 mt-1">
          {/* Workspace demo link */}
          <button
            onClick={() => onScrollTo("workspace")}
            id="play-video-demo-btn"
            className="flex items-center gap-1.5 text-white/80 hover:text-indigo-400 transition-colors duration-300 text-[13px] font-semibold tracking-wide cursor-pointer bg-transparent border-none outline-none"
          >
            <span>▶ Explore the AI Workspace</span>
          </button>

          {/* Stats Panels */}
          <StatsCards />
        </div>
      </div>
    </section>
  );
};

export default Hero;
