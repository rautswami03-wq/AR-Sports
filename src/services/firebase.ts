import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);

const NTFY_TOPIC = 'https://ntfy.sh/cricscorer_broadcast_live_v2';
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
      (error) => {
        console.warn('firestore:', error.message);
      }
    );
  } catch (err) {
    console.warn('firestore init failed:', err);
  }

  // ntfy.sh SSE push
  let eventSource: EventSource | null = null;
  if (typeof window !== 'undefined' && 'EventSource' in window) {
    try {
      eventSource = new EventSource(`${NTFY_TOPIC}/sse`);
      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.message) {
            const statePayload = JSON.parse(parsed.message);
            onUpdate(statePayload);
          }
        } catch {}
      };
    } catch {}
  }

  // RTDB polling fallback
  let lastRtdbJson = '';
  const pollRtdb = async () => {
    try {
      const res = await fetch(RTDB_URL);
      if (res.ok) {
        const text = await res.text();
        if (text && text !== lastRtdbJson && text !== 'null') {
          lastRtdbJson = text;
          const parsed = JSON.parse(text);
          onUpdate(parsed);
        }
      }
    } catch {}
  };

  pollRtdb();
  const pollInterval = setInterval(pollRtdb, 500);

  return () => {
    unsubFirestore();
    if (eventSource) eventSource.close();
    clearInterval(pollInterval);
  };
}

export async function publishLiveMatchState(matchId: string, state: any) {
  const cleanState = JSON.parse(JSON.stringify(state));

  try {
    fetch(NTFY_TOPIC, {
      method: 'POST',
      body: JSON.stringify(cleanState),
    }).catch(() => {});
  } catch {}

  try {
    const matchDoc = doc(db, 'matches', matchId);
    await setDoc(matchDoc, cleanState, { merge: true });
  } catch (err) {
    console.warn('firestore write failed:', err);
  }

  try {
    await fetch(RTDB_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanState),
    });
  } catch {}
}
