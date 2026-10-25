import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';
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

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);

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
  pendingStateToPublish = JSON.parse(JSON.stringify(state));

  if (publishTimer) return;

  publishTimer = setTimeout(async () => {
    publishTimer = null;
    if (!pendingStateToPublish) return;

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
