import React, { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { OverlayType } from '../../types/cricket';

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

interface OverlayStageProps {
  scale?: number;
}

export const OverlayStage: React.FC<OverlayStageProps> = ({ scale = 1 }) => {
  const { activeOverlays, activeAnimation } = useBroadcastStore();
  const wsConnectedRef = useRef(false);

  // Real-time synchronization for OBS Studio & Browser Sources (WebSocket + LocalStorage Polling + BroadcastChannel)
  useEffect(() => {
    let lastSavedRaw = '';

    // 1. Polling LocalStorage (Guarantees OBS Studio updates even when offline or sandboxed)
    const pollInterval = setInterval(() => {
      if (typeof window === 'undefined') return;
      try {
        const raw = localStorage.getItem('cricscorer_match_state_v2');
        if (raw && raw !== lastSavedRaw) {
          lastSavedRaw = raw;
          const parsed = JSON.parse(raw);
          useBroadcastStore.getState().applyExternalState(parsed);
        }
      } catch (e) {
        console.warn('Storage polling notice:', e);
      }
    }, 250);

    // 2. BroadcastChannel Listener
    let bc: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('cricscorer_overlay_channel_v2');
        bc.onmessage = (event) => {
          if (event.data?.type === 'CRICSCORER_STATE_SYNC' && event.data.payload) {
            useBroadcastStore.getState().applyExternalState(event.data.payload);
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel notice:', e);
      }
    }

    // 3. WebSocket Connection
    if (wsConnectedRef.current) {
      return () => {
        clearInterval(pollInterval);
        if (bc) bc.close();
      };
    }
    wsConnectedRef.current = true;

    let ws: WebSocket | null = null;
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
          } else if (data.type === 'OVERLAY_TOGGLE' && data.payload) {
            const { overlayId, visible } = data.payload;
            useBroadcastStore.getState().toggleOverlay(overlayId, visible);
          } else if (data.type === 'ANIMATION_TRIGGER' && data.payload) {
            const { animationType, durationMs } = data.payload;
            useBroadcastStore.getState().triggerAnimation(animationType, durationMs);
          }
        } catch (e) {
          console.warn('WebSocket message error:', e);
        }
      };

      ws.onerror = () => {
        useBroadcastStore.getState().setWsConnected(false);
      };

      ws.onclose = () => {
        useBroadcastStore.getState().setWsConnected(false);
      };
    } catch (err) {
      console.warn('WebSocket init notice:', err);
    }

    return () => {
      clearInterval(pollInterval);
      if (bc) bc.close();
      wsConnectedRef.current = false;
      if (ws) ws.close();
    };
  }, []);

  // Check URL query override (e.g., ?overlay=battingScorecard)
  const params = new URLSearchParams(window.location.hash.split('?')[1] || window.location.search);
  const forcedOverlay = params.get('overlay') as OverlayType | null;

  const isVisible = (type: OverlayType) => {
    if (forcedOverlay) return forcedOverlay === type;
    return !!activeOverlays[type];
  };

  return (
    <div
      className="broadcast-canvas"
      style={{ transform: scale !== 1 ? `scale(${scale})` : undefined }}
    >
      <AnimatePresence mode="sync">
        {/* 26 Overlays */}
        {isVisible('scoreBug') && <LiveScoreBug key="scoreBug" />}
        {isVisible('battingLowerThird') && <BattingLowerThird key="battingL3" />}
        {isVisible('bowlingLowerThird') && <BowlingLowerThird key="bowlingL3" />}
        {isVisible('battingScorecard') && <BattingScorecard key="battingCard" />}
        {isVisible('bowlingScorecard') && <BowlingScorecard key="bowlingCard" />}
        {isVisible('matchSummary') && <MatchSummary key="matchSummary" />}
        {isVisible('partnership') && <PartnershipOverlay key="partnership" />}
        {isVisible('currentBatters') && <CurrentBattersOverlay key="currentBatters" />}
        {isVisible('currentBowler') && <CurrentBowlerOverlay key="currentBowler" />}
        {isVisible('requiredRunRate') && <RequiredRunRateOverlay key="rrr" />}
        {isVisible('currentRunRate') && <CurrentRunRateOverlay key="crr" />}
        {isVisible('fallOfWickets') && <FallOfWicketsOverlay key="fow" />}
        {isVisible('target') && <TargetOverlay key="target" />}
        {isVisible('winnerScreen') && <WinnerScreenOverlay key="winnerScreen" />}
        {isVisible('playingXI') && <PlayingXIOverlay key="playingXI" />}
        {isVisible('toss') && <TossOverlay key="toss" />}
        {isVisible('playerStatistics') && <PlayerStatisticsOverlay key="playerStats" />}
        {isVisible('bowlerStatistics') && <BowlerStatisticsOverlay key="bowlerStats" />}
        {isVisible('playerOfTheMatch') && <PlayerOfTheMatchOverlay key="potm" />}
        {isVisible('playerOfTheTournament') && <PlayerOfTheTournamentOverlay key="pott" />}
        {isVisible('topBatters') && <TopBattersOverlay key="topBatters" />}
        {isVisible('topBowlers') && <TopBowlersOverlay key="topBowlers" />}
        {isVisible('pointsTable') && <PointsTableOverlay key="pointsTable" />}
        {isVisible('sponsorGraphics') && <SponsorGraphicsOverlay key="sponsors" />}
        {isVisible('countdown') && <CountdownOverlay key="countdown" />}
        {isVisible('replayLowerThird') && <ReplayLowerThird key="replay" />}

        {/* 11 Animations */}
        {activeAnimation === 'FOUR' && <FourAnimation key="animFour" />}
        {activeAnimation === 'SIX' && <SixAnimation key="animSix" />}
        {activeAnimation === 'WICKET' && <WicketAnimation key="animWicket" />}
        {activeAnimation === 'WIDE' && <WideAnimation key="animWide" />}
        {activeAnimation === 'NO_BALL' && <NoBallAnimation key="animNoBall" />}
        {activeAnimation === 'FREE_HIT' && <FreeHitAnimation key="animFreeHit" />}
        {activeAnimation === 'POWERPLAY' && <PowerplayAnimation key="animPowerplay" />}
        {activeAnimation === 'STRATEGIC_TIMEOUT' && <StrategicTimeoutAnimation key="animTimeout" />}
        {activeAnimation === 'DRINKS_BREAK' && <DrinksBreakAnimation key="animDrinks" />}
        {activeAnimation === 'END_OF_INNINGS' && <EndOfInningsAnimation key="animInnings" />}
        {activeAnimation === 'MATCH_WINNER' && <MatchWinnerAnimation key="animMatchWinner" />}
      </AnimatePresence>
    </div>
  );
};
