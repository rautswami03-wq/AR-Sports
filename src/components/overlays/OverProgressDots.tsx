import React from 'react';
import { motion } from 'framer-motion';

export interface OverProgressDotsProps {
  recentBalls?: string[];
  maxDots?: number;
  accentColor?: string;
  themeStyle?: 'bbl' | 'standard' | 'minimal';
}

/**
 * IPL Sustainability Green Dot-Ball Graphic (Leaf/Tree icon)
 * Scaled to fit circular/square ball tracker widgets.
 */
export const SustainabilityTreeIcon: React.FC<{ size?: number; color?: string; className?: string }> = ({
  size = 14,
  color = '#27E64B',
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ filter: `drop-shadow(0 0 3px ${color}aa)` }}
  >
    {/* Stylized IPL sustainability leaf/tree crown */}
    <path
      d="M12 2C12 2 7 6 7 11C7 13.5 8.8 15.6 11.2 16.3V21H12.8V16.3C15.2 15.6 17 13.5 17 11C17 6 12 2 12 2Z"
      fill={color}
    />
    {/* Inner leaf vein and stem */}
    <path
      d="M12 5V15M12 8L10 10M12 11L14 13M12 12L10 14"
      stroke="#0c3813"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

export const OverProgressDots: React.FC<OverProgressDotsProps> = ({
  recentBalls = ['.', '1', '4', 'W', '0', '6'],
  maxDots = 6,
}) => {
  // Ensure array has exactly maxDots length, padded with '.'
  const balls = [...recentBalls].slice(-maxDots);
  while (balls.length < maxDots) {
    balls.unshift('.');
  }

  const getBallInfo = (val: string) => {
    const v = val.toUpperCase().trim();
    if (v === 'W' || v.includes('WICKET')) {
      return {
        bg: 'bg-red-600 text-white border-red-400 shadow-[0_0_8px_rgba(220,38,38,0.6)]',
        isDot: false,
        label: 'W',
      };
    }
    if (v === '6' || v === 'SIX') {
      return {
        // Electric Pink (#FF207C)
        bg: 'bg-[#FF207C] text-white font-black border-[#ff549a] shadow-[0_0_10px_rgba(255,32,124,0.7)]',
        isDot: false,
        label: '6',
      };
    }
    if (v === '4' || v === 'FOUR') {
      return {
        // Coral Yellow (#FFDC35)
        bg: 'bg-[#FFDC35] text-slate-950 font-black border-[#ffe259] shadow-[0_0_8px_rgba(255,220,53,0.6)]',
        isDot: false,
        label: '4',
      };
    }
    // Sustainability Dot Ball: runs === 0 && !isWicket
    if (v === '0' || v === 'DOT') {
      return {
        bg: 'bg-[#0a1f12] text-[#27E64B] border border-[#27E64B]/50 shadow-[0_0_8px_rgba(39,230,75,0.45)]',
        isDot: true,
        label: '',
      };
    }
    if (v === '.') {
      return {
        bg: 'bg-slate-900/60 text-slate-500 border border-slate-700/60',
        isDot: false,
        label: '•',
      };
    }
    if (v.includes('WD')) {
      return {
        bg: 'bg-purple-600 text-white border-purple-400 shadow-purple-500/50',
        isDot: false,
        label: 'Wd',
      };
    }
    if (v.includes('NB')) {
      return {
        bg: 'bg-orange-600 text-white border-orange-400 shadow-orange-500/50',
        isDot: false,
        label: 'Nb',
      };
    }
    return {
      bg: 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-500/50',
      isDot: false,
      label: val,
    };
  };

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 shadow-lg">
      <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase mr-1">
        THIS OVER:
      </span>
      <div className="flex items-center gap-1">
        {balls.map((ball, i) => {
          const info = getBallInfo(ball);
          return (
            <motion.div
              key={i}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black tracking-tight border transition-all duration-300 ${info.bg}`}
            >
              {info.isDot ? (
                <SustainabilityTreeIcon size={14} color="#27E64B" />
              ) : (
                info.label
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default OverProgressDots;
