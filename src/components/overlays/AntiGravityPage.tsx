/**
 * AntiGravityPage.tsx
 * Full 1920×1080 OBS-ready page wrapping the anti-gravity overlay.
 * Route: /anti-gravity (transparent BG for OBS Browser Source)
 *
 * Preview mode: /anti-gravity?preview=1  (shows dark bg + debug info)
 */

import React, { useRef, useCallback } from 'react';
import { AntiGravityOverlay } from './AntiGravityOverlay';

export const AntiGravityPage: React.FC = () => {
  const triggerRef = useRef<((type: 'wicket' | 'six' | 'four') => void) | null>(null);

  const handleReady = useCallback((trigger: (type: 'wicket' | 'six' | 'four') => void) => {
    triggerRef.current = trigger;
  }, []);

  const isPreview = new URLSearchParams(window.location.search).get('preview') === '1';

  return (
    <div
      style={{
        width:    1920,
        height:   1080,
        position: 'relative',
        overflow: 'hidden',
        background: isPreview
          ? 'radial-gradient(ellipse at center, #0a0f1e 0%, #030508 100%)'
          : 'transparent',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Preview grid (hidden in OBS mode) */}
      {isPreview && (
        <svg
          style={{ position: 'absolute', inset: 0, opacity: 0.06, pointerEvents: 'none' }}
          width={1920} height={1080}
        >
          {Array.from({ length: 11 }, (_, i) => (
            <line key={`v${i}`} x1={i * 192} y1={0} x2={i * 192} y2={1080} stroke="#00f5ff" strokeWidth={0.5} />
          ))}
          {Array.from({ length: 7 }, (_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 180} x2={1920} y2={i * 180} stroke="#00f5ff" strokeWidth={0.5} />
          ))}
          {/* Center crosshair */}
          <circle cx={960} cy={540} r={12} fill="none" stroke="#00f5ff" strokeWidth={1} />
          <line x1={948} y1={540} x2={972} y2={540} stroke="#00f5ff" strokeWidth={1} />
          <line x1={960} y1={528} x2={960} y2={552} stroke="#00f5ff" strokeWidth={1} />
        </svg>
      )}

      {/* Anti-gravity overlay */}
      <AntiGravityOverlay onReady={handleReady} />

      {/* Preview mode label */}
      {isPreview && (
        <div style={{
          position:   'absolute',
          top:        12,
          left:       '50%',
          transform:  'translateX(-50%)',
          fontFamily: 'monospace',
          fontSize:   10,
          color:      'rgba(0,245,255,0.5)',
          letterSpacing: '0.2em',
          pointerEvents: 'none',
        }}>
          PREVIEW MODE — 1920×1080
        </div>
      )}
    </div>
  );
};

export default AntiGravityPage;
