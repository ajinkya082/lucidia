
import React from 'react';
import { useAuthStore } from '../store/authStore';
import { useAlertStore } from '../store/alertStore';
import { useReminderStore } from '../store/reminderStore';
import { UserRole } from '../types';
import Button from '../components/ui/Button';
import { BellIcon, ExclamationTriangleIcon, ShieldCheckIcon } from '../components/icons/Icons';

const DashboardCard: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => (
    <div className={`bg-brand-surface/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg ${className}`}>
        {children}
    </div>
);

const PatientDashboard = () => {
    const { addAlert } = useAlertStore();
    const { reminders } = useReminderStore();
    const upcomingReminders = reminders.filter(r => !r.isCompleted).slice(0, 3);

    const handleSOS = async () => {
        try {
            await addAlert({
                type: 'SOS',
                message: 'Patient triggered an Emergency SOS!',
            });
            alert("Help is on the way. Stay calm, John.");
        } catch (error) {
            console.error("SOS Failed:", error);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-4xl font-bold text-brand-text">Good Morning!</h2>
                <p className="text-brand-text-light text-lg mt-1">I am Lucidia, your memory assistant.</p>
            </div>
            <div className="text-center py-4">
                <Button 
                    variant="danger" 
                    onClick={handleSOS}
                    className="py-6 px-12 text-2xl font-bold rounded-full h-40 w-40 flex items-center justify-center pulse-animation shadow-2xl shadow-red-500/50"
                >
                    SOS
                </Button>
                 <p className="text-brand-text-light mt-4 text-md font-semibold">Press if you feel lost or need help</p>
            </div>
            <DashboardCard>
                <h3 className="text-2xl font-semibold mb-4 text-brand-text">Today's Reminders</h3>
                <ul className="space-y-3">
                    {upcomingReminders.length > 0 ? upcomingReminders.map(r => (
                        <li key={r.id} className="flex justify-between items-center p-4 bg-brand-background rounded-xl">
                            <span className="font-medium text-brand-text text-lg">{r.title}</span>
                            <span className="text-md font-semibold text-brand-primary bg-indigo-100 px-3 py-1 rounded-full">{r.time}</span>
                        </li>
                    )) : (
                        <p className="text-brand-text-light italic">No more reminders for today.</p>
                    )}
                </ul>
            </DashboardCard>
            <DashboardCard className="bg-gradient-to-br from-brand-primary to-brand-accent text-white">
                 <h3 className="text-2xl font-bold mb-2">Memory of the Day</h3>
                 <p className="opacity-90">Remember your trip to the coast? The air was so fresh and you were so happy.</p>
                 <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop" alt="Memory of the day" className="mt-4 rounded-xl mx-auto shadow-lg max-h-48 w-full object-cover"/>
            </DashboardCard>
        </div>
    );
};

const CaretakerStatCard: React.FC<{title: string, value: string, icon: React.ReactNode, colorClass: string}> = ({title, value, icon, colorClass}) => (
    <DashboardCard className="text-center border border-white">
        <div className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center mb-3 ${colorClass}`}>
            {icon}
        </div>
        <h4 className="font-semibold text-brand-text-light uppercase text-xs tracking-wider">{title}</h4>
        <p className={`text-3xl font-bold mt-1 ${colorClass.replace('bg-', 'text-').replace('-200', '-600')}`}>{value}</p>
    </DashboardCard>
);

const CaretakerDashboard = () => {
    const { alerts } = useAlertStore();
    const { reminders } = useReminderStore();
    const unreadAlerts = alerts.filter(a => !a.isRead);
    const nextReminder = reminders.find(r => !r.isCompleted);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-4xl font-bold text-brand-text">Caretaker Dashboard</h2>
                <p className="text-brand-text-light text-lg mt-1">Real-time patient monitoring active.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CaretakerStatCard title="Patient Status" value="Active" icon={<ShieldCheckIcon />} colorClass="bg-green-100 text-green-700" />
                <CaretakerStatCard title="Next Task" value={nextReminder?.title || 'None'} icon={<BellIcon />} colorClass="bg-indigo-100 text-brand-primary" />
                <CaretakerStatCard title="Recent Alerts" value={String(unreadAlerts.length)} icon={<ExclamationTriangleIcon />} colorClass="bg-red-100 text-red-700" />
            </div>
            <DashboardCard>
                <h3 className="text-2xl font-semibold mb-4 text-brand-text">Active Alerts</h3>
                <ul className="space-y-3">
                    {unreadAlerts.length > 0 ? unreadAlerts.slice(0, 3).map(a => (
                        <li key={a.id} className={`p-4 rounded-xl font-medium flex justify-between items-center ${a.type === 'SOS' ? 'bg-red-50 text-red-800 border border-red-100' : 'bg-yellow-50 text-yellow-800 border border-yellow-100'}`}>
                            <p className="text-lg flex items-center gap-2">
                                <span className="text-2xl">{a.type === 'SOS' ? '🆘' : '⚠️'}</span>
                                {a.message}
                            </p>
                            <span className="text-xs opacity-60">{new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </li>
                    )) : (
                        <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                             <p className="text-brand-text-light">No critical alerts at this time.</p>
                        </div>
                    )}
                </ul>
            </DashboardCard>
        </div>
    );
};

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  return user?.role === UserRole.PATIENT ? <PatientDashboard /> : <CaretakerDashboard />;
};

export default DashboardPage;
