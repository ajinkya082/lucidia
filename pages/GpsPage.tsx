
import React from 'react';
import { useGpsStore, isOutsideZone } from '../store/gpsStore';
import { SafeZone } from '../types';

const MockMap: React.FC<{ patientLocation: { lat: number, lng: number }, safeZones: SafeZone[] }> = ({ patientLocation, safeZones }) => {
    // A simple SVG to represent the map
    const viewBoxSize = 400;
    const center = viewBoxSize / 2;
    // Simple scaling for display
    const scale = 50000;

    const patientX = center + (patientLocation.lng - safeZones[0]?.lng) * scale;
    const patientY = center - (patientLocation.lat - safeZones[0]?.lat) * scale;

    return (
        <div className="w-full h-full bg-indigo-50 rounded-lg flex items-center justify-center overflow-hidden">
            <svg viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="w-full h-full">
                {/* Draw Safe Zones */}
                {safeZones.map(zone => {
                    const zoneX = center + (zone.lng - safeZones[0]?.lng) * scale;
                    const zoneY = center - (zone.lat - safeZones[0]?.lat) * scale;
                    // Approximate radius for display
                    const displayRadius = zone.radius / 10;
                    return (
                        <circle
                            key={zone.id}
                            cx={zoneX}
                            cy={zoneY}
                            r={displayRadius}
                            fill="rgba(99, 102, 241, 0.2)"
                            stroke="#6366F1"
                            strokeWidth="2"
                        />
                    );
                })}

                {/* Draw Patient Location */}
                <circle cx={patientX} cy={patientY} r="8" fill="#EC4899" stroke="white" strokeWidth="2" />
            </svg>
        </div>
    );
};

const GpsPage: React.FC = () => {
    const { patientLocation, safeZones } = useGpsStore();

    const patientStatus = () => {
        // Fix: access patientLocation.location to match the expected {lat, lng} type
        const outside = safeZones.find(zone => isOutsideZone(patientLocation.location, zone));
        if (outside) {
            return { text: `Away from "${outside.name}"`, color: 'text-red-600' };
        }
        // Fix: access patientLocation.location to match the expected {lat, lng} type
        const inside = safeZones.find(zone => !isOutsideZone(patientLocation.location, zone));
        return { text: inside ? `At "${inside.name}"` : 'Checking status...', color: 'text-green-600' };
    };

    const status = patientStatus();

    return (
        <div>
            <h1 className="text-4xl font-bold text-brand-text mb-8">Where is John?</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 h-[65vh] bg-brand-surface p-4 rounded-2xl shadow-lg border border-slate-100">
                    <MockMap patientLocation={patientLocation.location} safeZones={safeZones} />
                </div>
                <div className="bg-brand-surface p-6 rounded-2xl shadow-lg h-fit border border-slate-100">
                    <h2 className="text-2xl font-semibold mb-4 text-brand-text">Location Details</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium text-brand-text-light">Current Spot</h3>
                            <p className="text-lg font-mono text-brand-primary">{patientLocation.location.lat.toFixed(4)}, {patientLocation.location.lng.toFixed(4)}</p>
                        </div>
                        <div>
                            <h3 className="font-medium text-brand-text-light">Status</h3>
                            <p className={`text-lg font-semibold ${status.color}`}>{status.text}</p>
                        </div>
                        <div>
                            <h3 className="font-medium text-brand-text-light">Last Checked</h3>
                            <p className="text-lg">{new Date(patientLocation.timestamp).toLocaleTimeString()}</p>
                        </div>
                    </div>
                     <h2 className="text-2xl font-semibold mt-8 mb-4 text-brand-text">Safe Areas</h2>
                     <ul className="space-y-2">
                        {safeZones.length > 0 ? safeZones.map(zone => (
                            <li key={zone.id} className="p-3 bg-brand-background rounded-xl font-medium">{zone.name}</li>
                        )) : (
                            <li className="p-3 bg-gray-100 rounded-lg text-gray-500">No safe areas yet.</li>
                        )}
                     </ul>
                </div>
            </div>
        </div>
    );
};

export default GpsPage;