import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Radio,
  Tv,
  Palette,
  Check,
  Copy,
  Zap,
  Flame,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Play,
  Cloud,
  Sliders,
  Video,
  RotateCcw,
  Camera,
  Mic,
  HardDrive,
  Activity,
  Globe,
  Settings,
  Users,
  Mail,
  FileCheck,
  MapPin,
  FolderOpen
} from 'lucide-react';
import { CricNavbar } from '../common/CricNavbar';
import { PRESET_TOURNAMENTS } from '../../theme/presetThemes';
import { THEME_LINKS_DATA } from '../control/ThemeLinksPage';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { OverlayStage } from '../control/OverlayStage';
import { FEATURE_CATEGORIES_DATA } from './landingFeaturesData';

const COLOR_STYLES: Record<string, {
  bg: string;
  border: string;
  iconBg: string;
  badge: string;
  bulletCheck: string;
  glow: string;
}> = {
  cyan: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    iconBg: 'bg-cyan-500/20 border-cyan-400/40 text-cyan-400',
    badge: 'text-cyan-300 bg-cyan-950/70 border-cyan-800/60',
    bulletCheck: 'text-cyan-400',
    glow: 'hover:border-cyan-500/40 hover:shadow-cyan-500/10'
  },
  indigo: {
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/30',
    iconBg: 'bg-indigo-500/20 border-indigo-400/40 text-indigo-400',
    badge: 'text-indigo-300 bg-indigo-950/70 border-indigo-800/60',
    bulletCheck: 'text-indigo-400',
    glow: 'hover:border-indigo-500/40 hover:shadow-indigo-500/10'
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    iconBg: 'bg-purple-500/20 border-purple-400/40 text-purple-400',
    badge: 'text-purple-300 bg-purple-950/70 border-purple-800/60',
    bulletCheck: 'text-purple-400',
    glow: 'hover:border-purple-500/40 hover:shadow-purple-500/10'
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    iconBg: 'bg-amber-500/20 border-amber-400/40 text-amber-400',
    badge: 'text-amber-300 bg-amber-950/70 border-amber-800/60',
    bulletCheck: 'text-amber-400',
    glow: 'hover:border-amber-500/40 hover:shadow-amber-500/10'
  },
  red: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    iconBg: 'bg-red-500/20 border-red-400/40 text-red-400',
    badge: 'text-red-300 bg-red-950/70 border-red-800/60',
    bulletCheck: 'text-red-400',
    glow: 'hover:border-red-500/40 hover:shadow-red-500/10'
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    iconBg: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-400',
    badge: 'text-emerald-300 bg-emerald-950/70 border-emerald-800/60',
    bulletCheck: 'text-emerald-400',
    glow: 'hover:border-emerald-500/40 hover:shadow-emerald-500/10'
  }
};

const renderFeatureIcon = (iconName: string) => {
  switch (iconName) {
    case 'Radio': return <Radio className="w-5 h-5" />;
    case 'RotateCcw': return <RotateCcw className="w-5 h-5" />;
    case 'Video': return <Video className="w-5 h-5" />;
    case 'Camera': return <Camera className="w-5 h-5" />;
    case 'Zap': return <Zap className="w-5 h-5" />;
    case 'Mic': return <Mic className="w-5 h-5" />;
    case 'HardDrive': return <HardDrive className="w-5 h-5" />;
    case 'Layers': return <Layers className="w-5 h-5" />;
    case 'Activity': return <Activity className="w-5 h-5" />;
    case 'Palette': return <Palette className="w-5 h-5" />;
    case 'Globe': return <Globe className="w-5 h-5" />;
    case 'Tv': return <Tv className="w-5 h-5" />;
    case 'Users': return <Users className="w-5 h-5" />;
    case 'Sliders': return <Sliders className="w-5 h-5" />;
    case 'Sparkles': return <Sparkles className="w-5 h-5" />;
    case 'Cloud': return <Cloud className="w-5 h-5" />;
    case 'FileCheck': return <FileCheck className="w-5 h-5" />;
    case 'Settings': return <Settings className="w-5 h-5" />;
    case 'Mail': return <Mail className="w-5 h-5" />;
    case 'Shield': return <Shield className="w-5 h-5" />;
    case 'MapPin': return <MapPin className="w-5 h-5" />;
    case 'FolderOpen': return <FolderOpen className="w-5 h-5" />;
    case 'Check': return <Check className="w-5 h-5" />;
    default: return <Layers className="w-5 h-5" />;
  }
};

export const LandingPage: React.FC = () => {
  const { tournamentId, setTournamentId } = useBroadcastStore();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'themes' | 'features' | 'obs_setup'>('themes');

  const handleCopy = (path: string, key: string) => {
    const baseUrl = window.location.href.split('#')[0].replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const fullUrl = `${baseUrl}/${cleanPath}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070b15] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Navbar */}
      <CricNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-6 max-w-7xl mx-auto text-center">

        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-purple-600/20 blur-[120px] pointer-events-none rounded-full" />


        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-indigo-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-black uppercase px-4 py-1.5 rounded-full mb-6 shadow-lg shadow-cyan-500/10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <Radio className="w-3.5 h-3.5 text-amber-400" />
          LIVE OVERLAY ENGINE
        </div>


        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Live Cricket Broadcast <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-400 bg-clip-text text-transparent">
            Overlays & Scoring Studio
          </span>
        </h1>


        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
          Real-time score overlays for OBS Studio and YouTube Live. Customizable themes, DRS decisions, scorecards, and cloud sync across devices.
        </p>


        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/tournament"
            className="group relative inline-flex items-center gap-2.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black px-8 py-3.5 rounded-xl shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all text-base uppercase tracking-wider overflow-hidden"
          >
            <Sliders className="w-5 h-5 group-hover:rotate-45 transition-transform" />
            <span>Tournaments & Matches</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/control"
            className="inline-flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 font-bold px-7 py-3.5 rounded-xl shadow-lg transition-all text-base uppercase tracking-wider"
          >
            <Radio className="w-5 h-5 text-amber-400" />
            <span>Control Active Match</span>
          </Link>

          <Link
            to="/overlay"
            target="_blank"
            className="inline-flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-sky-300 border border-sky-500/30 font-bold px-7 py-3.5 rounded-xl shadow-lg transition-all text-base uppercase tracking-wider"
          >
            <Tv className="w-5 h-5 text-sky-400" />
            <span>Live OBS Stage ↗</span>
          </Link>
        </div>



        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-slate-400 text-xs font-bold uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> 100ms Ultra-Low Latency
          </div>
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-cyan-400" /> Firebase Cloud Firestore Sync
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-400" /> 19 Tournament Presets
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" /> 100% Unlocked PRO
          </div>
        </div>
      </section>


      {/* Navigation Tabs (Themes / Features / OBS Guide) */}
      <section id="themes-gallery" className="px-6 max-w-7xl mx-auto mb-16">
        <div className="flex justify-center border-b border-slate-800">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('themes')}
              className={`flex items-center gap-2 px-6 py-3.5 text-sm font-black uppercase tracking-wider border-b-2 transition-all ${
                activeTab === 'themes'
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Palette className="w-4 h-4" /> 19 Tournament Themes ({THEME_LINKS_DATA.length})
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`flex items-center gap-2 px-6 py-3.5 text-sm font-black uppercase tracking-wider border-b-2 transition-all ${
                activeTab === 'features'
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" /> Feature Highlights
            </button>
            <button
              onClick={() => setActiveTab('obs_setup')}
              className={`flex items-center gap-2 px-6 py-3.5 text-sm font-black uppercase tracking-wider border-b-2 transition-all ${
                activeTab === 'obs_setup'
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Tv className="w-4 h-4" /> OBS & vMix Setup Guide
            </button>
          </div>
        </div>
      </section>

      {/* Tab 1: 19 Tournament Theme Presets Gallery */}
      {activeTab === 'themes' && (
        <section className="px-6 max-w-7xl mx-auto mb-20">
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Preset Tournament Themes
            </h3>
            <p className="text-slate-400 text-sm mt-2 font-medium">
              Copy any scoreboard link directly into OBS Studio, vMix, or PRISM Live Studio.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {THEME_LINKS_DATA.map((item) => {
              const themeIdKey = item.server1Url.split('theme=')[1]?.split('&')[0] || item.id;
              const preset = PRESET_TOURNAMENTS[themeIdKey];
              const gradientBg = preset?.headerGradient || 'linear-gradient(90deg, #1e3a8a 0%, #3b82f6 100%)';

              return (
                <div
                  key={item.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-cyan-400/50 rounded-2xl p-5 shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    {/* Header Color Swatch Banner */}
                    <div
                      className="h-16 rounded-xl mb-4 p-3 flex items-center justify-between shadow-inner relative overflow-hidden"
                      style={{ background: gradientBg }}
                    >
                      <span className="text-xs font-black text-white drop-shadow uppercase tracking-wider bg-black/40 px-2.5 py-1 rounded-md border border-white/20">
                        {item.name}
                      </span>
                      {item.badge && (
                        <span className="bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded shadow">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-4 px-1">
                      <span>Server 1 (OBS Standard)</span>
                      <span className="text-emerald-400">100ms Sync</span>
                    </div>
                  </div>

                  {/* Copy Link Buttons */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => handleCopy(item.server1Url, `${item.id}-s1`)}
                      className="w-full flex items-center justify-between bg-slate-800/90 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 font-bold px-3 py-2 rounded-lg text-xs transition-all border border-slate-700/80 hover:border-cyan-400"
                    >
                      <span className="flex items-center gap-1.5">
                        <Copy className="w-3.5 h-3.5" /> Copy OBS Link
                      </span>
                      {copiedKey === `${item.id}-s1` ? (
                        <span className="text-emerald-400 font-black flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Copied!
                        </span>
                      ) : (
                        <span className="text-slate-400 hover:text-slate-950 font-mono text-[10px]">
                          ?theme={themeIdKey}
                        </span>
                      )}
                    </button>

                    <Link
                      to={`/overlay?theme=${themeIdKey}`}
                      target="_blank"
                      className="w-full flex items-center justify-center gap-1.5 bg-slate-800/50 hover:bg-slate-700/80 text-sky-300 font-bold py-1.5 rounded-lg text-xs transition-all border border-slate-700/50"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Preview Overlay
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Tab 2: Feature Highlights */}
      {activeTab === 'features' && (
        <section className="px-6 max-w-7xl mx-auto mb-24 animate-fade-in space-y-20">
          {/* Header intro */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-black tracking-widest uppercase mb-4 shadow-lg shadow-cyan-500/5">
              <Zap className="w-3.5 h-3.5" /> Full Platform Capabilities & Architecture
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase">
              Deeply Engineered For Live Cricket
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-4 leading-relaxed font-medium">
              Every feature is built from the ground up for high-stakes cricket broadcasting. From millisecond-accurate graphic automation and 50+ live overlay panels to self-updating tournament portals and multi-tenant league websites.
            </p>
          </div>

          {FEATURE_CATEGORIES_DATA.map((cat) => (
            <div key={cat.id} className="space-y-8">
              {/* Category Header */}
              <div className={`border-b ${cat.borderColor} pb-5`}>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <h3 className={`text-xl sm:text-2xl font-black uppercase tracking-wider flex items-center gap-2.5 ${cat.headerColor}`}>
                    {cat.title}
                  </h3>
                  <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300">
                    {cat.features.length} Modules
                  </span>
                </div>
                <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
                  {cat.description}
                </p>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cat.features.map((feat) => {
                  const style = COLOR_STYLES[feat.color] || COLOR_STYLES.cyan;
                  return (
                    <div
                      key={feat.id}
                      className={`bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl transition-all duration-300 ${style.glow} flex flex-col justify-between group hover:border-slate-700/80`}
                    >
                      <div>
                        {/* Top row: Icon & Badge */}
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-md ${style.iconBg}`}>
                            {renderFeatureIcon(feat.icon)}
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${style.badge}`}>
                            {feat.badge}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-cyan-300 transition-colors">
                          {feat.title}
                        </h4>

                        {/* In-depth Description */}
                        <p className="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed font-normal">
                          {feat.description}
                        </p>
                      </div>

                      {/* Capabilities Bullets */}
                      <div className="mt-5 pt-4 border-t border-slate-800/80">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-cyan-400" />
                          Key Capabilities:
                        </div>
                        <ul className="space-y-2">
                          {feat.bullets.map((b, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-slate-300/90 leading-snug">
                              <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${style.bulletCheck}`} />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Tab 3: OBS & vMix Setup Guide */}
      {activeTab === 'obs_setup' && (
        <section className="px-6 max-w-5xl mx-auto mb-20">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-black text-white uppercase mb-6 flex items-center gap-2">
              <Tv className="w-6 h-6 text-cyan-400" /> How to Add Scoreboard Links to Streaming Software
            </h3>

            <div className="space-y-6 text-sm text-slate-300">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700">
                <div className="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 font-black flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <h5 className="font-bold text-white uppercase">Copy Overlay URL</h5>
                  <p className="text-slate-400 mt-1">
                    Select your preferred theme from the 19 presets above and click <strong>Copy OBS Link</strong> (e.g., <code className="text-cyan-300">http://localhost:5173/#/overlay?theme=ipl25</code>).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700">
                <div className="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 font-black flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <h5 className="font-bold text-white uppercase">Add Browser Source in OBS Studio</h5>
                  <p className="text-slate-400 mt-1">
                    In OBS Studio, click the <strong>+</strong> button under <em>Sources</em> $\rightarrow$ Select <strong>Browser</strong> $\rightarrow$ Name it <em>CricScorer Overlay</em>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700">
                <div className="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 font-black flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <h5 className="font-bold text-white uppercase">Set Resolution to 1920 x 1080</h5>
                  <p className="text-slate-400 mt-1">
                    Paste the copied link into the <strong>URL</strong> field. Set <strong>Width</strong> to <code className="text-cyan-300">1920</code> and <strong>Height</strong> to <code className="text-cyan-300">1080</code>. Click <strong>OK</strong>.
                  </p>
                </div>
              </div>
            </div>


          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 backdrop-blur-md py-16 px-6 text-slate-400 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
          {/* Col 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-black text-slate-100 uppercase tracking-wider text-base">
              <Radio className="w-5 h-5 text-cyan-400" /> AR Sports Broadcast System
            </div>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              Television-grade broadcast overlays and tournament management dashboard. 100% unlocked, ultra-low latency, and fully compatible with OBS Studio, vMix, and PRISM Live.
            </p>
          </div>

          {/* Col 2: Products List */}
          <div>
            <h5 className="font-black text-slate-100 uppercase tracking-widest text-sm mb-4 border-b border-slate-800 pb-1.5">
              AR Sports Suite Products
            </h5>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs font-bold">
              {[
                { name: 'Cricket Scoring App', desc: 'Ball-by-ball scoring with all formats.' },
                { name: 'AR Sports Lite', desc: 'Casual, offline, local-first scoring + overlay.' },
                { name: 'Cricket Streaming App', desc: 'Live stream, replay, and highlights.' },
                { name: 'Cricket Highlight Generator', desc: 'Auto-generate clips, tag players.' },
                { name: 'Cricket Score Overlay', desc: '50 panels, 17+ broadcast themes.' },
                { name: 'Cricket League Website', desc: 'Build a professional league site.' },
                { name: 'Cricket Web Dashboard', desc: 'Tournament + overlay management.' },
                { name: 'TV Broadcast Solution', desc: 'Television-grade cricket production.' },
                { name: 'AR Sports Broadcast', desc: 'Standalone TV-grade cricket production — no OBS.' },
                { name: 'AR Sports TV', desc: 'Premium cricket streaming & tournament hosting.' }
              ].map((prod) => (
                <li key={prod.name} className="group">
                  <span className="text-slate-300 group-hover:text-cyan-400 transition-colors block font-black">
                    {prod.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium block">
                    {prod.desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Platform */}
          <div className="space-y-4">
            <h5 className="font-black text-slate-100 uppercase tracking-widest text-sm mb-4 border-b border-slate-800 pb-1.5">
              Platform & Tech Stack
            </h5>
            <p className="text-slate-400 text-xs leading-relaxed font-semibold">
              Engineered with React, Vite, Framer Motion, and Tailwind CSS. Integrated real-time synchronization pipelines over WebSockets and LocalStorage.
            </p>
            <div className="bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-xl text-[10px] font-bold text-slate-400">
              ⚡ Compatible with OBS Studio, vMix, Wirecast, PRISM Live Studio, and Blackmagic Design hardware.
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-900 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-500">
          <span>&copy; 2026 AR Sports. All rights reserved.</span>
          <span>100% Unlocked Enterprise Edition</span>
        </div>
      </footer>
    </div>
  );
};
