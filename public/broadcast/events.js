/**
 * イベントバスシステム (Pub/Sub Event Bus)
 * アニメーションと状態変化、生放送のトリガーを仲介するイベント伝達モジュール。
 */

class EventBus {
  constructor() {
    this.events = {};
  }

  subscribe(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    
    // 取消し用クロージャを返却
    return () => {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    };
  }

  publish(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => {
      try {
        callback(data);
      } catch (err) {
        console.error(`Error in event subscriber for [${event}]:`, err);
      }
    });
  }
}

export const eventBus = new EventBus();

// 定義済みのイベントタイプ定義
export const EVENT_TYPES = {
  DIGIT_ROLL: 'DIGIT_ROLL',
  BOUNDARY: 'BOUNDARY',
  WICKET: 'WICKET',
  EXTRA: 'EXTRA',
  OVER_CHANGE: 'OVER_CHANGE',
  MILESTONE_BATTER: 'MILESTONE_BATTER',
  MILESTONE_PARTNERSHIP: 'MILESTONE_PARTNERSHIP',
  DISMISSAL: 'DISMISSAL',
  DRS_REVIEW: 'DRS_REVIEW',
  THEME_CHANGED: 'THEME_CHANGED',
  SCENE_TRANSITION: 'SCENE_TRANSITION'
};
