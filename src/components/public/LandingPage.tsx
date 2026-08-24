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
  Activity
} from 'lucide-react';
import { CricNavbar } from '../common/CricNavbar';
import { PRESET_TOURNAMENTS } from '../../theme/presetThemes';
import { THEME_LINKS_DATA } from '../control/ThemeLinksPage';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { OverlayStage } from '../control/OverlayStage';

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
        <section className="px-6 max-w-7xl mx-auto mb-20 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mb-4">
                <Radio className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-white uppercase">Live Streaming</h4>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed font-medium">
                Stream to YouTube, Facebook, and custom RTMP destinations simultaneously. Broadcast to up to 3 platforms at once with ultra-low delay.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400 mb-4">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-white uppercase">Instant Replay</h4>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed font-medium">
                Integrated 60-second instant replay buffer with support for slow motion, ball-event bookmarks, and live DRS review overlays.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-400 mb-4">
                <Video className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-white uppercase">Auto Highlights</h4>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed font-medium">
                Automatically generated match highlights reels filtered dynamically by wickets, sixes, fours, innings, or specific players.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 mb-4">
                <Camera className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-white uppercase">Camera Support</h4>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed font-medium">
                Seamless switching between local cameras, external USB capture cards, manual zoom levels, and live display frame capture.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-400/40 flex items-center justify-center text-red-400 mb-4">
                <Sliders className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-white uppercase">Video Quality</h4>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed font-medium">
                Broadcast-grade hardware encoding scaling from 720p up to 4K UHD resolutions at 30/60fps with adaptive streaming bitrates.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 mb-4">
                <Mic className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-white uppercase">48kHz Audio Capture</h4>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed font-medium">
                Professional stereo capture featuring noise cancellation filters, separate volume sliders, and live VU metering.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mb-4">
                <HardDrive className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-white uppercase">Local Recording</h4>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed font-medium">
                High-definition local MP4 recording with timeline bookmark tracking, segmented files, and pause/resume actions.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400 mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-white uppercase">Overlay Integration</h4>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed font-medium">
                Native overlay compositing engines rendering scoreboard layouts in real-time with automated data APIs.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-400 mb-4">
                <Activity className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-white uppercase">Real-Time Diagnostics</h4>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed font-medium">
                Detailed streaming statistics dashboard displaying connection strength, dropped frames, device logs, and diagnostics.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-white uppercase">100ms Ultra-Low Latency</h4>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed font-medium">
                Redundant synchronization system combining LocalStorage polling and custom window dispatchers for instant scorebug updates.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-400/40 flex items-center justify-center text-red-400 mb-4">
                <Cloud className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-white uppercase">Firebase Cloud Sync</h4>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed font-medium">
                Score matches from any smartphone while your overlay runs remotely anywhere in the world via cloud databases.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-white uppercase">100% Unlocked PRO Edition</h4>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed font-medium">
                No subscription plans, watermark overlays, or limitations. Complete access to all presets, templates, and links.
              </p>
            </div>
          </div>
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
      <footer className="border-t border-slate-800 py-10 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-black text-slate-300">
            <Radio className="w-4 h-4 text-cyan-400" /> CricScorer PRO &bull; AR Sports Broadcast System
          </div>
          <div>
            Built with React, Vite, Framer Motion & Tailwind &bull; 100% Unlocked PRO Version
          </div>
        </div>
      </footer>
    </div>
  );
};
