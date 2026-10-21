/**
 *中央状態管理システム (Centralized Scoreboard State Store)
 * 中央集権型の状態管理とイミュータブルな更新フローを提供します。
 */

export const ACTION_TYPES = {
  UPDATE_MATCH: 'UPDATE_MATCH',
  TRIGGER_EVENT: 'TRIGGER_EVENT',
  SET_THEME: 'SET_THEME',
  SET_LAYOUT: 'SET_LAYOUT',
  SET_VARIANT: 'SET_VARIANT',
  SET_SCENE: 'SET_SCENE',
  TOGGLE_PANEL: 'TOGGLE_PANEL'
};

const initialState = {
  match: {
    teamA: { name: "IND", score: 184, wickets: 3, overs: 14.3, target: 268 },
    teamB: { name: "AUS", score: 98, wickets: 2 },
    batting: {
      current: [
        { id: 1, name: "R. Sharma", runs: 45, balls: 32, fours: 4, sixes: 2, sr: 140.6, isStriker: true },
        { id: 2, name: "V. Kohli", runs: 12, balls: 10, fours: 1, sixes: 0, sr: 120.0, isStriker: false }
      ],
      partnership: { runs: 42, balls: 28, runRate: 9.0 }
    },
    bowling: {
      current: [
        { name: "M. Starc", overs: 3.3, maidens: 0, runs: 34, wickets: 2, econ: 9.71 }
      ]
    },
    commentary: {
      lastBall: "Smith to Kohli, 1 run",
      history: ["Over 14.3: 1 run", "Over 14.2: DOT", "Over 14.1: WICKET (Rahul c Warner b Starc 18)"]
    },
    charts: {
      last10Overs: [8, 4, 12, 16, 6, 9, 14, 8, 11, 7],
      wagonWheel: [
        { angle: 45, runs: 4 }, { angle: 120, runs: 6 }, { angle: 280, runs: 1 }, { angle: 90, runs: 4 }
      ],
      pitchMap: [
        { x: 45, y: 70, type: "good" }, { x: 55, y: 35, type: "short" }, { x: 50, y: 85, type: "full" }
      ]
    }
  },
  config: {
    themeId: 'classic',
    layout: 'expanded', // compact | expanded
    variant: 'dark', // light | dark | adaptive
    scene: 'scorebug', // scorebug | fullcard | adbreak
    activePanels: {
      batting: true,
      bowling: true,
      partnership: true,
      wagonWheel: false,
      pitchMap: false,
      runRateChart: false,
      commentary: true
    },
    sponsor: {
      name: "CricScorer Pro",
      logo: "🏆",
      banner: "STREAM CRICKET LIVE WITH PROFESSIONAL OVERLAYS"
    }
  }
};

class Store {
  constructor() {
    this.state = JSON.parse(JSON.stringify(initialState));
    this.listeners = [];
  }

  getState() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  dispatch(action) {
    const previousState = JSON.parse(JSON.stringify(this.state));
    
    switch (action.type) {
      case ACTION_TYPES.UPDATE_MATCH:
        this.state.match = { ...this.state.match, ...action.payload };
        break;
      case ACTION_TYPES.SET_THEME:
        this.state.config.themeId = action.payload;
        break;
      case ACTION_TYPES.SET_LAYOUT:
        this.state.config.layout = action.payload;
        break;
      case ACTION_TYPES.SET_VARIANT:
        this.state.config.variant = action.payload;
        break;
      case ACTION_TYPES.SET_SCENE:
        this.state.config.scene = action.payload;
        break;
      case ACTION_TYPES.TOGGLE_PANEL:
        this.state.config.activePanels[action.payload] = !this.state.config.activePanels[action.payload];
        break;
      default:
        return;
    }

    this.notify(previousState);
  }

  notify(previousState) {
    this.listeners.forEach(listener => listener(this.state, previousState));
  }
}

export const store = new Store();
