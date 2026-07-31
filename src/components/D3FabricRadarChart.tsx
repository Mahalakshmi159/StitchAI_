import React, { useState, useMemo } from 'react';
import * as d3 from 'd3';
import { Leaf, BarChart2, Info } from 'lucide-react';

export interface FabricDataPoint {
  fabric: string;
  popularity: number;
  sustainability: number;
}

const DEFAULT_FABRIC_DATA: FabricDataPoint[] = [
  { fabric: 'Selvedge Denim', popularity: 88, sustainability: 92 },
  { fabric: 'Techwear Nylon', popularity: 95, sustainability: 72 },
  { fabric: 'Smart E-Textile', popularity: 90, sustainability: 78 },
  { fabric: 'Organic Cotton', popularity: 75, sustainability: 96 },
  { fabric: 'Mulberry Silk', popularity: 68, sustainability: 90 },
];

interface D3FabricRadarChartProps {
  data?: FabricDataPoint[];
}

export const D3FabricRadarChart: React.FC<D3FabricRadarChartProps> = ({
  data = DEFAULT_FABRIC_DATA,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{
    fabric: string;
    popularity: number;
    sustainability: number;
    x: number;
    y: number;
  } | null>(null);

  const [activeMetric, setActiveMetric] = useState<'both' | 'popularity' | 'sustainability'>('both');

  const width = 320;
  const height = 240;
  const margin = 40;
  const radius = Math.min(width, height) / 2 - margin;
  const centerX = width / 2;
  const centerY = height / 2;

  const numAxes = data.length;
  const angleSlice = (Math.PI * 2) / numAxes;

  // D3 Scale for radar radius
  const rScale = useMemo(() => {
    return d3.scaleLinear().domain([0, 100]).range([0, radius]);
  }, [radius]);

  // Generate web concentric polygon points using D3
  const levels = [20, 40, 60, 80, 100];

  // Calculate polygon paths using D3 lineRadial
  const radarLine = useMemo(() => {
    return d3
      .lineRadial<number>()
      .radius((d) => rScale(d))
      .angle((_, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);
  }, [rScale, angleSlice]);

  const popularityPath = useMemo(() => {
    const values = data.map((d) => d.popularity);
    return radarLine(values) || '';
  }, [data, radarLine]);

  const sustainabilityPath = useMemo(() => {
    const values = data.map((d) => d.sustainability);
    return radarLine(values) || '';
  }, [data, radarLine]);

  // Calculate points for interactive dots & hover triggers
  const popularityDots = useMemo(() => {
    return data.map((d, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      const r = rScale(d.popularity);
      return {
        fabric: d.fabric,
        popularity: d.popularity,
        sustainability: d.sustainability,
        x: centerX + r * Math.cos(angle),
        y: centerY + r * Math.sin(angle),
      };
    });
  }, [data, angleSlice, rScale, centerX, centerY]);

  const sustainabilityDots = useMemo(() => {
    return data.map((d, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      const r = rScale(d.sustainability);
      return {
        fabric: d.fabric,
        popularity: d.popularity,
        sustainability: d.sustainability,
        x: centerX + r * Math.cos(angle),
        y: centerY + r * Math.sin(angle),
      };
    });
  }, [data, angleSlice, rScale, centerX, centerY]);

  return (
    <div className="bg-black/60 border border-white/10 rounded-2xl p-3.5 space-y-2 shadow-lg relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
          <BarChart2 className="w-4 h-4 text-[#00F0FF]" />
          D3.js Fabric Popularity &amp; Sustainability Radar
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
          <Leaf className="w-3 h-3" /> Eco Index
        </span>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span>Community generation metrics rendered via D3 math scales:</span>
        <div className="flex gap-1">
          <button
            onClick={() => setActiveMetric('both')}
            className={`px-1.5 py-0.5 text-[9px] rounded font-mono transition-all ${
              activeMetric === 'both' ? 'bg-white/20 text-white font-bold' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            ALL
          </button>
          <button
            onClick={() => setActiveMetric('popularity')}
            className={`px-1.5 py-0.5 text-[9px] rounded font-mono transition-all ${
              activeMetric === 'popularity' ? 'bg-[#00F0FF]/30 text-[#00F0FF] font-bold' : 'text-slate-500 hover:text-[#00F0FF]'
            }`}
          >
            DEMAND
          </button>
          <button
            onClick={() => setActiveMetric('sustainability')}
            className={`px-1.5 py-0.5 text-[9px] rounded font-mono transition-all ${
              activeMetric === 'sustainability' ? 'bg-[#FF007A]/30 text-[#FF007A] font-bold' : 'text-slate-500 hover:text-[#FF007A]'
            }`}
          >
            ECO
          </button>
        </div>
      </div>

      {/* SVG Container */}
      <div className="relative w-full flex justify-center items-center my-1">
        <svg width={width} height={height} className="overflow-visible select-none">
          <defs>
            {/* Glow Filters */}
            <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="pinkGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <g transform={`translate(${centerX}, ${centerY})`}>
            {/* Concentric Grid Web Circles / Polygons */}
            {levels.map((level) => {
              const levelRadius = rScale(level);
              const gridPoints = data.map((_, i) => {
                const angle = i * angleSlice - Math.PI / 2;
                return `${levelRadius * Math.cos(angle)},${levelRadius * Math.sin(angle)}`;
              });

              return (
                <g key={level}>
                  <polygon
                    points={gridPoints.join(' ')}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.12)"
                    strokeWidth="1"
                    strokeDasharray={level < 100 ? '2,2' : undefined}
                  />
                  {/* Axis scale value text */}
                  <text
                    x={0}
                    y={-levelRadius + 3}
                    fill="rgba(255, 255, 255, 0.3)"
                    fontSize="7"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {level}
                  </text>
                </g>
              );
            })}

            {/* Radial Axis Lines */}
            {data.map((_, i) => {
              const angle = i * angleSlice - Math.PI / 2;
              const lineX = radius * Math.cos(angle);
              const lineY = radius * Math.sin(angle);

              return (
                <line
                  key={i}
                  x1={0}
                  y1={0}
                  x2={lineX}
                  y2={lineY}
                  stroke="rgba(255, 255, 255, 0.15)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Fabric Name Labels */}
            {data.map((d, i) => {
              const angle = i * angleSlice - Math.PI / 2;
              const labelRadius = radius + 18;
              const labelX = labelRadius * Math.cos(angle);
              const labelY = labelRadius * Math.sin(angle);

              let textAnchor: 'start' | 'middle' | 'end' = 'middle';
              if (Math.abs(labelX) > 10) {
                textAnchor = labelX > 0 ? 'start' : 'end';
              }

              return (
                <text
                  key={i}
                  x={labelX}
                  y={labelY + 3}
                  fill="#94A3B8"
                  fontSize="8"
                  fontWeight="bold"
                  fontFamily="monospace"
                  textAnchor={textAnchor}
                >
                  {d.fabric.replace('Selvedge ', '').replace('Organic ', '').replace('Mulberry ', '')}
                </text>
              );
            })}

            {/* Popularity Radar Area */}
            {(activeMetric === 'both' || activeMetric === 'popularity') && (
              <path
                d={popularityPath}
                fill="#00F0FF"
                fillOpacity="0.25"
                stroke="#00F0FF"
                strokeWidth="2"
                filter="url(#cyanGlow)"
                className="transition-all duration-300"
              />
            )}

            {/* Sustainability Radar Area */}
            {(activeMetric === 'both' || activeMetric === 'sustainability') && (
              <path
                d={sustainabilityPath}
                fill="#FF007A"
                fillOpacity="0.25"
                stroke="#FF007A"
                strokeWidth="2"
                filter="url(#pinkGlow)"
                className="transition-all duration-300"
              />
            )}
          </g>

          {/* Interactive Vertex Dots */}
          {(activeMetric === 'both' || activeMetric === 'popularity') &&
            popularityDots.map((pt, i) => (
              <circle
                key={`pop-${i}`}
                cx={pt.x}
                cy={pt.y}
                r={hoveredPoint?.fabric === pt.fabric ? 6 : 4}
                fill="#00F0FF"
                stroke="#ffffff"
                strokeWidth="1.5"
                className="cursor-pointer transition-all hover:scale-125"
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            ))}

          {(activeMetric === 'both' || activeMetric === 'sustainability') &&
            sustainabilityDots.map((pt, i) => (
              <circle
                key={`sust-${i}`}
                cx={pt.x}
                cy={pt.y}
                r={hoveredPoint?.fabric === pt.fabric ? 6 : 4}
                fill="#FF007A"
                stroke="#ffffff"
                strokeWidth="1.5"
                className="cursor-pointer transition-all hover:scale-125"
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            ))}
        </svg>

        {/* Hover Tooltip Popup */}
        {hoveredPoint && (
          <div
            className="absolute z-20 pointer-events-none bg-slate-900/95 border border-white/20 rounded-xl p-2 text-[10px] font-mono text-white shadow-2xl backdrop-blur-md animate-in fade-in duration-150"
            style={{
              left: `${Math.min(Math.max(hoveredPoint.x - 50, 10), width - 110)}px`,
              top: `${Math.max(hoveredPoint.y - 45, 10)}px`,
            }}
          >
            <div className="font-bold text-[#00F0FF] mb-0.5">{hoveredPoint.fabric}</div>
            <div className="flex justify-between gap-3 text-slate-300">
              <span>Popularity:</span>
              <span className="font-bold text-[#00F0FF]">{hoveredPoint.popularity}%</span>
            </div>
            <div className="flex justify-between gap-3 text-slate-300">
              <span>Sustainability:</span>
              <span className="font-bold text-[#FF007A]">{hoveredPoint.sustainability}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Chart Legend Badges */}
      <div className="flex items-center justify-between text-[10px] font-mono pt-1 border-t border-white/10">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[#00F0FF]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] shadow-[0_0_6px_#00F0FF]" /> Demand Score
          </span>
          <span className="flex items-center gap-1.5 text-[#FF007A]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF007A] shadow-[0_0_6px_#FF007A]" /> Eco Index
          </span>
        </div>
        <span className="text-[9px] text-slate-500 flex items-center gap-1">
          <Info className="w-3 h-3 text-slate-400" /> Powered by D3.js
        </span>
      </div>
    </div>
  );
};
