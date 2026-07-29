import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ControlStudio } from './components/control/ControlStudio';
import { OverlayStage } from './components/control/OverlayStage';
import { ThemeLinksPage } from './components/control/ThemeLinksPage';
import { TournamentPage } from './components/control/TournamentPage';
import { TourMatchPage } from './components/control/TourMatchPage';

export default function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/overlay') {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.background = 'transparent';
    } else {
      document.body.style.overflowY = 'auto';
      document.documentElement.style.overflowY = 'auto';
      document.body.style.background = '#070b15';
    }
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<ControlStudio />} />
      <Route path="/control" element={<ControlStudio />} />
      <Route path="/tournament" element={<TournamentPage />} />
      <Route path="/tournament/:id" element={<TourMatchPage />} />
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
    </Routes>
  );
}
