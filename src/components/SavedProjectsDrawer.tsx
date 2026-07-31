import React from 'react';
import { ProjectData } from '../types';
import { Bookmark, Trash2, ArrowRight, X, Sparkles } from 'lucide-react';
import { playSelectSound } from '../utils/audioSynth';

interface SavedProjectsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedProjects: ProjectData[];
  onSelectProject: (project: ProjectData) => void;
  onRemoveProject: (id: string) => void;
}

export const SavedProjectsDrawer: React.FC<SavedProjectsDrawerProps> = ({
  isOpen,
  onClose,
  savedProjects,
  onSelectProject,
  onRemoveProject
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4">
      <div className="w-full max-w-md h-[80vh] max-h-[640px] bg-[#0E1116] border border-white/15 rounded-t-3xl sm:rounded-3xl flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#FF007A]" />
            <h3 className="text-sm font-bold text-white">
              Studio Saved Projects ({savedProjects.length})
            </h3>
          </div>

          <button
            onClick={() => {
              playSelectSound();
              onClose();
            }}
            className="p-1.5 rounded-full bg-white/10 text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedProjects.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Bookmark className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs font-semibold">No saved patterns yet.</p>
              <p className="text-[11px] text-slate-500">
                Click the bookmark icon on any generated project card to save it here!
              </p>
            </div>
          ) : (
            savedProjects.map((p) => (
              <div
                key={p.id}
                className="bg-black/40 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3 hover:border-[#00F0FF]/50 transition-all group"
              >
                <div
                  onClick={() => {
                    playSelectSound();
                    onSelectProject(p);
                    onClose();
                  }}
                  className="flex-1 cursor-pointer space-y-1"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono text-[#00F0FF] bg-[#00F0FF]/10 px-1.5 py-0.5 rounded border border-[#00F0FF]/30">
                      {p.fabric.toUpperCase()}
                    </span>
                    <span className="text-[9px] font-mono text-[#FF007A]">
                      {p.estimatedTime}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white group-hover:text-[#00F0FF] transition-colors">
                    {p.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 line-clamp-1">
                    {p.tagline}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      playSelectSound();
                      onSelectProject(p);
                      onClose();
                    }}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#00F0FF] hover:bg-[#00F0FF]/20"
                    title="Load Pattern"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      playSelectSound();
                      onRemoveProject(p.id);
                    }}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:text-red-400 hover:border-red-500/40"
                    title="Delete Pattern"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
