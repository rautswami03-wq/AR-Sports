import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { subscribeToLiveMatch } from '../../services/firebase';
// Overlays
import { LiveScoreBug } from '../overlays/LiveScoreBug';
import { BattingLowerThird } from '../overlays/BattingLowerThird';
import { BowlingLowerThird } from '../overlays/BowlingLowerThird';
import { BattingScorecard } from '../overlays/BattingScorecard';
import { BowlingScorecard } from '../overlays/BowlingScorecard';
import { MatchSummary } from '../overlays/MatchSummary';
import { PartnershipOverlay } from '../overlays/PartnershipOverlay';
import { CurrentBattersOverlay } from '../overlays/CurrentBattersOverlay';
import { CurrentBowlerOverlay } from '../overlays/CurrentBowlerOverlay';
import { RequiredRunRateOverlay } from '../overlays/RequiredRunRateOverlay';
import { CurrentRunRateOverlay } from '../overlays/CurrentRunRateOverlay';
import { FallOfWicketsOverlay } from '../overlays/FallOfWicketsOverlay';
import { TargetOverlay } from '../overlays/TargetOverlay';
import { WinnerScreenOverlay } from '../overlays/WinnerScreenOverlay';
import { PlayingXIOverlay } from '../overlays/PlayingXIOverlay';
import { TossOverlay } from '../overlays/TossOverlay';
import { PlayerStatisticsOverlay } from '../overlays/PlayerStatisticsOverlay';
import { BowlerStatisticsOverlay } from '../overlays/BowlerStatisticsOverlay';
import { PlayerOfTheMatchOverlay } from '../overlays/PlayerOfTheMatchOverlay';
import { PlayerOfTheTournamentOverlay } from '../overlays/PlayerOfTheTournamentOverlay';
import { TopBattersOverlay } from '../overlays/TopBattersOverlay';
import { TopBowlersOverlay } from '../overlays/TopBowlersOverlay';
import { PointsTableOverlay } from '../overlays/PointsTableOverlay';
import { SponsorGraphicsOverlay } from '../overlays/SponsorGraphicsOverlay';
import { CountdownOverlay } from '../overlays/CountdownOverlay';
import { ReplayLowerThird } from '../overlays/ReplayLowerThird';
// Animations
import { FourAnimation } from '../animations/FourAnimation';
import { SixAnimation } from '../animations/SixAnimation';
import { WicketAnimation } from '../animations/WicketAnimation';
import { WideAnimation } from '../animations/WideAnimation';
import { NoBallAnimation } from '../animations/NoBallAnimation';
import { FreeHitAnimation } from '../animations/FreeHitAnimation';
import { PowerplayAnimation } from '../animations/PowerplayAnimation';
import { StrategicTimeoutAnimation } from '../animations/StrategicTimeoutAnimation';
import { DrinksBreakAnimation } from '../animations/DrinksBreakAnimation';
import { EndOfInningsAnimation } from '../animations/EndOfInningsAnimation';
import { MatchWinnerAnimation } from '../animations/MatchWinnerAnimation';
export const OverlayStage = ({ scale = 1 }) => {
    const { activeOverlays, activeAnimation } = useBroadcastStore();
    const wsConnectedRef = useRef(false);
    // Instant real-time sync for OBS Studio & Browser Sources
    useEffect(() => {
        let lastSavedRaw = '';
        const syncFromStorage = () => {
            if (typeof window === 'undefined')
                return;
            try {
                const raw = localStorage.getItem('cricscorer_match_state_v2');
                if (raw && raw !== lastSavedRaw) {
                    lastSavedRaw = raw;
                    const parsed = JSON.parse(raw);
                    useBroadcastStore.getState().applyExternalState(parsed);
                }
            }
            catch (e) {
                console.warn('Storage polling notice:', e);
            }
        };
        // Initial sync immediately on load
        syncFromStorage();
        // 1. Ultra-fast Polling (Every 100ms guarantees OBS updates without delay)
        const pollInterval = setInterval(syncFromStorage, 100);
        // 2. Storage Event Listener (Cross-tab/Window Instant Trigger)
        const handleStorageChange = (e) => {
            if (e.key === 'cricscorer_match_state_v2' && e.newValue) {
                try {
                    const parsed = JSON.parse(e.newValue);
                    useBroadcastStore.getState().applyExternalState(parsed);
                }
                catch (err) {
                    console.warn('Storage event sync notice:', err);
                }
            }
        };
        window.addEventListener('storage', handleStorageChange);
        // 3. Custom Window Event Listener (Same Window/Preview Instant Sync)
        const handleCustomSync = (e) => {
            const customEvent = e;
            if (customEvent.detail) {
                useBroadcastStore.getState().applyExternalState(customEvent.detail);
            }
        };
        window.addEventListener('cricscorer_local_update', handleCustomSync);
        // 4. BroadcastChannel Listener
        let bc = null;
        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
            try {
                bc = new BroadcastChannel('cricscorer_overlay_channel_v2');
                bc.onmessage = (event) => {
                    if (event.data?.type === 'CRICSCORER_STATE_SYNC' && event.data.payload) {
                        useBroadcastStore.getState().applyExternalState(event.data.payload);
                    }
                };
            }
            catch (e) {
                console.warn('BroadcastChannel notice:', e);
            }
        }
        // 5. Firebase Cloud Firestore Listener (Remote/Internet Real-Time Cloud Sync)
        let unsubFirebase = null;
        try {
            unsubFirebase = subscribeToLiveMatch('live_match_default', (data) => {
                if (data) {
                    useBroadcastStore.getState().applyExternalState(data);
                }
            });
        }
        catch (e) {
            console.warn('Firebase subscribe notice:', e);
        }
        // 6. WebSocket Connection
        if (wsConnectedRef.current) {
            return () => {
                clearInterval(pollInterval);
                window.removeEventListener('storage', handleStorageChange);
                window.removeEventListener('cricscorer_local_update', handleCustomSync);
                if (bc)
                    bc.close();
                if (unsubFirebase)
                    unsubFirebase();
            };
        }
        wsConnectedRef.current = true;
        let ws = null;
        try {
            const hostname = window.location.hostname || 'localhost';
            const wsUrl = `ws://${hostname}:4000`;
            ws = new WebSocket(wsUrl);
            ws.onopen = () => {
                console.log('⚡ Connected to CricScorer WebSocket Backend');
                useBroadcastStore.getState().setWsConnected(true);
            };
            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    const applyExternalState = useBroadcastStore.getState().applyExternalState;
                    if (data.type === 'INITIAL_STATE' || data.type === 'MATCH_UPDATE' || data.type === 'STATE_SYNC') {
                        if (data.payload) {
                            applyExternalState(data.payload);
                        }
                    }
                    else if (data.type === 'OVERLAY_TOGGLE' && data.payload) {
                        const { overlayId, visible } = data.payload;
                        useBroadcastStore.getState().toggleOverlay(overlayId, visible);
                    }
                    else if (data.type === 'ANIMATION_TRIGGER' && data.payload) {
                        const { animationType, durationMs } = data.payload;
                        useBroadcastStore.getState().triggerAnimation(animationType, durationMs);
                    }
                }
                catch (e) {
                    console.warn('WebSocket message error:', e);
                }
            };
            ws.onerror = () => {
                useBroadcastStore.getState().setWsConnected(false);
            };
            ws.onclose = () => {
                useBroadcastStore.getState().setWsConnected(false);
            };
        }
        catch (err) {
            console.warn('WebSocket init notice:', err);
        }
        return () => {
            clearInterval(pollInterval);
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('cricscorer_local_update', handleCustomSync);
            if (bc)
                bc.close();
            if (unsubFirebase)
                unsubFirebase();
            wsConnectedRef.current = false;
            if (ws)
                ws.close();
        };
    }, []);
    // Check URL query override (e.g., ?overlay=battingScorecard)
    const params = new URLSearchParams(window.location.hash.split('?')[1] || window.location.search);
    const forcedOverlay = params.get('overlay');
    const isVisible = (type) => {
        if (forcedOverlay)
            return forcedOverlay === type;
        return !!activeOverlays[type];
    };
    return (_jsx("div", { className: "broadcast-canvas", style: { transform: scale !== 1 ? `scale(${scale})` : undefined }, children: _jsxs(AnimatePresence, { mode: "sync", children: [isVisible('scoreBug') && _jsx(LiveScoreBug, {}, "scoreBug"), isVisible('battingLowerThird') && _jsx(BattingLowerThird, {}, "battingL3"), isVisible('bowlingLowerThird') && _jsx(BowlingLowerThird, {}, "bowlingL3"), isVisible('battingScorecard') && _jsx(BattingScorecard, {}, "battingCard"), isVisible('bowlingScorecard') && _jsx(BowlingScorecard, {}, "bowlingCard"), isVisible('matchSummary') && _jsx(MatchSummary, {}, "matchSummary"), isVisible('partnership') && _jsx(PartnershipOverlay, {}, "partnership"), isVisible('currentBatters') && _jsx(CurrentBattersOverlay, {}, "currentBatters"), isVisible('currentBowler') && _jsx(CurrentBowlerOverlay, {}, "currentBowler"), isVisible('requiredRunRate') && _jsx(RequiredRunRateOverlay, {}, "rrr"), isVisible('currentRunRate') && _jsx(CurrentRunRateOverlay, {}, "crr"), isVisible('fallOfWickets') && _jsx(FallOfWicketsOverlay, {}, "fow"), isVisible('target') && _jsx(TargetOverlay, {}, "target"), isVisible('winnerScreen') && _jsx(WinnerScreenOverlay, {}, "winnerScreen"), isVisible('playingXI') && _jsx(PlayingXIOverlay, {}, "playingXI"), isVisible('toss') && _jsx(TossOverlay, {}, "toss"), isVisible('playerStatistics') && _jsx(PlayerStatisticsOverlay, {}, "playerStats"), isVisible('bowlerStatistics') && _jsx(BowlerStatisticsOverlay, {}, "bowlerStats"), isVisible('playerOfTheMatch') && _jsx(PlayerOfTheMatchOverlay, {}, "potm"), isVisible('playerOfTheTournament') && _jsx(PlayerOfTheTournamentOverlay, {}, "pott"), isVisible('topBatters') && _jsx(TopBattersOverlay, {}, "topBatters"), isVisible('topBowlers') && _jsx(TopBowlersOverlay, {}, "topBowlers"), isVisible('pointsTable') && _jsx(PointsTableOverlay, {}, "pointsTable"), isVisible('sponsorGraphics') && _jsx(SponsorGraphicsOverlay, {}, "sponsors"), isVisible('countdown') && _jsx(CountdownOverlay, {}, "countdown"), isVisible('replayLowerThird') && _jsx(ReplayLowerThird, {}, "replay"), activeAnimation === 'FOUR' && _jsx(FourAnimation, {}, "animFour"), activeAnimation === 'SIX' && _jsx(SixAnimation, {}, "animSix"), activeAnimation === 'WICKET' && _jsx(WicketAnimation, {}, "animWicket"), activeAnimation === 'WIDE' && _jsx(WideAnimation, {}, "animWide"), activeAnimation === 'NO_BALL' && _jsx(NoBallAnimation, {}, "animNoBall"), activeAnimation === 'FREE_HIT' && _jsx(FreeHitAnimation, {}, "animFreeHit"), activeAnimation === 'POWERPLAY' && _jsx(PowerplayAnimation, {}, "animPowerplay"), activeAnimation === 'STRATEGIC_TIMEOUT' && _jsx(StrategicTimeoutAnimation, {}, "animTimeout"), activeAnimation === 'DRINKS_BREAK' && _jsx(DrinksBreakAnimation, {}, "animDrinks"), activeAnimation === 'END_OF_INNINGS' && _jsx(EndOfInningsAnimation, {}, "animInnings"), activeAnimation === 'MATCH_WINNER' && _jsx(MatchWinnerAnimation, {}, "animMatchWinner")] }) }));
};
