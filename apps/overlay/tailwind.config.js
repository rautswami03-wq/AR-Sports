import { arSportsPreset } from '@ar-sports/theme/tailwind-preset';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/graphics/src/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [arSportsPreset],
  plugins: [],
};
