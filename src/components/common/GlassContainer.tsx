import React from 'react';

interface GlassContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'dark' | 'accent' | 'standard';
  borderColor?: string;
}

export const GlassContainer: React.FC<GlassContainerProps> = ({
  children,
  className = '',
  variant = 'standard',
  borderColor,
}) => {
  const variantClass = {
    standard: 'glass-panel',
    dark: 'glass-panel-dark',
    accent: 'glass-panel-accent',
  }[variant];

  return (
    <div
      className={`${variantClass} rounded-xl overflow-hidden relative ${className}`}
      style={borderColor ? { borderColor } : undefined}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none" />
      {children}
    </div>
  );
};
