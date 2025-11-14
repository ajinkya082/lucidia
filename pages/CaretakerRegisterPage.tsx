import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import { ArrowLeftIcon } from '../components/icons/Icons';
import { useUserStore } from '../store/userStore';
import { UserRole } from '../types';

const CaretakerForm = ({ handleRegister, name, setName, email, setEmail, password, setPassword, patientCode, setPatientCode, error, loading, navigate }) => (
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
      <h1 className="text-3xl font-bold text-brand-text">Create Caretaker Account</h1>
      <p className="mt-2 text-brand-text-light">Please fill in your details to get started.</p>
    </div>
    <form className="space-y-4 mt-6" onSubmit={handleRegister}>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-brand-text-light">Full Name</label>
        <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} className="form-input" placeholder="Jane Smith" required />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-brand-text-light">Email</label>
        <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-input" placeholder="you@example.com" required />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-brand-text-light">Password</label>
        <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-input" required />
      </div>
      <div>
        <label htmlFor="patient-code" className="block text-sm font-medium text-brand-text-light">Patient's Unique Code</label>
        <input id="patient-code" type="text" value={patientCode} onChange={e => setPatientCode(e.target.value)} className="form-input" placeholder="Enter code to link to a patient" required />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
      <Button type="submit" className="w-full justify-center !mt-6 py-3" loading={loading} size="lg">
        Create & Link Account
      </Button>
    </form>
  </motion.div>
);

const CaretakerSuccess = ({ navigate }) => (
  <motion.div
    key="success"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center"
  >
    <h1 className="text-3xl font-bold text-brand-text">Registration Successful!</h1>
    <div className="mt-4">
      <p className="text-brand-text-light">Your account has been created and linked. You can now log in.</p>
      <Button onClick={() => navigate('/login')} className="mt-6" size="lg">Go to Login</Button>
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

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const patient = findUserByPatientCode(patientCode.toUpperCase());
      if (!patient) {
        setError('Invalid patient code. Please check and try again.');
        setLoading(false);
        return;
      }

      addUser({
        name,
        email,
        role: UserRole.CARETAKER,
        patientId: patient.id,
      });

      setIsSubmitted(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full p-10 glass-card">
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