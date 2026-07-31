import React, { useState, useEffect } from 'react';
import { ProjectData, AssemblyStep } from '../types';
import { Volume2, Play, Pause, RotateCcw, CheckCircle2, Circle, Lightbulb, AlertTriangle, HelpCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { playSelectSound, playTickSound, playSuccessChime } from '../utils/audioSynth';

interface SewingAssistantProps {
  project: ProjectData;
}

interface TroubleIssue {
  id: string;
  symptom: string;
  cause: string;
  solution: string;
  quickCheck: string;
}

const TROUBLESHOOTING_MATRIX: TroubleIssue[] = [
  {
    id: 'bird-nest',
    symptom: "Thread Bunching / Bird's Nesting Under Fabric",
    cause: "Upper thread not properly seated in tension discs or needle threaded while presser foot was down.",
    solution: "Raise presser foot completely, re-thread the top thread carefully into tension discs, and ensure bobbin is winding clockwise.",
    quickCheck: "Re-thread top thread with presser foot UP!"
  },
  {
    id: 'needle-break',
    symptom: 'Frequent Needle Deflection or Breakage',
    cause: 'Needle too thin for dense technical/denim fabric, or pulling fabric forcibly from behind machine.',
    solution: 'Switch to a Microtex 90/14 or Jeans 100/16 needle. Allow feed dogs to pull fabric naturally without pushing/pulling.',
    quickCheck: 'Upgrade needle size to 100/16 Denim.'
  },
  {
    id: 'seam-pucker',
    symptom: 'Seam Puckering on Gore-Tex / Silk',
    cause: 'Tension setting too high or stitch length too short for synthetic ripstop or fine fabrics.',
    solution: 'Reduce top thread tension setting to 2.5–3.0, lengthen stitch to 3.0mm, and use tissue paper backing under seam line.',
    quickCheck: 'Lower tension & lengthen stitch to 3.0mm.'
  },
  {
    id: 'skipped-stitches',
    symptom: 'Skipped Stitches on Stretch / E-Textiles',
    cause: 'Standard universal point pushing elastomeric fibers or conductive thread slipping past hook.',
    solution: 'Use a Stretch/Ballpoint 80/12 needle and lower machine speed by 30%. Ensure conductive bobbin is clean.',
    quickCheck: 'Use Stretch/Ballpoint 80/12 needle.'
  }
];

export const SewingAssistant: React.FC<SewingAssistantProps> = ({ project }) => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  // Step Timer / Stopwatch
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Voice speech synthesis
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Troubleshooting drawer toggle
  const [openTroubleId, setOpenTroubleId] = useState<string | null>(null);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const toggleTimer = () => {
    playSelectSound();
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    playSelectSound();
    setIsTimerRunning(false);
    setTimerSeconds(0);
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60).toString().padStart(2, '0');
    const secs = (totalSecs % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const toggleStepCompleted = (stepNum: number) => {
    setCompletedSteps((prev) => {
      const updated = { ...prev, [stepNum]: !prev[stepNum] };
      const count = Object.values(updated).filter(Boolean).length;
      if (count === project.steps.length) {
        playSuccessChime();
      } else {
        playTickSound();
      }
      return updated;
    });
  };

  const handleSpeakStep = (step: AssemblyStep) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      const text = `Step ${step.stepNumber}: ${step.title}. ${step.detail}. Pro Tip: ${step.techniqueTip}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis is not supported on this browser.');
    }
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / project.steps.length) * 100);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Timer & Hands-Free Audio Header Banner */}
      <div className="bg-gradient-to-r from-black/90 via-[#0F141C] to-black/90 border border-white/10 rounded-2xl p-3.5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#FF007A] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> INTERACTIVE SEWING ASSISTANT
          </div>
          <span className="text-xs font-bold text-white block mt-0.5">
            {project.title}
          </span>
        </div>

        {/* Stopwatch Controller */}
        <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-xl border border-white/10">
          <span className="font-mono text-xs font-bold text-[#00F0FF]">
            ⏱️ {formatTimer(timerSeconds)}
          </span>

          <button
            onClick={toggleTimer}
            className={`p-1 rounded-lg transition-colors ${
              isTimerRunning ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}
            title={isTimerRunning ? 'Pause Timer' : 'Start Timer'}
          >
            {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={resetTimer}
            className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Bar Card */}
      <div className="bg-black/40 border border-white/10 rounded-2xl p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-300">Assembly Milestones</span>
          <span className="text-[#00F0FF] font-mono">
            {completedCount} of {project.steps.length} Completed ({progressPercent}%)
          </span>
        </div>

        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-white/10 relative">
          <div
            className="bg-gradient-to-r from-[#00F0FF] via-cyan-400 to-[#FF007A] h-full transition-all duration-300 shadow-[0_0_12px_rgba(0,240,255,0.5)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Assembly Steps List */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-200 block px-1">
          Step-by-Step Construction Guide
        </span>

        {project.steps.map((step, idx) => {
          const isDone = !!completedSteps[step.stepNumber];
          const isActive = activeStepIndex === idx;

          return (
            <div
              key={step.stepNumber}
              className={`p-3.5 rounded-2xl border transition-all ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-300'
                  : isActive
                  ? 'bg-[#0E131D] border-[#00F0FF]/60 shadow-[0_0_20px_rgba(0,240,255,0.15)] text-white'
                  : 'bg-black/40 border-white/10 text-white'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleStepCompleted(step.stepNumber)}
                    className="text-emerald-400 shrink-0"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 fill-emerald-400/20 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 hover:text-white" />
                    )}
                  </button>

                  <span className="text-[10px] font-mono font-bold text-[#FF007A] bg-[#FF007A]/10 px-2 py-0.5 rounded border border-[#FF007A]/30">
                    STEP {step.stepNumber}
                  </span>

                  <h4 className={`text-xs font-bold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                    {step.title}
                  </h4>
                </div>

                {/* Hands-free Voice Reader Button */}
                <button
                  onClick={() => handleSpeakStep(step)}
                  className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                    isSpeaking
                      ? 'bg-[#00F0FF] text-black border-[#00F0FF] font-bold animate-pulse'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:text-[#00F0FF] hover:border-[#00F0FF]/50'
                  }`}
                  title="Audio Voice Guide"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono hidden sm:inline">Voice</span>
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pl-7">
                {step.detail}
              </p>

              {step.techniqueTip && (
                <div className="mt-2.5 ml-7 bg-white/5 border border-white/10 rounded-xl p-2.5 text-[11px] text-cyan-300 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-[#00F0FF] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#00F0FF] block mb-0.5">Craft Tip:</strong>
                    <span>{step.techniqueTip}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* SEWING TROUBLESHOOTING MATRIX */}
      <div className="bg-black/40 border border-white/10 rounded-2xl p-3.5 space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Machine &amp; Stitch Troubleshooting Matrix</span>
        </div>

        <p className="text-[11px] text-slate-400 leading-normal">
          Facing tension glitches or thread snags? Select your machine symptom for instant diagnosis:
        </p>

        <div className="space-y-2">
          {TROUBLESHOOTING_MATRIX.map((item) => {
            const isOpen = openTroubleId === item.id;
            return (
              <div
                key={item.id}
                className="bg-black/60 border border-white/10 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => {
                    playSelectSound();
                    setOpenTroubleId(isOpen ? null : item.id);
                  }}
                  className="w-full p-2.5 text-left text-xs font-semibold text-slate-200 flex items-center justify-between hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    {item.symptom}
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {isOpen && (
                  <div className="p-3 border-t border-white/10 bg-amber-950/10 text-xs space-y-2 text-slate-300">
                    <div>
                      <strong className="text-amber-400 block text-[10px] font-mono uppercase">Probable Cause:</strong>
                      <p className="text-[11px]">{item.cause}</p>
                    </div>

                    <div>
                      <strong className="text-[#00F0FF] block text-[10px] font-mono uppercase">Master Solution:</strong>
                      <p className="text-[11px]">{item.solution}</p>
                    </div>

                    <div className="bg-black/40 p-2 rounded-lg border border-amber-500/30 text-[10px] font-mono text-amber-300">
                      ⚡ Quick Fix: {item.quickCheck}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
