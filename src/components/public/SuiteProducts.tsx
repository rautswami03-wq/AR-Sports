import React from 'react';
import { Link } from 'react-router-dom';
import { Radio, Layers, Sliders, ArrowRight, Check } from 'lucide-react';

export interface CoreProduct {
  name: string;
  desc: string;
  path: string;
  icon: React.ReactNode;
  badge: string;
  color: string;
  features: string[];
}

export const CORE_PRODUCTS_DATA: CoreProduct[] = [
  {
    name: 'Cricket Scoring App',
    desc: 'Ball-by-ball scoring with hotkeys',
    path: '/control',
    icon: <Radio className="w-6 h-6 text-cyan-400" />,
    badge: 'Scorer Studio',
    color: 'from-cyan-500/10 to-blue-600/10 border-cyan-500/30 hover:border-cyan-400',
    features: [
      'Hotkeys (0-6, W, WD, NB, B, LB, Undo)',
      'Real-time striker & bowler tracking',
      'Instant cloud and WebSocket broadcast sync',
      'Match archiving and innings management',
    ],
  },
  {
    name: 'Cricket Score Overlay',
    desc: '50 panels, broadcast themes for OBS',
    path: '/overlay',
    icon: <Layers className="w-6 h-6 text-pink-400" />,
    badge: 'Broadcast Overlay',
    color: 'from-pink-500/10 to-purple-600/10 border-pink-500/30 hover:border-pink-400',
    features: [
      '50 dynamic panels & IPL / Hotstar / Asia Cup themes',
      'Transparent OBS Studio & vMix browser sources',
      'Animated celebration stingers (4, 6, Wicket, Free Hit)',
      'Live Manhattan, Worm & Run Rate comparison charts',
    ],
  },
  {
    name: 'Cricket Web Dashboard',
    desc: 'Tournament + overlay management',
    path: '/tournament',
    icon: <Sliders className="w-6 h-6 text-amber-400" />,
    badge: 'Management Hub',
    color: 'from-amber-500/10 to-orange-600/10 border-amber-500/30 hover:border-amber-400',
    features: [
      'Multi-team tournaments & match scheduling',
      'Points table with auto-calculated NRR',
      'Live overlay switcher & sponsor log management',
      'Full squad, lineup, and player statistics management',
    ],
  },
];

export const SuiteProducts: React.FC = () => {
  return (
    <section className="px-6 max-w-7xl mx-auto mb-20">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-black tracking-widest uppercase mb-4 shadow-lg shadow-cyan-500/5">
          Core Product Suite
        </div>
        <h3 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
          Three Dedicated Cricket Broadcast Solutions
        </h3>
        <p className="text-slate-400 text-sm sm:text-base mt-3 max-w-2xl mx-auto font-medium">
          Engineered for live match scoring, broadcast-grade graphics compositing, and comprehensive tournament management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CORE_PRODUCTS_DATA.map((prod) => (
          <div
            key={prod.name}
            className={`bg-slate-900/90 border rounded-2xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group ${prod.color}`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {prod.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-700 text-slate-300">
                  {prod.badge}
                </span>
              </div>

              <h4 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-cyan-300 transition-colors">
                {prod.name}
              </h4>
              <p className="text-slate-300 text-xs font-semibold mt-2">
                {prod.desc}
              </p>

              <ul className="mt-5 space-y-2 pt-4 border-t border-slate-800/80">
                {prod.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to={prod.path}
              className="mt-6 w-full py-2.5 px-4 bg-slate-950 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 border border-slate-800 hover:border-cyan-400 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <span>Launch Product</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

