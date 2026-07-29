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
const RTDB_URL = 'https://cricscore-dcaa4-default-rtdb.firebaseio.com/matches/live_match_default.json';
export function subscribeToLiveMatch(matchId, onUpdate) {
    let unsubFirestore = () => { };
    try {
        const matchDoc = doc(db, 'matches', matchId);
        unsubFirestore = onSnapshot(matchDoc, (snapshot) => {
            if (snapshot.exists()) {
                onUpdate(snapshot.data());
            }
        }, (error) => {
            console.warn('Firestore snapshot notice:', error.message);
        });
    }
    catch (err) {
        console.warn('Firestore connection notice:', err);
    }
    // Ultra-Fast RTDB REST Polling (Guarantees OBS Studio Software Sync Across Applications)
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
        }
        catch (e) {
            // Network fallback
        }
    };
    pollRtdb();
    const pollInterval = setInterval(pollRtdb, 500);
    return () => {
        unsubFirestore();
        clearInterval(pollInterval);
    };
}
export async function publishLiveMatchState(matchId, state) {
    const cleanState = JSON.parse(JSON.stringify(state));
    // 1. Publish to Firestore
    try {
        const matchDoc = doc(db, 'matches', matchId);
        await setDoc(matchDoc, cleanState, { merge: true });
    }
    catch (err) {
        console.warn('Firestore publish notice:', err);
    }
    // 2. Publish to Realtime DB REST Endpoint (Guarantees OBS Studio Software Sync!)
    try {
        await fetch(RTDB_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cleanState),
        });
    }
    catch (err) {
        console.warn('RTDB publish notice:', err);
    }
}
