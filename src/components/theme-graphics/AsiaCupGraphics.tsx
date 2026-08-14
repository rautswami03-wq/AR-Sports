import React from 'react';

export const AsiaCupLeftCyanWings: React.FC<{ className?: string }> = ({ className = 'w-20 h-full' }) => (
  <svg viewBox="0 0 100 80" preserveAspectRatio="none" className={className}>
    <defs>
      <linearGradient id="cyanWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0077b6" />
        <stop offset="50%" stopColor="#00b4d8" />
        <stop offset="100%" stopColor="#90e0ef" />
      </linearGradient>
    </defs>
    <path d="M 0 0 C 40 20 60 50 20 80 L 0 80 Z" fill="url(#cyanWingGrad)" opacity="0.9" />
    <path d="M 0 10 C 50 30 75 60 40 80 L 0 80 Z" fill="#00b4d8" opacity="0.8" />
    <path d="M 0 25 C 65 40 85 65 60 80 L 0 80 Z" fill="#0096c7" />
    <path d="M 0 45 C 80 55 95 72 80 80 L 0 80 Z" fill="#48cae4" />
  </svg>
);

export const AsiaCupRightYellowWings: React.FC<{ className?: string }> = ({ className = 'w-20 h-full' }) => (
  <svg viewBox="0 0 100 80" preserveAspectRatio="none" className={className}>
    <defs>
      <linearGradient id="yellowWingGrad" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffb703" />
        <stop offset="50%" stopColor="#ffd166" />
        <stop offset="100%" stopColor="#ffe6a7" />
      </linearGradient>
    </defs>
    <path d="M 100 0 C 60 20 40 50 80 80 L 100 80 Z" fill="url(#yellowWingGrad)" opacity="0.9" />
    <path d="M 100 10 C 50 30 25 60 60 80 L 100 80 Z" fill="#ffc72c" opacity="0.8" />
    <path d="M 100 25 C 35 40 15 65 40 80 L 100 80 Z" fill="#fb8500" />
    <path d="M 100 45 C 20 55 5 72 20 80 L 100 80 Z" fill="#ffd166" />
  </svg>
);

export const AsiaCupLeftFullWings: React.FC<{ className?: string }> = ({ className = 'w-32 h-full' }) => (
  <svg viewBox="0 0 160 500" preserveAspectRatio="none" className={className}>
    <defs>
      <linearGradient id="fullCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#003566" />
        <stop offset="50%" stopColor="#0077b6" />
        <stop offset="100%" stopColor="#00b4d8" />
      </linearGradient>
      <linearGradient id="fullYellowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffb703" />
        <stop offset="100%" stopColor="#ffd166" />
      </linearGradient>
    </defs>
    {/* Outer yellow swooshes */}
    <path d="M 0 0 C 120 100 160 300 30 500 L 0 500 Z" fill="url(#fullYellowGrad)" />
    {/* Inner cyan swooshes */}
    <path d="M 0 30 C 90 120 130 350 10 500 L 0 500 Z" fill="url(#fullCyanGrad)" />
    <path d="M 0 80 C 70 160 100 380 0 500 Z" fill="#00127a" />
    <path d="M 0 150 C 50 220 80 400 0 500 Z" fill="#48cae4" opacity="0.9" />
  </svg>
);
