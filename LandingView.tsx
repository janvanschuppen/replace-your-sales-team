
import React, { useState } from 'react';
import { ToneOfVoice } from '../types';
import { ArrowRight, Menu, X, ChevronDown, ChevronUp, Github } from 'lucide-react';

interface LandingViewProps {
  onStart: (url: string, tone: ToneOfVoice) => void;
  onOpenConcept: () => void;
  onOpenPackages: () => void;
  onOpenLogin: () => void;
  onOpenInvest: () => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onOpenInvite: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ 
  onStart, 
  onOpenConcept, 
  onOpenPackages,
  onOpenLogin,
  onOpenInvest,
  onOpenAbout,
  onOpenContact,
  onOpenInvite
}) => {
  const [url, setUrl] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) onStart(url, 'Consultative');
  };

  const handleMenuClick = (action: () => void) => {
    action();
    setIsMenuOpen(false);
    setIsMoreOpen(false); // Reset submenu
  };

  return (
    <div className="relative min-h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden selection:bg-zinc-800 selection:text-white font-sans">
        {/* Top Right Nav - Hamburger Menu */}
        <div className="absolute top-6 right-6 z-50 flex flex-col items-end">
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-zinc-500 hover:text-white transition-colors p-2"
            >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
                <div className="mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl py-3 flex flex-col animate-fade-in-up backdrop-blur-sm">
                    {/* 1. Concept */}
                    <button onClick={() => handleMenuClick(onOpenConcept)} className="text-left px-6 py-3 text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 uppercase tracking-widest transition-colors">
                        Concept
                    </button>
                    
                    {/* 2. Packages */}
                    <button onClick={() => handleMenuClick(onOpenPackages)} className="text-left px-6 py-3 text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 uppercase tracking-widest transition-colors">
                        Packages
                    </button>

                    {/* 3. More (Submenu) */}
                    <div>
                        <button 
                            onClick={() => setIsMoreOpen(!isMoreOpen)} 
                            className="w-full flex items-center justify-between text-left px-6 py-3 text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 uppercase tracking-widest transition-colors"
                        >
                            <span>More</span>
                            {isMoreOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        
                        {isMoreOpen && (
                            <div className="bg-black/20 border-t border-b border-white/5">
                                <button onClick={() => handleMenuClick(onOpenAbout)} className="w-full text-left pl-10 pr-6 py-3 text-[11px] font-bold text-zinc-500 hover:text-white hover:bg-white/5 uppercase tracking-widest transition-colors">
                                    Mission
                                </button>
                                <button onClick={() => handleMenuClick(onOpenInvite)} className="w-full text-left pl-10 pr-6 py-3 text-[11px] font-bold text-zinc-500 hover:text-white hover:bg-white/5 uppercase tracking-widest transition-colors">
                                    Invite
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 4. Login */}
                    <button onClick={() => handleMenuClick(onOpenLogin)} className="text-left px-6 py-3 text-xs font-bold text-white hover:bg-zinc-800 uppercase tracking-widest transition-colors">
                        Login
                    </button>

                    <div className="h-px bg-zinc-800 my-2 mx-4"></div>

                    {/* 5. Invest (Distinct) */}
                    <button onClick={() => handleMenuClick(onOpenInvest)} className="mx-4 my-1 text-center py-2.5 rounded-lg border border-purple-500/30 text-[10px] font-bold text-purple-400 hover:text-white hover:bg-purple-900/20 hover:border-purple-500 uppercase tracking-widest transition-all">
                        Invest
                    </button>
                </div>
            )}
        </div>

        {/* Main Content */}
        <div className="z-10 w-full max-w-5xl px-4 flex flex-col items-center text-center mt-[-40px]">
            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-12">
                <span className="block text-white">Replace your</span>
                <span className="block">
                    <span className="text-zinc-600">entire </span>
                    <span className="text-white">sales </span>
                    <span className="text-zinc-600">team.</span>
                </span>
            </h1>

            {/* Input Area */}
            <div className="w-full max-w-2xl mx-auto mb-20 relative">
                <form onSubmit={handleSubmit} className="relative group z-20">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-800 to-zinc-800 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                    <div className="relative flex items-center bg-[#09090b] border border-zinc-800 rounded-2xl p-3 transition-all focus-within:border-zinc-700 focus-within:ring-1 focus-within:ring-zinc-800/50 shadow-2xl shadow-black">
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="company.com"
                            className="w-full bg-transparent text-zinc-300 placeholder-zinc-500 px-6 py-4 outline-none text-xl font-medium tracking-tight"
                            required
                        />
                        <button 
                            type="submit"
                            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-8 py-4 rounded-xl text-sm font-bold tracking-[0.2em] uppercase transition-all flex items-center gap-3 whitespace-nowrap"
                        >
                            Find ICP <ArrowRight size={16} />
                        </button>
                    </div>
                </form>
                <p className="mt-8 text-zinc-500 text-sm font-medium tracking-wide">
                    Simply plug in your URL. We'll take it from there.
                </p>
            </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 w-full px-12 flex items-center justify-between">
             <p className="text-[10px] font-bold tracking-[0.3em] text-zinc-800 uppercase">
                Spades Engine v3.1
             </p>
             <div className="flex items-center gap-6">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-zinc-800 hover:text-white transition-colors">
                  <Github size={18} />
                </a>
             </div>
        </div>
    </div>
  );
};
