/**
 * 可視化グラフィックモジュール (Advanced Graphics Canvas module)
 * ワゴンホイール(Wagon Wheel)、ピッチマップ(Pitch Map)、マンハッタンチャート(Manhattan Chart)を描画。
 */

// 1. ワゴンホイール描画 (Wagon Wheel Chart)
export function drawWagonWheel(canvasId, shots = []) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(w, h) / 2.2;

  ctx.clearRect(0, 0, w, h);

  // 外野境界線 (Outfield boundary circle)
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // 内野サークル (Infield circle)
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.6, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.setLineDash([5, 5]);
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.setLineDash([]);

  // ピッチの簡略図 (Simplified Pitch Center)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.fillRect(cx - 6, cy - 20, 12, 40);

  // 各ショットのライン描画
  shots.forEach(shot => {
    const rad = (shot.angle - 90) * (Math.PI / 180);
    const endX = cx + Math.cos(rad) * radius * (shot.runs >= 6 ? 1.0 : shot.runs >= 4 ? 0.95 : 0.6);
    const endY = cy + Math.sin(rad) * radius * (shot.runs >= 6 ? 1.0 : shot.runs >= 4 ? 0.95 : 0.6);

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(endX, endY);

    // 得点に応じた色分け (Runs color coding)
    if (shot.runs === 6) {
      ctx.strokeStyle = '#eab308'; // ゴールド (6s)
      ctx.lineWidth = 3;
    } else if (shot.runs === 4) {
      ctx.strokeStyle = '#38bdf8'; // シアン (4s)
      ctx.lineWidth = 2;
    } else {
      ctx.strokeStyle = '#10b981'; // グリーン (1s, 2s, 3s)
      ctx.lineWidth = 1.5;
    }
    ctx.stroke();

    // 先端のドット
    ctx.beginPath();
    ctx.arc(endX, endY, shot.runs >= 4 ? 4 : 2.5, 0, Math.PI * 2);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();
  });
}

// 2. ピッチマップ描画 (Pitch Map Chart)
export function drawPitchMap(canvasId, balls = []) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // ピッチ枠 (Pitch boundaries)
  const pitchW = w * 0.4;
  const pitchH = h * 0.9;
  const px = (w - pitchW) / 2;
  const py = (h - pitchH) / 2;

  // 芝生の背景
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.fillRect(0, 0, w, h);

  // ピッチの土面
  ctx.fillStyle = 'rgba(217, 119, 6, 0.08)';
  ctx.fillRect(px, py, pitchW, pitchH);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2;
  ctx.strokeRect(px, py, pitchW, pitchH);

  // ポップクリーズと切り株ライン (Crease & Stumps Lines)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.beginPath();
  ctx.moveTo(px, py + pitchH * 0.15); // ボウリングクリーズ
  ctx.lineTo(px + pitchW, py + pitchH * 0.15);
  ctx.moveTo(px, py + pitchH * 0.85); // ポッピングクリーズ
  ctx.lineTo(px + pitchW, py + pitchH * 0.85);
  ctx.stroke();

  // ボールのバウンド位置をプロット
  balls.forEach(ball => {
    // 座標のスケール変換
    const bx = px + (ball.x / 100) * pitchW;
    const by = py + (ball.y / 100) * pitchH;

    ctx.beginPath();
    ctx.arc(bx, by, 6, 0, Math.PI * 2);

    // バウンドの長さ(長さ)に応じた色分け (Pitch bounce length classification)
    if (ball.type === "short") {
      ctx.fillStyle = '#ef4444'; // レッド (ショート - バウンサー)
    } else if (ball.type === "good") {
      ctx.fillStyle = '#10b981'; // グリーン (グッドレングス)
    } else {
      ctx.fillStyle = '#3b82f6'; // ブルー (フルレングス - ヨーカー)
    }
    
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();
  });
}

// 3. マンハッタンチャート (Manhattan Chart / Run Rate Chart)
export function drawManhattanChart(canvasId, oversData = []) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  const padding = 25;
  const chartW = w - padding * 2;
  const chartH = h - padding * 2;
  const maxRuns = Math.max(...oversData, 12); // 最低Y軸スケールは12点

  const barCount = oversData.length;
  const barW = (chartW / barCount) * 0.7;
  const gap = (chartW / barCount) * 0.3;

  // X軸/Y軸の基準線
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, h - padding);
  ctx.lineTo(w - padding, h - padding);
  ctx.stroke();

  // オーバーの棒を描画
  oversData.forEach((runs, idx) => {
    const barH = (runs / maxRuns) * chartH;
    const bx = padding + idx * (barW + gap) + gap / 2;
    const by = h - padding - barH;

    // グラデーションバーの作成
    const grad = ctx.createLinearGradient(bx, by, bx, h - padding);
    grad.addColorStop(0, 'var(--sb-accent, #38bdf8)');
    grad.addColorStop(1, 'var(--sb-secondary, #1e3a8a)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(bx, by, barW, barH, [4, 4, 0, 0]);
    ctx.fill();

    // 得点数のテキスト表記
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(runs.toString(), bx + barW / 2, by - 4);

    // オーバー番号
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '9px sans-serif';
    ctx.fillText((idx + 1).toString(), bx + barW / 2, h - padding + 12);
  });
}
