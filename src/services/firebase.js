import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForLocalTestingModeOnly",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ar-sports-broadcast.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ar-sports-broadcast",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ar-sports-broadcast.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456"
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export function subscribeToLiveMatch(matchId, onUpdate) {
    try {
        const matchDoc = doc(db, 'matches', matchId);
        return onSnapshot(matchDoc, (snapshot) => {
            if (snapshot.exists()) {
                onUpdate(snapshot.data());
            }
        }, (error) => {
            console.warn('Firebase snapshot listener notice (using local offline state):', error.message);
        });
    }
    catch (err) {
        console.warn('Firebase connection notice (using local state fallback):', err);
        return () => { };
    }
}
export async function publishLiveMatchState(matchId, state) {
    try {
        const matchDoc = doc(db, 'matches', matchId);
        await setDoc(matchDoc, state, { merge: true });
    }
    catch (err) {
        console.warn('Firebase publish notice (saved locally in Zustand):', err);
    }
}
