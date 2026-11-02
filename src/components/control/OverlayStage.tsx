import React, { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useBroadcastStore, clientId } from '../../store/useBroadcastStore';
import { OverlayType } from '../../types/cricket';
import { subscribeToLiveMatch, publishLiveMatchState } from '../../services/firebase';
import { THEME_ID_MAP } from '../../theme/presetThemes';

// Overlays
import { ScoreBug } from '../overlays/ScoreBug';
import { EventSting } from '../overlays/EventSting';
import { T20EmergingAsiaCupOverlay } from '../overlays/T20EmergingAsiaCupOverlay';
import { IPL25Overlay } from '../overlays/IPL25Overlay';
import { CricAstraOverlay } from '../overlays/CricAstraOverlay';
import { HotstarOverlay } from '../overlays/HotstarOverlay';
import { LiveScoreBug } from '../overlays/LiveScoreBug';
import { LowerThird } from '../overlays/LowerThird';
import { BatterLowerThird } from '../overlays/BatterLowerThird';
import { BowlerLowerThird } from '../overlays/BowlerLowerThird';
import { PartnershipLowerThird } from '../overlays/PartnershipLowerThird';
import { ManOfTheMatchLowerThird } from '../overlays/ManOfTheMatchLowerThird';
import { TeamsLineupCard } from '../overlays/TeamsLineupCard';
import { BattingScorecardCard } from '../overlays/BattingScorecardCard';
import { BowlingScorecardCard } from '../overlays/BowlingScorecardCard';
import { MatchSummaryCard } from '../overlays/MatchSummaryCard';
import { PlayerProfileCard } from '../overlays/PlayerProfileCard';
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
import { TargetSplash } from '../overlays/TargetSplash';
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
import { MatchCharts } from '../overlays/MatchCharts';
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
  const { activeOverlays, activeAnimation, matchDetails, tournamentId } = useBroadcastStore();
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
    const pollInterval = setInterval(syncFromStorage, 2000);

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

    const sendOverlayAck = () => {
      const now = Date.now();
      const currentMatchId = useBroadcastStore.getState().matchId || 'live_match_default';
      const ackPayload = { originId: clientId, overlayAckAt: now };
      if (bc) {
        try {
          bc.postMessage({ ...ackPayload, type: 'OVERLAY_ACK' });
        } catch {}
      }
      try {
        publishLiveMatchState(currentMatchId, ackPayload);
      } catch {}
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('ar_sports_overlay_ack', String(now));
        } catch {}
      }
    };

    sendOverlayAck();
    const ackInterval = setInterval(sendOverlayAck, 2000);

    let unsubFirebase: (() => void) | null = null;
    try {
      const matchIdToSub = useBroadcastStore.getState().matchId || 'live_match_default';
      unsubFirebase = subscribeToLiveMatch(matchIdToSub, (data) => {
        if (data) {
          useBroadcastStore.getState().applyExternalState(data);
        }
      });
    } catch {}

    return () => {
      clearInterval(ackInterval);
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

    // If explicitly turned off in activeOverlays, always respect it
    if (activeOverlays[type] === false) return false;

    // Check if any full-card overlay is active
    const isFullCardActive = Boolean(
      activeOverlays.battingScorecard ||
      activeOverlays.bowlingScorecard ||
      activeOverlays.matchSummary ||
      activeOverlays.playingXI ||
      activeOverlays.tournamentTitle ||
      activeOverlays.winnerScreen ||
      activeOverlays.manOfTheMatchCard ||
      activeOverlays.pointsTable ||
      activeOverlays.toss
    );

    // ScoreBug: Auto-hide if another full-screen overlay or card is active
    if (type === 'scoreBug') {
      if (isFullCardActive) return false;
      return Boolean(activeOverlays.scoreBug);
    }

    // Lower Thirds: Suppress if full-screen overlay or card is active to avoid visual bleeding
    if (
      isFullCardActive &&
      (type === 'battingLowerThird' ||
       type === 'bowlingLowerThird' ||
       type === 'partnership' ||
       type === 'replayLowerThird' ||
       type === 'playerOfTheMatch')
    ) {
      return false;
    }

    return Boolean(activeOverlays[type]);
  };

  return (
    <div
      className="broadcast-canvas"
      style={{ transform: scale !== 1 ? `scale(${scale})` : undefined }}
    >
      <AnimatePresence mode="sync">
        {/* Overlays - Strictly Wrapped Conditional Rendering to Prevent Bleed */}
        {Boolean(activeOverlays.scoreBug || forcedOverlay === 'scoreBug') && isVisible('scoreBug') && (
          <div key="scoreBugWrapper" className="absolute bottom-6 inset-x-0 z-40 flex items-center justify-center pointer-events-none">
            {tournamentId === 't20_asia24' || tournamentId === '9' ? (
              <T20EmergingAsiaCupOverlay key="t20AsiaCupScoreBug" />
            ) : tournamentId === 'ipl25' || tournamentId === '15' ? (
              <IPL25Overlay key="ipl25ScoreBug" />
            ) : tournamentId === 'cricastra' || tournamentId === '18' ? (
              <CricAstraOverlay key="cricastraScoreBug" />
            ) : tournamentId === 'hotstar' || tournamentId === '17' ? (
              <HotstarOverlay key="hotstarScoreBug" />
            ) : (
              <ScoreBug key="scoreBug" />
            )}
          </div>
        )}
        {Boolean(activeOverlays.tournamentTitle || forcedOverlay === 'tournamentTitle') && isVisible('tournamentTitle') && (
          <TournamentTitleOverlay key="tournamentTitle" />
        )}
        {Boolean(activeOverlays.battingLowerThird || forcedOverlay === 'battingLowerThird') && isVisible('battingLowerThird') && (
          tournamentId === 'ipl25' || tournamentId === '15' ? (
            <BatterLowerThird key="battingL3_ipl" />
          ) : (
            <LowerThird key="battingL3" type="batter" />
          )
        )}
        {Boolean(activeOverlays.bowlingLowerThird || forcedOverlay === 'bowlingLowerThird') && isVisible('bowlingLowerThird') && (
          tournamentId === 'ipl25' || tournamentId === '15' ? (
            <BowlerLowerThird key="bowlingL3_ipl" />
          ) : (
            <LowerThird key="bowlingL3" type="bowler" />
          )
        )}
        {Boolean(activeOverlays.battingScorecard || forcedOverlay === 'battingScorecard') && isVisible('battingScorecard') && (
          tournamentId === 'ipl25' || tournamentId === '15' ? (
            <BattingScorecardCard key="battingCard_ipl" />
          ) : (
            <BattingScorecard key="battingCard" />
          )
        )}
        {Boolean(activeOverlays.bowlingScorecard || forcedOverlay === 'bowlingScorecard') && isVisible('bowlingScorecard') && (
          tournamentId === 'ipl25' || tournamentId === '15' ? (
            <BowlingScorecardCard key="bowlingCard_ipl" />
          ) : (
            <BowlingScorecard key="bowlingCard" />
          )
        )}
        {Boolean(activeOverlays.matchSummary || forcedOverlay === 'matchSummary') && isVisible('matchSummary') && (
          tournamentId === 'ipl25' || tournamentId === '15' ? (
            <MatchSummaryCard key="matchSummary_ipl" />
          ) : (
            <MatchSummary key="matchSummary" />
          )
        )}
        {Boolean(activeOverlays.partnership || forcedOverlay === 'partnership') && isVisible('partnership') && (
          tournamentId === 'ipl25' || tournamentId === '15' ? (
            <PartnershipLowerThird key="partnership_ipl" />
          ) : (
            <LowerThird key="partnership" type="partnership" />
          )
        )}
        {Boolean(activeOverlays.currentBatters || forcedOverlay === 'currentBatters') && isVisible('currentBatters') && (
          <CurrentBattersOverlay key="currentBatters" />
        )}
        {Boolean(activeOverlays.currentBowler || forcedOverlay === 'currentBowler') && isVisible('currentBowler') && (
          <CurrentBowlerOverlay key="currentBowler" />
        )}
        {Boolean(activeOverlays.requiredRunRate || forcedOverlay === 'requiredRunRate') && isVisible('requiredRunRate') && (
          <RequiredRunRateOverlay key="rrr" />
        )}
        {Boolean(activeOverlays.currentRunRate || forcedOverlay === 'currentRunRate') && isVisible('currentRunRate') && (
          <CurrentRunRateOverlay key="crr" />
        )}
        {Boolean(activeOverlays.fallOfWickets || forcedOverlay === 'fallOfWickets') && isVisible('fallOfWickets') && (
          <FallOfWicketsOverlay key="fow" />
        )}
        {Boolean(activeOverlays.target || forcedOverlay === 'target') && isVisible('target') && (
          tournamentId === 'ipl25' || tournamentId === '15' ? (
            <TargetSplash key="target_ipl" />
          ) : (
            <TargetOverlay key="target" />
          )
        )}
        {Boolean(activeOverlays.winnerScreen || forcedOverlay === 'winnerScreen') && isVisible('winnerScreen') && (
          <WinnerScreenOverlay key="winnerScreen" />
        )}
        {Boolean(activeOverlays.playingXI || forcedOverlay === 'playingXI') && isVisible('playingXI') && (
          tournamentId === 'ipl25' || tournamentId === '15' ? (
            <TeamsLineupCard key="playingXI_ipl" />
          ) : (
            <PlayingXIOverlay key="playingXI" />
          )
        )}
        {Boolean(activeOverlays.toss || forcedOverlay === 'toss') && isVisible('toss') && (
          <TossOverlay key="toss" />
        )}
        {Boolean(activeOverlays.playerStatistics || forcedOverlay === 'playerStatistics') && isVisible('playerStatistics') && (
          tournamentId === 'ipl25' || tournamentId === '15' ? (
            <PlayerProfileCard key="playerStats_ipl" />
          ) : (
            <PlayerStatisticsOverlay key="playerStats" />
          )
        )}
        {Boolean(activeOverlays.bowlerStatistics || forcedOverlay === 'bowlerStatistics') && isVisible('bowlerStatistics') && (
          <BowlerStatisticsOverlay key="bowlerStats" />
        )}
        {Boolean(activeOverlays.playerOfTheMatch || forcedOverlay === 'playerOfTheMatch') && isVisible('playerOfTheMatch') && (
          tournamentId === 'ipl25' || tournamentId === '15' ? (
            <ManOfTheMatchLowerThird key="potm_ipl" />
          ) : (
            <PlayerOfTheMatchOverlay key="potm" />
          )
        )}
        {Boolean(activeOverlays.playerOfTheTournament || forcedOverlay === 'playerOfTheTournament') && isVisible('playerOfTheTournament') && (
          <PlayerOfTheTournamentOverlay key="pott" />
        )}
        {Boolean(activeOverlays.topBatters || forcedOverlay === 'topBatters') && isVisible('topBatters') && (
          <TopBattersOverlay key="topBatters" />
        )}
        {Boolean(activeOverlays.topBowlers || forcedOverlay === 'topBowlers') && isVisible('topBowlers') && (
          <TopBowlersOverlay key="topBowlers" />
        )}
        {Boolean(activeOverlays.pointsTable || forcedOverlay === 'pointsTable') && isVisible('pointsTable') && (
          <PointsTableOverlay key="pointsTable" />
        )}
        {Boolean(activeOverlays.sponsorGraphics || forcedOverlay === 'sponsorGraphics') && isVisible('sponsorGraphics') && (
          <SponsorGraphicsOverlay key="sponsors" />
        )}
        {Boolean(activeOverlays.countdown || forcedOverlay === 'countdown') && isVisible('countdown') && (
          <CountdownOverlay key="countdown" />
        )}
        {Boolean(activeOverlays.replayLowerThird || forcedOverlay === 'replayLowerThird') && isVisible('replayLowerThird') && (
          <ReplayLowerThird key="replay" />
        )}
        {Boolean(activeOverlays.superOver || forcedOverlay === 'superOver') && isVisible('superOver') && (
          <SuperOverOverlay key="superOver" />
        )}
        {Boolean(activeOverlays.wagonWheel || forcedOverlay === 'wagonWheel') && isVisible('wagonWheel') && (
          <WagonWheelOverlay key="wagonWheel" />
        )}
        {Boolean(activeOverlays.manOfTheMatchCard || forcedOverlay === 'manOfTheMatchCard') && isVisible('manOfTheMatchCard') && (
          <ManOfTheMatchCardOverlay key="momCard" />
        )}
        {Boolean(activeOverlays.decision || forcedOverlay === 'decision') && isVisible('decision') && (
          <DecisionOverlay key="decision" />
        )}
        {Boolean(activeOverlays.pitchMap || forcedOverlay === 'pitchMap') && isVisible('pitchMap') && (
          <PitchMapOverlay key="pitchMap" />
        )}
        {Boolean(activeOverlays.manhattan || forcedOverlay === 'manhattan') && isVisible('manhattan') && (
          <MatchCharts key="manhattan" view="bar" />
        )}
        {Boolean(activeOverlays.worm || forcedOverlay === 'worm') && isVisible('worm') && (
          <MatchCharts key="wormChart" view="line" />
        )}
        {Boolean(activeOverlays.lineGraph || forcedOverlay === 'lineGraph') && isVisible('lineGraph') && (
          <MatchCharts key="lineGraph" view="line" />
        )}
        {Boolean(activeOverlays.graph || forcedOverlay === 'graph') && isVisible('graph') && (
          <MatchCharts key="matchCharts" />
        )}
        {Boolean(activeOverlays.winPredictor || forcedOverlay === 'winPredictor') && isVisible('winPredictor') && (
          <WinPredictorOverlay key="winPredictor" />
        )}
        {Boolean(activeOverlays.commentator || forcedOverlay === 'commentator') && isVisible('commentator') && (
          <CommentatorOverlay key="commentator" />
        )}
        {Boolean(activeOverlays.watermark || forcedOverlay === 'watermark') && isVisible('watermark') && (
          <WatermarkOverlay key="watermark" />
        )}
      </AnimatePresence>

      {/* Animations - EventSting (Broadcast Stings for all EventAnimationTypes) */}
      <AnimatePresence mode="wait">
        {activeAnimation && (
          <div
            key={activeAnimation + Date.now()}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden"
          >
            <EventSting type={activeAnimation} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
