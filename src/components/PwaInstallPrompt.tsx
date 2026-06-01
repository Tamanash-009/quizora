import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed',
    platform: string
  }>;
  prompt(): Promise<void>;
}

export function PwaInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPrompt(e as BeforeInstallPromptEvent);
      // Show your customized install prompt
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setInstallPrompt(null);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 bg-[#fdfb23] border-4 border-black p-4 z-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform animate-bounce-in">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-xl uppercase tracking-tighter">Get the App ⚡</h3>
        <button onClick={handleClose} className="p-1 hover:bg-black hover:text-white border-2 border-transparent hover:border-black transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <p className="text-sm font-medium mb-4 leading-tight">
        Install Quizora on your device for a faster, full-screen native experience with offline capabilities!
      </p>
      
      <button 
        onClick={handleInstallClick}
        className="w-full flex items-center justify-center gap-2 bg-[#ff4d4d] text-white border-4 border-black px-4 py-3 font-bold uppercase tracking-wide hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all"
      >
        <Download className="w-5 h-5" />
        Install Now
      </button>
    </div>
  );
}
