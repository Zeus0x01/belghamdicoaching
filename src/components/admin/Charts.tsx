"use client";

export function AreaChart({
  data,
  height = 200,
  label = "",
}: {
  data: { x: string; y: number }[];
  height?: number;
  label?: string;
}) {
  if (data.length === 0) return <EmptyChart label={label} />;
  const max = Math.max(...data.map((d) => d.y), 1);
  const w = 100;
  const h = 100;
  const step = data.length > 1 ? w / (data.length - 1) : 0;
  const points = data.map((d, i) => [i * step, 100 - (d.y / max) * 90] as const);
  const line = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      style={{ width: "100%", height }}
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id="ac-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B97851" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#B97851" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#ac-fill)" />
      <path d={line} fill="none" stroke="#B97851" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function BarChart({
  data,
  label = "",
}: {
  data: { x: string; y: number }[];
  label?: string;
}) {
  if (data.length === 0) return <EmptyChart label={label} />;
  const max = Math.max(...data.map((d) => d.y), 1);
  return (
    <div className="space-y-3" role="img" aria-label={label}>
      {data.map((d) => (
        <div key={d.x} className="flex items-center gap-4">
          <span className="w-36 shrink-0 truncate text-xs text-wgray">{d.x}</span>
          <div className="flex-1 h-3 bg-graphite border border-wgray-dim/30">
            <div
              className="h-full bg-copper transition-all duration-700"
              style={{ width: `${(d.y / max) * 100}%` }}
            />
          </div>
          <span className="text-xs text-bone font-display w-8 text-right">{d.y}</span>
        </div>
      ))}
    </div>
  );
}

export function DonutChart({
  data,
  label = "",
}: {
  data: { x: string; y: number }[];
  label?: string;
}) {
  const total = data.reduce((s, d) => s + d.y, 0);
  if (total === 0) return <EmptyChart label={label} />;
  const colors = ["#B97851", "#77746E", "#4A4844", "#EAE6DD", "#8A5A3D"];
  let offset = 25;
  return (
    <div className="flex items-center gap-8">
      <svg viewBox="0 0 36 36" className="w-40 h-40" role="img" aria-label={label}>
        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#26241f" strokeWidth="4" />
        {data.map((d, i) => {
          const pct = (d.y / total) * 100;
          const el = (
            <circle
              key={d.x}
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke={colors[i % colors.length]}
              strokeWidth="4"
              strokeDasharray={`${pct} ${100 - pct}`}
              strokeDashoffset={offset}
            />
          );
          offset -= pct;
          return el;
        })}
      </svg>
      <ul className="space-y-2">
        {data.map((d, i) => (
          <li key={d.x} className="flex items-center gap-2 text-xs text-wgray">
            <span
              className="w-2.5 h-2.5 inline-block"
              style={{ background: colors[i % colors.length] }}
            />
            {d.x} <span className="text-bone font-display ml-1">{d.y}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="h-[160px] flex flex-col items-center justify-center border border-dashed border-wgray-dim/50 text-wgray-dim text-sm">
      {label ? <span>{label}</span> : null}
      <span className="mt-1 text-xs">No data yet — connect integrations or record activity</span>
    </div>
  );
}
