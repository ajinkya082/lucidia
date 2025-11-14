
import { create } from 'zustand';
import { SafeZone } from '../types';

interface GpsState {
  patientLocation: {
    location: { lat: number, lng: number };
    timestamp: string;
  };
  safeZones: SafeZone[];
  updatePatientLocation: (location: { lat: number, lng: number }) => void;
  addSafeZone: (zoneData: Omit<SafeZone, 'id'>) => void;
  updateSafeZone: (zoneData: SafeZone) => void;
  deleteSafeZone: (id: string) => void;
}

const mockSafeZones: SafeZone[] = [
    { id: 'sz-1', name: 'Home', lat: 34.0522, lng: -118.2437, radius: 500 },
    { id: 'sz-2', name: 'Community Center', lat: 34.0580, lng: -118.2500, radius: 1000 },
];

export const useGpsStore = create<GpsState>((set) => ({
    patientLocation: {
        location: { lat: 34.0522, lng: -118.2437 },
        timestamp: new Date().toISOString(),
    },
    safeZones: mockSafeZones,
    updatePatientLocation: (location) => {
        set({ patientLocation: { location, timestamp: new Date().toISOString() } });
    },
    addSafeZone: (zoneData) => {
        const newZone: SafeZone = { id: `sz-${Date.now()}`, ...zoneData };
        set(state => ({ safeZones: [...state.safeZones, newZone] }));
    },
    updateSafeZone: (zoneData) => {
        set(state => ({
            safeZones: state.safeZones.map(z => z.id === zoneData.id ? zoneData : z)
        }));
    },
    deleteSafeZone: (id) => {
        set(state => ({
            safeZones: state.safeZones.filter(z => z.id !== id)
        }));
    },
}));

// Haversine formula to calculate distance between two lat/lng points
const haversineDistance = (coords1: {lat: number, lng: number}, coords2: {lat: number, lng: number}) => {
  const toRad = (x: number) => x * Math.PI / 180;
  const R = 6371e3; // Earth radius in meters

  const dLat = toRad(coords2.lat - coords1.lat);
  const dLng = toRad(coords2.lng - coords1.lng);
  const lat1 = toRad(coords1.lat);
  const lat2 = toRad(coords2.lat);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const isOutsideZone = (location: {lat: number, lng: number}, zone: SafeZone) => {
    const distance = haversineDistance(location, { lat: zone.lat, lng: zone.lng });
    return distance > zone.radius;
};
