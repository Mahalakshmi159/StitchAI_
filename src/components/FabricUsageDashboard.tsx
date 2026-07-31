import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  Legend
} from 'recharts';
import { Layers, Activity, TrendingUp, Award, Filter } from 'lucide-react';
import { playSelectSound } from '../utils/audioSynth';

export interface FabricUsageData {
  fabric: string;
  usageCount: number;
  sustainabilityScore: number;
  avgDifficulty: number; // 1-3
  color: string;
}

const INITIAL_FABRIC_USAGE: FabricUsageData[] = [
  { fabric: 'Techwear Nylon', usageCount: 54, sustainabilityScore: 72, avgDifficulty: 2.4, color: '#00F0FF' },
  { fabric: 'Selvedge Denim', usageCount: 42, sustainabilityScore: 92, avgDifficulty: 2.1, color: '#FF007A' },
  { fabric: 'Smart E-Textile', usageCount: 38, sustainabilityScore: 78, avgDifficulty: 2.8, color: '#10B981' },
  { fabric: 'Organic Cotton', usageCount: 29, sustainabilityScore: 96, avgDifficulty: 1.4, color: '#F59E0B' },
  { fabric: 'Heavy Canvas', usageCount: 22, sustainabilityScore: 85, avgDifficulty: 1.8, color: '#8B5CF6' },
  { fabric: 'Mulberry Silk', usageCount: 16, sustainabilityScore: 90, avgDifficulty: 2.6, color: '#EC4899' },
];

export const FabricUsageDashboard: React.FC = () => {
  const [data, setData] = useState<FabricUsageData[]>(INITIAL_FABRIC_USAGE);
  const [sortBy, setSortBy] = useState<'usageCount' | 'sustainabilityScore'>('usageCount');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const sortedData = [...data].sort((a, b) => b[sortBy] - a[sortBy]);

  const totalGenerations = data.reduce((acc, curr) => acc + curr.usageCount, 0);
  const topFabric = sortedData[0];

  const handleSortChange = (newSort: 'usageCount' | 'sustainabilityScore') => {
    playSelectSound();
    setSortBy(newSort);
  };

  return (
    <div className="bg-gradient-to-br from-[#0D111A] via-[#090C12] to-black border border-white/10 rounded-2xl p-4 space-y-3.5 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF]">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-wide">
              Fabric Usage Analytics Dashboard
            </h3>
            <p className="text-[10px] text-slate-400">
              Frequency of fabric selections in AI pattern generations
            </p>
          </div>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10 text-[10px] font-mono">
          <button
            onClick={() => handleSortChange('usageCount')}
            className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
              sortBy === 'usageCount'
                ? 'bg-[#00F0FF]/20 text-[#00F0FF] font-bold border border-[#00F0FF]/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3 h-3" /> Usage
          </button>
          <button
            onClick={() => handleSortChange('sustainabilityScore')}
            className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
              sortBy === 'sustainabilityScore'
                ? 'bg-[#FF007A]/20 text-[#FF007A] font-bold border border-[#FF007A]/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3 h-3" /> Eco Index
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-black/50 border border-white/10 rounded-xl p-2.5 flex flex-col justify-between">
          <span className="text-[9px] font-mono text-slate-400 uppercase">Total Patterns</span>
          <span className="text-base font-bold font-mono text-[#00F0FF]">{totalGenerations}</span>
          <span className="text-[9px] text-slate-500">Across all fabrics</span>
        </div>

        <div className="bg-black/50 border border-white/10 rounded-xl p-2.5 flex flex-col justify-between">
          <span className="text-[9px] font-mono text-slate-400 uppercase">Most Popular</span>
          <span className="text-xs font-bold text-white truncate">{topFabric.fabric}</span>
          <span className="text-[9px] text-[#00F0FF] font-mono">{topFabric.usageCount} projects</span>
        </div>

        <div className="bg-black/50 border border-white/10 rounded-xl p-2.5 flex flex-col justify-between">
          <span className="text-[9px] font-mono text-slate-400 uppercase">Avg Sustainability</span>
          <span className="text-base font-bold font-mono text-emerald-400">
            {Math.round(
              data.reduce((acc, d) => acc + d.sustainabilityScore, 0) / data.length
            )}%
          </span>
          <span className="text-[9px] text-slate-500">Global Eco Grade</span>
        </div>
      </div>

      {/* Recharts Bar Chart Container */}
      <div className="w-full h-52 bg-black/40 border border-white/10 rounded-xl p-2 pt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
            onMouseMove={(state) => {
              if (state && state.activeTooltipIndex !== undefined) {
                setActiveIndex(state.activeTooltipIndex);
              } else {
                setActiveIndex(null);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis
              dataKey="fabric"
              tick={{ fill: '#94A3B8', fontSize: 9, fontFamily: 'monospace' }}
              interval={0}
              angle={-20}
              textAnchor="end"
              stroke="rgba(255,255,255,0.2)"
            />
            <YAxis
              tick={{ fill: '#94A3B8', fontSize: 9, fontFamily: 'monospace' }}
              stroke="rgba(255,255,255,0.2)"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item: FabricUsageData = payload[0].payload;
                  return (
                    <div className="bg-slate-900/95 border border-white/20 rounded-xl p-2.5 text-xs text-white font-mono shadow-2xl backdrop-blur-md">
                      <div className="font-bold border-b border-white/10 pb-1 mb-1" style={{ color: item.color }}>
                        {item.fabric}
                      </div>
                      <div className="space-y-0.5 text-[11px]">
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-400">Generations:</span>
                          <span className="font-bold text-[#00F0FF]">{item.usageCount}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-400">Eco Score:</span>
                          <span className="font-bold text-emerald-400">{item.sustainabilityScore}%</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-400">Complexity:</span>
                          <span className="font-bold text-amber-400">{item.avgDifficulty}/3</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey={sortBy}
              radius={[6, 6, 0, 0]}
              animationDuration={1000}
            >
              {sortedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  fillOpacity={activeIndex === index ? 1 : 0.75}
                  stroke={entry.color}
                  strokeWidth={activeIndex === index ? 2 : 1}
                  className="transition-all duration-200 cursor-pointer"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recharts Legend / Bar list */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1 text-[10px] font-mono border-t border-white/10">
        {data.map((item) => (
          <div
            key={item.fabric}
            className="flex items-center justify-between bg-black/30 px-2 py-1 rounded border border-white/5"
          >
            <div className="flex items-center gap-1.5 truncate">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-300 truncate">{item.fabric}</span>
            </div>
            <span className="font-bold text-white pl-1">{item.usageCount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
