import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.resolve(__dirname, '../data/store.json');

export interface DBData {
  users: Array<{ id: string; email: string; name: string }>;
  matches: Array<{
    id: string;
    streamKey: string;
    title: string;
    tournament: string;
    teamA: any;
    teamB: any;
    currentInnings: number;
    recentBalls: string[];
    historyStack?: any[];
    activeOverlays: Record<string, boolean>;
    activeAnimation: string | null;
    updatedAt: string;
  }>;
  tournaments: Array<{
    id: string;
    name: string;
    teams: string[];
    pointsTable: any[];
  }>;
}

const DEFAULT_DB: DBData = {
  users: [
    { id: 'usr_1', email: 'admin@cricscorer.in', name: 'Studio Admin' }
  ],
  matches: [
    {
      id: 'match_live_001',
      streamKey: 'obs_key_8849102',
      title: 'CHAMPIONSHIP FINAL - IND VS AUS',
      tournament: 'T20 WORLD TROPHY 2026',
      teamA: {
        id: 'IND',
        shortName: 'IND',
        fullName: 'India',
        primaryColor: '#00529B',
        secondaryColor: '#FF9933',
        score: 184,
        wickets: 4,
        overs: 18,
        balls: 4,
      },
      teamB: {
        id: 'AUS',
        shortName: 'AUS',
        fullName: 'Australia',
        primaryColor: '#FFD700',
        secondaryColor: '#006400',
        score: 162,
        wickets: 6,
        overs: 20,
        balls: 0,
      },
      currentInnings: 1,
      recentBalls: ['1', '4', '0', '6', 'W', '2'],
      activeOverlays: {
        scoreBug: true,
        battingLowerThird: false,
        bowlingLowerThird: false,
        battingScorecard: false,
        bowlingScorecard: false,
        matchSummary: false,
        partnership: false,
        playingXI: false,
        toss: false,
        pointsTable: false,
      },
      activeAnimation: null,
      updatedAt: new Date().toISOString(),
    }
  ],
  tournaments: [
    {
      id: 'tourn_001',
      name: 'T20 WORLD TROPHY 2026',
      teams: ['IND', 'AUS', 'ENG', 'SA'],
      pointsTable: [
        { teamId: 'IND', played: 5, won: 5, lost: 0, points: 10, nrr: '+2.14' },
        { teamId: 'AUS', played: 5, won: 4, lost: 1, points: 8, nrr: '+1.45' },
      ],
    }
  ],
};

export function readDB(): DBData {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2));
      return DEFAULT_DB;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.warn('DB Read Warning, using default:', err);
    return DEFAULT_DB;
  }
}

export function writeDB(data: DBData): void {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('DB Write Error:', err);
  }
}
