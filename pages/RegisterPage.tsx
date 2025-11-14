import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 glass-card">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-brand-text">Register for Lucidia</h1>
            <p className="mt-2 text-brand-text-light">First, let us know who you are.</p>
        </div>
        <div className="mt-8 space-y-4">
            <Button onClick={() => navigate('/register/patient')} className="w-full justify-center py-3 text-base" size="lg">
                I am a Patient
            </Button>
            <Button onClick={() => navigate('/register/caretaker')} variant="secondary" className="w-full justify-center py-3 text-base" size="lg">
                I am a Caretaker
            </Button>
        </div>
        <p className="text-center text-sm">
            <Link to="/login" className="font-medium text-brand-primary hover:text-indigo-700">
                Already have an account? Sign in
            </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;