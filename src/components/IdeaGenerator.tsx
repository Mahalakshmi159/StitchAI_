import React from 'react';
import { DifficultyLevel, FabricType, CraftStyle } from '../types';
import { Sliders, Zap, Sparkles, Feather, Shield, Disc, Layers } from 'lucide-react';
import { playTickSound, playSelectSound, playGenerateStartSound } from '../utils/audioSynth';

interface IdeaGeneratorProps {
  difficulty: DifficultyLevel;
  difficultyValue: number;
  setDifficultyValue: (val: number) => void;
  fabric: FabricType;
  setFabric: (fabric: FabricType) => void;
  craftStyle: CraftStyle;
  setCraftStyle: (style: CraftStyle) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  generationProgress: number;
  generationStageText: string;
}

export const IdeaGenerator: React.FC<IdeaGeneratorProps> = ({
  difficultyValue,
  setDifficultyValue,
  fabric,
  setFabric,
  craftStyle,
  setCraftStyle,
  onGenerate,
  isGenerating,
  generationProgress,
  generationStageText
}) => {
  const difficultyLabels: Record<number, { title: string; badge: string; color: string; desc: string }> = {
    1: {
      title: 'Beginner',
      badge: 'Level 1',
      color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
      desc: 'Straight seams, simple folds & iron-on stabilizers'
    },
    2: {
      title: 'Intermediate',
      badge: 'Level 2',
      color: 'text-[#00F0FF] border-[#00F0FF]/40 bg-[#00F0FF]/10',
      desc: 'Bespoke tailoring, curved gussets & conductive thread'
    },
    3: {
      title: 'Master',
      badge: 'Level 3',
      color: 'text-[#FF007A] border-[#FF007A]/40 bg-[#FF007A]/10',
      desc: 'Complex 3D geometry, zero-waste cuts & optic wiring'
    }
  };

  const fabricOptions: { id: FabricType; label: string; icon: string; desc: string }[] = [
    { id: 'denim', label: 'Denim', icon: '👖', desc: 'Raw / Selvedge Indigo' },
    { id: 'silk', label: 'Silk', icon: '✨', desc: 'Mulberry Satin' },
    { id: 'cotton', label: 'Cotton Canvas', icon: '🧵', desc: 'Organic Heavy Duty' },
    { id: 'techwear', label: 'Upcycled Tech-wear', icon: '⚡', desc: 'Gore-Tex / Ripstop' },
    { id: 'smart_textile', label: 'Smart E-Textile', icon: '🌟', desc: 'Conductive Wire Mesh' }
  ];

  const craftStyleOptions: { id: CraftStyle; label: string; icon: string }[] = [
    { id: 'embroidery', label: 'Embroidery', icon: '🪡' },
    { id: 'quilting', label: 'Quilting', icon: '🧩' },
    { id: 'upcycling', label: 'Upcycling', icon: '♻️' },
    { id: 'patchwork', label: 'Patchwork', icon: '🎨' }
  ];

  const currentDiff = difficultyLabels[difficultyValue] || difficultyLabels[2];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setDifficultyValue(val);
    playTickSound();
  };

  const handleFabricSelect = (f: FabricType) => {
    setFabric(f);
    playSelectSound();
  };

  const handleStyleSelect = (s: CraftStyle) => {
    setCraftStyle(s);
    playSelectSound();
  };

  const handleGenerateClick = () => {
    if (isGenerating) return;
    playGenerateStartSound();
    onGenerate();
  };

  return (
    <section className="w-full glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden border border-white/10 mb-5">
      {/* Background ambient lighting in card */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#00F0FF]/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#FF007A]/15 rounded-full blur-2xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#00F0FF]" />
          <h2 className="text-sm font-bold tracking-wider text-white uppercase">
            Idea Generator Engine
          </h2>
        </div>
        <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
          AI Parameters
        </span>
      </div>

      {/* Control 1: Difficulty Level Slider */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#00F0FF]" />
            Difficulty Level
          </label>

          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${currentDiff.color} transition-all`}>
            {currentDiff.title} ({currentDiff.badge})
          </span>
        </div>

        {/* Custom Range Slider */}
        <div className="relative pt-1 pb-2">
          <input
            type="range"
            min="1"
            max="3"
            step="1"
            value={difficultyValue}
            onChange={handleSliderChange}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00F0FF] focus:outline-none border border-white/10"
          />

          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1.5 px-1">
            <span className={difficultyValue === 1 ? 'text-[#00F0FF] font-bold' : ''}>Beginner</span>
            <span className={difficultyValue === 2 ? 'text-[#00F0FF] font-bold' : ''}>Intermediate</span>
            <span className={difficultyValue === 3 ? 'text-[#FF007A] font-bold' : ''}>Master</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 bg-black/30 p-2 rounded-lg border border-white/5 mt-1 leading-relaxed">
          💡 {currentDiff.desc}
        </p>
      </div>

      {/* Control 2: Fabric Type Selector Pills */}
      <div className="mb-5">
        <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 mb-2.5">
          <Layers className="w-3.5 h-3.5 text-[#FF007A]" />
          Fabric Type
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {fabricOptions.map((item) => {
            const isSelected = fabric === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleFabricSelect(item.id)}
                className={`relative px-2.5 py-2 rounded-xl text-left transition-all border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#00F0FF]/15 border-[#00F0FF] text-white shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                    : 'bg-black/30 border-white/10 text-slate-300 hover:border-white/30 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-base">{item.icon}</span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] shadow-[0_0_6px_#00F0FF]" />
                  )}
                </div>
                <span className="text-xs font-semibold block truncate">{item.label}</span>
                <span className="text-[9px] text-slate-400 block truncate leading-tight mt-0.5">
                  {item.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Control 3: Craft Style Toggle Options */}
      <div className="mb-6">
        <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
          Craft Style
        </label>

        <div className="grid grid-cols-2 gap-2">
          {craftStyleOptions.map((item) => {
            const isSelected = craftStyle === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleStyleSelect(item.id)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#FF007A]/20 to-[#00F0FF]/20 border-[#FF007A] text-white shadow-[0_0_12px_rgba(255,0,122,0.3)]'
                    : 'bg-black/30 border-white/10 text-slate-300 hover:border-white/30 hover:bg-white/5'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="font-semibold">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Action Button: Glowing Generate Button */}
      <div className="relative pt-1">
        <button
          type="button"
          onClick={handleGenerateClick}
          disabled={isGenerating}
          className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide text-white transition-all flex items-center justify-center gap-2 relative overflow-hidden ${
            isGenerating
              ? 'bg-slate-800 border border-cyan-500/50 cursor-not-allowed opacity-90'
              : 'bg-gradient-to-r from-[#00F0FF] via-cyan-400 to-[#FF007A] text-black font-extrabold shadow-[0_0_20px_rgba(0,240,255,0.5)] animate-neon-pulse hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isGenerating ? (
            <div className="flex flex-col items-center gap-1 w-full text-cyan-300">
              <div className="flex items-center gap-2">
                <Disc className="w-4 h-4 animate-spin text-[#00F0FF]" />
                <span className="font-mono text-xs text-white">GENERATING PATTERN... {generationProgress}%</span>
              </div>

              {/* Progress bar line */}
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-white/10 mt-1">
                <div
                  className="bg-gradient-to-r from-[#00F0FF] to-[#FF007A] h-full transition-all duration-300"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>

              <span className="text-[10px] text-slate-400 font-mono tracking-wider animate-pulse mt-0.5">
                {generationStageText}
              </span>
            </div>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-black animate-spin" style={{ animationDuration: '4s' }} />
              <span className="tracking-wider uppercase">Generate Project</span>
              <Zap className="w-4 h-4 text-black" />
            </>
          )}
        </button>
      </div>
    </section>
  );
};
