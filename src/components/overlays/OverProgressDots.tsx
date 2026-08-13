import React from 'react';
import { motion } from 'framer-motion';

interface OverProgressDotsProps {
  recentBalls?: string[];
  maxDots?: number;
  accentColor?: string;
  themeStyle?: 'bbl' | 'standard' | 'minimal';
}

export const OverProgressDots: React.FC<OverProgressDotsProps> = ({
  recentBalls = ['.', '1', '4', 'W', '0', '6'],
  maxDots = 6,
  accentColor = '#00FF87',
  themeStyle = 'bbl',
}) => {
  // Ensure array has exactly maxDots length, padded with '.'
  const balls = [...recentBalls].slice(-maxDots);
  while (balls.length < maxDots) {
    balls.unshift('.');
  }

  const getBallColor = (val: string) => {
    switch (val.toUpperCase()) {
      case 'W':
      case 'WICKET':
        return 'bg-red-600 text-white border-red-400 shadow-red-500/50';
      case '4':
      case 'FOUR':
        return 'bg-blue-600 text-white border-blue-400 shadow-blue-500/50';
      case '6':
      case 'SIX':
        return 'bg-amber-500 text-slate-950 font-black border-amber-300 shadow-amber-500/50';
      case '0':
      case '.':
        return 'bg-slate-800/80 text-slate-400 border-slate-700';
      default:
        return 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-500/50';
    }
  };

  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
      <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mr-1">THIS OVER:</span>
      <div className="flex items-center gap-1">
        {balls.map((ball, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, delay: i * 0.05 }}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black tracking-tight border shadow-sm transition-all duration-300 ${getBallColor(
              ball
            )}`}
          >
            {ball === '.' ? '•' : ball}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
