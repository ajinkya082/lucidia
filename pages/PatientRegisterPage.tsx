import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import { ArrowLeftIcon, ClipboardDocumentIcon } from '../components/icons/Icons';
import { useUserStore } from '../store/userStore';
import { UserRole } from '../types';

const PatientForm = ({ handleRegister, name, setName, email, setEmail, password, setPassword, loading, navigate }) => (
  <motion.div
    key="form"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    <button onClick={() => navigate('/register')} className="flex items-center gap-1 text-sm font-medium text-brand-text-light hover:text-brand-primary mb-4">
      <ArrowLeftIcon />
      Back
    </button>
    <div className="text-center">
      <h1 className="text-3xl font-bold text-brand-text">Create Patient Account</h1>
      <p className="mt-2 text-brand-text-light">Please fill in your details below.</p>
    </div>
    <form className="space-y-4 mt-6" onSubmit={handleRegister}>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-brand-text-light">Full Name</label>
        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-input" placeholder="John Doe" required />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-brand-text-light">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" placeholder="you@example.com" required />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-brand-text-light">Password</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" required />
      </div>
      <Button type="submit" className="w-full justify-center !mt-6 py-3" loading={loading} size="lg">
        Create Account
      </Button>
    </form>
  </motion.div>
);

const PatientSuccess = ({ patientCode, copyToClipboard, navigate }) => (
  <motion.div
    key="success"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center"
  >
    <h1 className="text-3xl font-bold text-brand-text">Registration Successful!</h1>
    <div className="mt-4">
      <p className="text-brand-text-light">Share this code with your caretaker to link accounts.</p>
      <div className="my-6 p-4 bg-white/50 border-2 border-dashed border-brand-primary rounded-xl">
        <p className="text-sm font-medium text-brand-text-light">Your Patient Code:</p>
        <div className="flex items-center justify-center gap-4 mt-2">
          <p className="text-4xl font-bold tracking-widest text-brand-text font-mono">{patientCode}</p>
          <Button variant="secondary" onClick={copyToClipboard} size="sm">
            <ClipboardDocumentIcon />
          </Button>
        </div>
      </div>
      <Button onClick={() => navigate('/login')} size="lg">Proceed to Login</Button>
    </div>
  </motion.div>
);


const PatientRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { addUser } = useUserStore();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [patientCode, setPatientCode] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      addUser({
          name,
          email,
          role: UserRole.PATIENT,
          patientCode: newCode,
      });
      setPatientCode(newCode);
      setIsSubmitted(true);
      setLoading(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(patientCode);
    alert('Code copied to clipboard!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full p-10 glass-card">
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