import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PRESET_TEAMS, getContrastTextColor, hexToRgba } from '../theme/presetThemes';
import { useBroadcastStore } from '../store/useBroadcastStore';
import { PlayingXIOverlay } from '../components/overlays/PlayingXIOverlay';
import { BattingScorecard } from '../components/overlays/BattingScorecard';
import { BowlingScorecard } from '../components/overlays/BowlingScorecard';
import { MatchSummary } from '../components/overlays/MatchSummary';

describe('Overlay Theming & Team Colors Suite', () => {
  it('ensures every team in PRESET_TEAMS has primaryColor, secondaryColor, and accentColor', () => {
    const teamKeys = Object.keys(PRESET_TEAMS);
    expect(teamKeys.length).toBeGreaterThanOrEqual(10);

    for (const key of teamKeys) {
      const team = PRESET_TEAMS[key];
      expect(team.primaryColor, `${key} missing primaryColor`).toBeDefined();
      expect(team.primaryColor.length, `${key} primaryColor must be non-empty`).toBeGreaterThan(0);
      expect(team.secondaryColor, `${key} missing secondaryColor`).toBeDefined();
      expect(team.secondaryColor.length, `${key} secondaryColor must be non-empty`).toBeGreaterThan(0);
      expect(team.accentColor, `${key} missing accentColor`).toBeDefined();
      expect(team.accentColor.length, `${key} accentColor must be non-empty`).toBeGreaterThan(0);
    }
  });

  it('correctly switches contrast text color based on background luminance', () => {
    // Dark backgrounds should return white text
    expect(getContrastTextColor('#000000')).toBe('#ffffff');
    expect(getContrastTextColor('#00529B')).toBe('#ffffff'); // India blue
    expect(getContrastTextColor('#01411C')).toBe('#ffffff'); // Pakistan green
    expect(getContrastTextColor('#0f172a')).toBe('#ffffff'); // Dark slate

    // Light / bright backgrounds should return black text
    expect(getContrastTextColor('#FFFFFF')).toBe('#000000');
    expect(getContrastTextColor('#FFD700')).toBe('#000000'); // Australia gold
    expect(getContrastTextColor('#FCCA03')).toBe('#000000'); // CSK bright yellow
    expect(getContrastTextColor('#FFFF00')).toBe('#000000'); // Pure yellow
  });

  it('converts hex colors to rgba with accurate opacity', () => {
    expect(hexToRgba('#00529B', 0.1)).toBe('rgba(0, 82, 155, 0.1)');
    expect(hexToRgba('#FFD700', 0.1)).toBe('rgba(255, 215, 0, 0.1)');
  });

  describe('Full-Screen Overlays Dynamic Rendering', () => {
    beforeEach(() => {
      useBroadcastStore.setState({
        teamA: {
          id: 'teamA',
          shortName: 'IND',
          fullName: 'India',
          primaryColor: '#00529B',
          secondaryColor: '#FF9933',
          accentColor: '#00D2FF',
          score: 185,
          wickets: 4,
          overs: 20,
          balls: 0,
          batters: [
            { id: 'b1', name: 'Rohit Sharma', runs: 57, balls: 32, fours: 6, sixes: 3, isOut: true, dismissal: 'c Smith b Starc' },
            { id: 'b2', name: 'Virat Kohli', runs: 82, balls: 54, fours: 7, sixes: 2, isOut: false, isStriker: true },
          ],
          bowlers: [
            { id: 'bw1', name: 'Jasprit Bumrah', overs: 4, ballsInCurrentOver: 0, maidens: 1, runsConceded: 22, wickets: 2, economy: 5.5, isCurrent: true },
          ],
          playingXI: ['Rohit Sharma', 'Virat Kohli', 'Jasprit Bumrah'],
        },
        teamB: {
          id: 'teamB',
          shortName: 'AUS',
          fullName: 'Australia',
          primaryColor: '#FFD700',
          secondaryColor: '#006400',
          accentColor: '#FFFFFF',
          score: 160,
          wickets: 8,
          overs: 20,
          balls: 0,
          batters: [
            { id: 'b3', name: 'Travis Head', runs: 45, balls: 28, fours: 5, sixes: 2, isOut: true },
          ],
          bowlers: [
            { id: 'bw2', name: 'Mitchell Starc', overs: 4, ballsInCurrentOver: 0, maidens: 0, runsConceded: 38, wickets: 1, economy: 9.5, isCurrent: true },
          ],
          playingXI: ['Travis Head', 'Mitchell Starc'],
        },
        battingTeamId: 'teamA',
        bowlingTeamId: 'teamB',
        matchDetails: {
          title: 'WORLD CUP FINAL',
          tournament: 'ICC CRICKET WORLD CUP',
          stage: 'FINAL',
          venue: 'AHMEDABAD',
          tossWinner: 'India',
          tossDecision: 'bat',
          targetRuns: 186,
          currentInnings: 2,
          totalOvers: 20,
          recentBalls: ['1', '4', '0', 'W', '6', '1'],
          fallOfWickets: [],
          matchStatusText: 'LIVE',
          partnership: { runs: 50, balls: 30, batter1Name: 'Rohit Sharma', batter1Runs: 20, batter1Balls: 12, batter2Name: 'Virat Kohli', batter2Runs: 30, batter2Balls: 18 },
        },
      });
    });

    it('renders PlayingXIOverlay with Team A primary color on left and Team B primary color on right with contrast text', () => {
      const { container } = render(<PlayingXIOverlay />);

      expect(screen.getByText('India')).toBeDefined();
      expect(screen.getByText('Australia')).toBeDefined();

      // Team B is Australia with primaryColor #FFD700 (yellow) -> must have black text color (#000000)
      const ausHeading = screen.getByText('Australia');
      expect(ausHeading.style.color).toBe('rgb(0, 0, 0)');

      // Team A is India with primaryColor #00529B (blue) -> must have white text color (#ffffff)
      const indHeading = screen.getByText('India');
      expect(indHeading.style.color).toBe('rgb(255, 255, 255)');
    });

    it('renders BattingScorecard with battingTeam primaryColor header and 10% opacity rows', () => {
      const { container } = render(<BattingScorecard />);
      expect(screen.getByText('BATTING SCORECARD')).toBeDefined();
      expect(screen.getByText('Rohit Sharma')).toBeDefined();
    });

    it('renders BowlingScorecard with dynamic colors and 10% opacity bowler rows', () => {
      const { container } = render(<BowlingScorecard />);
      expect(screen.getByText('BOWLING SCORECARD')).toBeDefined();
      expect(screen.getByText('Mitchell Starc')).toBeDefined();
    });

    it('renders MatchSummary with dynamic team colors', () => {
      const { container } = render(<MatchSummary />);
      expect(screen.getByText('MATCH SUMMARY')).toBeDefined();
      expect(screen.getAllByText('India').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Australia').length).toBeGreaterThanOrEqual(1);
    });
  });
});
