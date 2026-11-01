import React from 'react';
import { motion } from 'framer-motion';

export type StingType = 'FOUR' | 'SIX' | 'WICKET' | 'FREE_HIT' | 'MILESTONE' | 'CUSTOM';

export interface StingBaseProps {
  type?: StingType;
  text?: string;
  subText?: string;
  customGradient?: string;
  className?: string;
}

const STING_CONFIGS: Record<
  StingType,
  { defaultText: string; gradient: string; accentColor: string; shadowColor: string }
> = {
  FOUR: {
    defaultText: 'FOUR',
    gradient: 'linear-gradient(90deg, #FF5A00 0%, #FFB703 40%, #0077B6 100%)',
    accentColor: '#FFDC35',
    shadowColor: 'rgba(255, 90, 0, 0.75)',
  },
  SIX: {
    defaultText: 'MAXIMUM SIX',
    gradient: 'linear-gradient(90deg, #7209B7 0%, #F72585 45%, #FF5A00 100%)',
    accentColor: '#FFF',
    shadowColor: 'rgba(247, 37, 133, 0.85)',
  },
  WICKET: {
    defaultText: 'OUT! WICKET',
    gradient: 'linear-gradient(90deg, #990000 0%, #E63946 50%, #1A0B2E 100%)',
    accentColor: '#FFFFFF',
    shadowColor: 'rgba(230, 57, 70, 0.85)',
  },
  FREE_HIT: {
    defaultText: 'FREE HIT',
    gradient: 'linear-gradient(90deg, #0077B6 0%, #00B4D8 45%, #90E0EF 100%)',
    accentColor: '#FFDC35',
    shadowColor: 'rgba(0, 180, 216, 0.85)',
  },
  MILESTONE: {
    defaultText: '50 MILESTONE',
    gradient: 'linear-gradient(90deg, #D4AF37 0%, #FFDF73 50%, #996515 100%)',
    accentColor: '#1A0B2E',
    shadowColor: 'rgba(212, 175, 55, 0.85)',
  },
  CUSTOM: {
    defaultText: 'EVENT',
    gradient: 'linear-gradient(90deg, #FF5A00 0%, #FFB703 100%)',
    accentColor: '#FFFFFF',
    shadowColor: 'rgba(255, 90, 0, 0.75)',
  },
};

export const StingBase: React.FC<StingBaseProps> = ({
  type = 'FOUR',
  text,
  subText,
  customGradient,
  className = '',
}) => {
  const config = STING_CONFIGS[type] || STING_CONFIGS.FOUR;
  const displayText = text || config.defaultText;
  const background = customGradient || config.gradient;

  return (
    <motion.div
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: 1, opacity: 1 }}
      exit={{ scaleY: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-1/2 left-0 w-full -translate-y-1/2 z-[100] select-none font-sans overflow-hidden flex items-center justify-center py-6 md:py-8 shadow-[0_15px_60px_rgba(0,0,0,0.95)] ${className}`}
      style={{
        background,
        boxShadow: `0 0 50px ${config.shadowColor}, 0 20px 60px rgba(0,0,0,0.95)`,
        borderTop: '4px solid rgba(255,255,255,0.7)',
        borderBottom: '4px solid rgba(255,255,255,0.7)',
      }}
    >
      {/* Background Animated Sheen Stripes */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(255,255,255,0.4) 35px, rgba(255,255,255,0.4) 70px)',
        }}
      />

      {/* Central Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
        <motion.h1
          initial={{ scale: 0.75, letterSpacing: '0.05em' }}
          animate={{ scale: [0.85, 1.05, 1], letterSpacing: ['0.05em', '0.15em', '0.12em'] }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="text-6xl md:text-8xl lg:text-9xl font-black uppercase italic tracking-widest text-white drop-shadow-[0_8px_16px_rgba(0,0,0,0.95)]"
          style={{
            WebkitTextStroke: '2px rgba(0,0,0,0.4)',
            color: config.accentColor,
            textShadow: '0 4px 18px rgba(0,0,0,0.8), 0 0 30px rgba(255,255,255,0.4)',
          }}
        >
          {displayText}
        </motion.h1>

        {subText && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="text-xl md:text-2xl font-bold tracking-[0.25em] uppercase text-white/95 mt-1 drop-shadow-md"
          >
            {subText}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

