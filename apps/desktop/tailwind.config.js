import { arSportsPreset } from '@ar-sports/theme/tailwind-preset';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/renderer/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/graphics/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/icons/src/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [arSportsPreset],
  darkMode: 'class',
  plugins: [],
};
