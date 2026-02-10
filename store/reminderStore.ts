
import { create } from 'zustand';
import { Reminder } from '../types';
import { useAuthStore } from './authStore';
import { listenToReminders, addReminderDoc, updateReminderDoc, deleteReminderDoc } from '../backend/db';

interface ReminderState {
  reminders: (Reminder & { notified?: boolean })[];
  addReminder: (reminder: Omit<Reminder, 'id'>) => Promise<void>;
  markAsCompleted: (id: string) => Promise<void>;
  markAsNotified: (id: string) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  getDueReminder: () => (Reminder & { notified?: boolean }) | undefined;
  init: () => () => void;
}

export const useReminderStore = create<ReminderState>((set, get) => ({
  reminders: [],
  addReminder: async (data) => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    const targetId = user.role === 'patient' ? user.id : user.patientId!;
    await addReminderDoc({ ...data, ownerId: targetId });
  },
  markAsCompleted: async (id) => {
    await updateReminderDoc(id, { isCompleted: true });
  },
  markAsNotified: async (id) => {
    await updateReminderDoc(id, { notified: true });
  },
  deleteReminder: async (id) => {
    await deleteReminderDoc(id);
  },
  getDueReminder: () => {
    const now = new Date();
    return get().reminders.find(r => {
        const [time, modifier] = r.time.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        const reminderTime = new Date();
        reminderTime.setHours(hours, minutes, 0, 0);
        return !r.isCompleted && !r.notified && reminderTime <= now;
    });
  },
  init: () => {
    const user = useAuthStore.getState().user;
    if (!user) return () => {};
    const targetId = user.role === 'patient' ? user.id : user.patientId!;
    return listenToReminders(targetId, (reminders) => set({ reminders }));
  }
}));
