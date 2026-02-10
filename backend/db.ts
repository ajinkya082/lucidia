
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy,
  getDocs
} from 'firebase/firestore';
import { db } from './firebase';

// Users
export const getUserDoc = (uid: string) => getDoc(doc(db, 'users', uid));
export const setUserDoc = (uid: string, data: any) => setDoc(doc(db, 'users', uid), data);
export const updateUserDoc = (uid: string, data: any) => updateDoc(doc(db, 'users', uid), data);
export const findPatientByCode = async (code: string) => {
  const q = query(collection(db, 'users'), where('role', '==', 'patient'), where('patientCode', '==', code));
  const snapshot = await getDocs(q);
  return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
};

// Faces
export const listenToFaces = (targetId: string, callback: (faces: any[]) => void) => {
  const q = query(collection(db, 'faces'), where('ownerId', '==', targetId));
  return onSnapshot(q, (snap) => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
};
export const addFaceDoc = (data: any) => addDoc(collection(db, 'faces'), { ...data, createdAt: new Date().toISOString() });
export const updateFaceDoc = (id: string, data: any) => updateDoc(doc(db, 'faces', id), data);
export const deleteFaceDoc = (id: string) => deleteDoc(doc(db, 'faces', id));

// Memories
export const listenToMemories = (targetId: string, callback: (memories: any[]) => void) => {
  const q = query(collection(db, 'memories'), where('ownerId', '==', targetId), orderBy('date', 'desc'));
  return onSnapshot(q, (snap) => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
};
export const addMemoryDoc = (data: any) => addDoc(collection(db, 'memories'), { ...data, createdAt: new Date().toISOString() });
export const updateMemoryDoc = (id: string, data: any) => updateDoc(doc(db, 'memories', id), data);
export const deleteMemoryDoc = (id: string) => deleteDoc(doc(db, 'memories', id));

// Reminders
export const listenToReminders = (targetId: string, callback: (reminders: any[]) => void) => {
  const q = query(collection(db, 'reminders'), where('ownerId', '==', targetId));
  return onSnapshot(q, (snap) => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
};
export const addReminderDoc = (data: any) => addDoc(collection(db, 'reminders'), { ...data, notified: false, createdAt: new Date().toISOString() });
export const updateReminderDoc = (id: string, data: any) => updateDoc(doc(db, 'reminders', id), data);
export const deleteReminderDoc = (id: string) => deleteDoc(doc(db, 'reminders', id));

// Alerts
export const listenToAlerts = (targetId: string, callback: (alerts: any[]) => void) => {
  const q = query(collection(db, 'alerts'), where('ownerId', '==', targetId), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snap) => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
};
export const addAlertDoc = (data: any) => addDoc(collection(db, 'alerts'), { ...data, timestamp: new Date().toISOString(), isRead: false });
export const updateAlertDoc = (id: string, data: any) => updateDoc(doc(db, 'alerts', id), data);

// GPS & SafeZones
export const updateLocationDoc = (uid: string, location: any) => setDoc(doc(db, 'locations', uid), { location, timestamp: new Date().toISOString() });
export const listenToLocation = (uid: string, callback: (data: any) => void) => onSnapshot(doc(db, 'locations', uid), (d) => d.exists() && callback(d.data()));
export const listenToSafeZones = (targetId: string, callback: (zones: any[]) => void) => {
  const q = query(collection(db, 'safeZones'), where('ownerId', '==', targetId));
  return onSnapshot(q, (snap) => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
};
export const addSafeZoneDoc = (data: any) => addDoc(collection(db, 'safeZones'), data);
export const updateSafeZoneDoc = (id: string, data: any) => updateDoc(doc(db, 'safeZones', id), data);
export const deleteSafeZoneDoc = (id: string) => deleteDoc(doc(db, 'safeZones', id));
