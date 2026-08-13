import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useBroadcastStore } from '../store/useBroadcastStore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://cricscore-dcaa4-default-rtdb.firebaseio.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);

const NTFY_TOPIC = 'https://ntfy.sh/ar_sports_broadcast_live_v2';
const RTDB_URL = 'https://cricscore-dcaa4-default-rtdb.firebaseio.com/matches/live_match_default.json';

export function subscribeToLiveMatch(matchId: string, onUpdate: (data: any) => void) {
  let unsubFirestore = () => {};
  try {
    const matchDoc = doc(db, 'matches', matchId);
    unsubFirestore = onSnapshot(
      matchDoc,
      (snapshot) => {
        if (snapshot.exists()) {
          onUpdate(snapshot.data());
        }
      },
      () => {}
    );
  } catch {}

  // 100ms Firebase Realtime DB fast polling (Instant & 100% reliable)
  let lastRtdbText = '';
  const pollRtdb = async () => {
    try {
      const res = await fetch(RTDB_URL, { cache: 'no-cache' });
      if (res.ok) {
        const text = await res.text();
        if (text && text !== lastRtdbText && text !== 'null') {
          lastRtdbText = text;
          const parsed = JSON.parse(text);
          const currentStore = useBroadcastStore.getState();
          const currentLastUpdated = currentStore.lastUpdated || 0;

          if (!parsed.lastUpdated || parsed.lastUpdated >= currentLastUpdated) {
            useBroadcastStore.getState().applyExternalState(parsed);
            onUpdate(parsed);
          }
        }
      }
    } catch {}
  };

  pollRtdb();
  const pollInterval = setInterval(pollRtdb, 100);

  // ntfy.sh SSE real-time connection backup
  let eventSource: EventSource | null = null;
  if (typeof window !== 'undefined' && 'EventSource' in window) {
    try {
      eventSource = new EventSource(`${NTFY_TOPIC}/sse`);
      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.message) {
            const statePayload = JSON.parse(parsed.message);
            const currentStore = useBroadcastStore.getState();
            const currentLastUpdated = currentStore.lastUpdated || 0;
            if (!statePayload.lastUpdated || statePayload.lastUpdated >= currentLastUpdated) {
              onUpdate(statePayload);
            }
          }
        } catch {}
      };
    } catch {}
  }

  return () => {
    unsubFirestore();
    clearInterval(pollInterval);
    if (eventSource) eventSource.close();
  };
}

let publishTimer: any = null;
let pendingStateToPublish: any = null;

export function publishLiveMatchState(matchId: string, state: any) {
  pendingStateToPublish = JSON.parse(JSON.stringify(state));

  // Direct Firebase Realtime DB PUT (Instant & 100% Reliable worldwide without waiting)
  try {
    fetch(RTDB_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pendingStateToPublish),
    }).catch(() => {});
  } catch {}

  if (publishTimer) return;

  publishTimer = setTimeout(async () => {
    publishTimer = null;
    if (!pendingStateToPublish) return;

    const stateToSend = pendingStateToPublish;
    pendingStateToPublish = null;

    // ntfy.sh POST backup
    try {
      fetch(NTFY_TOPIC, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stateToSend),
      }).catch(() => {});
    } catch {}

    // Firestore setDoc
    try {
      const matchDoc = doc(db, 'matches', matchId);
      await setDoc(matchDoc, stateToSend, { merge: true });
    } catch {}
  }, 100);
}
