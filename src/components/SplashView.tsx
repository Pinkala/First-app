import React, { useEffect } from "react";
import { BookOpen, Sparkles, GraduationCap } from "lucide-react";
import { motion } from "motion/react";

interface SplashViewProps {
  onDismiss: () => void;
}

export default function SplashView({ onDismiss }: SplashViewProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 3200);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[580px] h-full w-full bg-[#f472b6] text-slate-950 overflow-hidden p-6 rounded-2xl border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] select-none">
      {/* Dynamic background neo patterns */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-24 h-24 border-4 border-slate-950 rounded-full bg-white"></div>
        <div className="absolute bottom-16 right-10 w-32 h-32 border-4 border-slate-950 bg-yellow-300"></div>
      </div>

      <div className="z-10 flex flex-col items-center text-center max-w-sm">
        {/* Logo Icon */}
        <motion.div
          initial={{ scale: 0.1, rotate: -45 }}
          animate={{ scale: [1, 1.1, 1], rotate: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="bg-white p-5 rounded-xl border-4 border-slate-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6 flex items-center justify-center"
        >
          <div className="relative">
            <GraduationCap className="h-16 w-16 text-slate-950 stroke-[2.5]" />
            <motion.div
              animate={{ opacity: [0, 1, 0], scale: [0.8, 1.3, 0.8] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute -top-1.5 -right-1.5"
            >
              <Sparkles className="h-6 w-6 text-yellow-500 fill-yellow-400 stroke-[2.5]" />
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-black tracking-tight text-slate-950 uppercase bg-yellow-300 px-4 py-2 border-3 border-slate-950 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-display"
        >
          Smart Study Hub
        </motion.h1>

        {/* Subtitle / Loader */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-xs text-slate-900 font-black font-mono tracking-wider uppercase mt-4 mb-8"
        >
          ✏️ Interactive Study Deck Hub
        </motion.p>

        {/* Beautiful simulated progress bar */}
        <div className="w-52 bg-white border-3 border-slate-950 rounded-full h-5 p-0.5 overflow-hidden mb-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.8, ease: "easeInOut" }}
            className="bg-slate-950 h-full rounded-full"
          />
        </div>

        {/* Bottom Credits in visual phone margins */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col items-center gap-3 mt-8"
        >
          <div className="text-[10px] text-slate-950 font-black uppercase tracking-widest flex items-center gap-1.5 font-mono px-3 py-1 bg-white border-2 border-slate-950 rounded-md">
            <BookOpen className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Curriculum v2.5 Active</span>
          </div>
          
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-950">
            Developed by <strong className="text-pink-700 bg-white/70 px-1 py-0.2 rounded-xs border border-slate-950">Unite Network Technology PVT. LTD.</strong>
          </span>
        </motion.div>
      </div>
    </div>
  );
}
