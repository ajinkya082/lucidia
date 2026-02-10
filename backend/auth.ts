import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword,
  type User
} from 'firebase/auth';
import { auth } from './firebase';

// Re-export the User type for consistency across the application.
export type FirebaseUser = User;

// Wrapper for the modular login function.
export const loginUser = (email: string, password: string) => 
  signInWithEmailAndPassword(auth, email, password);

// Wrapper for the modular logout function.
export const logoutUser = () => 
  signOut(auth);

// Wrapper for the modular registration function.
export const registerUser = (email: string, password: string) => 
  createUserWithEmailAndPassword(auth, email, password);

// Wrapper for observing auth state changes.
export const observeAuthState = (callback: (user: FirebaseUser | null) => void) => 
  onAuthStateChanged(auth, callback);