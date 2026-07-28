import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatOvers(balls: number): string {
  const overs = Math.floor(balls / 6);
  const remaining = balls % 6;
  return `${overs}.${remaining}`;
}

export function calculateRunRate(runs: number, balls: number): number {
  if (balls === 0) return 0;
  return Number(((runs / balls) * 6).toFixed(2));
}

export function calculateRequiredRunRate(
  targetRuns: number,
  currentRuns: number,
  remainingBalls: number,
): number {
  const needed = targetRuns - currentRuns;
  if (remainingBalls <= 0 || needed <= 0) return 0;
  return Number(((needed / remainingBalls) * 6).toFixed(2));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function formatNumber(num: number, decimals: number = 2): string {
  return num.toFixed(decimals);
}
