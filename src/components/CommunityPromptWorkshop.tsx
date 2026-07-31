import React, { useState } from 'react';
import { ProjectData, CommunityPreset } from '../types';
import { PRESET_PROJECTS, generateDynamicProject } from '../data/presetProjects';
import { Sparkles, Send, Download, Heart, Zap, Tag, ArrowUpRight, Cpu, ShieldCheck } from 'lucide-react';
import { playSelectSound, playSuccessChime } from '../utils/audioSynth';
import { D3FabricRadarChart } from './D3FabricRadarChart';
import { TrendAlertSection } from './TrendAlertSection';
import { FabricUsageDashboard } from './FabricUsageDashboard';

interface CommunityPromptWorkshopProps {
  onLoadProject: (project: ProjectData) => void;
}

interface FabricMetric {
  fabric: string;
  popularity: number;
  sustainability: number;
}

const FABRIC_ANALYTICS_DATA: FabricMetric[] = [
  { fabric: 'Selvedge Denim', popularity: 88, sustainability: 92 },
  { fabric: 'Techwear Nylon', popularity: 95, sustainability: 72 },
  { fabric: 'Smart E-Textile', popularity: 90, sustainability: 78 },
  { fabric: 'Organic Cotton', popularity: 75, sustainability: 96 },
  { fabric: 'Mulberry Silk', popularity: 68, sustainability: 90 },
];

const COMMUNITY_PRESETS: CommunityPreset[] = [
  {
    id: 'preset-cyber-trench',
    title: 'Solar-Fiber Kinetic Trench Coat',
    author: 'Aria_Weaver',
    downloads: 1420,
    likes: 389,
    tags: ['#ETextile', '#SolarFiber', '#Cyberpunk'],
    project: {
      ...PRESET_PROJECTS['denim-upcycling-intermediate'],
      id: 'comm-trench-01',
      title: 'Solar-Fiber Kinetic Trench Coat',
      tagline: 'High-visibility solar fiber piping with articulated weather hood.',
      fabric: 'smart_textile',
      craftStyle: 'embroidery',
      garmentType: 'jacket',
      materials: [
        '2.2m Solar Reactive Nylon',
        '40m Fiber Optic Luminous Thread',
        'Micro Lithium Battery Pocket',
        'Waterproof Aquaguard Zippers'
      ],
      description: 'An futuristic outer coat featuring embedded photovoltaic stitch arrays and reactive thermal baffles.'
    }
  },
  {
    id: 'preset-upcycled-kimono',
    title: 'Zero-Waste Sashiko Kimono Jacket',
    author: 'Kenji_Craft',
    downloads: 980,
    likes: 275,
    tags: ['#ZeroWaste', '#Sashiko', '#Upcycling'],
    project: {
      ...PRESET_PROJECTS['denim-upcycling-intermediate'],
      id: 'comm-kimono-02',
      title: 'Zero-Waste Sashiko Kimono Jacket',
      tagline: 'Precision 100% fabric yield using vintage indigo denim offcuts.',
      fabric: 'denim',
      craftStyle: 'upcycling',
      garmentType: 'kimono',
      materials: [
        'Reclaimed Indigo Denim Scraps',
        'White Sashiko Cotton Thread',
        'Horn Button Fasteners',
        'Linen Interfacing'
      ],
      description: 'A traditional yet modern unstructured kimono engineered for absolute zero fabric waste.'
    }
  },
  {
    id: 'preset-[#00F0FF]-vest',
    title: 'Tactical Modular Utility Vest',
    author: 'Vortex_Lab',
    downloads: 2150,
    likes: 512,
    tags: ['#Techwear', '#Modular', '#Utility'],
    project: {
      ...PRESET_PROJECTS['denim-upcycling-intermediate'],
      id: 'comm-vest-03',
      title: 'Tactical Modular Utility Vest',
      tagline: 'MOLLE-compatible webbing with removable magnetic quick-release pockets.',
      fabric: 'techwear',
      craftStyle: 'patchwork',
      garmentType: 'vest',
      materials: [
        '1.2m 1000D Cordura Nylon',
        'Heavy-Duty Nylon Webbing',
        'Fidlock Magnetic Buckles',
        'Velcro Loop Patches'
      ],
      description: 'A rugged urban utility vest featuring modular attachment points and neon cyan reinforced bar-tack stitches.'
    }
  }
];

const PROMPT_SUGGESTIONS = [
  '⚡ Luminescent cyber parka with LED circuit sleeves',
  '🌱 Organic hemp chore jacket with botanical embroidery',
  '🎒 Waterproof rolltop tote bag with Fidlock magnetic clips',
  '👘 Upcycled selvedge denim kimono with neon sashiko stitches'
];

export const CommunityPromptWorkshop: React.FC<CommunityPromptWorkshopProps> = ({
  onLoadProject
}) => {
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [likesMap, setLikesMap] = useState<Record<string, number>>({
    'preset-cyber-trench': 389,
    'preset-upcycled-kimono': 275,
    'preset-[#00F0FF]-vest': 512
  });
  const [userLiked, setUserLiked] = useState<Record<string, boolean>>({});

  const handleSynthesizePrompt = async () => {
    if (!customPrompt.trim()) return;

    setIsSynthesizing(true);
    playSelectSound();

    try {
      // Call server API route
      const response = await fetch('/api/generate-pattern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: customPrompt,
          difficulty: 'intermediate',
          fabric: 'techwear',
          craftStyle: 'embroidery',
          garmentType: 'jacket'
        })
      });

      const data = await response.json();

      if (data.success && data.project) {
        const generated = generateDynamicProject('intermediate', 2, 'techwear', 'embroidery');
        const mergedProject: ProjectData = {
          ...generated,
          title: data.project.title || customPrompt,
          tagline: data.project.tagline || 'Custom AI-generated pattern spec sheet.',
          description: data.project.description || customPrompt,
          materials: data.project.materials || generated.materials,
          steps: data.project.steps || generated.steps
        };

        playSuccessChime();
        onLoadProject(mergedProject);
      } else {
        // Fallback procedural project
        const fallbackProject = generateDynamicProject('intermediate', 2, 'smart_textile', 'embroidery');
        fallbackProject.title = `Custom: ${customPrompt.slice(0, 28)}`;
        fallbackProject.description = `AI pattern synthesized from prompt: "${customPrompt}"`;
        
        playSuccessChime();
        onLoadProject(fallbackProject);
      }
    } catch (err) {
      console.warn('Using client-side dynamic synthesis engine:', err);
      const fallbackProject = generateDynamicProject('intermediate', 2, 'smart_textile', 'embroidery');
      fallbackProject.title = `AI Spec: ${customPrompt.slice(0, 24)}`;
      fallbackProject.description = `Synthesized pattern from user request: "${customPrompt}"`;
      
      playSuccessChime();
      onLoadProject(fallbackProject);
    } finally {
      setIsSynthesizing(false);
      setCustomPrompt('');
    }
  };

  const handleToggleLike = (presetId: string) => {
    playSelectSound();
    const liked = !!userLiked[presetId];
    setUserLiked((prev) => ({ ...prev, [presetId]: !liked }));
    setLikesMap((prev) => ({
      ...prev,
      [presetId]: liked ? prev[presetId] - 1 : prev[presetId] + 1
    }));
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* AI Custom Prompt Workshop Card */}
      <div className="bg-gradient-to-br from-[#0F141F] via-[#0D1017] to-black border border-[#00F0FF]/30 rounded-2xl p-3.5 space-y-3 shadow-[0_0_30px_rgba(0,240,255,0.15)] relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <Cpu className="w-4 h-4 text-[#00F0FF]" /> AI Custom Prompt Studio
          </div>
          <span className="text-[10px] font-mono text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-0.5 rounded border border-[#00F0FF]/30">
            GEMINI 3.6 FLASH
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-normal">
          Describe any concept, garment idea, or smart textile requirement. Our neural engine will generate custom pattern dimensions &amp; cut steps:
        </p>

        {/* Prompt Input Box */}
        <div className="relative">
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="e.g. Cyberpunk trench coat with fiber-optic solar panels and neon pink topstitching..."
            rows={2}
            className="w-full bg-black/80 border border-white/20 rounded-xl p-3 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F0FF] transition-all resize-none"
          />

          <button
            onClick={handleSynthesizePrompt}
            disabled={isSynthesizing || !customPrompt.trim()}
            className="absolute bottom-2.5 right-2.5 p-2 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#FF007A] text-black hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 transition-all shadow-[0_0_12px_rgba(0,240,255,0.4)]"
            title="Generate AI Pattern"
          >
            {isSynthesizing ? (
              <Sparkles className="w-4 h-4 animate-spin text-black" />
            ) : (
              <Send className="w-4 h-4 text-black" />
            )}
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div>
          <span className="text-[10px] font-mono text-slate-400 block mb-1.5">PROMPT INSPIRATION:</span>
          <div className="flex flex-col gap-1.5">
            {PROMPT_SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  playSelectSound();
                  setCustomPrompt(s.replace(/^[^\s]+\s/, ''));
                }}
                className="text-left text-[11px] text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00F0FF] rounded-lg px-2.5 py-1.5 transition-all truncate"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TREND ALERT SECTION WITH SEARCH GROUNDING */}
      <TrendAlertSection onSelectTrendPrompt={(promptText) => setCustomPrompt(promptText)} />

      {/* RECHARTS FABRIC USAGE DASHBOARD */}
      <FabricUsageDashboard />

      {/* D3.JS FABRIC POPULARITY & SUSTAINABILITY RADAR CHART */}
      <D3FabricRadarChart />

      {/* COMMUNITY DESIGN GALLERY */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200">
            Community Pattern Showcase
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            {COMMUNITY_PRESETS.length} Curated Specs
          </span>
        </div>

        <div className="space-y-3">
          {COMMUNITY_PRESETS.map((item) => {
            const isLiked = !!userLiked[item.id];
            const currentLikes = likesMap[item.id] || item.likes;

            return (
              <div
                key={item.id}
                className="bg-black/40 border border-white/10 rounded-2xl p-3.5 space-y-2.5 hover:border-white/30 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      By @{item.author}
                    </span>
                  </div>

                  {/* Likes button */}
                  <button
                    onClick={() => handleToggleLike(item.id)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full border text-[11px] font-mono transition-all ${
                      isLiked
                        ? 'bg-[#FF007A]/20 border-[#FF007A] text-[#FF007A]'
                        : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-3 h-3 ${isLiked ? 'fill-[#FF007A]' : ''}`} />
                    <span>{currentLikes}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-snug">
                  {item.project.tagline}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-mono text-cyan-300 bg-[#00F0FF]/10 px-2 py-0.5 rounded border border-[#00F0FF]/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer action button */}
                <button
                  onClick={() => {
                    playSelectSound();
                    playSuccessChime();
                    onLoadProject(item.project);
                  }}
                  className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 hover:text-[#00F0FF] hover:border-[#00F0FF]/50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#00F0FF]" /> Remix &amp; Load Spec into Studio
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
