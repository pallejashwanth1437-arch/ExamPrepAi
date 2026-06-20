import React from "react";
import { motion } from "motion/react";
import { GraduationCap } from "lucide-react";

const Navbar = ({ onScrollTo }) => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-0 left-0 right-0 z-20 px-6 py-5 w-full shrink-0"
    >
      <div className="liquid-glass rounded-full px-6 py-3 flex items-center justify-between max-w-5xl mx-auto backdrop-blur-md">
        {/* Left Side: Logo */}
        <div className="flex items-center gap-8">
          <a href="#" id="nav-logo-link" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <GraduationCap className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300" />
            </div>
            <span className="text-white font-bold text-base tracking-tight bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
              ExamPrep AI
            </span>
          </a>

          {/* Desktop Navigation Links (Wired to scroll triggers) */}
          <div className="hidden md:flex items-center gap-8 text-white/70 text-sm font-medium">
            <button
              onClick={() => onScrollTo("features")}
              id="nav-features-link"
              className="hover:text-white transition-colors duration-300 cursor-pointer bg-transparent border-none outline-none font-medium p-0"
            >
              Features
            </button>
            <button
              onClick={() => onScrollTo("workspace")}
              id="nav-workspace-link"
              className="hover:text-white transition-colors duration-300 cursor-pointer bg-transparent border-none outline-none font-medium p-0"
            >
              Workspace
            </button>
            <button
              onClick={() => onScrollTo("analytics")}
              id="nav-analytics-link"
              className="hover:text-white transition-colors duration-300 cursor-pointer bg-transparent border-none outline-none font-medium p-0"
            >
              Analytics
            </button>
            <button
              onClick={() => onScrollTo("resources")}
              id="nav-resources-link"
              className="hover:text-white transition-colors duration-300 cursor-pointer bg-transparent border-none outline-none font-medium p-0"
            >
              Resources
            </button>
            <button
              onClick={() => onScrollTo("about")}
              id="nav-about-link"
              className="hover:text-white transition-colors duration-300 cursor-pointer bg-transparent border-none outline-none font-medium p-0"
            >
              About
            </button>
          </div>
        </div>

        {/* Right Side: Auth Actions */}
        <div className="flex items-center gap-5">
          <a
            href="/app.html#signup"
            id="nav-signup-btn"
            className="text-white/80 hover:text-white transition-colors text-xs font-semibold cursor-pointer no-underline"
          >
            Sign Up
          </a>
          <a
            href="/app.html#login"
            id="nav-login-btn"
            className="liquid-glass rounded-full px-5 py-1.5 text-xs font-semibold text-white border border-white/5 hover:border-white/20 hover:bg-white/[0.02] transition-all duration-300 cursor-pointer block no-underline"
          >
            Login
          </a>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
