
import { create } from 'zustand';
import { FaceProfile } from '../types';
import { useAuthStore } from './authStore';
import { listenToFaces, addFaceDoc, updateFaceDoc, deleteFaceDoc } from '../backend/db';

interface FaceState {
  faces: FaceProfile[];
  addFace: (face: Omit<FaceProfile, 'id'>) => Promise<void>;
  updateFace: (face: FaceProfile) => Promise<void>;
  deleteFace: (id: string) => Promise<void>;
  init: () => () => void;
}

export const useFaceStore = create<FaceState>((set) => ({
  faces: [],
  addFace: async (faceData) => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    const targetId = user.role === 'patient' ? user.id : user.patientId!;
    await addFaceDoc({ ...faceData, ownerId: targetId });
  },
  updateFace: async (updatedFace) => {
    const { id, ...data } = updatedFace;
    await updateFaceDoc(id, data);
  },
  deleteFace: async (id) => {
    await deleteFaceDoc(id);
  },
  init: () => {
    const user = useAuthStore.getState().user;
    if (!user) return () => {};
    const targetId = user.role === 'patient' ? user.id : user.patientId!;
    return listenToFaces(targetId, (faces) => set({ faces }));
  },
}));
