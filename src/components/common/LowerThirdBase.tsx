import React from 'react';
import { motion } from 'framer-motion';

interface LowerThirdBaseProps {
  title: string;
  subtitle?: string;
  category?: string;
  primaryColor?: string;
  children: React.ReactNode;
}

export const LowerThirdBase: React.FC<LowerThirdBaseProps> = ({
  title,
  subtitle,
  category,
  primaryColor = '#0284c7',
  children,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 80, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 60, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 220 }}
      className="absolute bottom-16 left-24 w-[750px] z-40"
    >
      <div className="glass-panel rounded-xl border-l-8 overflow-hidden shadow-2xl" style={{ borderLeftColor: primaryColor }}>
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-6 py-2 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {category && (
              <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded tracking-wider uppercase">
                {category}
              </span>
            )}
            <h3 className="text-white font-extrabold text-lg uppercase tracking-wide drop-shadow">
              {title}
            </h3>
          </div>
          {subtitle && (
            <span className="text-slate-400 font-semibold text-xs uppercase tracking-wider">
              {subtitle}
            </span>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 bg-slate-950/80 backdrop-blur-md">
          {children}
        </div>
      </div>
    </motion.div>
  );
};
