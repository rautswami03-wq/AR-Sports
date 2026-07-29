import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyADZq0NyOhHVjMUYsQX4UWS8OWjOt0RbG4",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cricscore-dcaa4.firebaseapp.com",
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://cricscore-dcaa4-default-rtdb.firebaseio.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cricscore-dcaa4",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cricscore-dcaa4.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "674016632224",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:674016632224:web:33f3911fe43396cb8e58c5",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-WG5HE07NYJ"
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
        const cleanState = JSON.parse(JSON.stringify(state));
        await setDoc(matchDoc, cleanState, { merge: true });
    }
    catch (err) {
        console.warn('Firebase publish notice (saved locally in Zustand):', err);
    }
}
