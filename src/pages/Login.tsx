import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthLayout } from '../components/templates/AuthLayout';
import { Loader2, Fingerprint } from 'lucide-react';

export default function Login() {
  const { login, user } = useAppStore();
  const navigate = useNavigate();
  
  const [ssoSelected, setSsoSelected] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (role: "strategy" | "general") => {
    setIsAuthenticating(true);
    
    // Reduced loading simulation to 2.5 seconds
    setTimeout(async () => {
      await login(role);
      navigate('/');
    }, 2500);
  };

  if (isAuthenticating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa] fixed inset-0 z-50">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--text-primary)] mb-6" />
        <h2 className="text-xl font-semibold font-['Poppins'] text-[var(--text-primary)] mb-2">
          Setting up your workspace...
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Preparing the News & Trends Intelligence Agent environment.
        </p>
      </div>
    );
  }

  return (
    <AuthLayout>
      <h2 className="text-2xl font-semibold font-['Poppins'] text-[var(--text-primary)] mb-2">
        Welcome
      </h2>
      <p className="text-[var(--text-secondary)] text-sm mb-8 leading-relaxed max-w-sm mx-auto">
        Sign in with your organisational account
      </p>
      
      <div className="text-left mb-2">
        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Select your login method</span>
      </div>

      <button 
        type="button"
        onClick={() => setSsoSelected(true)}
        className={`w-full flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-4 text-left transition-all mb-8 ${
          ssoSelected 
            ? 'bg-[#36c0c9]/10 border-[#36c0c9]/20' 
            : 'hover:border-gray-300'
        }`}
      >
        <div className="mt-0.5">
           <Fingerprint className={`w-5 h-5 ${ssoSelected ? 'text-[#36c0c9]' : 'text-gray-500'}`} />
        </div>
        <div>
          <div className={`font-semibold text-sm ${ssoSelected ? 'text-[var(--text-primary)]' : 'text-gray-700'}`}>
            Single Sign-On
          </div>
          <div className="text-xs text-gray-500 mt-1">Authenticate via your enterprise network.</div>
        </div>
      </button>

      <button 
        onClick={() => handleLogin('strategy')}
        disabled={!ssoSelected}
        className="w-full flex items-center justify-center gap-3 bg-[#36c0c9] border border-transparent rounded-lg px-4 py-3.5 text-sm font-semibold text-white hover:bg-[#2ba3aa] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 21 21">
          <path fill="#f25022" d="M1 1h9v9H1z"/>
          <path fill="#7fba00" d="M11 1h9v9h-9z"/>
          <path fill="#00a4ef" d="M1 11h9v9H1z"/>
          <path fill="#ffb900" d="M11 11h9v9h-9z"/>
        </svg>
        Sign in with Microsoft SSO
      </button>

      <div className="mt-8 pt-6 border-t border-[var(--border-subtle)]">
        <p className="text-xs text-[var(--text-tertiary)]">
          Protected by your organization's Single Sign-On.<br/>
          Need help? <a href="#" className="font-semibold hover:underline text-[var(--text-primary)]">Contact your administrator.</a>
        </p>
      </div>
    </AuthLayout>
  );
}