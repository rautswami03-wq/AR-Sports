// =============================================================================
// AnimationEngine.ts — hardware-accelerated animation utilities
// All animations use CSS transforms + requestAnimationFrame for 60fps
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// DIGIT SLOT MACHINE
// Wraps each digit independently for cascading roll effect
// ─────────────────────────────────────────────────────────────────────────────

export interface SlotDigitController {
  container: HTMLElement;
  currentValue: string;
  roll: (newValue: string, delay?: number) => void;
  destroy: () => void;
}

export function createSlotDigit(container: HTMLElement, initialValue: string): SlotDigitController {
  container.style.cssText += `
    position: relative;
    overflow: hidden;
    display: inline-flex;
    flex-direction: column;
    will-change: transform;
  `;

  const inner = document.createElement('div');
  inner.className = 'sb-slot-inner';
  inner.style.cssText = `
    display: flex;
    flex-direction: column;
    will-change: transform;
    transition: transform 0.32s cubic-bezier(0.34, 1.30, 0.64, 1);
  `;

  const prevSpan = document.createElement('span');
  prevSpan.className = 'sb-slot-prev';
  prevSpan.textContent = initialValue;
  prevSpan.style.cssText = 'position: absolute; top: -100%; width: 100%; text-align: center;';

  const curSpan = document.createElement('span');
  curSpan.className = 'sb-slot-cur';
  curSpan.textContent = initialValue;
  curSpan.style.cssText = 'width: 100%; text-align: center;';

  container.appendChild(prevSpan);
  container.appendChild(curSpan);
  container.appendChild(inner);

  let currentValue = initialValue;
  let rollTimeout: ReturnType<typeof setTimeout> | null = null;

  const roll = (newValue: string, delay = 0) => {
    if (newValue === currentValue) return;

    if (rollTimeout) clearTimeout(rollTimeout);
    rollTimeout = setTimeout(() => {
      prevSpan.textContent = currentValue;
      curSpan.textContent = newValue;

      // Start off-screen below
      inner.style.transform = 'translateY(100%)';
      inner.style.transition = 'none';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          inner.style.transition = 'transform 0.32s cubic-bezier(0.34, 1.30, 0.64, 1)';
          inner.style.transform = 'translateY(0)';
        });
      });

      currentValue = newValue;
    }, delay);
  };

  const destroy = () => {
    if (rollTimeout) clearTimeout(rollTimeout);
  };

  return { container, currentValue, roll, destroy };
}

// ─────────────────────────────────────────────────────────────────────────────
// SCORE DIGIT MANAGER
// Manages multiple slot digits for a full score string like "148/3"
// ─────────────────────────────────────────────────────────────────────────────

export class ScoreDigitManager {
  private digitControllers: SlotDigitController[] = [];
  private container: HTMLElement;
  private currentScore = '';

  constructor(container: HTMLElement) {
    this.container = container;
  }

  update(newScore: string): void {
    if (newScore === this.currentScore) return;

    const oldScore = this.currentScore;
    this.currentScore = newScore;

    // Find the digit that changed and animate from right-to-left with stagger
    const maxLen = Math.max(oldScore.length, newScore.length);
    const paddedOld = oldScore.padStart(maxLen, ' ');
    const paddedNew = newScore.padStart(maxLen, ' ');

    // Trigger digit rolls with stagger from right
    for (let i = maxLen - 1; i >= 0; i--) {
      const delay = (maxLen - 1 - i) * 35; // stagger: rightmost first
      if (paddedOld[i] !== paddedNew[i] && this.digitControllers[i]) {
        this.digitControllers[i].roll(paddedNew[i], delay);
      }
    }
  }

  destroy(): void {
    this.digitControllers.forEach(c => c.destroy());
    this.digitControllers = [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// FLASH ENGINE
// Manages boundary/wicket/extra flash state machine
// ─────────────────────────────────────────────────────────────────────────────

export type FlashType = 'four' | 'six' | 'wicket' | 'extra' | null;

interface FlashConfig {
  color: string;
  pulseCount: number;
  pulseDuration: number; // ms per pulse
  scale?: number;        // scale during pulse
}

const FLASH_CONFIGS: Record<NonNullable<FlashType>, FlashConfig> = {
  four:   { color: '--sb-flash-four',   pulseCount: 2, pulseDuration: 280, scale: 1.02 },
  six:    { color: '--sb-flash-six',    pulseCount: 3, pulseDuration: 260, scale: 1.04 },
  wicket: { color: '--sb-flash-wicket', pulseCount: 4, pulseDuration: 200, scale: 1.0  },
  extra:  { color: '--sb-flash-extra',  pulseCount: 1, pulseDuration: 400, scale: 1.0  },
};

export class FlashEngine {
  private targets: HTMLElement[] = [];
  private currentFlash: FlashType = null;
  private timeouts: ReturnType<typeof setTimeout>[] = [];
  private listeners: Set<(flash: FlashType) => void> = new Set();

  addTarget(el: HTMLElement): () => void {
    this.targets.push(el);
    return () => {
      this.targets = this.targets.filter(t => t !== el);
    };
  }

  onFlashChange(cb: (flash: FlashType) => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  trigger(type: FlashType, durationMs = 3000): void {
    // Clear previous
    this.clear();
    if (!type) return;

    this.currentFlash = type;
    this.listeners.forEach(l => l(type));

    const config = FLASH_CONFIGS[type];

    // Apply CSS class to all targets
    this.targets.forEach(el => {
      el.setAttribute('data-flash', type);
    });

    // Schedule clear
    const t = setTimeout(() => {
      this.clear();
    }, durationMs);
    this.timeouts.push(t);
  }

  clear(): void {
    this.timeouts.forEach(t => clearTimeout(t));
    this.timeouts = [];
    this.currentFlash = null;
    this.targets.forEach(el => {
      el.removeAttribute('data-flash');
    });
    this.listeners.forEach(l => l(null));
  }

  get current(): FlashType {
    return this.currentFlash;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// BALL CHIP SPRING ANIMATION
// New ball chip slides in from right with spring overshoot
// ─────────────────────────────────────────────────────────────────────────────

export function animateBallChipIn(el: HTMLElement): void {
  el.style.transform = 'translateX(40px) scale(0.7)';
  el.style.opacity = '0';
  el.style.transition = 'none';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.transition =
        'transform 0.42s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease-out';
      el.style.transform = 'translateX(0) scale(1)';
      el.style.opacity = '1';
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// BREATHING GLOW
// Applies a pulsing glow animation to an element
// ─────────────────────────────────────────────────────────────────────────────

export function startBreathingGlow(el: HTMLElement): () => void {
  el.style.animation = 'sb-breathing-glow 2s ease-in-out infinite';
  return () => {
    el.style.animation = '';
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// CELEBRATION ORCHESTRATOR
// Manages three celebration modes: ticker-takeover, page-center, batter-bar
// ─────────────────────────────────────────────────────────────────────────────

export type CelebrationMode = 'ticker-takeover' | 'page-center' | 'batter-bar';

export interface CelebrationEvent {
  type: 'four' | 'six' | 'wicket';
  batter?: string;
  score?: number;
  milestone?: number; // 50, 100, 150...
}

export class CelebrationOrchestrator {
  private overlay: HTMLElement | null = null;
  private tickerEl: HTMLElement | null = null;
  private batterBarEl: HTMLElement | null = null;
  private mode: CelebrationMode;
  private clearTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(mode: CelebrationMode) {
    this.mode = mode;
  }

  setMode(mode: CelebrationMode): void {
    this.mode = mode;
  }

  setOverlayEl(el: HTMLElement): void { this.overlay = el; }
  setTickerEl(el: HTMLElement): void { this.tickerEl = el; }
  setBatterBarEl(el: HTMLElement): void { this.batterBarEl = el; }

  fire(event: CelebrationEvent, durationMs = 3500): void {
    if (this.clearTimer) {
      clearTimeout(this.clearTimer);
      this.hide();
    }

    const label = event.type === 'wicket'
      ? '⚡ WICKET! ⚡'
      : event.type === 'six'
      ? '🔥 MAXIMUM SIX! 🔥'
      : '🚀 FOUR! 🚀';

    switch (this.mode) {
      case 'ticker-takeover':
        this.fireTickerTakeover(label, event);
        break;
      case 'page-center':
        this.firePageCenter(label, event);
        break;
      case 'batter-bar':
        this.fireBatterBar(label, event);
        break;
    }

    this.clearTimer = setTimeout(() => this.hide(), durationMs);
  }

  private fireTickerTakeover(label: string, event: CelebrationEvent): void {
    if (!this.tickerEl) return;
    this.tickerEl.setAttribute('data-celebration', event.type);
    this.tickerEl.setAttribute('data-celebration-text', label);
  }

  private firePageCenter(label: string, event: CelebrationEvent): void {
    if (!this.overlay) return;
    this.overlay.setAttribute('data-celebration', event.type);
    this.overlay.setAttribute('data-celebration-text', label);
    this.overlay.style.display = 'flex';

    // Spawn particles
    spawnParticles(this.overlay, event.type, 80);
  }

  private fireBatterBar(label: string, event: CelebrationEvent): void {
    if (!this.batterBarEl) return;
    this.batterBarEl.setAttribute('data-celebration', event.type);
    this.batterBarEl.setAttribute('data-celebration-text', label);
  }

  private hide(): void {
    [this.overlay, this.tickerEl, this.batterBarEl].forEach(el => {
      if (el) {
        el.removeAttribute('data-celebration');
        el.removeAttribute('data-celebration-text');
        if (el === this.overlay) el.style.display = 'none';
      }
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PARTICLE BURST (canvas-less, DOM-based)
// ─────────────────────────────────────────────────────────────────────────────

const PARTICLE_COLORS = {
  four:   ['#f59e0b', '#fbbf24', '#ffffff', '#fde68a'],
  six:    ['#22c55e', '#4ade80', '#86efac', '#ffffff', '#00f5ff'],
  wicket: ['#ef4444', '#f87171', '#fca5a5', '#ffffff', '#ffd700'],
};

export function spawnParticles(container: HTMLElement, type: 'four' | 'six' | 'wicket', count = 60): void {
  const colors = PARTICLE_COLORS[type];
  const rect = container.getBoundingClientRect();
  const cx = rect.width / 2;
  const cy = rect.height / 2;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const angle = (Math.random() * Math.PI * 2);
    const speed = 80 + Math.random() * 220;
    const size = 4 + Math.random() * 8;
    const tx = Math.cos(angle) * speed;
    const ty = Math.sin(angle) * speed - 60; // bias upward
    const rotation = Math.random() * 720 - 360;
    const delay = Math.random() * 200;
    const dur = 800 + Math.random() * 600;

    p.style.cssText = `
      position: absolute;
      left: ${cx}px;
      top: ${cy}px;
      width: ${size}px;
      height: ${size * (Math.random() > 0.5 ? 1 : 2.5)}px;
      background: ${color};
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      pointer-events: none;
      will-change: transform, opacity;
      animation: sb-particle ${dur}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms forwards;
      --tx: ${tx}px;
      --ty: ${ty}px;
      --rot: ${rotation}deg;
      z-index: 100;
    `;
    container.appendChild(p);
    setTimeout(() => p.remove(), dur + delay + 100);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL CSS — injected once into document.head
// Contains all keyframe animations referenced above
// ─────────────────────────────────────────────────────────────────────────────

const GLOBAL_KEYFRAMES = `
@keyframes sb-slot-roll-in {
  from { transform: translateY(110%); }
  to   { transform: translateY(0); }
}
@keyframes sb-slot-roll-out {
  from { transform: translateY(0); }
  to   { transform: translateY(-110%); }
}
@keyframes sb-breathing-glow {
  0%, 100% { box-shadow: var(--sb-glow-strength, 0 0 16px) var(--sb-glow-color, rgba(59,130,246,0.4)); }
  50%       { box-shadow: 0 0 32px 4px var(--sb-glow-color, rgba(59,130,246,0.4)); }
}
@keyframes sb-pulse-four {
  0%, 100% { background-color: transparent; }
  25%, 75% { background-color: var(--sb-flash-four, #f59e0b); }
}
@keyframes sb-pulse-six {
  0%, 100% { background-color: transparent; }
  20%, 50%, 80% { background-color: var(--sb-flash-six, #22c55e); }
}
@keyframes sb-pulse-wicket {
  0%, 100% { background-color: transparent; }
  15%, 40%, 60%, 85% { background-color: var(--sb-flash-wicket, #ef4444); opacity: 0.8; }
}
@keyframes sb-pulse-extra {
  0%, 100% { background-color: transparent; }
  50% { background-color: var(--sb-flash-extra, #eab308); }
}
@keyframes sb-particle {
  0%   { transform: translate(0,0) rotate(0deg); opacity: 1; }
  100% { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)); opacity: 0; }
}
@keyframes sb-celebration-in {
  from { transform: scale(0.4) translateY(30px); opacity: 0; }
  to   { transform: scale(1) translateY(0); opacity: 1; }
}
@keyframes sb-ticker-scroll {
  0%   { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}
@keyframes sb-gradient-wave {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes sb-neon-pulse {
  0%, 100% { opacity: 1; text-shadow: 0 0 8px currentColor, 0 0 20px currentColor; }
  50%       { opacity: 0.85; text-shadow: 0 0 4px currentColor, 0 0 40px currentColor, 0 0 60px currentColor; }
}
@keyframes sb-strike-swap {
  0%   { opacity: 0; transform: translateX(-8px); }
  100% { opacity: 1; transform: translateX(0); }
}
@keyframes sb-ball-chip-in {
  from { transform: translateX(40px) scale(0.7); opacity: 0; }
  to   { transform: translateX(0) scale(1); opacity: 1; }
}
@keyframes sb-hundred-countdown {
  from { transform: scale(1.4); color: var(--sb-accent-primary); }
  to   { transform: scale(1); }
}
`;

let _keyframesInjected = false;
export function injectGlobalKeyframes(): void {
  if (_keyframesInjected) return;
  _keyframesInjected = true;
  const style = document.createElement('style');
  style.id = 'sb-animation-engine';
  style.textContent = GLOBAL_KEYFRAMES;
  document.head.appendChild(style);
}

// ─────────────────────────────────────────────────────────────────────────────
// SMOOTH PANEL TRANSITION
// ─────────────────────────────────────────────────────────────────────────────

export function smoothPanelTransition(
  el: HTMLElement,
  direction: 'in' | 'out' = 'in',
  variant: 'slide' | 'fade' | 'scale' = 'slide'
): void {
  const duration = '0.35s';
  const ease = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';

  if (direction === 'in') {
    switch (variant) {
      case 'slide':
        el.style.transform = 'translateY(20px)';
        el.style.opacity = '0';
        el.style.transition = 'none';
        requestAnimationFrame(() => {
          el.style.transition = `transform ${duration} ${ease}, opacity ${duration} ease`;
          el.style.transform = 'translateY(0)';
          el.style.opacity = '1';
        });
        break;
      case 'fade':
        el.style.opacity = '0';
        el.style.transition = `opacity ${duration} ease`;
        requestAnimationFrame(() => { el.style.opacity = '1'; });
        break;
      case 'scale':
        el.style.transform = 'scale(0.92)';
        el.style.opacity = '0';
        el.style.transition = `transform ${duration} ${ease}, opacity ${duration} ease`;
        requestAnimationFrame(() => {
          el.style.transform = 'scale(1)';
          el.style.opacity = '1';
        });
        break;
    }
  }
}
