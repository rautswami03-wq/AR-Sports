// =====================================================================
// Blitz Theme Customization Settings
// All Blitz broadcast panels read these CSS-variable-level overrides.
// =====================================================================

export type BlitzFont =
  | 'Roboto Condensed'
  | 'Inter'
  | 'Oswald'
  | 'Montserrat'
  | 'Bebas Neue'
  | 'Arial';

export type BatterDisplayStyle =
  | 'round-filled'
  | 'round-outlined'
  | 'square-filled'
  | 'square-outlined';

export type BlitzBorderStyle = 'sharp' | 'soft' | 'pill' | 'none';

export type BlitzTexture = 'none' | 'carbon' | 'grid' | 'dots' | 'circuit' | 'noise';

export interface BlitzCustomSettings {
  // 5 color slots
  stripeColor: string;       // Main accent stripe / header
  teamABg: string;           // Team A panel background
  teamAText: string;         // Team A text color
  teamBBg: string;           // Team B panel background
  teamBText: string;         // Team B text color

  // Typography
  fontFamily: BlitzFont;

  // Batter pill style
  batterDisplayStyle: BatterDisplayStyle;

  // Panel borders
  borderStyle: BlitzBorderStyle;

  // Background texture overlay
  textureOverlay: BlitzTexture;

  // Auto-contrast (locks text colors based on bg luminance)
  autoContrast: boolean;
}

export const DEFAULT_BLITZ_SETTINGS: BlitzCustomSettings = {
  stripeColor: '#ff007f',
  teamABg: '#0b0f19',
  teamAText: '#ffffff',
  teamBBg: '#030712',
  teamBText: '#00f3ff',
  fontFamily: 'Roboto Condensed',
  batterDisplayStyle: 'round-filled',
  borderStyle: 'sharp',
  textureOverlay: 'none',
  autoContrast: true,
};

/** Converts a hex color to its perceived luminance (0=dark, 1=light) */
export function getLuminance(hex: string): number {
  const c = hex.replace('#', '');
  if (c.length < 6) return 0.5;
  const r = parseInt(c.slice(0,2), 16) / 255;
  const g = parseInt(c.slice(2,4), 16) / 255;
  const b = parseInt(c.slice(4,6), 16) / 255;
  const toLinear = (x: number) => x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/** Returns #000000 or #ffffff depending on which has better contrast against bg */
export function autoContrastColor(bgHex: string): string {
  return getLuminance(bgHex) > 0.35 ? '#000000' : '#ffffff';
}

/** Returns the Google Fonts URL for a given BlitzFont */
export function getFontUrl(font: BlitzFont): string {
  const map: Record<BlitzFont, string> = {
    'Roboto Condensed': 'https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;600;700;900&display=swap',
    'Inter':            'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap',
    'Oswald':           'https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&display=swap',
    'Montserrat':       'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&display=swap',
    'Bebas Neue':       'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap',
    'Arial':            '',
  };
  return map[font];
}

/** CSS background pattern for a given texture */
export function getTextureCss(texture: BlitzTexture): string {
  switch (texture) {
    case 'carbon':
      return `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='2' height='2' fill='rgba(255,255,255,0.04)'/%3E%3Crect x='2' y='2' width='2' height='2' fill='rgba(255,255,255,0.04)'/%3E%3C/svg%3E")`;
    case 'grid':
      return `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L0 0 0 20' fill='none' stroke='rgba(255,255,255,0.06)' stroke-width='0.5'/%3E%3C/svg%3E")`;
    case 'dots':
      return `url("data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 10 10' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='rgba(255,255,255,0.07)'/%3E%3C/svg%3E")`;
    case 'circuit':
      return `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20h16M24 20h16M20 0v16M20 24v16' stroke='rgba(0,243,255,0.08)' stroke-width='1' fill='none'/%3E%3Ccircle cx='20' cy='20' r='3' fill='none' stroke='rgba(0,243,255,0.08)' stroke-width='1'/%3E%3C/svg%3E")`;
    case 'noise':
      return `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;
    default:
      return 'none';
  }
}

/** Returns the CSS border-radius token for a panel border style */
export function getBorderRadius(style: BlitzBorderStyle): string {
  const map: Record<BlitzBorderStyle, string> = {
    sharp: '0px',
    soft:  '6px',
    pill:  '14px',
    none:  '0px',
  };
  return map[style];
}
