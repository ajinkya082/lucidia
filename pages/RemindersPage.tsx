
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useReminderStore } from '../store/reminderStore';
import { UserRole, Reminder, ReminderType } from '../types';
import Button from '../components/ui/Button';
import { PlusIcon, TrashIcon } from '../components/icons/Icons';
import { motion, AnimatePresence } from 'framer-motion';

const getReminderIcon = (type: ReminderType) => {
    switch(type) {
        case ReminderType.MEDICATION: return '💊';
        case ReminderType.APPOINTMENT: return '🩺';
        case ReminderType.ACTIVITY: return '🚶';
        default: return '🔔';
    }
}

const ReminderCard: React.FC<{ reminder: Reminder, role: UserRole }> = ({ reminder, role }) => {
    const { markAsCompleted, deleteReminder } = useReminderStore();

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            layout
            className={`flex items-center p-5 rounded-2xl shadow-lg transition-all border border-white/50 ${reminder.isCompleted ? 'bg-white/40' : 'bg-brand-surface'}`}
        >
            <div className="text-4xl mr-5 p-3 bg-indigo-50 rounded-full">{getReminderIcon(reminder.type)}</div>
            <div className="flex-grow">
                <p className={`font-bold text-xl ${reminder.isCompleted ? 'line-through text-brand-text-light opacity-50' : 'text-brand-text'}`}>{reminder.title}</p>
                <p className={`text-lg font-medium ${reminder.isCompleted ? 'text-brand-text-light opacity-50' : 'text-brand-primary'}`}>{reminder.time}</p>
            </div>
            {role === UserRole.CARETAKER && (
                <Button variant="danger" size="sm" className="ml-4 p-3 rounded-xl" onClick={() => deleteReminder(reminder.id)}>
                    <TrashIcon />
                </Button>
            )}
            {role === UserRole.PATIENT && !reminder.isCompleted && (
                <Button variant="secondary" onClick={() => markAsCompleted(reminder.id)} className="ml-4 px-8 rounded-xl font-bold" size="lg">
                    I Did This
                </Button>
            )}
        </motion.div>
    );
};

const RemindersPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { reminders } = useReminderStore();
    
    const upcomingReminders = reminders.filter(r => !r.isCompleted);
    const completedReminders = reminders.filter(r => r.isCompleted);
    
    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-brand-text">Reminders</h1>
                    <p className="text-brand-text-light text-lg">Daily tasks and medication schedule.</p>
                </div>
                {user?.role === UserRole.CARETAKER && (
                    <Button onClick={() => navigate('/reminders/add')} leftIcon={<PlusIcon />} size="lg" className="rounded-2xl shadow-xl">
                        Add Reminder
                    </Button>
                )}
            </div>
            
            <div className="space-y-12">
                <div>
                    <h2 className="text-xl font-black text-brand-text-light uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                        <div className="h-2 w-2 bg-brand-primary rounded-full animate-pulse"></div>
                        Upcoming
                    </h2>
                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {upcomingReminders.length > 0 ? upcomingReminders.map(r => (
                                <ReminderCard key={r.id} reminder={r} role={user!.role} />
                            )) : (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10 bg-white/30 rounded-3xl border border-dashed border-slate-300">
                                    <p className="text-brand-text-light italic">All tasks completed for now. Great job!</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                
                {completedReminders.length > 0 && (
                    <div>
                        <h2 className="text-xl font-black text-brand-text-light uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                            <div className="h-2 w-2 bg-slate-400 rounded-full"></div>
                            Completed Today
                        </h2>
                        <div className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {completedReminders.map(r => (
                                    <ReminderCard key={r.id} reminder={r} role={user!.role} />
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RemindersPage;
