export type LayoutStyle =
  | 'broadcast-full'     // TATA IPL 2025 official scorebug
  | 'local-match-pro'    // 1-to-1 match for local stream scorebug & player stat cards from screenshots
  | 'jiocinema-magenta'  // JioCinema Magenta & Gold broadcast bar
  | 'sa20-gold'          // SA20 Green & Gold diagonal slash bar
  | 'bbl-black-carbon'   // BBL Carbon Fiber Black & Neon Yellow bar
  | 'fancode-orange'     // WCL FanCode Orange & White bar
  | 'cricfusion-glass'   // CricFusion Glassmorphism frosted card
  | 'centered-pill'      // CT2025 compact centered pill
  | 'minimal-center'     // BBL Star Sports minimal center box
  | 't20-asia-cup'       // T20 Emerging Asia Cup white bar with cyan/yellow wings
  | 'icc-navarasa'       // Navarasa CWC23 India layout
  | 'super-fission'      // Neon green pill layout
  | 'pill'               // legacy
  | 'dual-capsule'       // legacy
  | 'chevron'            // legacy
  | 'flat-bar'           // legacy
  | 'glass-box'          // legacy
  | 'cricscorer-broadcast'
  | 'crickpro-elite';

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
  // Broadcast-full layout specific overrides
  teamLabelBg?: string;    // bg color of left/right team name flanks (defaults to badgeBg)
  teamLabelColor?: string; // text color of team name (defaults to white)
  scoreColor?: string;     // color of the score number (defaults to primaryAccent)
  scoreBoxBg?: string;     // bg of the score highlight box (defaults to badgeBg shade)
  battersBg?: string;      // bg of batters section (defaults to dark translucent)
  centerBoxBg?: string;    // bg of CRR/RRR or status center box
  bowlerBg?: string;       // bg of bowler stats + ball dots section
}
