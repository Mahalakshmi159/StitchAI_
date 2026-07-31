import React, { useState } from 'react';
import { ProjectData, AssemblyStep } from '../types';
import { X, CheckCircle2, Circle, FileText, Layers, ShoppingBag, Download, Copy, Check, Scissors, Lightbulb, ExternalLink, Printer } from 'lucide-react';
import { playSelectSound, playTickSound } from '../utils/audioSynth';

interface PatternInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectData;
}

export const PatternInstructionsModal: React.FC<PatternInstructionsModalProps> = ({
  isOpen,
  onClose,
  project
}) => {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'steps' | 'materials'>('blueprint');
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({
    cut: true,
    stitch: true,
    fold: true,
    led_wire: true
  });

  if (!isOpen) return null;

  const toggleStep = (stepNum: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepNum]: !prev[stepNum]
    }));
    playTickSound();
  };

  const handleCopyMaterials = () => {
    const text = `StitchAI Pattern Specs - ${project.title}\n` +
      `Fabric: ${project.fabric.toUpperCase()}\n` +
      `Needle: ${project.patternSpecs.recommendedNeedle}\n\n` +
      `Materials Needed:\n` + project.materials.map(m => `- ${m}`).join('\n');
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    playSelectSound();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPrintableDoc = () => {
    playSelectSound();

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${project.title} - StitchAI Printable Spec Sheet</title>
  <style>
    body {
      font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      color: #111827;
      max-width: 800px;
      margin: 0 auto;
      padding: 30px 20px;
      background-color: #ffffff;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
    .header {
      border-bottom: 2px solid #000;
      padding-bottom: 15px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .brand {
      font-size: 12px;
      font-weight: bold;
      letter-spacing: 2px;
      color: #0284c7;
      text-transform: uppercase;
    }
    h1 {
      margin: 5px 0 0 0;
      font-size: 24px;
      color: #000;
    }
    .tagline {
      font-style: italic;
      color: #4b5563;
      margin-top: 4px;
      font-size: 14px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-bottom: 20px;
    }
    .card {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 12px;
      background-color: #f9fafb;
    }
    .card-title {
      font-size: 11px;
      font-weight: bold;
      text-transform: uppercase;
      color: #6b7280;
      margin-bottom: 4px;
    }
    .card-value {
      font-size: 14px;
      font-weight: bold;
      color: #111827;
    }
    h2 {
      font-size: 16px;
      border-bottom: 1px solid #d1d5db;
      padding-bottom: 6px;
      margin-top: 25px;
      margin-bottom: 12px;
      color: #1f2937;
    }
    ul {
      margin: 0;
      padding-left: 20px;
    }
    li {
      margin-bottom: 6px;
      font-size: 13px;
    }
    .step-item {
      margin-bottom: 15px;
      padding-left: 10px;
      border-left: 3px solid #0284c7;
    }
    .step-title {
      font-weight: bold;
      font-size: 14px;
    }
    .step-detail {
      font-size: 13px;
      color: #374151;
      margin-top: 2px;
    }
    .tip {
      font-size: 12px;
      background-color: #f0f9ff;
      border: 1px solid #bae6fd;
      padding: 8px;
      border-radius: 6px;
      margin-top: 6px;
      color: #0369a1;
    }
    .print-btn {
      background-color: #0284c7;
      color: white;
      border: none;
      padding: 10px 18px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="no-print" style="text-align: right; margin-bottom: 15px;">
    <button onclick="window.print()" class="print-btn">🖨️ Print Document / Save PDF</button>
  </div>

  <div class="header">
    <div>
      <div class="brand">STITCHAI DIGITAL PATTERN ENGINE</div>
      <h1>${project.title}</h1>
      <div class="tagline">${project.tagline}</div>
    </div>
    <div style="text-align: right; font-size: 12px; color: #6b7280;">
      <div>Date: ${new Date().toLocaleDateString()}</div>
      <div>Difficulty: ${project.difficulty.toUpperCase()}</div>
      <div>Innovation Grade: ${project.innovationGrade} (${project.innovationScore}/100)</div>
    </div>
  </div>

  <h2>1. Technical Specifications</h2>
  <div class="grid">
    <div class="card">
      <div class="card-title">Fabric Type</div>
      <div class="card-value">${project.fabric.replace('_', ' ').toUpperCase()}</div>
    </div>
    <div class="card">
      <div class="card-title">Recommended Needle</div>
      <div class="card-value">${project.patternSpecs.recommendedNeedle}</div>
    </div>
    <div class="card">
      <div class="card-title">Seam Allowance</div>
      <div class="card-value">${project.patternSpecs.seamAllowance}</div>
    </div>
    <div class="card">
      <div class="card-title">Thread Gauge</div>
      <div class="card-value">${project.patternSpecs.threadGauge}</div>
    </div>
  </div>

  ${project.customSeam ? `
  <h2>2. Custom Seam & Stitch Configuration</h2>
  <div class="grid">
    <div class="card">
      <div class="card-title">Accent Color</div>
      <div class="card-value">${project.customSeam.accentName} (${project.customSeam.accentColor})</div>
    </div>
    <div class="card">
      <div class="card-title">Garment Size & Fabric Width</div>
      <div class="card-value">Size ${project.customSeam.garmentSize} • ${project.customSeam.fabricWidth}" Bolt</div>
    </div>
    <div class="card">
      <div class="card-title">Stitch Style</div>
      <div class="card-value">${project.customSeam.stitchPattern.replace('_', ' ').toUpperCase()} (${project.customSeam.stitchLength}mm)</div>
    </div>
    <div class="card">
      <div class="card-title">Thread Material</div>
      <div class="card-value">${project.customSeam.threadType}</div>
    </div>
  </div>
  ` : ''}

  <h2>3. Materials & Hardware Checklist</h2>
  <ul>
    ${project.materials.map(m => `<li>${m}</li>`).join('')}
  </ul>

  <h2>4. Cut Pieces Inventory</h2>
  <ul>
    ${project.patternPieces.map(p => `<li><strong>${p.name}:</strong> ${p.dimensions} (Grain: ${p.grainLine})</li>`).join('')}
  </ul>

  <h2>5. Step-by-Step Construction Instructions</h2>
  <div>
    ${project.steps.map(step => `
      <div class="step-item">
        <div class="step-title">Step ${step.stepNumber}: ${step.title}</div>
        <div class="step-detail">${step.detail}</div>
        ${step.techniqueTip ? `<div class="tip"><strong>Craft Tip:</strong> ${step.techniqueTip}</div>` : ''}
      </div>
    `).join('')}
  </div>

  <footer style="margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 15px; font-size: 11px; color: #9ca3af; text-align: center;">
    Generated by StitchAI High-Tech Garment Spec Sheet Engine • Keep this document for your sewing workspace.
  </footer>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_spec_sheet.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleLayer = (layerType: string) => {
    setVisibleLayers((prev) => ({
      ...prev,
      [layerType]: !prev[layerType]
    }));
    playSelectSound();
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / project.steps.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="w-full max-w-md h-[88vh] sm:h-[82vh] max-h-[720px] bg-[#0E1116] border border-white/15 rounded-t-3xl sm:rounded-3xl flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
              <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-wider">PATTERN SPEC SHEET</span>
            </div>
            <h3 className="text-sm font-bold text-white truncate max-w-[260px]">
              {project.title}
            </h3>
          </div>

          <button
            onClick={() => {
              playSelectSound();
              onClose();
            }}
            className="p-1.5 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="grid grid-cols-3 bg-black/60 border-b border-white/10 text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('blueprint');
              playSelectSound();
            }}
            className={`py-2.5 px-1 flex items-center justify-center gap-1.5 transition-all border-b-2 ${
              activeTab === 'blueprint'
                ? 'border-[#00F0FF] text-[#00F0FF] bg-[#00F0FF]/10 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2D Pattern</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('steps');
              playSelectSound();
            }}
            className={`py-2.5 px-1 flex items-center justify-center gap-1.5 transition-all border-b-2 ${
              activeTab === 'steps'
                ? 'border-[#FF007A] text-[#FF007A] bg-[#FF007A]/10 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Steps ({completedCount}/{project.steps.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('materials');
              playSelectSound();
            }}
            className={`py-2.5 px-1 flex items-center justify-center gap-1.5 transition-all border-b-2 ${
              activeTab === 'materials'
                ? 'border-emerald-400 text-emerald-400 bg-emerald-400/10 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Materials</span>
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* TAB 1: 2D VECTOR PATTERN BLUEPRINT */}
          {activeTab === 'blueprint' && (
            <div className="space-y-4">
              {/* Pattern Spec Highlights */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-black/40 border border-white/10 rounded-xl p-2.5">
                  <span className="text-[10px] text-slate-400 block font-mono">Seam Allowance</span>
                  <span className="font-semibold text-white">{project.patternSpecs.seamAllowance}</span>
                </div>
                <div className="bg-black/40 border border-white/10 rounded-xl p-2.5">
                  <span className="text-[10px] text-slate-400 block font-mono">Recommended Needle</span>
                  <span className="font-semibold text-[#00F0FF]">{project.patternSpecs.recommendedNeedle}</span>
                </div>
              </div>

              {/* Layer Toggles Bar */}
              <div className="bg-black/50 border border-white/10 rounded-xl p-2.5">
                <span className="text-[10px] font-mono text-slate-400 block mb-1.5">VECTOR LAYERS:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => toggleLayer('cut')}
                    className={`px-2 py-1 rounded text-[10px] font-mono border flex items-center gap-1 ${
                      visibleLayers.cut ? 'bg-[#00F0FF]/20 border-[#00F0FF] text-[#00F0FF]' : 'bg-black/30 border-white/10 text-slate-500'
                    }`}
                  >
                    ✂️ Cut Lines
                  </button>
                  <button
                    onClick={() => toggleLayer('stitch')}
                    className={`px-2 py-1 rounded text-[10px] font-mono border flex items-center gap-1 ${
                      visibleLayers.stitch ? 'bg-[#FF007A]/20 border-[#FF007A] text-[#FF007A]' : 'bg-black/30 border-white/10 text-slate-500'
                    }`}
                  >
                    🪡 Neon Stitches
                  </button>
                  <button
                    onClick={() => toggleLayer('fold')}
                    className={`px-2 py-1 rounded text-[10px] font-mono border flex items-center gap-1 ${
                      visibleLayers.fold ? 'bg-sky-500/20 border-sky-500 text-sky-400' : 'bg-black/30 border-white/10 text-slate-500'
                    }`}
                  >
                    📐 Fold Lines
                  </button>
                </div>
              </div>

              {/* Interactive SVG Blueprint Layout Canvas */}
              <div className="w-full aspect-[4/3] bg-black/80 border border-white/15 rounded-2xl relative overflow-hidden flex items-center justify-center p-3">
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: 'linear-gradient(to right, #00F0FF 1px, transparent 1px), linear-gradient(to bottom, #00F0FF 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}
                />

                <svg viewBox="0 0 300 220" className="w-full h-full">
                  {/* Outer Frame Grid */}
                  <rect x="5" y="5" width="290" height="210" fill="none" stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />

                  {/* Piece 1: Torso Front */}
                  <g transform="translate(15, 20)">
                    {visibleLayers.cut && (
                      <polygon points="10,10 70,10 65,110 15,110" fill="rgba(0,240,255,0.05)" stroke="#00F0FF" strokeWidth="1.5" />
                    )}
                    {visibleLayers.stitch && (
                      <line x1="20" y1="30" x2="60" y2="30" stroke="#FF007A" strokeWidth="1.2" strokeDasharray="2 2" />
                    )}
                    {visibleLayers.fold && (
                      <line x1="15" y1="60" x2="65" y2="60" stroke="#38BDF8" strokeWidth="1" strokeDasharray="4 2" />
                    )}
                    <text x="22" y="75" fill="#ffffff" fontSize="8" fontFamily="monospace">PANEL A (Front)</text>
                    <text x="22" y="86" fill="#00F0FF" fontSize="7" fontFamily="monospace">48 x 68 cm</text>
                  </g>

                  {/* Piece 2: Sleeves */}
                  <g transform="translate(110, 20)">
                    {visibleLayers.cut && (
                      <polygon points="20,10 80,10 90,110 10,110" fill="rgba(0,240,255,0.05)" stroke="#00F0FF" strokeWidth="1.5" />
                    )}
                    {visibleLayers.stitch && (
                      <path d="M 25 30 L 75 30 M 30 70 L 70 70" stroke="#FF007A" strokeWidth="1.2" strokeDasharray="3 2" />
                    )}
                    <text x="32" y="60" fill="#ffffff" fontSize="8" fontFamily="monospace">SLEEVE (Raglan)</text>
                    <text x="35" y="72" fill="#00F0FF" fontSize="7" fontFamily="monospace">32 x 75 cm</text>
                  </g>

                  {/* Piece 3: Collar */}
                  <g transform="translate(15, 140)">
                    {visibleLayers.cut && (
                      <rect x="10" y="10" width="160" height="40" rx="3" fill="rgba(0,240,255,0.05)" stroke="#00F0FF" strokeWidth="1.5" />
                    )}
                    {visibleLayers.fold && (
                      <line x1="10" y1="30" x2="170" y2="30" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 3" />
                    )}
                    <text x="40" y="24" fill="#ffffff" fontSize="8" fontFamily="monospace">HIGH COLLAR BAFFLE</text>
                  </g>

                  {/* Scale indicator */}
                  <text x="210" y="195" fill="#64748B" fontSize="8" fontFamily="monospace">SCALE: 1:10 VECTOR</text>
                </svg>

                <span className="absolute bottom-2 left-3 text-[9px] font-mono text-cyan-300">
                  LAYOUT: 140cm x 220cm CUT SHEET
                </span>
              </div>

              {/* Cut List Table */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-200 block">Cut Pieces Inventory</span>
                {project.patternPieces.map((p) => (
                  <div key={p.id} className="bg-black/40 border border-white/10 rounded-xl p-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-white block">{p.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Grain: {p.grainLine}</span>
                    </div>
                    <span className="text-xs font-mono text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-0.5 rounded border border-[#00F0FF]/30">
                      {p.dimensions}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: STEP-BY-STEP ASSEMBLY INSTRUCTIONS */}
          {activeTab === 'steps' && (
            <div className="space-y-4">
              {/* Progress bar */}
              <div className="bg-black/40 border border-white/10 rounded-xl p-3">
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-300">Assembly Progress</span>
                  <span className="text-[#FF007A] font-mono">{progressPercent}% Completed</span>
                </div>

                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/10">
                  <div
                    className="bg-gradient-to-r from-[#00F0FF] to-[#FF007A] h-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Steps List */}
              <div className="space-y-3">
                {project.steps.map((step) => {
                  const isDone = !!completedSteps[step.stepNumber];
                  return (
                    <div
                      key={step.stepNumber}
                      onClick={() => toggleStep(step.stepNumber)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isDone
                          ? 'bg-emerald-950/30 border-emerald-500/50 text-slate-300 opacity-80'
                          : 'bg-black/40 border-white/10 hover:border-white/30 text-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button className="mt-0.5 text-emerald-400 shrink-0">
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 fill-emerald-400/20 text-emerald-400" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-500" />
                          )}
                        </button>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-[#FF007A] bg-[#FF007A]/10 px-1.5 py-0.5 rounded border border-[#FF007A]/30">
                              STEP {step.stepNumber}
                            </span>
                            <h4 className={`text-xs font-bold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                              {step.title}
                            </h4>
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed">
                            {step.detail}
                          </p>

                          {step.techniqueTip && (
                            <div className="mt-2 bg-white/5 border border-white/10 rounded-lg p-2 text-[11px] text-cyan-300 flex items-start gap-1.5">
                              <Lightbulb className="w-3.5 h-3.5 text-[#00F0FF] shrink-0 mt-0.5" />
                              <span><strong>Pro Tip:</strong> {step.techniqueTip}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: MATERIALS & SHOPPING CHECKLIST */}
          {activeTab === 'materials' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Fabric &amp; Hardware Shopping List</span>

                <button
                  onClick={handleCopyMaterials}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-slate-200 font-medium flex items-center gap-1.5 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#00F0FF]" />}
                  <span>{copied ? 'Copied!' : 'Copy List'}</span>
                </button>
              </div>

              {/* Machine Specs Box */}
              <div className="bg-gradient-to-r from-black/60 to-slate-900/80 border border-white/10 rounded-2xl p-3.5 space-y-2">
                <div className="text-xs font-semibold text-[#00F0FF] flex items-center gap-1.5">
                  <Scissors className="w-4 h-4" /> Recommended Machine Setup
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Needle Size:</span>
                    <span className="font-bold text-white">{project.patternSpecs.recommendedNeedle}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Thread Gauge:</span>
                    <span className="font-bold text-white">{project.patternSpecs.threadGauge}</span>
                  </div>
                </div>
              </div>

              {/* Item Checklist */}
              <div className="space-y-2">
                {project.materials.map((item, i) => (
                  <div key={i} className="bg-black/40 border border-white/10 rounded-xl p-3 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200">• {item}</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      Required
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-white/10 bg-black/60 flex items-center justify-between gap-2">
          <button
            onClick={handleDownloadPrintableDoc}
            className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs tracking-wider flex items-center gap-1.5 transition-all"
            title="Download formatted printable HTML/PDF spec sheet"
          >
            <Printer className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span className="hidden sm:inline">Printable Doc</span>
            <span className="sm:hidden">Print</span>
          </button>

          <button
            onClick={() => {
              playSelectSound();
              handleCopyMaterials();
            }}
            className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#FF007A] text-black font-extrabold text-xs tracking-wider uppercase shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:scale-105 transition-transform flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export Specs
          </button>
        </div>

      </div>
    </div>
  );
};
