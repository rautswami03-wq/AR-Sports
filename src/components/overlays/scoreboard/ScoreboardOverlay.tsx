import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useBroadcastStore } from '../../../store/useBroadcastStore';
import {
  ScoreboardTheme,
  ThemeId,
  getTheme,
  applyThemeToDom,
  ALL_THEME_IDS,
  SCOREBOARD_THEMES,
} from '../../../theme/scoreboardThemes';
import { injectGlobalKeyframes } from './AnimationEngine';
import { ScoreStrip } from './ScoreStrip';
import { BatterPanel } from './BatterPanel';
import { BowlerPanel } from './BowlerPanel';
import { PartnershipBar } from './PartnershipBar';
import { ScoreTicker } from './ScoreTicker';
import { CelebrationOverlay, CelebrationEventType } from './CelebrationOverlay';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getUrlParam(key: string): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

function injectFont(url: string): void {
  const id = `sb-font-${btoa(url).slice(0, 16)}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
}

// ─────────────────────────────────────────────────────────────────────────────
// Flash state machine
// ─────────────────────────────────────────────────────────────────────────────

type FlashState = 'four' | 'six' | 'wicket' | 'extra' | null;

function useFlashState(recentBalls: string[], customText?: string, decision?: string) {
  const [flash, setFlash] = useState<FlashState>(null);
  const prevBallsRef = useRef<string[]>([]);
  const prevCustomRef = useRef('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trigger = useCallback((type: FlashState, duration = 3200) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setFlash(type);
    timerRef.current = setTimeout(() => setFlash(null), duration);
  }, []);

  // Watch recentBalls for new last ball
  useEffect(() => {
    const prev = prevBallsRef.current;
    const newBall = recentBalls.length > prev.length
      ? recentBalls[recentBalls.length - 1]
      : null;
    prevBallsRef.current = recentBalls;

    if (!newBall) return;
    if      (newBall === 'W')               trigger('wicket', 4000);
    else if (newBall === '6')               trigger('six',    3500);
    else if (newBall === '4')               trigger('four',   3000);
    else if (newBall === 'WD' || newBall === 'NB') trigger('extra', 2500);
  }, [recentBalls, trigger]);

  // Watch customText for manual triggers
  useEffect(() => {
    const text = customText ?? '';
    if (!text || text === prevCustomRef.current) return;
    prevCustomRef.current = text;
    const upper = text.toUpperCase();
    if (upper.includes('WICKET') || decision === 'OUT') trigger('wicket', 4000);
    else if (upper.includes('SIX') || upper.includes('MAXIMUM'))  trigger('six',    3500);
    else if (upper.includes('FOUR'))                               trigger('four',   3000);
  }, [customText, decision, trigger]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return flash;
}

// ─────────────────────────────────────────────────────────────────────────────
// Milestone detector
// ─────────────────────────────────────────────────────────────────────────────

function useMilestone(striker?: { runs: number; name: string }) {
  const [milestone, setMilestone] = useState<{ player: string; value: number } | null>(null);
  const prevRunsRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!striker) return;
    const prev = prevRunsRef.current;
    const curr = striker.runs;
    prevRunsRef.current = curr;

    const MILESTONES = [50, 100, 150, 200];
    for (const m of MILESTONES) {
      if (prev < m && curr >= m) {
        setMilestone({ player: striker.name, value: m });
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setMilestone(null), 4000);
        break;
      }
    }
  }, [striker?.runs, striker?.name]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return milestone;
}

// ─────────────────────────────────────────────────────────────────────────────
// Theme switcher — listens for URL param + postMessage + BroadcastChannel
// ─────────────────────────────────────────────────────────────────────────────

function useThemeId(): [ThemeId, (id: ThemeId) => void] {
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    const urlTheme = getUrlParam('theme');
    if (urlTheme && ALL_THEME_IDS.includes(urlTheme as ThemeId)) return urlTheme as ThemeId;
    try {
      const stored = localStorage.getItem('sb_theme');
      if (stored && ALL_THEME_IDS.includes(stored as ThemeId)) return stored as ThemeId;
    } catch {}
    return 'nakshatra';
  });

  // Listen for postMessage theme switch (from ControlStudio)
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'SB_SET_THEME' && ALL_THEME_IDS.includes(e.data.themeId)) {
        setThemeId(e.data.themeId as ThemeId);
        try { localStorage.setItem('sb_theme', e.data.themeId); } catch {}
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // Listen for URL hash change (e.g., ?theme=ipl)
  useEffect(() => {
    const handler = () => {
      const t = getUrlParam('theme');
      if (t && ALL_THEME_IDS.includes(t as ThemeId)) setThemeId(t as ThemeId);
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  const setAndPersist = useCallback((id: ThemeId) => {
    setThemeId(id);
    try { localStorage.setItem('sb_theme', id); } catch {}
  }, []);

  return [themeId, setAndPersist];
}

// ─────────────────────────────────────────────────────────────────────────────
// ScoreboardOverlay — root component
// ─────────────────────────────────────────────────────────────────────────────

interface ScoreboardOverlayProps {
  /** Override theme (from parent, e.g., route param). Ignored if undefined. */
  themeOverride?: ThemeId;
  /** Whether this is an OBS overlay (no UI chrome) or preview mode */
  obsMode?: boolean;
}

export const ScoreboardOverlay: React.FC<ScoreboardOverlayProps> = ({
  themeOverride,
  obsMode = true,
}) => {
  const [themeId, setThemeId] = useThemeId();
  const activeThemeId = themeOverride ?? themeId;
  const theme: ScoreboardTheme = getTheme(activeThemeId);

  // Apply CSS custom properties + font whenever theme changes
  useEffect(() => {
    applyThemeToDom(theme, document.documentElement);
    if (theme.fontUrl) injectFont(theme.fontUrl);
    injectGlobalKeyframes();
  }, [theme]);

  // ── Store data ─────────────────────────────────────────────────────────────
  const {
    teamA,
    teamB,
    battingTeamId,
    matchDetails,
  } = useBroadcastStore();

  const isTeamA = battingTeamId === teamA.id || battingTeamId === teamA.shortName || battingTeamId === 'teamA';
  const battingTeam = isTeamA ? teamA : teamB;
  const bowlingTeam = isTeamA ? teamB : teamA;

  const striker    = battingTeam.batters.find(b => b.isStriker && !b.isOut) ?? battingTeam.batters[0];
  const nonStriker = battingTeam.batters.find(b => !b.isStriker && !b.isOut) ?? battingTeam.batters[1];
  const bowler     = bowlingTeam.bowlers.find(bw => bw.isCurrent) ?? bowlingTeam.bowlers[0];
  const prevBowler = bowlingTeam.bowlers.find(bw => !bw.isCurrent && bw.overs > 0);

  const totalBalls = battingTeam.overs * 6 + battingTeam.balls;
  const crr = totalBalls > 0 ? ((battingTeam.score / totalBalls) * 6).toFixed(1) : '0.0';
  const rrr = matchDetails.targetRuns && totalBalls < 120
    ? Math.max(0, (matchDetails.targetRuns - battingTeam.score) / Math.max(1, (120 - totalBalls) / 6)).toFixed(1)
    : undefined;

  // Partnership calculation
  const strikerContrib   = striker?.runs   ?? 0;
  const nonStrikerContrib = nonStriker?.runs ?? 0;
  const partnershipRuns  = strikerContrib + nonStrikerContrib;
  const partnershipBalls = (striker?.balls ?? 0) + (nonStriker?.balls ?? 0);

  // ── Flash state ────────────────────────────────────────────────────────────
  const flash = useFlashState(
    matchDetails.recentBalls,
    matchDetails.customInputText,
    matchDetails.decision ?? undefined,
  );

  // ── Milestone detection ────────────────────────────────────────────────────
  const milestone = useMilestone(striker);

  // ── Celebration ────────────────────────────────────────────────────────────
  const isCelebrating = flash === 'four' || flash === 'six' || flash === 'wicket';
  const celebrationType: CelebrationEventType = flash as CelebrationEventType ?? 'four';

  // ── Bowler figures ─────────────────────────────────────────────────────────
  const bowlerFigures = bowler
    ? `${bowler.wickets}-${bowler.runsConceded}`
    : undefined;

  // ── Theme picker (visible only when NOT in OBS mode) ──────────────────────
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div
      id="sb-root"
      className="relative w-full flex flex-col gap-1.5"
      style={{
        fontFamily: 'var(--sb-font-primary, Inter, sans-serif)',
        maxWidth: '1920px',
        // OBS transparent background — set on body by App.tsx for /scoreboard route
      }}
    >
      {/* ── Theme dev picker (hidden in OBS mode) ─────────────────────────── */}
      {!obsMode && (
        <div className="absolute top-0 right-0 z-50">
          <button
            onClick={() => setShowPicker(p => !p)}
            className="text-[10px] font-bold px-2 py-1 rounded opacity-70 hover:opacity-100 transition"
            style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            🎨 {theme.name}
          </button>
          {showPicker && (
            <ThemePicker activeId={activeThemeId} onSelect={setThemeId} />
          )}
        </div>
      )}

      {/* ── Page Center Celebration (full viewport) ─────────────────────────── */}
      <CelebrationOverlay
        active={isCelebrating && theme.celebrationStyle === 'page-center'}
        type={celebrationType}
        mode="page-center"
        batter={striker?.name}
        milestone={milestone?.value}
      />

      {/* ── Batter Bar Celebration ─────────────────────────────────────────── */}
      <CelebrationOverlay
        active={isCelebrating && theme.celebrationStyle === 'batter-bar'}
        type={celebrationType}
        mode="batter-bar"
        batter={striker?.name}
      />

      {/* ── Main Score Strip ──────────────────────────────────────────────── */}
      <ScoreStrip
        theme={theme}
        battingTeamName={battingTeam.fullName}
        battingTeamShort={battingTeam.shortName}
        battingTeamLogo={battingTeam.logoUrl}
        battingTeamColor={battingTeam.primaryColor}
        bowlingTeamName={bowlingTeam.fullName}
        bowlingTeamShort={bowlingTeam.shortName}
        bowlingTeamLogo={bowlingTeam.logoUrl}
        bowlingTeamColor={bowlingTeam.primaryColor}
        score={battingTeam.score}
        wickets={battingTeam.wickets}
        overs={battingTeam.overs}
        balls={battingTeam.balls}
        totalOvers={matchDetails.totalOvers ?? 20}
        crr={crr}
        rrr={rrr}
        targetRuns={matchDetails.targetRuns}
        recentBalls={matchDetails.recentBalls}
        partnershipRuns={partnershipRuns}
        partnershipBalls={partnershipBalls}
        strikerName={striker?.name}
        nonStrikerName={nonStriker?.name}
        strikerRuns={striker?.runs}
        strikerBalls={striker?.balls}
        nonStrikerRuns={nonStriker?.runs}
        nonStrikerBalls={nonStriker?.balls}
        flashType={flash}
      />

      {/* ── Stats Panels Row (batter + bowler side by side) ─────────────────── */}
      <div className="flex gap-1.5 w-full">
        {/* Batter Panel */}
        <div className="flex-1 min-w-0">
          <BatterPanel
            theme={theme}
            striker={striker ? { ...striker, isStriker: striker.isStriker ?? false } : undefined}
            nonStriker={nonStriker ? { ...nonStriker, isStriker: nonStriker.isStriker ?? false } : undefined}
            flashType={flash}
            showMilestone={!!milestone}
            milestonePlayer={milestone?.player}
            milestoneValue={milestone?.value}
          />
        </div>

        {/* Bowler Panel */}
        <div className="w-[380px] shrink-0">
          <BowlerPanel
            theme={theme}
            currentBowler={bowler}
            previousBowler={prevBowler}
            flashType={flash}
          />
        </div>
      </div>

      {/* ── Partnership Bar ───────────────────────────────────────────────── */}
      <PartnershipBar
        theme={theme}
        runs={partnershipRuns}
        balls={partnershipBalls}
        striker={striker?.name}
        nonStriker={nonStriker?.name}
        strikerContribution={strikerContrib}
        nonStrikerContribution={nonStrikerContrib}
        teamScore={battingTeam.score}
        targetRuns={matchDetails.targetRuns}
      />

      {/* ── Score Ticker ──────────────────────────────────────────────────── */}
      <ScoreTicker
        theme={theme}
        battingTeamName={battingTeam.shortName || battingTeam.fullName}
        bowlingTeamName={bowlingTeam.shortName || bowlingTeam.fullName}
        score={battingTeam.score}
        wickets={battingTeam.wickets}
        overs={battingTeam.overs}
        balls={battingTeam.balls}
        totalOvers={matchDetails.totalOvers ?? 20}
        recentBalls={matchDetails.recentBalls}
        crr={crr}
        rrr={rrr}
        targetRuns={matchDetails.targetRuns}
        strikerName={striker?.name}
        strikerRuns={striker?.runs}
        strikerBalls={striker?.balls}
        nonStrikerName={nonStriker?.name}
        nonStrikerRuns={nonStriker?.runs}
        nonStrikerBalls={nonStriker?.balls}
        bowlerName={bowler?.name}
        bowlerFigures={bowlerFigures}
        customText={matchDetails.customInputText || matchDetails.winnerMargin || undefined}
        flashType={flash}
      />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ThemePicker — dev overlay for non-OBS mode
// ─────────────────────────────────────────────────────────────────────────────

const ThemePicker: React.FC<{ activeId: ThemeId; onSelect: (id: ThemeId) => void }> = ({
  activeId,
  onSelect,
}) => {

  return (
    <div
      className="absolute right-0 top-8 w-56 rounded-xl overflow-hidden shadow-2xl border"
      style={{
        background: '#0f172a',
        borderColor: 'rgba(255,255,255,0.15)',
        zIndex: 100,
        maxHeight: '70vh',
        overflowY: 'auto',
      }}
    >
      <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-white/10">
        Select Theme
      </div>
      {ALL_THEME_IDS.map(id => {
        const t = SCOREBOARD_THEMES[id] as ScoreboardTheme;
        const isActive = id === activeId;
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-left transition-all hover:bg-white/5"
            style={{
              background: isActive ? 'rgba(255,255,255,0.08)' : undefined,
              borderLeft: isActive ? '3px solid var(--sb-accent-primary, #3b82f6)' : '3px solid transparent',
            }}
          >
            <span
              className="w-4 h-4 rounded-full border border-white/20 shrink-0"
              style={{ background: t.accentPrimary }}
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white leading-tight">{t.name}</span>
              <span className="text-[10px] text-slate-500 leading-tight">{t.description.substring(0, 30)}</span>
            </div>
            {isActive && (
              <span className="ml-auto text-[10px] font-black text-blue-400">✓</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ScoreboardPage — full 1920×1080 OBS Browser Source page
// ─────────────────────────────────────────────────────────────────────────────

export const ScoreboardPage: React.FC = () => {
  const themeFromUrl = getUrlParam('theme') as ThemeId | null;
  const obsMode = getUrlParam('preview') !== '1';

  return (
    <div
      className="w-full h-full flex flex-col justify-end p-4"
      style={{
        // OBS transparent bg — must be set on html/body (App.tsx handles that)
        background: 'transparent',
        minHeight: '100vh',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <ScoreboardOverlay
        themeOverride={themeFromUrl ?? undefined}
        obsMode={obsMode}
      />
    </div>
  );
};

export default ScoreboardPage;
