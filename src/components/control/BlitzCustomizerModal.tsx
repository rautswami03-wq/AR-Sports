import React, { useState, useCallback } from 'react';
import { X, Zap, Palette, Type, Layout, Layers, CheckCircle } from 'lucide-react';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import {
  BlitzCustomSettings,
  BlitzFont,
  BatterDisplayStyle,
  BlitzBorderStyle,
  BlitzTexture,
  DEFAULT_BLITZ_SETTINGS,
  autoContrastColor,
  getFontUrl,
  getTextureCss,
  getBorderRadius,
} from '../../types/blitzSettings';

interface BlitzCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FONTS: BlitzFont[] = [
  'Roboto Condensed', 'Inter', 'Oswald', 'Montserrat', 'Bebas Neue', 'Arial'
];

const TEXTURES: { id: BlitzTexture; label: string }[] = [
  { id: 'none',    label: 'None' },
  { id: 'carbon',  label: 'Carbon' },
  { id: 'grid',    label: 'Grid' },
  { id: 'dots',    label: 'Dots' },
  { id: 'circuit', label: 'Circuit' },
  { id: 'noise',   label: 'Noise' },
];

const BATTER_STYLES: { id: BatterDisplayStyle; label: string; icon: string }[] = [
  { id: 'round-filled',   label: 'Round · Filled',   icon: '⬤' },
  { id: 'round-outlined', label: 'Round · Outlined',  icon: '○' },
  { id: 'square-filled',  label: 'Square · Filled',   icon: '■' },
  { id: 'square-outlined',label: 'Square · Outlined', icon: '□' },
];

const BORDER_STYLES: { id: BlitzBorderStyle; label: string }[] = [
  { id: 'sharp', label: 'Sharp (0px)' },
  { id: 'soft',  label: 'Soft (6px)' },
  { id: 'pill',  label: 'Pill (14px)' },
  { id: 'none',  label: 'None' },
];

// Inject Google Font <link> if not already present
function injectFont(url: string) {
  if (!url) return;
  if (document.querySelector(`link[href="${url}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
}

// Apply Blitz CSS custom properties to document root
function applyBlitzVars(s: BlitzCustomSettings) {
  const resolvedTeamAText = s.autoContrast ? autoContrastColor(s.teamABg) : s.teamAText;
  const resolvedTeamBText = s.autoContrast ? autoContrastColor(s.teamBBg) : s.teamBText;
  const radius = getBorderRadius(s.borderStyle);
  const fontUrl = getFontUrl(s.fontFamily);
  if (fontUrl) injectFont(fontUrl);
  const el = document.documentElement;
  el.style.setProperty('--blitz-stripe',       s.stripeColor);
  el.style.setProperty('--blitz-team-a-bg',    s.teamABg);
  el.style.setProperty('--blitz-team-a-text',  resolvedTeamAText);
  el.style.setProperty('--blitz-team-b-bg',    s.teamBBg);
  el.style.setProperty('--blitz-team-b-text',  resolvedTeamBText);
  el.style.setProperty('--blitz-font',         `'${s.fontFamily}', sans-serif`);
  el.style.setProperty('--blitz-radius',       radius);
  el.style.setProperty('--blitz-texture',      getTextureCss(s.textureOverlay));
  // Also override core scoreboard vars so ALL overlays pick up Blitz colors
  el.style.setProperty('--sb-bg-primary',      s.teamABg);
  el.style.setProperty('--sb-bg-secondary',    s.teamBBg);
  el.style.setProperty('--sb-bg-accent',       s.stripeColor);
  el.style.setProperty('--sb-text-primary',    resolvedTeamAText);
  el.style.setProperty('--sb-text-secondary',  resolvedTeamBText);
  el.style.setProperty('--sb-text-accent',     s.stripeColor);
  el.style.setProperty('--sb-text-muted',      `${s.stripeColor}aa`);
  el.style.setProperty('--sb-accent-primary',  s.stripeColor);
  el.style.setProperty('--sb-border-color',    `${s.stripeColor}55`);
  el.style.setProperty('--sb-glow-color',      `${s.stripeColor}88`);
  el.style.setProperty('--sb-font-primary',    `'${s.fontFamily}', sans-serif`);
  el.style.setProperty('--sb-border-radius',   radius);
  // Ball dot highlights
  el.style.setProperty('--sb-ball-dot-4',      s.stripeColor);
  el.style.setProperty('--sb-flash-four',      s.stripeColor);
}

export const BlitzCustomizerModal: React.FC<BlitzCustomizerModalProps> = ({ isOpen, onClose }) => {
  const { blitzSettings, updateBlitzSettings } = useBroadcastStore();
  const [local, setLocal] = useState<BlitzCustomSettings>(blitzSettings || DEFAULT_BLITZ_SETTINGS);
  const [applied, setApplied] = useState(false);

  const patch = useCallback(<K extends keyof BlitzCustomSettings>(key: K, val: BlitzCustomSettings[K]) => {
    setLocal(prev => ({ ...prev, [key]: val }));
    setApplied(false);
  }, []);

  const handleApply = () => {
    updateBlitzSettings(local);
    applyBlitzVars(local);
    setApplied(true);
    setTimeout(() => setApplied(false), 1800);
  };

  const handleReset = () => {
    setLocal(DEFAULT_BLITZ_SETTINGS);
    updateBlitzSettings(DEFAULT_BLITZ_SETTINGS);
    applyBlitzVars(DEFAULT_BLITZ_SETTINGS);
    setApplied(false);
  };

  if (!isOpen) return null;

  const resolvedTextA = local.autoContrast ? autoContrastColor(local.teamABg) : local.teamAText;
  const resolvedTextB = local.autoContrast ? autoContrastColor(local.teamBBg) : local.teamBText;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-[#0b0f19] border border-[#ff007f]/30 rounded-2xl w-full max-w-3xl shadow-[0_0_60px_rgba(255,0,127,0.15)] max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-[#0b0f19] z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#ff007f] flex items-center justify-center shadow-[0_0_16px_#ff007f]">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-widest">Blitz Customizer</h2>
              <p className="text-[10px] text-[#00f3ff] font-bold uppercase opacity-70">Broadcast Theme · Live Preview</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* ── 5-COLOR SLOTS ── */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Palette className="w-4 h-4 text-[#ff007f]" />
              <span className="text-xs font-black text-white uppercase tracking-widest">Color Slots</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              {/* Stripe */}
              <ColorSlot
                label="Stripe / Accent"
                value={local.stripeColor}
                onChange={v => patch('stripeColor', v)}
                preview={<div className="w-full h-2 rounded" style={{ background: local.stripeColor, boxShadow: `0 0 8px ${local.stripeColor}` }} />}
              />

              {/* Team A */}
              <ColorSlot
                label="Team A · Background"
                value={local.teamABg}
                onChange={v => patch('teamABg', v)}
                preview={
                  <div className="w-full h-6 rounded flex items-center justify-center text-[9px] font-black"
                    style={{ background: local.teamABg, color: resolvedTextA }}>
                    TEAM A
                  </div>
                }
              />
              {!local.autoContrast && (
                <ColorSlot
                  label="Team A · Text"
                  value={local.teamAText}
                  onChange={v => patch('teamAText', v)}
                  preview={
                    <span className="font-black text-sm" style={{ color: local.teamAText }}>Aa</span>
                  }
                />
              )}

              {/* Team B */}
              <ColorSlot
                label="Team B · Background"
                value={local.teamBBg}
                onChange={v => patch('teamBBg', v)}
                preview={
                  <div className="w-full h-6 rounded flex items-center justify-center text-[9px] font-black"
                    style={{ background: local.teamBBg, color: resolvedTextB }}>
                    TEAM B
                  </div>
                }
              />
              {!local.autoContrast && (
                <ColorSlot
                  label="Team B · Text"
                  value={local.teamBText}
                  onChange={v => patch('teamBText', v)}
                  preview={
                    <span className="font-black text-sm" style={{ color: local.teamBText }}>Aa</span>
                  }
                />
              )}
            </div>

            {/* Auto-contrast toggle */}
            <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
              <div
                onClick={() => patch('autoContrast', !local.autoContrast)}
                className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${local.autoContrast ? 'bg-[#ff007f]' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${local.autoContrast ? 'left-5' : 'left-0.5'}`} />
              </div>
              <span className="text-xs font-bold text-slate-300 uppercase">Auto-contrast text colors</span>
            </label>
          </section>

          {/* ── FONTS ── */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Type className="w-4 h-4 text-[#00f3ff]" />
              <span className="text-xs font-black text-white uppercase tracking-widest">Digit &amp; Text Font</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FONTS.map(font => (
                <button
                  key={font}
                  onClick={() => patch('fontFamily', font)}
                  className={`py-2.5 px-3 rounded-lg border text-sm font-bold text-left transition-all ${
                    local.fontFamily === font
                      ? 'bg-[#ff007f] border-[#ff007f] text-white shadow-[0_0_12px_#ff007f]'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:border-[#ff007f]/40 hover:text-white'
                  }`}
                  style={{ fontFamily: `'${font}', sans-serif` }}
                >
                  {font}
                  <span className="block text-[9px] opacity-60 mt-0.5">0123 ABCDef</span>
                </button>
              ))}
            </div>
          </section>

          {/* ── BATTER DISPLAY STYLE ── */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Layout className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-black text-white uppercase tracking-widest">Batter Display Style</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {BATTER_STYLES.map(bs => (
                <button
                  key={bs.id}
                  onClick={() => patch('batterDisplayStyle', bs.id)}
                  className={`py-3 px-2 rounded-lg border flex flex-col items-center gap-1.5 transition-all ${
                    local.batterDisplayStyle === bs.id
                      ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-[0_0_10px_rgba(251,191,36,0.4)]'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-amber-400/40 hover:text-white'
                  }`}
                >
                  <span className="text-xl leading-none">{bs.icon}</span>
                  <span className="text-[9px] font-black uppercase">{bs.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* ── PANEL BORDER STYLE ── */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Layout className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-black text-white uppercase tracking-widest">Panel Border Style</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {BORDER_STYLES.map(bs => (
                <button
                  key={bs.id}
                  onClick={() => patch('borderStyle', bs.id)}
                  className={`py-2.5 px-3 rounded-lg border text-xs font-black uppercase transition-all ${
                    local.borderStyle === bs.id
                      ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-cyan-400/40 hover:text-white'
                  }`}
                  style={{ borderRadius: getBorderRadius(bs.id) }}
                >
                  {bs.label}
                </button>
              ))}
            </div>
          </section>

          {/* ── TEXTURE OVERLAY ── */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Layers className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-black text-white uppercase tracking-widest">Texture Overlay</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {TEXTURES.map(tx => (
                <button
                  key={tx.id}
                  onClick={() => patch('textureOverlay', tx.id)}
                  className={`py-3 rounded-lg border text-[9px] font-black uppercase transition-all relative overflow-hidden ${
                    local.textureOverlay === tx.id
                      ? 'border-purple-500 text-purple-300'
                      : 'border-white/10 text-slate-500 hover:border-purple-400/40 hover:text-slate-300'
                  }`}
                  style={{
                    background: tx.id === 'none' ? '#0b0f19' : '#0b0f19',
                    backgroundImage: tx.id !== 'none' ? getTextureCss(tx.id) : 'none',
                    backgroundSize: '8px 8px',
                  }}
                >
                  {tx.label}
                  {local.textureOverlay === tx.id && (
                    <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-purple-500" />
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* ── LIVE PREVIEW STRIP ── */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-[#ff007f]" />
              <span className="text-xs font-black text-white uppercase tracking-widest">Live Preview</span>
            </div>
            <div
              className="rounded overflow-hidden border border-white/10 relative"
              style={{ fontFamily: `'${local.fontFamily}', sans-serif`, backgroundImage: getTextureCss(local.textureOverlay), backgroundSize: '8px 8px' }}
            >
              {/* Stripe */}
              <div className="h-1 w-full" style={{ background: local.stripeColor, boxShadow: `0 0 12px ${local.stripeColor}` }} />
              {/* Score strip mock */}
              <div className="flex h-14">
                <div className="flex items-center px-4 gap-3" style={{ background: local.teamABg }}>
                  <span className="text-sm font-black uppercase" style={{ color: local.autoContrast ? autoContrastColor(local.teamABg) : local.teamAText }}>IND</span>
                  <span className="text-lg font-black" style={{ color: local.stripeColor }}>186/3</span>
                </div>
                <div className="flex items-center px-3 flex-1 justify-center" style={{ background: '#030712' }}>
                  <span className="text-xs font-bold text-white/60 uppercase">20.0 OV · CRR 9.30</span>
                </div>
                <div className="flex items-center px-4 gap-3" style={{ background: local.teamBBg }}>
                  <span className="text-sm font-black uppercase" style={{ color: local.autoContrast ? autoContrastColor(local.teamBBg) : local.teamBText }}>AUS</span>
                  <span className="text-xs font-bold text-white/40">TGT 187</span>
                </div>
              </div>
              {/* Batter row mock */}
              <div className="flex items-center px-4 py-2 gap-4" style={{ background: `${local.teamABg}cc` }}>
                {(local.batterDisplayStyle.startsWith('round') ? ['●', '○'] : ['■', '□']).map((icon, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span style={{ color: local.stripeColor, fontSize: '14px' }}>{local.batterDisplayStyle.includes('filled') ? (i===0?'⬤':'○') : (i===0?'■':'□')}</span>
                    <div>
                      <span className="text-xs font-black text-white uppercase">{i===0 ? 'ROHIT R.' : 'KOHLI V.'}</span>
                      <span className="text-[10px] text-white/60 ml-2">{i===0 ? '56(34)' : '23(18)'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 sticky bottom-0 bg-[#0b0f19]">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-400 font-black text-xs rounded-lg uppercase transition-colors"
          >
            Reset to Default
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-400 font-black text-xs rounded-lg uppercase transition-colors">
              Cancel
            </button>
            <button
              onClick={handleApply}
              className={`px-6 py-2 font-black text-xs rounded-lg uppercase flex items-center gap-2 transition-all transform active:scale-95 shadow-lg ${
                applied
                  ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                  : 'bg-[#ff007f] hover:bg-[#ff2a95] text-white shadow-[0_0_20px_rgba(255,0,127,0.35)]'
              }`}
            >
              {applied ? <><CheckCircle className="w-4 h-4" /> Applied!</> : <><Zap className="w-4 h-4 fill-white" /> Apply to Broadcast</>}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// Reusable color slot row
interface ColorSlotProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  preview?: React.ReactNode;
}
const ColorSlot: React.FC<ColorSlotProps> = ({ label, value, onChange, preview }) => (
  <div className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{label}</span>
      <input
        type="color"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-7 h-7 rounded border border-white/20 bg-transparent cursor-pointer"
        style={{ padding: '2px' }}
      />
    </div>
    <div className="w-full">{preview}</div>
    <input
      type="text"
      value={value}
      onChange={e => /^#[0-9a-fA-F]{0,6}$/.test(e.target.value) && onChange(e.target.value)}
      className="w-full text-[10px] font-mono bg-black/30 border border-white/10 rounded px-2 py-1 text-slate-300 focus:outline-none focus:border-[#ff007f]/60"
    />
  </div>
);
