/**
 * モック・シミュレータモジュール (Live Broadcast Simulator)
 * リアルタイムの試合経過を疑似シミュレーションし、Pub/Subイベントを発火。
 */

import { store } from './state.js';
import { eventBus, EVENT_TYPES } from './events.js';
import { triggerActionFlash, runDRSReview, triggerScreenShake } from './animations.js';

let simulatorInterval = null;

export function startSimulation() {
  if (simulatorInterval) return;

  simulatorInterval = setInterval(() => {
    simulateBall();
  }, 6000); // 6秒おきに1球シミュレーション
}

export function stopSimulation() {
  if (simulatorInterval) {
    clearInterval(simulatorInterval);
    simulatorInterval = null;
  }
}

function simulateBall() {
  const state = store.getState();
  const match = JSON.parse(JSON.stringify(state.match)); // クローン作成

  // オーバーの加算
  let balls = Math.round((match.teamA.overs % 1) * 10) + 1;
  let overs = Math.floor(match.teamA.overs);
  
  if (balls >= 6) {
    balls = 0;
    overs += 1;
    eventBus.publish(EVENT_TYPES.OVER_CHANGE, overs);
  }
  
  match.teamA.overs = parseFloat(`${overs}.${balls}`);

  // ランダムなイベントタイプ選択 (Dot, Single, Boundary, Wicket, Extras, DRS)
  const rng = Math.random();
  let runsScored = 0;
  let extraText = '';

  if (rng < 0.08) {
    // Wicket (DRS 発生の可能性あり)
    if (Math.random() > 0.6) {
      // DRS発動!
      stopSimulation();
      runDRSReview(Math.random() > 0.4 ? 'OUT' : 'NOT OUT', () => {
        // DRSレビュー完了後の試合再開処理
        const confirmOut = Math.random() > 0.3;
        if (confirmOut) {
          handleWicket(match);
        } else {
          // NOT OUT
          match.commentary.lastBall = "DRS Verdict: NOT OUT. Play resumes.";
          match.commentary.history.unshift(`Over ${match.teamA.overs}: NOT OUT (DRS Review)`);
          store.dispatch({ type: 'UPDATE_MATCH', payload: match });
        }
        startSimulation();
      });
      return;
    } else {
      handleWicket(match);
      return;
    }
  } else if (rng < 0.22) {
    // Boundary 4
    runsScored = 4;
    match.teamA.score += 4;
    match.batting.partnership.runs += 4;
    updateBatterRuns(match, 4);
    match.bowling.current[0].runs += 4;
    
    match.commentary.lastBall = `Starc to Batter, FOUR RUNS! Elegant cover drive.`;
    match.commentary.history.unshift(`Over ${match.teamA.overs}: FOUR runs`);
    
    // イベント発火
    eventBus.publish(EVENT_TYPES.BOUNDARY, { runs: 4, label: 'FOUR!' });
    triggerActionFlash('FOUR!', '#10b981');
  } else if (rng < 0.32) {
    // Boundary 6
    runsScored = 6;
    match.teamA.score += 6;
    match.batting.partnership.runs += 6;
    updateBatterRuns(match, 6);
    match.bowling.current[0].runs += 6;

    match.commentary.lastBall = `Starc to Batter, SIX RUNS! High and handsome over deep mid-wicket.`;
    match.commentary.history.unshift(`Over ${match.teamA.overs}: SIX runs`);

    // イベント発火
    eventBus.publish(EVENT_TYPES.BOUNDARY, { runs: 6, label: 'SIX!' });
    triggerActionFlash('SIX!', '#10b981');
  } else if (rng < 0.4) {
    // Extras (Wide / No Ball)
    runsScored = 1;
    match.teamA.score += 1;
    match.batting.partnership.runs += 1;
    match.bowling.current[0].runs += 1;
    
    const isWide = Math.random() > 0.5;
    extraText = isWide ? 'WIDE' : 'NO BALL';
    match.commentary.lastBall = `Starc to Batter, Extra (${extraText})`;
    match.commentary.history.unshift(`Over ${match.teamA.overs}: ${extraText}`);

    // ボール数はカウントしない (オーバーロールバック)
    balls = Math.max(0, balls - 1);
    match.teamA.overs = parseFloat(`${overs}.${balls}`);

    // イベント発火
    eventBus.publish(EVENT_TYPES.EXTRA, extraText);
    triggerActionFlash(extraText, '#f59e0b');
  } else if (rng < 0.65) {
    // Single / Rotations
    runsScored = 1;
    match.teamA.score += 1;
    match.batting.partnership.runs += 1;
    updateBatterRuns(match, 1);
    match.bowling.current[0].runs += 1;

    match.commentary.lastBall = `Starc to Batter, 1 run. Tucked away to square leg.`;
    match.commentary.history.unshift(`Over ${match.teamA.overs}: 1 run`);

    // ストライク交代
    match.batting.current[0].isStriker = !match.batting.current[0].isStriker;
    match.batting.current[1].isStriker = !match.batting.current[1].isStriker;
  } else {
    // Dot Ball
    updateBatterRuns(match, 0);
    match.commentary.lastBall = `Starc to Batter, DOT ball. Solid defense.`;
    match.commentary.history.unshift(`Over ${match.teamA.overs}: DOT`);
  }

  // ボウリングオーバーのインクリメント
  if (runsScored === 0 && extraText === '') {
    // ドット
  } else {
    // カウント
  }
  
  // ボウラーのオーバー数計算
  let bBalls = Math.round((match.bowling.current[0].overs % 1) * 10) + (extraText === '' ? 1 : 0);
  let bOvers = Math.floor(match.bowling.current[0].overs);
  if (bBalls >= 6) {
    bBalls = 0;
    bOvers += 1;
  }
  match.bowling.current[0].overs = parseFloat(`${bOvers}.${bBalls}`);

  // 各種統計の更新
  match.batting.partnership.balls += (extraText === '' ? 1 : 0);
  match.batting.partnership.runRate = parseFloat(((match.batting.partnership.runs / match.batting.partnership.balls) * 6).toFixed(2)) || 0;

  // グラフチャートデータのダミー更新
  if (extraText === '' && balls === 0) {
    match.charts.last10Overs.shift();
    match.charts.last10Overs.push(Math.floor(Math.random() * 15) + 2);
  }

  // ストアの状態を更新
  store.dispatch({ type: 'UPDATE_MATCH', payload: match });
}

function handleWicket(match) {
  match.teamA.wickets += 1;
  match.bowling.current[0].wickets += 1;
  match.commentary.lastBall = `WICKET! Batter tries to loft but gets caught at long-on.`;
  match.commentary.history.unshift(`Over ${match.teamA.overs}: WICKET (c Long-On b Starc)`);

  // ストライカーのアウト処理と交代
  let outIndex = match.batting.current.findIndex(b => b.isStriker);
  if (outIndex !== -1) {
    const oldBatter = match.batting.current[outIndex];
    eventBus.publish(EVENT_TYPES.DISMISSAL, oldBatter);

    // 新バッターを投入
    const newBatterName = `Batter ${match.teamA.wickets + 2}`;
    match.batting.current[outIndex] = {
      id: match.teamA.wickets + 2,
      name: newBatterName,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      sr: 0,
      isStriker: true
    };
  }

  // パートナーシップリセット
  match.batting.partnership = { runs: 0, balls: 0, runRate: 0 };

  eventBus.publish(EVENT_TYPES.WICKET, { wickets: match.teamA.wickets });
  triggerScreenShake();
  triggerActionFlash('WICKET!', '#ef4444');

  store.dispatch({ type: 'UPDATE_MATCH', payload: match });
}

function updateBatterRuns(match, runs) {
  const strikerIndex = match.batting.current.findIndex(b => b.isStriker);
  if (strikerIndex !== -1) {
    const bat = match.batting.current[strikerIndex];
    bat.runs += runs;
    bat.balls += 1;
    if (runs === 4) bat.fours += 1;
    if (runs === 6) bat.sixes += 1;
    bat.sr = parseFloat(((bat.runs / bat.balls) * 100).toFixed(1));

    // マイルストーン確認 (50, 100)
    if (bat.runs === 50 && runs > 0) {
      eventBus.publish(EVENT_TYPES.MILESTONE_BATTER, { name: bat.name, milestone: 50 });
      triggerActionFlash(`${bat.name} 50!`, '#fbbf24');
    }
  }
}
