import { initializeApp } from 'firebase/app';
// Use modular SDK imports for Firebase Auth and Firestore
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "lucidia-care.firebaseapp.com",
  projectId: "lucidia-care",
  storageBucket: "lucidia-care.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
// Standard modular initialization for Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;