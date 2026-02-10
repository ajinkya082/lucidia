
import React, { useState } from 'react';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ReminderType } from '../types';
import { useReminderStore } from '../store/reminderStore';

const AddReminderPage: React.FC = () => {
    const navigate = useNavigate();
    const { addReminder } = useReminderStore();
    
    const [title, setTitle] = useState('');
    const [time, setTime] = useState('');
    const [type, setType] = useState(ReminderType.MEDICATION);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Convert 24h time to 12h format for consistent UI display
            const [hours, minutes] = time.split(':');
            const h = parseInt(hours, 10);
            const displayTime = `${h % 12 || 12}:${minutes} ${h >= 12 ? 'PM' : 'AM'}`;

            await addReminder({
                title,
                time: displayTime,
                type,
                isCompleted: false
            });
            navigate('/reminders');
        } catch (error) {
            console.error("Failed to add reminder:", error);
            alert("Failed to save. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-brand-text mb-8">New Reminder</h1>
            <div className="bg-brand-surface/80 backdrop-blur-sm p-10 rounded-[2.5rem] shadow-2xl border border-white">
                <form className="space-y-8" onSubmit={handleSubmit}>
                     <div>
                        <label htmlFor="title" className="block text-sm font-bold text-brand-text-light mb-2">What should I remind John?</label>
                        <input 
                            type="text" 
                            id="title" 
                            className="form-input py-5 text-lg" 
                            placeholder="e.g., Take Blue Heart Pill"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label htmlFor="time" className="block text-sm font-bold text-brand-text-light mb-2">Trigger Time</label>
                            <input 
                                type="time" 
                                id="time" 
                                className="form-input py-5"
                                value={time}
                                onChange={e => setTime(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="type" className="block text-sm font-bold text-brand-text-light mb-2">Category</label>
                            <select 
                                id="type" 
                                className="form-input py-5"
                                value={type}
                                onChange={e => setType(e.target.value as ReminderType)}
                            >
                                <option value={ReminderType.MEDICATION}>Medication 💊</option>
                                <option value={ReminderType.APPOINTMENT}>Appointment 🩺</option>
                                <option value={ReminderType.ACTIVITY}>Activity 🚶</option>
                                <option value={ReminderType.OTHER}>Other 🔔</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <Button type="button" variant="secondary" onClick={() => navigate('/reminders')} size="lg" className="rounded-2xl px-8">Cancel</Button>
                        <Button type="submit" size="lg" className="rounded-2xl px-12 shadow-xl" loading={loading}>Add Reminder</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddReminderPage;
