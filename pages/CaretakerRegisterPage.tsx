
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import { ArrowLeftIcon, ShieldCheckIcon } from '../components/icons/Icons';
import { useUserStore } from '../store/userStore';
import { UserRole } from '../types';
import { registerUser } from '../backend/auth';

const CaretakerForm = ({ handleRegister, name, setName, email, setEmail, password, setPassword, patientCode, setPatientCode, error, loading, navigate }) => (
  <motion.div
    key="form"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    <button onClick={() => navigate('/register')} className="flex items-center gap-2 text-sm font-semibold text-brand-text-light hover:text-brand-primary mb-8 transition-colors group">
      <div className="group-hover:-translate-x-1 transition-transform">
        <ArrowLeftIcon />
      </div>
      Back
    </button>
    <div className="text-center">
      <h1 className="text-3xl font-bold text-brand-text">Caretaker Account</h1>
      <p className="mt-2 text-brand-text-light">Connect with your patient.</p>
    </div>
    <form className="space-y-4 mt-10" onSubmit={handleRegister}>
      <div>
        <label htmlFor="name" className="block text-sm font-bold text-brand-text ml-1 mb-2">Full Name</label>
        <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} className="form-input py-4 bg-white/50 border-white/40" placeholder="Jane Smith" required />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-bold text-brand-text ml-1 mb-2">Email Address</label>
        <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-input py-4 bg-white/50 border-white/40" placeholder="you@example.com" required />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-bold text-brand-text ml-1 mb-2">Secure Password</label>
        <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-input py-4 bg-white/50 border-white/40" required minLength={6} />
      </div>
      <div>
        <label htmlFor="patient-code" className="block text-sm font-bold text-brand-text ml-1 mb-2">Patient's Unique ID</label>
        <input id="patient-code" type="text" value={patientCode} onChange={e => setPatientCode(e.target.value)} className="form-input uppercase tracking-[0.2em] font-mono text-center text-lg py-5 bg-slate-50 border-brand-primary/20" placeholder="ABC123" required />
        {error && <p className="text-brand-danger text-xs mt-3 font-medium px-3 py-2 bg-red-50/50 backdrop-blur-sm rounded-xl border border-red-100">{error}</p>}
      </div>
      <Button type="submit" className="w-full justify-center !mt-12 py-5 text-lg rounded-2xl shadow-2xl font-bold" loading={loading} size="lg">
        Create & Link Account
      </Button>
    </form>
  </motion.div>
);

const CaretakerSuccess = ({ navigate }) => (
  <motion.div
    key="success"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center"
  >
    <div className="flex justify-center mb-8">
        <div className="bg-brand-success/10 p-6 rounded-2xl text-brand-success border border-brand-success/20 shadow-xl">
            <ShieldCheckIcon />
        </div>
    </div>
    <h1 className="text-3xl font-bold text-brand-text">Verified!</h1>
    <div className="mt-6">
      <p className="text-brand-text-light font-medium text-sm leading-relaxed">Your caretaker profile is linked successfully. You're ready to provide support.</p>
      <Button onClick={() => navigate('/login')} className="mt-12 w-full rounded-2xl py-5 shadow-2xl font-bold" size="lg">Sign In to Dashboard</Button>
    </div>
  </motion.div>
);

const CaretakerRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { addUser, findUserByPatientCode } = useUserStore();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [patientCode, setPatientCode] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const patient = await findUserByPatientCode(patientCode.toUpperCase());
      if (!patient) {
        setError('This ID does not exist. Please check with the patient.');
        setLoading(false);
        return;
      }

      const userCredential = await registerUser(email, password);
      await addUser(userCredential.user.uid, {
        name,
        email,
        role: UserRole.CARETAKER,
        patientId: patient.id,
      });

      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-[2000ms]"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[6px]"></div>
      </div>

      <div className="max-w-md w-full p-12 glass-card relative z-10 border border-white/40 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.2)]">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <CaretakerForm
              handleRegister={handleRegister}
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              patientCode={patientCode}
              setPatientCode={setPatientCode}
              error={error}
              loading={loading}
              navigate={navigate}
            />
          ) : (
            <CaretakerSuccess navigate={navigate} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CaretakerRegisterPage;
