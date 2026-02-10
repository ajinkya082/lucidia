
import { create } from 'zustand';
import { User } from '../types';
import { setUserDoc, updateUserDoc, findPatientByCode } from '../backend/db';

interface UserState {
  addUser: (uid: string, userData: Omit<User, 'id'>) => Promise<User>;
  updateUser: (updatedUser: User) => Promise<void>;
  findUserByPatientCode: (code: string) => Promise<User | null>;
}

export const useUserStore = create<UserState>(() => ({
  addUser: async (uid, userData) => {
    const newUser: User = { id: uid, ...userData };
    await setUserDoc(uid, newUser);
    return newUser;
  },
  updateUser: async (updatedUser) => {
    const { id, ...data } = updatedUser;
    await updateUserDoc(id, data);
  },
  findUserByPatientCode: async (code: string) => {
    const user = await findPatientByCode(code.toUpperCase());
    return user as User | null;
  },
}));
