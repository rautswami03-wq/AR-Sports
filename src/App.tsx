import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ControlStudio } from './components/control/ControlStudio';
import { OverlayStage } from './components/control/OverlayStage';
import { ThemeLinksPage } from './components/control/ThemeLinksPage';
import { TournamentPage } from './components/control/TournamentPage';
import { TournamentDetailPage } from './components/control/TournamentDetailPage';
import { TourMatchPage } from './components/control/TourMatchPage';

export default function App() {
  const location = useLocation();

  useEffect(() => {
    const href = window.location.href;
    const hash = window.location.hash;
    const isOverlayRoute =
      href.includes('/overlay') ||
      href.includes('/theme/') ||
      hash.includes('/overlay') ||
      hash.includes('/theme/') ||
      location.pathname.startsWith('/overlay') ||
      location.pathname.startsWith('/theme');

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
      <Route path="/" element={<ControlStudio />} />
      <Route path="/control" element={<ControlStudio />} />
      <Route path="/tournament" element={<TournamentPage />} />
      <Route path="/tournament/:id" element={<TournamentDetailPage />} />
      <Route path="/tournament/:tourId/match/:id" element={<TourMatchPage />} />
      <Route path="/match/:id" element={<TourMatchPage />} />
      <Route path="/theme_links" element={<ThemeLinksPage />} />
      <Route path="/themes" element={<ThemeLinksPage />} />
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
