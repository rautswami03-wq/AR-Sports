import React from 'react';
import { motion } from 'framer-motion';

export const WicketAnimation: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ type: 'spring', damping: 20, stiffness: 220 }}
      className="absolute bottom-0 inset-x-0 h-20 z-50 flex items-center justify-between bg-gradient-to-r from-red-700 via-rose-600 to-red-700 border-t-4 border-rose-300 shadow-[0_-10px_40px_rgba(225,29,72,0.8)] overflow-hidden font-sans"
    >
      {/* Left Watermark Repeated Text */}
      <div className="flex items-center gap-6 opacity-30 text-red-950 font-black text-4xl uppercase tracking-tighter select-none whitespace-nowrap overflow-hidden">
        <span>WICKET</span>
        <span>WICKET</span>
        <span>WICKET</span>
      </div>

      {/* Center 3D Box */}
      <div className="bg-slate-950 px-16 py-3 border-2 border-white rounded-xl shadow-2xl z-10 transform skew-x-[-10deg]">
        <h1 className="text-4xl font-black text-white italic uppercase tracking-widest drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]">
          WICKET
        </h1>
      </div>

      {/* Right Watermark Repeated Text */}
      <div className="flex items-center gap-6 opacity-30 text-red-950 font-black text-4xl uppercase tracking-tighter select-none whitespace-nowrap overflow-hidden">
        <span>WICKET</span>
        <span>WICKET</span>
        <span>WICKET</span>
      </div>
    </motion.div>
  );
};
