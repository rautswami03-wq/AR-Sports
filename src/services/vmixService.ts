import { BroadcastStoreState } from '../store/useBroadcastStore';

/**
 * vMix API Integration Bridge Service
 * Connects F:\AR Sports directly to vMix Web Controller API (Default: http://localhost:8088/api)
 */

export interface VMixConfig {
  host: string;
  port: number;
  enabled: boolean;
  scoreBugInputName: string;
}

const DEFAULT_VMIX_CONFIG: VMixConfig = {
  host: '127.0.0.1',
  port: 8088,
  enabled: true,
  scoreBugInputName: 'CricketScoreBug.gtzip',
};

/**
 * Sends vMix Function Commands via vMix HTTP API
 */
export async function sendVMixFunction(functionName: string, params: Record<string, string> = {}, config = DEFAULT_VMIX_CONFIG) {
  if (!config.enabled) return;

  const searchParams = new URLSearchParams({ Function: functionName, ...params });
  const url = `http://${config.host}:${config.port}/api/?${searchParams.toString()}`;

  try {
    await fetch(url, { mode: 'no-cors' });
  } catch (err) {
    console.warn('[vMix API Bridge] Failed to send command:', url, err);
  }
}

/**
 * Updates a specific Text Field inside a vMix GT Title
 */
export async function setVMixTitleText(inputName: string, selectedName: string, value: string, config = DEFAULT_VMIX_CONFIG) {
  await sendVMixFunction('SetText', {
    Input: inputName,
    SelectedName: selectedName,
    Value: value,
  }, config);
}

/**
 * Syncs full match state to vMix GT Title input elements
 */
export async function syncStateToVMixGTTitle(state: Partial<BroadcastStoreState>, config = DEFAULT_VMIX_CONFIG) {
  if (!config.enabled || !state.teamA || !state.teamB) return;

  const isTeamA = state.battingTeamId === 'teamA' || state.battingTeamId === state.teamA.id;
  const battingTeam = isTeamA ? state.teamA : state.teamB;
  const bowlingTeam = isTeamA ? state.teamB : state.teamA;
  const input = config.scoreBugInputName;

  // 1. Team Names & Scores
  await setVMixTitleText(input, 'BattingTeamName.Text', battingTeam.shortName, config);
  await setVMixTitleText(input, 'BowlingTeamName.Text', bowlingTeam.shortName, config);
  await setVMixTitleText(input, 'Score.Text', `${battingTeam.score}/${battingTeam.wickets}`, config);
  await setVMixTitleText(input, 'Overs.Text', `${battingTeam.overs}.${battingTeam.balls}`, config);

  // 2. Current Batters & Bowlers
  const striker = battingTeam.batters?.find((b) => b.isStriker);
  const nonStriker = battingTeam.batters?.find((b) => !b.isOut && !b.isStriker);
  const currentBowler = bowlingTeam.bowlers?.find((bw) => bw.isCurrent) || bowlingTeam.bowlers?.[0];

  if (striker) {
    await setVMixTitleText(input, 'StrikerName.Text', `${striker.name}*`, config);
    await setVMixTitleText(input, 'StrikerRuns.Text', `${striker.runs}(${striker.balls})`, config);
  }

  if (nonStriker) {
    await setVMixTitleText(input, 'NonStrikerName.Text', nonStriker.name, config);
    await setVMixTitleText(input, 'NonStrikerRuns.Text', `${nonStriker.runs}(${nonStriker.balls})`, config);
  }

  if (currentBowler) {
    await setVMixTitleText(input, 'BowlerName.Text', currentBowler.name, config);
    await setVMixTitleText(input, 'BowlerFigures.Text', `${currentBowler.wickets}-${currentBowler.runsConceded} (${currentBowler.overs}.${currentBowler.ballsInCurrentOver})`, config);
  }
}
