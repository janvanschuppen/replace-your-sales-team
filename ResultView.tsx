
import React, { useState, useEffect, useMemo } from 'react';
import { AnalysisResult } from '../types';
import { Github, Loader2, Check } from 'lucide-react';

interface ResultViewProps {
  data: AnalysisResult;
  onConvert: () => void;
  onReset: () => void;
  onHardReset: () => void;
}

// --- AVATAR UTILS ---

const stripProtocol = (url: string) => url.replace(/(^\w+:|^)\/\//, '');

const toDirectGoogleDriveUrl = (url: string): string => {
  const driveIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]{25,})/) || url.match(/[?&]id=([a-zA-Z0-9_-]{25,})/);
  if (driveIdMatch && driveIdMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${driveIdMatch[1]}`;
  }
  return url;
};

const getGoogleDriveId = (url: string): string | null => {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]{25,})/) || url.match(/[?&]id=([a-zA-Z0-9_-]{25,})/);
  return match ? match[1] : null;
};

const buildAvatarCandidates = (rawUrl: string, cacheBust: string | number): string[] => {
  if (!rawUrl) return [];
  
  const cleanUrl = rawUrl.trim().replace(/^["']|["']$/g, "");
  const driveDirect = toDirectGoogleDriveUrl(cleanUrl);
  const driveId = getGoogleDriveId(cleanUrl);
  
  const candidates: string[] = [];
  
  // 1. Direct raw URL
  candidates.push(cleanUrl);
  
  // 2. Drive Direct (if different)
  if (driveDirect !== cleanUrl) {
    candidates.push(driveDirect);
  }
  
  // 3. Google User Content Hint (if ID found)
  if (driveId) {
    candidates.push(`https://lh3.googleusercontent.com/d/${driveId}=w512`);
  }
  
  // 4. Weserv Proxy of Drive Direct
  candidates.push(`https://images.weserv.nl/?url=${encodeURIComponent(stripProtocol(driveDirect))}&w=512`);
  
  // 5. Weserv Proxy of Raw
  if (cleanUrl !== driveDirect) {
    candidates.push(`https://images.weserv.nl/?url=${encodeURIComponent(stripProtocol(cleanUrl))}&w=512`);
  }

  // Apply cache bust if needed
  return Array.from(new Set(candidates)).map(url => {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${cacheBust}`;
  });
};

const NeutralPlaceholder: React.FC<{ name: string }> = ({ name }) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="w-full h-[400px] flex items-center justify-center bg-zinc-100 rounded-[20px] shadow-[0_15px_30px_rgba(0,0,0,0.15)] border-2 border-zinc-200">
      <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-3xl tracking-tighter">
        {initials || "DM"}
      </div>
    </div>
  );
};

export const ResultView: React.FC<ResultViewProps> = ({ data, onConvert, onReset }) => {
  const [isPushing, setIsPushing] = useState(false);
  const [pushSuccess, setPushSuccess] = useState(false);

  if (!data) return null;

  const domain = data.company_profile.domain;
  const logoUrl = data.company_profile.generated_logo || `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;

  // --- PERSONA AVATAR STATE MACHINE ---
  const rawImg = String(data.icp_persona.avatar_id || "").trim();
  const imageBustToken = data.is_hard_reset ? Date.now() : domain.length;
  
  const candidates = useMemo(() => buildAvatarCandidates(rawImg, imageBustToken), [rawImg, data.icp_persona.name, imageBustToken]);
  
  const [avatarAttempt, setAvatarAttempt] = useState(0);
  const [avatarFailed, setAvatarFailed] = useState(false);

  // Reset attempt if the persona identity changes
  useEffect(() => {
    setAvatarAttempt(0);
    setAvatarFailed(false);
    if (rawImg) {
      console.log(`[AVATAR] selected_id=${data.icp_persona.avatar_id} name=${data.icp_persona.name} rawImg=${rawImg} candidates=${candidates.length}`);
    }
  }, [rawImg, data.icp_persona.name, candidates]);

  const handleAvatarError = () => {
    const nextAttempt = avatarAttempt + 1;
    console.warn(`[AVATAR-ERROR] selected_id=${data.icp_persona.avatar_id} try=${avatarAttempt} url=${candidates[avatarAttempt]}`);
    
    if (nextAttempt < candidates.length) {
      setAvatarAttempt(nextAttempt);
    } else {
      setAvatarFailed(true);
    }
  };

  const handlePushToGithub = () => {
    setIsPushing(true);
    // Simulate push delay
    setTimeout(() => {
      setIsPushing(false);
      setPushSuccess(true);
      setTimeout(() => setPushSuccess(false), 3000);
    }, 2500);
  };

  // --- STYLES ---
  const glassBaseStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.40)',
    backdropFilter: 'blur(40px) saturate(160%)',
    WebkitBackdropFilter: 'blur(40px) saturate(160%)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    borderRadius: '24px',
  };

  const glassPillStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    borderRadius: '100px',
    padding: '8px 16px',
    fontWeight: 700,
    fontSize: '13px',
    color: '#333',
  };

  const heroUrl = data.company_profile.hero_image;

  const heroBannerStyle: React.CSSProperties = {
    height: '220px', 
    width: '100%',
    background: `url('${heroUrl}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '24px 24px 0 0',
    position: 'relative',
    overflow: 'visible',
    zIndex: 10,
  };

  const taglineBoxStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    textAlign: 'right',
    maxWidth: '480px',
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(12px)',
    padding: '20px 30px',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.9)',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
  };

  const overlapLogoStyle: React.CSSProperties = {
    width: '120px',
    height: '120px',
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '30px',
    position: 'absolute',
    bottom: '-40px', 
    left: '50px',
    boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50, 
    backdropFilter: 'blur(10px)',
    overflow: 'hidden'
  };

  const identityBarStyle: React.CSSProperties = {
    ...glassBaseStyle,
    borderRadius: '0 0 24px 24px',
    borderTop: 'none',
    padding: '24px 40px 30px 190px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const globeFallback = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNjQ3NDhiIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIvPjxwYXRoIGQ9Ik0xMiAyYTE1LjMgMTUuMyAwIDAgMSA0IDEwIDE1LjMgMTUuMyAwIDAgMS00IDEwIDE1LjMgMTUuMyAwIDAgMS00LTEwIDE1LjMgMTUuMyAwIDAgMSA0LTEweiIvPjxwYXRoIGQ9Ik0yIDEyaDIwIi8+PC9zdmc+`;

  const effectiveAvatarSrc = candidates[avatarAttempt] || "";

  return (
    <div className="min-h-screen font-sans pb-32 animate-fade-in text-zinc-900">
      <div className="max-w-[960px] mx-auto px-5 py-10 relative z-10">
        
        {/* RESET & GITHUB BUTTONS */}
        <div className="fixed top-6 right-6 z-50 flex gap-2">
            <button 
                disabled={isPushing}
                onClick={handlePushToGithub}
                className={`text-[10px] font-bold uppercase tracking-wider glass-inner px-4 py-2 rounded-full transition-all flex items-center gap-2 shadow-sm ${pushSuccess ? 'bg-green-100 text-green-700' : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/60'}`}
            >
                {isPushing ? <Loader2 size={12} className="animate-spin" /> : pushSuccess ? <Check size={12} /> : <Github size={12} />}
                {isPushing ? "Pushing Live..." : pushSuccess ? "Pushed to GitHub" : "Push Live to GitHub"}
            </button>
            <button 
                onClick={onReset} 
                className="text-[10px] font-bold text-zinc-600 hover:text-zinc-900 uppercase tracking-wider glass-inner px-4 py-2 rounded-full transition-colors hover:bg-white/60 shadow-sm"
            >
                Start Over
            </button>
        </div>

        {/* --- 1. HERO & IDENTITY HEADER --- */}
        <div className="mb-10">
            {/* HERO BANNER */}
            <div style={heroBannerStyle}>
                <div style={taglineBoxStyle}>
                     <span className="bg-black/5 text-[#555] px-3 py-1.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider inline-block">
                        Positioning
                     </span>
                     <h2 className="text-[21px] font-bold text-[#111] m-0 mt-2 leading-[1.3]">
                        {data.company_profile.tagline}
                     </h2>
                </div>

                <div style={overlapLogoStyle}>
                    <img 
                      src={logoUrl} 
                      alt="Logo"
                      className="w-full h-full object-contain p-2"
                      onError={(e) => { e.currentTarget.src = globeFallback }}
                    />
                </div>
            </div>

            {/* IDENTITY BAR */}
            <div style={identityBarStyle}>
                <div>
                    <h1 className="m-0 text-[42px] font-black text-[#111] uppercase tracking-wide leading-none">
                        {data.company_profile.name}
                    </h1>
                    <div className="text-[14px] font-bold text-[#555] uppercase mt-1.5 tracking-[1px]">
                        {data.company_profile.domain}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-[#16a34a] text-white px-[18px] py-[8px] rounded-full font-extrabold text-[14px] inline-block shadow-[0_5px_15px_rgba(22,163,74,0.3)]">
                        96% MATCH
                    </div>
                    <button 
                        onClick={onConvert}
                        className="px-4 py-2 bg-transparent border border-white/60 hover:border-white text-zinc-700 hover:text-black rounded-lg text-xs font-bold uppercase tracking-wide transition-colors"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>

        {/* --- 2. STRATEGIC CONTEXT --- */}
        <div className="mb-10">
            <div className="text-[11px] font-extrabold uppercase tracking-[2px] text-[#666] mb-3 pl-3">Strategic Context</div>
            <div style={glassBaseStyle} className="py-[30px] px-[40px] border-l-[6px] border-[#7c3aed]">
                <p className="text-[18px] leading-[1.6] font-medium m-0 text-[#222]">
                    "{data.company_profile.summary}"
                </p>
            </div>
        </div>

        {/* --- BUTTON 2: Middle Bridge --- */}
        <div className="w-full flex justify-center mb-10">
            <button 
                onClick={onConvert}
                className="w-full py-4 border border-[#7c3aed] text-[#7c3aed] hover:bg-[#7c3aed]/5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all"
            >
                Continue -&gt;
            </button>
        </div>

        {/* --- 3. TARGET DECISION MAKER (PASSPORT) --- */}
        <div style={glassBaseStyle} className="!p-0 !overflow-hidden flex flex-col">
            
            <div className="px-[40px] py-[24px] bg-white/20 border-b border-white/30">
                <h2 className="text-[16px] font-black uppercase tracking-[2px] text-[#222] m-0">
                    IDEAL CUSTOMER PERSONA
                </h2>
            </div>
            
            <div className="flex gap-[40px] p-[40px] items-start flex-wrap">
                
                {/* LEFT COLUMN: Avatar & Name */}
                <div className="flex-none w-full md:w-[320px]">
                   {(!rawImg || avatarFailed) ? (
                     <NeutralPlaceholder name={data.icp_persona.name} />
                   ) : (
                     <img 
                        src={effectiveAvatarSrc} 
                        alt={data.icp_persona.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-[400px] object-cover rounded-[20px] shadow-[0_15px_30px_rgba(0,0,0,0.15)] bg-zinc-100 transition-opacity duration-300"
                        onError={handleAvatarError}
                     />
                   )}
                   <div className="text-center mt-6">
                      <h2 className="text-[34px] font-extrabold m-0 text-[#111]">{data.icp_persona.name}</h2>
                      <p className="text-[12px] font-extrabold uppercase tracking-[2px] text-[#7c3aed] mt-2">Decision Maker</p>
                   </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="flex-1 min-w-[300px] flex flex-col gap-6">
                   <div className="flex flex-wrap gap-[10px]">
                       <span style={glassPillStyle}>{data.icp_persona.role}</span>
                       {data.icp_persona.location && <span style={glassPillStyle}>{data.icp_persona.location}</span>}
                       <span style={glassPillStyle}>{data.icp_persona.company_size} Employees</span>
                   </div>

                   <div className="font-serif italic text-[24px] leading-[1.4] text-[#111] pl-5 border-l-[4px] border-[#db2777]">
                      "{data.icp_persona.bio_snack}"
                   </div>

                   <div className="grid grid-cols-1 gap-4">
                      <div className="bg-white/40 rounded-[16px] p-5">
                         <h4 className="m-0 mb-[10px] text-[11px] font-extrabold uppercase text-[#666] tracking-[1px]">Challenges</h4>
                         <ul className="m-0 pl-5 text-[15px] font-semibold text-[#222]">
                            {data.icp_persona.pain_points.map((c, i) => <li key={i} className="mb-1">{c}</li>)}
                         </ul>
                      </div>
                      <div className="bg-white/40 rounded-[16px] p-5">
                         <h4 className="m-0 mb-[10px] text-[11px] font-extrabold uppercase text-[#666] tracking-[1px]">Interests</h4>
                         <div className="flex gap-2 flex-wrap">
                            {data.icp_persona.interests?.map((i, idx) => (
                                <span key={idx} className="bg-white px-[14px] py-[6px] rounded-full text-[13px] font-bold text-[#333]">{i}</span>
                            ))}
                         </div>
                      </div>
                   </div>

                   <div className="flex gap-3 mt-auto">
                        <div className="flex-1 bg-green-100/90 p-[16px] rounded-[12px] border border-green-600 shadow-[0_4px_10px_rgba(22,163,74,0.1)]">
                            <span className="text-[10px] font-black text-[#14532d] uppercase">Reach Out</span><br/>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {data.icp_persona.preferred_channel?.map((p, idx) => (
                                    <span key={idx} className="text-[14px] font-bold text-[#052e16]">{p}{idx < data.icp_persona.preferred_channel!.length - 1 ? ',' : ''}</span>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 bg-red-100/90 p-[16px] rounded-[12px] border border-red-600 shadow-[0_4px_10px_rgba(220,38,38,0.1)]">
                            <span className="text-[10px] font-black text-[#7f1d1d] uppercase">Avoid</span><br/>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {data.icp_persona.avoid_channel?.map((a, idx) => (
                                    <span key={idx} className="text-[14px] font-bold text-[#450a0a]">{a}{idx < data.icp_persona.avoid_channel!.length - 1 ? ',' : ''}</span>
                                ))}
                            </div>
                        </div>
                   </div>
                </div>
            </div>
        </div>

        {/* --- BUTTON 3: Footer Action --- */}
        <div className="mt-12">
            <button 
                onClick={onConvert}
                className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white py-5 rounded-2xl font-black text-lg uppercase tracking-wider shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:shadow-[0_0_50px_rgba(124,58,237,0.6)] transition-all transform hover:-translate-y-1"
            >
                Continue -&gt;
            </button>
        </div>

      </div>
    </div>
  );
};
