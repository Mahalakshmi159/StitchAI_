import React, { useState } from 'react';
import { DifficultyLevel, FabricType, CraftStyle, ProjectData } from './types';
import { INITIAL_PROJECT, PRESET_PROJECTS, generateDynamicProject } from './data/presetProjects';
import { MobileFrame } from './components/MobileFrame';
import { Header } from './components/Header';
import { IdeaGenerator } from './components/IdeaGenerator';
import { ResultPreviewCard } from './components/ResultPreviewCard';
import { PatternInstructionsModal } from './components/PatternInstructionsModal';
import { SavedProjectsDrawer } from './components/SavedProjectsDrawer';
import { SeamStitchCustomizer } from './components/SeamStitchCustomizer';
import { SewingAssistant } from './components/SewingAssistant';
import { CommunityPromptWorkshop } from './components/CommunityPromptWorkshop';
import { playSuccessChime, playSelectSound, isAudioEnabled } from './utils/audioSynth';
import { Cpu, Scissors, BookOpen, Users, Zap } from 'lucide-react';

type AppViewMode = 'studio' | 'customizer' | 'assistant' | 'community';

export default function App() {
  const [activeView, setActiveView] = useState<AppViewMode>('studio');

  const [difficultyValue, setDifficultyValue] = useState<number>(2); // 1 = Beginner, 2 = Intermediate, 3 = Master
  const [fabric, setFabric] = useState<FabricType>('techwear');
  const [craftStyle, setCraftStyle] = useState<CraftStyle>('embroidery');

  const [currentProject, setCurrentProject] = useState<ProjectData>(INITIAL_PROJECT);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [generationStageText, setGenerationStageText] = useState<string>('');

  const [savedProjects, setSavedProjects] = useState<ProjectData[]>([
    PRESET_PROJECTS['denim-upcycling-intermediate']
  ]);

  const [isPatternModalOpen, setIsPatternModalOpen] = useState<boolean>(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState<boolean>(false);
  const [audioActive, setAudioActive] = useState<boolean>(isAudioEnabled());

  const getDifficultyLevelFromValue = (val: number): DifficultyLevel => {
    if (val === 1) return 'beginner';
    if (val === 3) return 'master';
    return 'intermediate';
  };

  const handleGenerateProject = () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationStageText('Analyzing Fabric Mechanics & Tensile Strength...');

    const stages = [
      { progress: 25, text: 'Analyzing Fabric Mechanics & Tensile Strength...' },
      { progress: 55, text: 'Synthesizing Zero-Waste Vector Pattern...' },
      { progress: 85, text: 'Computing Stitches & Innovation Score...' },
      { progress: 100, text: 'Finalizing Neural Spec Sheet!' }
    ];

    let currentStageIndex = 0;

    const interval = setInterval(() => {
      currentStageIndex++;
      if (currentStageIndex < stages.length) {
        setGenerationProgress(stages[currentStageIndex].progress);
        setGenerationStageText(stages[currentStageIndex].text);
      } else {
        clearInterval(interval);
        
        // Generate new dynamic project
        const diffLevel = getDifficultyLevelFromValue(difficultyValue);
        const newProj = generateDynamicProject(diffLevel, difficultyValue, fabric, craftStyle);
        
        setCurrentProject(newProj);
        setIsGenerating(false);
        playSuccessChime();
      }
    }, 400);
  };

  const handleReset = () => {
    setDifficultyValue(2);
    setFabric('techwear');
    setCraftStyle('embroidery');
    setCurrentProject(INITIAL_PROJECT);
    setActiveView('studio');
  };

  const handleSaveProject = (project: ProjectData) => {
    const exists = savedProjects.some((p) => p.id === project.id);
    if (exists) {
      setSavedProjects(savedProjects.filter((p) => p.id !== project.id));
    } else {
      setSavedProjects([...savedProjects, project]);
    }
  };

  const handleRemoveSaved = (id: string) => {
    setSavedProjects(savedProjects.filter((p) => p.id !== id));
  };

  const isCurrentProjectSaved = savedProjects.some((p) => p.id === currentProject.id);

  const loadPresetShortcut = (presetKey: string) => {
    playSelectSound();
    const preset = PRESET_PROJECTS[presetKey];
    if (preset) {
      setDifficultyValue(preset.difficultyValue);
      setFabric(preset.fabric);
      setCraftStyle(preset.craftStyle);
      setCurrentProject(preset);
      setActiveView('studio');
    }
  };

  return (
    <MobileFrame
      savedCount={savedProjects.length}
      onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
    >
      {/* App Header */}
      <Header
        onReset={handleReset}
        audioActive={audioActive}
        setAudioActive={setAudioActive}
      />

      {/* Main Navigation Tab Bar */}
      <div className="grid grid-cols-4 bg-black/60 border border-white/10 rounded-2xl p-1 mb-3 text-xs font-semibold">
        <button
          onClick={() => {
            playSelectSound();
            setActiveView('studio');
          }}
          className={`py-2 rounded-xl flex flex-col items-center gap-0.5 transition-all ${
            activeView === 'studio'
              ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40 font-bold shadow-[0_0_12px_rgba(0,240,255,0.25)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span className="text-[10px]">Studio</span>
        </button>

        <button
          onClick={() => {
            playSelectSound();
            setActiveView('customizer');
          }}
          className={`py-2 rounded-xl flex flex-col items-center gap-0.5 transition-all ${
            activeView === 'customizer'
              ? 'bg-[#FF007A]/20 text-[#FF007A] border border-[#FF007A]/40 font-bold shadow-[0_0_12px_rgba(255,0,122,0.25)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
          <span className="text-[10px]">Custom</span>
        </button>

        <button
          onClick={() => {
            playSelectSound();
            setActiveView('assistant');
          }}
          className={`py-2 rounded-xl flex flex-col items-center gap-0.5 transition-all ${
            activeView === 'assistant'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold shadow-[0_0_12px_rgba(16,185,129,0.25)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span className="text-[10px]">Guide</span>
        </button>

        <button
          onClick={() => {
            playSelectSound();
            setActiveView('community');
          }}
          className={`py-2 rounded-xl flex flex-col items-center gap-0.5 transition-all ${
            activeView === 'community'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold shadow-[0_0_12px_rgba(245,158,11,0.25)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span className="text-[10px]">AI Studio</span>
        </button>
      </div>

      {/* VIEW 1: STUDIO (MAIN ENGINE) */}
      {activeView === 'studio' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          {/* Quick Preset Shortcuts Bar */}
          <div className="w-full flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-[10px] font-mono text-slate-400 shrink-0 flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#00F0FF]" /> PRESETS:
            </span>

            <button
              onClick={() => loadPresetShortcut('denim-upcycling-intermediate')}
              className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 hover:border-[#00F0FF] text-slate-300 hover:text-[#00F0FF] shrink-0 text-[11px] font-medium transition-all"
            >
              👖 Selvedge Cyber-Denim
            </button>

            <button
              onClick={() => {
                setDifficultyValue(3);
                setFabric('smart_textile');
                setCraftStyle('quilting');
                handleGenerateProject();
              }}
              className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 hover:border-[#FF007A] text-slate-300 hover:text-[#FF007A] shrink-0 text-[11px] font-medium transition-all"
            >
              🌟 E-Textile Armor
            </button>
          </div>

          {/* Main Idea Generator Engine Panel */}
          <IdeaGenerator
            difficulty={getDifficultyLevelFromValue(difficultyValue)}
            difficultyValue={difficultyValue}
            setDifficultyValue={setDifficultyValue}
            fabric={fabric}
            setFabric={setFabric}
            craftStyle={craftStyle}
            setCraftStyle={setCraftStyle}
            onGenerate={handleGenerateProject}
            isGenerating={isGenerating}
            generationProgress={generationProgress}
            generationStageText={generationStageText}
          />

          {/* Result Preview Card */}
          <ResultPreviewCard
            project={currentProject}
            onOpenPatternModal={() => setIsPatternModalOpen(true)}
            onSaveProject={handleSaveProject}
            isSaved={isCurrentProjectSaved}
          />
        </div>
      )}

      {/* VIEW 2: SEAM & STITCH CUSTOMIZER */}
      {activeView === 'customizer' && (
        <SeamStitchCustomizer
          project={currentProject}
          onUpdateProject={(updated) => {
            setCurrentProject(updated);
            setActiveView('studio');
          }}
        />
      )}

      {/* VIEW 3: SEWING ASSISTANT & AUDIO GUIDE */}
      {activeView === 'assistant' && (
        <SewingAssistant project={currentProject} />
      )}

      {/* VIEW 4: COMMUNITY & AI PROMPT WORKSHOP */}
      {activeView === 'community' && (
        <CommunityPromptWorkshop
          onLoadProject={(proj) => {
            setCurrentProject(proj);
            setActiveView('studio');
          }}
        />
      )}

      {/* Interactive Pattern & Instructions Drawer Modal */}
      <PatternInstructionsModal
        isOpen={isPatternModalOpen}
        onClose={() => setIsPatternModalOpen(false)}
        project={currentProject}
      />

      {/* Saved Projects Drawer */}
      <SavedProjectsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedProjects={savedProjects}
        onSelectProject={(proj) => {
          setCurrentProject(proj);
          setActiveView('studio');
        }}
        onRemoveProject={handleRemoveSaved}
      />
    </MobileFrame>
  );
}
