import React from 'react';
import { motion } from 'framer-motion';

export const FreeHitAnimation: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ type: 'spring', damping: 20, stiffness: 220 }}
      className="absolute bottom-0 inset-x-0 h-20 z-50 flex items-center justify-between bg-gradient-to-r from-sky-600 via-cyan-500 to-sky-600 border-t-4 border-cyan-300 shadow-[0_-10px_40px_rgba(6,182,212,0.8)] overflow-hidden font-sans"
    >
      {/* Left Watermark Repeated Text */}
      <div className="flex items-center gap-6 opacity-30 text-sky-950 font-black text-4xl uppercase tracking-tighter select-none whitespace-nowrap overflow-hidden">
        <span>FREE HIT</span>
        <span>FREE HIT</span>
        <span>FREE HIT</span>
      </div>

      {/* Center 3D Box */}
      <div className="bg-slate-950 px-16 py-3 border-2 border-white rounded-xl shadow-2xl z-10 transform skew-x-[-10deg]">
        <h1 className="text-4xl font-black text-white italic uppercase tracking-widest drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]">
          FREE HIT
        </h1>
      </div>

      {/* Right Watermark Repeated Text */}
      <div className="flex items-center gap-6 opacity-30 text-sky-950 font-black text-4xl uppercase tracking-tighter select-none whitespace-nowrap overflow-hidden">
        <span>FREE HIT</span>
        <span>FREE HIT</span>
        <span>FREE HIT</span>
      </div>
    </motion.div>
  );
};
