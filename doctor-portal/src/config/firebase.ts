import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Firebase configuration - Your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4cHeV25PvdgAgKttpoq3iBMMrtREH9iM",
  authDomain: "medibot-b2bf7.firebaseapp.com",
  projectId: "medibot-b2bf7",
  storageBucket: "medibot-b2bf7.firebasestorage.app",
  messagingSenderId: "735267785437",
  appId: "1:735267785437:web:db7c4275659f328f46a934",
  measurementId: "G-6LB717MSN1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;
