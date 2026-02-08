
import React, { useState, useMemo } from 'react';
import { X, Play, ArrowRight, Check, Mail, Share2, DollarSign, ChevronLeft, Phone, Loader2, CheckCircle, Linkedin, Facebook, Link, Github } from 'lucide-react';

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  maxWidth = "max-w-2xl"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-hidden">
      {/* THE CYBER BACKDROP: Deep Electric Purple Radial Gradient */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#3D00A5_0%,_#09090b_100%)] animate-fade-in" 
        onClick={onClose}
      >
        {/* ORGANIC FLOATING BLOBS (Neon Cyan & Magenta) - Slow Movement */}
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-[#00FFFF] rounded-full filter blur-[120px] opacity-20 animate-pulse mix-blend-screen pointer-events-none" style={{ animationDuration: '15s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] bg-[#FF00FF] rounded-full filter blur-[140px] opacity-20 animate-pulse delay-700 mix-blend-screen pointer-events-none" style={{ animationDuration: '18s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-[#3D00A5] rounded-full filter blur-[150px] opacity-30 pointer-events-none"></div>
      </div>
      
      {/* THE GLASS PANEL: Compacted height and tight padding */}
      <div 
        className={`relative w-full ${maxWidth} rounded-[32px] animate-fade-in-up p-[1px] shadow-2xl`}
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0))',
          boxShadow: '0 0 40px rgba(0, 255, 255, 0.2), 0 0 80px rgba(168, 85, 247, 0.15)'
        }}
      >
        <div 
          className="w-full rounded-[31px] overflow-hidden relative h-auto"
          style={{
            backdropFilter: 'blur(25px) saturate(200%)',
            WebkitBackdropFilter: 'blur(25px) saturate(200%)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Content Surface - Reduced Padding for shorter height */}
          <div className="relative z-10 p-8 md:p-10">
            <button 
              onClick={onClose} 
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors z-50 p-2 rounded-full hover:bg-white/10"
            >
              <X size={20} />
            </button>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ConceptModal: React.FC<{ isOpen: boolean; onClose: () => void; onOpenPackages: () => void }> = ({ isOpen, onClose, onOpenPackages }) => {
  const [showVideo, setShowVideo] = useState(false);

  const buttonStyle = "h-11 border border-cyan-500/40 bg-transparent hover:bg-cyan-500/10 text-white font-black rounded-lg transition-all uppercase tracking-[0.2em] text-[10px] flex items-center justify-center whitespace-nowrap shadow-[0_0_15px_rgba(0,255,255,0.2)] hover:shadow-[0_0_25px_rgba(0,255,255,0.4)]";

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} maxWidth={showVideo ? "max-w-4xl" : "max-w-2xl"}>
      {showVideo ? (
        <div className="flex flex-col items-start animate-fade-in">
          <button 
            onClick={() => setShowVideo(false)}
            className="flex items-center gap-2 text-white/50 hover:text-white mb-4 text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            <ChevronLeft size={14} /> Back to Overview
          </button>
          
          <div className="w-full aspect-video bg-black/40 rounded-xl border border-white/10 overflow-hidden relative flex items-center justify-center">
            <video 
              className="w-full h-full object-cover"
              poster="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop"
              controls
              autoPlay
            >
              <source src="/assets/engine-demo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-start text-left">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6 tracking-tight leading-tight">
            The End of the Sales Team.
          </h2>
          
          <div className="border-l-[3px] border-[#A855F7] pl-6 space-y-4 mb-8">
            <p className="text-white/80 text-base leading-relaxed font-normal">
              We've decided to open up our internal revenue engine.
            </p>
            <p className="text-white/80 text-base leading-relaxed font-normal">
              A system connecting premium sales tools and customized AI agents, supervised by human sales operators.
            </p>
            <p className="text-white/80 text-base leading-relaxed font-normal">
              Decide how involved or in control you want to be, <span className="text-white font-bold">but really: you don't.</span>
            </p>
            <p className="text-white/80 text-base leading-relaxed font-normal">
              Simply plug in your URL. We'll take it from there.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            <button 
              onClick={onClose}
              className={buttonStyle}
            >
              Get Started
            </button>
            <button 
              onClick={() => setShowVideo(true)}
              className={`${buttonStyle} gap-2`}
            >
              <Play size={12} fill="white" /> Watch Video
            </button>
            <button 
              onClick={onOpenPackages}
              className={`${buttonStyle} gap-2 group`}
            >
              Packages <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const PackagesModal: React.FC<{ isOpen: boolean; onClose: () => void; onOpenSignup: () => void; onOpenCallMe: () => void }> = ({ isOpen, onClose, onOpenSignup, onOpenCallMe }) => (
  <ModalWrapper isOpen={isOpen} onClose={onClose} maxWidth="max-w-5xl">
    <div className="flex flex-col items-center text-center">
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-10 tracking-tight leading-tight">Packages</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-10">
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col items-start text-left backdrop-blur-md">
          <h3 className="text-2xl font-black text-white mb-4">Free</h3>
          <div className="w-full h-px bg-white/10 mb-6"></div>
          <ul className="space-y-4 text-white/70 text-sm font-bold tracking-tight">
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-white/40 rounded-full"></span>ICP & Positioning</li>
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-white/40 rounded-full"></span>Market Snapshot</li>
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-white/40 rounded-full"></span>Buyer List Preview</li>
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-white/40 rounded-full"></span>Outreach Guidance</li>
          </ul>
        </div>

        <div className="bg-white/10 border border-cyan-500/50 p-8 rounded-2xl flex flex-col items-start text-left relative ring-1 ring-cyan-500/30 shadow-[0_0_30px_rgba(0,255,255,0.15)] backdrop-blur-xl">
          <div className="absolute -top-3 right-6 bg-cyan-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.1em] shadow-lg">POPULAR</div>
          <h3 className="text-2xl font-black text-white mb-4">Pro</h3>
          <div className="w-full h-px bg-white/20 mb-6"></div>
          <ul className="space-y-4 text-white text-sm font-bold tracking-tight">
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>Everything in Free</li>
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>Ongoing Outreach</li>
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>AI outbound calls</li>
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>Booked Demos</li>
          </ul>
        </div>

        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col items-start text-left backdrop-blur-md">
          <h3 className="text-2xl font-black text-white mb-4">Enterprise</h3>
          <div className="w-full h-px bg-white/10 mb-6"></div>
          <ul className="space-y-4 text-white/70 text-sm font-bold tracking-tight">
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-white/40 rounded-full"></span>Everything in Pro</li>
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-white/40 rounded-full"></span>Sales-ready Assets</li>
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-white/40 rounded-full"></span>AI Sales Demos</li>
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-white/40 rounded-full"></span>Closing Workflows</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        <button onClick={onClose} className="h-11 border border-cyan-500/60 bg-transparent hover:bg-cyan-500/10 text-white font-black rounded-lg transition-all uppercase tracking-[0.2em] text-[10px] flex items-center justify-center whitespace-nowrap">GET STARTED</button>
        <button onClick={onOpenSignup} className="h-11 border border-cyan-500/60 bg-transparent hover:bg-cyan-500/10 text-white font-black rounded-lg transition-all uppercase tracking-[0.2em] text-[10px] flex items-center justify-center whitespace-nowrap shadow-[0_0_15px_rgba(0,255,255,0.2)] hover:shadow-[0_0_25px_rgba(0,255,255,0.4)]">CREATE PROFILE</button>
        <button onClick={onOpenCallMe} className="h-11 border border-cyan-500/60 bg-transparent hover:bg-cyan-500/10 text-white font-black rounded-lg transition-all uppercase tracking-[0.2em] text-[10px] flex items-center justify-center whitespace-nowrap">CALL ME</button>
      </div>
    </div>
  </ModalWrapper>
);

const FULL_COUNTRY_LIST = [
  { flag: '🇺🇸', iso: 'US', dial: '+1' },
  { flag: '🇬🇧', iso: 'GB', dial: '+44' },
  { flag: '🇳🇱', iso: 'NL', dial: '+31' },
  { flag: '🇦🇫', iso: 'AF', dial: '+93' },
  { flag: '🇦🇱', iso: 'AL', dial: '+355' },
  { flag: '🇩🇿', iso: 'DZ', dial: '+213' },
  { flag: '🇦🇩', iso: 'AD', dial: '+376' },
  { flag: '🇦🇴', iso: 'AO', dial: '+244' },
  { flag: '🇦🇷', iso: 'AR', dial: '+54' },
  { flag: '🇦🇲', iso: 'AM', dial: '+374' },
  { flag: '🇦🇺', iso: 'AU', dial: '+61' },
  { flag: '🇦🇹', iso: 'AT', dial: '+43' },
  { flag: '🇦🇿', iso: 'AZ', dial: '+994' },
  { flag: '🇧🇭', iso: 'BH', dial: '+973' },
  { flag: '🇧🇩', iso: 'BD', dial: '+880' },
  { flag: '🇧🇪', iso: 'BE', dial: '+32' },
  { flag: '🇧🇿', iso: 'BZ', dial: '+501' },
  { flag: '🇧🇯', iso: 'BJ', dial: '+229' },
  { flag: '🇧🇹', iso: 'BT', dial: '+975' },
  { flag: '🇧🇴', iso: 'BO', dial: '+591' },
  { flag: '🇧🇦', iso: 'BA', dial: '+387' },
  { flag: '🇧🇼', iso: 'BW', dial: '+267' },
  { flag: '🇧🇷', iso: 'BR', dial: '+55' },
  { flag: '🇧🇳', iso: 'BN', dial: '+673' },
  { flag: '🇧🇬', iso: 'BG', dial: '+359' },
  { flag: '🇰ھ', iso: 'KH', dial: '+855' },
  { flag: '🇨🇲', iso: 'CM', dial: '+237' },
  { flag: '🇨🇦', iso: 'CA', dial: '+1' },
  { flag: '🇨🇱', iso: 'CL', dial: '+56' },
  { flag: '🇨🇳', iso: 'CN', dial: '+86' },
  { flag: '🇨🇴', iso: 'CO', dial: '+57' },
  { flag: '🇨🇷', iso: 'CR', dial: '+506' },
  { flag: '🇭🇷', iso: 'HR', dial: '+385' },
  { flag: '🇨🇺', iso: 'CU', dial: '+53' },
  { flag: '🇨🇾', iso: 'CY', dial: '+357' },
  { flag: '🇨🇿', iso: 'CZ', dial: '+420' },
  { flag: '🇩🇰', iso: 'DK', dial: '+45' },
  { flag: '🇩🇯', iso: 'DJ', dial: '+253' },
  { flag: '🇩🇴', iso: 'DO', dial: '+1-809' },
  { flag: '🇪🇨', iso: 'EC', dial: '+593' },
  { flag: '🇪🇬', iso: 'EG', dial: '+20' },
  { flag: '🇸🇻', iso: 'SV', dial: '+503' },
  { flag: '🇪🇪', iso: 'EE', dial: '+372' },
  { flag: '🇪🇹', iso: 'ET', dial: '+251' },
  { flag: '🇫🇯', iso: 'FJ', dial: '+679' },
  { flag: '🇫🇮', iso: 'FI', dial: '+358' },
  { flag: '🇫🇷', iso: 'FR', dial: '+33' },
  { flag: '🇬🇦', iso: 'GA', dial: '+241' },
  { flag: '🇬🇪', iso: 'GE', dial: '+995' },
  { flag: '🇩🇪', iso: 'DE', dial: '+49' },
  { flag: '🇬🇭', iso: 'GH', dial: '+233' },
  { flag: '🇬🇷', iso: 'GR', dial: '+30' },
  { flag: '🇬🇹', iso: 'GT', dial: '+502' },
  { flag: '🇭🇳', iso: 'HN', dial: '+504' },
  { flag: '🇭🇺', iso: 'HU', dial: '+36' },
  { flag: '🇮🇸', iso: 'IS', dial: '+354' },
  { flag: '🇮🇳', iso: 'IN', dial: '+91' },
  { flag: '🇮🇩', iso: 'ID', dial: '+62' },
  { flag: '🇮🇷', iso: 'IR', dial: '+98' },
  { flag: '🇮🇶', iso: 'IQ', dial: '+964' },
  { flag: '🇮🇪', iso: 'IE', dial: '+353' },
  { flag: '🇮🇱', iso: 'IL', dial: '+972' },
  { flag: '🇮🇹', iso: 'IT', dial: '+39' },
  { flag: '🇯🇲', iso: 'JM', dial: '+1-876' },
  { flag: '🇯🇵', iso: 'JP', dial: '+81' },
  { flag: '🇯🇴', iso: 'JO', dial: '+962' },
  { flag: '🇰🇿', iso: 'KZ', dial: '+7' },
  { flag: '🇰🇪', iso: 'KE', dial: '+254' },
  { flag: '🇰🇷', iso: 'KR', dial: '+82' },
  { flag: '🇰🇼', iso: 'KW', dial: '+965' },
  { flag: '🇱🇧', iso: 'LB', dial: '+961' },
  { flag: '🇱🇺', iso: 'LU', dial: '+352' },
  { flag: '🇲🇾', iso: 'MY', dial: '+60' },
  { flag: '🇲🇽', iso: 'MX', dial: '+52' },
  { flag: '🇲🇨', iso: 'MC', dial: '+377' },
  { flag: '🇲🇦', iso: 'MA', dial: '+212' },
  { flag: '🇳🇵', iso: 'NP', dial: '+977' },
  { flag: '🇳🇿', iso: 'NZ', dial: '+64' },
  { flag: '🇳🇬', iso: 'NG', dial: '+234' },
  { flag: '🇳🇴', iso: 'NO', dial: '+47' },
  { flag: '🇵🇰', iso: 'PK', dial: '+92' },
  { flag: '🇵🇦', iso: 'PA', dial: '+507' },
  { flag: '🇵🇪', iso: 'PE', dial: '+51' },
  { flag: '🇵🇭', iso: 'PH', dial: '+63' },
  { flag: '🇵🇱', iso: 'PL', dial: '+48' },
  { flag: '🇵🇹', iso: 'PT', dial: '+351' },
  { flag: '🇶🇦', iso: 'QA', dial: '+974' },
  { flag: '🇷🇴', iso: 'RO', dial: '+40' },
  { flag: '🇷🇺', iso: 'RU', dial: '+7' },
  { flag: '🇸🇦', iso: 'SA', dial: '+966' },
  { flag: '🇸🇬', iso: 'SG', dial: '+65' },
  { flag: '🇿🇦', iso: 'ZA', dial: '+27' },
  { flag: '🇪🇸', iso: 'ES', dial: '+34' },
  { flag: '🇸🇪', iso: 'SE', dial: '+46' },
  { flag: '🇨🇭', iso: 'CH', dial: '+41' },
  { flag: '🇹🇭', iso: 'TH', dial: '+66' },
  { flag: '🇹🇷', iso: 'TR', dial: '+90' },
  { flag: '🇺🇦', iso: 'UA', dial: '+380' },
  { flag: '🇦🇪', iso: 'AE', dial: '+971' },
  { flag: '🇺🇾', iso: 'UY', dial: '+598' },
  { flag: '🇻🇳', iso: 'VN', dial: '+84' },
];

const SORTED_COUNTRY_LIST = [...FULL_COUNTRY_LIST].sort((a, b) => a.iso.localeCompare(b.iso));
const SHORTCUTS = ['US', 'GB', 'NL'];

export const InvestModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  onOpenCallMe: () => void;
  onSuccess: (isUS: boolean) => void;
}> = ({ isOpen, onClose, onOpenCallMe, onSuccess }) => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', countryCode: '+1', type: 'Fund', amount: '25K' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputStyle = "w-full h-11 bg-white/5 border border-white/10 text-white placeholder-white/60 px-4 rounded-lg focus:outline-none focus:border-cyan-500/50 transition-all font-medium text-sm";
  const buttonStyle = "h-11 border border-cyan-500/40 bg-transparent hover:bg-cyan-500/10 text-white font-black rounded-lg transition-all uppercase tracking-[0.2em] text-[10px] flex items-center justify-center whitespace-nowrap shadow-[0_0_15px_rgba(0,255,255,0.2)] hover:shadow-[0_0_25px_rgba(0,255,255,0.4)]";

  const isFullyFilled = useMemo(() => {
    return (
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phone.trim() !== ''
    );
  }, [formData]);

  const handleCallMe = () => {
    if (!isFullyFilled) {
      onOpenCallMe();
    } else {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess(formData.countryCode === '+1');
      }, 1000);
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl">
      <div className="flex flex-col items-start text-left">
        <h2 className="text-4xl font-serif font-bold text-white mb-6 tracking-tight leading-none">Invest</h2>
        
        <form className="w-full space-y-4 mb-8">
          {/* Row 1: Names - 1:2 ratio grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5 col-span-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">First Name</label>
              <input type="text" placeholder="First" className={inputStyle} value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
            </div>
            <div className="space-y-1.5 col-span-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Last Name</label>
              <input type="text" placeholder="Last Name" className={inputStyle} value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
            </div>
          </div>
          
          {/* Row 2: Email & Phone - 1:2 ratio grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5 col-span-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Company Email</label>
              <input type="email" placeholder="Email" className={inputStyle} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="space-y-1.5 col-span-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Telephone</label>
              <div className="flex gap-2">
                <div className="relative w-24 flex-shrink-0">
                  <select 
                    className={`${inputStyle} appearance-none pr-8 truncate !px-2`}
                    value={formData.countryCode}
                    onChange={(e) => setFormData({...formData, countryCode: e.target.value})}
                  >
                    <optgroup label="Shortcuts">
                      {SHORTCUTS.map(iso => {
                        const c = FULL_COUNTRY_LIST.find(x => x.iso === iso);
                        return c ? <option key={`short-${c.iso}`} value={c.dial} className="bg-zinc-900">{c.flag} {c.iso}</option> : null;
                      })}
                    </optgroup>
                    <option disabled className="bg-zinc-800 text-white/20">────────────────────</option>
                    <optgroup label="All Countries">
                      {SORTED_COUNTRY_LIST.map(c => (
                        <option key={`full-${c.iso}`} value={c.dial} className="bg-zinc-900">
                          {c.flag} {c.iso}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <ChevronLeft size={10} className="absolute right-2 top-1/2 -translate-y-1/2 -rotate-90 text-white/40 pointer-events-none" />
                </div>
                <input type="tel" placeholder="Phone" className={inputStyle} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Row 3: Type & Target - 1:1 ratio grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Entity Type</label>
              <div className="flex bg-white/5 border border-white/10 rounded-lg p-1 h-11">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: 'Fund'})}
                  className={`flex-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${formData.type === 'Fund' ? 'bg-cyan-500/20 text-white border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'text-white/40 hover:text-white/60'}`}
                >
                  Fund
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: 'Private'})}
                  className={`flex-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${formData.type === 'Private' ? 'bg-cyan-500/20 text-white border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'text-white/40 hover:text-white/60'}`}
                >
                  Private
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Target Investment</label>
              <div className="relative">
                <select 
                  className={`${inputStyle} appearance-none pr-10`}
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                >
                  <option value="25K" className="bg-zinc-900">25K</option>
                  <option value="50K" className="bg-zinc-900">50K</option>
                  <option value="100K" className="bg-zinc-900">100K</option>
                  <option value="100K+" className="bg-zinc-900">100K+</option>
                </select>
                <ChevronLeft size={12} className="absolute right-3 top-1/2 -translate-y-1/2 -rotate-90 text-white/40 pointer-events-none" />
              </div>
            </div>
          </div>
        </form>

        <div className="space-y-6 mb-8 text-white/90 leading-relaxed w-full">
          <p className="border-l-[3px] border-purple-500 pl-6 italic font-medium text-sm text-white/90">
            "We currently operate with deliberate human-in-the-loop validation. This allows us to prove revenue workflows and codify repeatable patterns before fully autonomous execution."
          </p>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-3">
            <p className="font-bold text-white text-xl">Our pre-seed round is now open.</p>
            <p className="text-white/90 text-sm">We’re raising for the next 12 months: MVP to GTM.</p>
            <p className="text-sm text-white/90 leading-relaxed font-medium">Your capital goes to automation, stability, and delivery. We welcome family offices, angels, and early-stage VCs.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 w-full">
          <button type="button" className={buttonStyle}>More Info</button>
          <button 
            type="button" 
            className={buttonStyle} 
            onClick={handleCallMe}
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : "Call Me"}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export const AboutModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void;
  onOpenInvite: () => void;
  onOpenInvest: () => void;
}> = ({ isOpen, onClose, onOpenInvite, onOpenInvest }) => {
  const buttonStyle = "h-11 border border-cyan-500/40 bg-transparent hover:bg-cyan-500/10 text-white font-black rounded-lg transition-all uppercase tracking-[0.2em] text-[10px] flex items-center justify-center whitespace-nowrap shadow-[0_0_15px_rgba(0,255,255,0.2)] hover:shadow-[0_0_25px_rgba(0,255,255,0.4)]";

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-start text-left">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6 tracking-tight leading-tight">
          Our Mission.
        </h2>
        
        <div className="border-l-[3px] border-[#A855F7] pl-6 space-y-4 mb-10">
          <p className="text-white text-lg leading-relaxed font-bold">
            We're on a path to free you and 100 other organizations from sales and sales technology by the end of 2027.
          </p>
          <p className="text-white/80 text-base leading-relaxed font-normal">
            The engine finds verified buyers, creates effective outreach, books meetings, and closes outcomes, all from a single company URL input.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          <button 
            onClick={onClose}
            className={buttonStyle}
          >
            Start
          </button>
          <button 
            onClick={onOpenInvite}
            className={buttonStyle}
          >
            Invite
          </button>
          <button 
            onClick={onOpenInvest}
            className={buttonStyle}
          >
            Invest
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export const ContactModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => (
  <ModalWrapper isOpen={isOpen} onClose={onClose}>
    <div className="flex flex-col items-start text-left">
      <h2 className="text-3xl font-serif font-bold text-white mb-6 tracking-tight">Contact Sales</h2>
      <div className="w-full space-y-4">
        <a href="mailto:sales@spades.ai" className="flex items-center justify-between p-6 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-500/40 hover:bg-white/10 transition-all group backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Mail size={24} className="text-white/40 group-hover:text-cyan-400 transition-colors" />
            <div>
              <div className="text-base font-bold text-white">Email Us</div>
              <div className="text-[10px] text-white/40 font-mono tracking-tight mt-0.5">sales@spades.ai</div>
            </div>
          </div>
          <ArrowRight size={20} className="text-white/20 group-hover:text-white transition-all" />
        </a>
      </div>
    </div>
  </ModalWrapper>
);

export const InviteModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareText = `I just tested a system that turns your company URL into ICPs, buyer lists, and booked meetings without sales tools or setup.\n\nTry it here: ${window.location.origin}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socialIconStyle = "w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition-all text-white/40 hover:text-cyan-400 shadow-sm";

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} maxWidth="max-w-sm">
      <div className="flex flex-col items-start text-left">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3 tracking-tight leading-tight">Invite</h2>
        
        <div className="w-full space-y-4 mb-8 mt-4">
          <div className="space-y-1.5">
            <input 
              type="email" 
              placeholder="Email to (optional)" 
              className="w-full h-11 bg-white/5 border border-white/10 text-white placeholder-white/40 px-4 rounded-lg focus:outline-none focus:border-cyan-500/50 transition-all font-medium text-xs" 
            />
          </div>
          
          <div className="flex justify-between items-center w-full px-1">
            <button className={socialIconStyle}><Linkedin size={18} /></button>
            <button className={socialIconStyle}>
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.497h2.039L6.482 2.395H4.295l13.312 18.255z"/>
              </svg>
            </button>
            <button className={socialIconStyle}><Facebook size={18} /></button>
            <button className={socialIconStyle}><Github size={18} /></button>
            <button className={socialIconStyle}><Link size={18} /></button>
          </div>
        </div>

        <p className="text-white/70 mb-2.5 text-sm font-medium">Copy the message and share it anywhere.</p>
        <button 
          onClick={handleCopy}
          className="w-full h-12 border border-cyan-500/40 bg-transparent hover:bg-cyan-500/10 text-white font-black rounded-lg transition-all uppercase tracking-[0.2em] text-[10px] flex items-center justify-center whitespace-nowrap shadow-[0_0_15px_rgba(0,255,255,0.2)] hover:shadow-[0_0_25px_rgba(0,255,255,0.4)]"
        >
          <span className="flex items-center gap-2">
            {copied ? <><Check size={14} className="text-cyan-400" /> Copied</> : "Copy Share Text"}
          </span>
        </button>
      </div>
    </ModalWrapper>
  );
};

export const CallMeModal: React.FC<{ isOpen: boolean; onClose: () => void; onSuccess: (isUS: boolean) => void }> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', countryCode: '+1', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = useMemo(() => {
    return (
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.email.includes('@') &&
      formData.phone.trim().length > 5
    );
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess(formData.countryCode === '+1');
    }, 1000);
  };

  const inputStyle = "w-full h-10 bg-white/5 border border-white/10 text-white placeholder-white/60 px-4 rounded-lg focus:outline-none focus:border-cyan-500/50 transition-all font-medium text-xs";
  const buttonStyle = "w-full h-11 border border-cyan-500/60 bg-transparent hover:bg-cyan-500/10 text-white font-black rounded-lg transition-all shadow-[0_0_15px_rgba(0,255,255,0.2)] uppercase tracking-[0.2em] text-[10px] flex items-center justify-center whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} maxWidth="max-w-sm">
      <div className="flex flex-col items-start text-left">
        <h2 className="text-3xl font-serif font-bold text-white mb-6 tracking-tight">Call me</h2>
        <form onSubmit={handleSubmit} className="w-full space-y-3">
          <input 
            type="text" 
            placeholder="First name" 
            className={inputStyle} 
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            required
          />
          <input 
            type="text" 
            placeholder="Last name" 
            className={inputStyle} 
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            required
          />
          <input 
            type="email" 
            placeholder="Company Email" 
            className={inputStyle} 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          
          <div className="flex gap-2">
            <div className="relative w-28">
              <select 
                className={`${inputStyle} appearance-none pr-8 truncate`}
                value={formData.countryCode}
                onChange={(e) => setFormData({...formData, countryCode: e.target.value})}
              >
                <optgroup label="Shortcuts">
                  {SHORTCUTS.map(iso => {
                    const c = FULL_COUNTRY_LIST.find(x => x.iso === iso);
                    return c ? <option key={`short-call-${c.iso}`} value={c.dial} className="bg-zinc-900">{c.flag} {c.iso}</option> : null;
                  })}
                </optgroup>
                <option disabled className="bg-zinc-800 text-white/20">────────────────────</option>
                <optgroup label="All Countries">
                  {SORTED_COUNTRY_LIST.map(c => (
                    <option key={`full-call-${c.iso}`} value={c.dial} className="bg-zinc-900">
                      {c.flag} {c.iso} {c.dial}
                    </option>
                  ))}
                </optgroup>
              </select>
              <ChevronLeft size={12} className="absolute right-3 top-1/2 -translate-y-1/2 -rotate-90 text-white/40 pointer-events-none" />
            </div>
            <input 
              type="tel" 
              placeholder="Phone number" 
              className={inputStyle} 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={!isValid || isSubmitting}
            className={buttonStyle}
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : "Call me"}
          </button>
        </form>
      </div>
    </ModalWrapper>
  );
};

export const CallMeConfirmationModal: React.FC<{ isOpen: boolean; onClose: () => void; isUS: boolean }> = ({ isOpen, onClose, isUS }) => (
  <ModalWrapper isOpen={isOpen} onClose={onClose} maxWidth="max-w-sm">
    <div className="flex flex-col items-center text-center py-4">
      <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mb-6 border border-cyan-500/30">
        <CheckCircle className="text-cyan-400" size={32} />
      </div>
      <p className="text-white text-base leading-relaxed font-bold px-4">
        {isUS 
          ? "Thank you for your interest. Make sure your phone isn't on standby and await our call. It should be just a minute."
          : "Thank you for your interest. Unfortunately, our live phone call service is not yet activated in your country. We will call you as soon as possible, or send you an invite via email."
        }
      </p>
      <button 
        onClick={onClose}
        className="mt-8 h-10 px-8 border border-white/20 hover:bg-white/5 text-white/60 hover:text-white rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all"
      >
        Close
      </button>
    </div>
  </ModalWrapper>
);
