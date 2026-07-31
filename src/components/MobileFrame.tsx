import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Bookmark, Maximize2, Minimize2, Smartphone } from 'lucide-react';
import { playSelectSound } from '../utils/audioSynth';

interface MobileFrameProps {
  children: React.ReactNode;
  savedCount: number;
  onOpenSavedDrawer: () => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  savedCount,
  onOpenSavedDrawer
}) => {
  const [isMobileFrameMode, setIsMobileFrameMode] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('9:41');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hrs = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hrs}:${mins}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#07080A] text-slate-100 flex flex-col items-center justify-center p-2 sm:p-6 relative overflow-x-hidden select-none font-sans">
      
      {/* Background Animated Neon Spheres */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-radial from-[#00F0FF]/15 via-[#FF007A]/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-10 left-10 w-[300px] h-[300px] bg-[#00F0FF]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed top-10 right-10 w-[300px] h-[300px] bg-[#FF007A]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Outer Desktop Control Bar */}
      <div className="w-full max-w-[430px] flex items-center justify-between mb-3 px-3 py-1.5 bg-black/40 border border-white/10 rounded-xl backdrop-blur-lg text-xs z-20">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-[#00F0FF]" />
          <span className="font-mono text-[11px] text-slate-300">StitchAI Viewport</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playSelectSound();
              onOpenSavedDrawer();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-200 hover:text-[#FF007A] hover:border-[#FF007A]/50 transition-colors text-xs font-semibold"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#FF007A]" />
            <span>Saved ({savedCount})</span>
          </button>

          <button
            onClick={() => {
              playSelectSound();
              setIsMobileFrameMode(!isMobileFrameMode);
            }}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-[#00F0FF] transition-colors"
            title={isMobileFrameMode ? 'Expand Canvas' : 'Fit Mobile Chassis'}
          >
            {isMobileFrameMode ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Simulated Mobile Device Chassis */}
      <main
        className={`w-full transition-all duration-300 relative z-10 ${
          isMobileFrameMode
            ? 'max-w-[420px] bg-[#0D0F12] border-2 border-white/15 rounded-[38px] shadow-[0_0_50px_rgba(0,240,255,0.25)] overflow-hidden p-3 sm:p-4'
            : 'max-w-2xl bg-[#0D0F12] border border-white/15 rounded-2xl p-4 sm:p-6 shadow-2xl'
        }`}
      >
        {/* Mobile Top Notch & Status Bar */}
        {isMobileFrameMode && (
          <div className="w-full flex items-center justify-between px-3 pt-1 pb-2 mb-2 text-xs text-slate-300 font-mono border-b border-white/5">
            {/* Clock */}
            <span className="font-bold text-[11px]">{currentTime}</span>

            {/* Simulated Camera Dynamic Notch */}
            <div className="w-20 h-4 bg-black/80 border border-white/10 rounded-full flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-800" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]/80 animate-pulse" />
            </div>

            {/* Battery & Wifi icons */}
            <div className="flex items-center gap-1.5 text-slate-400">
              <Wifi className="w-3.5 h-3.5 text-cyan-300" />
              <Battery className="w-3.5 h-3.5 text-slate-300" />
            </div>
          </div>
        )}

        {/* Child Screen Content */}
        <div className="w-full relative">
          {children}
        </div>

        {/* Mobile Bottom Home Indicator Bar */}
        {isMobileFrameMode && (
          <div className="w-full flex justify-center pt-2 pb-1">
            <div className="w-28 h-1 bg-white/20 rounded-full" />
          </div>
        )}
      </main>

      {/* Footer Branding Text */}
      <footer className="mt-4 text-center text-[11px] text-slate-500 font-mono tracking-wider">
        StitchAI Mobile Engine • Cyber-Artisanal Textile Innovation
      </footer>
    </div>
  );
};
