
import { create } from 'zustand';
import { Alert } from '../types';

const mockAlerts: Alert[] = [
    { id: '1', type: 'SOS', message: 'SOS button pressed near 123 Main St.', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), isRead: false },
    { id: '2', type: 'SafeZoneExit', message: 'Left "Home" safe zone.', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), isRead: false },
    { id: '3', type: 'SafeZoneExit', message: 'Left "Community Center" safe zone.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), isRead: true },
];


interface AlertState {
  alerts: Alert[];
  addAlert: (alertData: Omit<Alert, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  alerts: mockAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
  addAlert: (alertData) => {
    const newAlert: Alert = {
        id: `alert-${Date.now()}`,
        timestamp: new Date().toISOString(),
        isRead: false,
        ...alertData
    };
    set((state) => ({ alerts: [newAlert, ...state.alerts] }));
  },
  markAsRead: (id: string) => {
    set((state) => ({
        alerts: state.alerts.map(a => a.id === id ? { ...a, isRead: true } : a)
    }));
  },
  markAllAsRead: () => {
    set((state) => ({
        alerts: state.alerts.map(a => ({ ...a, isRead: true }))
    }));
  },
}));
