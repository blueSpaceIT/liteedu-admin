/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import  { useEffect, useRef, useState, useMemo } from "react";

/**
 * CustomAreaChart
 * Props:
 * - data: [{ name: string, total: number }]
 * - theme: "light" | "dark"
 * - height: number (optional, default 300)
 */
export function CustomAreaChart({ data = [], theme = "light", height = 300 }) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(600);
  const [hoverIdx, setHoverIdx] = useState(null);

  // measure width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const resize = () => setWidth(Math.max(320, Math.floor(el.clientWidth)));
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // normalize data
  const safeData = useMemo(() => (Array.isArray(data) ? data : []).map(d => ({
    name: d.name ?? "...",
    total: Number(d.total ?? 0)
  })), [data]);

  const padding = { top: 12, right: 20, bottom: 28, left: 36 };
  const innerW = Math.max(100, width - padding.left - padding.right);
  const innerH = Math.max(40, height - padding.top - padding.bottom);

  // scales
  const totals = safeData.map(d => d.total);
  const max = Math.max(...totals, 1);
  const min = Math.min(...totals, 0);

  const points = safeData.map((d, i) => {
    const x = padding.left + (innerW * (i / Math.max(1, safeData.length - 1)));
    // invert y: bigger total -> smaller y
    const y = padding.top + innerH - ((d.total - min) / (max - min || 1)) * innerH;
    return { ...d, x, y, idx: i };
  });

  // create a smooth path using cubic bezier (simple smoothing)
  const buildPath = (pts) => {
    if (!pts.length) return { line: "", area: "" };
    if (pts.length === 1) {
      const p = pts[0];
      const line = `M ${p.x},${p.y} L ${p.x + 1},${p.y}`;
      const area = `${line} L ${p.x},${padding.top + innerH} Z`;
      return { line, area };
    }

    const tension = 0.25; // smoothing factor
    const getCtrl = (p0, p1, p2) => {
      // returns control points for p1
      const d01 = Math.hypot(p1.x - p0.x, p1.y - p0.y);
      const d12 = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const fa = tension * d01 / (d01 + d12 || 1);
      const fb = tension - fa;
      const c1x = p1.x - fa * (p2.x - p0.x);
      const c1y = p1.y - fa * (p2.y - p0.y);
      const c2x = p1.x + fb * (p2.x - p0.x);
      const c2y = p1.y + fb * (p2.y - p0.y);
      return [{ x: c1x, y: c1y }, { x: c2x, y: c2y }];
    };

    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] ?? pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] ?? p2;
      const [c1, c2] = getCtrl(p0, p1, p2);
      const [nc1, nc2] = getCtrl(p1, p2, p3);
      d += ` C ${c2.x},${c2.y} ${nc1.x},${nc1.y} ${p2.x},${p2.y}`;
    }

    // area path: line + down to baseline + back to start
    const last = pts[pts.length - 1];
    const area = `${d} L ${last.x},${padding.top + innerH} L ${pts[0].x},${padding.top + innerH} Z`;
    return { line: d, area };
  };

  const { line, area } = buildPath(points);

  // tooltip label position + content
  const tooltip = hoverIdx != null ? points[hoverIdx] : null;

  // gradient id (unique per instance)
  const gradientId = useMemo(() => `grad-${Math.random().toString(36).slice(2, 9)}`, []);

  const strokeColor = theme === "light" ? "#2563eb" : "#60a5fa";
  const bg = theme === "light" ? "#ffffff" : "#0b1220";
  const text = theme === "light" ? "#0f172a" : "#e6eef8";

  return (
    <div
      ref={containerRef}
      className="w-full"
      role="img"
      aria-label="Overview chart showing monthly students"
      style={{ background: "transparent" }}
    >
      {safeData.length === 0 ? (
        <div className="w-full h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
          No overview data available
        </div>
      ) : (
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="block"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.18" />
              <stop offset="60%" stopColor={strokeColor} stopOpacity="0.06" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
            </linearGradient>

            <filter id={`soft-${gradientId}`} x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feBlend in="SourceGraphic" in2="b" />
            </filter>
          </defs>

          {/* grid lines */}
          {Array.from({ length: 4 }).map((_, i) => {
            const y = padding.top + (innerH * (i / 3));
            return (
              <line
                key={i}
                x1={padding.left}
                x2={padding.left + innerW}
                y1={y}
                y2={y}
                stroke={theme === "light" ? "#e6eef8" : "#1f2937"}
                strokeDasharray="4 4"
                strokeWidth={1}
              />
            );
          })}

          {/* area */}
          <path d={area} fill={`url(#${gradientId})`} stroke="none" />

          {/* stroke line */}
          <path d={line} fill="none" stroke={strokeColor} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

          {/* points + interactive groups */}
          {points.map((p, idx) => (
            <g key={idx}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hoverIdx === idx ? 5 : 3}
                fill={hoverIdx === idx ? strokeColor : "#fff"}
                stroke={strokeColor}
                strokeWidth={1.5}
                onMouseEnter={() => setHoverIdx(idx)}
                onMouseLeave={() => setHoverIdx(null)}
                onFocus={() => setHoverIdx(idx)}
                onBlur={() => setHoverIdx(null)}
                tabIndex={0}
                role="button"
                aria-label={`${p.name}: ${p.total} students`}
                style={{ cursor: "pointer" }}
              />

              {/* invisible hit area for easier hover on small circles */}
              <rect
                x={p.x - 12}
                y={padding.top}
                width={24}
                height={innerH}
                fill="transparent"
                onMouseEnter={() => setHoverIdx(idx)}
                onMouseLeave={() => setHoverIdx(null)}
                onFocus={() => setHoverIdx(idx)}
                onBlur={() => setHoverIdx(null)}
              />
            </g>
          ))}

          {/* tooltip inside svg */}
          {tooltip && (
            <g>
              {/* callout line */}
              <line
                x1={tooltip.x}
                x2={tooltip.x}
                y1={tooltip.y - 10}
                y2={padding.top + innerH}
                stroke={theme === "light" ? "#cbd5e1" : "#334155"}
                strokeDasharray="3 3"
                strokeWidth={1}
              />
              {/* tooltip rect */}
              <g transform={`translate(${Math.min(Math.max(tooltip.x + 8, padding.left + 8), width - 140)}, ${Math.max(8, tooltip.y - 36)})`}>
                <rect rx="6" ry="6" width="132" height="44" fill={theme === "light" ? "#ffffff" : "#0f172a"} stroke={theme === "light" ? "#e6eef8" : "#1f2937"} />
                <text x="8" y="18" fill={text} fontSize="12" fontWeight="600">{tooltip.name}</text>
                <text x="8" y="34" fill={text} fontSize="12">{`${tooltip.total} students`}</text>
              </g>
            </g>
          )}

          {/* x axis labels */}
          {points.map((p, idx) => (
            <text
              key={`lab-${idx}`}
              x={p.x}
              y={padding.top + innerH + 18}
              fontSize="11"
              fill={theme === "light" ? "#475569" : "#9ca3af"}
              textAnchor="middle"
            >
              {p.name}
            </text>
          ))}

          {/* left axis numeric labels */}
          <text x={8} y={padding.top + 12} fontSize="11" fill={theme === "light" ? "#475569" : "#9ca3af"}>{max}</text>
          <text x={8} y={padding.top + innerH} fontSize="11" fill={theme === "light" ? "#475569" : "#9ca3af"}>{min}</text>
        </svg>
      )}
    </div>
  );
}
