
import { create } from 'zustand';
import { Memory } from '../types';
import { useAuthStore } from './authStore';
import { listenToMemories, addMemoryDoc, updateMemoryDoc, deleteMemoryDoc } from '../backend/db';

interface MemoryState {
  memories: Memory[];
  addMemory: (memory: Omit<Memory, 'id'>) => Promise<void>;
  updateMemory: (memory: Memory) => Promise<void>;
  deleteMemory: (id: string) => Promise<void>;
  init: () => () => void;
}

export const useMemoryStore = create<MemoryState>((set) => ({
  memories: [],
  addMemory: async (data) => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    const targetId = user.role === 'patient' ? user.id : user.patientId!;
    await addMemoryDoc({ ...data, ownerId: targetId });
  },
  updateMemory: async (updatedMemory) => {
    const { id, ...data } = updatedMemory;
    await updateMemoryDoc(id, data);
  },
  deleteMemory: async (id) => {
    await deleteMemoryDoc(id);
  },
  init: () => {
    const user = useAuthStore.getState().user;
    if (!user) return () => {};
    const targetId = user.role === 'patient' ? user.id : user.patientId!;
    return listenToMemories(targetId, (memories) => set({ memories }));
  },
}));
