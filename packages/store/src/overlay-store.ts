import { create } from 'zustand';
import type { OverlaySceneType, ScoreState, OverlayConfig } from '@ar-sports/types';

// ============================================================================
// Overlay Store — Controls overlay scenes and animations
// ============================================================================

interface OverlayState {
  activeScene: OverlaySceneType | null;
  previousScene: OverlaySceneType | null;
  connected: boolean;
  scoreState: ScoreState | null;
  triggerAnimation: string | null;
  autoHideTimeout: number;
  configs: Partial<Record<string, OverlayConfig>>;

  setScene: (scene: OverlaySceneType | null) => void;
  setScoreState: (state: ScoreState) => void;
  setConnected: (connected: boolean) => void;
  triggerGraphic: (scene: OverlaySceneType, duration?: number) => void;
  clearAnimation: () => void;
  setConfig: (scene: string, config: Partial<OverlayConfig>) => void;
}

export const useOverlayStore = create<OverlayState>((set, get) => ({
  activeScene: null,
  previousScene: null,
  connected: false,
  scoreState: null,
  triggerAnimation: null,
  autoHideTimeout: 3000,
  configs: {},

  setScene: (scene) => {
    set((state) => ({
      previousScene: state.activeScene,
      activeScene: scene,
    }));
  },

  setScoreState: (scoreState) => {
    set({ scoreState });
  },

  setConnected: (connected) => {
    set({ connected });
  },

  triggerGraphic: (scene, duration = 3000) => {
    const { activeScene } = get();
    set({
      previousScene: activeScene,
      activeScene: scene,
      triggerAnimation: scene,
    });

    // Auto-hide after duration for event-based graphics
    const autoHideScenes = ['FOUR', 'SIX', 'WICKET', 'FREE_HIT', 'NO_BALL'];
    if (autoHideScenes.includes(scene)) {
      setTimeout(() => {
        set((state) => ({
          activeScene: state.activeScene === scene ? state.previousScene : state.activeScene,
          triggerAnimation: null,
        }));
      }, duration);
    }
  },

  clearAnimation: () => {
    set({ triggerAnimation: null });
  },

  setConfig: (scene, config) => {
    set((state) => ({
      configs: {
        ...state.configs,
        [scene]: { ...state.configs[scene], ...config } as OverlayConfig,
      },
    }));
  },
}));
