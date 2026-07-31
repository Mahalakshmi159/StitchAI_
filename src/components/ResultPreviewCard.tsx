import React, { useState } from 'react';
import { ProjectData } from '../types';
import { Clock, Layers, Award, FileText, Bookmark, Share2, Sparkles, Eye, Box, Scissors } from 'lucide-react';
import { playSelectSound } from '../utils/audioSynth';

interface ResultPreviewCardProps {
  project: ProjectData;
  onOpenPatternModal: () => void;
  onSaveProject: (project: ProjectData) => void;
  isSaved: boolean;
}

export const ResultPreviewCard: React.FC<ResultPreviewCardProps> = ({
  project,
  onOpenPatternModal,
  onSaveProject,
  isSaved
}) => {
  const [viewMode, setViewMode] = useState<'render' | 'wireframe'>('render');
  const [activeRotation, setActiveRotation] = useState<number>(0);

  const handleRotate = () => {
    setActiveRotation((prev) => (prev + 90) % 360);
    playSelectSound();
  };

  return (
    <section className="w-full glass-card rounded-2xl p-4 sm:p-5 border border-white/10 relative overflow-hidden mb-6 shadow-2xl">
      {/* Background neon glows */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#FF007A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#00F0FF]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header & Title */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-wider text-[#00F0FF] uppercase bg-[#00F0FF]/10 px-2 py-0.5 rounded-full border border-[#00F0FF]/30">
              {project.fabric.toUpperCase()} • {project.craftStyle.toUpperCase()}
            </span>
            <span className="text-[10px] font-mono text-[#FF007A] bg-[#FF007A]/10 px-2 py-0.5 rounded-full border border-[#FF007A]/30">
              {project.innovationGrade}
            </span>
          </div>

          <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
            {project.title}
          </h3>
          <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">
            {project.tagline}
          </p>
        </div>

        <button
          onClick={() => {
            playSelectSound();
            onSaveProject(project);
          }}
          className={`p-2 rounded-xl border transition-all ${
            isSaved
              ? 'bg-[#FF007A]/20 border-[#FF007A] text-[#FF007A] shadow-[0_0_10px_rgba(255,0,122,0.4)]'
              : 'bg-black/40 border-white/10 text-slate-400 hover:text-white hover:border-white/30'
          }`}
          title={isSaved ? 'Saved in Studio' : 'Save to Studio'}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#FF007A]' : ''}`} />
        </button>
      </div>

      {/* Visual Preview Graphic Box */}
      <div className="relative w-full aspect-square max-h-[280px] rounded-xl bg-black/60 border border-white/10 overflow-hidden mb-4 group flex items-center justify-center">
        {/* Toggle between Render & 3D Wireframe */}
        <div className="absolute top-2.5 right-2.5 z-20 flex items-center bg-black/70 backdrop-blur-md p-1 rounded-lg border border-white/15 gap-1">
          <button
            onClick={() => {
              setViewMode('render');
              playSelectSound();
            }}
            className={`px-2 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1 transition-all ${
              viewMode === 'render'
                ? 'bg-[#00F0FF] text-black shadow-[0_0_8px_#00F0FF]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3 h-3" /> Render
          </button>
          <button
            onClick={() => {
              setViewMode('wireframe');
              playSelectSound();
            }}
            className={`px-2 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1 transition-all ${
              viewMode === 'wireframe'
                ? 'bg-[#FF007A] text-white shadow-[0_0_8px_#FF007A]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Box className="w-3 h-3" /> 3D Pattern
          </button>
        </div>

        {/* Rotation indicator button */}
        {viewMode === 'wireframe' && (
          <button
            onClick={handleRotate}
            className="absolute bottom-2.5 right-2.5 z-20 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15 text-[10px] font-mono text-cyan-300 hover:border-[#00F0FF] transition-all flex items-center gap-1"
          >
            <Box className="w-3 h-3 text-[#00F0FF]" /> Rotate {activeRotation}°
          </button>
        )}

        {/* View Mode 1: Photorealistic Image Render */}
        {viewMode === 'render' ? (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {project.imageSrc ? (
              <img
                src={project.imageSrc}
                alt={project.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-900 via-black to-slate-900 flex items-center justify-center">
                <Scissors className="w-12 h-12 text-[#00F0FF] animate-pulse" />
              </div>
            )}

            {/* Glowing HUD overlay details */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-2 left-2.5 font-mono text-[10px] text-cyan-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
              NEURAL WEAVER 3D PREVIEW
            </div>
          </div>
        ) : (
          /* View Mode 2: Interactive CSS 3D / Isometric Vector Wireframe Graphic */
          <div className="relative w-full h-full bg-[#07080b] flex items-center justify-center p-4">
            {/* Grid overlay background */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#00F0FF 1px, transparent 1px)',
                backgroundSize: '16px 16px'
              }}
            />

            <div
              className="relative w-44 h-48 transition-transform duration-500 flex items-center justify-center"
              style={{ transform: `rotateY(${activeRotation}deg)` }}
            >
              {/* SVG 3D Garment Wireframe Illustration */}
              <svg viewBox="0 0 200 220" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                {/* Garment Outer Outline */}
                <path
                  d="M 60 40 L 90 20 L 110 20 L 140 40 L 170 70 L 150 90 L 135 70 L 135 180 L 65 180 L 65 70 L 50 90 L 30 70 Z"
                  fill="rgba(0, 240, 255, 0.08)"
                  stroke="#00F0FF"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />

                {/* Cyber Stitch Grid Overlay */}
                <path
                  d="M 65 100 L 135 100 M 65 140 L 135 140 M 100 20 L 100 180"
                  stroke="#FF007A"
                  strokeWidth="1.5"
                />

                {/* Collar & Lapel Details */}
                <path d="M 90 20 L 100 50 L 110 20" fill="none" stroke="#00F0FF" strokeWidth="2" />

                {/* Arm / Sleeve Cut Lines */}
                <path d="M 65 70 L 30 70 M 135 70 L 170 70" stroke="#38BDF8" strokeWidth="2" />

                {/* Node Markers */}
                <circle cx="90" cy="20" r="3" fill="#FF007A" />
                <circle cx="110" cy="20" r="3" fill="#FF007A" />
                <circle cx="100" cy="100" r="3" fill="#00F0FF" />
                <circle cx="100" cy="140" r="3" fill="#00F0FF" />
              </svg>

              <div className="absolute -bottom-1 left-0 right-0 text-center font-mono text-[9px] text-[#FF007A] uppercase tracking-widest bg-black/60 py-0.5 rounded border border-[#FF007A]/30">
                Vector Assembly Layers
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Project Metadata Badges Row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {/* Badge 1: Estimated Time */}
        <div className="bg-black/40 border border-white/10 rounded-xl p-2.5 flex flex-col items-center text-center">
          <Clock className="w-3.5 h-3.5 text-[#00F0FF] mb-1" />
          <span className="text-[10px] text-slate-400 font-medium">Est. Time</span>
          <span className="text-xs font-bold text-white mt-0.5">{project.estimatedTime}</span>
        </div>

        {/* Badge 2: Innovation Score */}
        <div className="bg-black/40 border border-white/10 rounded-xl p-2.5 flex flex-col items-center text-center">
          <Award className="w-3.5 h-3.5 text-[#FF007A] mb-1" />
          <span className="text-[10px] text-slate-400 font-medium">Innovation</span>
          <span className="text-xs font-bold text-[#FF007A] mt-0.5">{project.innovationScore}/100</span>
        </div>

        {/* Badge 3: Pattern Pieces */}
        <div className="bg-black/40 border border-white/10 rounded-xl p-2.5 flex flex-col items-center text-center">
          <Layers className="w-3.5 h-3.5 text-[#38BDF8] mb-1" />
          <span className="text-[10px] text-slate-400 font-medium">Cut Pieces</span>
          <span className="text-xs font-bold text-white mt-0.5">{project.patternSpecs.piecesCount} Cuts</span>
        </div>
      </div>

      {/* Materials Needed Quick Summary */}
      <div className="mb-4 bg-black/30 border border-white/5 rounded-xl p-3">
        <span className="text-[11px] font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
          <Scissors className="w-3 h-3 text-[#00F0FF]" /> Required Materials ({project.materials.length}):
        </span>

        <div className="flex flex-wrap gap-1.5">
          {project.materials.map((mat, idx) => (
            <span
              key={idx}
              className="text-[10px] text-slate-300 bg-white/5 px-2 py-0.5 rounded-md border border-white/10 font-mono"
            >
              • {mat}
            </span>
          ))}
        </div>
      </div>

      {/* Secondary Action Button: View Pattern & Instructions */}
      <button
        onClick={() => {
          playSelectSound();
          onOpenPatternModal();
        }}
        className="w-full py-3 px-4 rounded-xl font-bold text-xs tracking-wider uppercase text-white bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-[#00F0FF]/50 hover:border-[#00F0FF] hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2 group"
      >
        <FileText className="w-4 h-4 text-[#00F0FF] group-hover:scale-110 transition-transform" />
        <span>View Pattern &amp; Instructions</span>
        <Sparkles className="w-3.5 h-3.5 text-[#FF007A]" />
      </button>
    </section>
  );
};
