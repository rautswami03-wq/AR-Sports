import React, { useRef, useEffect, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// ParticleSystem.tsx — Canvas-based confetti burst for PageCenter celebrations
// ─────────────────────────────────────────────────────────────────────────────

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  width: number;
  height: number;
  opacity: number;
  life: number;
  maxLife: number;
}

interface ParticleSystemProps {
  active: boolean;
  type: 'four' | 'six' | 'wicket';
  count?: number;
  className?: string;
}

const COLORS: Record<ParticleSystemProps['type'], string[]> = {
  four:   ['#f59e0b', '#fbbf24', '#fde68a', '#ffffff', '#fcd34d'],
  six:    ['#22c55e', '#4ade80', '#86efac', '#00f5ff', '#ffffff', '#a3e635'],
  wicket: ['#ef4444', '#f87171', '#fca5a5', '#ffd700', '#ffffff', '#ff6b6b'],
};

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  active,
  type,
  count = 80,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const isActiveRef = useRef(false);

  const spawnParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const colors = COLORS[type];
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    particlesRef.current = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 150 + Math.random() * 350;
      const maxLife = 900 + Math.random() * 600;

      return {
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed * 0.016,
        vy: Math.sin(angle) * speed * 0.016 - 2.5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        width: 6 + Math.random() * 10,
        height: Math.random() > 0.4 ? 6 + Math.random() * 10 : 3 + Math.random() * 5,
        opacity: 1,
        life: 0,
        maxLife,
      };
    });
  }, [type, count]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gravity = 0.12;
    let alive = 0;

    particlesRef.current.forEach(p => {
      p.life += 16;
      if (p.life > p.maxLife) return;
      alive++;

      p.vy += gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.opacity = Math.max(0, 1 - p.life / p.maxLife);

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      if (p.width === p.height) {
        ctx.arc(0, 0, p.width / 2, 0, Math.PI * 2);
      } else {
        ctx.rect(-p.width / 2, -p.height / 2, p.width, p.height);
      }
      ctx.fill();
      ctx.restore();
    });

    if (alive > 0 || isActiveRef.current) {
      rafRef.current = requestAnimationFrame(render);
    }
  }, []);

  useEffect(() => {
    if (active && !isActiveRef.current) {
      isActiveRef.current = true;
      spawnParticles();
      rafRef.current = requestAnimationFrame(render);
    } else if (!active && isActiveRef.current) {
      isActiveRef.current = false;
    }
  }, [active, spawnParticles, render]);

  // Resize canvas to match parent
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver(() => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
};

export default ParticleSystem;
