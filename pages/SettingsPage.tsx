import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';
import { useGpsStore } from '../store/gpsStore';
import { useSettingsStore } from '../store/settingsStore';
import { SafeZone } from '../types';
import { PencilIcon, TrashIcon } from '../components/icons/Icons';

const SettingsCard: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
    <div className="bg-brand-surface/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-brand-text border-b border-gray-200 pb-4 mb-6">{title}</h2>
        {children}
    </div>
);

const ToggleSwitch: React.FC<{label: string, enabled: boolean, onToggle: () => void}> = ({ label, enabled, onToggle }) => (
    <div className="flex items-center justify-between py-2">
        <span className="text-lg text-brand-text">{label}</span>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={enabled} onChange={onToggle} className="sr-only peer" />
            <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-primary"></div>
        </label>
    </div>
);

const SafeZoneForm: React.FC<{ zone: Partial<SafeZone> | null, onSave: (zone: Omit<SafeZone, 'id'> | SafeZone) => void, onCancel: () => void }> = ({ zone, onSave, onCancel }) => {
    const [name, setName] = useState(zone?.name || '');
    const [lat, setLat] = useState(zone?.lat || 34.0522);
    const [lng, setLng] = useState(zone?.lng || -118.2437);
    const [radius, setRadius] = useState(zone?.radius || 500);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...zone, name, lat, lng, radius });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-text mb-4">{zone?.id ? 'Edit' : 'Add'} Safe Zone</h2>
             <div>
                <label htmlFor="sz-name" className="block text-sm font-medium text-brand-text-light">Zone Name</label>
                <input type="text" id="sz-name" value={name} onChange={e => setName(e.target.value)} className="form-input" placeholder="e.g., Home" required />
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="sz-lat" className="block text-sm font-medium text-brand-text-light">Latitude</label>
                    <input type="number" step="any" id="sz-lat" value={lat} onChange={e => setLat(parseFloat(e.target.value))} className="form-input" required />
                </div>
                 <div>
                    <label htmlFor="sz-lng" className="block text-sm font-medium text-brand-text-light">Longitude</label>
                    <input type="number" step="any" id="sz-lng" value={lng} onChange={e => setLng(parseFloat(e.target.value))} className="form-input" required />
                </div>
            </div>
             <div>
                <label htmlFor="sz-radius" className="block text-sm font-medium text-brand-text-light">Radius (meters)</label>
                <input type="number" id="sz-radius" value={radius} onChange={e => setRadius(parseInt(e.target.value, 10))} className="form-input" required />
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save Zone</Button>
            </div>
        </form>
    );
};

const SettingsPage: React.FC = () => {
    const { user } = useAuthStore();
    const { updateUser } = useUserStore();
    const { safeZones, addSafeZone, updateSafeZone, deleteSafeZone } = useGpsStore();
    const { pushNotifications, emailSummary, togglePushNotifications, toggleEmailSummary } = useSettingsStore();

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingZone, setEditingZone] = useState<SafeZone | null>(null);

    const handleProfileUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (user) {
            updateUser({ ...user, name, email });
            alert('Profile updated!');
        }
    };
    
    const openAddModal = () => {
        setEditingZone(null);
        setIsModalOpen(true);
    };

    const openEditModal = (zone: SafeZone) => {
        setEditingZone(zone);
        setIsModalOpen(true);
    };

    const handleSaveZone = (zoneData: Omit<SafeZone, 'id'> | SafeZone) => {
        if ('id' in zoneData && zoneData.id) {
            updateSafeZone(zoneData as SafeZone);
        } else {
            addSafeZone(zoneData);
        }
        setIsModalOpen(false);
        setEditingZone(null);
    };


    return (
        <div>
            <h1 className="text-4xl font-bold text-brand-text mb-8">Settings</h1>

            <div className="space-y-8">
                <SettingsCard title="Account Information">
                    <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-brand-text-light">Your Name</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="form-input" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-brand-text-light">Email Address</label>
                            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="form-input" />
                        </div>
                         <Button type="submit" className="!mt-6" size="lg">Update Profile</Button>
                    </form>
                </SettingsCard>
                
                <SettingsCard title="Manage Safe Zones">
                     <div className="space-y-3">
                        {safeZones.map(zone => (
                            <div key={zone.id} className="flex justify-between items-center p-4 bg-brand-background rounded-xl">
                                <span className="font-medium text-lg">{zone.name} (Radius: {zone.radius}m)</span>
                                <div className="space-x-2">
                                    <Button variant="secondary" size="md" onClick={() => openEditModal(zone)}><PencilIcon /></Button>
                                    <Button variant="danger" size="md" onClick={() => deleteSafeZone(zone.id)}><TrashIcon /></Button>
                                </div>
                            </div>
                        ))}
                     </div>
                     <Button onClick={openAddModal} className="mt-6" size="lg">Add New Safe Zone</Button>
                </SettingsCard>

                <SettingsCard title="Notification Preferences">
                    <div className="space-y-4">
                        <ToggleSwitch label="Push Notifications for Alerts" enabled={pushNotifications} onToggle={togglePushNotifications} />
                        <ToggleSwitch label="Email summary of the day" enabled={emailSummary} onToggle={toggleEmailSummary} />
                    </div>
                </SettingsCard>
            </div>
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <SafeZoneForm 
                    zone={editingZone} 
                    onSave={handleSaveZone}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default SettingsPage;