'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  ScoreBug,
  FourGraphic,
  SixGraphic,
  WicketGraphic,
  WinnerGraphic,
  PlayerOfMatchGraphic,
  TossGraphic,
  PlayingXIGraphic,
  CountdownGraphic,
} from '@ar-sports/graphics';
import { useWebSocket } from '@ar-sports/hooks';
import type { ScoreState } from '@ar-sports/types';
import { WebSocketMessageType } from '@ar-sports/types';
import { useSearchParams } from 'next/navigation';

// Demo score state for preview/development
const demoScoreState: ScoreState = {
  matchId: 'demo',
  matchStatus: 'LIVE' as any,
  inningsNumber: 1,
  battingTeam: { id: 't1', name: 'Mumbai Indians', shortName: 'MI', primaryColor: '#004BA0', secondaryColor: '#D1AB3E' },
  bowlingTeam: { id: 't2', name: 'Chennai Super Kings', shortName: 'CSK', primaryColor: '#FCCA06', secondaryColor: '#0081E9' },
  totalRuns: 156,
  totalWickets: 4,
  totalOvers: '15.3',
  currentRunRate: 10.06,
  requiredRunRate: 9.44,
  target: 201,
  partnership: { runs: 42, balls: 23 },
  currentBatters: [
    { playerId: 'p1', name: 'R. Sharma', runs: 67, balls: 42, fours: 7, sixes: 3, strikeRate: 159.5, isOnStrike: true },
    { playerId: 'p2', name: 'S. Yadav', runs: 38, balls: 28, fours: 4, sixes: 1, strikeRate: 135.7, isOnStrike: false },
  ],
  currentBowler: { playerId: 'p3', name: 'D. Chahar', overs: '3.3', maidens: 0, runs: 32, wickets: 2, economy: 9.14 },
  lastSixBalls: [
    { type: 'ONE' as any, runs: 1, isWicket: false },
    { type: 'FOUR' as any, runs: 4, isWicket: false },
    { type: 'DOT' as any, runs: 0, isWicket: false },
    { type: 'SIX' as any, runs: 6, isWicket: false },
    { type: 'TWO' as any, runs: 2, isWicket: false },
    { type: 'ONE' as any, runs: 1, isWicket: false },
  ],
  isPowerplay: false,
  isFreeHit: false,
  matchInfo: { format: 'T20' as any, totalOvers: 20, venue: 'Wankhede Stadium' },
};

function OverlayContent() {
  const searchParams = useSearchParams();
  const scene = searchParams.get('scene') || 'scorebug';
  const wsUrl = `ws://localhost:${searchParams.get('ws') || '8765'}`;

  const { lastMessage } = useWebSocket(wsUrl);
  const [scoreState, setScoreState] = useState<ScoreState>(demoScoreState);

  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.type === WebSocketMessageType.STATE_UPDATE && lastMessage.payload) {
        setScoreState(lastMessage.payload as ScoreState);
      }
    }
  }, [lastMessage]);

  return (
    <div className="safe-area flex items-end justify-start">
      <AnimatePresence mode="wait">
        {scene === 'scorebug' && <ScoreBug key="scorebug" scoreState={scoreState} />}
        {scene === 'four' && <FourGraphic key="four" />}
        {scene === 'six' && <SixGraphic key="six" />}
        {scene === 'wicket' && <WicketGraphic key="wicket" />}
        {scene === 'winner' && (
          <WinnerGraphic
            key="winner"
            teamName={scoreState.battingTeam.name}
            teamColor={scoreState.battingTeam.primaryColor}
            margin="5 wickets"
          />
        )}
        {scene === 'pom' && (
          <PlayerOfMatchGraphic
            key="pom"
            playerName="R. Sharma"
            teamName={scoreState.battingTeam.name}
            teamColor={scoreState.battingTeam.primaryColor}
            stats="67 (42) | 7x4 | 3x6 | SR: 159.5"
          />
        )}
        {scene === 'toss' && (
          <TossGraphic
            key="toss"
            winningTeam={scoreState.battingTeam.name}
            teamColor={scoreState.battingTeam.primaryColor}
            decision="BAT"
          />
        )}
        {scene === 'playingxi' && (
          <PlayingXIGraphic
            key="playingxi"
            teamName={scoreState.battingTeam.name}
            teamColor={scoreState.battingTeam.primaryColor}
            players={[
              { name: 'R. Sharma', role: 'Batsman', isCaptain: true },
              { name: 'I. Kishan', role: 'WK', isWK: true },
              { name: 'S. Yadav', role: 'Batsman' },
              { name: 'T. David', role: 'All-rounder' },
              { name: 'H. Pandya', role: 'All-rounder' },
              { name: 'N. Tilak', role: 'Batsman' },
              { name: 'P. Cummins', role: 'Bowler' },
              { name: 'J. Bumrah', role: 'Bowler' },
              { name: 'R. Ashwin', role: 'Bowler' },
              { name: 'J. Archer', role: 'Bowler' },
              { name: 'A. Markram', role: 'All-rounder' },
            ]}
          />
        )}
        {scene === 'countdown' && <CountdownGraphic key="countdown" seconds={300} label="Match Starts In" />}
      </AnimatePresence>
    </div>
  );
}

export default function OverlayPage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen" />}>
      <OverlayContent />
    </Suspense>
  );
}
