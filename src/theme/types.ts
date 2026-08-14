export type LayoutStyle = 'pill' | 'dual-capsule' | 'chevron' | 'flat-bar' | 'glass-box' | 'cricscorer-broadcast' | 't20-asia-cup' | 'icc-navarasa' | 'super-fission';
export type AnimationVariant = 'explosive-gold' | 'neon-pulse' | 'smooth-slide' | 'glass-fade' | 'minimal-pop';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  bgDark: string;
  textLight: string;
  glassBorder: string;
}

export interface TeamPreset {
  id: string;
  shortName: string;
  fullName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  badgeGradient: string;
  avatarUrl?: string;
}

export interface TournamentTheme {
  id: string;
  name: string;
  headerGradient: string;
  primaryAccent: string;
  badgeBg: string;
  cardBg?: string;
  cardBorder?: string;
  scoreBugMainBg?: string;
  scoreBugAccentBg?: string;
  scoreBugTextColor?: string;
  fontFamily?: string;
  layoutStyle?: LayoutStyle;
  animationVariant?: AnimationVariant;
  showOverDots?: boolean;
  showAvatar?: boolean;
  showTargetBar?: boolean;
  sponsorBox?: boolean;
}


