import React from 'react';
import { motion } from 'framer-motion';

interface TargetProgressBarProps {
  targetRuns?: number;
  currentRuns?: number;
  remainingBalls?: number;
  requiredRunRate?: string | number;
  primaryAccent?: string;
}

export const TargetProgressBar: React.FC<TargetProgressBarProps> = ({
  targetRuns = 180,
  currentRuns = 124,
  remainingBalls = 32,
  requiredRunRate = '10.5',
  primaryAccent = '#38bdf8',
}) => {
  const percentage = Math.min(100, Math.max(0, (currentRuns / Math.max(1, targetRuns)) * 100));
  const runsNeeded = Math.max(0, targetRuns - currentRuns);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl p-2.5 shadow-2xl backdrop-blur-md text-white flex flex-col gap-1.5"
    >
      <div className="flex items-center justify-between text-xs font-black tracking-wide uppercase">
        <span className="flex items-center gap-1.5 text-amber-400">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          TARGET: {targetRuns}
        </span>
        <span className="text-slate-300">
          NEED <span className="text-emerald-400 text-sm">{runsNeeded}</span> RUNS IN <span className="text-cyan-400 text-sm">{remainingBalls}</span> BALLS
        </span>
        <span className="bg-slate-800 text-sky-400 px-2 py-0.5 rounded border border-slate-700 font-mono">
          RRR: {requiredRunRate}
        </span>
      </div>

      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-sky-500 via-emerald-400 to-amber-400 shadow-md"
          style={{ boxShadow: `0 0 10px ${primaryAccent}` }}
        />
      </div>
    </motion.div>
  );
};
