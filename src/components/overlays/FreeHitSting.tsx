import React from 'react';
import { motion } from 'framer-motion';

export interface FreeHitStingProps {
  className?: string;
}

export const FreeHitSting: React.FC<FreeHitStingProps> = ({
  className = '',
}) => {
  return (
    <div
      className={`fixed top-1/2 left-0 w-full -translate-y-1/2 z-[100] select-none font-sans overflow-hidden flex items-center justify-center pointer-events-none ${className}`}
      data-overlay="free-hit-sting"
    >
      {/* ── LEFT PANEL: Slides in from Left (-100% -> 0) ── */}
      <motion.div
        initial={{ x: '-100%', skewX: -12 }}
        animate={{ x: '0%', skewX: -12 }}
        exit={{ x: '-100%', skewX: -12 }}
        transition={{ type: 'spring', stiffness: 340, damping: 26 }}
        className="absolute left-0 top-0 bottom-0 w-[55%] bg-gradient-to-r from-[#003566] via-[#0077B6] to-[#00B4D8] border-y-4 border-[#90E0EF] shadow-[0_0_50px_rgba(0,180,216,0.8)] overflow-hidden"
      >
        {/* Repeating text watermark background */}
        <div className="absolute inset-0 flex items-center opacity-25 whitespace-nowrap overflow-hidden select-none">
          <span className="text-7xl font-black italic tracking-widest text-[#90E0EF] uppercase pr-8">
            FREE HIT FREE HIT FREE HIT FREE HIT FREE HIT FREE HIT
          </span>
        </div>
      </motion.div>

      {/* ── RIGHT PANEL: Slides in from Right (100% -> 0) ── */}
      <motion.div
        initial={{ x: '100%', skewX: -12 }}
        animate={{ x: '0%', skewX: -12 }}
        exit={{ x: '100%', skewX: -12 }}
        transition={{ type: 'spring', stiffness: 340, damping: 26 }}
        className="absolute right-0 top-0 bottom-0 w-[55%] bg-gradient-to-l from-[#003566] via-[#0077B6] to-[#00B4D8] border-y-4 border-[#90E0EF] shadow-[0_0_50px_rgba(0,180,216,0.8)] overflow-hidden"
      >
        {/* Repeating text watermark background */}
        <div className="absolute inset-0 flex items-center justify-end opacity-25 whitespace-nowrap overflow-hidden select-none">
          <span className="text-7xl font-black italic tracking-widest text-[#90E0EF] uppercase pl-8">
            FREE HIT FREE HIT FREE HIT FREE HIT FREE HIT FREE HIT
          </span>
        </div>
      </motion.div>

      {/* ── CENTER BROADCAST CONTENT (Zooms & Glows in Center) ── */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: [0.75, 1.08, 1], opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-20 flex flex-col items-center justify-center py-6 md:py-8 px-12 text-center"
      >
        {/* Top Mini Pill */}
        <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-black/60 border border-cyan-300 text-xs font-black uppercase tracking-[0.25em] text-[#FFDC35] mb-2 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-[#FFDC35] animate-ping" />
          <span>NO BALL PENALTY</span>
        </div>

        {/* Massive Central Title */}
        <h1
          className="text-7xl md:text-9xl lg:text-[10rem] font-black italic uppercase tracking-wider text-transparent bg-clip-text leading-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.95)]"
          style={{
            backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #90E0EF 45%, #00B4D8 100%)',
            WebkitTextStroke: '3px rgba(0, 0, 0, 0.65)',
            textShadow: '0 0 40px rgba(0, 180, 216, 0.9), 0 0 80px rgba(144, 224, 239, 0.6)',
          }}
        >
          FREE HIT
        </h1>

        {/* Bottom Subtitle Pill */}
        <p className="mt-2 text-sm md:text-lg font-black uppercase tracking-[0.3em] text-[#FFDC35] drop-shadow-md bg-black/50 px-6 py-1 rounded-md border border-white/20">
          BATTER CANNOT BE DISMISSED CAUGHT • SWING FREELY
        </p>
      </motion.div>
    </div>
  );
};

