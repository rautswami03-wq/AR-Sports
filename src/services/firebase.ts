import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc, Firestore } from 'firebase/firestore';
import { useBroadcastStore } from '../store/useBroadcastStore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const isTestEnv = import.meta.env.MODE === 'test' || !firebaseConfig.apiKey;

let db: Firestore | null = null;
if (!isTestEnv) {
  try {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
  } catch (err) {
    console.warn('Firebase initialization skipped:', err);
  }
}

export { db };

export function subscribeToLiveMatch(matchId: string, onUpdate: (data: any) => void) {
  if (isTestEnv || !db) {
    return () => {};
  }

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
        console.warn('Firestore subscription read error:', error);
        useBroadcastStore.getState().incrementSyncError?.();
      }
    );
  } catch (error) {
    console.warn('Firestore subscribe error:', error);
    useBroadcastStore.getState().incrementSyncError?.();
  }

  return () => {
    unsubFirestore();
  };
}

let publishTimer: any = null;
let pendingStateToPublish: any = null;

export function publishLiveMatchState(matchId: string, state: any) {
  if (isTestEnv || !db) {
    return;
  }

  pendingStateToPublish = JSON.parse(JSON.stringify(state));

  if (publishTimer) return;

  publishTimer = setTimeout(async () => {
    publishTimer = null;
    if (!pendingStateToPublish || !db) return;

    const stateToSend = pendingStateToPublish;
    pendingStateToPublish = null;

    try {
      const matchDoc = doc(db, 'matches', matchId);
      await setDoc(matchDoc, stateToSend, { merge: true });
    } catch (error) {
      console.warn('Firestore publish error:', error);
      useBroadcastStore.getState().incrementSyncError?.();
    }
  }, 100);
}
