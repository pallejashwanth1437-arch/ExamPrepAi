import React, { useEffect, useRef } from "react";
import Hls from "hls.js";
import { motion } from "motion/react";

const BackgroundVideo = () => {
  const videoRef = useRef(null);
  const videoUrl = "https://stream.mux.com/kimF2ha9zLrX64H00UgLGPflCzNtl1T0215MlAmeOztv8.m3u8";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls = null;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS support (Safari/iOS)
      video.src = videoUrl;
    } else if (Hls.isSupported()) {
      // hls.js fallback for standard browsers
      hls = new Hls({
        maxMaxBufferLength: 8,
        enableWorker: true,
        lowLatencyMode: true,
      });
      hls.loadSource(videoUrl);
      hls.attachMedia(video);
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [videoUrl]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* 1. HTML5 Video Player */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover opacity-100"
      />

      {/* 2. 70% Dark Overlay for text readability */}
      <div className="absolute inset-0 bg-black/70 z-1" />

      {/* 3. Blue/Purple Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/10 via-transparent to-purple-950/20 z-2 mix-blend-color-dodge" />
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-indigo-500/5 z-2" />

      {/* 4. Soft Vignette Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.9)_100%)] z-2" />

      {/* 5. Spotlight behind hero text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-indigo-500/8 rounded-full blur-[140px] z-2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-purple-500/8 rounded-full blur-[120px] z-2" />

      {/* 6. Animated grid backdrop overlay */}
      <div className="absolute inset-0 bg-grid opacity-30 z-3" />

      {/* 7. Floating AI-inspired Particle/Neural Glows */}
      <div className="absolute inset-0 z-2 overflow-hidden">
        {/* Glow Node 1 */}
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -60, 20, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[20%] left-[15%] w-72 h-72 rounded-full bg-indigo-500/5 blur-[90px]"
        />

        {/* Glow Node 2 */}
        <motion.div
          animate={{
            x: [0, -30, 50, 0],
            y: [0, 50, -30, 0],
            scale: [1, 0.95, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[20%] right-[15%] w-96 h-96 rounded-full bg-purple-500/5 blur-[110px]"
        />

        {/* Glow Node 3 */}
        <motion.div
          animate={{
            x: [0, 30, -30, 0],
            y: [0, 30, 30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[60%] left-[45%] w-48 h-48 rounded-full bg-blue-500/5 blur-[80px]"
        />
      </div>
    </div>
  );
};

export default BackgroundVideo;
