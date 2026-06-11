"use client";

import { useMemo } from "react";

type DataPoint = { label: string; value: number };

interface ProgressionChartProps {
  data: DataPoint[];
  title?: string;
  color?: string;
  height?: number;
}

export function ProgressionChart({
  data,
  title = "Progression",
  color = "#0071e3",
  height = 160,
}: ProgressionChartProps) {
  const { points, pathD, areaD } = useMemo(() => {
    if (data.length < 2) return { points: [], pathD: "", areaD: "" };

    const W = 560;
    const H = height - 32;
    const padding = { left: 32, right: 16, top: 8, bottom: 24 };
    const innerW = W - padding.left - padding.right;
    const innerH = H - padding.top - padding.bottom;

    const maxVal = Math.max(...data.map((d) => d.value), 100);

    const pts = data.map((d, i) => ({
      x: padding.left + (i / (data.length - 1)) * innerW,
      y: padding.top + innerH - (d.value / maxVal) * innerH,
      value: d.value,
      label: d.label,
    }));

    const smooth = (p: typeof pts) => {
      return p.reduce((acc, pt, i) => {
        if (i === 0) return `M ${pt.x},${pt.y}`;
        const prev = p[i - 1];
        const cx = (prev.x + pt.x) / 2;
        return `${acc} C ${cx},${prev.y} ${cx},${pt.y} ${pt.x},${pt.y}`;
      }, "");
    };

    const line = smooth(pts);
    const area =
      `${line} L ${pts[pts.length - 1].x},${padding.top + innerH} L ${pts[0].x},${padding.top + innerH} Z`;

    return { points: pts, pathD: line, areaD: area };
  }, [data, height]);

  if (data.length < 2) {
    return (
      <div className="flex h-24 items-center justify-center text-sm text-ink-tertiary">
        Pas encore assez de données
      </div>
    );
  }

  const lastValue = data[data.length - 1].value;
  const prevValue = data[data.length - 2].value;
  const delta = lastValue - prevValue;

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-ink">{lastValue}%</span>
          {delta !== 0 && (
            <span
              className={`text-xs font-semibold ${delta > 0 ? "text-emerald-600" : "text-red-500"}`}
            >
              {delta > 0 ? "+" : ""}{delta}%
            </span>
          )}
        </div>
      </div>

      <svg
        viewBox={`0 0 560 ${height}`}
        className="w-full"
        aria-label={`Graphique ${title}: ${lastValue}%`}
        role="img"
      >
        <defs>
          <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[25, 50, 75, 100].map((v) => {
          const y = 8 + (1 - v / 100) * (height - 32);
          return (
            <g key={v}>
              <line
                x1="32" y1={y} x2="544" y2={y}
                stroke="#e8e8ed" strokeWidth="1" strokeDasharray="4,4"
              />
              <text x="0" y={y + 4} fontSize="9" fill="#86868b" textAnchor="start">
                {v}%
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        {areaD && (
          <path d={areaD} fill={`url(#grad-${title})`} />
        )}

        {/* Line */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Points */}
        {points.map((pt, i) => (
          <g key={i}>
            <circle cx={pt.x} cy={pt.y} r="4" fill={color} />
            <circle cx={pt.x} cy={pt.y} r="8" fill={color} fillOpacity="0" className="hover:fill-opacity-10" />
          </g>
        ))}

        {/* X labels */}
        {points.map((pt, i) => (
          <text
            key={i}
            x={pt.x}
            y={height - 4}
            fontSize="9"
            fill="#86868b"
            textAnchor="middle"
          >
            {pt.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
