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
      <h1 className="text-3xl font-bold text-brand-text">Forgot Password?</h1>
      <p className="mt-2 text-brand-text-light">No worries, we'll send you reset instructions.</p>
    </div>
    
    <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
      <div>
         <label htmlFor="email" className="block text-sm font-medium text-brand-text-light">Email Address</label>
         <input 
            id="email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input" 
            placeholder="you@example.com" 
            required 
         />
      </div>
      <Button type="submit" className="w-full justify-center" loading={loading} size="lg">
        Send Reset Link
      </Button>
    </form>

    <p className="text-center text-sm mt-6">
      <Link to="/login" className="font-medium text-brand-primary hover:text-indigo-700">Return to Sign in</Link>
    </p>
  </motion.div>
);

const SuccessMessage = ({ email }) => (
  <motion.div
    key="success"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center"
  >
    <h1 className="text-3xl font-bold text-brand-text">Check your inbox!</h1>
    <p className="mt-4 text-brand-text-light">
        If an account with the email <strong>{email}</strong> exists, we've sent instructions to reset your password.
    </p>
    <p className="mt-6">
         <Link to="/login" className="font-medium text-brand-primary hover:text-indigo-700">Return to Login</Link>
    </p>
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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full p-10 glass-card">
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