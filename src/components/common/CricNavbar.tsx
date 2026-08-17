import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Radio, Tv, Palette, Trophy } from 'lucide-react';

export const CricNavbar: React.FC = () => {
  const location = useLocation();
  const isCloud = typeof window !== 'undefined' && window.location.protocol === 'https:';

  return (
    <header className="px-6 h-16 bg-[#090d16] border-b border-slate-800 flex items-center justify-between sticky top-0 z-50">
      {/* Left: Logo + Nav */}
      <div className="flex items-center gap-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-slate-950 font-black shadow-md">
            <Radio className="w-4 h-4 text-slate-950" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-lg tracking-tight text-slate-100 uppercase">
              AR Sports
            </span>
            <span className="text-xs font-black px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30 uppercase tracking-widest">
              PRO STUDIO
            </span>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-2">
          {[
            { to: '/', label: 'Home', icon: <Home className="w-4 h-4" />, match: (p: string) => p === '/' || p === '/home' },
            {
              to: '/tournament',
              label: 'Tournaments',
              icon: <Trophy className="w-4 h-4" />,
              match: (p: string) => p.startsWith('/tournament') || p.startsWith('/match'),
            },
            {
              to: '/theme_links',
              label: 'Overlay Links',
              icon: <Palette className="w-4 h-4" />,
              match: (p: string) => p.startsWith('/theme_links'),
            },
          ].map(({ to, label, icon, match }) => {
            const active = match(location.pathname);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                  active
                    ? 'bg-slate-800 text-sky-400 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {icon} {label}
              </Link>
            );
          })}

          {/* OBS View */}
          <a
            href="#/overlay"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-slate-300 hover:bg-slate-800/60 transition-colors border border-slate-800"
          >
            <Tv className="w-4 h-4 text-sky-400" /> OBS Live Stage ↗
          </a>
        </nav>
      </div>

      {/* Right: Sync Status */}
      <div className="flex items-center gap-3">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold border ${
            isCloud
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isCloud ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-pulse'
            }`}
          />
          {isCloud ? 'Cloud Live Sync' : 'Local Standalone Sync'}
        </div>
      </div>
    </header>
  );
};
