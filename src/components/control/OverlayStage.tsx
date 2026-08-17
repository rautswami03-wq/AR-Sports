import React, { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { OverlayType } from '../../types/cricket';
import { subscribeToLiveMatch } from '../../services/firebase';
import { THEME_ID_MAP } from '../../theme/presetThemes';

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
import { SuperOverOverlay } from '../overlays/SuperOverOverlay';
import { WagonWheelOverlay } from '../overlays/WagonWheelOverlay';
import { ManOfTheMatchCardOverlay } from '../overlays/ManOfTheMatchCardOverlay';
import { DecisionOverlay } from '../overlays/DecisionOverlay';
import { PitchMapOverlay } from '../overlays/PitchMapOverlay';
import { ManhattanOverlay } from '../overlays/ManhattanOverlay';
import { CommentatorOverlay } from '../overlays/CommentatorOverlay';
import { WatermarkOverlay } from '../overlays/WatermarkOverlay';
import { TournamentTitleOverlay } from '../overlays/TournamentTitleOverlay';
import { WinPredictorOverlay } from '../overlays/WinPredictorOverlay';

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
import { FiftyAnimation } from '../animations/FiftyAnimation';
import { CenturyAnimation } from '../animations/CenturyAnimation';
import { HatTrickAnimation } from '../animations/HatTrickAnimation';
import { TourBoundariesAnimation } from '../animations/TourBoundariesAnimation';
import { IPLSuperAnimation } from '../animations/IPLSuperAnimation';

interface OverlayStageProps {
  scale?: number;
}

export const OverlayStage: React.FC<OverlayStageProps> = ({ scale = 1 }) => {
  const { activeOverlays, activeAnimation, matchDetails } = useBroadcastStore();
  const wsConnectedRef = useRef(false);


  useEffect(() => {
    // 1. Initialize theme from URL query param or path
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const search = typeof window !== 'undefined' ? window.location.search : '';
    const hashQuery = hash.includes('?') ? hash.split('?')[1] : search;
    const urlParams = new URLSearchParams(hashQuery);
    const themeParam = urlParams.get('theme');

    if (themeParam) {
      const themeKey = THEME_ID_MAP[themeParam] || themeParam;
      useBroadcastStore.getState().setTournamentId(themeKey);
    } else if (hash.includes('/theme/')) {
      const parts = hash.split('/theme/')[1]?.split('?')[0]?.split('/');
      if (parts && parts[0]) {
        const themeIdFromPath = parts[0];
        const themeKey = THEME_ID_MAP[themeIdFromPath] || themeIdFromPath;
        useBroadcastStore.getState().setTournamentId(themeKey);
      }
    }

    const isStandaloneOverlay =
      typeof window !== 'undefined' &&
      (window.location.pathname.startsWith('/overlay') ||
       window.location.pathname.startsWith('/theme') ||
       window.location.hash.includes('/overlay') ||
       window.location.hash.includes('/theme'));

    if (!isStandaloneOverlay) {
      return;
    }

    let lastSavedRaw = '';

    const syncFromStorage = () => {
      if (typeof window === 'undefined') return;
      try {
        const raw = localStorage.getItem('ar_sports_match_state_v2') || localStorage.getItem('cricscorer_match_state_v2');
        if (raw && raw !== lastSavedRaw) {
          lastSavedRaw = raw;
          const parsed = JSON.parse(raw);
          useBroadcastStore.getState().applyExternalState(parsed);
        }
      } catch {}
    };

    syncFromStorage();
    const pollInterval = setInterval(syncFromStorage, 100);

    const handleStorageChange = (e: StorageEvent) => {
      if ((e.key === 'ar_sports_match_state_v2' || e.key === 'cricscorer_match_state_v2') && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          useBroadcastStore.getState().applyExternalState(parsed);
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);

    const handleCustomSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        useBroadcastStore.getState().applyExternalState(customEvent.detail);
      }
    };
    window.addEventListener('ar_sports_local_update', handleCustomSync);
    window.addEventListener('cricscorer_local_update', handleCustomSync);

    let bc: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('ar_sports_overlay_channel_v2');
        bc.onmessage = (event) => {
          if ((event.data?.type === 'AR_SPORTS_STATE_SYNC' || event.data?.type === 'CRICSCORER_STATE_SYNC') && event.data.payload) {
            useBroadcastStore.getState().applyExternalState(event.data.payload);
          }
        };
      } catch {}
    }

    let unsubFirebase: (() => void) | null = null;
    try {
      unsubFirebase = subscribeToLiveMatch('live_match_default', (data) => {
        if (data) {
          useBroadcastStore.getState().applyExternalState(data);
        }
      });
    } catch {}

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('ar_sports_local_update', handleCustomSync);
      window.removeEventListener('cricscorer_local_update', handleCustomSync);
      if (bc) bc.close();
      if (unsubFirebase) unsubFirebase();
    };
  }, []);

  const hash = typeof window !== 'undefined' ? window.location.hash : '';
  const search = typeof window !== 'undefined' ? window.location.search : '';
  const hashQuery = hash.includes('?') ? hash.split('?')[1] : search;
  const params = new URLSearchParams(hashQuery);
  const forcedOverlay = params.get('overlay') as OverlayType | null;

  const isStandaloneRoute = typeof window !== 'undefined' && (
    window.location.pathname.includes('/overlay') ||
    window.location.pathname.includes('/theme') ||
    hash.includes('/overlay') ||
    hash.includes('/theme')
  );

  const isVisible = (type: OverlayType) => {
    if (forcedOverlay) return forcedOverlay === type;
    if (activeOverlays[type]) return true;
    if (isStandaloneRoute && type === 'scoreBug') return true;
    if (matchDetails?.isMatchStarted && activeOverlays[type]) return true;
    return false;
  };

  return (
    <div
      className="broadcast-canvas"
      style={{ transform: scale !== 1 ? `scale(${scale})` : undefined }}
    >
      <AnimatePresence mode="sync">
        {/* Overlays */}
        {isVisible('scoreBug') && <LiveScoreBug key="scoreBug" />}
        {isVisible('tournamentTitle') && <TournamentTitleOverlay key="tournamentTitle" />}
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
        {isVisible('superOver') && <SuperOverOverlay key="superOver" />}
        {isVisible('wagonWheel') && <WagonWheelOverlay key="wagonWheel" />}
        {isVisible('manOfTheMatchCard') && <ManOfTheMatchCardOverlay key="momCard" />}
        {isVisible('decision') && <DecisionOverlay key="decision" />}
        {isVisible('pitchMap') && <PitchMapOverlay key="pitchMap" />}
        {isVisible('manhattan') && <ManhattanOverlay key="manhattan" />}
        {isVisible('winPredictor') && <WinPredictorOverlay key="winPredictor" />}
        {isVisible('commentator') && <CommentatorOverlay key="commentator" />}
        {isVisible('watermark') && <WatermarkOverlay key="watermark" />}

        {/* Animations - Unified IPL Super Animation Engine */}
        {activeAnimation && <IPLSuperAnimation key="animIPLSuper" />}
      </AnimatePresence>
    </div>
  );
};
