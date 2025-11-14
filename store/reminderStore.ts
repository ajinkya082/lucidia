
import { create } from 'zustand';
import { Reminder, ReminderType } from '../types';

// Helper to format time for today
const formatTime = (hours: number, minutes: number) => {
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const now = new Date();
// For demo, set a reminder 10 seconds from now
const upcomingTime = new Date(now.getTime() + 10 * 1000);

const mockReminders: (Reminder & { notified?: boolean })[] = [
    { id: '1', title: 'Take Morning Pills', time: formatTime(8, 0), type: ReminderType.MEDICATION, isCompleted: true },
    { id: '2', title: 'Doctor Appointment', time: formatTime(11, 0), type: ReminderType.APPOINTMENT, isCompleted: false, notified: false },
    { id: '3', title: 'Lunch Time', time: upcomingTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }), type: ReminderType.ACTIVITY, isCompleted: false, notified: false },
    { id: '4', title: 'Call Jane', time: formatTime(15, 0), type: ReminderType.OTHER, isCompleted: false, notified: false },
    { id: '5', title: 'Take Evening Pills', time: formatTime(20, 0), type: ReminderType.MEDICATION, isCompleted: false, notified: false },
];

interface ReminderState {
  reminders: (Reminder & { notified?: boolean })[];
  markAsCompleted: (id: string) => void;
  markAsNotified: (id: string) => void;
  getDueReminder: () => (Reminder & { notified?: boolean }) | undefined;
}

export const useReminderStore = create<ReminderState>((set, get) => ({
  reminders: mockReminders,
  markAsCompleted: (id: string) => set((state) => ({
    reminders: state.reminders.map(r => r.id === id ? { ...r, isCompleted: true } : r),
  })),
  markAsNotified: (id: string) => set(state => ({
    reminders: state.reminders.map(r => r.id === id ? { ...r, notified: true } : r),
  })),
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
  }
}));
