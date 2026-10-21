/**
 * テーマ管理システム (Theme & Styles Manager)
 * 17つの先進的な配信テーマ、3つのカラーバリアント、2レイアウトをCSS変数で管理。
 */

export const THEME_CONFIGS = {
  classic: {
    name: 'Classic Gradient',
    font: "'Inter', sans-serif",
    entrance: 'bottom',
    duration: 0.6,
    easing: 'power2.out',
    stagger: 0.08,
    glow: 'rgba(59, 130, 246, 0.4)',
    dark: { bg: '#111827', text: '#ffffff', accent: '#fbbf24', secondary: '#1e3a8a' },
    light: { bg: '#f3f4f6', text: '#111827', accent: '#d97706', secondary: '#cbd5e1' },
    adaptive: { bg: 'var(--team-bg-dark)', text: '#ffffff', accent: 'var(--team-accent)', secondary: 'var(--team-bg-secondary)' }
  },
  'ipl-style': {
    name: 'IPL Premium League',
    font: "'Montserrat', sans-serif",
    entrance: 'left',
    duration: 0.5,
    easing: 'back.out(1.5)',
    stagger: 0.05,
    skew: '-6deg',
    glow: 'rgba(249, 115, 22, 0.5)',
    dark: { bg: '#0b0f19', text: '#ffffff', accent: '#eab308', secondary: '#1e1b4b' },
    light: { bg: '#fafafa', text: '#0b0f19', accent: '#ea580c', secondary: '#e2e8f0' },
    adaptive: { bg: 'var(--team-bg-dark)', text: '#ffffff', accent: 'var(--team-accent)', secondary: 'var(--team-bg-secondary)' }
  },
  'icc-modern': {
    name: 'ICC Modern',
    font: "'Fira Sans', sans-serif",
    entrance: 'bottom',
    duration: 0.7,
    easing: 'power3.out',
    stagger: 0.06,
    glow: 'rgba(6, 182, 212, 0.4)',
    dark: { bg: '#0d002c', text: '#ffffff', accent: '#00b4d8', secondary: '#220059' },
    light: { bg: '#f1f5f9', text: '#0f172a', accent: '#0284c7', secondary: '#e2e8f0' },
    adaptive: { bg: 'var(--team-bg-dark)', text: '#ffffff', accent: 'var(--team-accent)', secondary: 'var(--team-bg-secondary)' }
  },
  't20-blast': {
    name: 'T20 Blast High Contrast',
    font: "'Montserrat', sans-serif",
    entrance: 'right',
    duration: 0.4,
    easing: 'power4.out',
    stagger: 0.04,
    glow: 'rgba(255, 255, 0, 0.6)',
    dark: { bg: '#000000', text: '#ffff00', accent: '#ffff00', secondary: '#111111' },
    light: { bg: '#ffffff', text: '#000000', accent: '#000000', secondary: '#e5e5e5' },
    adaptive: { bg: '#000000', text: 'var(--team-accent)', accent: 'var(--team-accent)', secondary: '#111111' }
  },
  'test-match': {
    name: 'Test Match Traditional',
    font: "'Playfair Display', serif",
    entrance: 'top',
    duration: 0.8,
    easing: 'power1.inOut',
    stagger: 0.1,
    glow: 'rgba(6, 78, 59, 0.3)',
    dark: { bg: '#022c22', text: '#f0fdf4', accent: '#f59e0b', secondary: '#064e3b' },
    light: { bg: '#ffffff', text: '#111827', accent: '#064e3b', secondary: '#f3f4f6' },
    adaptive: { bg: '#ffffff', text: '#111827', accent: 'var(--team-accent)', secondary: '#f3f4f6' }
  },
  'big-bash': {
    name: 'Big Bash Entertainment',
    font: "'Fira Sans', sans-serif",
    entrance: 'center-scale',
    duration: 0.5,
    easing: 'elastic.out(1, 0.75)',
    stagger: 0.05,
    glow: 'rgba(236, 72, 153, 0.6)',
    dark: { bg: '#111111', text: '#ec4899', accent: '#84cc16', secondary: '#222222' },
    light: { bg: '#fdf2f8', text: '#db2777', accent: '#65a30d', secondary: '#f3f4f6' },
    adaptive: { bg: '#111111', text: 'var(--team-accent)', accent: 'var(--team-accent)', secondary: '#222222' }
  },
  'the-hundred': {
    name: 'The Hundred Balls Stack',
    font: "'Montserrat', sans-serif",
    entrance: 'bottom',
    duration: 0.6,
    easing: 'back.out(1.2)',
    stagger: 0.08,
    glow: 'rgba(0, 240, 255, 0.5)',
    dark: { bg: '#080112', text: '#ffffff', accent: '#ff007f', secondary: '#00f0ff' },
    light: { bg: '#fdfcf7', text: '#1b003a', accent: '#ff007f', secondary: '#00f0ff' },
    adaptive: { bg: '#080112', text: '#ffffff', accent: 'var(--team-accent)', secondary: 'var(--team-bg-secondary)' }
  },
  'champions': {
    name: 'Knockout Champions',
    font: "'Cinzel', serif",
    entrance: 'center-scale',
    duration: 0.9,
    easing: 'power2.out',
    stagger: 0.12,
    glow: 'rgba(212, 175, 55, 0.7)',
    dark: { bg: '#121212', text: '#d4af37', accent: '#d4af37', secondary: '#1e1b18' },
    light: { bg: '#faf8f2', text: '#4a3c1a', accent: '#d4af37', secondary: '#eae5d8' },
    adaptive: { bg: '#121212', text: 'var(--team-accent)', accent: 'var(--team-accent)', secondary: '#1e1b18' }
  },
  'minimal-dark': {
    name: 'Minimalist Dark',
    font: 'monospace',
    entrance: 'bottom',
    duration: 0.4,
    easing: 'power1.out',
    stagger: 0.03,
    glow: 'rgba(51, 65, 85, 0.2)',
    dark: { bg: '#0f172a', text: '#f1f5f9', accent: '#38bdf8', secondary: '#1e293b' },
    light: { bg: '#0f172a', text: '#f1f5f9', accent: '#38bdf8', secondary: '#1e293b' },
    adaptive: { bg: '#0f172a', text: '#f1f5f9', accent: 'var(--team-accent)', secondary: '#1e293b' }
  },
  'minimal-light': {
    name: 'Minimalist Light',
    font: 'sans-serif',
    entrance: 'bottom',
    duration: 0.4,
    easing: 'power1.out',
    stagger: 0.03,
    glow: 'rgba(226, 232, 240, 0.2)',
    dark: { bg: '#f8fafc', text: '#0f172a', accent: '#0ea5e9', secondary: '#cbd5e1' },
    light: { bg: '#f8fafc', text: '#0f172a', accent: '#0ea5e9', secondary: '#cbd5e1' },
    adaptive: { bg: '#f8fafc', text: '#0f172a', accent: 'var(--team-accent)', secondary: '#cbd5e1' }
  },
  'retro-cricket': {
    name: 'Retro Classic',
    font: "'Courier Prime', monospace",
    entrance: 'left',
    duration: 0.8,
    easing: 'bounce.out',
    stagger: 0.1,
    glow: 'rgba(88, 110, 117, 0.3)',
    dark: { bg: '#2d2d2d', text: '#fdf6e3', accent: '#b58900', secondary: '#3e3e3e' },
    light: { bg: '#fdf6e3', text: '#586e75', accent: '#b58900', secondary: '#eee8d5' },
    adaptive: { bg: '#fdf6e3', text: '#586e75', accent: 'var(--team-accent)', secondary: '#eee8d5' }
  },
  'neon-glow': {
    name: 'Cyber Neon Glow',
    font: "'VT323', monospace",
    entrance: 'right',
    duration: 0.5,
    easing: 'power2.out',
    stagger: 0.05,
    glow: 'rgba(0, 242, 254, 0.8)',
    dark: { bg: '#020617', text: '#00f2fe', accent: '#ff007f', secondary: '#091e3a' },
    light: { bg: '#020617', text: '#00f2fe', accent: '#ff007f', secondary: '#091e3a' },
    adaptive: { bg: '#020617', text: 'var(--team-accent)', accent: '#ff007f', secondary: '#091e3a' }
  },
  'glass': {
    name: 'Glassmorphism',
    font: "'Inter', sans-serif",
    entrance: 'bottom',
    duration: 0.6,
    easing: 'power3.out',
    stagger: 0.06,
    glow: 'rgba(255, 255, 255, 0.3)',
    dark: { bg: 'rgba(15, 23, 42, 0.65)', text: '#ffffff', accent: '#06b6d4', secondary: 'rgba(255, 255, 255, 0.08)' },
    light: { bg: 'rgba(255, 255, 255, 0.4)', text: '#0f172a', accent: '#0284c7', secondary: 'rgba(15, 23, 42, 0.08)' },
    adaptive: { bg: 'rgba(15, 23, 42, 0.65)', text: '#ffffff', accent: 'var(--team-accent)', secondary: 'rgba(255, 255, 255, 0.08)' }
  },
  'gradient-wave': {
    name: 'Gradient Wave Shifting',
    font: "'Inter', sans-serif",
    entrance: 'bottom',
    duration: 0.7,
    easing: 'power2.out',
    stagger: 0.07,
    glow: 'rgba(231, 60, 126, 0.5)',
    dark: { bg: 'linear-gradient(270deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)', text: '#ffffff', accent: '#ffffff', secondary: 'rgba(0,0,0,0.2)' },
    light: { bg: 'linear-gradient(270deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)', text: '#ffffff', accent: '#ffffff', secondary: 'rgba(0,0,0,0.2)' },
    adaptive: { bg: 'linear-gradient(270deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)', text: '#ffffff', accent: 'var(--team-accent)', secondary: 'rgba(0,0,0,0.2)' }
  },
  'corporate': {
    name: 'Corporate Corporate',
    font: "'Inter', sans-serif",
    entrance: 'top',
    duration: 0.5,
    easing: 'power2.out',
    stagger: 0.06,
    glow: 'rgba(2, 132, 199, 0.3)',
    dark: { bg: '#1e293b', text: '#f8fafc', accent: '#0284c7', secondary: '#0f172a' },
    light: { bg: '#f1f5f9', text: '#1e293b', accent: '#0284c7', secondary: '#e2e8f0' },
    adaptive: { bg: '#1e293b', text: '#f8fafc', accent: 'var(--team-accent)', secondary: '#0f172a' }
  },
  'street-cricket': {
    name: 'Street Cricket Casual',
    font: "'VT323', monospace",
    entrance: 'left',
    duration: 0.6,
    easing: 'bounce.out',
    stagger: 0.08,
    glow: 'rgba(249, 115, 22, 0.5)',
    dark: { bg: '#f97316', text: '#000000', accent: '#000000', secondary: '#ea580c' },
    light: { bg: '#f97316', text: '#000000', accent: '#000000', secondary: '#ea580c' },
    adaptive: { bg: '#f97316', text: '#000000', accent: 'var(--team-accent)', secondary: '#ea580c' }
  },
  'custom': {
    name: 'User Custom Theme',
    font: "'Inter', sans-serif",
    entrance: 'bottom',
    duration: 0.6,
    easing: 'power2.out',
    stagger: 0.06,
    glow: 'var(--custom-accent, #10b981)',
    dark: { bg: 'var(--custom-bg, #4f46e5)', text: 'var(--custom-text, #ffffff)', accent: 'var(--custom-accent, #10b981)', secondary: 'rgba(0,0,0,0.2)' },
    light: { bg: 'var(--custom-bg, #4f46e5)', text: 'var(--custom-text, #ffffff)', accent: 'var(--custom-accent, #10b981)', secondary: 'rgba(255,255,255,0.2)' },
    adaptive: { bg: 'var(--custom-bg, #4f46e5)', text: 'var(--custom-text, #ffffff)', accent: 'var(--custom-accent, #10b981)', secondary: 'rgba(0,0,0,0.2)' }
  }
};

export function applyTheme(themeId, variant = 'dark', layout = 'expanded') {
  const theme = THEME_CONFIGS[themeId] || THEME_CONFIGS['classic'];
  const colors = theme[variant] || theme['dark'];

  // Document Root に CSS 変数を注入
  const root = document.documentElement;
  
  root.style.setProperty('--sb-bg', colors.bg);
  root.style.setProperty('--sb-text', colors.text);
  root.style.setProperty('--sb-accent', colors.accent);
  root.style.setProperty('--sb-secondary', colors.secondary);
  
  root.style.setProperty('--sb-font-family', theme.font);
  root.style.setProperty('--sb-glow', theme.glow);
  root.style.setProperty('--sb-skew', theme.skew || '0deg');
  root.style.setProperty('--sb-border-radius', themeId === 'the-hundred' ? '20px' : themeId === 'icc-modern' ? '8px' : '4px');

  // クラスの追加・削除によるレイアウト制御
  const scoreboard = document.getElementById('scoreboard-root');
  if (scoreboard) {
    scoreboard.className = `absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col w-[1120px] transition-all duration-500 transform scale-100 z-10 theme-${themeId} layout-${layout} variant-${variant}`;
  }
}
