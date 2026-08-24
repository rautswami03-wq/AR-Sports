import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Radio,
  Tv,
  Palette,
  Trophy,
  ChevronDown,
  Award,
  Zap,
  Video,
  Layers,
  Globe,
  Sliders,
  Monitor,
  Play
} from 'lucide-react';

const PRODUCTS_DATA = [
  { name: 'Cricket Scoring App', desc: 'Ball-by-ball scoring with all formats.', icon: <Award className="w-4 h-4 text-cyan-400" /> },
  { name: 'CrickPro Lite', desc: 'Casual, offline, local-first scoring + overlay.', icon: <Zap className="w-4 h-4 text-amber-400" /> },
  { name: 'Cricket Streaming App', desc: 'Live stream, replay, and highlights.', icon: <Tv className="w-4 h-4 text-indigo-400" /> },
  { name: 'Cricket Highlight Generator', desc: 'Auto-generate clips, tag players.', icon: <Video className="w-4 h-4 text-purple-400" /> },
  { name: 'Cricket Score Overlay', desc: '50 panels, 17+ broadcast themes.', icon: <Layers className="w-4 h-4 text-pink-400" /> },
  { name: 'Cricket League Website', desc: 'Build a professional league site.', icon: <Globe className="w-4 h-4 text-emerald-400" /> },
  { name: 'Cricket Web Dashboard', desc: 'Tournament + overlay management.', icon: <Sliders className="w-4 h-4 text-cyan-400" /> },
  { name: 'TV Broadcast Solution', desc: 'Television-grade cricket production.', icon: <Monitor className="w-4 h-4 text-red-400" /> },
  { name: 'CrickPro Broadcast', desc: 'Standalone TV-grade cricket production — no OBS.', icon: <Radio className="w-4 h-4 text-sky-400" /> },
  { name: 'CrickPro TV', desc: 'Premium cricket streaming & tournament hosting.', icon: <Play className="w-4 h-4 text-rose-400" /> },
];

export const CricNavbar: React.FC = () => {
  const location = useLocation();
  const [isProductsOpen, setIsProductsOpen] = useState(false);
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
          {/* Products Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsProductsOpen(true)}
            onMouseLeave={() => setIsProductsOpen(false)}
          >
            <button
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                isProductsOpen
                  ? 'bg-slate-800 text-sky-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Products <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isProductsOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProductsOpen && (
              <div className="absolute left-0 mt-1 w-[560px] bg-slate-950/95 border border-slate-800 rounded-xl shadow-2xl p-4 grid grid-cols-2 gap-3 z-50 backdrop-blur-md animate-fade-in">
                {PRODUCTS_DATA.map((prod) => (
                  <div
                    key={prod.name}
                    className="p-2.5 rounded-lg border border-transparent hover:border-slate-800 hover:bg-slate-900/50 transition-all flex items-start gap-3 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-800 shrink-0 group-hover:bg-slate-800 transition-colors">
                      {prod.icon}
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-100 group-hover:text-sky-400 transition-colors uppercase tracking-wider">
                        {prod.name}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 leading-relaxed font-semibold">
                        {prod.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
