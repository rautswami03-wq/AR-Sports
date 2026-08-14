import React from 'react';

export const NavarasaVerticalRibbon: React.FC<{ className?: string }> = ({ className = 'w-6 h-full' }) => {
  const glyphs = [
    { bg: '#e91e63', icon: 'M 10 5 L 15 15 L 5 15 Z' }, // Pink triangle
    { bg: '#00d4ff', icon: 'M 5 5 H 15 V 15 H 5 Z' }, // Cyan square
    { bg: '#ffb703', icon: 'M 10 3 L 17 10 L 10 17 L 3 10 Z' }, // Yellow diamond
    { bg: '#d90429', icon: 'M 10 3 C 14 3 17 6 17 10 C 17 14 14 17 10 17 C 6 17 3 14 3 10 C 3 6 6 3 10 3 Z' }, // Red circle
    { bg: '#8338ec', icon: 'M 10 2 L 12 7 L 18 10 L 12 13 L 10 18 L 8 13 L 2 10 L 8 7 Z' }, // Purple star
    { bg: '#fb5607', icon: 'M 10 4 L 16 16 L 4 16 Z' }, // Orange triangle
    { bg: '#00b4d8', icon: 'M 4 10 L 10 4 L 16 10 L 10 16 Z' }, // Blue diamond
    { bg: '#ff006e', icon: 'M 10 3 C 15 7 15 13 10 17 C 5 13 5 7 10 3 Z' }, // Magenta leaf
    { bg: '#ffbe0b', icon: 'M 6 6 H 14 V 14 H 6 Z' }, // Yellow square
    { bg: '#7209b7', icon: 'M 10 2 L 13 8 L 19 10 L 13 12 L 10 18 L 7 12 L 1 10 L 7 8 Z' }, // Deep violet star
    { bg: '#3a86ff', icon: 'M 10 3 L 17 10 L 10 17 L 3 10 Z' }, // Blue diamond
    { bg: '#e63946', icon: 'M 10 4 C 14 4 16 7 16 10 C 16 13 14 16 10 16 C 6 16 4 13 4 10 C 4 7 6 4 10 4 Z' }, // Red circle
  ];

  return (
    <div className={`flex flex-col items-center justify-between overflow-hidden bg-[#20003b] ${className}`}>
      {glyphs.map((g, idx) => (
        <div
          key={idx}
          className="w-full flex-1 flex items-center justify-center p-0.5"
          style={{ background: g.bg }}
        >
          <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 fill-white">
            <path d={g.icon} />
          </svg>
        </div>
      ))}
    </div>
  );
};
