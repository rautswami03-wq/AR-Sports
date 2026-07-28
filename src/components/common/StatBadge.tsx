import React from 'react';

interface StatBadgeProps {
  label: string;
  value: string | number;
  highlight?: boolean;
  color?: string;
}

export const StatBadge: React.FC<StatBadgeProps> = ({
  label,
  value,
  highlight = false,
  color,
}) => {
  return (
    <div className="flex flex-col items-center justify-center px-3 py-1 bg-slate-950/60 rounded-md border border-white/10 min-w-[65px]">
      <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
        {label}
      </span>
      <span
        className={`font-black text-sm tracking-tight ${
          highlight ? 'text-amber-400' : 'text-white'
        }`}
        style={color ? { color } : undefined}
      >
        {value}
      </span>
    </div>
  );
};
