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
      () => {}
    );
  } catch {}

  const processNtfyPayload = async (parsed: any) => {
    try {
      if (parsed.attachment?.url) {
        const fileRes = await fetch(parsed.attachment.url);
        if (fileRes.ok) {
          const fileData = await fileRes.json();
          onUpdate(fileData);
          return;
        }
      }
      if (parsed.message) {
        const statePayload = JSON.parse(parsed.message);
        onUpdate(statePayload);
      }
    } catch {}
  };

  // Real-time ntfy SSE connection
  let eventSource: EventSource | null = null;
  if (typeof window !== 'undefined' && 'EventSource' in window) {
    try {
      eventSource = new EventSource(`${NTFY_TOPIC}/sse`);
      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          processNtfyPayload(parsed);
        } catch {}
      };
    } catch {}
  }

  return () => {
    unsubFirestore();
    if (eventSource) eventSource.close();
  };
}

let publishTimer: any = null;
let pendingStateToPublish: any = null;

export function publishLiveMatchState(matchId: string, state: any) {
  pendingStateToPublish = JSON.parse(JSON.stringify(state));

  if (publishTimer) return;

  publishTimer = setTimeout(async () => {
    publishTimer = null;
    if (!pendingStateToPublish) return;

    const stateToSend = pendingStateToPublish;
    pendingStateToPublish = null;

    try {
      fetch(NTFY_TOPIC, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stateToSend),
      }).catch(() => {});
    } catch {}

    try {
      const matchDoc = doc(db, 'matches', matchId);
      await setDoc(matchDoc, stateToSend, { merge: true });
    } catch {}
  }, 200);
}
