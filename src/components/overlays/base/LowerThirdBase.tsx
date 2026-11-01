import React from 'react';
import { motion } from 'framer-motion';

export interface LowerThirdBaseProps {
  teamColor?: string;
  teamLogo?: string;
  teamName?: string;
  playerName?: string;
  playerRole?: string;
  rightContent?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const LowerThirdBase: React.FC<LowerThirdBaseProps> = ({
  teamColor = '#FF5A00',
  teamLogo,
  teamName,
  playerName,
  playerRole,
  rightContent,
  children,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 120, opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed bottom-8 left-0 right-0 mx-auto w-[1180px] max-w-[96vw] h-[105px] flex items-stretch z-50 select-none font-sans drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] ${className}`}
    >
      {/* LEFT: Team color block with curved edge */}
      <div
        className="relative flex items-center justify-center px-6 min-w-[220px] shadow-2xl z-20 overflow-hidden"
        style={{
          backgroundColor: teamColor,
          borderRadius: '24px 0 0 24px',
          boxShadow: `inset -8px 0 20px rgba(0,0,0,0.35), 0 0 20px ${teamColor}66`,
        }}
      >
        {/* Subtle diagonal angled gloss */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/20 pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3.5 text-white">
          {teamLogo ? (
            <img
              src={teamLogo}
              alt={teamName || 'Team'}
              className="w-14 h-14 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-black/30 border border-white/30 flex items-center justify-center font-black text-xl tracking-wider">
              {teamName?.substring(0, 3).toUpperCase() || 'IPL'}
            </div>
          )}

          <div className="flex flex-col">
            <span className="text-xl font-black uppercase tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
              {teamName || 'TEAM'}
            </span>
            {playerRole && (
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/80">
                {playerRole}
              </span>
            )}
          </div>
        </div>

        {/* Orange Accent Notch */}
        <div className="absolute top-0 right-0 bottom-0 w-2 bg-[#FF5A00]" />
      </div>

      {/* CENTER & RIGHT: Dark glassmorphism data card */}
      <div
        className="relative flex-1 flex items-center justify-between px-8 bg-[#0B132B]/85 backdrop-blur-md border-y-2 border-r-2 border-white/15 text-white z-10"
        style={{
          borderRadius: '0 24px 24px 0',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 15px 35px rgba(0,0,0,0.7)',
        }}
      >
        {/* Orange top accent border */}
        <div className="absolute top-0 left-0 right-6 h-[3px] bg-gradient-to-r from-[#FF5A00] via-[#FFB703] to-transparent" />

        {/* Player Name / Primary Information */}
        <div className="flex flex-col justify-center min-w-[240px]">
          {playerName && (
            <h3 className="text-2xl md:text-3xl font-black tracking-wide text-white drop-shadow-md uppercase">
              {playerName}
            </h3>
          )}
          {children}
        </div>

        {/* Right-Side Data Metrics Strip */}
        {rightContent && (
          <div className="flex items-center gap-6 md:gap-8 ml-auto">
            {rightContent}
          </div>
        )}
      </div>
    </motion.div>
  );
};

