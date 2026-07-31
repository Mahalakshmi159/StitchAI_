import React from 'react';
import { Cpu, Volume2, VolumeX, Sparkles, RefreshCw } from 'lucide-react';
import { isAudioEnabled, toggleAudio, playSelectSound } from '../utils/audioSynth';

interface HeaderProps {
  onReset: () => void;
  audioActive: boolean;
  setAudioActive: (active: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset, audioActive, setAudioActive }) => {
  const handleAudioToggle = () => {
    const newState = toggleAudio();
    setAudioActive(newState);
    if (newState) playSelectSound();
  };

  return (
    <header className="relative w-full mb-4 pt-1 flex flex-col items-center">
      {/* Top Status Bar Row inside Mobile Viewport */}
      <div className="w-full flex items-center justify-between px-2 mb-3 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F0FF]"></span>
          </span>
          <span className="font-mono text-[10px] tracking-wider text-cyan-300">V2.4 NEURAL WEAVER</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAudioToggle}
            className="p-1.5 rounded-full bg-black/40 border border-white/10 text-slate-300 hover:text-[#00F0FF] hover:border-[#00F0FF]/50 transition-colors"
            title={audioActive ? 'Mute SFX' : 'Enable SFX'}
          >
            {audioActive ? <Volume2 className="w-3.5 h-3.5 text-[#00F0FF]" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          </button>
          
          <button
            onClick={() => {
              playSelectSound();
              onReset();
            }}
            className="p-1.5 rounded-full bg-black/40 border border-white/10 text-slate-300 hover:text-[#FF007A] hover:border-[#FF007A]/50 transition-colors"
            title="Reset to Default"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Branding Header */}
      <div className="text-center relative">
        <div className="inline-flex items-center gap-2 mb-1">
          <div className="relative p-1.5 rounded-xl bg-gradient-to-br from-[#00F0FF]/20 to-[#FF007A]/20 border border-[#00F0FF]/40 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <Cpu className="w-5 h-5 text-[#00F0FF] animate-pulse" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#00F0FF] via-white to-[#FF007A] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(0,240,255,0.4)]">
            StitchAI
          </h1>
          
          <Sparkles className="w-4 h-4 text-[#FF007A]" />
        </div>

        <p className="text-xs font-medium text-slate-300 tracking-wide">
          Textile &amp; Sewing Innovation Engine
        </p>
      </div>
    </header>
  );
};
