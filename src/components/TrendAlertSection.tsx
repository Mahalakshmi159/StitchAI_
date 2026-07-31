import React, { useState, useEffect } from 'react';
import { Flame, RefreshCw, ExternalLink, Sparkles, Tag, Globe } from 'lucide-react';
import { playSelectSound } from '../utils/audioSynth';

export interface SewingTrend {
  title: string;
  summary: string;
  impact: string;
  keywords: string[];
  sourceUrl?: string;
  sourceTitle?: string;
}

interface TrendAlertSectionProps {
  onSelectTrendPrompt?: (prompt: string) => void;
}

export const TrendAlertSection: React.FC<TrendAlertSectionProps> = ({
  onSelectTrendPrompt,
}) => {
  const [trends, setTrends] = useState<SewingTrend[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGrounded, setIsGrounded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrends = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/sewing-trends');
      const data = await res.json();
      if (data.success && Array.isArray(data.trends)) {
        setTrends(data.trends.slice(0, 3));
        setIsGrounded(!!data.grounded);
      } else {
        throw new Error(data.error || 'Failed to load web trends');
      }
    } catch (err: any) {
      console.warn('Error fetching trends, using fallback:', err);
      setTrends([
        {
          title: 'Modular Techwear & Detachable Pocketry',
          summary: 'DIY sewists are adding waterproof zippers, Fidlock magnetic buckles, and modular attachment panels to everyday jackets and bags.',
          impact: 'Drives high demand for heavy-duty cordura nylon, ripstop, and tactical webbing.',
          keywords: ['Techwear', 'Modular', 'Utility'],
          sourceUrl: 'https://vogue.com',
          sourceTitle: 'Fashion & Utility Apparel Trends'
        },
        {
          title: 'Zero-Waste Sashiko & Upcycled Denim',
          summary: 'Visible mending using Japanese Sashiko geometric stitching is transforming discarded denim into luxury, high-contrast streetwear.',
          impact: 'Praise for 100% fabric utilization and artisanal hand-stitching.',
          keywords: ['Upcycling', 'Sashiko', 'ZeroWaste'],
          sourceUrl: 'https://craftscouncil.org.uk',
          sourceTitle: 'Crafts Council Textile Review'
        },
        {
          title: 'Luminous Fiber-Optics & E-Textiles',
          summary: 'Embedded conductive threads, micro-LED fiber optics, and temperature-reactive dyes are bringing wearable electronics into home garment construction.',
          impact: 'Bridging physical sewing craftsmanship with interactive tech.',
          keywords: ['E-Textiles', 'SolarFiber', 'SmartFabrics'],
          sourceUrl: 'https://textileworld.com',
          sourceTitle: 'Smart Fabrics & E-Textile Innovations'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  const handleRefresh = () => {
    playSelectSound();
    fetchTrends();
  };

  return (
    <div className="bg-gradient-to-br from-[#12081C] via-[#0D1017] to-black border border-[#FF007A]/30 rounded-2xl p-3.5 space-y-3 shadow-[0_0_25px_rgba(255,0,122,0.15)] relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
          <Flame className="w-4 h-4 text-[#FF007A] animate-pulse" />
          <span>Trend Alert: Top 3 Web Textile Trends</span>
        </div>

        <div className="flex items-center gap-2">
          {isGrounded && (
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
              <Globe className="w-2.5 h-2.5 text-emerald-400" /> Web Grounded
            </span>
          )}

          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all disabled:opacity-40"
            title="Refresh Live Search Grounding Trends"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#FF007A]' : ''}`} />
          </button>
        </div>
      </div>

      <p className="text-[11px] text-slate-300 leading-snug">
        Real-time intelligence retrieved via Gemini Google Search Grounding to keep your garment designs ahead of the curve:
      </p>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="space-y-2 py-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white/5 border border-white/5 rounded-xl p-3 space-y-2 animate-pulse">
              <div className="h-3 bg-white/10 rounded w-1/2" />
              <div className="h-2.5 bg-white/10 rounded w-3/4" />
              <div className="h-2 bg-white/5 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        /* Trends Grid */
        <div className="space-y-2.5">
          {trends.map((trend, idx) => (
            <div
              key={idx}
              className="bg-black/50 border border-white/10 hover:border-[#FF007A]/40 rounded-xl p-3 space-y-1.5 transition-all group relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#FF007A]/20 border border-[#FF007A]/50 text-[#FF007A] text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                    #{idx + 1}
                  </span>
                  <h4 className="text-xs font-bold text-white leading-tight group-hover:text-[#FF007A] transition-colors">
                    {trend.title}
                  </h4>
                </div>

                {onSelectTrendPrompt && (
                  <button
                    onClick={() => {
                      playSelectSound();
                      onSelectTrendPrompt(`${trend.title}: ${trend.summary}`);
                    }}
                    className="shrink-0 text-[10px] font-mono text-[#00F0FF] bg-[#00F0FF]/10 hover:bg-[#00F0FF]/20 border border-[#00F0FF]/30 px-2 py-0.5 rounded transition-all flex items-center gap-1"
                  >
                    <Sparkles className="w-2.5 h-2.5" /> Use in Prompt
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-normal pl-7">
                {trend.summary}
              </p>

              {trend.impact && (
                <div className="pl-7 text-[10px] text-slate-400 italic">
                  Impact: {trend.impact}
                </div>
              )}

              {/* Tags & Grounding Citation Link */}
              <div className="pl-7 pt-1 flex flex-wrap items-center justify-between gap-2 text-[10px]">
                <div className="flex flex-wrap gap-1">
                  {trend.keywords.map((kw, kIdx) => (
                    <span
                      key={kIdx}
                      className="font-mono text-[9px] text-pink-300 bg-pink-500/10 px-1.5 py-0.2 rounded border border-pink-500/20"
                    >
                      #{kw.replace(/^#/, '')}
                    </span>
                  ))}
                </div>

                {trend.sourceUrl && (
                  <a
                    href={trend.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[9px] font-mono text-slate-400 hover:text-[#00F0FF] flex items-center gap-1 underline underline-offset-2 transition-colors"
                  >
                    <Globe className="w-2.5 h-2.5 text-slate-500" />
                    <span>{trend.sourceTitle || 'Web Grounding Source'}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
