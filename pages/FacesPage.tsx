import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { UserRole, FaceProfile } from '../types';
import Button from '../components/ui/Button';
import { PlusIcon, PencilIcon, TrashIcon, VideoCameraIcon, XMarkIcon } from '../components/icons/Icons';
import { motion, AnimatePresence } from 'framer-motion';

const mockFaces: FaceProfile[] = [
    { id: '1', name: 'Jane Smith', relation: 'Daughter', imageUrl: 'https://picsum.photos/seed/jane/400/400', notes: 'Visits every Sunday.'},
    { id: '2', name: 'Dr. Emily White', relation: 'Doctor', imageUrl: 'https://picsum.photos/seed/emily/400/400', notes: 'Appointment next Tuesday.'},
    { id: '3', name: 'Mike Johnson', relation: 'Grandson', imageUrl: 'https://picsum.photos/seed/mike/400/400', notes: 'Loves to play chess.'},
];

const FaceCard: React.FC<{ face: FaceProfile, role: UserRole }> = ({ face, role }) => (
    <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        whileHover={{ scale: 1.05, y: -5 }}
        className="bg-brand-surface rounded-2xl shadow-lg overflow-hidden"
    >
        <img src={face.imageUrl} alt={face.name} className="w-full h-56 object-cover"/>
        <div className="p-5">
            <h3 className="text-xl font-bold text-brand-text">{face.name}</h3>
            <p className="text-brand-primary font-semibold text-md">{face.relation}</p>
            <p className="text-brand-text-light mt-2">{face.notes}</p>
            {role === UserRole.CARETAKER && (
                <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="secondary" size="sm"><PencilIcon /></Button>
                    <Button variant="danger" size="sm"><TrashIcon /></Button>
                </div>
            )}
        </div>
    </motion.div>
);

const PatientFacesView = () => {
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [status, setStatus] = useState<'idle' | 'recognizing' | 'recognized'>('idle');
    const [recognizedFace, setRecognizedFace] = useState<FaceProfile | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        if (isCameraOn) {
            // When camera is turned on, get the stream
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    streamRef.current = stream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                })
                .catch(err => {
                    console.error("Error accessing camera: ", err);
                    alert("Could not access the camera. Please check permissions.");
                    setIsCameraOn(false); // Turn off if permission is denied
                });
        } else {
            // When camera is turned off, stop the stream
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
        }
        
        // Cleanup function for when the component unmounts
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
        };
    }, [isCameraOn]);

    const startCamera = () => {
        setIsCameraOn(true);
        setStatus('recognizing');

        // Simulate recognition after a delay
        setTimeout(() => {
            if (streamRef.current) { // Check if camera is still running when timeout fires
                const randomFace = mockFaces[Math.floor(Math.random() * mockFaces.length)];
                setRecognizedFace(randomFace);
                setStatus('recognized');
                if ('speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(`This is ${randomFace.name}, your ${randomFace.relation}.`);
                    window.speechSynthesis.speak(utterance);
                }
            }
        }, 4000);
    };

    const stopCamera = () => {
        window.speechSynthesis.cancel(); // Stop any ongoing speech
        setIsCameraOn(false);
        setStatus('idle');
        setRecognizedFace(null);
    };

    return (
        <div>
             <div className="bg-brand-surface/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg mb-8 text-center">
                <h2 className="text-3xl font-bold text-brand-text mb-2">Who is this person?</h2>
                <p className="text-brand-text-light mb-6">Point the camera at someone to identify them.</p>
                {!isCameraOn ? (
                    <Button onClick={startCamera} leftIcon={<VideoCameraIcon />} size="lg">
                        Start Recognition
                    </Button>
                ) : (
                    <Button onClick={stopCamera} variant="danger" leftIcon={<XMarkIcon />} size="lg">
                        Stop Camera
                    </Button>
                )}

                {isCameraOn && (
                     <div className="mt-6 relative w-full max-w-lg mx-auto aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-inner">
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
                        {status === 'recognizing' && (
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-white"></div>
                                <p className="mt-4 text-lg font-semibold">Recognizing...</p>
                            </div>
                        )}
                     </div>
                )}
            </div>

            <AnimatePresence>
            {status === 'recognized' && recognizedFace && (
                <motion.div 
                    initial={{opacity:0, y:20}} 
                    animate={{opacity:1, y:0}} 
                    exit={{opacity:0, y:-20}} 
                    className="text-center"
                >
                     <h2 className="text-5xl font-bold text-brand-text">
                        This is <span className="text-brand-primary">{recognizedFace.name}</span>
                     </h2>
                     <p className="text-3xl text-brand-text-light mt-2">Your {recognizedFace.relation}</p>
                     
                     <div className="max-w-sm mx-auto mt-8">
                        <FaceCard face={recognizedFace} role={UserRole.PATIENT} />
                     </div>
                </motion.div>
            )}
            </AnimatePresence>

            {!isCameraOn && (
                <div>
                     <h3 className="text-3xl font-semibold text-brand-text mb-6">Saved People</h3>
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mockFaces.map(face => (
                            <FaceCard key={face.id} face={face} role={UserRole.PATIENT} />
                        ))}
                    </motion.div>
                </div>
            )}
        </div>
    );
};

const CaretakerFacesView = () => {
    const navigate = useNavigate();
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-brand-text">Manage Face Profiles</h1>
                <Button onClick={() => navigate('/faces/add')} leftIcon={<PlusIcon />} size="lg">
                    Add New Face
                </Button>
            </div>
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                 {mockFaces.map(face => (
                    <FaceCard key={face.id} face={face} role={UserRole.CARETAKER} />
                ))}
            </motion.div>
        </div>
    );
};


const FacesPage: React.FC = () => {
    const { user } = useAuthStore();
    return user?.role === UserRole.PATIENT ? <PatientFacesView /> : <CaretakerFacesView />;
};

export default FacesPage;