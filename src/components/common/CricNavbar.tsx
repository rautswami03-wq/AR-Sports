import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HardDrive, ShieldCheck, Tv, Radio, Palette, Trophy, Home, Sliders } from 'lucide-react';

export const CricNavbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    return location.pathname.startsWith(path) && path !== '/';
  };

  return (
    <header className="bg-[#0b1329] border-b border-slate-800 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-2xl sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-3xl font-black tracking-tight text-emerald-400 flex items-center gap-1.5 drop-shadow group">
          <Radio className="w-6 h-6 text-amber-400 animate-pulse group-hover:scale-110 transition-transform" />
          <span>CricScorer</span>
          <span className="text-cyan-400 font-extrabold italic">PRO</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 font-bold text-sm text-slate-300">
          <Link
            to="/"
            className={`flex items-center gap-1.5 transition-all ${
              isActive('/') ? 'text-cyan-400 border-b-2 border-cyan-400 pb-1 font-extrabold' : 'hover:text-cyan-300'
            }`}
          >
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link
            to="/control"
            className={`flex items-center gap-1.5 transition-all ${
              location.pathname === '/control' ? 'text-cyan-400 border-b-2 border-cyan-400 pb-1 font-extrabold' : 'hover:text-cyan-300'
            }`}
          >
            <Sliders className="w-4 h-4 text-emerald-400" /> Control Studio
          </Link>
          <Link
            to="/tournament"
            className={`flex items-center gap-1.5 transition-all ${
              isActive('/tournament') ? 'text-cyan-400 border-b-2 border-cyan-400 pb-1 font-extrabold' : 'hover:text-cyan-300'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" /> Tournament
          </Link>
          <Link
            to="/theme_links"
            className={`flex items-center gap-1.5 transition-all ${
              isActive('/theme_links') ? 'text-cyan-400 border-b-2 border-cyan-400 pb-1 font-extrabold' : 'hover:text-cyan-300'
            }`}
          >
            <Palette className="w-4 h-4 text-purple-400" /> Scoreboard Links
          </Link>
          <Link
            to="/overlay"
            target="_blank"
            className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 transition-all"
          >
            <Tv className="w-4 h-4" /> OBS View ↗
          </Link>
        </nav>
      </div>

      {/* Account Expiry & Storage Badges */}
      <div className="flex items-center gap-3">
        <div className="bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 px-3 py-1.5 rounded-md text-xs font-mono font-bold flex items-center gap-1.5">
          <HardDrive className="w-4 h-4 text-cyan-400" /> Storage: 1206/10000 kb
        </div>
        <div className="bg-emerald-500/10 border border-emerald-400/40 text-emerald-300 px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Account Expiry Date : 4/13/2026, 10:44:04 PM
        </div>
      </div>
    </header>
  );
};
