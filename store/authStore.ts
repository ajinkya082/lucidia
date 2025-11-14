
import { create } from 'zustand';
import { User, UserRole } from '../types';
import { useUserStore } from './userStore';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (role: UserRole) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: (role: UserRole) => {
    const userToLogin = useUserStore.getState().findUserByRole(role);
    if (userToLogin) {
      set({ isAuthenticated: true, user: userToLogin });
      return true;
    }
    return false;
  },
  logout: () => set({ isAuthenticated: false, user: null }),
}));