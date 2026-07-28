import React from 'react';
import { motion } from 'framer-motion';

interface FullCardBaseProps {
  title: string;
  subtitle?: string;
  tournament?: string;
  children: React.ReactNode;
  width?: string;
}

export const FullCardBase: React.FC<FullCardBaseProps> = ({
  title,
  subtitle,
  tournament = 'CRICKET BROADCAST',
  children,
  width = 'w-[1100px]',
}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }}
        transition={{ type: 'spring', damping: 24, stiffness: 200 }}
        className={`${width} pointer-events-auto shadow-2xl`}
      >
        <div className="glass-panel-dark rounded-2xl overflow-hidden border border-slate-700/60">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-sky-950 px-8 py-4 border-b border-sky-500/30 flex items-center justify-between">
            <div>
              <span className="text-sky-400 text-xs font-bold uppercase tracking-widest block mb-0.5">
                {tournament}
              </span>
              <h2 className="text-white text-2xl font-black uppercase tracking-wide drop-shadow-md">
                {title}
              </h2>
            </div>
            {subtitle && (
              <div className="bg-slate-900/90 border border-white/10 px-4 py-1.5 rounded-lg text-amber-400 font-bold text-sm uppercase tracking-wider">
                {subtitle}
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="p-6 bg-slate-950/90 text-white">
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
