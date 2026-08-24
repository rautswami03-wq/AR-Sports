/**
 * CricScorer PRO Broadcast Application Controller (app.js)
 * 状態ストア、イベントバス、各種描画レンダラーを統合調整するメインコントローラ。
 */

import { store, ACTION_TYPES } from './state.js';
import { eventBus, EVENT_TYPES } from './events.js';
import { applyTheme, THEME_CONFIGS } from './themes.js';
import { drawManhattanChart, drawWagonWheel, drawPitchMap } from './charts.js';
import { rollDigit, setInstantScore, transitionScene, triggerActionFlash } from './animations.js';
import { startSimulation, stopSimulation } from './mockData.js';

// 初期化フラグ
let isInitialized = false;

document.addEventListener('DOMContentLoaded', () => {
  setupUIEvents();
  
  // 状態監視購読 (Subscribe to state changes)
  store.subscribe((state, prev) => {
    updateView(state, prev);
  });

  // 初期テーマとインシデントの適用
  const state = store.getState();
  applyTheme(state.config.themeId, state.config.variant, state.config.layout);
  setInstantScore(state.match.teamA.score, state.match.teamA.wickets);
  
  isInitialized = true;
  updateView(state, state);

  // デモ自動対戦のスタート
  startSimulation();
});

// UIコントロール操作のイベント割当て
function setupUIEvents() {
  // ショートカットキー (H: コントロールパネルの表示/非表示)
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'h') {
      const panel = document.getElementById('control-panel');
      panel.classList.toggle('translate-x-0');
      panel.classList.toggle('-translate-x-full');
    }
  });

  // ドロワー非表示ボタン
  document.getElementById('toggle-drawer-btn').addEventListener('click', () => {
    const panel = document.getElementById('control-panel');
    panel.classList.add('-translate-x-full');
    panel.classList.remove('translate-x-0');
  });

  // シミュレーション自動再生切替
  document.getElementById('autoplay-chk').addEventListener('change', (e) => {
    if (e.target.checked) {
      startSimulation();
    } else {
      stopSimulation();
    }
  });

  // テーマ変更選択
  const themeSelect = document.getElementById('theme-select');
  themeSelect.addEventListener('change', (e) => {
    store.dispatch({ type: ACTION_TYPES.SET_THEME, payload: e.target.value });
    applyTheme(e.target.value, store.getState().config.variant, store.getState().config.layout);
  });

  // バリアント切替
  const variantSelect = document.getElementById('variant-select');
  variantSelect.addEventListener('change', (e) => {
    store.dispatch({ type: ACTION_TYPES.SET_VARIANT, payload: e.target.value });
    applyTheme(store.getState().config.themeId, e.target.value, store.getState().config.layout);
  });

  // レイアウト切替
  const layoutSelect = document.getElementById('layout-select');
  layoutSelect.addEventListener('change', (e) => {
    store.dispatch({ type: ACTION_TYPES.SET_LAYOUT, payload: e.target.value });
    applyTheme(store.getState().config.themeId, store.getState().config.variant, e.target.value);
  });

  // シーン切替
  const sceneSelect = document.getElementById('scene-select');
  sceneSelect.addEventListener('change', (e) => {
    const targetScene = e.target.value;
    
    // Scene transition wrapper
    transitionScene(targetScene, () => {
      store.dispatch({ type: ACTION_TYPES.SET_SCENE, payload: targetScene });
    });
  });

  // トグル可能パネルのリスナー
  const toggles = [
    { id: 'toggle-batting', key: 'batting' },
    { id: 'toggle-bowling', key: 'bowling' },
    { id: 'toggle-partnership', key: 'partnership' },
    { id: 'toggle-wagon', key: 'wagonWheel' },
    { id: 'toggle-pitch', key: 'pitchMap' },
    { id: 'toggle-manhattan', key: 'runRateChart' },
    { id: 'toggle-commentary', key: 'commentary' }
  ];

  toggles.forEach(({ id, key }) => {
    const chk = document.getElementById(id);
    chk.addEventListener('change', () => {
      store.dispatch({ type: ACTION_TYPES.TOGGLE_PANEL, payload: key });
    });
  });

  // 手動フラッシュイベント
  window.triggerEventFlash = (text, color) => {
    triggerActionFlash(text, color);
  };
}

// ビューとDOMの差分更新
function updateView(state, prev) {
  const match = state.match;
  const config = state.config;

  // 1. スコア・イニング表示の差分更新 (Digit roll)
  if (!isInitialized) {
    setInstantScore(match.teamA.score, match.teamA.wickets);
  } else if (match.teamA.score !== prev.match.teamA.score || match.teamA.wickets !== prev.match.teamA.wickets) {
    const rVal = match.teamA.score.toString().padStart(3, '0');
    rollDigit('100', parseInt(rVal[0]));
    rollDigit('10', parseInt(rVal[1]));
    rollDigit('1', parseInt(rVal[2]));
    rollDigit('w', match.teamA.wickets);
  }

  // 2. 基本情報の反映
  document.getElementById('team-batting-name').innerText = match.teamA.name;
  document.getElementById('match-overs').innerText = match.teamA.overs.toFixed(1);

  // 3. 打者 (Batting segment)
  const bat1 = match.batting.current[0];
  const bat2 = match.batting.current[1];
  
  if (bat1) {
    document.getElementById('bat1-name').innerText = bat1.name;
    document.getElementById('bat1-stats').innerHTML = `${bat1.runs} <span class="text-[11px] font-bold opacity-60">${bat1.balls}</span>`;
    
    const sDot = document.getElementById('bat1-strike');
    if (bat1.isStriker) {
      sDot.className = 'w-1.5 h-1.5 rounded-full active-striker-dot shrink-0';
      document.getElementById('bat1-card').classList.remove('opacity-50');
    } else {
      sDot.className = 'w-1.5 h-1.5 rounded-full bg-slate-500/20 shrink-0';
      document.getElementById('bat1-card').classList.add('opacity-50');
    }
  }

  if (bat2) {
    document.getElementById('bat2-name').innerText = bat2.name;
    document.getElementById('bat2-stats').innerHTML = `${bat2.runs} <span class="text-[11px] font-bold opacity-60">${bat2.balls}</span>`;
    
    const sDot = document.getElementById('bat2-strike');
    if (bat2.isStriker) {
      sDot.className = 'w-1.5 h-1.5 rounded-full active-striker-dot shrink-0';
      document.getElementById('bat2-card').classList.remove('opacity-50');
    } else {
      sDot.className = 'w-1.5 h-1.5 rounded-full bg-slate-500/20 shrink-0';
      document.getElementById('bat2-card').classList.add('opacity-50');
    }
  }

  // 4. ボウラー (Bowling segment)
  const bowler = match.bowling.current[0];
  if (bowler) {
    document.getElementById('bowl-name').innerText = bowler.name;
    document.getElementById('bowl-stats').innerHTML = `${bowler.wickets}-${bowler.runs} <span class="text-[11px] font-bold opacity-60">(${bowler.overs})</span>`;
  }

  // 5. ターゲット計算
  const targetRuns = match.teamA.target - match.teamA.score;
  const wholeOvers = Math.floor(match.teamA.overs);
  const ballsLeft = 120 - Math.round(wholeOvers * 6 + (match.teamA.overs % 1) * 10);
  const crr = (match.teamA.score / match.teamA.overs).toFixed(2);
  
  document.getElementById('ticker-text').innerText = `CRR: ${crr}`;

  if (targetRuns > 0 && ballsLeft > 0) {
    const rrr = ((targetRuns / ballsLeft) * 6).toFixed(2);
    document.getElementById('bottom-ticker-text').innerText = `${match.teamA.name} NEED ${targetRuns} RUNS IN ${ballsLeft} BALLS (REQ: ${rrr})`;
  } else {
    document.getElementById('bottom-ticker-text').innerText = `TARGET MET OR INNINGS ENDED`;
  }

  // 6. コメンタリーティッカー (Commentary Ticker)
  if (config.activePanels.commentary) {
    document.getElementById('ticker-wrapper').classList.remove('hidden');
    document.getElementById('ticker-log').innerText = match.commentary.lastBall;
  } else {
    document.getElementById('ticker-wrapper').classList.add('hidden');
  }

  // 7. パネルのトグル制御 (Toggle panels grid visibility)
  toggleDOMPanel('panel-batting', config.activePanels.batting);
  toggleDOMPanel('panel-bowling', config.activePanels.bowling);
  toggleDOMPanel('panel-partnership', config.activePanels.partnership);
  toggleDOMPanel('panel-wagonwheel', config.activePanels.wagonWheel);
  toggleDOMPanel('panel-pitchmap', config.activePanels.pitchMap);
  toggleDOMPanel('panel-manhattan', config.activePanels.runRateChart);

  // アクティブなチャートの再描画 (Redraw Canvas charts)
  if (config.activePanels.wagonWheel) {
    drawWagonWheel('canvas-wagonwheel', match.charts.wagonWheel);
  }
  if (config.activePanels.pitchMap) {
    drawPitchMap('canvas-pitchmap', match.charts.pitchMap);
  }
  if (config.activePanels.runRateChart) {
    drawManhattanChart('canvas-manhattan', match.charts.last10Overs);
  }

  // 8. シーン/ビュー全体の制御 (Overlay Scenes management)
  const root = document.getElementById('scoreboard-root');
  if (config.scene === 'scorebug') {
    root.classList.remove('hidden');
    document.getElementById('fullcard-scene').classList.add('hidden');
    document.getElementById('adbreak-scene').classList.add('hidden');
  } else if (config.scene === 'fullcard') {
    root.classList.add('hidden');
    document.getElementById('fullcard-scene').classList.remove('hidden');
    document.getElementById('adbreak-scene').classList.add('hidden');
    
    // フルスコアカード表示データの注入
    renderFullScorecard(match);
  } else if (config.scene === 'adbreak') {
    root.classList.add('hidden');
    document.getElementById('fullcard-scene').classList.add('hidden');
    document.getElementById('adbreak-scene').classList.remove('hidden');
  }

  // スポンサー表示
  document.getElementById('sponsor-logo-box').innerText = config.sponsor.logo;
  document.getElementById('sponsor-overlay-name').innerText = config.sponsor.name;
}

function toggleDOMPanel(id, isActive) {
  const el = document.getElementById(id);
  if (el) {
    if (isActive) {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  }
}

// フルスコアカードのHTML描画
function renderFullScorecard(match) {
  const tbody = document.getElementById('fullcard-tbody');
  tbody.innerHTML = '';
  
  // 打者リストのループレンダリング
  match.batting.current.forEach(b => {
    const tr = document.createElement('tr');
    tr.className = "border-b border-white/5 hover:bg-white/5 text-sm";
    tr.innerHTML = `
      <td class="py-3 px-4 font-black uppercase text-slate-100">${b.name} ${b.isStriker ? '*' : ''}</td>
      <td class="py-3 px-4 font-semibold text-slate-400">not out</td>
      <td class="py-3 px-4 text-right font-black text-slate-100 text-lg">${b.runs}</td>
      <td class="py-3 px-4 text-right font-medium text-slate-400">${b.balls}</td>
      <td class="py-3 px-4 text-right font-medium text-slate-400">${b.fours}</td>
      <td class="py-3 px-4 text-right font-medium text-slate-400">${b.sixes}</td>
      <td class="py-3 px-4 text-right font-bold text-sky-400">${b.sr}</td>
    `;
    tbody.appendChild(tr);
  });
}
