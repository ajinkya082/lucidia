import React from 'react';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ReminderType } from '../types';

const AddReminderPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1 className="text-4xl font-bold text-brand-text mb-8">Add New Reminder</h1>
            <div className="max-w-2xl mx-auto bg-brand-surface/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
                <form className="space-y-6">
                     <div>
                        <label htmlFor="title" className="block text-sm font-medium text-brand-text-light">Title</label>
                        <input type="text" id="title" className="form-input" placeholder="e.g., Take Paracetamol"/>
                    </div>
                    
                    <div>
                        <label htmlFor="time" className="block text-sm font-medium text-brand-text-light">Time</label>
                        <input type="time" id="time" className="form-input"/>
                    </div>

                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-brand-text-light">Type</label>
                        <select id="type" className="form-input">
                            <option value={ReminderType.MEDICATION}>Medication</option>
                            <option value={ReminderType.APPOINTMENT}>Appointment</option>
                            <option value={ReminderType.ACTIVITY}>Activity</option>
                            <option value={ReminderType.OTHER}>Other</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <Button type="button" variant="secondary" onClick={() => navigate('/reminders')} size="lg">Cancel</Button>
                        <Button type="submit" size="lg">Save Reminder</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddReminderPage;