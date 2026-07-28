'use client';

import React from 'react';

export default function OverlayHome() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-display font-bold text-white/50 mb-2">
          AR Sports Overlay Engine
        </h1>
        <p className="text-sm text-white/30">
          Add as Browser Source in OBS: <code className="font-mono">http://localhost:3001/overlay?scene=scorebug</code>
        </p>
        <div className="mt-4 text-xs text-white/20 space-y-1">
          <p>Available scenes: scorebug, batting, bowling, four, six, wicket, winner, pom, toss, playingxi, stats, countdown</p>
        </div>
      </div>
    </div>
  );
}
