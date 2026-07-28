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
}

