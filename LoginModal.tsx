
import React, { useState, useEffect } from 'react';
import { X, Linkedin, Loader2, CheckCircle, Github } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup?: () => void;
  initialMode?: 'login' | 'signup';
}

type ModalMode = 'login' | 'signup';

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<ModalMode>(initialMode);
  const [formData, setFormData] = useState({ email: '', password: '', firstName: '', lastName: '', city: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
        setIsSubmitting(false);
        setIsSuccess(false);
        setError(null);
        setMode(initialMode);
        setFormData({ email: '', password: '', firstName: '', lastName: '', city: '' });
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (mode === 'login' && (!formData.email || !formData.password)) {
        setError("Please enter your credentials."); return;
    } else if (mode === 'signup' && (!formData.firstName || !formData.lastName || !formData.email || !formData.city)) {
        setError("Please fill in all fields."); return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        setTimeout(() => { onClose(); }, 1500);
    }, 1500);
  };

  const toggleMode = () => { setMode(prev => prev === 'login' ? 'signup' : 'login'); setError(null); setIsSuccess(false); };

  const socialButtonStyle = "flex items-center justify-center h-10 bg-white/5 hover:bg-white/10 border border-cyan-500/30 hover:border-cyan-400 rounded-lg transition-all shadow-sm";

  // Social Icons
  const GoogleIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-hidden">
      {/* THE CYBER BACKDROP: Deep Electric Purple Radial Gradient */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#3D00A5_0%,_#09090b_100%)] animate-fade-in" 
        onClick={onClose}
      >
        {/* ORGANIC FLOATING BLOBS (Neon Cyan & Magenta) */}
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-[#00FFFF] rounded-full filter blur-[120px] opacity-15 animate-pulse mix-blend-screen pointer-events-none" style={{ animationDuration: '15s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] bg-[#FF00FF] rounded-full filter blur-[140px] opacity-15 animate-pulse delay-700 mix-blend-screen pointer-events-none" style={{ animationDuration: '18s' }}></div>
      </div>

      {/* Main Modal Card - Reduced Width (max-w-xs) for Compact Feel */}
      <div 
        className="relative w-full max-w-xs rounded-[24px] animate-fade-in-up p-[1px] shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0))',
          boxShadow: '0 0 40px rgba(0, 255, 255, 0.2), 0 0 80px rgba(168, 85, 247, 0.15)'
        }}
      >
        <div 
          className="w-full rounded-[23px] overflow-hidden relative"
          style={{
            backdropFilter: 'blur(25px) saturate(200%)',
            WebkitBackdropFilter: 'blur(25px) saturate(200%)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors z-50 p-1.5 rounded-full hover:bg-white/10"
          >
            <X size={16} />
          </button>

          {/* Content Surface */}
          <div className="relative z-10 p-6 md:p-8">
            {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-4 animate-fade-in text-center">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-3 border border-green-500/30">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{mode === 'login' ? 'Access Granted' : 'Profile Created'}</h3>
                    <p className="text-white/60 text-xs">Redirecting...</p>
                </div>
            ) : (
                <div className="flex flex-col items-center text-center">
                    <h2 className="text-2xl font-bold text-white mb-0.5">{mode === 'login' ? 'Welcome Back' : 'Create Profile'}</h2>
                    <p className="text-white/50 text-[10px] mb-4 font-medium uppercase tracking-wider">
                      {mode === 'login' ? 'Log in to your engine' : 'Access the sales engine'}
                    </p>

                    <div className="grid grid-cols-5 gap-2 w-full mb-4">
                        <button className={socialButtonStyle}><GoogleIcon /></button>
                        <button className={socialButtonStyle}>
                            <svg viewBox="0 0 23 23" className="w-4 h-4"><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/></svg>
                        </button>
                        <button className={socialButtonStyle}><Linkedin className="w-4 h-4 text-white" fill="currentColor" strokeWidth={0} /></button>
                        <button className={socialButtonStyle}><Github className="w-4 h-4 text-white" /></button>
                        <button className={socialButtonStyle}>
                            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-.89 3.6-.84 1.54.12 2.7.75 3.37 1.83-3 1.54-2.52 5.76.51 6.89-.66 1.76-1.57 3.5-2.56 4.35zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                        </button>
                    </div>

                    <div className="relative flex items-center w-full mb-4">
                      <div className="flex-grow border-t border-white/10"></div>
                      <span className="flex-shrink mx-2 text-white/30 text-[8px] font-black uppercase tracking-widest">Or</span>
                      <div className="flex-grow border-t border-white/10"></div>
                    </div>

                    <form className="w-full space-y-2" onSubmit={handleSubmit}>
                        {mode === 'signup' && (
                            <div className="grid grid-cols-2 gap-2">
                                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First" className="w-full h-10 bg-white/5 border border-white/10 text-white placeholder-white/60 px-4 rounded-lg focus:outline-none focus:border-cyan-500/50 transition-all font-medium text-xs" required />
                                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last" className="w-full h-10 bg-white/5 border border-white/10 text-white placeholder-white/60 px-4 rounded-lg focus:outline-none focus:border-cyan-500/50 transition-all font-medium text-xs" required />
                            </div>
                        )}
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full h-10 bg-white/5 border border-white/10 text-white placeholder-white/60 px-4 rounded-lg focus:outline-none focus:border-cyan-500/50 transition-all font-medium text-xs" required />
                        {mode === 'login' ? (
                          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full h-10 bg-white/5 border border-white/10 text-white placeholder-white/60 px-4 rounded-lg focus:outline-none focus:border-cyan-500/50 transition-all font-medium text-xs" required />
                        ) : (
                          <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full h-10 bg-white/5 border border-white/10 text-white placeholder-white/60 px-4 rounded-lg focus:outline-none focus:border-cyan-500/50 transition-all font-medium text-xs" required />
                        )}

                        {error && <p className="text-red-400 text-[9px] font-bold">{error}</p>}

                        <button 
                          disabled={isSubmitting} 
                          className="w-full h-10 border border-cyan-500/60 bg-transparent hover:bg-cyan-500/10 text-white font-black rounded-lg transition-all shadow-[0_0_15px_rgba(0,255,255,0.2)] uppercase tracking-[0.2em] text-[9px] flex items-center justify-center gap-2 mt-2"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (mode === 'login' ? "Log In" : "Create Profile")}
                        </button>
                    </form>

                    <p className="text-[10px] text-white/50 font-medium mt-4">
                        {mode === 'login' ? "New around here?" : "Already have an account?"} <button onClick={toggleMode} className="text-white hover:underline font-bold ml-1">{mode === 'login' ? 'Create Profile' : 'Log in'}</button>
                    </p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
