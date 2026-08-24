import { TeamPreset, TournamentTheme } from './types';

export const PRESET_TEAMS: Record<string, TeamPreset> = {
  IND: {
    id: 'IND',
    shortName: 'IND',
    fullName: 'India',
    primaryColor: '#00529B',
    secondaryColor: '#FF9933',
    accentColor: '#00D2FF',
    badgeGradient: 'linear-gradient(135deg, #00529B 0%, #002B5B 100%)',
  },
  AUS: {
    id: 'AUS',
    shortName: 'AUS',
    fullName: 'Australia',
    primaryColor: '#FFD700',
    secondaryColor: '#006400',
    accentColor: '#FFF',
    badgeGradient: 'linear-gradient(135deg, #FFD700 0%, #CCAC00 100%)',
  },
  ENG: {
    id: 'ENG',
    shortName: 'ENG',
    fullName: 'England',
    primaryColor: '#C8102E',
    secondaryColor: '#00247D',
    accentColor: '#FFF',
    badgeGradient: 'linear-gradient(135deg, #C8102E 0%, #8B0000 100%)',
  },
  PAK: {
    id: 'PAK',
    shortName: 'PAK',
    fullName: 'Pakistan',
    primaryColor: '#01411C',
    secondaryColor: '#808000',
    accentColor: '#00FF66',
    badgeGradient: 'linear-gradient(135deg, #01411C 0%, #002711 100%)',
  },
  SA: {
    id: 'SA',
    shortName: 'SA',
    fullName: 'South Africa',
    primaryColor: '#007A4D',
    secondaryColor: '#FFB81C',
    accentColor: '#FFF',
    badgeGradient: 'linear-gradient(135deg, #007A4D 0%, #004D31 100%)',
  },
  NZ: {
    id: 'NZ',
    shortName: 'NZ',
    fullName: 'New Zealand',
    primaryColor: '#111111',
    secondaryColor: '#00A3E0',
    accentColor: '#FFF',
    badgeGradient: 'linear-gradient(135deg, #222222 0%, #000000 100%)',
  },
  MI: {
    id: 'MI',
    shortName: 'MI',
    fullName: 'Mumbai Indians',
    primaryColor: '#004BA0',
    secondaryColor: '#D4AF37',
    accentColor: '#00D2FF',
    badgeGradient: 'linear-gradient(135deg, #004BA0 0%, #002B66 100%)',
  },
  CSK: {
    id: 'CSK',
    shortName: 'CSK',
    fullName: 'Chennai Super Kings',
    primaryColor: '#FCCA03',
    secondaryColor: '#00529B',
    accentColor: '#FF4500',
    badgeGradient: 'linear-gradient(135deg, #FCCA03 0%, #D4A700 100%)',
  },
  RCB: {
    id: 'RCB',
    shortName: 'RCB',
    fullName: 'Royal Challengers Bengaluru',
    primaryColor: '#EC1C24',
    secondaryColor: '#000000',
    accentColor: '#D4AF37',
    badgeGradient: 'linear-gradient(135deg, #EC1C24 0%, #990000 100%)',
  },
  KKR: {
    id: 'KKR',
    shortName: 'KKR',
    fullName: 'Kolkata Knight Riders',
    primaryColor: '#3A225D',
    secondaryColor: '#F7D154',
    accentColor: '#FFF',
    badgeGradient: 'linear-gradient(135deg, #3A225D 0%, #22123B 100%)',
  },
};

export const PRESET_TOURNAMENTS: Record<string, TournamentTheme> = {
  local_match_pro: {
    id: 'local_match_pro',
    name: 'LOCAL MATCH STREAM PRO',
    headerGradient: 'linear-gradient(90deg, #00d2ff 0%, #00529b 50%, #ff003c 100%)',
    primaryAccent: '#00d2ff',
    badgeBg: '#00d2ff',
    teamLabelBg: '#00d2ff',
    teamLabelColor: '#000000',
    scoreColor: '#000080',
    scoreBoxBg: '#00d2ff',
    battersBg: '#000080',
    centerBoxBg: '#ff003c',
    bowlerBg: '#ff003c',
    scoreBugMainBg: 'bg-[#00d2ff]',
    scoreBugAccentBg: 'bg-[#ff003c]',
    scoreBugTextColor: 'text-white',
    layoutStyle: 'local-match-pro',
    animationVariant: 'explosive-gold',
    showOverDots: true,
    showTargetBar: true,
  },
  IPL: {
    id: 'IPL',
    name: 'TATA IPL 2025 OFFICIAL',
    headerGradient: 'linear-gradient(90deg, #00F2FE 0%, #0052D4 40%, #FFD700 100%)',
    primaryAccent: '#00F2FE',
    badgeBg: '#080E24',
    teamLabelBg: '#080E24',
    teamLabelColor: '#ffffff',
    scoreColor: '#00F2FE',
    scoreBoxBg: '#05102E',
    battersBg: 'rgba(8,14,36,0.98)',
    centerBoxBg: '#00F2FE',
    bowlerBg: '#0A1838',
    cardBg: '#080E24',
    cardBorder: '2px solid #00F2FE',
    scoreBugMainBg: 'bg-[#080E24]',
    scoreBugAccentBg: 'bg-[#00F2FE]',
    scoreBugTextColor: 'text-white',
    layoutStyle: 'broadcast-full',
    animationVariant: 'explosive-gold',
    showOverDots: true,
    showTargetBar: true,
  },
  ipl25: {
    id: 'ipl25',
    name: 'TATA IPL 2025 4K TELECAST',
    headerGradient: 'linear-gradient(90deg, #00F2FE 0%, #4FACFE 50%, #FFD700 100%)',
    primaryAccent: '#00F2FE',
    badgeBg: '#080E24',
    teamLabelBg: '#080E24',
    teamLabelColor: '#ffffff',
    scoreColor: '#00F2FE',
    scoreBoxBg: '#05102E',
    battersBg: 'rgba(8,14,36,0.98)',
    centerBoxBg: '#00F2FE',
    bowlerBg: '#0A1838',
    cardBg: '#080E24',
    cardBorder: '2px solid #00F2FE',
    scoreBugMainBg: 'bg-[#080E24]',
    scoreBugAccentBg: 'bg-[#00F2FE]',
    scoreBugTextColor: 'text-white',
    layoutStyle: 'broadcast-full',
    animationVariant: 'explosive-gold',
    showOverDots: true,
    showTargetBar: true,
  },
  asia_cup: {
    id: 'asia_cup',
    name: 'ASIA CUP CRICKET 2025',
    headerGradient: 'linear-gradient(90deg, #064e3b 0%, #10b981 50%, #0284c7 100%)',
    primaryAccent: '#34d399',
    badgeBg: '#022c22',
    teamLabelBg: '#022c22',
    teamLabelColor: '#ffffff',
    scoreColor: '#34d399',
    scoreBoxBg: '#033d2f',
    battersBg: 'rgba(2,44,34,0.95)',
    centerBoxBg: '#033d2f',
    bowlerBg: '#022c22',
    scoreBugMainBg: 'bg-emerald-500',
    scoreBugAccentBg: 'bg-emerald-800',
    scoreBugTextColor: 'text-white',
    layoutStyle: 'broadcast-full',
    animationVariant: 'neon-pulse',
    showOverDots: true,
    showTargetBar: true,
  },
  cwc19: {
    id: 'cwc19',
    name: 'ICC CRICKET WORLD CUP 2019',
    headerGradient: 'linear-gradient(90deg, #0d1b3e 0%, #1a2f6b 50%, #0d1b3e 100%)',
    primaryAccent: '#ffd600',
    badgeBg: '#0d1b3e',
    teamLabelBg: '#0d1b3e',
    teamLabelColor: '#ffd600',
    scoreColor: '#ffffff',
    scoreBoxBg: '#0d1b3e',
    battersBg: 'rgba(255,255,255,0.96)',
    centerBoxBg: '#0d1b3e',
    bowlerBg: '#0d1b3e',
    cardBg: '#ffffff',
    scoreBugMainBg: 'bg-indigo-600',
    scoreBugAccentBg: 'bg-pink-600',
    scoreBugTextColor: 'text-white',
    layoutStyle: 'broadcast-full',
    animationVariant: 'smooth-slide',
    showOverDots: true,
    showTargetBar: true,
  },
  ct2025: {
    id: 'ct2025',
    name: 'ICC CHAMPIONS TROPHY 2025',
    headerGradient: 'linear-gradient(90deg, #0f172a 0%, #0284c7 50%, #38bdf8 100%)',
    primaryAccent: '#84cc16',
    badgeBg: '#0f2050',
    scoreColor: '#ffffff',
    scoreBoxBg: '#ffffff',
    scoreBugMainBg: 'bg-sky-500',
    scoreBugAccentBg: 'bg-slate-900',
    scoreBugTextColor: 'text-slate-950',
    layoutStyle: 'centered-pill',
    animationVariant: 'neon-pulse',
    showOverDots: false,
    showTargetBar: true,
  },
  cwc_women25: {
    id: 'cwc_women25',
    name: 'ICC WOMEN\'S CWC 2025 INDIA',
    headerGradient: 'linear-gradient(90deg, #831843 0%, #db2777 50%, #f59e0b 100%)',
    primaryAccent: '#f472b6',
    badgeBg: '#4c0519',
    teamLabelBg: '#4c0519',
    teamLabelColor: '#f472b6',
    scoreColor: '#f472b6',
    scoreBoxBg: '#831843',
    battersBg: 'rgba(76,5,25,0.9)',
    centerBoxBg: '#f59e0b',
    bowlerBg: '#4c0519',
    scoreBugMainBg: 'bg-pink-500',
    scoreBugAccentBg: 'bg-amber-500',
    scoreBugTextColor: 'text-white',
    layoutStyle: 'broadcast-full',
    animationVariant: 'explosive-gold',
    showOverDots: true,
    showTargetBar: true,
  },
  wcl_fancode: {
    id: 'wcl_fancode',
    name: 'WORLD CHAMPIONSHIP OF LEGENDS (FANCODE)',
    headerGradient: 'linear-gradient(90deg, #7c2d12 0%, #ea580c 50%, #f97316 100%)',
    primaryAccent: '#fb923c',
    badgeBg: '#1c1917',
    teamLabelBg: '#ea580c',
    teamLabelColor: '#ffffff',
    scoreColor: '#fb923c',
    scoreBoxBg: '#1c1917',
    battersBg: '#0f172a',
    centerBoxBg: '#ea580c',
    bowlerBg: '#1c1917',
    scoreBugMainBg: 'bg-orange-500',
    scoreBugAccentBg: 'bg-neutral-900',
    scoreBugTextColor: 'text-white',
    layoutStyle: 'fancode-orange',
    animationVariant: 'minimal-pop',
    showOverDots: true,
    showTargetBar: false,
  },
  cwc23: {
    id: 'cwc23',
    name: 'ICC CRICKET WORLD CUP (NAVARASA)',
    headerGradient: 'linear-gradient(90deg, #20003b 0%, #ff007f 50%, #00d4ff 100%)',
    primaryAccent: '#ff007f',
    badgeBg: '#20003b',
    cardBg: '#ffffff',
    cardBorder: '2px solid #ff007f',
    scoreBugMainBg: 'bg-[#20003b]',
    scoreBugAccentBg: 'bg-[#ffc700]',
    scoreBugTextColor: 'text-white',
    layoutStyle: 'icc-navarasa',
    animationVariant: 'explosive-gold',
    showOverDots: true,
    showTargetBar: true,
  },
  bbl_black: {
    id: 'bbl_black',
    name: 'BIG BASH LEAGUE (BLACK EDITION)',
    headerGradient: 'linear-gradient(90deg, #09090b 0%, #18181b 50%, #facc15 100%)',
    primaryAccent: '#facc15',
    badgeBg: '#09090b',
    teamLabelBg: '#09090b',
    teamLabelColor: '#facc15',
    scoreColor: '#facc15',
    scoreBoxBg: '#18181b',
    battersBg: '#09090b',
    centerBoxBg: '#09090b',
    bowlerBg: '#09090b',
    scoreBugMainBg: 'bg-neutral-950',
    scoreBugAccentBg: 'bg-yellow-400',
    scoreBugTextColor: 'text-yellow-400',
    layoutStyle: 'bbl-black-carbon',
    animationVariant: 'neon-pulse',
    showOverDots: true,
    showTargetBar: true,
  },
  cricfusion: {
    id: 'cricfusion',
    name: 'CRICFUSION GLASS BOX',
    headerGradient: 'linear-gradient(90deg, #831843 0%, #db2777 50%, #0284c7 100%)',
    primaryAccent: '#ec4899',
    badgeBg: 'rgba(15, 23, 42, 0.85)',
    teamLabelBg: 'rgba(236, 72, 153, 0.3)',
    teamLabelColor: '#ffffff',
    scoreColor: '#ec4899',
    scoreBoxBg: 'rgba(255, 255, 255, 0.95)',
    battersBg: 'rgba(15, 23, 42, 0.7)',
    centerBoxBg: 'rgba(236, 72, 153, 0.4)',
    bowlerBg: 'rgba(15, 23, 42, 0.8)',
    cardBg: 'rgba(15, 23, 42, 0.85)',
    cardBorder: '2px solid #ec4899',
    scoreBugMainBg: 'bg-purple-950/80',
    scoreBugAccentBg: 'bg-pink-600',
    scoreBugTextColor: 'text-white',
    layoutStyle: 'cricfusion-glass',
    animationVariant: 'glass-fade',
    showOverDots: true,
    showTargetBar: true,
  },
  sa20: {
    id: 'sa20',
    name: 'SA20 SOUTH AFRICA T20',
    headerGradient: 'linear-gradient(90deg, #15803d 0%, #22c55e 50%, #facc15 100%)',
    primaryAccent: '#facc15',
    badgeBg: '#052e16',
    teamLabelBg: '#15803d',
    teamLabelColor: '#ffffff',
    scoreColor: '#facc15',
    scoreBoxBg: '#0f172a',
    battersBg: '#14532d',
    centerBoxBg: '#facc15',
    bowlerBg: '#052e16',
    scoreBugMainBg: 'bg-green-700',
    scoreBugAccentBg: 'bg-yellow-400',
    scoreBugTextColor: 'text-white',
    layoutStyle: 'sa20-gold',
    animationVariant: 'neon-pulse',
    showOverDots: true,
    showTargetBar: true,
  },
  jiocinema: {
    id: 'jiocinema',
    name: 'JIOCINEMA OFFICIAL',
    headerGradient: 'linear-gradient(90deg, #9f1239 0%, #e11d48 50%, #fb7185 100%)',
    primaryAccent: '#f43f5e',
    badgeBg: '#4c0519',
    teamLabelBg: '#be185d',
    teamLabelColor: '#ffffff',
    scoreColor: '#be185d',
    scoreBoxBg: '#ffffff',
    battersBg: '#881337',
    centerBoxBg: '#e11d48',
    bowlerBg: '#4c0519',
    scoreBugMainBg: 'bg-rose-600',
    scoreBugAccentBg: 'bg-rose-900',
    scoreBugTextColor: 'text-white',
    layoutStyle: 'jiocinema-magenta',
    animationVariant: 'smooth-slide',
    showOverDots: true,
    showTargetBar: true,
  },
  bbl_white: {
    id: 'bbl_white',
    name: 'BIG BASH LEAGUE (WHITE EDITION)',
    headerGradient: 'linear-gradient(90deg, #ffffff 0%, #f1f5f9 50%, #84cc16 100%)',
    primaryAccent: '#65a30d',
    badgeBg: '#ffffff',
    teamLabelBg: '#ffffff',
    teamLabelColor: '#0f172a',
    scoreColor: '#0f172a',
    scoreBoxBg: '#f1f5f9',
    battersBg: 'rgba(255,255,255,0.98)',
    centerBoxBg: '#e2e8f0',
    bowlerBg: '#f1f5f9',
    cardBg: '#ffffff',
    scoreBugMainBg: 'bg-slate-100',
    scoreBugAccentBg: 'bg-lime-500',
    scoreBugTextColor: 'text-slate-900',
    layoutStyle: 'broadcast-full',
    animationVariant: 'minimal-pop',
    showOverDots: true,
    showTargetBar: true,
  },
  bbl_star: {
    id: 'bbl_star',
    name: 'STAR SPORTS BBL COVERAGE',
    headerGradient: 'linear-gradient(90deg, #991b1b 0%, #dc2626 50%, #eab308 100%)',
    primaryAccent: '#00e5ff',
    badgeBg: '#050d1a',
    scoreColor: '#00e5ff',
    scoreBoxBg: '#0a1a2e',
    scoreBugMainBg: 'bg-red-700',
    scoreBugAccentBg: 'bg-amber-400',
    scoreBugTextColor: 'text-white',
    layoutStyle: 'minimal-center',
    animationVariant: 'explosive-gold',
    showOverDots: false,
    showTargetBar: false,
  },
  cricpic: {
    id: 'cricpic',
    name: 'CRICPIC IPL PRO EDITION',
    headerGradient: 'linear-gradient(90deg, #1e40af 0%, #1d4ed8 50%, #fbbf24 100%)',
    primaryAccent: '#ffffff',
    badgeBg: '#c62828',
    teamLabelBg: '#c62828',
    teamLabelColor: '#ffffff',
    scoreColor: '#ffffff',
    scoreBoxBg: '#b71c1c',
    battersBg: 'rgba(198,40,40,0.9)',
    centerBoxBg: '#c62828',
    bowlerBg: '#0d1526',
    scoreBugMainBg: 'bg-blue-700',
    scoreBugAccentBg: 'bg-amber-500',
    scoreBugTextColor: 'text-white',
    layoutStyle: 'broadcast-full',
    animationVariant: 'explosive-gold',
    showOverDots: true,
    showAvatar: true,
    showTargetBar: true,
  },
  t20_asia24: {
    id: 't20_asia24',
    name: 'ACC MEN\'S T20 EMERGING ASIA CUP 2024',
    headerGradient: 'linear-gradient(90deg, #000865 0%, #00a8e8 50%, #ffc72c 100%)',
    primaryAccent: '#00a8e8',
    badgeBg: '#000865',
    cardBg: '#ffffff',
    cardBorder: '2px solid #00a8e8',
    scoreBugMainBg: 'bg-white',
    scoreBugAccentBg: 'bg-[#ffc72c]',
    scoreBugTextColor: 'text-slate-900',
    layoutStyle: 't20-asia-cup',
    animationVariant: 'neon-pulse',
    showOverDots: true,
    showTargetBar: true,
  },
  wt20_2024: {
    id: 'wt20_2024',
    name: 'ICC MEN\'S T20 WORLD CUP 2024',
    headerGradient: 'linear-gradient(90deg, #0a0f2e 0%, #e91e8c 50%, #0a0f2e 100%)',
    primaryAccent: '#e91e8c',
    badgeBg: '#0a0f2e',
    teamLabelBg: '#ffd700',
    teamLabelColor: '#0a0f2e',
    scoreColor: '#e91e8c',
    scoreBoxBg: '#0a0f2e',
    battersBg: 'rgba(10,15,46,0.97)',
    centerBoxBg: '#0a0f2e',
    bowlerBg: '#0a0f2e',
    scoreBugMainBg: 'bg-purple-800',
    scoreBugAccentBg: 'bg-cyan-400',
    scoreBugTextColor: 'text-white',
    layoutStyle: 'broadcast-full',
    showOverDots: true,
    showTargetBar: true,
  },
  cwc23_diwali: {
    id: 'cwc23_diwali',
    name: 'CWC 2023 INDIA (DIWALI EDITION)',
    headerGradient: 'linear-gradient(90deg, #78350f 0%, #d97706 50%, #dc2626 100%)',
    primaryAccent: '#fbbf24',
    badgeBg: '#451a03',
    teamLabelBg: '#451a03',
    teamLabelColor: '#fbbf24',
    scoreColor: '#fbbf24',
    scoreBoxBg: '#78350f',
    battersBg: 'rgba(69,26,3,0.97)',
    centerBoxBg: '#dc2626',
    bowlerBg: '#451a03',
    scoreBugMainBg: 'bg-amber-600',
    scoreBugAccentBg: 'bg-red-700',
    scoreBugTextColor: 'text-white',
    layoutStyle: 'broadcast-full',
    showOverDots: true,
    showTargetBar: true,
  },
  cwc_t20_2020: {
    id: 'cwc_t20_2020',
    name: 'ICC T20 WORLD CUP 2020',
    headerGradient: 'linear-gradient(90deg, #0284c7 0%, #2563eb 50%, #4f46e5 100%)',
    primaryAccent: '#38bdf8',
    badgeBg: '#0f172a',
    teamLabelBg: '#0f172a',
    teamLabelColor: '#38bdf8',
    scoreColor: '#38bdf8',
    scoreBoxBg: '#162035',
    battersBg: 'rgba(15,23,42,0.97)',
    centerBoxBg: '#1e3a5f',
    bowlerBg: '#0f172a',
    scoreBugMainBg: 'bg-blue-600',
    scoreBugAccentBg: 'bg-indigo-700',
    scoreBugTextColor: 'text-white',
    layoutStyle: 'broadcast-full',
    showOverDots: true,
    showTargetBar: true,
  },
  icc_wc_vibrant: {
    id: 'icc_wc_vibrant',
    name: 'ICC WORLD CUP (VIBRANT SPECIAL EDITION)',
    headerGradient: 'linear-gradient(90deg, #3b0764 0%, #7e22ce 50%, #ec4899 100%)',
    primaryAccent: '#ec4899',
    badgeBg: '#3b0764',
    teamLabelBg: '#3b0764',
    teamLabelColor: '#ec4899',
    scoreColor: '#ec4899',
    scoreBoxBg: '#4c0a80',
    battersBg: 'rgba(59,7,100,0.97)',
    centerBoxBg: '#6d28d9',
    bowlerBg: '#3b0764',
    cardBg: '#ffffff',
    cardBorder: '2px solid #ec4899',
    scoreBugMainBg: 'bg-purple-950',
    scoreBugAccentBg: 'bg-pink-600',
    scoreBugTextColor: 'text-white',
    layoutStyle: 'broadcast-full',
    showOverDots: true,
    showTargetBar: true,
  },
  super_fission: {
    id: 'super_fission',
    name: 'SUPER FISSION (NEON GREEN & DEEP PURPLE)',
    headerGradient: 'linear-gradient(90deg, #090938 0%, #22c55e 50%, #090938 100%)',
    primaryAccent: '#22c55e',
    badgeBg: '#090938',
    cardBg: '#ffffff',
    cardBorder: '2px solid #22c55e',
    scoreBugMainBg: 'bg-[#090938]',
    scoreBugAccentBg: 'bg-emerald-500',
    scoreBugTextColor: 'text-white',
    layoutStyle: 'super-fission',
    animationVariant: 'neon-pulse',
    showOverDots: true,
    showTargetBar: true,
  },
  crickpro_elite: {
    id: 'crickpro_elite',
    name: 'CRICKPRO ELITE OFFICIAL',
    headerGradient: 'linear-gradient(90deg, #ffd700 0%, #160c30 50%, #00d2ff 100%)',
    primaryAccent: '#ffd700',
    badgeBg: '#160c30',
    teamLabelBg: '#ffd700',
    teamLabelColor: '#160c30',
    scoreColor: '#ffd700',
    scoreBoxBg: '#160c30',
    battersBg: '#ffffff',
    centerBoxBg: '#160c30',
    bowlerBg: '#ffffff',
    scoreBugMainBg: 'bg-[#160c30]',
    scoreBugAccentBg: 'bg-[#ffd700]',
    scoreBugTextColor: 'text-white',
    layoutStyle: 'crickpro-elite',
    animationVariant: 'explosive-gold',
    showOverDots: true,
    showTargetBar: true,
  },
};

export const THEME_ID_MAP: Record<string, string> = {
  '1': 'asia_cup',
  '2': 'cwc19',
  '3': 'ct2025',
  '4': 'cwc_women25',
  '5': 'wcl_fancode',
  '6': 'cwc23',
  '7': 'bbl_black',
  '8': 'cricfusion',
  '9': 't20_asia24',
  '10': 'sa20',
  '11': 'jiocinema',
  '12': 'IPL',
  '13': 'wt20_2024',
  '14': 'bbl_star',
  '15': 'ipl25',
  '16': 'cricpic',
  '17': 'cwc23_diwali',
  '18': 'bbl_white',
  '19': 'cwc_t20_2020',
  '20': 'icc_wc_vibrant',
  '21': 'super_fission',
  '22': 'local_match_pro',
  '23': 'crickpro_elite',
};

export function resolveThemeFromUrlOrStore(tournamentIdFromStore: string, tournamentName?: string): TournamentTheme {
  if (typeof window === 'undefined') return PRESET_TOURNAMENTS['t20_asia24'];

  const hash = window.location.hash || '';
  const search = window.location.search || '';

  // 1. Check URL query param ?theme=... (Highest priority for OBS Browser Source links)
  const hashQuery = hash.includes('?') ? hash.split('?')[1] : search;
  const params = new URLSearchParams(hashQuery);
  const themeParam = params.get('theme');

  if (themeParam) {
    const key = THEME_ID_MAP[themeParam] || themeParam;
    if (PRESET_TOURNAMENTS[key]) return PRESET_TOURNAMENTS[key];
  }

  // 2. Check Hash path /#/theme/:themeId
  if (hash.includes('/theme/')) {
    const parts = hash.split('/theme/')[1]?.split('?')[0]?.split('/');
    if (parts && parts[0]) {
      const themeIdFromPath = parts[0];
      const key = THEME_ID_MAP[themeIdFromPath] || themeIdFromPath;
      if (PRESET_TOURNAMENTS[key]) return PRESET_TOURNAMENTS[key];
    }
  }

  // 3. Give priority to live store tournamentId broadcasted from Control Studio
  if (tournamentIdFromStore && tournamentIdFromStore !== 'tour_default') {
    const key = THEME_ID_MAP[tournamentIdFromStore] || tournamentIdFromStore;
    if (PRESET_TOURNAMENTS[key]) return PRESET_TOURNAMENTS[key];
  }

  // 4. Auto-match theme from matchDetails.tournament (league name)
  if (tournamentName) {
    const themeFromLeague = getThemeByLeagueName(tournamentName);
    if (themeFromLeague) {
      return themeFromLeague;
    }
  }

  // 5. Default fallback to T20 Emerging Asia Cup
  return PRESET_TOURNAMENTS['t20_asia24'];
}

export function getThemeByLeagueName(searchName: string): TournamentTheme {
  if (!searchName) return PRESET_TOURNAMENTS['IPL'];

  const normalized = searchName.trim().toLowerCase();

  // 1. Direct match on key ID
  if (PRESET_TOURNAMENTS[searchName]) return PRESET_TOURNAMENTS[searchName];
  if (PRESET_TOURNAMENTS[normalized]) return PRESET_TOURNAMENTS[normalized];

  // 2. Search entries
  const entries = Object.values(PRESET_TOURNAMENTS);

  const exactMatch = entries.find(
    (t) => t.id.toLowerCase() === normalized || t.name.toLowerCase() === normalized
  );
  if (exactMatch) return exactMatch;

  // Keyword matching
  if (normalized.includes('asia cup') || normalized.includes('asia_cup')) {
    if (normalized.includes('emerging') || normalized.includes('2024') || normalized.includes('t20_asia')) {
      return PRESET_TOURNAMENTS['t20_asia24'];
    }
    return PRESET_TOURNAMENTS['asia_cup'];
  }
  if (normalized.includes('ipl 2025') || normalized.includes('ipl 25') || normalized.includes('ipl25')) {
    return PRESET_TOURNAMENTS['ipl25'];
  }
  if (normalized.includes('ipl') || normalized.includes('cricpic')) {
    return PRESET_TOURNAMENTS['IPL'];
  }
  if (normalized.includes('champions trophy') || normalized.includes('ct2025')) {
    return PRESET_TOURNAMENTS['ct2025'];
  }
  if (normalized.includes('women') || normalized.includes('cwc_women')) {
    return PRESET_TOURNAMENTS['cwc_women25'];
  }
  if (normalized.includes('fancode') || normalized.includes('legends') || normalized.includes('wcl')) {
    return PRESET_TOURNAMENTS['wcl_fancode'];
  }
  if (normalized.includes('big bash') || normalized.includes('bbl')) {
    if (normalized.includes('star')) return PRESET_TOURNAMENTS['bbl_star'];
    if (normalized.includes('white')) return PRESET_TOURNAMENTS['bbl_white'];
    return PRESET_TOURNAMENTS['bbl_black'];
  }
  if (normalized.includes('sa20') || normalized.includes('south africa league')) {
    return PRESET_TOURNAMENTS['sa20'];
  }
  if (normalized.includes('jio') || normalized.includes('jiocinema')) {
    return PRESET_TOURNAMENTS['jiocinema'];
  }
  if (normalized.includes('2024') || normalized.includes('wt20')) {
    return PRESET_TOURNAMENTS['wt20_2024'];
  }
  if (normalized.includes('diwali')) {
    return PRESET_TOURNAMENTS['cwc23_diwali'];
  }
  if (normalized.includes('2023') || normalized.includes('cwc23')) {
    return PRESET_TOURNAMENTS['cwc23'];
  }
  if (normalized.includes('2019') || normalized.includes('cwc19')) {
    return PRESET_TOURNAMENTS['cwc19'];
  }
  if (normalized.includes('2020')) {
    return PRESET_TOURNAMENTS['cwc_t20_2020'];
  }
  if (normalized.includes('fusion') || normalized.includes('glass')) {
    return PRESET_TOURNAMENTS['cricfusion'];
  }
  if (normalized.includes('crickpro') || normalized.includes('elite')) {
    return PRESET_TOURNAMENTS['crickpro_elite'];
  }

  const partialMatch = entries.find((t) =>
    t.name.toLowerCase().includes(normalized) || normalized.includes(t.name.toLowerCase())
  );
  if (partialMatch) return partialMatch;

  return PRESET_TOURNAMENTS['IPL'];
}


