import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppSettings } from '@ar-sports/types';
import { ThemeMode } from '@ar-sports/types';

interface SettingsState extends AppSettings {
  setTheme: (theme: ThemeMode) => void;
  setAnimationSpeed: (speed: number) => void;
  setOverlayScale: (scale: number) => void;
  setOverlayPort: (port: number) => void;
  setWsPort: (port: number) => void;
  setLanguage: (lang: string) => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  setSoundEnabled: (enabled: boolean) => void;
  resetToDefaults: () => void;
}

const defaults: AppSettings = {
  theme: ThemeMode.DARK,
  animationSpeed: 1.0,
  overlayScale: 1.0,
  overlayPort: 3001,
  wsPort: 8765,
  language: 'en',
  fontSize: 'medium',
  soundEnabled: true,
  autoSave: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaults,

      setTheme: (theme) => set({ theme }),
      setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
      setOverlayScale: (scale) => set({ overlayScale: scale }),
      setOverlayPort: (port) => set({ overlayPort: port }),
      setWsPort: (port) => set({ wsPort: port }),
      setLanguage: (lang) => set({ language: lang }),
      setFontSize: (size) => set({ fontSize: size }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      resetToDefaults: () => set(defaults),
    }),
    {
      name: 'ar-sports-settings',
    },
  ),
);
