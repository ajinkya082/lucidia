
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import { ArrowLeftIcon, ClipboardDocumentIcon, ShieldCheckIcon } from '../components/icons/Icons';
import { useUserStore } from '../store/userStore';
import { UserRole } from '../types';
import { registerUser } from '../backend/auth';

const PatientForm = ({ handleRegister, name, setName, email, setEmail, password, setPassword, loading, navigate, error }) => (
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
      <h1 className="text-3xl font-bold text-brand-text">Patient Profile</h1>
      <p className="mt-2 text-brand-text-light">Let's set up your safe space.</p>
    </div>
    
    <form className="space-y-5 mt-10" onSubmit={handleRegister}>
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-bold text-brand-text ml-1 mb-2">Full Name</label>
        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-input py-4 bg-white/50 border-white/40" placeholder="John Doe" required />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-bold text-brand-text ml-1 mb-2">Email Address</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input py-4 bg-white/50 border-white/40" placeholder="you@example.com" required />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-bold text-brand-text ml-1 mb-2">Secure Password</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input py-4 bg-white/50 border-white/40" required minLength={6} />
      </div>
      <Button type="submit" className="w-full justify-center !mt-12 py-5 text-lg rounded-2xl shadow-2xl font-bold" loading={loading} size="lg">
        Create My Profile
      </Button>
    </form>
  </motion.div>
);

const PatientSuccess = ({ patientCode, copyToClipboard, navigate }) => (
  <motion.div
    key="success"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center"
  >
    <div className="flex justify-center mb-8">
        <div className="bg-brand-success/10 p-5 rounded-2xl text-brand-success border border-brand-success/20 shadow-xl">
            <ShieldCheckIcon />
        </div>
    </div>
    <h1 className="text-3xl font-bold text-brand-text">All Ready!</h1>
    <p className="mt-4 text-brand-text-light leading-relaxed">
        Your account is verified. Give this <strong>Unique ID</strong> to your caretaker so they can help you.
    </p>

    <div className="my-12 relative group max-w-sm mx-auto">
      <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary rounded-3xl blur-lg opacity-20 group-hover:opacity-40 transition duration-1000"></div>
      <div className="relative bg-white border border-slate-100 rounded-3xl p-10 shadow-2xl overflow-hidden text-center">
        <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em] mb-6">Patient Unique ID</p>
        <div className="flex flex-col">
          <p className="text-5xl font-mono font-black tracking-[0.2em] text-brand-text py-4 bg-slate-50 rounded-xl border border-slate-100 mb-6">
            {patientCode}
          </p>
        </div>
        
        <button 
          onClick={copyToClipboard}
          className="mt-6 w-full flex items-center justify-center gap-2 text-brand-primary font-bold hover:bg-brand-primary/5 transition-all py-3 px-6 rounded-xl border border-brand-primary/20 text-xs uppercase tracking-widest"
        >
          <ClipboardDocumentIcon />
          <span>Copy ID Code</span>
        </button>
      </div>
    </div>

    <Button onClick={() => navigate('/login')} size="lg" className="w-full rounded-2xl py-5 shadow-2xl font-bold">
        Continue to Login
    </Button>
  </motion.div>
);


const PatientRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { addUser } = useUserStore();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [patientCode, setPatientCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await registerUser(email, password);
      const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      await addUser(userCredential.user.uid, {
          name,
          email,
          role: UserRole.PATIENT,
          patientCode: newCode,
      });

      setPatientCode(newCode);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(patientCode);
    alert('Unique ID copied to clipboard!');
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
            <PatientForm 
              handleRegister={handleRegister}
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              loading={loading}
              navigate={navigate}
              error={error}
            />
          ) : (
            <PatientSuccess
              patientCode={patientCode}
              copyToClipboard={copyToClipboard}
              navigate={navigate}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PatientRegisterPage;
