import React, { useState } from 'react';
import { DifficultyLevel, FabricType, CraftStyle, ProjectData } from './types';
import { INITIAL_PROJECT, PRESET_PROJECTS, generateDynamicProject } from './data/presetProjects';
import { MobileFrame } from './components/MobileFrame';
import { Header } from './components/Header';
import { IdeaGenerator } from './components/IdeaGenerator';
import { ResultPreviewCard } from './components/ResultPreviewCard';
import { PatternInstructionsModal } from './components/PatternInstructionsModal';
import { SavedProjectsDrawer } from './components/SavedProjectsDrawer';
import { playSuccessChime, playSelectSound, isAudioEnabled } from './utils/audioSynth';
import { Sparkles, Bookmark, Zap } from 'lucide-react';

export default function App() {
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
    }, 450);
  };

  const handleReset = () => {
    setDifficultyValue(2);
    setFabric('techwear');
    setCraftStyle('embroidery');
    setCurrentProject(INITIAL_PROJECT);
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

      {/* Quick Preset Shortcuts Bar */}
      <div className="w-full flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 no-scrollbar text-xs">
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
        onSelectProject={(proj) => setCurrentProject(proj)}
        onRemoveProject={handleRemoveSaved}
      />
    </MobileFrame>
  );
}
