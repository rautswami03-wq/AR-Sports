import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Radio, Tv, Palette, Trophy, Wifi, WifiOff } from 'lucide-react';

export const CricNavbar: React.FC = () => {
  const location = useLocation();
  const isCloud = typeof window !== 'undefined' && window.location.protocol === 'https:';

  const isActive = (path: string) => {
    if (path === '/' && (location.pathname === '/' || location.pathname === '/home')) return true;
    return location.pathname.startsWith(path) && path !== '/';
  };

  return (
    <header
      style={{
        background: 'linear-gradient(180deg, rgba(7,12,22,0.98) 0%, rgba(7,12,22,0.95) 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 4px 40px rgba(0,0,0,0.6)',
      }}
      className="px-5 py-0 flex items-center justify-between gap-4 sticky top-0 z-50 h-14"
    >
      {/* Left: Logo + Nav */}
      <div className="flex items-center gap-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
              borderRadius: '8px',
              padding: '5px',
              boxShadow: '0 0 16px rgba(6,182,212,0.4)',
            }}
            className="flex items-center justify-center"
          >
            <Radio className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-baseline gap-1">
            <span
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 700,
                fontSize: '20px',
                letterSpacing: '-0.01em',
                color: '#f1f5f9',
              }}
            >
              AR Sports
            </span>
            <span
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 700,
                fontSize: '13px',
                background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.08em',
              }}
            >
              PRO
            </span>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { to: '/', label: 'Home', icon: <Home className="w-3.5 h-3.5" />, match: (p: string) => p === '/' || p === '/home' },
            {
              to: '/tournament',
              label: 'Tournaments',
              icon: <Trophy className="w-3.5 h-3.5" />,
              match: (p: string) => p.startsWith('/tournament') || p.startsWith('/match'),
            },
            {
              to: '/theme_links',
              label: 'Overlay Links',
              icon: <Palette className="w-3.5 h-3.5" />,
              match: (p: string) => p.startsWith('/theme_links'),
            },
          ].map(({ to, label, icon, match }) => {
            const active = match(location.pathname);
            return (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-150"
                style={{
                  color: active ? '#06b6d4' : '#94a3b8',
                  background: active ? 'rgba(6,182,212,0.1)' : 'transparent',
                  border: `1px solid ${active ? 'rgba(6,182,212,0.25)' : 'transparent'}`,
                  letterSpacing: '0.02em',
                }}
              >
                {icon} {label}
              </Link>
            );
          })}

          {/* OBS View — external */}
          <a
            href="#/overlay"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-150"
            style={{
              color: '#818cf8',
              border: '1px solid transparent',
            }}
          >
            <Tv className="w-3.5 h-3.5" /> OBS View ↗
          </a>
        </nav>
      </div>

      {/* Right: Status pill */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{
            background: isCloud ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)',
            border: `1px solid ${isCloud ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}`,
            color: isCloud ? '#34d399' : '#fbbf24',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: isCloud ? '#10b981' : '#f59e0b',
              boxShadow: isCloud ? '0 0 6px #10b981' : '0 0 6px #f59e0b',
              animation: 'live-pulse 2s ease-in-out infinite',
            }}
          />
          {isCloud ? 'Cloud Sync' : 'Local Sync'}
        </div>
      </div>
    </header>
  );
};
