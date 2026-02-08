import React, { useState, useEffect, useRef } from 'react';
import { LandingView } from './components/LandingView';
import { CinematicLoader } from './components/CinematicLoader';
import { ResultView } from './components/ResultView';
import { ConversionModal } from './components/ConversionModal';
import { LoginModal } from './components/LoginModal'; 
import { ConceptModal, PackagesModal, InvestModal, AboutModal, ContactModal, InviteModal, CallMeModal, CallMeConfirmationModal } from './components/SecondaryModals';
import { AnalysisResult, AppStep, ToneOfVoice } from './types';
import { mockAnalyze, preloadPassportData } from './services/mockService';

// --- CACHE ENGINE ---
const CACHE_KEY_PREFIX = 'spades_analysis_';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

const getCachedResult = (domain: string) => {
    const key = CACHE_KEY_PREFIX + domain.toLowerCase();
    const item = localStorage.getItem(key);
    if (!item) return null;
    try {
        const parsed = JSON.parse(item);
        if (Date.now() - parsed.timestamp > CACHE_TTL) {
            localStorage.removeItem(key);
            return null;
        }
        return parsed.data;
    } catch { return null; }
};

const setCachedResult = (domain: string, data: any) => {
    const key = CACHE_KEY_PREFIX + domain.toLowerCase();
    localStorage.setItem(key, JSON.stringify({
        timestamp: Date.now(),
        data
    }));
};

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('landing');
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [lastUrl, setLastUrl] = useState<string>('');
  const activeRunIdRef = useRef<string | null>(null);
  
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [loginInitialMode, setLoginInitialMode] = useState<'login' | 'signup'>('login');
  const [isUSCall, setIsUSCall] = useState(false);
  
  useEffect(() => {
    preloadPassportData();
  }, []);

  useEffect(() => {
    if (step === 'result' || step === 'loading') {
      document.body.classList.add('glass-mode');
    } else {
      document.body.classList.remove('glass-mode');
    }
  }, [step]);

  const handleStartAnalysis = async (url: string, tone: ToneOfVoice, hardReset: boolean = false) => {
    const domain = url.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    const runId = Date.now().toString();
    activeRunIdRef.current = runId;
    setLastUrl(url);
    
    // Check Cache (skip if hardReset)
    if (!hardReset) {
      const cached = getCachedResult(domain);
      if (cached) {
          if (activeRunIdRef.current !== runId) return;
          setData(cached);
          setStep('result');
          return;
      }
    }

    setData(null); 
    setStep('loading');
    
    try {
      const result = await mockAnalyze(url, runId, hardReset);
      
      // VERIFY: Still the current run?
      if (activeRunIdRef.current !== runId) {
        console.log(`[ABORT] Stale run discarded: ${runId}`);
        return;
      }

      setCachedResult(domain, result);
      setData(result);
    } catch (error) {
      console.error(`❌ App Error [Run ${runId}]:`, error);
      if (activeRunIdRef.current === runId) {
        alert("Unable to analyze this domain. Please check the URL and try again.");
        setStep('landing');
      }
    }
  };

  const handleLoaderComplete = () => {
    setStep('result');
  };

  const handleReset = () => {
    activeRunIdRef.current = null;
    setStep('landing');
    setData(null);
  };

  const handleHardResetTrigger = () => {
      if (lastUrl) handleStartAnalysis(lastUrl, 'Consultative', true);
  };

  // --- MODAL CONTROLLERS ---
  const closeAllModals = () => {
    setActiveModal(null);
  };

  const openModal = (name: string) => {
    setActiveModal(name);
  };

  const openLoginModal = (mode: 'login' | 'signup') => {
    setLoginInitialMode(mode);
    setActiveModal('login');
  };

  const handleCallSuccess = (isUS: boolean) => {
    setIsUSCall(isUS);
    openModal('callme_confirm');
  };

  return (
    <div className="min-h-screen font-sans selection:bg-purple-500/30 overflow-x-hidden relative transition-colors duration-1000">
      <main className="relative z-10">
        {step === 'landing' && (
          <LandingView 
            onStart={handleStartAnalysis} 
            onOpenConcept={() => openModal('concept')}
            onOpenPackages={() => openModal('packages')}
            onOpenLogin={() => openLoginModal('login')}
            onOpenInvest={() => openModal('invest')}
            onOpenAbout={() => openModal('about')}
            onOpenContact={() => openModal('contact')}
            onOpenInvite={() => openModal('invite')}
          />
        )}
        {step === 'loading' && (
          <CinematicLoader onComplete={handleLoaderComplete} />
        )}
        {step === 'result' && data && (
          <ResultView 
            data={data} 
            onConvert={() => openLoginModal('signup')} 
            onReset={handleReset}
            onHardReset={handleHardResetTrigger}
          />
        )}
      </main>

      <ConversionModal 
        isOpen={activeModal === 'signup'} 
        onClose={closeAllModals} 
        analyzedDomain={data?.company_profile?.domain}
      />
      
      <LoginModal 
        isOpen={activeModal === 'login'}
        onClose={closeAllModals}
        initialMode={loginInitialMode}
      />

      {/* --- SECONDARY MODALS --- */}
      <ConceptModal 
        isOpen={activeModal === 'concept'} 
        onClose={closeAllModals} 
        onOpenPackages={() => openModal('packages')}
      />
      <PackagesModal 
        isOpen={activeModal === 'packages'} 
        onClose={closeAllModals} 
        onOpenSignup={() => openLoginModal('signup')}
        onOpenCallMe={() => openModal('callme')}
      />
      <InvestModal 
        isOpen={activeModal === 'invest'} 
        onClose={closeAllModals}
        onOpenCallMe={() => openModal('callme')}
        onSuccess={handleCallSuccess}
      />
      <AboutModal 
        isOpen={activeModal === 'about'} 
        onClose={closeAllModals} 
        onOpenInvite={() => openModal('invite')}
        onOpenInvest={() => openModal('invest')}
      />
      <ContactModal 
        isOpen={activeModal === 'contact'} 
        onClose={closeAllModals} 
      />
      <InviteModal 
        isOpen={activeModal === 'invite'} 
        onClose={closeAllModals} 
      />
      <CallMeModal 
        isOpen={activeModal === 'callme'} 
        onClose={closeAllModals} 
        onSuccess={handleCallSuccess}
      />
      <CallMeConfirmationModal
        isOpen={activeModal === 'callme_confirm'}
        onClose={closeAllModals}
        isUS={isUSCall}
      />
    </div>
  );
};

export default App;
