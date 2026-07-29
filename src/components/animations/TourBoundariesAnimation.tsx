import React from 'react';
import { motion } from 'framer-motion';

export const TourBoundariesAnimation: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ type: 'spring', damping: 20, stiffness: 220 }}
      className="absolute bottom-0 inset-x-0 h-24 z-50 flex items-center justify-between bg-gradient-to-r from-cyan-600 via-sky-500 to-cyan-600 border-t-4 border-cyan-200 shadow-[0_-10px_50px_rgba(6,182,212,0.9)] overflow-hidden font-sans"
    >
      {/* Background Watermark */}
      <div className="flex items-center gap-6 opacity-25 text-slate-950 font-black text-5xl uppercase tracking-tighter select-none whitespace-nowrap overflow-hidden">
        <span>TOUR BOUNDARY</span>
        <span>TOUR BOUNDARY</span>
        <span>TOUR BOUNDARY</span>
      </div>

      {/* Center 3D Box */}
      <div className="bg-slate-950 px-16 py-3 border-4 border-cyan-400 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.8)] z-10 transform skew-x-[-10deg] flex items-center gap-4">
        <span className="text-3xl">🚀</span>
        <h1 className="text-4xl font-black text-cyan-300 italic uppercase tracking-widest drop-shadow-[0_2px_10px_rgba(6,182,212,0.8)]">
          TOUR BOUNDARY!
        </h1>
        <span className="text-3xl">⚡</span>
      </div>

      {/* Right Watermark */}
      <div className="flex items-center gap-6 opacity-25 text-slate-950 font-black text-5xl uppercase tracking-tighter select-none whitespace-nowrap overflow-hidden">
        <span>TOUR BOUNDARY</span>
        <span>TOUR BOUNDARY</span>
        <span>TOUR BOUNDARY</span>
      </div>
    </motion.div>
  );
};
