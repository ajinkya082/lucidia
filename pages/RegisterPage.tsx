
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Professional Healthcare Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-[2000ms]"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[6px]"></div>
      </div>

      <div className="max-w-md w-full space-y-10 p-12 glass-card relative z-10 border border-white/40 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.2)]">
        <div className="text-center">
            <h1 className="text-4xl font-extrabold text-brand-primary">Join Lucidia</h1>
            <p className="mt-3 text-brand-text-light text-lg">Choose your journey.</p>
        </div>

        <div className="mt-10 space-y-4">
            <Button onClick={() => navigate('/register/patient')} className="w-full justify-center py-5 text-lg rounded-2xl shadow-xl font-bold" size="lg">
                I am a Patient
            </Button>
            <Button onClick={() => navigate('/register/caretaker')} variant="secondary" className="w-full justify-center py-5 text-lg rounded-2xl bg-white/60 border-white hover:bg-white/90 text-brand-text font-bold" size="lg">
                I am a Caretaker
            </Button>
        </div>

        <div className="pt-8 text-center border-t border-brand-text/5 mt-6">
            <p className="text-brand-text-light">
                Already registered? {' '}
                <Link to="/login" className="font-bold text-brand-primary hover:text-indigo-700 transition-colors">
                    Sign in here
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
