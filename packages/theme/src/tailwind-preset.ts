import { darkTokens } from './tokens';

// ============================================================================
// AR Sports Studio Pro — Tailwind CSS Preset
// ============================================================================

export const arSportsPreset = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          50: '#E8F0FE',
          100: '#C5D9FC',
          200: '#8AAEF9',
          300: '#5083F6',
          400: '#1E3A5F',
          500: '#1E3A5F',
          600: '#183050',
          700: '#122540',
          800: '#0C1A30',
          900: '#060F20',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          elevated: 'var(--color-surface-elevated)',
        },
        broadcast: {
          live: 'var(--color-live)',
          wicket: 'var(--color-wicket)',
          four: 'var(--color-four)',
          six: 'var(--color-six)',
          gold: 'var(--color-gold)',
        },
        muted: 'var(--color-text-muted)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Oswald', 'Bebas Neue', 'Impact', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        score: ['3.5rem', { lineHeight: '1.1', fontWeight: '800' }],
        overlay: ['4.5rem', { lineHeight: '1.0', fontWeight: '800' }],
      },
      borderRadius: {
        sm: darkTokens.radius.sm,
        md: darkTokens.radius.md,
        lg: darkTokens.radius.lg,
        xl: darkTokens.radius.xl,
      },
      boxShadow: {
        overlay: darkTokens.shadows.overlay,
        glow: darkTokens.shadows.glow,
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-in-left': 'slide-in-left 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-in-bottom': 'slide-in-bottom 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        'fade-in': 'fade-in 0.3s ease-out',
        'scale-in': 'scale-in 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        'pulse-live': 'pulse-live 1.5s ease-in-out infinite',
        'broadcast-enter': 'broadcast-enter 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
        'broadcast-exit': 'broadcast-exit 0.4s cubic-bezier(0.4, 0, 1, 1)',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-in': 'bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-bottom': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'pulse-live': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'broadcast-enter': {
          '0%': { transform: 'translateX(100%) scale(0.9)', opacity: '0' },
          '100%': { transform: 'translateX(0) scale(1)', opacity: '1' },
        },
        'broadcast-exit': {
          '0%': { transform: 'translateX(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateX(-100%) scale(0.9)', opacity: '0' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backdropBlur: {
        overlay: '16px',
        heavy: '24px',
      },
      zIndex: {
        overlay: '100',
        graphic: '200',
        animation: '300',
      },
    },
  },
  plugins: [],
};

export default arSportsPreset;
