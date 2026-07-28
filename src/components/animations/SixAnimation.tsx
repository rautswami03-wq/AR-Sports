import React from 'react';
import { motion } from 'framer-motion';

export const SixAnimation: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.3, rotate: -10 }}
      animate={{ opacity: 1, scale: 1.15, rotate: 0 }}
      exit={{ opacity: 0, scale: 1.5, rotate: 10 }}
      transition={{ type: 'spring', damping: 14, stiffness: 220 }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
    >
      <div className="bg-gradient-to-r from-purple-700 via-indigo-500 to-purple-700 text-white px-28 py-10 rounded-3xl border-4 border-purple-300 shadow-[0_0_100px_rgba(168,85,247,0.9)] transform skew-x-[-15deg] text-center">
        <h1 className="text-9xl font-black italic uppercase tracking-tighter text-broadcast-gold">
          MAXIMUM SIX!
        </h1>
        <span className="text-2xl font-black uppercase tracking-widest text-purple-200 block mt-2">
          MASSIVE HIT • 6 RUNS
        </span>
      </div>
    </motion.div>
  );
};
