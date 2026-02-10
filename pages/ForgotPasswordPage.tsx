
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';

const PasswordResetForm = ({ handleSubmit, email, setEmail, loading }) => (
  <motion.div
    key="form"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    <div className="text-center">
      <h1 className="text-3xl font-bold text-brand-text">Recover Password</h1>
      <p className="mt-2 text-brand-text-light">We'll help you get back in safely.</p>
    </div>
    
    <form className="space-y-6 mt-12" onSubmit={handleSubmit}>
      <div>
         <label htmlFor="email" className="block text-sm font-bold text-brand-text ml-1 mb-2">Email Address</label>
         <input 
            id="email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input py-4 bg-white/50 border-white/40" 
            placeholder="you@example.com" 
            required 
         />
      </div>
      <Button type="submit" className="w-full justify-center rounded-2xl py-5 text-lg shadow-2xl font-bold" loading={loading} size="lg">
        Send Reset Link
      </Button>
    </form>

    <p className="text-center text-sm mt-10">
      <Link to="/login" className="font-bold text-brand-primary hover:text-indigo-700 transition-colors">Return to Sign in</Link>
    </p>
  </motion.div>
);

const SuccessMessage = ({ email }) => (
  <motion.div
    key="success"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center"
  >
    <h1 className="text-3xl font-bold text-brand-text tracking-tight">Check your inbox!</h1>
    <p className="mt-4 text-sm font-medium text-brand-text-light leading-relaxed">
        Instructions for system re-authorization have been dispatched to **{email}**.
    </p>
    <div className="mt-12">
         <Link to="/login" className="inline-block px-12 py-5 bg-brand-primary text-white font-bold rounded-2xl shadow-2xl hover:bg-brand-secondary transition-all text-sm uppercase tracking-widest">
            Back to Gateway
         </Link>
    </div>
  </motion.div>
);


const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setLoading(true);
      setTimeout(() => {
        setIsSubmitted(true);
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Professional Healthcare Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-[2000ms]"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[6px]"></div>
      </div>

      <div className="max-w-md w-full p-12 glass-card relative z-10 border border-white/40 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.2)]">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <PasswordResetForm
              handleSubmit={handleSubmit}
              email={email}
              setEmail={setEmail}
              loading={loading}
            />
          ) : (
            <SuccessMessage email={email} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
