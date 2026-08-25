import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ControlStudio } from './components/control/ControlStudio';
import { OverlayStage } from './components/control/OverlayStage';
import { ThemeLinksPage } from './components/control/ThemeLinksPage';
import { TournamentPage } from './components/control/TournamentPage';
import { TournamentDetailPage } from './components/control/TournamentDetailPage';
import { TourMatchPage } from './components/control/TourMatchPage';
import { LandingPage } from './components/public/LandingPage';
import { ScoreboardPage } from './components/overlays/scoreboard/ScoreboardOverlay';
import { AntiGravityPage } from './components/overlays/AntiGravityPage';

export default function App() {
  const location = useLocation();

  useEffect(() => {
    const href = window.location.href;
    const hash = window.location.hash;
    const isOverlayRoute =
      href.includes('/overlay') ||
      href.includes('/theme/') ||
      href.includes('/scoreboard') ||
      href.includes('/anti-gravity') ||
      hash.includes('/overlay') ||
      hash.includes('/theme/') ||
      hash.includes('/scoreboard') ||
      hash.includes('/anti-gravity') ||
      location.pathname.startsWith('/overlay') ||
      location.pathname.startsWith('/theme') ||
      location.pathname.startsWith('/scoreboard') ||
      location.pathname.startsWith('/anti-gravity');

    if (isOverlayRoute) {
      document.body.style.setProperty('background', 'transparent', 'important');
      document.body.style.setProperty('background-color', 'transparent', 'important');
      document.documentElement.style.setProperty('background', 'transparent', 'important');
      document.documentElement.style.setProperty('background-color', 'transparent', 'important');
    } else {
      document.body.style.setProperty('background', '#070b15');
      document.documentElement.style.setProperty('background', '#070b15');
    }
  }, [location.pathname, location.hash]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<LandingPage />} />
      <Route path="/control" element={<TourMatchPage />} />
      <Route path="/control/studio" element={<ControlStudio />} />
      <Route path="/tournament" element={<TournamentPage />} />
      <Route path="/matches" element={<TournamentPage />} />
      <Route path="/tournament/:id" element={<TournamentDetailPage />} />
      <Route path="/tournament/:tourId/match/:id" element={<TourMatchPage />} />
      <Route path="/match/:id" element={<TourMatchPage />} />
      <Route path="/theme_links" element={<ThemeLinksPage />} />
      <Route path="/themes" element={<ThemeLinksPage />} />
      {/* ── 17-Theme Cricket Scoreboard Overlay (OBS Browser Source) ────── */}
      <Route
        path="/scoreboard"
        element={
          <div className="w-full h-screen bg-transparent overflow-hidden">
            <ScoreboardPage />
          </div>
        }
      />
      <Route
        path="/scoreboard/:themeId"
        element={
          <div className="w-full h-screen bg-transparent overflow-hidden">
            <ScoreboardPage />
          </div>
        }
      />
      {/* ── Anti-Gravity WebGL Physics Overlay (OBS Browser Source) ──────── */}
      <Route
        path="/anti-gravity"
        element={
          <div style={{ width: 1920, height: 1080, background: 'transparent', overflow: 'hidden' }}>
            <AntiGravityPage />
          </div>
        }
      />
      <Route
        path="/overlay"
        element={
          <div className="w-full h-full bg-transparent overflow-hidden flex items-center justify-center">
            <OverlayStage />
          </div>
        }
      />
      <Route
        path="/theme/:themeId"
        element={
          <div className="w-full h-full bg-transparent overflow-hidden flex items-center justify-center">
            <OverlayStage />
          </div>
        }
      />
      <Route
        path="/theme/:themeId/:matchId"
        element={
          <div className="w-full h-full bg-transparent overflow-hidden flex items-center justify-center">
            <OverlayStage />
          </div>
        }
      />
    </Routes>
  );
}

