import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ControlStudio } from './components/control/ControlStudio';
import { OverlayStage } from './components/control/OverlayStage';
import { ThemeLinksPage } from './components/control/ThemeLinksPage';
import { TournamentPage } from './components/control/TournamentPage';
import { TourMatchPage } from './components/control/TourMatchPage';
export default function App() {
    const location = useLocation();
    useEffect(() => {
        const isOverlayRoute = location.pathname.startsWith('/overlay') ||
            location.pathname.startsWith('/theme');
        if (isOverlayRoute) {
            document.body.classList.add('overlay-mode');
            document.documentElement.classList.add('overlay-mode');
            document.body.style.background = 'transparent';
            document.documentElement.style.background = 'transparent';
        }
        else {
            document.body.classList.remove('overlay-mode');
            document.documentElement.classList.remove('overlay-mode');
            document.body.style.background = '#070b15';
            document.documentElement.style.background = '#070b15';
        }
    }, [location.pathname]);
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(ControlStudio, {}) }), _jsx(Route, { path: "/control", element: _jsx(ControlStudio, {}) }), _jsx(Route, { path: "/tournament", element: _jsx(TournamentPage, {}) }), _jsx(Route, { path: "/tournament/:id", element: _jsx(TourMatchPage, {}) }), _jsx(Route, { path: "/theme_links", element: _jsx(ThemeLinksPage, {}) }), _jsx(Route, { path: "/themes", element: _jsx(ThemeLinksPage, {}) }), _jsx(Route, { path: "/overlay", element: _jsx("div", { className: "w-full h-full bg-transparent overflow-hidden flex items-center justify-center", children: _jsx(OverlayStage, {}) }) }), _jsx(Route, { path: "/theme/:themeId", element: _jsx("div", { className: "w-full h-full bg-transparent overflow-hidden flex items-center justify-center", children: _jsx(OverlayStage, {}) }) }), _jsx(Route, { path: "/theme/:themeId/:matchId", element: _jsx("div", { className: "w-full h-full bg-transparent overflow-hidden flex items-center justify-center", children: _jsx(OverlayStage, {}) }) })] }));
}
