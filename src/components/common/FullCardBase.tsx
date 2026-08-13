import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { resolveThemeFromUrlOrStore } from '../../theme/presetThemes';

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
  tournament,
  children,
  width = 'w-[1100px]',
}) => {
  const { tournamentId, matchDetails } = useBroadcastStore();
  const theme = resolveThemeFromUrlOrStore(tournamentId, matchDetails.tournament || tournament);

  const accentColor = theme.primaryAccent || '#facc15';
  const isLight = theme.id === 'bbl_white';

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 p-6 bg-black/50 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }}
        transition={{ type: 'spring', damping: 24, stiffness: 200 }}
        className={`${width} pointer-events-auto shadow-2xl`}
      >
        <div
          className="rounded-2xl overflow-hidden border-2 shadow-2xl transition-all duration-300"
          style={{ borderColor: accentColor }}
        >
          {/* Top Banner */}
          <div
            className="px-8 py-4 border-b border-white/20 flex items-center justify-between shadow-inner"
            style={{ background: theme.headerGradient || 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)' }}
          >
            <div>
              <span
                className="text-xs font-black uppercase tracking-widest block mb-0.5"
                style={{ color: accentColor }}
              >
                {tournament || matchDetails.tournament || theme.name}
              </span>
              <h2 className="text-white text-2xl font-black uppercase tracking-wide drop-shadow-md">
                {title}
              </h2>
            </div>
            {subtitle && (
              <div
                className="border px-4 py-1.5 rounded-lg font-black text-sm uppercase tracking-wider text-slate-950 shadow-md"
                style={{ backgroundColor: accentColor, borderColor: accentColor }}
              >
                {subtitle}
              </div>
            )}
          </div>

          {/* Main Content */}
          <div
            className="p-6 transition-colors"
            style={{
              background: theme.cardBg || (isLight ? '#ffffff' : '#020617'),
              color: isLight ? '#0f172a' : '#ffffff'
            }}
          >
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
