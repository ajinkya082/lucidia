
import React from 'react';
import { Alert } from '../types';
import Button from '../components/ui/Button';
import { useAlertStore } from '../store/alertStore';

const AlertItem: React.FC<{ alert: Alert }> = ({ alert }) => {
    const { markAsRead } = useAlertStore();
    const isSos = alert.type === 'SOS';
    const bgColor = isSos ? 'bg-red-50' : 'bg-yellow-50';
    const textColor = isSos ? 'text-red-800' : 'text-yellow-800';
    
    return (
        <div className={`p-5 rounded-2xl shadow-md border ${isSos ? 'border-red-100' : 'border-yellow-100'} ${bgColor} ${textColor} ${alert.isRead ? 'opacity-60' : ''} transition-opacity`}>
            <div className="flex justify-between items-start">
                <div>
                    <span className="font-bold text-xl">{alert.type === 'SOS' ? '🆘 SOS Alert!' : '🗺️ Safe Area Alert'}</span>
                    <p className="mt-1 text-lg">{alert.message}</p>
                    <p className="text-sm opacity-80 mt-2">{new Date(alert.timestamp).toLocaleString()}</p>
                </div>
                {!alert.isRead && (
                     <Button onClick={() => markAsRead(alert.id)} className="bg-white/80 hover:bg-white text-current text-sm px-4 py-2 rounded-xl">Got it</Button>
                )}
            </div>
        </div>
    );
}

const AlertsPage: React.FC = () => {
    const { alerts, markAllAsRead } = useAlertStore();
    const unreadAlerts = alerts.filter(a => !a.isRead);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-brand-text">Care Notifications {unreadAlerts.length > 0 && `(${unreadAlerts.length})`}</h1>
                <Button variant='secondary' onClick={markAllAsRead} disabled={unreadAlerts.length === 0} size="lg" className="rounded-2xl">Mark All as Read</Button>
            </div>
            {alerts.length > 0 ? (
                <div className="space-y-5">
                    {alerts.map(alert => (
                        <AlertItem key={alert.id} alert={alert} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 px-6 bg-brand-surface/80 rounded-[2.5rem] shadow-lg border border-slate-100">
                    <p className="text-xl text-brand-text-light">No notifications right now. Everything is peaceful.</p>
                </div>
            )}
        </div>
    );
};

export default AlertsPage;
