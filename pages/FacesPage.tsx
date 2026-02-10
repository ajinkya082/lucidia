
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useFaceStore } from '../store/faceStore';
import { UserRole, FaceProfile } from '../types';
import Button from '../components/ui/Button';
import { PlusIcon, PencilIcon, TrashIcon, VideoCameraIcon, XMarkIcon, SpinnerIcon, ShieldCheckIcon } from '../components/icons/Icons';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";

const FaceCard: React.FC<{ face: FaceProfile, role: UserRole }> = ({ face, role }) => {
    const { deleteFace } = useFaceStore();
    return (
        <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="glass-card overflow-hidden border border-white/40 flex flex-col h-full"
        >
            <img src={face.imageUrl} alt={face.name} className="w-full h-56 object-cover"/>
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-xl font-bold text-brand-text">{face.name}</h3>
                        <p className="text-brand-primary font-semibold text-sm">{face.relation}</p>
                    </div>
                    {role === UserRole.PATIENT && (
                        <span className="bg-brand-success/10 text-brand-success text-[10px] uppercase tracking-wider px-2 py-1 rounded-full font-bold border border-brand-success/20">Saved Friend</span>
                    )}
                </div>
                <p className="text-brand-text-light text-sm leading-relaxed mb-4 flex-grow italic">"{face.notes}"</p>
                {role === UserRole.CARETAKER && (
                    <div className="flex justify-end space-x-2">
                        <Button variant="secondary" size="sm" className="p-2"><PencilIcon /></Button>
                        <Button variant="danger" size="sm" className="p-2" onClick={() => deleteFace(face.id)}><TrashIcon /></Button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const PatientFacesView = () => {
    const { faces, addFace } = useFaceStore();
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [status, setStatus] = useState<'idle' | 'recognizing' | 'recognized' | 'not-found' | 'error' | 'saved'>('idle');
    const [recognizedFace, setRecognizedFace] = useState<FaceProfile | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const lastRecognizedId = useRef<string | null>(null);
    const recognitionTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        if (isCameraOn) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } })
                .then(stream => {
                    streamRef.current = stream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                    recognitionTimeoutRef.current = window.setTimeout(performAiRecognition, 2000);
                })
                .catch(err => {
                    console.error("Error accessing camera: ", err);
                    alert("I couldn't open the camera. Please make sure I have permission to see.");
                    setIsCameraOn(false);
                });
        } else {
            stopCameraStream();
        }
        return () => stopCameraStream();
    }, [isCameraOn]);

    const stopCameraStream = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (recognitionTimeoutRef.current) {
            clearTimeout(recognitionTimeoutRef.current);
        }
    };

    const captureFrame = (): string | null => {
        if (!videoRef.current || !canvasRef.current) return null;
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(dataUrl);
        return dataUrl.split(',')[1];
    };

    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1.1;
            window.speechSynthesis.speak(utterance);
        }
    };

    const performAiRecognition = async () => {
        if (!streamRef.current) return;

        const base64Image = captureFrame();
        if (!base64Image) {
            recognitionTimeoutRef.current = window.setTimeout(performAiRecognition, 1500);
            return;
        }

        setStatus('recognizing');

        try {
            // Guideline: Create a new GoogleGenAI instance right before making an API call
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const faceContext = faces.map(f => `{"id": "${f.id}", "name": "${f.name}", "relation": "${f.relation}"}`).join(', ');
            
            const prompt = `Identify the person in this photo from the following list of family and friends: [${faceContext}].
            
            Respond ONLY with the "id" of that person if they match.
            If no face is present, return "none".
            If a person is present but not in the list, return "unknown".`;

            // Guideline: Use object for contents with parts, and property .text on response
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: {
                    parts: [
                        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
                        { text: prompt }
                    ]
                },
                config: {
                    systemInstruction: `You are Lucidia, a gentle memory support assistant. 
                    - Speak calmly and kindly. 
                    - Use short, simple sentences. 
                    - Focus on comfort and reassurance.`,
                    temperature: 0.1,
                },
            });

            const result = response.text?.trim().toLowerCase() || 'unknown';

            if (result === 'none') {
                if (lastRecognizedId.current !== null) {
                    setRecognizedFace(null);
                    setStatus('idle');
                    lastRecognizedId.current = null;
                } else {
                    setStatus('idle');
                }
            } else if (result === 'unknown') {
                setStatus('not-found');
                if (lastRecognizedId.current !== 'unknown') {
                    speak("I see someone new. Would you like me to remember them for you?");
                    lastRecognizedId.current = 'unknown';
                }
            } else {
                const matchedFace = faces.find(f => f.id === result || f.name.toLowerCase().includes(result));
                if (matchedFace) {
                    setRecognizedFace(matchedFace);
                    setStatus('recognized');
                    if (lastRecognizedId.current !== matchedFace.id) {
                        speak(`That is ${matchedFace.name}, your ${matchedFace.relation}. They are so happy to see you.`);
                        lastRecognizedId.current = matchedFace.id;
                    }
                } else {
                    setStatus('not-found');
                }
            }
        } catch (error) {
            console.error("AI Recognition Error:", error);
            setStatus('error');
        } finally {
            if (streamRef.current && status !== 'recognized' && status !== 'not-found') {
                recognitionTimeoutRef.current = window.setTimeout(performAiRecognition, 8000);
            }
        }
    };

    const handleConfirmNewPerson = () => {
        if (capturedImage) {
            addFace({
                name: 'New Friend',
                relation: 'Visitor',
                imageUrl: capturedImage,
                notes: 'I met this person today. They were very kind.'
            });
            setStatus('saved');
            speak("I have saved this friend to your gallery. I will remember them next time.");
            setTimeout(() => {
                setStatus('idle');
                setRecognizedFace(null);
                lastRecognizedId.current = null;
                recognitionTimeoutRef.current = window.setTimeout(performAiRecognition, 2000);
            }, 3000);
        }
    };

    const stopCamera = () => {
        window.speechSynthesis.cancel();
        lastRecognizedId.current = null;
        setIsCameraOn(false);
        setStatus('idle');
        setRecognizedFace(null);
        setCapturedImage(null);
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
             <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/40 backdrop-blur-2xl p-8 rounded-[2rem] shadow-2xl mb-8 text-center border border-white/60"
             >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-primary/10 rounded-2xl mb-4 text-brand-primary">
                    <VideoCameraIcon />
                </div>
                <h2 className="text-3xl font-bold text-brand-text mb-2">Who is here?</h2>
                <p className="text-brand-text-light mb-8 max-w-md mx-auto">
                    {isCameraOn 
                        ? "I am looking carefully. Please keep the camera steady." 
                        : "Turn on the camera and I will help you recognize your visitors automatically."}
                </p>
                
                {!isCameraOn ? (
                    <Button onClick={() => setIsCameraOn(true)} leftIcon={<VideoCameraIcon />} size="lg" className="px-10 py-5 text-lg rounded-2xl shadow-indigo-200 shadow-2xl">
                        Start Looking
                    </Button>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className="relative w-full max-w-lg aspect-video bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/80 group">
                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform transition-transform group-hover:scale-[1.02]"></video>
                            <canvas ref={canvasRef} className="hidden"></canvas>
                            
                            {/* Scanning Overlay */}
                            <div className="absolute inset-0 pointer-events-none z-10">
                                <motion.div 
                                    initial={{ top: '0%' }}
                                    animate={{ top: '100%' }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-primary to-transparent shadow-[0_0_20px_rgba(99,102,241,1)]"
                                />
                                <div className="absolute inset-0 border-[20px] border-brand-primary/5 opacity-50"></div>
                            </div>

                            {status === 'recognizing' && (
                                <div className="absolute top-4 right-4 z-30">
                                    <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-brand-primary animate-pulse">
                                        <SpinnerIcon />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Watching...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 flex gap-4">
                            <Button onClick={stopCamera} variant="secondary" leftIcon={<XMarkIcon />} size="lg" className="px-10 py-4 text-lg rounded-2xl border-white/50">
                                Stop
                            </Button>
                        </div>
                    </div>
                )}
            </motion.div>

            <AnimatePresence mode="wait">
                {status === 'recognized' && recognizedFace && (
                    <motion.div 
                        key="recognized"
                        initial={{ opacity: 0, y: 40 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -40 }} 
                        className="text-center"
                    >
                        <div className="mb-10">
                            <span className="inline-block px-4 py-1 bg-brand-success/10 text-brand-success text-xs font-bold rounded-full mb-3 tracking-widest uppercase italic">I remember them</span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-brand-text leading-tight">
                                This is <br/>
                                <span className="text-brand-primary decoration-brand-accent/20 underline underline-offset-8">{recognizedFace.name}</span>
                            </h2>
                            <p className="text-2xl text-brand-text-light mt-4">Your {recognizedFace.relation}</p>
                        </div>
                        
                        <div className="max-w-sm mx-auto transform transition-all duration-500 hover:scale-[1.03]">
                            <FaceCard face={recognizedFace} role={UserRole.PATIENT} />
                        </div>
                    </motion.div>
                )}

                {status === 'not-found' && isCameraOn && (
                    <motion.div 
                        key="not-found"
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="p-8 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] text-center max-w-md mx-auto shadow-xl"
                    >
                        <p className="text-brand-text font-bold text-2xl mb-4">
                            I see someone new.
                        </p>
                        <p className="text-brand-text-light text-lg mb-8 leading-relaxed">
                            Should I remember this friend for you?
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button onClick={handleConfirmNewPerson} size="lg" className="px-8 rounded-2xl">Yes, remember them</Button>
                            <Button variant="secondary" onClick={() => setStatus('idle')} size="lg" className="px-8 rounded-2xl">Not now</Button>
                        </div>
                    </motion.div>
                )}

                {status === 'saved' && (
                    <motion.div 
                        key="saved"
                        initial={{ opacity: 0, scale: 0.8 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        className="p-8 bg-brand-success/10 backdrop-blur-xl border border-brand-success/40 rounded-[2rem] text-center max-w-md mx-auto shadow-xl flex flex-col items-center"
                    >
                        <div className="w-16 h-16 bg-brand-success text-white rounded-full flex items-center justify-center mb-4">
                            <ShieldCheckIcon />
                        </div>
                        <p className="text-brand-success font-bold text-2xl">Saved</p>
                        <p className="text-brand-text-light mt-2">I have added this friend to your list.</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isCameraOn && (
                <div className="mt-16">
                    <div className="flex items-center gap-4 mb-10 overflow-hidden">
                        <div className="h-px bg-brand-primary/20 flex-grow"></div>
                        <h3 className="text-2xl font-bold text-brand-text px-4">People You Know</h3>
                        <div className="h-px bg-brand-primary/20 flex-grow"></div>
                    </div>
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {faces.map(face => (
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
    const { faces, deleteFace } = useFaceStore();
    return (
        <div className="pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-brand-text mb-2">Recognizing Friends</h1>
                    <p className="text-brand-text-light text-lg">Keep track of the people John loves so I can help him remember them.</p>
                </div>
                <Button onClick={() => navigate('/faces/add')} leftIcon={<PlusIcon />} size="lg" className="w-full md:w-auto shadow-indigo-100 shadow-2xl rounded-2xl">
                    Add New Friend
                </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                 {faces.map(face => (
                    <FaceCard key={face.id} face={face} role={UserRole.CARETAKER} />
                ))}
            </div>

            <div className="mt-16 p-8 bg-brand-primary/5 rounded-[2rem] border border-brand-primary/10">
                <h4 className="font-bold text-brand-text text-xl mb-4 flex items-center gap-2">
                    <SpinnerIcon /> Helpful Tips
                </h4>
                <ul className="grid md:grid-cols-2 gap-4 text-brand-text-light">
                    <li className="flex items-start gap-2">
                        <span className="text-brand-primary font-bold">•</span>
                        Use clear photos where the face is easy to see.
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-brand-primary font-bold">•</span>
                        Add a nice note about how the person knows John.
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-brand-primary font-bold">•</span>
                        Good lighting helps me recognize people faster.
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-brand-primary font-bold">•</span>
                        Profiles are saved and synced instantly.
                    </li>
                </ul>
            </div>
        </div>
    );
};


const FacesPage: React.FC = () => {
    const { user } = useAuthStore();
    return user?.role === UserRole.PATIENT ? <PatientFacesView /> : <CaretakerFacesView />;
};

export default FacesPage;