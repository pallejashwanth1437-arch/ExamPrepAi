import React from "react";
import { motion } from "motion/react";
import { 
  MessageSquare, Play, Sparkles, Send, GraduationCap,
  LayoutDashboard, FolderClosed, ClipboardCheck, Layers, 
  FileText, Target, BarChart3 
} from "lucide-react";

const sidebarMenu = [
  { name: "Dashboard", icon: <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />, path: "/app.html#dashboard" },
  { name: "Documents", icon: <FolderClosed className="w-3.5 h-3.5 shrink-0" />, path: "/app.html#documents" },
  { name: "AI Chat", icon: <MessageSquare className="w-3.5 h-3.5 shrink-0" />, active: true, path: "/app.html#chat" },
  { name: "Quizzes", icon: <ClipboardCheck className="w-3.5 h-3.5 shrink-0" />, path: "/app.html#quizzes" },
  { name: "Flashcards", icon: <Layers className="w-3.5 h-3.5 shrink-0" />, path: "/app.html#flashcards" },
  { name: "Summaries", icon: <FileText className="w-3.5 h-3.5 shrink-0" />, path: "/app.html#summaries" },
  { name: "Important Qs", icon: <Target className="w-3.5 h-3.5 shrink-0" />, path: "/app.html#questions" },
  { name: "Analytics", icon: <BarChart3 className="w-3.5 h-3.5 shrink-0" />, path: "/app.html#analytics" },
];

const WorkspaceSection = () => {
  return (
    <section id="workspace" className="relative py-24 px-6 border-b border-white/5 w-full">
      <div className="max-w-5xl mx-auto flex flex-col gap-12">
        {/* Section Header */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-xs uppercase font-bold tracking-widest text-indigo-400 mb-3"
          >
            Product Tour
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="text-4xl md:text-5xl text-white font-medium tracking-tight mb-4"
          >
            The Study Command Center
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-white/60 text-sm md:text-base max-w-xl mx-auto leading-relaxed"
          >
            An integrated, high-productivity interface designed to transform dense textbooks and slides into active study workspaces.
          </motion.p>
        </div>

        {/* Mockup Dashboard Window */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
          className="w-full liquid-glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex flex-col h-[480px]"
        >
          {/* Mock Window Title Bar */}
          <div className="bg-white/[0.03] px-4 py-3 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
              <span className="text-[11px] text-white/40 font-semibold font-mono ml-2">workspace.examprep.ai</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span className="text-[10px] text-white/70 font-semibold tracking-wide">Gemini 2.5 Active</span>
            </div>
          </div>

          {/* Mock Main Workspace Body */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar (Left) - Navigation Menu */}
            <div className="w-[180px] md:w-[220px] bg-white/[0.01] border-r border-white/5 p-3 flex flex-col gap-4 select-none">
              <span className="text-[9px] uppercase font-bold tracking-widest text-white/30 px-2">Navigation</span>
              <div className="flex flex-col gap-1">
                {sidebarMenu.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.path}
                    className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold no-underline transition-all duration-200 ${
                      item.active
                        ? "bg-indigo-500/10 border border-indigo-500/20 text-indigo-200"
                        : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <span className={item.active ? "text-indigo-400" : "text-white/40"}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Chat Area (Center) */}
            <div className="flex-1 flex flex-col bg-transparent justify-between p-4 relative">
              <div className="flex flex-col gap-4 overflow-y-auto max-h-[340px] pr-2">
                {/* User Message */}
                <div className="flex items-start gap-3 justify-end">
                  <div className="bg-indigo-500/15 border border-indigo-500/25 rounded-2xl rounded-tr-sm p-3 max-w-[80%]">
                    <p className="text-white text-xs md:text-sm leading-relaxed">
                      Summarize Newtonian Gravity and state the formula.
                    </p>
                  </div>
                </div>

                {/* Assistant Message */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] shrink-0 font-bold">✦</div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-3 max-w-[85%] text-left">
                    <p className="text-white/90 text-xs md:text-sm leading-relaxed">
                      Newton's Law of Universal Gravitation states that any two bodies in the universe attract each other with a force that is directly proportional to the product of their masses and inversely proportional to the square of the distance between their centers.
                    </p>
                    <div className="mt-3 p-2 bg-black/40 rounded border border-white/5 font-mono text-[11px] text-indigo-300">
                      F = G * (m1 * m2) / r²
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Input Bar */}
              <div className="relative mt-2">
                <input
                  type="text"
                  placeholder="Ask a question about Physics_Ch5.pdf..."
                  disabled
                  className="w-full bg-white/[0.03] border border-white/10 rounded-full py-2.5 pl-4 pr-10 text-xs text-white/60 placeholder-white/30 outline-none"
                />
                <button className="absolute right-1.5 top-1.5 w-7 h-7 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Actions (Right - Hidden on mobile) */}
            <div className="hidden lg:flex w-[200px] bg-white/[0.01] border-l border-white/5 p-4 flex-col gap-4 select-none">
              <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">AI Generators</span>
              <div className="flex flex-col gap-3">
                <a href="/app.html#quizzes" className="p-3 bg-white/[0.02] border border-white/5 hover:border-white/15 rounded-xl flex flex-col gap-1 hover:bg-white/[0.05] transition-all no-underline text-left">
                  <span className="text-xs font-semibold text-white">Generate Quiz</span>
                  <span className="text-[9px] text-white/40">Generate 10 questions</span>
                </a>
                <a href="/app.html#flashcards" className="p-3 bg-white/[0.02] border border-white/5 hover:border-white/15 rounded-xl flex flex-col gap-1 hover:bg-white/[0.05] transition-all no-underline text-left">
                  <span className="text-xs font-semibold text-indigo-300">Curate Flashcards</span>
                  <span className="text-[9px] text-white/40">Generated: 24 active cards</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* View Workspace Action button */}
        <div className="flex justify-center mt-2">
          <a
            href="/app.html"
            className="px-8 py-3 text-[14px] font-semibold text-black bg-white rounded-full hover:bg-white/95 hover:scale-103 shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-300 cursor-pointer no-underline"
          >
            Open Live Workspace
          </a>
        </div>
      </div>
    </section>
  );
};

export default WorkspaceSection;
