import React from 'react';
import { motion } from 'framer-motion';

export interface FullCardBaseProps {
  title: string;
  subtitle?: string;
  footerContent?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  badge?: React.ReactNode;
  headerRight?: React.ReactNode;
}

export const FullCardBase: React.FC<FullCardBaseProps> = ({
  title,
  subtitle,
  footerContent,
  children,
  className = '',
  badge,
  headerRight,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 24 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`relative w-[960px] max-w-[94vw] rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.85)] border-4 border-[#FF5A00] bg-[#0B132B] text-white flex flex-col font-sans select-none ${className}`}
      style={{
        boxShadow: '0 0 35px rgba(255,90,0,0.35), 0 24px 60px rgba(0,0,0,0.9)',
      }}
    >
      {/* Subtle chevron watermark background overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, transparent, transparent 20px, #FF5A00 20px, #FF5A00 22px)',
        }}
      />

      {/* HEADER: Black with title and IPL chevron pattern */}
      <div className="relative z-10 bg-black text-white px-6 py-4 border-b-2 border-[#FF5A00]/80 flex items-center justify-between overflow-hidden">
        {/* Left IPL Chevron Pattern */}
        <div className="flex items-center gap-1.5 shrink-0 opacity-90">
          <svg width="28" height="24" viewBox="0 0 28 24" fill="none" className="drop-shadow-[0_0_8px_#FF5A00]">
            <path d="M4 2L14 12L4 22H0L10 12L0 2H4Z" fill="#FF5A00" />
            <path d="M14 2L24 12L14 22H10L20 12L10 2H14Z" fill="#FFB703" />
          </svg>
          <div className="w-1.5 h-6 bg-[#FF5A00] rounded-sm -skew-x-12" />
        </div>

        {/* Center Title Block */}
        <div className="flex-1 px-4 text-center flex flex-col items-center justify-center">
          {badge && <div className="mb-1">{badge}</div>}
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs md:text-sm font-semibold tracking-widest text-[#FFB703] uppercase mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right Header Element or Mirror Chevron */}
        <div className="flex items-center gap-1.5 shrink-0">
          {headerRight ? (
            headerRight
          ) : (
            <div className="flex items-center gap-1.5 opacity-90">
              <div className="w-1.5 h-6 bg-[#FF5A00] rounded-sm skew-x-12" />
              <svg width="28" height="24" viewBox="0 0 28 24" fill="none" className="drop-shadow-[0_0_8px_#FF5A00]">
                <path d="M24 2L14 12L24 22H28L18 12L28 2H24Z" fill="#FF5A00" />
                <path d="M14 2L4 12L14 22H18L8 12L18 2H14Z" fill="#FFB703" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* BODY CONTENT */}
      <div className="relative z-10 flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </div>

      {/* FOOTER: Dark stat bar */}
      {footerContent && (
        <div className="relative z-10 bg-[#060A17] border-t-2 border-white/10 px-6 py-3 flex items-center justify-between text-sm font-bold text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A00] animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-slate-400">Match Intel</span>
          </div>
          <div className="flex items-center gap-6">{footerContent}</div>
        </div>
      )}
    </motion.div>
  );
};

