import React from 'react';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types';
import Button from '../components/ui/Button';
import { BellIcon, ExclamationTriangleIcon, ShieldCheckIcon } from '../components/icons/Icons';

// Mock Data
const patientReminders = [
    { id: 1, title: 'Take Morning Pills', time: '8:00 AM' },
    { id: 2, title: 'Walk in the garden', time: '10:30 AM' },
    { id: 3, title: 'Lunch Time', time: '12:30 PM' },
];

const caretakerAlerts = [
    { id: 1, message: "John left the safe zone at 11:15 AM", type: 'SafeZoneExit' },
    { id: 2, message: "SOS Alert triggered from John's device", type: 'SOS' },
];

const DashboardCard: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => (
    <div className={`bg-brand-surface/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg ${className}`}>
        {children}
    </div>
);

const PatientDashboard = () => (
    <div className="space-y-8">
        <div>
            <h2 className="text-4xl font-bold text-brand-text">Good Morning, John!</h2>
            <p className="text-brand-text-light text-lg mt-1">Here's what's happening today.</p>
        </div>
        <div className="text-center py-4">
            <Button variant="danger" className="py-6 px-12 text-2xl font-bold rounded-full h-40 w-40 flex items-center justify-center pulse-animation shadow-2xl shadow-red-500/50">
                SOS
            </Button>
             <p className="text-brand-text-light mt-4 text-md">Press if you need help</p>
        </div>
        <DashboardCard>
            <h3 className="text-2xl font-semibold mb-4 text-brand-text">Today's Reminders</h3>
            <ul className="space-y-3">
                {patientReminders.map(r => (
                    <li key={r.id} className="flex justify-between items-center p-4 bg-brand-background rounded-xl">
                        <span className="font-medium text-brand-text text-lg">{r.title}</span>
                        <span className="text-md font-semibold text-brand-primary bg-indigo-100 px-3 py-1 rounded-full">{r.time}</span>
                    </li>
                ))}
            </ul>
        </DashboardCard>
        <DashboardCard className="bg-gradient-to-br from-brand-primary to-brand-accent text-white">
             <h3 className="text-2xl font-bold mb-2">Memory of the Day</h3>
             <p className="opacity-90">Remember your trip to the Grand Canyon in 2015? Look at the beautiful pictures!</p>
             <img src="https://picsum.photos/400/200" alt="Memory of the day" className="mt-4 rounded-xl mx-auto shadow-lg"/>
        </DashboardCard>
    </div>
);

const CaretakerStatCard: React.FC<{title: string, value: string, icon: React.ReactNode, colorClass: string}> = ({title, value, icon, colorClass}) => (
    <DashboardCard className="text-center">
        <div className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center mb-3 ${colorClass}`}>
            {icon}
        </div>
        <h4 className="font-semibold text-brand-text-light">{title}</h4>
        <p className={`text-3xl font-bold mt-1 ${colorClass.replace('bg-', 'text-').replace('-200', '-600')}`}>{value}</p>
    </DashboardCard>
);

const CaretakerDashboard = () => (
    <div className="space-y-8">
        <div>
            <h2 className="text-4xl font-bold text-brand-text">Caretaker Dashboard</h2>
            <p className="text-brand-text-light text-lg mt-1">Overview of John's status.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CaretakerStatCard title="Current Status" value="In Safe Zone" icon={<ShieldCheckIcon />} colorClass="bg-green-200 text-green-700" />
            <CaretakerStatCard title="Next Reminder" value="Lunch" icon={<BellIcon />} colorClass="bg-indigo-200 text-brand-primary" />
            <CaretakerStatCard title="Pending Alerts" value={String(caretakerAlerts.length)} icon={<ExclamationTriangleIcon />} colorClass="bg-red-200 text-red-700" />
        </div>
        <DashboardCard>
            <h3 className="text-2xl font-semibold mb-4 text-brand-text">Recent Alerts</h3>
            <ul className="space-y-3">
                {caretakerAlerts.map(a => (
                    <li key={a.id} className={`p-4 rounded-xl font-medium ${a.type === 'SOS' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        <p className="text-lg">{a.message}</p>
                    </li>
                ))}
            </ul>
        </DashboardCard>
    </div>
);

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  
  return user?.role === UserRole.PATIENT ? <PatientDashboard /> : <CaretakerDashboard />;
};

export default DashboardPage;