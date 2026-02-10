
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { useAuthStore } from './store/authStore';
import { useFaceStore } from './store/faceStore';
import { useReminderStore } from './store/reminderStore';
import { useAlertStore } from './store/alertStore';
import { useGpsStore } from './store/gpsStore';
import { useMemoryStore } from './store/memoryStore';

const Main = () => {
  const authInit = useAuthStore(state => state.init);
  const faceInit = useFaceStore(state => state.init);
  const reminderInit = useReminderStore(state => state.init);
  const alertInit = useAlertStore(state => state.init);
  const gpsInit = useGpsStore(state => state.init);
  const memoryInit = useMemoryStore(state => state.init);
  const user = useAuthStore(state => state.user);
  
  useEffect(() => {
    authInit();
  }, [authInit]);

  useEffect(() => {
    if (user) {
        const unsubs = [
            faceInit(),
            reminderInit(),
            alertInit(),
            gpsInit(),
            memoryInit()
        ];
        return () => unsubs.forEach(u => u && u());
    }
  }, [user, faceInit, reminderInit, alertInit, gpsInit, memoryInit]);

  return <App />;
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
