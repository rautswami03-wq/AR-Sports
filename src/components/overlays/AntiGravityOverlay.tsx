/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  AntiGravityOverlay.tsx — React / Three.js WebGL Anti-Gravity System   ║
 * ║  1920×1080 transparent OBS overlay with full physics simulation        ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * PHYSICS MODEL:
 *  - Inverse gravity vector: g = gravCoeff * -9.8 m/s²
 *  - Panels: spring-damper to anchor (+200px Y offset in levitation mode)
 *  - Particles: Brownian motion + continuous upward drift
 *  - Tether lines: elastic spring connecting panel to anchor (k=0.8, d=0.95)
 *  - Shockwaves: radial impulse on wicket/six events
 */

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import * as THREE from 'three';
import { useBroadcastStore } from '../../store/useBroadcastStore';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const W = 1920;
const H = 1080;
const PARTICLE_COUNT = 500;
const SPRING_K = 0.8;
const DAMPING = 0.95;
const PANEL_HOVER_Y = 200;        // px above anchor in levitation mode
const OSCILLATION_AMP = 15;       // px
const OSCILLATION_FREQ = 0.5;     // Hz
const PARTICLE_UPWARD_DRIFT = 2;  // px per frame
const BROWNIAN_STRENGTH = 0.4;

// Neon palette
const NEON_CYAN   = new THREE.Color(0x00f5ff);
const NEON_GREEN  = new THREE.Color(0x39ff14);
const NEON_GOLD   = new THREE.Color(0xffc72c);
const NEON_RED    = new THREE.Color(0xff2244);
const NEON_PURPLE = new THREE.Color(0xbd00ff);

// ─────────────────────────────────────────────────────────────────────────────
// GLSL SHADERS
// ─────────────────────────────────────────────────────────────────────────────

const PARTICLE_VERT = /* glsl */`
  attribute float aSize;
  attribute float aAlpha;
  attribute vec3  aColor;
  varying float vAlpha;
  varying vec3  vColor;

  void main() {
    vAlpha = aAlpha;
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (400.0 / -mv.z);
    gl_Position  = projectionMatrix * mv;
  }
`;

const PARTICLE_FRAG = /* glsl */`
  varying float vAlpha;
  varying vec3  vColor;

  void main() {
    vec2  uv   = gl_PointCoord - 0.5;
    float dist = length(uv);
    // Hard core + soft halo
    float core = smoothstep(0.12, 0.0, dist);
    float halo = smoothstep(0.5,  0.0, dist) * 0.35;
    float a    = (core + halo) * vAlpha;
    if (a < 0.005) discard;
    gl_FragColor = vec4(vColor, a);
  }
`;

const TETHER_VERT = /* glsl */`
  attribute float aProgress;  // 0=anchor end, 1=panel end
  varying float vProgress;
  void main() {
    vProgress   = aProgress;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const TETHER_FRAG = /* glsl */`
  varying float vProgress;
  uniform vec3  uColor;
  uniform float uTime;

  void main() {
    // Animated dash + fade toward anchor
    float dash   = step(0.5, fract(vProgress * 8.0 - uTime * 1.5));
    float fade   = vProgress * 0.85 + 0.15;
    float alpha  = dash * fade;
    gl_FragColor = vec4(uColor, alpha * 0.7);
  }
`;

const SHOCKWAVE_VERT = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SHOCKWAVE_FRAG = /* glsl */`
  varying vec2 vUv;
  uniform float uProgress;  // 0→1 as wave expands
  uniform vec3  uColor;

  void main() {
    float d     = length(vUv - 0.5) * 2.0;   // 0 at center, 1 at edge
    float ring  = 1.0 - abs(d - uProgress) * 12.0;
    float alpha = max(0.0, ring) * (1.0 - uProgress) * 0.9;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

const HUD_VERT = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const HUD_FRAG = /* glsl */`
  varying vec2  vUv;
  uniform float uTime;
  uniform float uGravCoeff;
  uniform bool  uLevitation;

  float sdChevron(vec2 p, float w, float h) {
    p.y -= 0.3;
    vec2  q = abs(p);
    float l = max(q.x - w, q.y - h);
    float d = length(max(vec2(q.x - w, q.y - h), 0.0));
    return l < 0.0 ? l : d;
  }

  void main() {
    vec2 p = vUv - 0.5;   // center

    // Outer ring
    float r    = length(p);
    float ring = smoothstep(0.48, 0.45, r) * smoothstep(0.40, 0.43, r);

    // Tick marks every 30°
    float angle  = atan(p.y, p.x);
    float ticks  = smoothstep(0.015, 0.0, mod(angle + uTime * 0.5, 3.14159 / 6.0));

    // Rotating chevron
    float a  = uTime * 1.2;
    vec2  rp = vec2(p.x * cos(a) - p.y * sin(a), p.x * sin(a) + p.y * cos(a));
    float ch = sdChevron(rp * 2.5, 0.4, 0.25);
    float cv = smoothstep(0.04, 0.0, abs(ch)) * 0.9;

    // Core glow based on gravity coefficient
    float coreR = 0.08;
    float core  = smoothstep(coreR, 0.0, r - 0.01);

    vec3 baseColor = uLevitation
      ? mix(vec3(0.0, 1.0, 0.6), vec3(0.0, 0.9, 1.0), sin(uTime * 3.0) * 0.5 + 0.5)
      : mix(vec3(1.0, 0.8, 0.0), vec3(0.0, 0.96, 1.0), clamp(uGravCoeff / 2.0, 0.0, 1.0));

    float alpha = ring * 0.7 + ticks * 0.4 + cv + core * 0.6;
    gl_FragColor = vec4(baseColor, alpha);
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// PHYSICS TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface PhysicsBody {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  anchor:   THREE.Vector3;  // world-space anchor point
  mass:     number;
}

interface Particle {
  pos: Float32Array;   // [x, y, z]
  vel: Float32Array;   // [vx, vy, vz]
  idx: number;         // index into geometry attributes
}

interface Shockwave {
  mesh:     THREE.Mesh;
  material: THREE.ShaderMaterial;
  progress: number;   // 0→1
  active:   boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// PANEL CANVAS TEXTURE BUILDER
// ─────────────────────────────────────────────────────────────────────────────

function buildPanelTexture(
  score: string,
  wickets: number,
  overs: string,
  batTeam: string,
  bwlTeam: string,
  crr: string,
  isLevitation: boolean,
): THREE.CanvasTexture {
  const cv = document.createElement('canvas');
  cv.width  = 640;
  cv.height = 180;
  const ctx = cv.getContext('2d')!;

  // Background
  const grad = ctx.createLinearGradient(0, 0, 640, 0);
  if (isLevitation) {
    grad.addColorStop(0,   'rgba(0, 20, 40, 0.92)');
    grad.addColorStop(0.5, 'rgba(0, 50, 80, 0.96)');
    grad.addColorStop(1,   'rgba(0, 20, 40, 0.92)');
  } else {
    grad.addColorStop(0,   'rgba(5, 8, 30, 0.92)');
    grad.addColorStop(0.5, 'rgba(10, 15, 55, 0.96)');
    grad.addColorStop(1,   'rgba(5, 8, 30, 0.92)');
  }
  ctx.fillStyle = grad;
  ctx.roundRect(0, 0, 640, 180, 18);
  ctx.fill();

  // Neon border
  ctx.strokeStyle = isLevitation ? '#00f5ff' : '#ffc72c';
  ctx.lineWidth   = 2.5;
  ctx.shadowColor = isLevitation ? '#00f5ff' : '#ffc72c';
  ctx.shadowBlur  = 12;
  ctx.roundRect(2, 2, 636, 176, 16);
  ctx.stroke();

  ctx.shadowBlur = 0;

  // Team names
  ctx.font      = 'bold 22px "Inter", sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.textAlign = 'left';
  ctx.fillText(batTeam.toUpperCase(), 24, 38);
  ctx.textAlign = 'right';
  ctx.fillText(bwlTeam.toUpperCase(), 616, 38);

  // Score
  ctx.font      = 'bold 72px "Inter", sans-serif';
  ctx.fillStyle = isLevitation ? '#00f5ff' : '#ffc72c';
  ctx.textAlign = 'center';
  ctx.shadowColor = ctx.fillStyle;
  ctx.shadowBlur  = 20;
  ctx.fillText(`${score}/${wickets}`, 320, 115);

  ctx.shadowBlur = 0;

  // Overs + CRR
  ctx.font      = 'bold 18px "Inter", sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText(`${overs} OVS  •  CRR ${crr}`, 320, 155);

  // Anti-grav badge
  if (isLevitation) {
    ctx.font      = 'bold 11px monospace';
    ctx.fillStyle = '#00f5ff';
    ctx.textAlign = 'left';
    ctx.fillText('⬆ LEVITATION', 24, 165);
  }

  return new THREE.CanvasTexture(cv);
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface AntiGravityOverlayProps {
  /** Opacity of the entire overlay (0-1) */
  opacity?: number;
  /** External event trigger for shockwave */
  onReady?: (trigger: (type: 'wicket' | 'six' | 'four') => void) => void;
}

export const AntiGravityOverlay: React.FC<AntiGravityOverlayProps> = ({
  opacity = 1,
  onReady,
}) => {
  // ── Store ─────────────────────────────────────────────────────────────────
  const { teamA, teamB, battingTeamId, matchDetails } = useBroadcastStore();
  const isTeamA    = battingTeamId === teamA.id || battingTeamId === 'teamA';
  const batting    = isTeamA ? teamA : teamB;
  const bowling    = isTeamA ? teamB : teamA;
  const totalBalls = batting.overs * 6 + batting.balls;
  const crr        = totalBalls > 0 ? ((batting.score / totalBalls) * 6).toFixed(1) : '0.0';

  // ── Controls ─────────────────────────────────────────────────────────────
  const [gravCoeff,   setGravCoeff]   = useState<number>(-1.0);   // -2 to +2
  const [levitation,  setLevitation]  = useState<boolean>(true);
  const [showControls, setShowControls] = useState<boolean>(true);

  // ── Refs ──────────────────────────────────────────────────────────────────
  const mountRef     = useRef<HTMLDivElement>(null);
  const rendererRef  = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef     = useRef<THREE.Scene | null>(null);
  const cameraRef    = useRef<THREE.PerspectiveCamera | null>(null);
  const rafRef       = useRef<number>(0);
  const clockRef     = useRef<THREE.Clock>(new THREE.Clock());

  // Physics bodies for panels
  const panelBodyRef = useRef<PhysicsBody>({
    position: new THREE.Vector3(0, 0, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    anchor:   new THREE.Vector3(0, -80, 0),
    mass:     1.0,
  });

  // Particle data
  const particlesRef    = useRef<{
    geometry: THREE.BufferGeometry | null;
    positions: Float32Array;
    velocities: Float32Array;
    sizes: Float32Array;
    alphas: Float32Array;
    colors: Float32Array;
  }>({
    geometry:  null,
    positions: new Float32Array(PARTICLE_COUNT * 3),
    velocities: new Float32Array(PARTICLE_COUNT * 3),
    sizes:     new Float32Array(PARTICLE_COUNT),
    alphas:    new Float32Array(PARTICLE_COUNT),
    colors:    new Float32Array(PARTICLE_COUNT * 3),
  });

  const panelMeshRef    = useRef<THREE.Mesh | null>(null);
  const panelMatRef     = useRef<THREE.MeshBasicMaterial | null>(null);
  const tetherRef       = useRef<THREE.Line | null>(null);
  const tetherMatRef    = useRef<THREE.ShaderMaterial | null>(null);
  const hudRef          = useRef<THREE.Mesh | null>(null);
  const hudMatRef       = useRef<THREE.ShaderMaterial | null>(null);
  const shockwavesRef   = useRef<Shockwave[]>([]);
  const gravCoeffRef    = useRef(gravCoeff);
  const levitationRef   = useRef(levitation);

  // Sync refs to state
  useEffect(() => { gravCoeffRef.current   = gravCoeff;  }, [gravCoeff]);
  useEffect(() => { levitationRef.current  = levitation; }, [levitation]);

  // Accumulated time for oscillation
  const timeRef = useRef(0);

  // ── INIT THREE.JS ─────────────────────────────────────────────────────────
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    // ── Renderer ─────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias:       true,
      alpha:           true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    renderer.sortObjects = true;
    rendererRef.current = renderer;
    el.appendChild(renderer.domElement);

    // ── Scene + Camera ────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 3000);
    camera.position.set(0, 0, 600);
    cameraRef.current = camera;

    // ── Particles ─────────────────────────────────────────────────────────
    const pd = particlesRef.current;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      // Random spread across screen
      pd.positions[i3    ] = (Math.random() - 0.5) * 1800;
      pd.positions[i3 + 1] = (Math.random() - 0.5) * 900;
      pd.positions[i3 + 2] = (Math.random() - 0.5) * 200 - 100;

      // Slow random velocity + upward drift built-in
      pd.velocities[i3    ] = (Math.random() - 0.5) * 0.6;
      pd.velocities[i3 + 1] = Math.random() * 0.8 + 0.4;
      pd.velocities[i3 + 2] = (Math.random() - 0.5) * 0.3;

      pd.sizes[i]  = Math.random() * 3 + 1.0;
      pd.alphas[i] = Math.random() * 0.5 + 0.25;

      // Color: mostly cyan with occasional gold/green
      const rnd = Math.random();
      if (rnd < 0.6) {
        pd.colors[i3] = 0.0; pd.colors[i3+1] = 0.92; pd.colors[i3+2] = 1.0;
      } else if (rnd < 0.8) {
        pd.colors[i3] = 1.0; pd.colors[i3+1] = 0.78; pd.colors[i3+2] = 0.17;
      } else {
        pd.colors[i3] = 0.22; pd.colors[i3+1] = 1.0; pd.colors[i3+2] = 0.08;
      }
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pd.positions,  3));
    pGeo.setAttribute('aSize',    new THREE.BufferAttribute(pd.sizes,      1));
    pGeo.setAttribute('aAlpha',   new THREE.BufferAttribute(pd.alphas,     1));
    pGeo.setAttribute('aColor',   new THREE.BufferAttribute(pd.colors,     3));
    pd.geometry = pGeo;

    const pMat = new THREE.ShaderMaterial({
      vertexShader:   PARTICLE_VERT,
      fragmentShader: PARTICLE_FRAG,
      transparent:    true,
      depthWrite:     false,
      blending:       THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(pGeo, pMat);
    particles.renderOrder = 0;
    scene.add(particles);

    // ── Scoreboard Panel ──────────────────────────────────────────────────
    const panelGeo = new THREE.PlaneGeometry(640, 180);
    const panelMat = new THREE.MeshBasicMaterial({
      transparent: true,
      depthWrite:  false,
    });
    panelMatRef.current = panelMat;

    const panel = new THREE.Mesh(panelGeo, panelMat);
    panel.position.set(0, 80, 30);
    panel.renderOrder = 10;
    panelMeshRef.current = panel;
    scene.add(panel);

    // ── Tether Line ───────────────────────────────────────────────────────
    const tetherPositions = new Float32Array(2 * 3);
    const tetherProgress  = new Float32Array([0.0, 1.0]);
    const tGeo = new THREE.BufferGeometry();
    tGeo.setAttribute('position',  new THREE.BufferAttribute(tetherPositions, 3));
    tGeo.setAttribute('aProgress', new THREE.BufferAttribute(tetherProgress,  1));

    const tMat = new THREE.ShaderMaterial({
      vertexShader:   TETHER_VERT,
      fragmentShader: TETHER_FRAG,
      transparent:    true,
      depthWrite:     false,
      blending:       THREE.AdditiveBlending,
      uniforms: {
        uColor: { value: new THREE.Vector3(0.0, 0.96, 1.0) },
        uTime:  { value: 0.0 },
      },
    });
    tetherMatRef.current = tMat;

    const tether = new THREE.Line(tGeo, tMat);
    tether.renderOrder = 5;
    tetherRef.current = tether;
    scene.add(tether);

    // ── Zero-G HUD ────────────────────────────────────────────────────────
    const hudGeo = new THREE.PlaneGeometry(180, 180);
    const hudMat = new THREE.ShaderMaterial({
      vertexShader:   HUD_VERT,
      fragmentShader: HUD_FRAG,
      transparent:    true,
      depthWrite:     false,
      blending:       THREE.AdditiveBlending,
      uniforms: {
        uTime:       { value: 0.0 },
        uGravCoeff:  { value: gravCoeffRef.current },
        uLevitation: { value: levitationRef.current },
      },
    });
    hudMatRef.current = hudMat;

    const hud = new THREE.Mesh(hudGeo, hudMat);
    hud.position.set(750, 400, 50);
    hud.renderOrder = 10;
    hudRef.current = hud;
    scene.add(hud);

    // ── Second mini-panel (depth variation) ───────────────────────────────
    const miniGeo = new THREE.PlaneGeometry(320, 90);
    const miniMat = new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, opacity: 0.75 });
    const mini    = new THREE.Mesh(miniGeo, miniMat);
    mini.position.set(-580, -120, -60);
    mini.renderOrder = 9;
    scene.add(mini);
    // We'll update its texture from the same store data but smaller
    const miniTex = buildMiniPanelTexture(batting.overs, batting.balls, matchDetails.recentBalls);
    miniMat.map = miniTex; miniMat.needsUpdate = true;

    // ── Clean up ──────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafRef.current);
      renderer.dispose();
      scene.clear();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Update panel texture on score change ─────────────────────────────────
  useEffect(() => {
    const mat = panelMatRef.current;
    if (!mat) return;
    const tex = buildPanelTexture(
      String(batting.score),
      batting.wickets,
      `${batting.overs}.${batting.balls}`,
      batting.shortName || batting.fullName,
      bowling.shortName || bowling.fullName,
      crr,
      levitation,
    );
    if (mat.map) mat.map.dispose();
    mat.map = tex;
    mat.needsUpdate = true;
  }, [batting.score, batting.wickets, batting.overs, batting.balls, levitation]);

  // ── Shockwave spawner ────────────────────────────────────────────────────
  const spawnShockwave = useCallback((
    type: 'wicket' | 'six' | 'four',
    pos?: THREE.Vector3,
  ) => {
    const scene = sceneRef.current;
    if (!scene) return;

    const color = type === 'wicket'
      ? new THREE.Vector3(1.0, 0.13, 0.27)
      : type === 'six'
      ? new THREE.Vector3(0.0, 1.0, 0.6)
      : new THREE.Vector3(1.0, 0.78, 0.17);

    const swGeo = new THREE.PlaneGeometry(1000, 1000);
    const swMat = new THREE.ShaderMaterial({
      vertexShader:   SHOCKWAVE_VERT,
      fragmentShader: SHOCKWAVE_FRAG,
      transparent:    true,
      depthWrite:     false,
      blending:       THREE.AdditiveBlending,
      side:           THREE.DoubleSide,
      uniforms: {
        uProgress: { value: 0.0 },
        uColor:    { value: color },
      },
    });
    const swMesh = new THREE.Mesh(swGeo, swMat);
    swMesh.position.copy(pos ?? panelMeshRef.current?.position ?? new THREE.Vector3());
    swMesh.position.z -= 5;
    swMesh.renderOrder = 15;
    scene.add(swMesh);

    shockwavesRef.current.push({ mesh: swMesh, material: swMat, progress: 0, active: true });

    // Impulse particles outward
    const pd = particlesRef.current;
    const origin = swMesh.position;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const dx = pd.positions[i3]     - origin.x;
      const dy = pd.positions[i3 + 1] - origin.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 500) {
        const force = (1 - dist / 500) * 8;
        const nx = dist > 0 ? dx / dist : 0;
        const ny = dist > 0 ? dy / dist : 0;
        pd.velocities[i3]     += nx * force;
        pd.velocities[i3 + 1] += ny * force;
        pd.alphas[i] = Math.min(1.0, pd.alphas[i] + 0.4);
      }
    }
    if (pd.geometry) {
      (pd.geometry.getAttribute('aAlpha') as THREE.BufferAttribute).needsUpdate = true;
    }
  }, []);

  // ── Expose trigger via onReady ────────────────────────────────────────────
  useEffect(() => {
    if (onReady) onReady(spawnShockwave);
  }, [onReady, spawnShockwave]);

  // ── Auto-detect events from store ────────────────────────────────────────
  const prevBallsRef = useRef<string[]>([]);
  useEffect(() => {
    const prev = prevBallsRef.current;
    const curr = matchDetails.recentBalls;
    if (curr.length > prev.length) {
      const newBall = curr[curr.length - 1];
      if      (newBall === 'W') spawnShockwave('wicket');
      else if (newBall === '6') spawnShockwave('six');
      else if (newBall === '4') spawnShockwave('four');
    }
    prevBallsRef.current = curr;
  }, [matchDetails.recentBalls, spawnShockwave]);

  // ── MAIN ANIMATION LOOP ──────────────────────────────────────────────────
  useEffect(() => {
    const renderer = rendererRef.current;
    const scene    = sceneRef.current;
    const camera   = cameraRef.current;
    if (!renderer || !scene || !camera) return;

    let frameCount = 0;

    function animate() {
      rafRef.current = requestAnimationFrame(animate);
      const dt      = Math.min(clockRef.current.getDelta(), 0.05);
      timeRef.current += dt;
      const t       = timeRef.current;
      frameCount++;

      const grav     = gravCoeffRef.current * -9.8;
      const isLev    = levitationRef.current;
      const pd       = particlesRef.current;

      // ── 1. Particle Brownian motion + drift ──────────────────────────
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;

        // Brownian perturbation
        pd.velocities[i3]     += (Math.random() - 0.5) * BROWNIAN_STRENGTH;
        pd.velocities[i3 + 1] += (Math.random() - 0.5) * BROWNIAN_STRENGTH;
        pd.velocities[i3 + 2] += (Math.random() - 0.5) * BROWNIAN_STRENGTH * 0.3;

        // Upward drift (always, scaled by levitation)
        const driftScale = isLev ? 2.5 : 1.0;
        pd.velocities[i3 + 1] += (PARTICLE_UPWARD_DRIFT * driftScale * dt);

        // Gravity effect on particles
        pd.velocities[i3 + 1] += grav * dt * 0.05;

        // Damping
        pd.velocities[i3]     *= 0.985;
        pd.velocities[i3 + 1] *= 0.990;
        pd.velocities[i3 + 2] *= 0.992;

        // Integrate position
        pd.positions[i3]     += pd.velocities[i3];
        pd.positions[i3 + 1] += pd.velocities[i3 + 1];
        pd.positions[i3 + 2] += pd.velocities[i3 + 2];

        // Boundary wrap
        if (pd.positions[i3 + 1] > 560) {
          pd.positions[i3 + 1] = -560;
          pd.velocities[i3 + 1] = Math.random() * 1.5 + 0.5;
        }
        if (pd.positions[i3] >  960) pd.positions[i3] = -960;
        if (pd.positions[i3] < -960) pd.positions[i3] =  960;

        // Flicker alpha
        pd.alphas[i] = Math.max(0.1, Math.min(0.9,
          pd.alphas[i] + (Math.random() - 0.5) * 0.03,
        ));

        // Depth-based opacity fade (DOF simulation)
        const zDepth = Math.abs(pd.positions[i3 + 2]) / 200;
        pd.alphas[i] *= Math.max(0.2, 1.0 - zDepth * 0.5);
      }

      if (pd.geometry) {
        (pd.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
        (pd.geometry.getAttribute('aAlpha')   as THREE.BufferAttribute).needsUpdate = true;
      }

      // ── 2. Panel physics (spring-damper) ─────────────────────────────
      const body    = panelBodyRef.current;
      const panel   = panelMeshRef.current;
      if (panel) {
        // Target position
        const oscY    = Math.sin(t * Math.PI * 2 * OSCILLATION_FREQ) * OSCILLATION_AMP;
        const hoverY  = isLev ? PANEL_HOVER_Y + oscY : oscY;
        const targetY = body.anchor.y + hoverY;

        // Spring force toward target
        const dy     = targetY - body.position.y;
        const spring = dy * SPRING_K;

        // Gravity force
        const gravForce = (grav * body.mass) * dt;

        // Update velocity
        body.velocity.y += spring + gravForce;
        body.velocity.y *= DAMPING;

        // Subtle X oscillation
        body.velocity.x += Math.sin(t * 1.3) * 0.08;
        body.velocity.x *= 0.97;
        body.velocity.z += Math.sin(t * 0.7) * 0.05;
        body.velocity.z *= 0.98;

        // Integrate
        body.position.add(body.velocity.clone().multiplyScalar(dt * 60));
        panel.position.copy(body.position);

        // Slight rotation for floating feel
        panel.rotation.x = Math.sin(t * 0.4) * 0.015;
        panel.rotation.y = Math.sin(t * 0.6) * 0.02;
        panel.rotation.z = Math.sin(t * 0.3) * 0.008;

        // DOF: opacity based on z
        const panelMat = panelMatRef.current;
        if (panelMat) {
          panelMat.opacity = Math.max(0.4, 1.0 - Math.abs(panel.position.z - 30) / 300);
        }

        // ── 3. Update tether line ────────────────────────────────────
        const tether = tetherRef.current;
        if (tether) {
          const posAttr = tether.geometry.getAttribute('position') as THREE.BufferAttribute;
          // Anchor end (ground-truth)
          posAttr.setXYZ(0, body.anchor.x, body.anchor.y, body.anchor.z);
          // Panel end
          posAttr.setXYZ(1, panel.position.x, panel.position.y, panel.position.z);
          posAttr.needsUpdate = true;

          // Tether color: redder when stretched
          const stretch = Math.abs(panel.position.y - body.anchor.y) / PANEL_HOVER_Y;
          const tMat = tetherMatRef.current;
          if (tMat) {
            (tMat.uniforms.uColor.value as THREE.Vector3).set(
              Math.min(1, stretch * 0.8),
              Math.max(0, 1 - stretch * 0.4),
              1.0,
            );
            tMat.uniforms.uTime.value = t;
          }
        }
      }

      // ── 4. HUD rotation ──────────────────────────────────────────────
      const hud    = hudRef.current;
      const hudMat = hudMatRef.current;
      if (hud && hudMat) {
        hudMat.uniforms.uTime.value       = t;
        hudMat.uniforms.uGravCoeff.value  = gravCoeffRef.current;
        hudMat.uniforms.uLevitation.value = levitationRef.current;

        // Pulse scale when levitation active
        const pulse = isLev ? 1 + Math.sin(t * 4.0) * 0.04 : 1.0;
        hud.scale.setScalar(pulse);
      }

      // ── 5. Shockwaves ────────────────────────────────────────────────
      shockwavesRef.current = shockwavesRef.current.filter(sw => {
        if (!sw.active) return false;
        sw.progress += dt * 0.5;  // expand speed
        sw.material.uniforms.uProgress.value = sw.progress;
        if (sw.progress >= 1.2) {
          if (scene) scene.remove(sw.mesh);
          sw.mesh.geometry.dispose();
          sw.material.dispose();
          return false;
        }
        return true;
      });

      // ── 6. Camera drift ──────────────────────────────────────────────
      if (camera) camera.position.x = Math.sin(t * 0.15) * 10;
      if (camera) camera.position.y = Math.cos(t * 0.12) * 6;
      if (camera) camera.lookAt(0, 0, 0);

      if (renderer && scene && camera) renderer.render(scene, camera);
    }

    animate();
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Score bounce impulse on score change ─────────────────────────────────
  const prevScoreRef = useRef(batting.score);
  useEffect(() => {
    const body = panelBodyRef.current;
    if (batting.score !== prevScoreRef.current) {
      // Bounce upward on score change
      body.velocity.y += levitation ? 4.0 : 1.5;
      body.velocity.x += (Math.random() - 0.5) * 1.2;
    }
    prevScoreRef.current = batting.score;
  }, [batting.score, levitation]);

  // ── Levitation toggle: instant velocity burst ─────────────────────────────
  useEffect(() => {
    const body = panelBodyRef.current;
    if (levitation) {
      body.velocity.y += 6.0;  // spring upward
    } else {
      body.velocity.y -= 2.0;  // fall back
    }
  }, [levitation]);

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width:    W,
        height:   H,
        pointerEvents: 'none',
        opacity,
      }}
    >
      {/* Three.js canvas mount */}
      <div
        ref={mountRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: W,
          height: H,
          pointerEvents: 'none',
        }}
      />

      {/* ── HUD Labels (CSS overlay) ──────────────────────────────────── */}
      <HudLabels
        gravCoeff={gravCoeff}
        levitation={levitation}
        score={batting.score}
        wickets={batting.wickets}
      />

      {/* ── Control Panel ────────────────────────────────────────────── */}
      {showControls && (
        <ControlPanel
          gravCoeff={gravCoeff}
          onGravChange={setGravCoeff}
          levitation={levitation}
          onLevitationToggle={() => setLevitation(v => !v)}
          onShockwave={type => spawnShockwave(type)}
        />
      )}

      {/* Toggle controls button */}
      <button
        onClick={() => setShowControls(v => !v)}
        style={{
          position:    'absolute',
          bottom:      160,
          right:       24,
          pointerEvents: 'auto',
          background:  'rgba(0,0,0,0.6)',
          border:      '1px solid rgba(0,245,255,0.3)',
          color:       '#00f5ff',
          fontSize:    11,
          fontFamily:  'monospace',
          padding:     '4px 10px',
          borderRadius: 6,
          cursor:      'pointer',
          letterSpacing: '0.1em',
        }}
      >
        {showControls ? '◀ HIDE HUD' : '▶ SHOW HUD'}
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// HUD LABELS — CSS text overlays
// ─────────────────────────────────────────────────────────────────────────────

interface HudLabelsProps {
  gravCoeff:  number;
  levitation: boolean;
  score:      number;
  wickets:    number;
}

const HudLabels: React.FC<HudLabelsProps> = ({ gravCoeff, levitation, score, wickets }) => {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 500);
    return () => clearInterval(id);
  }, []);

  const blink = tick % 2 === 0;

  return (
    <>
      {/* Top-left: system status */}
      <div style={{
        position:   'absolute',
        top:        24,
        left:       24,
        fontFamily: 'monospace',
        fontSize:   11,
        lineHeight: 1.8,
        color:      levitation ? '#00f5ff' : '#94a3b8',
        pointerEvents: 'none',
        textShadow: levitation ? '0 0 8px #00f5ff' : 'none',
      }}>
        <div>ANTI-GRAV OVERLAY v2.0</div>
        <div>G-COEFF: {gravCoeff.toFixed(2)} G</div>
        <div>EFFECTIVE: {(gravCoeff * -9.8).toFixed(2)} m/s²</div>
        <div style={{ color: levitation ? '#00ff88' : '#64748b' }}>
          {blink && levitation ? '⬆ LEVITATION ACTIVE' : levitation ? '⬆ LEVITATION ACTIVE' : '  GROUND MODE'}
        </div>
      </div>

      {/* Top-right HUD label */}
      <div style={{
        position:   'absolute',
        top:        24,
        right:      24,
        fontFamily: 'monospace',
        fontSize:   10,
        textAlign:  'right',
        color:      '#64748b',
        pointerEvents: 'none',
      }}>
        <div>G-FORCE NULL</div>
        <div style={{ color: '#00f5ff', fontSize: 13, fontWeight: 700 }}>◉ ACTIVE</div>
      </div>

      {/* Anchor point indicator (bottom center) */}
      <div style={{
        position:   'absolute',
        bottom:     200,
        left:       '50%',
        transform:  'translateX(-50%)',
        fontFamily: 'monospace',
        fontSize:   10,
        color:      'rgba(0,245,255,0.4)',
        pointerEvents: 'none',
        textAlign:  'center',
      }}>
        <div>╌╌╌╌╌╌╌╌ ANCHOR ╌╌╌╌╌╌╌╌</div>
        <div>⊕</div>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTROL PANEL
// ─────────────────────────────────────────────────────────────────────────────

interface ControlPanelProps {
  gravCoeff:          number;
  onGravChange:       (v: number) => void;
  levitation:         boolean;
  onLevitationToggle: () => void;
  onShockwave:        (type: 'wicket' | 'six' | 'four') => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  gravCoeff,
  onGravChange,
  levitation,
  onLevitationToggle,
  onShockwave,
}) => {
  const panelStyle: React.CSSProperties = {
    position:      'absolute',
    bottom:        24,
    right:         24,
    width:         280,
    background:    'rgba(5, 10, 30, 0.88)',
    border:        `1px solid ${levitation ? 'rgba(0,245,255,0.5)' : 'rgba(255,199,44,0.3)'}`,
    borderRadius:  12,
    padding:       '16px 18px',
    pointerEvents: 'auto',
    fontFamily:    'monospace',
    backdropFilter: 'blur(12px)',
    boxShadow:     levitation
      ? '0 0 24px rgba(0,245,255,0.2), inset 0 0 20px rgba(0,245,255,0.03)'
      : '0 0 24px rgba(255,199,44,0.15)',
  };

  const labelStyle: React.CSSProperties = {
    fontSize:    10,
    color:       '#64748b',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    marginBottom: 4,
  };

  const gravPercent = ((gravCoeff - (-2)) / 4) * 100;

  return (
    <div style={panelStyle}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#00f5ff', letterSpacing: '0.1em' }}>
          ANTI-GRAV CONTROLS
        </span>
        <span style={{
          fontSize:    9,
          color:       levitation ? '#00ff88' : '#475569',
          border:      `1px solid ${levitation ? '#00ff88' : '#475569'}`,
          padding:     '2px 6px',
          borderRadius: 4,
        }}>
          {levitation ? '↑ LEV' : '↓ GND'}
        </span>
      </div>

      {/* Gravity Coefficient Slider */}
      <div style={{ marginBottom: 16 }}>
        <div style={labelStyle}>Gravity Coefficient</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input
            type="range"
            min={-2.0}
            max={2.0}
            step={0.01}
            value={gravCoeff}
            onChange={e => onGravChange(parseFloat(e.target.value))}
            style={{
              flex:       1,
              accentColor: levitation ? '#00f5ff' : '#ffc72c',
              cursor:     'pointer',
            }}
          />
          <span style={{
            fontSize:    12,
            fontWeight:  700,
            color:       gravCoeff < 0 ? '#00f5ff' : '#ffc72c',
            minWidth:    42,
            textAlign:   'right',
          }}>
            {gravCoeff > 0 ? '+' : ''}{gravCoeff.toFixed(2)}G
          </span>
        </div>

        {/* Visual gravity bar */}
        <div style={{
          height:       4,
          background:   'rgba(255,255,255,0.05)',
          borderRadius: 2,
          marginTop:    6,
          overflow:     'hidden',
        }}>
          <div style={{
            height:       '100%',
            width:        `${gravPercent}%`,
            background:   gravCoeff < 0
              ? 'linear-gradient(90deg, transparent, #00f5ff)'
              : 'linear-gradient(90deg, transparent, #ffc72c)',
            transition:   'width 0.1s ease',
          }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
          <span style={{ fontSize: 9, color: '#00f5ff' }}>-2G ↑</span>
          <span style={{ fontSize: 9, color: '#64748b' }}>0G</span>
          <span style={{ fontSize: 9, color: '#ffc72c' }}>+2G ↓</span>
        </div>
      </div>

      {/* Levitation Toggle */}
      <div style={{ marginBottom: 16 }}>
        <div style={labelStyle}>Levitation Mode</div>
        <button
          onClick={onLevitationToggle}
          style={{
            width:         '100%',
            padding:       '10px 0',
            border:        `2px solid ${levitation ? '#00f5ff' : 'rgba(255,255,255,0.1)'}`,
            borderRadius:  8,
            background:    levitation
              ? 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(0,100,200,0.1))'
              : 'rgba(255,255,255,0.04)',
            color:         levitation ? '#00f5ff' : '#64748b',
            fontSize:      13,
            fontWeight:    900,
            fontFamily:    'monospace',
            letterSpacing: '0.15em',
            cursor:        'pointer',
            boxShadow:     levitation ? '0 0 16px rgba(0,245,255,0.25)' : 'none',
            transition:    'all 0.25s ease',
          }}
        >
          {levitation ? '⬆ LEVITATION ON' : '⬆ LEVITATION OFF'}
        </button>
      </div>

      {/* Event Triggers */}
      <div>
        <div style={labelStyle}>Trigger Shockwave</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {([
            { type: 'six',    label: '6',      color: '#00ff88' },
            { type: 'four',   label: '4',      color: '#ffc72c' },
            { type: 'wicket', label: 'W',      color: '#ff2244' },
          ] as const).map(({ type, label, color }) => (
            <button
              key={type}
              onClick={() => onShockwave(type)}
              style={{
                flex:          1,
                padding:       '8px 0',
                border:        `1px solid ${color}44`,
                borderRadius:  6,
                background:    `${color}11`,
                color,
                fontSize:      14,
                fontWeight:    900,
                fontFamily:    'monospace',
                cursor:        'pointer',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Effective G display */}
      <div style={{
        marginTop:    12,
        padding:      '8px 12px',
        background:   'rgba(0,0,0,0.3)',
        borderRadius: 6,
        fontSize:     10,
        color:        '#475569',
        display:      'flex',
        justifyContent: 'space-between',
      }}>
        <span>Effective G</span>
        <span style={{ color: '#94a3b8', fontWeight: 700 }}>
          {(gravCoeff * -9.8).toFixed(2)} m/s²
        </span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MINI PANEL TEXTURE (over ball dots secondary panel)
// ─────────────────────────────────────────────────────────────────────────────

function buildMiniPanelTexture(
  overs: number,
  balls: number,
  recentBalls: string[],
): THREE.CanvasTexture {
  const cv  = document.createElement('canvas');
  cv.width  = 320;
  cv.height = 90;
  const ctx = cv.getContext('2d')!;

  ctx.fillStyle = 'rgba(5, 8, 30, 0.88)';
  ctx.roundRect(0, 0, 320, 90, 12);
  ctx.fill();

  ctx.strokeStyle = 'rgba(0,245,255,0.4)';
  ctx.lineWidth   = 1.5;
  ctx.roundRect(1, 1, 318, 88, 11);
  ctx.stroke();

  ctx.font      = 'bold 12px monospace';
  ctx.fillStyle = '#64748b';
  ctx.textAlign = 'center';
  ctx.fillText(`OVER ${overs}.${balls}`, 160, 22);

  // Ball dots
  const colors: Record<string, string> = {
    '6': '#16a34a', '4': '#d97706', 'W': '#dc2626',
    'WD': '#7c3aed', 'NB': '#ea580c', '0': '#1e293b',
  };
  const recent = recentBalls.slice(-6);
  const startX = 160 - (recent.length * 22) / 2;
  recent.forEach((ball, i) => {
    const x = startX + i * 22 + 11;
    ctx.beginPath();
    ctx.arc(x, 55, 9, 0, Math.PI * 2);
    ctx.fillStyle = colors[ball] || '#334155';
    ctx.fill();
    ctx.font      = 'bold 8px monospace';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText(ball === '0' ? '·' : ball.slice(0, 2), x, 58.5);
  });

  return new THREE.CanvasTexture(cv);
}

export default AntiGravityOverlay;
