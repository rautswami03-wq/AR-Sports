import { create } from 'zustand';
import { PRESET_TEAMS } from '../theme/presetThemes';
import { publishLiveMatchState } from '../services/firebase';
const STORAGE_KEY = 'cricscorer_match_state_v2';
const broadcastChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
    ? new BroadcastChannel('cricscorer_overlay_channel_v2')
    : null;
let isReceivingBroadcast = false;
let socket = null;
function postStateSync(state) {
    if (isReceivingBroadcast)
        return;
    const syncPayload = {
        teamA: state.teamA,
        teamB: state.teamB,
        matchDetails: state.matchDetails,
        battingTeamId: state.battingTeamId,
        bowlingTeamId: state.bowlingTeamId,
        activeOverlays: state.activeOverlays,
        activeAnimation: state.activeAnimation,
        tournamentId: state.tournamentId,
    };
    // 1. Save to LocalStorage & Dispatch Local Event
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(syncPayload));
            window.dispatchEvent(new CustomEvent('cricscorer_local_update', { detail: syncPayload }));
        }
        catch (e) {
            console.warn('LocalStorage save warning:', e);
        }
    }
    // 2. Post to BroadcastChannel
    if (broadcastChannel) {
        try {
            broadcastChannel.postMessage({
                type: 'CRICSCORER_STATE_SYNC',
                payload: syncPayload,
            });
        }
        catch (e) {
            console.warn('BroadcastChannel sync warning:', e);
        }
    }
    // 3. Post to WebSocket Server
    if (socket && socket.readyState === WebSocket.OPEN) {
        try {
            socket.send(JSON.stringify({
                type: 'STATE_SYNC',
                matchId: 'match_live_001',
                payload: syncPayload,
            }));
        }
        catch (e) {
            console.warn('WebSocket send warning:', e);
        }
    }
    // 4. Post to Firebase Cloud Firestore (Sanitize JSON to remove undefined fields for Firebase)
    try {
        const cleanPayload = JSON.parse(JSON.stringify(syncPayload));
        publishLiveMatchState('live_match_default', cleanPayload);
    }
    catch (e) {
        console.warn('Firebase publish notice:', e);
    }
}
const DEFAULT_TEAM_A = {
    id: 'teamA',
    shortName: 'T1',
    fullName: 'Team 1',
    primaryColor: PRESET_TEAMS.IND.primaryColor,
    secondaryColor: PRESET_TEAMS.IND.secondaryColor,
    accentColor: PRESET_TEAMS.IND.accentColor,
    score: 0,
    wickets: 0,
    overs: 0,
    balls: 0,
    playingXI: ['Striker 1', 'Striker 2', 'Bowler 1'],
    batters: [
        { id: 'b1', name: 'Striker 1', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isStriker: true },
        { id: 'b2', name: 'Striker 2', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isStriker: false },
    ],
    bowlers: [
        { id: 'bw1', name: 'Bowler 1', overs: 0, ballsInCurrentOver: 0, maidens: 0, runsConceded: 0, wickets: 0, economy: 0, isCurrent: true },
    ],
};
const DEFAULT_TEAM_B = {
    id: 'teamB',
    shortName: 'T2',
    fullName: 'Team 2',
    primaryColor: PRESET_TEAMS.AUS.primaryColor,
    secondaryColor: PRESET_TEAMS.AUS.secondaryColor,
    accentColor: PRESET_TEAMS.AUS.accentColor,
    score: 0,
    wickets: 0,
    overs: 0,
    balls: 0,
    playingXI: ['Striker 1', 'Striker 2', 'Bowler 1'],
    batters: [
        { id: 'b1', name: 'Striker 1', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isStriker: true },
        { id: 'b2', name: 'Striker 2', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isStriker: false },
    ],
    bowlers: [
        { id: 'bw1', name: 'Bowler 1', overs: 0, ballsInCurrentOver: 0, maidens: 0, runsConceded: 0, wickets: 0, economy: 0, isCurrent: true },
    ],
};
const DEFAULT_MATCH_DETAILS = {
    title: 'CRICKET MATCH',
    tournament: 'TOURNAMENT NAME',
    stage: 'MATCH 1',
    venue: 'STADIUM VENUE',
    tossWinner: 'Team 1',
    tossDecision: 'bat',
    targetRuns: 0,
    currentInnings: 1,
    totalOvers: 20,
    recentBalls: ['0', '0', '0', '0', '0', '0'],
    partnership: {
        runs: 0,
        balls: 0,
        batter1Name: 'Striker 1',
        batter1Runs: 0,
        batter1Balls: 0,
        batter2Name: 'Striker 2',
        batter2Runs: 0,
        batter2Balls: 0,
    },
    fallOfWickets: [],
    matchStatusText: 'MATCH NOT STARTED YET',
    pointsTable: [],
    topBatters: [],
    topBowlers: [],
    sponsors: [],
};
const INITIAL_OVERLAYS = {
    scoreBug: true,
    battingLowerThird: false,
    bowlingLowerThird: false,
    battingScorecard: false,
    bowlingScorecard: false,
    matchSummary: false,
    partnership: false,
    currentBatters: false,
    currentBowler: false,
    requiredRunRate: false,
    currentRunRate: false,
    fallOfWickets: false,
    target: false,
    winnerScreen: false,
    playingXI: false,
    toss: false,
    playerStatistics: false,
    bowlerStatistics: false,
    playerOfTheMatch: false,
    playerOfTheTournament: false,
    topBatters: false,
    topBowlers: false,
    topStrikers: false,
    topPlayerOfSeries: false,
    pointsTable: false,
    sponsorGraphics: false,
    countdown: false,
    replayLowerThird: false,
    decision: false,
    graph: false,
    groupPt1: false,
    groupPt2: false,
    groupPt3: false,
    groupPt4: false,
    groupPt5: false,
    groupPt6: false,
    groupPt7: false,
    groupPt8: false,
    superOver: false,
    wagonWheel: false,
    pitchMap: false,
    manhattan: false,
    commentator: false,
    watermark: false,
    manOfTheMatchCard: false,
};
// Initial state loader from LocalStorage
function loadInitialState() {
    if (typeof window !== 'undefined') {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                return {
                    teamA: parsed.teamA || DEFAULT_TEAM_A,
                    teamB: parsed.teamB || DEFAULT_TEAM_B,
                    matchDetails: parsed.matchDetails || DEFAULT_MATCH_DETAILS,
                    battingTeamId: parsed.battingTeamId || 'teamA',
                    bowlingTeamId: parsed.bowlingTeamId || 'teamB',
                    activeOverlays: parsed.activeOverlays || INITIAL_OVERLAYS,
                    activeAnimation: parsed.activeAnimation || null,
                    tournamentId: parsed.tournamentId || 'tour_default',
                };
            }
        }
        catch (e) {
            console.warn('LocalStorage load warning:', e);
        }
    }
    return {
        teamA: DEFAULT_TEAM_A,
        teamB: DEFAULT_TEAM_B,
        matchDetails: DEFAULT_MATCH_DETAILS,
        battingTeamId: 'teamA',
        bowlingTeamId: 'teamB',
        activeOverlays: INITIAL_OVERLAYS,
        activeAnimation: null,
        tournamentId: 'tour_default',
    };
}
const loadedState = loadInitialState();
function getSnapshot(state) {
    return JSON.parse(JSON.stringify({
        teamA: state.teamA,
        teamB: state.teamB,
        matchDetails: state.matchDetails,
        battingTeamId: state.battingTeamId,
        bowlingTeamId: state.bowlingTeamId,
    }));
}
const isBattingTeamA = (state) => state.battingTeamId === 'teamA' ||
    state.battingTeamId === state.teamA.id ||
    state.battingTeamId === state.teamA.shortName ||
    state.battingTeamId === state.teamA.fullName;
export const useBroadcastStore = create((set, get) => ({
    teamA: loadedState.teamA,
    teamB: loadedState.teamB,
    matchDetails: loadedState.matchDetails,
    battingTeamId: loadedState.battingTeamId,
    bowlingTeamId: loadedState.bowlingTeamId,
    activeOverlays: loadedState.activeOverlays,
    activeAnimation: loadedState.activeAnimation,
    animationTimeoutId: null,
    tournamentId: loadedState.tournamentId,
    isWsConnected: false,
    historyStack: [],
    setWsConnected: (connected) => set({ isWsConnected: connected }),
    applyExternalState: (newState) => {
        if (!newState || typeof newState !== 'object')
            return;
        isReceivingBroadcast = true;
        set((state) => ({
            ...state,
            ...(newState.teamA ? { teamA: { ...state.teamA, ...newState.teamA } } : {}),
            ...(newState.teamB ? { teamB: { ...state.teamB, ...newState.teamB } } : {}),
            ...(newState.matchDetails ? { matchDetails: { ...state.matchDetails, ...newState.matchDetails } } : {}),
            ...(newState.battingTeamId ? { battingTeamId: newState.battingTeamId } : {}),
            ...(newState.bowlingTeamId ? { bowlingTeamId: newState.bowlingTeamId } : {}),
            ...(newState.activeOverlays ? { activeOverlays: { ...state.activeOverlays, ...newState.activeOverlays } } : {}),
            ...(newState.activeAnimation !== undefined ? { activeAnimation: newState.activeAnimation } : {}),
            ...(newState.tournamentId ? { tournamentId: newState.tournamentId } : {}),
        }));
        isReceivingBroadcast = false;
    },
    toggleOverlay: (type, forceState) => {
        set((state) => {
            const updated = {
                ...state.activeOverlays,
                [type]: forceState !== undefined ? forceState : !state.activeOverlays[type],
            };
            const nextState = { ...state, activeOverlays: updated };
            postStateSync(nextState);
            return { activeOverlays: updated };
        });
    },
    triggerAnimation: (type, durationMs = 4000) => {
        const { animationTimeoutId } = get();
        if (animationTimeoutId)
            clearTimeout(animationTimeoutId);
        const newTimeout = setTimeout(() => {
            set({ activeAnimation: null, animationTimeoutId: null });
            postStateSync({ ...get(), activeAnimation: null });
        }, durationMs);
        set({ activeAnimation: type, animationTimeoutId: newTimeout });
        postStateSync({ ...get(), activeAnimation: type });
    },
    clearAnimation: () => {
        const { animationTimeoutId } = get();
        if (animationTimeoutId)
            clearTimeout(animationTimeoutId);
        set({ activeAnimation: null, animationTimeoutId: null });
        postStateSync({ ...get(), activeAnimation: null });
    },
    addRuns: (runs, isBoundary = false, boundaryType) => {
        set((state) => {
            const snapshot = getSnapshot(state);
            const newHistory = [...state.historyStack, snapshot].slice(-30);
            const isTeamA = isBattingTeamA(state);
            const battingTeamKey = isTeamA ? 'teamA' : 'teamB';
            const bowlingTeamKey = isTeamA ? 'teamB' : 'teamA';
            const team = { ...state[battingTeamKey] };
            const bowlingTeam = { ...state[bowlingTeamKey] };
            let balls = team.balls + 1;
            let overs = team.overs;
            if (balls >= 6) {
                overs += 1;
                balls = 0;
            }
            team.balls = balls;
            team.overs = overs;
            team.score += runs;
            const batters = [...team.batters];
            const strikerIndex = batters.findIndex((b) => b.isStriker);
            if (strikerIndex !== -1) {
                const striker = { ...batters[strikerIndex] };
                striker.runs += runs;
                striker.balls += 1;
                if (boundaryType === 4)
                    striker.fours += 1;
                if (boundaryType === 6)
                    striker.sixes += 1;
                if (runs % 2 !== 0) {
                    const nonStrikerIndex = batters.findIndex((b) => !b.isOut && !b.isStriker);
                    if (nonStrikerIndex !== -1) {
                        striker.isStriker = false;
                        batters[nonStrikerIndex] = { ...batters[nonStrikerIndex], isStriker: true };
                    }
                }
                batters[strikerIndex] = striker;
            }
            team.batters = batters;
            // Update active Bowler stats
            const bowlers = [...bowlingTeam.bowlers];
            const activeBowlerIndex = bowlers.findIndex((bw) => bw.isCurrent) !== -1
                ? bowlers.findIndex((bw) => bw.isCurrent)
                : 0;
            if (bowlers[activeBowlerIndex]) {
                const bw = { ...bowlers[activeBowlerIndex] };
                bw.runsConceded += runs;
                let bwBalls = bw.ballsInCurrentOver + 1;
                let bwOvers = bw.overs;
                if (bwBalls >= 6) {
                    bwOvers += 1;
                    bwBalls = 0;
                }
                bw.ballsInCurrentOver = bwBalls;
                bw.overs = bwOvers;
                const totalBowlerBalls = bwOvers * 6 + bwBalls;
                bw.economy = totalBowlerBalls > 0 ? Number(((bw.runsConceded / totalBowlerBalls) * 6).toFixed(2)) : 0;
                bowlers[activeBowlerIndex] = bw;
                bowlingTeam.bowlers = bowlers;
            }
            const symbol = isBoundary ? (boundaryType === 6 ? '6' : '4') : runs.toString();
            const recent = [symbol, ...state.matchDetails.recentBalls.slice(0, 5)];
            const nextState = {
                [battingTeamKey]: team,
                [bowlingTeamKey]: bowlingTeam,
                matchDetails: { ...state.matchDetails, recentBalls: recent },
                historyStack: newHistory,
            };
            postStateSync({ ...state, ...nextState });
            return nextState;
        });
        let milestoneReached = null;
        const currentBatters = (isBattingTeamA(get()) ? get().teamA : get().teamB).batters;
        const currentStriker = currentBatters.find((b) => b.isStriker);
        const prevRuns = currentStriker?.runs || 0;
        const newRuns = prevRuns + runs;
        if (prevRuns < 50 && newRuns >= 50 && newRuns < 100)
            milestoneReached = 'FIFTY';
        if (prevRuns < 100 && newRuns >= 100)
            milestoneReached = 'CENTURY';
        if (milestoneReached) {
            get().triggerAnimation(milestoneReached, 5000);
        }
        else {
            if (boundaryType === 4)
                get().triggerAnimation('FOUR', 3500);
            if (boundaryType === 6)
                get().triggerAnimation('SIX', 4500);
        }
    },
    addExtra: (extraType, extraRuns = 1) => {
        set((state) => {
            const snapshot = getSnapshot(state);
            const newHistory = [...state.historyStack, snapshot].slice(-30);
            const isTeamA = isBattingTeamA(state);
            const battingTeamKey = isTeamA ? 'teamA' : 'teamB';
            const bowlingTeamKey = isTeamA ? 'teamB' : 'teamA';
            const team = { ...state[battingTeamKey] };
            const bowlingTeam = { ...state[bowlingTeamKey] };
            team.score += extraRuns;
            const bowlers = [...bowlingTeam.bowlers];
            const activeBowlerIndex = bowlers.findIndex((bw) => bw.isCurrent) !== -1
                ? bowlers.findIndex((bw) => bw.isCurrent)
                : 0;
            if (bowlers[activeBowlerIndex]) {
                const bw = { ...bowlers[activeBowlerIndex] };
                bw.runsConceded += extraRuns;
                const totalBowlerBalls = bw.overs * 6 + bw.ballsInCurrentOver;
                bw.economy = totalBowlerBalls > 0 ? Number(((bw.runsConceded / totalBowlerBalls) * 6).toFixed(2)) : 0;
                bowlers[activeBowlerIndex] = bw;
                bowlingTeam.bowlers = bowlers;
            }
            const symbol = extraType === 'WIDE' ? `${extraRuns}WD` : `${extraRuns}NB`;
            const recent = [symbol, ...state.matchDetails.recentBalls.slice(0, 5)];
            const nextState = {
                [battingTeamKey]: team,
                [bowlingTeamKey]: bowlingTeam,
                matchDetails: { ...state.matchDetails, recentBalls: recent },
                historyStack: newHistory,
            };
            postStateSync({ ...state, ...nextState });
            return nextState;
        });
        if (extraType === 'WIDE')
            get().triggerAnimation('WIDE', 3000);
        if (extraType === 'NO_BALL')
            get().triggerAnimation('NO_BALL', 3000);
    },
    addWicket: (dismissalType = 'c & b Bowler') => {
        set((state) => {
            const snapshot = getSnapshot(state);
            const newHistory = [...state.historyStack, snapshot].slice(-30);
            const isTeamA = isBattingTeamA(state);
            const battingTeamKey = isTeamA ? 'teamA' : 'teamB';
            const bowlingTeamKey = isTeamA ? 'teamB' : 'teamA';
            const team = { ...state[battingTeamKey] };
            const bowlingTeam = { ...state[bowlingTeamKey] };
            team.wickets += 1;
            let balls = team.balls + 1;
            let overs = team.overs;
            if (balls >= 6) {
                overs += 1;
                balls = 0;
            }
            team.balls = balls;
            team.overs = overs;
            const batters = [...team.batters];
            const strikerIndex = batters.findIndex((b) => b.isStriker);
            if (strikerIndex !== -1) {
                batters[strikerIndex] = {
                    ...batters[strikerIndex],
                    isOut: true,
                    isStriker: false,
                    dismissal: dismissalType,
                };
            }
            const nextBatterIndex = batters.findIndex((b) => !b.isOut && !b.isStriker);
            if (nextBatterIndex !== -1) {
                batters[nextBatterIndex] = {
                    ...batters[nextBatterIndex],
                    isStriker: true,
                };
            }
            team.batters = batters;
            // Update active Bowler wickets & overs
            const bowlers = [...bowlingTeam.bowlers];
            const activeBowlerIndex = bowlers.findIndex((bw) => bw.isCurrent) !== -1
                ? bowlers.findIndex((bw) => bw.isCurrent)
                : 0;
            if (bowlers[activeBowlerIndex]) {
                const bw = { ...bowlers[activeBowlerIndex] };
                bw.wickets += 1;
                let bwBalls = bw.ballsInCurrentOver + 1;
                let bwOvers = bw.overs;
                if (bwBalls >= 6) {
                    bwOvers += 1;
                    bwBalls = 0;
                }
                bw.ballsInCurrentOver = bwBalls;
                bw.overs = bwOvers;
                const totalBowlerBalls = bwOvers * 6 + bwBalls;
                bw.economy = totalBowlerBalls > 0 ? Number(((bw.runsConceded / totalBowlerBalls) * 6).toFixed(2)) : 0;
                bowlers[activeBowlerIndex] = bw;
                bowlingTeam.bowlers = bowlers;
            }
            const recent = ['W', ...state.matchDetails.recentBalls.slice(0, 5)];
            const nextState = {
                [battingTeamKey]: team,
                [bowlingTeamKey]: bowlingTeam,
                matchDetails: { ...state.matchDetails, recentBalls: recent },
                historyStack: newHistory,
            };
            postStateSync({ ...state, ...nextState });
            return nextState;
        });
        get().triggerAnimation('WICKET', 4500);
    },
    undoLastBall: () => {
        set((state) => {
            if (state.historyStack.length === 0)
                return state;
            const history = [...state.historyStack];
            const lastSnapshot = history.pop();
            if (!lastSnapshot)
                return state;
            const nextState = {
                teamA: lastSnapshot.teamA,
                teamB: lastSnapshot.teamB,
                matchDetails: lastSnapshot.matchDetails,
                battingTeamId: lastSnapshot.battingTeamId,
                bowlingTeamId: lastSnapshot.bowlingTeamId,
                historyStack: history,
                activeAnimation: null,
            };
            postStateSync({ ...state, ...nextState });
            return nextState;
        });
        // Also notify backend server if connected
        if (typeof window !== 'undefined') {
            fetch('http://localhost:4000/api/matches/match_live_001/undo', { method: 'POST' }).catch(() => { });
        }
    },
    switchStrikers: () => {
        set((state) => {
            const isTeamA = isBattingTeamA(state);
            const team = isTeamA ? { ...state.teamA } : { ...state.teamB };
            const batters = team.batters.map((b) => {
                if (!b.isOut)
                    return { ...b, isStriker: !b.isStriker };
                return b;
            });
            team.batters = batters;
            const nextState = { [isTeamA ? 'teamA' : 'teamB']: team };
            postStateSync({ ...state, ...nextState });
            return nextState;
        });
    },
    setBattingTeam: (teamId) => {
        set((state) => {
            const canonicalId = teamId === state.teamA.id || teamId === state.teamA.shortName || teamId === 'teamA' ? 'teamA' : 'teamB';
            const nextState = {
                battingTeamId: canonicalId,
                bowlingTeamId: canonicalId === 'teamA' ? 'teamB' : 'teamA',
            };
            postStateSync({ ...state, ...nextState });
            return nextState;
        });
    },
    updateMatchSettings: (settings) => {
        set((state) => {
            const nextMatchDetails = { ...state.matchDetails, ...settings };
            postStateSync({ ...state, matchDetails: nextMatchDetails });
            return { matchDetails: nextMatchDetails };
        });
    },
    updateTeamDetails: (targetTeam, details) => {
        set((state) => {
            const newFullName = details.fullName !== undefined ? details.fullName : state[targetTeam].fullName;
            let newShortName = details.shortName !== undefined ? details.shortName : state[targetTeam].shortName;
            if (details.fullName && (!details.shortName || details.shortName === state[targetTeam].shortName)) {
                newShortName = newFullName.split(' ').map((word) => word[0]).join('').substring(0, 4).toUpperCase() || newFullName.substring(0, 3).toUpperCase();
            }
            const updatedTeam = {
                ...state[targetTeam],
                fullName: newFullName,
                shortName: newShortName,
                logoUrl: details.logoUrl !== undefined ? details.logoUrl : state[targetTeam].logoUrl,
            };
            const nextState = { [targetTeam]: updatedTeam };
            postStateSync({ ...state, ...nextState });
            return nextState;
        });
    },
    setDecision: (decision) => {
        set((state) => {
            const nextMatchDetails = { ...state.matchDetails, decision };
            const nextOverlays = { ...state.activeOverlays, decision: !!decision };
            postStateSync({ ...state, matchDetails: nextMatchDetails, activeOverlays: nextOverlays });
            return { matchDetails: nextMatchDetails, activeOverlays: nextOverlays };
        });
    },
    setGraphType: (graphType) => {
        set((state) => {
            const nextMatchDetails = { ...state.matchDetails, graphType };
            const nextOverlays = { ...state.activeOverlays, graph: !!graphType };
            postStateSync({ ...state, matchDetails: nextMatchDetails, activeOverlays: nextOverlays });
            return { matchDetails: nextMatchDetails, activeOverlays: nextOverlays };
        });
    },
    retireBatter: () => {
        set((state) => {
            const isTeamA = isBattingTeamA(state);
            const battingTeamKey = isTeamA ? 'teamA' : 'teamB';
            const team = state[battingTeamKey];
            const strikerIndex = team.batters.findIndex((b) => b.isStriker);
            if (strikerIndex < 0)
                return {};
            const updatedBatters = [...team.batters];
            updatedBatters[strikerIndex] = { ...updatedBatters[strikerIndex], isOut: true, dismissal: 'RETIRED HURT', isStriker: false };
            const nextBatter = updatedBatters.find((b) => !b.isOut && !b.isStriker);
            if (nextBatter) {
                const nextIndex = updatedBatters.findIndex((b) => b.id === nextBatter.id);
                updatedBatters[nextIndex] = { ...updatedBatters[nextIndex], isStriker: true };
            }
            const nextTeam = { ...team, batters: updatedBatters };
            const nextState = { [battingTeamKey]: nextTeam };
            postStateSync({ ...state, ...nextState });
            return nextState;
        });
    },
    changeBowler: (name) => {
        set((state) => {
            const isTeamA = isBattingTeamA(state);
            const bowlingTeamKey = isTeamA ? 'teamB' : 'teamA';
            const team = state[bowlingTeamKey];
            const existingBowlerIndex = team.bowlers.findIndex((bw) => bw.name.toLowerCase() === name.toLowerCase());
            let updatedBowlers = team.bowlers.map((bw) => ({ ...bw, isCurrent: false }));
            if (existingBowlerIndex >= 0) {
                updatedBowlers[existingBowlerIndex] = { ...updatedBowlers[existingBowlerIndex], isCurrent: true };
            }
            else {
                const newBowler = {
                    id: `bw_${Date.now()}`,
                    name,
                    overs: 0,
                    ballsInCurrentOver: 0,
                    maidens: 0,
                    runsConceded: 0,
                    wickets: 0,
                    economy: 0.0,
                    isCurrent: true,
                };
                updatedBowlers.push(newBowler);
            }
            const nextTeam = { ...team, bowlers: updatedBowlers };
            const nextState = { [bowlingTeamKey]: nextTeam };
            postStateSync({ ...state, ...nextState });
            return nextState;
        });
    },
    bulkAddPlayers: (targetTeam, playerNames) => {
        set((state) => {
            const team = state[targetTeam];
            const newBatters = playerNames.map((name, i) => ({
                id: `p_${Date.now()}_${i}`,
                name: name.trim(),
                runs: 0,
                balls: 0,
                fours: 0,
                sixes: 0,
                isOut: false,
                isStriker: false,
            }));
            const updatedTeam = {
                ...team,
                playingXI: playerNames.map((p) => p.trim()),
                batters: [...team.batters, ...newBatters],
            };
            const nextState = { [targetTeam]: updatedTeam };
            postStateSync({ ...state, ...nextState });
            return nextState;
        });
    },
    updateBatterStats: (batterId, updates) => {
        set((state) => {
            const updateTeam = (team) => ({
                ...team,
                batters: team.batters.map((b) => (b.id === batterId ? { ...b, ...updates } : b)),
            });
            const nextState = {
                teamA: updateTeam(state.teamA),
                teamB: updateTeam(state.teamB),
            };
            postStateSync({ ...state, ...nextState });
            return nextState;
        });
    },
    updateBowlerStats: (bowlerId, updates) => {
        set((state) => {
            const updateTeam = (team) => ({
                ...team,
                bowlers: team.bowlers.map((bw) => (bw.id === bowlerId ? { ...bw, ...updates } : bw)),
            });
            const nextState = {
                teamA: updateTeam(state.teamA),
                teamB: updateTeam(state.teamB),
            };
            postStateSync({ ...state, ...nextState });
            return nextState;
        });
    },
    updateTeamColors: (targetTeam, primary, secondary, accent) => {
        set((state) => {
            const nextState = {
                [targetTeam]: {
                    ...state[targetTeam],
                    primaryColor: primary,
                    secondaryColor: secondary,
                    accentColor: accent || state[targetTeam].accentColor,
                },
            };
            postStateSync({ ...state, ...nextState });
            return nextState;
        });
    },
    setTournament: (tournamentId) => {
        set((state) => {
            postStateSync({ ...state, tournamentId });
            return { tournamentId };
        });
    },
    setTournamentId: (tournamentId) => {
        set((state) => {
            postStateSync({ ...state, tournamentId });
            return { tournamentId };
        });
    },
    resetMatchState: () => {
        const defaultState = {
            teamA: DEFAULT_TEAM_A,
            teamB: DEFAULT_TEAM_B,
            matchDetails: DEFAULT_MATCH_DETAILS,
            activeOverlays: INITIAL_OVERLAYS,
            activeAnimation: null,
            historyStack: [],
        };
        set(defaultState);
        postStateSync(defaultState);
    },
    startNewMatchWithTeams: (teamAName, teamBName, tournamentName) => {
        const deriveShort = (name) => name.split(' ').map((w) => w[0]).join('').substring(0, 4).toUpperCase() || name.substring(0, 3).toUpperCase();
        const shortA = deriveShort(teamAName);
        const shortB = deriveShort(teamBName);
        const resetTeam = (baseTeam, fullName, shortName) => ({
            ...baseTeam,
            fullName,
            shortName,
            score: 0,
            wickets: 0,
            overs: 0,
            balls: 0,
            batters: Array.from({ length: 11 }, (_, idx) => ({
                id: `${shortName}_b${idx + 1}`,
                name: idx === 0 ? 'Striker 1' : idx === 1 ? 'Striker 2' : `Batter ${idx + 1}`,
                runs: 0,
                balls: 0,
                fours: 0,
                sixes: 0,
                isOut: false,
                isStriker: idx === 0,
            })),
            bowlers: Array.from({ length: 6 }, (_, idx) => ({
                id: `${shortName}_bw${idx + 1}`,
                name: `Bowler ${idx + 1}`,
                overs: 0,
                ballsInCurrentOver: 0,
                maidens: 0,
                runsConceded: 0,
                wickets: 0,
                economy: 0.0,
                isCurrent: idx === 0,
            })),
        });
        set((state) => {
            const nextState = {
                teamA: resetTeam(state.teamA, teamAName, shortA),
                teamB: resetTeam(state.teamB, teamBName, shortB),
                battingTeamId: 'teamA',
                bowlingTeamId: 'teamB',
                matchDetails: {
                    ...state.matchDetails,
                    tournament: tournamentName || state.matchDetails.tournament,
                    recentBalls: [],
                    winnerMargin: undefined,
                    customInputText: undefined,
                    decision: null,
                },
                activeAnimation: null,
                historyStack: [],
            };
            postStateSync(nextState);
            return nextState;
        });
    },
    startSecondInnings: () => {
        set((state) => {
            const isAFirst = state.battingTeamId === 'teamA' || state.battingTeamId === state.teamA.id;
            const firstInningsBattingTeam = isAFirst ? state.teamA : state.teamB;
            const targetRuns = firstInningsBattingTeam.score + 1;
            const newBattingTeamId = isAFirst ? 'teamB' : 'teamA';
            const newBowlingTeamId = isAFirst ? 'teamA' : 'teamB';
            const nextState = {
                battingTeamId: newBattingTeamId,
                bowlingTeamId: newBowlingTeamId,
                matchDetails: {
                    ...state.matchDetails,
                    currentInnings: 2,
                    targetRuns: targetRuns,
                    recentBalls: [],
                    matchStatusText: `2ND INNINGS | TARGET: ${targetRuns}`,
                },
            };
            postStateSync({ ...state, ...nextState });
            return nextState;
        });
    },
    updatePlayerAvatar: (teamId, playerType, playerId, avatarUrl) => {
        set((state) => {
            const targetTeamKey = teamId === 'teamA' ? 'teamA' : 'teamB';
            const currentTeam = state[targetTeamKey];
            let updatedTeam;
            if (playerType === 'batter') {
                updatedTeam = {
                    ...currentTeam,
                    batters: currentTeam.batters.map((b) => (b.id === playerId ? { ...b, avatarUrl } : b)),
                };
            }
            else {
                updatedTeam = {
                    ...currentTeam,
                    bowlers: currentTeam.bowlers.map((b) => (b.id === playerId ? { ...b, avatarUrl } : b)),
                };
            }
            const nextState = { [targetTeamKey]: updatedTeam };
            postStateSync({ ...state, ...nextState });
            return nextState;
        });
    },
}));
// Auto-reconnecting WebSocket Gateway Client (Connects to wss://websocket-36f4.onrender.com)
function initWebSocketClient() {
    if (typeof window === 'undefined')
        return;
    const RENDER_WS_URL = 'wss://websocket-36f4.onrender.com';
    const wsUrl = window.location.protocol === 'https:' ? RENDER_WS_URL : (import.meta.env.VITE_WS_URL || RENDER_WS_URL);
    function connect() {
        try {
            socket = new WebSocket(wsUrl);
            socket.onopen = () => {
                console.log(`⚡ Connected to CricScorer WebSocket Gateway (${wsUrl})`);
                useBroadcastStore.getState().setWsConnected(true);
                // Send state sync on connection
                if (socket && socket.readyState === WebSocket.OPEN) {
                    const state = useBroadcastStore.getState();
                    const syncPayload = {
                        teamA: state.teamA,
                        teamB: state.teamB,
                        matchDetails: state.matchDetails,
                        battingTeamId: state.battingTeamId,
                        bowlingTeamId: state.bowlingTeamId,
                        activeOverlays: state.activeOverlays,
                        activeAnimation: state.activeAnimation,
                        tournamentId: state.tournamentId,
                    };
                    socket.send(JSON.stringify({
                        type: 'STATE_SYNC',
                        matchId: 'match_live_001',
                        payload: syncPayload,
                    }));
                }
            };
            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'INITIAL_STATE' || data.type === 'MATCH_UPDATE' || data.type === 'STATE_SYNC') {
                        if (data.payload) {
                            useBroadcastStore.getState().applyExternalState(data.payload);
                        }
                    }
                    else if (data.type === 'OVERLAY_TOGGLE' && data.payload) {
                        useBroadcastStore.getState().toggleOverlay(data.payload.overlayId, data.payload.visible);
                    }
                    else if (data.type === 'ANIMATION_TRIGGER' && data.payload) {
                        useBroadcastStore.getState().triggerAnimation(data.payload.animation, data.payload.durationMs);
                    }
                }
                catch (err) {
                    console.warn('WS Message parsing error:', err);
                }
            };
            socket.onclose = () => {
                useBroadcastStore.getState().setWsConnected(false);
                setTimeout(connect, 5000);
            };
            socket.onerror = () => {
                useBroadcastStore.getState().setWsConnected(false);
            };
        }
        catch (err) {
            console.warn('WebSocket init exception:', err);
            setTimeout(connect, 5000);
        }
    }
    connect();
}
initWebSocketClient();
// Setup BroadcastChannel Listener
if (broadcastChannel) {
    broadcastChannel.onmessage = (event) => {
        if (event.data?.type === 'CRICSCORER_STATE_SYNC' && event.data.payload) {
            useBroadcastStore.getState().applyExternalState(event.data.payload);
        }
    };
}
// Setup Window Storage Event Listener & CustomEvent Listener (Guarantees OBS Studio Sync!)
if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY && e.newValue) {
            try {
                const parsed = JSON.parse(e.newValue);
                useBroadcastStore.getState().applyExternalState(parsed);
            }
            catch (err) {
                console.warn('Storage event sync warning:', err);
            }
        }
    });
    window.addEventListener('cricscorer_local_update', (e) => {
        if (e.detail) {
            useBroadcastStore.getState().applyExternalState(e.detail);
        }
    });
}
