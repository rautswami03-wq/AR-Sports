'use client';

import React, { useState } from 'react';
import { Panel, Button, Badge, Card, Separator } from '@ar-sports/ui';
import {
  BatIcon,
  BallIcon,
  WicketIcon,
  TrophyIcon,
  ScoreboardIcon,
  OverlayIcon,
  PlayersIcon,
  SettingsIcon,
  UndoIcon,
  RedoIcon,
  PauseIcon,
  PlayIcon,
} from '@ar-sports/icons';
import { useMatchStore, useScoringStore } from '@ar-sports/store';
import { BallEventType, MatchStatus, MatchFormat } from '@ar-sports/types';
import { formatOvers } from '@ar-sports/utils';

type View = 'dashboard' | 'match-setup' | 'live-scoring' | 'teams' | 'tournaments' | 'settings';

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const currentMatch = useMatchStore((s) => s.currentMatch);

  return (
    <div className="flex h-screen">
      {/* Sidebar Navigation */}
      <aside className="w-[var(--sidebar-width)] bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-[var(--color-border)]">
          <h1 className="text-lg font-display font-bold tracking-wider text-[var(--color-accent)]">
            AR SPORTS
          </h1>
          <p className="text-xs text-[var(--color-text-muted)]">Studio Pro</p>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-3 space-y-1">
          <NavItem icon={<ScoreboardIcon size={18} />} label="Dashboard" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
          <NavItem icon={<BatIcon size={18} />} label="New Match" active={currentView === 'match-setup'} onClick={() => setCurrentView('match-setup')} />
          <NavItem icon={<BallIcon size={18} />} label="Live Scoring" active={currentView === 'live-scoring'} onClick={() => setCurrentView('live-scoring')} disabled={!currentMatch} />
          <NavItem icon={<PlayersIcon size={18} />} label="Teams" active={currentView === 'teams'} onClick={() => setCurrentView('teams')} />
          <NavItem icon={<TrophyIcon size={18} />} label="Tournaments" active={currentView === 'tournaments'} onClick={() => setCurrentView('tournaments')} />
          <NavItem icon={<SettingsIcon size={18} />} label="Settings" active={currentView === 'settings'} onClick={() => setCurrentView('settings')} />
        </nav>

        {/* Status */}
        <div className="p-4 border-t border-[var(--color-border)]">
          {currentMatch ? (
            <div>
              <Badge variant="live">LIVE</Badge>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Match in progress</p>
            </div>
          ) : (
            <p className="text-xs text-[var(--color-text-muted)]">No active match</p>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {currentView === 'dashboard' && <DashboardView onNavigate={setCurrentView} />}
        {currentView === 'match-setup' && <MatchSetupView onComplete={() => setCurrentView('live-scoring')} />}
        {currentView === 'live-scoring' && <LiveScoringView />}
        {currentView === 'teams' && <TeamsView />}
        {currentView === 'settings' && <SettingsView />}
        {(currentView === 'tournaments') && <PlaceholderView title="Tournaments" />}
      </main>
    </div>
  );
}

// ============================================================================
// Navigation Item
// ============================================================================

function NavItem({ icon, label, active, onClick, disabled }: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)]'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {icon}
      {label}
    </button>
  );
}

// ============================================================================
// Dashboard View
// ============================================================================

function DashboardView({ onNavigate }: { onNavigate: (view: View) => void }) {
  return (
    <div className="h-full overflow-auto panel-scroll p-6">
      <h2 className="text-2xl font-display font-bold mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card hoverable onClick={() => onNavigate('match-setup')}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)]/20 flex items-center justify-center">
              <BatIcon size={20} className="text-[var(--color-accent)]" />
            </div>
            <h3 className="font-semibold">New Match</h3>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">Start a new match with live scoring</p>
        </Card>

        <Card hoverable onClick={() => onNavigate('teams')}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <PlayersIcon size={20} className="text-blue-400" />
            </div>
            <h3 className="font-semibold">Team Manager</h3>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">Create and manage teams and players</p>
        </Card>

        <Card hoverable onClick={() => onNavigate('tournaments')}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <TrophyIcon size={20} className="text-purple-400" />
            </div>
            <h3 className="font-semibold">Tournaments</h3>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">Create tournaments and manage fixtures</p>
        </Card>
      </div>

      <Panel title="Quick Start">
        <div className="space-y-3">
          <p className="text-sm text-[var(--color-text-secondary)]">
            1. Create teams and add players in Team Manager
          </p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            2. Start a new match and select teams
          </p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            3. Begin live scoring — overlay updates in real-time
          </p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            4. Add the overlay as a Browser Source in OBS (localhost:3001)
          </p>
        </div>
      </Panel>
    </div>
  );
}

// ============================================================================
// Match Setup View
// ============================================================================

function MatchSetupView({ onComplete }: { onComplete: () => void }) {
  const createMatch = useMatchStore((s) => s.createMatch);
  const startInnings = useMatchStore((s) => s.startInnings);

  const [team1, setTeam1] = useState({ name: 'Team A', shortName: 'TA', color: '#1E3A5F' });
  const [team2, setTeam2] = useState({ name: 'Team B', shortName: 'TB', color: '#7C3AED' });
  const [format, setFormat] = useState<MatchFormat>(MatchFormat.T20);
  const [overs, setOvers] = useState(20);
  const [venue, setVenue] = useState('');
  const [tossWinner, setTossWinner] = useState<'team1' | 'team2'>('team1');
  const [tossDecision, setTossDecision] = useState<'BAT' | 'BOWL'>('BAT');

  const handleStartMatch = () => {
    const match = createMatch({
      team1Id: 'team1-demo',
      team2Id: 'team2-demo',
      format,
      totalOvers: overs,
      venue: venue || undefined,
    });

    const battingFirst = tossDecision === 'BAT' ? tossWinner : tossWinner === 'team1' ? 'team2' : 'team1';
    startInnings(
      battingFirst === 'team1' ? 'team1-demo' : 'team2-demo',
      battingFirst === 'team1' ? 'team2-demo' : 'team1-demo',
    );

    onComplete();
  };

  return (
    <div className="h-full overflow-auto panel-scroll p-6">
      <h2 className="text-2xl font-display font-bold mb-6">Match Setup</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teams */}
        <Panel title="Teams" padding="lg">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-[var(--color-text-muted)] mb-1 block">Team 1</label>
              <div className="flex gap-2">
                <input
                  value={team1.name}
                  onChange={(e) => setTeam1({ ...team1, name: e.target.value })}
                  className="flex-1 h-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm"
                  placeholder="Team name"
                />
                <input
                  value={team1.shortName}
                  onChange={(e) => setTeam1({ ...team1, shortName: e.target.value })}
                  className="w-20 h-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-center"
                  placeholder="Short"
                />
                <input
                  type="color"
                  value={team1.color}
                  onChange={(e) => setTeam1({ ...team1, color: e.target.value })}
                  className="w-10 h-10 rounded-lg border border-[var(--color-border)] cursor-pointer"
                />
              </div>
            </div>

            <div className="text-center text-[var(--color-text-muted)] font-display text-xl">VS</div>

            <div>
              <label className="text-sm text-[var(--color-text-muted)] mb-1 block">Team 2</label>
              <div className="flex gap-2">
                <input
                  value={team2.name}
                  onChange={(e) => setTeam2({ ...team2, name: e.target.value })}
                  className="flex-1 h-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm"
                  placeholder="Team name"
                />
                <input
                  value={team2.shortName}
                  onChange={(e) => setTeam2({ ...team2, shortName: e.target.value })}
                  className="w-20 h-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-center"
                  placeholder="Short"
                />
                <input
                  type="color"
                  value={team2.color}
                  onChange={(e) => setTeam2({ ...team2, color: e.target.value })}
                  className="w-10 h-10 rounded-lg border border-[var(--color-border)] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </Panel>

        {/* Match Config */}
        <Panel title="Match Configuration" padding="lg">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-[var(--color-text-muted)] mb-1 block">Format</label>
              <div className="flex gap-2">
                {Object.values(MatchFormat).map((f) => (
                  <Button
                    key={f}
                    variant={format === f ? 'accent' : 'secondary'}
                    size="sm"
                    onClick={() => {
                      setFormat(f);
                      if (f === MatchFormat.T20) setOvers(20);
                      if (f === MatchFormat.ODI) setOvers(50);
                    }}
                  >
                    {f}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-[var(--color-text-muted)] mb-1 block">Total Overs</label>
              <input
                type="number"
                value={overs}
                onChange={(e) => setOvers(Number(e.target.value))}
                min={1}
                max={50}
                className="w-full h-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-[var(--color-text-muted)] mb-1 block">Venue</label>
              <input
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full h-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm"
                placeholder="Stadium name"
              />
            </div>
          </div>
        </Panel>

        {/* Toss */}
        <Panel title="Toss" padding="lg">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-[var(--color-text-muted)] mb-1 block">Toss Winner</label>
              <div className="flex gap-2">
                <Button
                  variant={tossWinner === 'team1' ? 'accent' : 'secondary'}
                  size="sm"
                  onClick={() => setTossWinner('team1')}
                >
                  {team1.name}
                </Button>
                <Button
                  variant={tossWinner === 'team2' ? 'accent' : 'secondary'}
                  size="sm"
                  onClick={() => setTossWinner('team2')}
                >
                  {team2.name}
                </Button>
              </div>
            </div>
            <div>
              <label className="text-sm text-[var(--color-text-muted)] mb-1 block">Elected to</label>
              <div className="flex gap-2">
                <Button
                  variant={tossDecision === 'BAT' ? 'accent' : 'secondary'}
                  size="sm"
                  onClick={() => setTossDecision('BAT')}
                >
                  Bat
                </Button>
                <Button
                  variant={tossDecision === 'BOWL' ? 'accent' : 'secondary'}
                  size="sm"
                  onClick={() => setTossDecision('BOWL')}
                >
                  Bowl
                </Button>
              </div>
            </div>
          </div>
        </Panel>
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="accent" size="lg" onClick={handleStartMatch}>
          Start Match
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// Live Scoring View — The core scoring interface
// ============================================================================

function LiveScoringView() {
  const currentMatch = useMatchStore((s) => s.currentMatch);
  const addBallEvent = useScoringStore((s) => s.addBallEvent);
  const undo = useScoringStore((s) => s.undo);
  const redo = useScoringStore((s) => s.redo);
  const canUndo = useScoringStore((s) => s.canUndo);
  const canRedo = useScoringStore((s) => s.canRedo);
  const rotateOver = useScoringStore((s) => s.rotateOver);

  const innings = currentMatch?.innings[currentMatch.currentInningsIndex];
  const isOverComplete = innings ? innings.totalBalls > 0 && innings.totalBalls % 6 === 0 : false;

  // Helper to add a ball event
  const addBall = (type: BallEventType, runs: number, extras: number, isLegal: boolean) => {
    if (!innings) return;
    const currentOver = Math.floor(innings.totalBalls / 6);
    const ballInOver = innings.totalBalls % 6;

    addBallEvent({
      matchId: currentMatch!.id,
      inningsId: innings.id,
      overNumber: currentOver,
      ballNumber: ballInOver + 1,
      type,
      runsScored: runs,
      extras,
      totalRuns: runs + extras,
      batsmanId: 'batter1', // TODO: get from innings state
      nonStrikerId: 'batter2',
      bowlerId: 'bowler1',
      isLegalDelivery: isLegal,
    });
  };

  if (!currentMatch || !innings) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <BallIcon size={48} className="text-[var(--color-text-muted)] mx-auto mb-4" />
          <p className="text-[var(--color-text-muted)]">No active match. Set up a match first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4 gap-4 overflow-hidden">
      {/* Top bar: Score summary + controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Badge variant="live">LIVE</Badge>
          <span className="text-2xl font-mono font-bold">
            {innings.totalRuns}/{innings.totalWickets}
          </span>
          <span className="text-lg text-[var(--color-text-muted)] font-mono">
            ({formatOvers(innings.totalBalls)})
          </span>
          <span className="text-sm text-[var(--color-text-muted)]">
            CRR: {innings.currentRunRate}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" onClick={undo} disabled={!canUndo()}>
            <UndoIcon size={16} />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={redo} disabled={!canRedo()}>
            <RedoIcon size={16} />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="secondary" size="sm">
            <PauseIcon size={14} />
            Pause
          </Button>
        </div>
      </div>

      <Separator />

      {/* Main scoring area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden">
        {/* Left: Ball event buttons */}
        <div className="lg:col-span-2">
          <Panel title="Ball Events" variant="elevated" className="h-full">
            <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
              {/* Standard deliveries */}
              <BallButton label="Dot" variant="secondary" onClick={() => addBall(BallEventType.DOT, 0, 0, true)} />
              <BallButton label="1" variant="secondary" onClick={() => addBall(BallEventType.ONE, 1, 0, true)} />
              <BallButton label="2" variant="secondary" onClick={() => addBall(BallEventType.TWO, 2, 0, true)} />
              <BallButton label="3" variant="secondary" onClick={() => addBall(BallEventType.THREE, 3, 0, true)} />
              <BallButton label="4" variant="four" onClick={() => addBall(BallEventType.FOUR, 4, 0, true)} />
              <BallButton label="5" variant="secondary" onClick={() => addBall(BallEventType.FIVE, 5, 0, true)} />
              <BallButton label="6" variant="six" onClick={() => addBall(BallEventType.SIX, 6, 0, true)} />

              {/* Extras */}
              <BallButton label="Wide" variant="outline" onClick={() => addBall(BallEventType.WIDE, 0, 1, false)} />
              <BallButton label="No Ball" variant="outline" onClick={() => addBall(BallEventType.NO_BALL, 0, 1, false)} />
              <BallButton label="Bye" variant="outline" onClick={() => addBall(BallEventType.BYE, 0, 1, true)} />
              <BallButton label="Leg Bye" variant="outline" onClick={() => addBall(BallEventType.LEG_BYE, 0, 1, true)} />

              {/* Wicket */}
              <BallButton label="Wicket" variant="wicket" onClick={() => addBall(BallEventType.WICKET, 0, 0, true)} />
            </div>

            {/* Over completion check */}
            {isOverComplete && (
              <div className="mt-4">
                <Button variant="accent" size="lg" onClick={rotateOver} className="w-full">
                  End Over & Rotate Strike
                </Button>
              </div>
            )}
          </Panel>
        </div>

        {/* Right: Over tracker + info */}
        <div className="space-y-4 overflow-auto panel-scroll">
          {/* Current over */}
          <Panel title="Current Over" variant="elevated">
            <div className="flex items-center gap-2 flex-wrap">
              {innings.overs.length > 0 &&
                innings.overs[innings.overs.length - 1].balls.map((ball, i) => (
                  <div
                    key={i}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                      ball.type === 'WICKET'
                        ? 'bg-red-500/20 border-red-500 text-red-400'
                        : ball.type === 'FOUR'
                        ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                        : ball.type === 'SIX'
                        ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                        : ball.totalRuns === 0
                        ? 'bg-white/10 border-white/20 text-white/60'
                        : 'bg-white/20 border-white/30 text-white'
                    }`}
                  >
                    {ball.type === 'WICKET' ? 'W' : ball.totalRuns === 0 ? '•' : ball.totalRuns}
                  </div>
                ))}
              {innings.overs.length === 0 || innings.overs[innings.overs.length - 1].balls.length === 0 ? (
                <span className="text-sm text-[var(--color-text-muted)]">No balls yet</span>
              ) : null}
            </div>
          </Panel>

          {/* Match info */}
          <Panel title="Match Info" variant="elevated">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Format</span>
                <span className="font-medium">{currentMatch.format}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Overs</span>
                <span className="font-mono">{formatOvers(innings.totalBalls)} / {currentMatch.totalOvers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Run Rate</span>
                <span className="font-mono">{innings.currentRunRate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Extras</span>
                <span className="font-mono">{innings.extras}</span>
              </div>
              {currentMatch.venue && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">Venue</span>
                  <span>{currentMatch.venue}</span>
                </div>
              )}
            </div>
          </Panel>

          {/* Overlay preview placeholder */}
          <Panel title="Overlay Control" variant="elevated">
            <div className="space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <OverlayIcon size={14} />
                Show Score Bug
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <OverlayIcon size={14} />
                Show Batting Card
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <OverlayIcon size={14} />
                Show Bowling Card
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Ball Button Component
// ============================================================================

function BallButton({ label, variant, onClick }: {
  label: string;
  variant: 'secondary' | 'outline' | 'four' | 'six' | 'wicket';
  onClick: () => void;
}) {
  const variantClasses: Record<string, string> = {
    secondary: 'bg-[var(--color-surface-elevated)] hover:bg-[var(--color-border)] text-[var(--color-text)]',
    outline: 'border border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)]',
    four: 'bg-[var(--color-four)] hover:bg-blue-700 text-white font-bold',
    six: 'bg-[var(--color-six)] hover:bg-purple-800 text-white font-bold',
    wicket: 'bg-[var(--color-wicket)] hover:bg-red-800 text-white font-bold',
  };

  return (
    <button
      onClick={onClick}
      className={`h-14 rounded-lg text-sm font-semibold transition-all active:scale-95 ${variantClasses[variant]}`}
    >
      {label}
    </button>
  );
}

// ============================================================================
// Teams View (Placeholder)
// ============================================================================

function TeamsView() {
  return (
    <div className="h-full overflow-auto panel-scroll p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-bold">Teams</h2>
        <Button variant="accent" size="sm">+ New Team</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1E3A5F] flex items-center justify-center text-white font-bold text-sm">TA</div>
            <div>
              <h3 className="font-semibold">Team A</h3>
              <p className="text-xs text-[var(--color-text-muted)]">11 players</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#7C3AED] flex items-center justify-center text-white font-bold text-sm">TB</div>
            <div>
              <h3 className="font-semibold">Team B</h3>
              <p className="text-xs text-[var(--color-text-muted)]">11 players</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============================================================================
// Settings View
// ============================================================================

function SettingsView() {
  return (
    <div className="h-full overflow-auto panel-scroll p-6">
      <h2 className="text-2xl font-display font-bold mb-6">Settings</h2>
      <div className="space-y-4 max-w-lg">
        <Panel title="Display" variant="elevated">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Theme</span>
              <select className="h-8 rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 text-sm">
                <option>Dark</option>
                <option>Light</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Animation Speed</span>
              <select className="h-8 rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 text-sm">
                <option value="0.5">0.5x</option>
                <option value="1">1.0x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2.0x</option>
              </select>
            </div>
          </div>
        </Panel>
        <Panel title="Overlay" variant="elevated">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Overlay Port</span>
              <input type="number" defaultValue={3001} className="w-20 h-8 rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 text-sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">WebSocket Port</span>
              <input type="number" defaultValue={8765} className="w-20 h-8 rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 text-sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Overlay Scale</span>
              <input type="range" min="0.5" max="2" step="0.1" defaultValue="1" className="w-32" />
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

// ============================================================================
// Placeholder View
// ============================================================================

function PlaceholderView({ title }: { title: string }) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <TrophyIcon size={48} className="text-[var(--color-text-muted)] mx-auto mb-4" />
        <h2 className="text-xl font-display font-bold mb-2">{title}</h2>
        <p className="text-[var(--color-text-muted)]">Coming soon</p>
      </div>
    </div>
  );
}
