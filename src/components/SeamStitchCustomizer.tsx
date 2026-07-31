import React, { useState } from 'react';
import { ProjectData, SeamConfig, GarmentSize, FabricWidth } from '../types';
import { Palette, Scissors, Layers, Sliders, DollarSign, Sparkles, Check, RefreshCw } from 'lucide-react';
import { playSelectSound, playTickSound } from '../utils/audioSynth';

interface SeamStitchCustomizerProps {
  project: ProjectData;
  onUpdateProject: (updated: ProjectData) => void;
}

const ACCENT_COLORS = [
  { hex: '#00F0FF', name: 'Electric Cyan' },
  { hex: '#FF007A', name: 'Neon Pink' },
  { hex: '#10B981', name: 'Emerald Glow' },
  { hex: '#A855F7', name: 'Ultraviolet' },
  { hex: '#F59E0B', name: 'Solar Gold' }
];

const THREAD_TYPES = [
  { id: 'poly-high', name: '40wt High-Tenacity Polyester', costMultiplier: 1.0 },
  { id: 'conductive', name: 'Silver-Plated Conductive E-Thread', costMultiplier: 1.6 },
  { id: 'kevlar', name: 'Kevlar Heavy-Duty Armor Thread', costMultiplier: 1.4 },
  { id: 'metallic', name: 'Reflective Metallic Thread', costMultiplier: 1.2 },
  { id: 'silk-pure', name: '100% Pure Mulberry Silk Thread', costMultiplier: 1.5 }
];

const SIZES: GarmentSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const FABRIC_WIDTHS: FabricWidth[] = [44, 54, 60];

export const SeamStitchCustomizer: React.FC<SeamStitchCustomizerProps> = ({
  project,
  onUpdateProject
}) => {
  const [accentColor, setAccentColor] = useState<string>(
    project.customSeam?.accentColor || '#00F0FF'
  );
  const [accentName, setAccentName] = useState<string>(
    project.customSeam?.accentName || 'Electric Cyan'
  );
  const [threadType, setThreadType] = useState<string>(
    project.customSeam?.threadType || THREAD_TYPES[0].name
  );
  const [stitchLength, setStitchLength] = useState<number>(
    project.customSeam?.stitchLength || 2.5
  );
  const [stitchPattern, setStitchPattern] = useState<'straight' | 'zigzag' | 'cyber_grid' | 'double_topstitch'>(
    project.customSeam?.stitchPattern || 'cyber_grid'
  );
  const [size, setSize] = useState<GarmentSize>(project.customSeam?.garmentSize || 'M');
  const [fabricWidth, setFabricWidth] = useState<FabricWidth>(project.customSeam?.fabricWidth || 54);

  // Calculate Yardage & Cutting Efficiency based on Garment Size & Fabric Width
  const calculateYield = () => {
    const sizeMultiplier: Record<GarmentSize, number> = {
      XS: 1.3,
      S: 1.5,
      M: 1.8,
      L: 2.1,
      XL: 2.4,
      XXL: 2.7
    };

    const widthFactor = fabricWidth === 60 ? 0.88 : fabricWidth === 54 ? 1.0 : 1.18;
    const yardsNeeded = (sizeMultiplier[size] * widthFactor).toFixed(2);
    
    // Zero waste efficiency score
    const efficiency = Math.min(98.5, Math.max(86.0, 96.0 - (sizeMultiplier[size] * 1.5))).toFixed(1);

    // Calculate cost estimation
    const threadObj = THREAD_TYPES.find(t => t.name === threadType) || THREAD_TYPES[0];
    const fabricCostPerYardMap: Record<string, number> = {
      denim: 18,
      silk: 32,
      cotton: 14,
      techwear: 28,
      smart_textile: 45
    };

    const baseFabricCost = fabricCostPerYardMap[project.fabric] || 22;
    const totalFabricCost = parseFloat(yardsNeeded) * baseFabricCost;
    const hardwareCost = 16.5;
    const totalCost = (totalFabricCost + (12 * threadObj.costMultiplier) + hardwareCost).toFixed(2);

    return { yardsNeeded, efficiency, totalCost, baseFabricCost };
  };

  const { yardsNeeded, efficiency, totalCost, baseFabricCost } = calculateYield();

  const handleApplyCustomization = () => {
    playSelectSound();
    const updatedSeam: SeamConfig = {
      accentColor,
      accentName,
      threadType,
      stitchLength,
      stitchPattern,
      garmentSize: size,
      fabricWidth
    };

    // Update vector layers color with chosen accent color
    const updatedVectorLayers = project.vectorLayers.map((layer) => {
      if (layer.type === 'stitch') {
        return { ...layer, color: accentColor };
      }
      return layer;
    });

    onUpdateProject({
      ...project,
      customSeam: updatedSeam,
      vectorLayers: updatedVectorLayers
    });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Header card */}
      <div className="bg-gradient-to-r from-black/80 via-[#0E1116] to-black/80 border border-white/10 rounded-2xl p-3.5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#00F0FF] uppercase tracking-wider">
            <Palette className="w-3.5 h-3.5" /> SEAM &amp; YIELD CUSTOMIZER
          </div>
          <h3 className="text-sm font-bold text-white truncate max-w-[240px]">
            {project.title}
          </h3>
        </div>

        <span className="text-xs font-mono text-cyan-300 bg-[#00F0FF]/10 px-2.5 py-1 rounded-full border border-[#00F0FF]/30">
          SIZE: {size} • {fabricWidth}&quot;
        </span>
      </div>

      {/* SECTION 1: NEON STITCH ACCENT COLOR */}
      <div className="bg-black/40 border border-white/10 rounded-2xl p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" /> Neon Seam Accent
          </label>
          <span className="text-[11px] font-mono font-medium" style={{ color: accentColor }}>
            {accentName}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          {ACCENT_COLORS.map((c) => {
            const isSelected = accentColor === c.hex;
            return (
              <button
                key={c.hex}
                onClick={() => {
                  playSelectSound();
                  setAccentColor(c.hex);
                  setAccentName(c.name);
                }}
                className={`flex-1 py-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'border-white scale-105 shadow-[0_0_15px_rgba(255,255,255,0.3)] bg-white/10'
                    : 'border-white/10 hover:border-white/30 bg-black/40'
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full mb-1 border border-white/40"
                  style={{ backgroundColor: c.hex, boxShadow: `0 0 8px ${c.hex}` }}
                />
                <span className="text-[9px] font-mono text-slate-300 truncate w-full text-center px-0.5">
                  {c.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: THREAD & STITCH PATTERN */}
      <div className="bg-black/40 border border-white/10 rounded-2xl p-3.5 space-y-3">
        <div>
          <label className="text-xs font-semibold text-slate-200 block mb-1.5">
            Thread Material Type
          </label>
          <select
            value={threadType}
            onChange={(e) => {
              playSelectSound();
              setThreadType(e.target.value);
            }}
            className="w-full bg-black/80 border border-white/15 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#00F0FF] transition-all"
          >
            {THREAD_TYPES.map((t) => (
              <option key={t.id} value={t.name} className="bg-[#0E1116] text-white">
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stitch Length Slider */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-300 font-medium">Stitch Length Density</span>
            <span className="font-mono text-[#00F0FF] font-bold">{stitchLength} mm</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="5.0"
            step="0.5"
            value={stitchLength}
            onChange={(e) => {
              playTickSound();
              setStitchLength(parseFloat(e.target.value));
            }}
            className="w-full accent-[#00F0FF] cursor-pointer"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
            <span>1.0mm (Dense Micro)</span>
            <span>3.0mm (Standard)</span>
            <span>5.0mm (Long Baste)</span>
          </div>
        </div>

        {/* Stitch Pattern Buttons */}
        <div>
          <label className="text-xs font-semibold text-slate-200 block mb-1.5">
            Stitch Architecture Style
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { id: 'straight', label: '🪡 Single Straight Seam' },
              { id: 'cyber_grid', label: '⚡ Cyber Stitch Grid' },
              { id: 'zigzag', label: '📐 Reinforcing Zigzag' },
              { id: 'double_topstitch', label: '🧵 Double Topstitch' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  playSelectSound();
                  setStitchPattern(p.id as any);
                }}
                className={`p-2 rounded-xl border text-left font-medium text-[11px] transition-all ${
                  stitchPattern === p.id
                    ? 'bg-[#00F0FF]/20 border-[#00F0FF] text-[#00F0FF] font-bold'
                    : 'bg-black/30 border-white/10 text-slate-300 hover:border-white/30'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: FABRIC YIELD & COST CALCULATOR */}
      <div className="bg-black/40 border border-white/10 rounded-2xl p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Scissors className="w-3.5 h-3.5 text-[#FF007A]" /> Fabric Yield &amp; Size Layout
          </span>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            {efficiency}% Zero-Waste Score
          </span>
        </div>

        {/* Size Selection */}
        <div>
          <span className="text-[10px] font-mono text-slate-400 block mb-1.5">GARMENT SIZE:</span>
          <div className="flex gap-1.5">
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => {
                  playSelectSound();
                  setSize(s);
                }}
                className={`flex-1 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                  size === s
                    ? 'bg-[#FF007A]/20 border-[#FF007A] text-[#FF007A]'
                    : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Fabric Width Selection */}
        <div>
          <span className="text-[10px] font-mono text-slate-400 block mb-1.5">FABRIC BOLT WIDTH:</span>
          <div className="flex gap-2">
            {FABRIC_WIDTHS.map((w) => (
              <button
                key={w}
                onClick={() => {
                  playSelectSound();
                  setFabricWidth(w);
                }}
                className={`flex-1 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all ${
                  fabricWidth === w
                    ? 'bg-[#00F0FF]/20 border-[#00F0FF] text-[#00F0FF]'
                    : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {w}&quot; Standard Bolt
              </button>
            ))}
          </div>
        </div>

        {/* Live Cutting Yardage & Cost Display */}
        <div className="bg-gradient-to-r from-black/80 via-[#0F141C] to-black/80 border border-white/15 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block font-mono">Fabric Required</span>
            <span className="text-sm font-extrabold text-[#00F0FF] font-mono">{yardsNeeded} Yards</span>
            <span className="text-[9px] text-slate-500 block">@ ${baseFabricCost}/yd</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block font-mono">Estimated Material Cost</span>
            <span className="text-sm font-extrabold text-emerald-400 font-mono">${totalCost} EST</span>
            <span className="text-[9px] text-slate-500 block">Includes fabric, thread &amp; zip</span>
          </div>
        </div>
      </div>

      {/* Apply Customization Button */}
      <button
        onClick={handleApplyCustomization}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#00F0FF] via-cyan-400 to-[#FF007A] text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
      >
        <Check className="w-4 h-4" /> Save &amp; Apply Seam Customization
      </button>

    </div>
  );
};
