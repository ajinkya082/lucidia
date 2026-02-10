
import { create } from 'zustand';
import { Alert } from '../types';
import { useAuthStore } from './authStore';
import { listenToAlerts, addAlertDoc, updateAlertDoc } from '../backend/db';

interface AlertState {
  alerts: Alert[];
  addAlert: (alertData: Omit<Alert, 'id' | 'timestamp' | 'isRead'>) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  init: () => () => void;
}

export const useAlertStore = create<AlertState>((set, get) => ({
  alerts: [],
  addAlert: async (alertData) => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    const targetId = user.role === 'patient' ? user.id : user.patientId!;
    await addAlertDoc({ ...alertData, ownerId: targetId });
  },
  markAsRead: async (id) => {
    await updateAlertDoc(id, { isRead: true });
  },
  markAllAsRead: async () => {
    const alerts = get().alerts;
    const promises = alerts.map(a => !a.isRead ? updateAlertDoc(a.id, { isRead: true }) : Promise.resolve());
    await Promise.all(promises);
  },
  init: () => {
    const user = useAuthStore.getState().user;
    if (!user) return () => {};
    const targetId = user.role === 'patient' ? user.id : user.patientId!;
    return listenToAlerts(targetId, (alerts) => set({ alerts }));
  }
}));
