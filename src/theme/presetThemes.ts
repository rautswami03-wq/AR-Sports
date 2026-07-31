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
  IPL: {
    id: 'IPL',
    name: 'T20 LEAGUE 2026',
    headerGradient: 'linear-gradient(90deg, #004BA0 0%, #FCCA03 50%, #EC1C24 100%)',
    primaryAccent: '#FCCA03',
    badgeBg: '#0f172a',
    scoreBugMainBg: 'bg-cyan-400',
    scoreBugAccentBg: 'bg-red-600',
    scoreBugTextColor: 'text-slate-950',
  },
  ipl25: {
    id: 'ipl25',
    name: 'IPL 2025 SPECIAL EDITION',
    headerGradient: 'linear-gradient(90deg, #004BA0 0%, #00D2FF 50%, #EC1C24 100%)',
    primaryAccent: '#00D2FF',
    badgeBg: '#0b0f19',
    scoreBugMainBg: 'bg-cyan-400',
    scoreBugAccentBg: 'bg-red-600',
    scoreBugTextColor: 'text-slate-950',
  },
  asia_cup: {
    id: 'asia_cup',
    name: 'ASIA CUP CRICKET 2025',
    headerGradient: 'linear-gradient(90deg, #064e3b 0%, #10b981 50%, #0284c7 100%)',
    primaryAccent: '#34d399',
    badgeBg: '#022c22',
    scoreBugMainBg: 'bg-emerald-500',
    scoreBugAccentBg: 'bg-emerald-800',
    scoreBugTextColor: 'text-white',
  },
  cwc19: {
    id: 'cwc19',
    name: 'ICC CRICKET WORLD CUP 2019',
    headerGradient: 'linear-gradient(90deg, #1e1b4b 0%, #4338ca 50%, #db2777 100%)',
    primaryAccent: '#f43f5e',
    badgeBg: '#0f172a',
    scoreBugMainBg: 'bg-indigo-600',
    scoreBugAccentBg: 'bg-pink-600',
    scoreBugTextColor: 'text-white',
  },
  ct2025: {
    id: 'ct2025',
    name: 'ICC CHAMPIONS TROPHY 2025',
    headerGradient: 'linear-gradient(90deg, #0f172a 0%, #0284c7 50%, #38bdf8 100%)',
    primaryAccent: '#38bdf8',
    badgeBg: '#030712',
    scoreBugMainBg: 'bg-sky-500',
    scoreBugAccentBg: 'bg-slate-900',
    scoreBugTextColor: 'text-slate-950',
  },
  cwc_women25: {
    id: 'cwc_women25',
    name: 'ICC WOMEN\'S CWC 2025 INDIA',
    headerGradient: 'linear-gradient(90deg, #831843 0%, #db2777 50%, #f59e0b 100%)',
    primaryAccent: '#f472b6',
    badgeBg: '#4c0519',
    scoreBugMainBg: 'bg-pink-500',
    scoreBugAccentBg: 'bg-amber-500',
    scoreBugTextColor: 'text-white',
  },
  wcl_fancode: {
    id: 'wcl_fancode',
    name: 'WORLD CHAMPIONSHIP OF LEGENDS (FANCODE)',
    headerGradient: 'linear-gradient(90deg, #7c2d12 0%, #ea580c 50%, #f97316 100%)',
    primaryAccent: '#fb923c',
    badgeBg: '#1c1917',
    scoreBugMainBg: 'bg-orange-500',
    scoreBugAccentBg: 'bg-neutral-900',
    scoreBugTextColor: 'text-white',
  },
  cwc23: {
    id: 'cwc23',
    name: 'ICC CWC 2023 INDIA 2.0',
    headerGradient: 'linear-gradient(90deg, #1e3a8a 0%, #3b82f6 50%, #ea580c 100%)',
    primaryAccent: '#60a5fa',
    badgeBg: '#172554',
    scoreBugMainBg: 'bg-blue-600',
    scoreBugAccentBg: 'bg-orange-600',
    scoreBugTextColor: 'text-white',
  },
  bbl_black: {
    id: 'bbl_black',
    name: 'BIG BASH LEAGUE (BLACK EDITION)',
    headerGradient: 'linear-gradient(90deg, #09090b 0%, #18181b 50%, #facc15 100%)',
    primaryAccent: '#facc15',
    badgeBg: '#000000',
    scoreBugMainBg: 'bg-neutral-950',
    scoreBugAccentBg: 'bg-yellow-400',
    scoreBugTextColor: 'text-yellow-400',
  },
  bbl_white: {
    id: 'bbl_white',
    name: 'BIG BASH LEAGUE (WHITE EDITION)',
    headerGradient: 'linear-gradient(90deg, #ffffff 0%, #f1f5f9 50%, #84cc16 100%)',
    primaryAccent: '#65a30d',
    badgeBg: '#e2e8f0',
    scoreBugMainBg: 'bg-slate-100',
    scoreBugAccentBg: 'bg-lime-500',
    scoreBugTextColor: 'text-slate-900',
  },
  bbl_star: {
    id: 'bbl_star',
    name: 'STAR SPORTS BBL COVERAGE',
    headerGradient: 'linear-gradient(90deg, #991b1b 0%, #dc2626 50%, #eab308 100%)',
    primaryAccent: '#fde047',
    badgeBg: '#450a0a',
    scoreBugMainBg: 'bg-red-700',
    scoreBugAccentBg: 'bg-amber-400',
    scoreBugTextColor: 'text-white',
  },
  cricfusion: {
    id: 'cricfusion',
    name: 'CRICFUSION DYNAMIC GLASS THEME',
    headerGradient: 'linear-gradient(90deg, #0f766e 0%, #06b6d4 50%, #8b5cf6 100%)',
    primaryAccent: '#22d3ee',
    badgeBg: '#042f2e',
    scoreBugMainBg: 'bg-cyan-600',
    scoreBugAccentBg: 'bg-purple-600',
    scoreBugTextColor: 'text-white',
  },
  cricpic: {
    id: 'cricpic',
    name: 'CRICPIC IPL PRO EDITION',
    headerGradient: 'linear-gradient(90deg, #1e40af 0%, #1d4ed8 50%, #fbbf24 100%)',
    primaryAccent: '#f59e0b',
    badgeBg: '#1e3a8a',
    scoreBugMainBg: 'bg-blue-700',
    scoreBugAccentBg: 'bg-amber-500',
    scoreBugTextColor: 'text-white',
  },
  t20_asia24: {
    id: 't20_asia24',
    name: 'ACC MEN\'S T20 EMERGING ASIA CUP 2024',
    headerGradient: 'linear-gradient(90deg, #052e16 0%, #064e3b 40%, #047857 75%, #d97706 100%)',
    primaryAccent: '#34d399',
    badgeBg: '#022c22',
    cardBg: 'rgba(5, 46, 22, 0.92)',
    cardBorder: '1px solid rgba(52, 211, 153, 0.4)',
    scoreBugMainBg: 'bg-emerald-600',
    scoreBugAccentBg: 'bg-amber-600',
    scoreBugTextColor: 'text-white',
  },
  sa20: {
    id: 'sa20',
    name: 'SA20 SOUTH AFRICA LEAGUE',
    headerGradient: 'linear-gradient(90deg, #047857 0%, #eab308 50%, #c026d3 100%)',
    primaryAccent: '#facc15',
    badgeBg: '#064e3b',
    scoreBugMainBg: 'bg-emerald-700',
    scoreBugAccentBg: 'bg-fuchsia-600',
    scoreBugTextColor: 'text-white',
  },
  jiocinema: {
    id: 'jiocinema',
    name: 'JIO CINEMA STREAM THEME',
    headerGradient: 'linear-gradient(90deg, #831843 0%, #be185d 50%, #06b6d4 100%)',
    primaryAccent: '#f472b6',
    badgeBg: '#500724',
    scoreBugMainBg: 'bg-pink-700',
    scoreBugAccentBg: 'bg-cyan-500',
    scoreBugTextColor: 'text-white',
  },
  wt20_2024: {
    id: 'wt20_2024',
    name: 'ICC MEN\'S T20 WORLD CUP 2024',
    headerGradient: 'linear-gradient(90deg, #3b0764 0%, #7e22ce 50%, #06b6d4 100%)',
    primaryAccent: '#c084fc',
    badgeBg: '#2e1065',
    scoreBugMainBg: 'bg-purple-800',
    scoreBugAccentBg: 'bg-cyan-400',
    scoreBugTextColor: 'text-white',
  },
  cwc23_diwali: {
    id: 'cwc23_diwali',
    name: 'CWC 2023 INDIA (DIWALI EDITION)',
    headerGradient: 'linear-gradient(90deg, #78350f 0%, #d97706 50%, #dc2626 100%)',
    primaryAccent: '#fbbf24',
    badgeBg: '#451a03',
    scoreBugMainBg: 'bg-amber-600',
    scoreBugAccentBg: 'bg-red-700',
    scoreBugTextColor: 'text-white',
  },
  cwc_t20_2020: {
    id: 'cwc_t20_2020',
    name: 'ICC T20 WORLD CUP 2020',
    headerGradient: 'linear-gradient(90deg, #0284c7 0%, #2563eb 50%, #4f46e5 100%)',
    primaryAccent: '#38bdf8',
    badgeBg: '#0f172a',
    scoreBugMainBg: 'bg-blue-600',
    scoreBugAccentBg: 'bg-indigo-700',
    scoreBugTextColor: 'text-white',
  },
  ICC: {
    id: 'ICC',
    name: 'WORLD CRICKET CHAMPIONSHIP 2026',
    headerGradient: 'linear-gradient(90deg, #0f172a 0%, #0284c7 50%, #0f172a 100%)',
    primaryAccent: '#38bdf8',
    badgeBg: '#090d16',
    scoreBugMainBg: 'bg-sky-500',
    scoreBugAccentBg: 'bg-slate-900',
    scoreBugTextColor: 'text-slate-950',
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
};

export function resolveThemeFromUrlOrStore(tournamentIdFromStore: string): TournamentTheme {
  if (typeof window === 'undefined') return PRESET_TOURNAMENTS['IPL'];

  const hash = window.location.hash || '';
  const search = window.location.search || '';

  // 1. Check URL query param ?theme=...
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

  // 3. Fallback to store tournamentId
  const storeKey = THEME_ID_MAP[tournamentIdFromStore] || tournamentIdFromStore || 'IPL';
  return PRESET_TOURNAMENTS[storeKey] || PRESET_TOURNAMENTS['IPL'];
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

  const partialMatch = entries.find((t) =>
    t.name.toLowerCase().includes(normalized) || normalized.includes(t.name.toLowerCase())
  );
  if (partialMatch) return partialMatch;

  return PRESET_TOURNAMENTS['IPL'];
}


