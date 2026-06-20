import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import Hls from "hls.js";
import BackgroundVideo from "./components/BackgroundVideo";
import FloatingDashboard from "./components/FloatingDashboard";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

// Import the new scroll sections
import FeaturesSection from "./components/FeaturesSection";
import WorkspaceSection from "./components/WorkspaceSection";
import AnalyticsSection from "./components/AnalyticsSection";
import ResourcesSection from "./components/ResourcesSection";
import AboutSection from "./components/AboutSection";

function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // null | 'demo'
  const modalVideoRef = useRef(null);
  const videoUrl = "https://stream.mux.com/kimF2ha9zLrX64H00UgLGPflCzNtl1T0215MlAmeOztv8.m3u8";

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsHovering(true);
    };
    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // HLS stream loader inside the Demo Modal
  useEffect(() => {
    if (activeModal !== "demo") return;

    let hls = null;
    const video = modalVideoRef.current;

    const initTimeout = setTimeout(() => {
      if (!video) return;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoUrl;
      } else if (typeof Hls !== "undefined" && Hls.isSupported()) {
        hls = new Hls({
          maxMaxBufferLength: 8,
          enableWorker: true,
          lowLatencyMode: true,
        });
        hls.loadSource(videoUrl);
        hls.attachMedia(video);
      }
    }, 150);

    return () => {
      clearTimeout(initTimeout);
      if (hls) {
        hls.destroy();
      }
    };
  }, [activeModal]);

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="relative bg-black min-h-screen w-screen flex flex-col selection:bg-white selection:text-black shrink-0 overflow-y-auto overflow-x-hidden">
      {/* Cinematic HLS Background Video & Overlays (Fixed in place) */}
      <BackgroundVideo />

      {/* Futuristic Mouse-following Glow Layer (Fixed in place) */}
      <div
        className="pointer-events-none fixed inset-0 z-2 transition-opacity duration-300"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.08), transparent 85%)`,
        }}
      />

      {/* Header Menu */}
      <Navbar onScrollTo={handleScrollTo} />

      {/* 1. Main Welcome Hero Screen */}
      <div className="relative w-full flex flex-col min-h-screen justify-center relative">
        {/* Blurred Parallax Floating Workspace Dashboard Previews (Drifts only behind Hero) */}
        <FloatingDashboard />
        <Hero setActiveModal={setActiveModal} onScrollTo={handleScrollTo} />
      </div>

      {/* 2. Scrollable Features Section */}
      <FeaturesSection />

      {/* 3. Scrollable Workspace Tour Section */}
      <WorkspaceSection />

      {/* 4. Scrollable Analytics Insights Section */}
      <AnalyticsSection />

      {/* 5. Scrollable Resources Guides Section */}
      <ResourcesSection />

      {/* 6. Scrollable About Platform Section */}
      <AboutSection />

      {/* Watch Demo Modal */}
      <AnimatePresence>
        {activeModal === "demo" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-6"
          >
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-3xl bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-2"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
                <video
                  ref={modalVideoRef}
                  autoPlay
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default App;
