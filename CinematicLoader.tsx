import React, { useEffect, useState } from 'react';
import { Activity, Globe, Users, BrainCircuit, CheckCircle2 } from 'lucide-react';

interface CinematicLoaderProps {
  onComplete: () => void;
}

const MESSAGES = [
  { text: "Scraping Domain Structure...", icon: Globe },
  { text: "Analyzing Brand Tone & Voice...", icon: Activity },
  { text: "Cross-referencing LinkedIn Database...", icon: Users },
  { text: "Identifying Key Decision Maker...", icon: BrainCircuit },
  { text: "Calculating Total Addressable Market...", icon: Activity },
  { text: "Finalizing ICP Passport...", icon: CheckCircle2 },
];

export const CinematicLoader: React.FC<CinematicLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // Duration set to 15 seconds
  const DURATION_MS = 15000;
  const UPDATE_INTERVAL = 50; 

  useEffect(() => {
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += UPDATE_INTERVAL;
      const newProgress = Math.min((elapsed / DURATION_MS) * 100, 100);
      setProgress(newProgress);

      const messageDuration = DURATION_MS / MESSAGES.length;
      const newIndex = Math.min(
        Math.floor(elapsed / messageDuration),
        MESSAGES.length - 1
      );
      setCurrentMessageIndex(newIndex);

      if (elapsed >= DURATION_MS) {
        clearInterval(timer);
        onComplete();
      }
    }, UPDATE_INTERVAL);

    return () => clearInterval(timer);
  }, [onComplete]);

  const CurrentIcon = MESSAGES[currentMessageIndex].icon;

  return (
    // TRANSPARENT WRAPPER (Allows blobs to show)
    <div className="flex flex-col items-center justify-center min-h-screen w-full relative z-50 p-6 animate-fade-in">
      
      {/* THE GLASS CARD */}
      <div className="glass-panel w-full max-w-md flex flex-col items-center !p-12">
        
        {/* Orb Animation */}
        <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
          {/* Ring */}
          <div className="absolute inset-0 border-t-2 border-r-2 border-indigo-600/60 rounded-full animate-spin duration-[3000ms]"></div>
          {/* Glow */}
          <div className="absolute inset-4 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
          
          {/* Icon Container (Glass on Glass) */}
          <div className="relative z-10 glass-inner p-5 rounded-full shadow-lg">
             <CurrentIcon size={32} className="text-indigo-700 animate-pulse" />
          </div>
        </div>

        {/* Text Updates */}
        <div className="h-16 flex flex-col items-center justify-center mb-8 text-center">
          <h2 className="text-lg font-bold text-zinc-900 tracking-wide">
            {MESSAGES[currentMessageIndex].text}
          </h2>
          <p className="text-indigo-600 text-[10px] mt-2 font-mono tracking-widest uppercase font-semibold">
            System Active • Processing
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-zinc-200/50 rounded-full overflow-hidden relative mb-2 border border-white/60">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="w-full flex justify-between text-[10px] font-bold text-zinc-500 tracking-wider">
          <span>INITIALIZING</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
};