import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';

export const HatTrickAnimation: React.FC = () => {
  const { clearAnimation } = useBroadcastStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      clearAnimation();
    }, 4000);
    return () => clearTimeout(timer);
  }, [clearAnimation]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 80 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 80 }}
      transition={{ type: 'spring', damping: 18, stiffness: 200 }}
      onClick={clearAnimation}
      className="absolute bottom-0 inset-x-0 h-24 z-50 flex items-center justify-between bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 border-t-4 border-yellow-200 shadow-[0_-10px_50px_rgba(234,179,8,0.9)] overflow-hidden font-sans cursor-pointer"
    >
      {/* Background Watermark */}
      <div className="flex items-center gap-6 opacity-25 text-amber-950 font-black text-5xl uppercase tracking-tighter select-none whitespace-nowrap overflow-hidden">
        <span>HAT-TRICK BALL</span>
        <span>HAT-TRICK BALL</span>
        <span>HAT-TRICK BALL</span>
      </div>

      {/* Center Animated Badge */}
      <div className="bg-slate-950 px-16 py-3 border-4 border-amber-300 rounded-2xl shadow-[0_0_30px_rgba(251,191,36,0.8)] z-10 transform skew-x-[-12deg] flex items-center gap-4">
        <span className="text-3xl">🎩</span>
        <h1 className="text-4xl font-black text-amber-400 italic uppercase tracking-widest drop-shadow-[0_2px_10px_rgba(251,191,36,0.8)]">
          HAT-TRICK BALL!
        </h1>
        <span className="text-3xl">🔥</span>
      </div>

      {/* Right Watermark */}
      <div className="flex items-center gap-6 opacity-25 text-amber-950 font-black text-5xl uppercase tracking-tighter select-none whitespace-nowrap overflow-hidden">
        <span>HAT-TRICK BALL</span>
        <span>HAT-TRICK BALL</span>
        <span>HAT-TRICK BALL</span>
      </div>
    </motion.div>
  );
};
