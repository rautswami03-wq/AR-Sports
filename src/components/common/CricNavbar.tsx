import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Radio, Tv, Palette, Trophy } from 'lucide-react';

export const CricNavbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && (location.pathname === '/' || location.pathname === '/home')) return true;
    return location.pathname.startsWith(path) && path !== '/';
  };

  return (
    <header className="bg-[#0b1329] border-b border-slate-800 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-2xl sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-3xl font-black tracking-tight text-emerald-400 flex items-center gap-1.5 drop-shadow group">
          <Radio className="w-6 h-6 text-amber-400 animate-pulse group-hover:scale-110 transition-transform" />
          <span>AR Sports</span>
          <span className="text-cyan-400 font-extrabold italic">PRO</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 font-bold text-sm text-slate-300">
          <Link
            to="/"
            className={`flex items-center gap-1.5 transition-all ${
              location.pathname === '/' || location.pathname === '/home'
                ? 'text-cyan-400 border-b-2 border-cyan-400 pb-1 font-extrabold'
                : 'hover:text-cyan-300'
            }`}
          >
            <Home className="w-4 h-4 text-emerald-400" /> Home
          </Link>
          <Link
            to="/tournament"
            className={`flex items-center gap-1.5 transition-all ${
              isActive('/tournament') || isActive('/matches') || isActive('/match')
                ? 'text-cyan-400 border-b-2 border-cyan-400 pb-1 font-extrabold'
                : 'hover:text-cyan-300'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" /> Tournaments & Matches
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



      <div className="flex items-center gap-3">
        <div className="bg-emerald-500/10 border border-emerald-400/40 text-emerald-300 px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          {typeof window !== 'undefined' && window.location.protocol === 'https:'
            ? 'Cloud Sync'
            : 'Local Sync'}
        </div>
      </div>
    </header>
  );
};
