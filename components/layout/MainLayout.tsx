
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Notification from '../ui/Notification';
import { useReminderStore } from '../../store/reminderStore';
import { useGpsStore, isOutsideZone } from '../../store/gpsStore';
import { useAlertStore } from '../../store/alertStore';
import { AnimatePresence, motion } from 'framer-motion';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);
  const { getDueReminder, markAsNotified } = useReminderStore();

  const { patientLocation, safeZones, updatePatientLocation } = useGpsStore();
  const { addAlert } = useAlertStore();
  const wasOutsideRef = useRef<Set<string>>(new Set());

  // Background simulation effect
  useEffect(() => {
    const simulationInterval = setInterval(() => {
      // 1. Simulate patient movement
      const newLat = patientLocation.location.lat + (Math.random() - 0.5) * 0.001;
      const newLng = patientLocation.location.lng + (Math.random() - 0.5) * 0.001;
      updatePatientLocation({ lat: newLat, lng: newLng });

      // 2. Check for safe zone breaches
      const currentPatientLocation = { lat: newLat, lng: newLng };
      safeZones.forEach(zone => {
          const isCurrentlyOutside = isOutsideZone(currentPatientLocation, zone);
          const wasPreviouslyOutside = wasOutsideRef.current.has(zone.id);
          
          if (isCurrentlyOutside && !wasPreviouslyOutside) {
              // Patient just left the zone
              addAlert({
                  type: 'SafeZoneExit',
                  message: `Left "${zone.name}" safe zone.`,
              });
              wasOutsideRef.current.add(zone.id);
          } else if (!isCurrentlyOutside && wasPreviouslyOutside) {
              // Patient just re-entered the zone
              wasOutsideRef.current.delete(zone.id);
          }
      });
    }, 8000); // Simulate every 8 seconds

    return () => clearInterval(simulationInterval);
  }, [patientLocation, safeZones, updatePatientLocation, addAlert]);

  useEffect(() => {
    const checkReminders = () => {
      const dueReminder = getDueReminder();
      if (dueReminder) {
        const message = `Reminder: ${dueReminder.title} at ${dueReminder.time}`;
        setActiveNotification(message);

        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel(); // Cancel previous speech
          const utterance = new SpeechSynthesisUtterance(`Reminder: ${dueReminder.title}`);
          window.speechSynthesis.speak(utterance);
        }
        
        markAsNotified(dueReminder.id);
      }
    };

    const intervalId = setInterval(checkReminders, 5000);

    return () => {
        clearInterval(intervalId);
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    };
  }, [getDueReminder, markAsNotified]);


  return (
    <div className="flex h-screen bg-brand-background text-brand-text">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
            <AnimatePresence mode="wait">
                <motion.div
                    key={window.location.hash}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </main>
        <AnimatePresence>
            {activeNotification && (
                <Notification
                    message={activeNotification}
                    onClose={() => setActiveNotification(null)}
                />
            )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MainLayout;