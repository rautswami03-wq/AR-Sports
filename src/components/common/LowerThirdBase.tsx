import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { resolveThemeFromUrlOrStore } from '../../theme/presetThemes';

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
  const { tournamentId, matchDetails } = useBroadcastStore();
  const theme = resolveThemeFromUrlOrStore(tournamentId, matchDetails.tournament);

  const accentColor = theme.primaryAccent || primaryColor;
  const isLight = theme.id === 'bbl_white';

  return (
    <motion.div
      initial={{ opacity: 0, y: 80, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 60, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 220 }}
      className="absolute bottom-16 left-24 w-[750px] z-40"
    >
      <div
        className="rounded-xl border-l-8 overflow-hidden shadow-2xl border border-white/20 transition-all duration-300"
        style={{ borderLeftColor: accentColor }}
      >
        {/* Header Ribbon */}
        <div
          className="px-6 py-2 border-b border-white/10 flex items-center justify-between shadow-inner"
          style={{ background: theme.headerGradient || 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)' }}
        >
          <div className="flex items-center gap-3">
            {category && (
              <span
                className="text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded tracking-wider uppercase shadow-md"
                style={{ backgroundColor: accentColor }}
              >
                {category}
              </span>
            )}
            <h3 className="text-white font-black text-lg uppercase tracking-wide drop-shadow-md">
              {title}
            </h3>
          </div>
          {subtitle && (
            <span className="text-slate-200 font-bold text-xs uppercase tracking-wider opacity-90">
              {subtitle}
            </span>
          )}
        </div>

        {/* Content Body */}
        <div
          className="p-5 backdrop-blur-md transition-colors"
          style={{
            background: theme.cardBg || (isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.92)'),
            color: isLight ? '#0f172a' : '#ffffff'
          }}
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
};
