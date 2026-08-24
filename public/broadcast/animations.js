/**
 * 高度なグラフィックス・アニメーションエンジン (Advanced GSAP Animation Engine)
 * GSAPとCanvasを利用し、デジタルスロットロール、祝賀エフェクト、DRSレビューを制御。
 */

import { eventBus, EVENT_TYPES } from './events.js';

let currentDigits = { '100': 0, '10': 0, '1': 0, 'w': 0 };

// 1. スロットマシン風の数値ロール (Slot machine digit roll)
export function rollDigit(digitKey, targetValue) {
  const elementId = `digit-${digitKey}`;
  const container = document.getElementById(elementId);
  if (!container) return;

  const strip = container.querySelector('.digit-strip');
  const offset = targetValue * 40; // 1桁あたり40pxの高さ

  if (currentDigits[digitKey] !== targetValue) {
    currentDigits[digitKey] = targetValue;
    
    // 単独の桁をGSAPで弾性アニメーション (Elastic ease out per digit)
    gsap.to(strip, {
      y: -offset,
      duration: 0.65,
      ease: "back.out(1.4)"
    });
  }
}

// 2. イニングスコアの瞬間反映 (Instant UI score sync)
export function setInstantScore(runs, wickets) {
  const rVal = runs.toString().padStart(3, '0');
  const digitHundreds = parseInt(rVal[0]);
  const digitTens = parseInt(rVal[1]);
  const digitOnes = parseInt(rVal[2]);
  
  gsap.set(`#digit-100 .digit-strip`, { y: -(digitHundreds * 40) });
  gsap.set(`#digit-10 .digit-strip`, { y: -(digitTens * 40) });
  gsap.set(`#digit-1 .digit-strip`, { y: -(digitOnes * 40) });
  gsap.set(`#digit-w .digit-strip`, { y: -(wickets * 40) });
  
  currentDigits = { '100': digitHundreds, '10': digitTens, '1': digitOnes, 'w': wickets };
}

// 3. 画面の揺れ効果 (Screen Shake)
export function triggerScreenShake() {
  const root = document.getElementById('scoreboard-root');
  if (!root) return;

  const tl = gsap.timeline();
  tl.to(root, { x: "+=12", y: "-=5", duration: 0.05, repeat: 5, yoyo: true })
    .to(root, { x: 0, y: 0, duration: 0.05 });
}

// 4. フラッシュオーバーレイアニメーション (Boundary & Wicket Flash)
export function triggerActionFlash(text, color) {
  const banner = document.getElementById('event-flash');
  const label = document.getElementById('event-text');
  if (!banner || !label) return;

  label.innerText = text;
  
  // バナーのボーダー色を設定
  banner.firstElementChild.style.borderColor = color;

  // 以前のアニメーションをクリア
  gsap.killTweensOf([banner, label]);

  const tl = gsap.timeline();
  tl.to(banner, {
    opacity: 1,
    scale: 1.05,
    backdropFilter: "blur(8px)",
    duration: 0.35,
    ease: "back.out(1.5)"
  })
  .to(banner, {
    scale: 1,
    duration: 0.1
  })
  .to(banner, {
    opacity: 0,
    scale: 0.95,
    backdropFilter: "blur(0px)",
    duration: 0.3,
    delay: 1.8,
    ease: "power2.in"
  });

  // パーティクルの爆発エフェクトを発生
  createParticles(color);
}

// 5. パーティクル祝賀システム (Particle Celebration System)
function createParticles(color) {
  const container = document.getElementById('particle-container');
  if (!container) return;
  container.innerHTML = '';

  const count = 50;
  const w = window.innerWidth;
  const h = window.innerHeight;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.style.position = 'absolute';
    p.style.width = gsap.utils.random(8, 18) + 'px';
    p.style.height = p.style.width;
    
    // 紙吹雪とスパークのブレンド
    if (Math.random() > 0.5) {
      p.style.borderRadius = '50%'; // 丸スパーク
    } else {
      p.style.transform = `rotate(${gsap.utils.random(0, 360)}deg)`; // 四角い紙吹雪
    }

    p.style.backgroundColor = color;
    p.style.left = '50%';
    p.style.top = '75%';
    p.style.boxShadow = `0 0 10px ${color}`;

    container.appendChild(p);

    // 放物線状の飛散軌道 (Parabolic trajectories)
    gsap.to(p, {
      x: gsap.utils.random(-w * 0.4, w * 0.4),
      y: gsap.utils.random(-h * 0.5, -h * 0.1),
      rotation: gsap.utils.random(-720, 720),
      opacity: 0,
      scale: 0.2,
      duration: gsap.utils.random(1.5, 2.5),
      ease: "power3.out"
    });
  }
}

// 6. DRS 3審アニメーション (DRS Third-Umpire Review Simulation)
export function runDRSReview(outcome, callback) {
  const overlay = document.getElementById('drs-overlay');
  const signalText = document.getElementById('drs-signal-text');
  if (!overlay || !signalText) return;

  // DRSスクリーンをフェードイン
  gsap.killTweensOf([overlay, signalText]);
  
  overlay.classList.remove('hidden');
  signalText.innerText = "DRS REVIEW PENDING...";
  signalText.className = "text-amber-400 text-3xl font-black tracking-widest uppercase animate-pulse";

  const tl = gsap.timeline();
  tl.to(overlay, {
    opacity: 1,
    duration: 0.4
  })
  .to(signalText, {
    text: "DIRECTOR CHECKING SPIN LINE...",
    duration: 1.5,
    delay: 1
  })
  .to(signalText, {
    text: "TRACKING PATHWAY...",
    duration: 1.5
  })
  .to(signalText, {
    text: `OUTCOME: ${outcome}`,
    duration: 0.1,
    onStart: () => {
      signalText.classList.remove('animate-pulse');
      if (outcome.toUpperCase() === 'OUT') {
        signalText.className = "text-red-500 text-5xl font-black tracking-widest uppercase border-4 border-red-500 px-6 py-2 rounded bg-red-950/20";
        triggerScreenShake();
      } else {
        signalText.className = "text-emerald-500 text-5xl font-black tracking-widest uppercase border-4 border-emerald-500 px-6 py-2 rounded bg-emerald-950/20";
      }
    }
  })
  .to(overlay, {
    opacity: 0,
    duration: 0.5,
    delay: 2.5,
    onComplete: () => {
      overlay.classList.add('hidden');
      if (callback) callback();
    }
  });
}

// 7. シーン切り替えアニメーション (Scene transitions)
export function transitionScene(targetScene, applyLayoutChanges) {
  const overlayWrap = document.getElementById('scoreboard-root');
  if (!overlayWrap) return;

  // 3D Flip Card Scene transition
  gsap.to(overlayWrap, {
    rotationY: 90,
    opacity: 0,
    scale: 0.95,
    duration: 0.35,
    ease: "power2.in",
    onComplete: () => {
      // 状態変更を呼び出し
      applyLayoutChanges();
      
      // 再度めくって表示
      gsap.to(overlayWrap, {
        rotationY: 0,
        opacity: 1,
        scale: 1,
        duration: 0.45,
        ease: "back.out(1.2)"
      });
    }
  });
}
