import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types';
import Button from '../components/ui/Button';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [loadingRole, setLoadingRole] = useState<UserRole | null>(null);

  const handleLogin = (role: UserRole) => {
    setLoadingRole(role);
    // Simulate API call
    setTimeout(() => {
      const success = login(role);
      if (success) {
        navigate('/dashboard');
      } else {
        alert(`No ${role} account found. Please register first.`);
      }
      setLoadingRole(null);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 glass-card">
        <div>
          <h1 className="text-center text-4xl font-bold text-brand-text">Lucidia</h1>
          <h2 className="mt-2 text-center text-xl font-bold text-brand-primary">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-brand-text-light">
            Please select your role
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <Button 
            onClick={() => handleLogin(UserRole.PATIENT)} 
            className="w-full justify-center py-3 text-base"
            loading={loadingRole === UserRole.PATIENT}
            disabled={!!loadingRole}
            size="lg"
          >
            Sign in as Patient
          </Button>
          <Button 
            onClick={() => handleLogin(UserRole.CARETAKER)} 
            variant="secondary" 
            className="w-full justify-center py-3 text-base"
            loading={loadingRole === UserRole.CARETAKER}
            disabled={!!loadingRole}
            size="lg"
          >
            Sign in as Caretaker
          </Button>
        </div>
        <div className="text-sm text-center">
          <p>
            <Link to="/register" className="font-medium text-brand-primary hover:text-indigo-700">
              Don't have an account? Register
            </Link>
          </p>
          <p className="mt-2">
            <Link to="/forgot-password" className="font-medium text-brand-primary hover:text-indigo-700">
              Forgot your password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;