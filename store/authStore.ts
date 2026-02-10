
import { create } from 'zustand';
import { User } from '../types';
import { loginUser, logoutUser, observeAuthState } from '../backend/auth';
import { getUserDoc } from '../backend/db';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  init: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  login: async (email, password) => {
    try {
      const userCredential = await loginUser(email, password);
      const userDoc = await getUserDoc(userCredential.user.uid);
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        set({ user: userData, isAuthenticated: true });
      } else {
        // If Auth succeeds but Firestore doc is missing
        throw new Error("Account authenticated, but user profile not found in database.");
      }
    } catch (error: any) {
      console.error("Login Error Details:", error);
      // Propagate the specific error back to the UI
      throw error;
    }
  },
  logout: async () => {
    await logoutUser();
    set({ user: null, isAuthenticated: false });
  },
  init: () => {
    observeAuthState(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getUserDoc(firebaseUser.uid);
          if (userDoc.exists()) {
            set({ user: userDoc.data() as User, isAuthenticated: true, isLoading: false });
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        } catch (e) {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    });
  },
}));
