import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
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
        <Hero onScrollTo={handleScrollTo} />
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
    </main>
  );
}

export default App;
