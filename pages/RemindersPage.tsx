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
    const { markAsCompleted } = useReminderStore();

    return (
        <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        layout
        className={`flex items-center p-5 rounded-2xl shadow-lg transition-all ${reminder.isCompleted ? 'bg-white/60' : 'bg-brand-surface'}`}
        >
            <div className="text-4xl mr-5 p-3 bg-indigo-100 rounded-full">{getReminderIcon(reminder.type)}</div>
            <div className="flex-grow">
                <p className={`font-semibold text-xl ${reminder.isCompleted ? 'line-through text-brand-text-light' : 'text-brand-text'}`}>{reminder.title}</p>
                <p className={`text-lg ${reminder.isCompleted ? 'text-brand-text-light' : 'text-brand-primary font-medium'}`}>{reminder.time}</p>
            </div>
            {role === UserRole.CARETAKER && (
                <Button variant="danger" size="sm" className="ml-4"><TrashIcon /></Button>
            )}
            {role === UserRole.PATIENT && !reminder.isCompleted && (
                <Button variant="secondary" onClick={() => markAsCompleted(reminder.id)} className="ml-4" size="lg">Done</Button>
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
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-brand-text">Reminders</h1>
                {user?.role === UserRole.CARETAKER && (
                    <Button onClick={() => navigate('/reminders/add')} leftIcon={<PlusIcon />} size="lg">
                        Add Reminder
                    </Button>
                )}
            </div>
            
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-semibold text-brand-text mb-4">Upcoming</h2>
                    <div className="space-y-4">
                        {upcomingReminders.length > 0 ? upcomingReminders.map(r => <ReminderCard key={r.id} reminder={r} role={user!.role} />) : <p className="text-brand-text-light p-4 bg-white/50 rounded-lg">No upcoming reminders.</p>}
                    </div>
                </div>
                
                <div>
                    <h2 className="text-2xl font-semibold text-brand-text mb-4">Completed</h2>
                    <div className="space-y-4">
                         <AnimatePresence>
                            {completedReminders.length > 0 ? completedReminders.map(r => <ReminderCard key={r.id} reminder={r} role={user!.role} />) : <p className="text-brand-text-light p-4 bg-white/50 rounded-lg">No completed reminders today.</p>}
                         </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RemindersPage;