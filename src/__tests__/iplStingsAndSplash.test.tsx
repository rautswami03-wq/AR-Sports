import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TargetSplash } from '../components/overlays/TargetSplash';
import { FreeHitSting } from '../components/overlays/FreeHitSting';
import { WicketSting } from '../components/overlays/WicketSting';
import { OverlayStage } from '../components/control/OverlayStage';
import {
  useBroadcastStore,
  FULL_WIDTH_STRIP_ANIMATIONS,
  isFullWidthStripAnimation,
} from '../store/useBroadcastStore';

describe('IPL 2025 TargetSplash and Stings Suite', () => {
  beforeEach(() => {
    useBroadcastStore.setState({
      tournamentId: 'ipl25',
      activeAnimation: null,
      activeOverlays: {
        ...useBroadcastStore.getState().activeOverlays,
        target: false,
      },
      teamA: {
        id: 'teamA',
        shortName: 'MI',
        fullName: 'MUMBAI INDIANS',
        primaryColor: '#004BA0',
        secondaryColor: '#FF5A00',
        accentColor: '#FFDC35',
        score: 23,
        wickets: 1,
        overs: 2,
        balls: 0,
        extras: 2,
        playingXI: ['Hardik Pandya', 'Rohit Sharma'],
        batters: [
          {
            id: 'b1',
            name: 'HARDIK PANDYA',
            runs: 18,
            balls: 8,
            fours: 2,
            sixes: 1,
            isStriker: true,
            isOut: false,
          },
          {
            id: 'b2',
            name: 'ROHIT SHARMA',
            runs: 4,
            balls: 3,
            fours: 1,
            sixes: 0,
            isStriker: false,
            isOut: true,
          },
        ],
        bowlers: [],
      },
      teamB: {
        id: 'teamB',
        shortName: 'CSK',
        fullName: 'CHENNAI SUPER KINGS',
        primaryColor: '#FFFF00',
        secondaryColor: '#0081E9',
        accentColor: '#F9CD05',
        score: 0,
        wickets: 0,
        overs: 0,
        balls: 0,
        extras: 0,
        playingXI: ['Ruturaj Gaikwad', 'Ravindra Jadeja'],
        batters: [],
        bowlers: [
          {
            id: 'bw1',
            name: 'RAVINDRA JADEJA',
            overs: 1,
            ballsInCurrentOver: 0,
            maidens: 0,
            runsConceded: 8,
            wickets: 1,
            economy: 8.0,
            isCurrent: true,
          },
        ],
      },
      battingTeamId: 'teamB',
      bowlingTeamId: 'teamA',
      matchDetails: {
        title: 'IPL 2025 Final',
        tournament: 'TATA IPL 2025',
        stage: 'FINAL',
        venue: 'MUMBAI',
        tossWinner: 'MI',
        tossDecision: 'bat',
        targetRuns: 20,
        totalOvers: 2,
        currentInnings: 2,
        recentBalls: ['1', '4', '6', 'W'],
        partnership: {
          runs: 23,
          balls: 12,
          batter1Name: 'HARDIK PANDYA',
          batter1Runs: 18,
          batter1Balls: 8,
          batter2Name: 'ROHIT SHARMA',
          batter2Runs: 4,
          batter2Balls: 3,
        },
        fallOfWickets: [],
        matchStatusText: '2ND INNINGS',
        isMatchStarted: true,
      },
    });
  });

  it('renders TargetSplash with top half score "23 - 1 (2/2 OVERS)", middle "2ND INNING" & "TARGET - 20", and bottom Team 1 vs Team 2', () => {
    render(<TargetSplash />);

    // Top Half: "23 - 1 (2/2 OVERS)"
    expect(screen.getByText('23 - 1 (2/2 OVERS)')).toBeDefined();
    expect(screen.getByText('FIRST INNINGS TOTAL')).toBeDefined();

    // Middle: "2ND INNING" and "TARGET - 20"
    expect(screen.getByText('2ND INNING')).toBeDefined();
    expect(screen.getAllByText(/TARGET -/).length).toBeGreaterThan(0);
    expect(screen.getByText('20')).toBeDefined();

    // Bottom: Team 1 vs Team 2 Graphic
    expect(screen.getAllByText('MUMBAI INDIANS').length).toBeGreaterThan(0);
    expect(screen.getAllByText('CHENNAI SUPER KINGS').length).toBeGreaterThan(0);
    expect(screen.getByText('VS')).toBeDefined();
    expect(screen.getByText('TEAM 1')).toBeDefined();
    expect(screen.getByText('TEAM 2')).toBeDefined();
  });

  it('mounts TargetSplash in OverlayStage when tournamentId is ipl25 and target overlay is active', () => {
    useBroadcastStore.setState((s) => ({
      activeOverlays: { ...s.activeOverlays, target: true },
    }));

    render(<OverlayStage />);

    expect(screen.getByText('23 - 1 (2/2 OVERS)')).toBeDefined();
    expect(screen.getByText('2ND INNING')).toBeDefined();
    expect(screen.getByText('VS')).toBeDefined();
  });

  it('renders FreeHitSting with massive text, repeating background watermark, and penalty subtext', () => {
    render(<FreeHitSting />);

    expect(screen.getAllByText(/FREE HIT/).length).toBeGreaterThan(0);
    expect(screen.getByText('NO BALL PENALTY')).toBeDefined();
    expect(screen.getByText('BATTER CANNOT BE DISMISSED CAUGHT • SWING FREELY')).toBeDefined();
  });

  it('renders WicketSting with massive text, repeating background watermark, and out batter dismissal', () => {
    render(<WicketSting />);

    expect(screen.getAllByText(/WICKET/).length).toBeGreaterThan(0);
    expect(screen.getByText('OUT! DISMISSAL')).toBeDefined();
    expect(screen.getByText('ROHIT SHARMA')).toBeDefined();
    expect(screen.getByText(/b RAVINDRA JADEJA/)).toBeDefined();
  });

  it('verifies useBroadcastStore strip animation classification and trigger timing', () => {
    const store = useBroadcastStore.getState();

    // Check strip animations list
    expect(FULL_WIDTH_STRIP_ANIMATIONS).toContain('FOUR');
    expect(FULL_WIDTH_STRIP_ANIMATIONS).toContain('SIX');
    expect(FULL_WIDTH_STRIP_ANIMATIONS).toContain('WICKET');
    expect(FULL_WIDTH_STRIP_ANIMATIONS).toContain('FREE_HIT');

    // Classification function
    expect(isFullWidthStripAnimation('FOUR')).toBe(true);
    expect(isFullWidthStripAnimation('SIX')).toBe(true);
    expect(isFullWidthStripAnimation('WICKET')).toBe(true);
    expect(isFullWidthStripAnimation('FREE_HIT')).toBe(true);
    expect(isFullWidthStripAnimation('WIDE')).toBe(false);
    expect(isFullWidthStripAnimation('POWERPLAY')).toBe(false);

    // Store helper
    expect(store.isStripAnimation('FREE_HIT')).toBe(true);
    expect(store.isStripAnimation('WICKET')).toBe(true);

    // Trigger Free Hit
    store.triggerAnimation('FREE_HIT');
    expect(useBroadcastStore.getState().activeAnimation).toBe('FREE_HIT');

    // Clear Animation
    store.clearAnimation();
    expect(useBroadcastStore.getState().activeAnimation).toBe(null);
  });
});
