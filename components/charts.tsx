import { cn, fa } from "@/lib/utils";

export function AreaChart({
  data,
  id,
  color = "#0e5a4a",
  height = 210,
  suffix = "",
}: {
  data: { label: string; value: number }[];
  id: string;
  color?: string;
  height?: number;
  suffix?: string;
}) {
  const W = 600;
  const H = 190;
  const padX = 26;
  const padTop = 14;
  const padBottom = 28;
  const values = data.map((d) => d.value);
  const max = Math.max(...values) * 1.08;
  const min = Math.min(...values) * 0.92;
  const span = max - min || 1;
  const stepX = (W - padX * 2) / Math.max(1, data.length - 1);

  const pts = data.map((d, i) => ({
    x: padX + i * stepX,
    y: padTop + (1 - (d.value - min) / span) * (H - padTop - padBottom),
  }));

  let line = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const cur = pts[i];
    const mx = (prev.x + cur.x) / 2;
    line += ` C ${mx} ${prev.y}, ${mx} ${cur.y}, ${cur.x} ${cur.y}`;
  }
  const area = `${line} L ${pts[pts.length - 1].x} ${H - padBottom} L ${pts[0].x} ${H - padBottom} Z`;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ height }}
        className="w-full overflow-visible"
        role="img"
        aria-label="نمودار روند"
      >
        <defs>
          <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((i) => {
          const y = padTop + (i * (H - padTop - padBottom)) / 3;
          return (
            <g key={i}>
              <line
                x1={padX}
                x2={W - padX}
                y1={y}
                y2={y}
                stroke="currentColor"
                strokeOpacity="0.08"
                strokeDasharray="4 5"
              />
            </g>
          );
        })}
        <path d={area} fill={`url(#grad-${id})`} />
        <path d={line} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="3.2" fill="#fff" stroke={color} strokeWidth="2" />
            {i === pts.length - 1 ? (
              <circle cx={p.x} cy={p.y} r="7" fill={color} fillOpacity="0.12" />
            ) : null}
          </g>
        ))}
        {data.map((d, i) => (
          <text
            key={d.label}
            x={pts[i].x}
            y={H - 8}
            textAnchor="middle"
            fontSize="9"
            fill="currentColor"
            opacity="0.5"
          >
            {d.label}
          </text>
        ))}
      </svg>
      <div className="mt-1 flex items-center justify-between text-[9px] text-muted">
        <span>کمترین: {fa(Math.min(...values))}{suffix}</span>
        <span>بیشترین: {fa(Math.max(...values))}{suffix}</span>
      </div>
    </div>
  );
}

export function BarList({
  data,
  suffix = "",
  color = "#0e5a4a",
  showGrowth = false,
}: {
  data: { label: string; value: number; growth?: number }[];
  suffix?: string;
  color?: string;
  showGrowth?: boolean;
}) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={d.label}>
          <div className="mb-1 flex items-center justify-between text-[10px]">
            <span className="text-muted">{d.label}</span>
            <span className="flex items-center gap-2 font-semibold">
              {fa(d.value)} {suffix}
              {showGrowth && d.growth ? (
                <span className="text-[8px] font-medium text-emerald-500">+{fa(d.growth)}٪</span>
              ) : null}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-line/60">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(d.value / max) * 100}%`,
                background: `linear-gradient(90deg, ${color}, ${color}aa)`,
                transitionDelay: `${i * 60}ms`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Donut({
  segments,
  centerLabel,
  centerValue,
  size = 150,
}: {
  segments: { label: string; value: number; color: string }[];
  centerLabel: string;
  centerValue: string;
  size?: number;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = 54;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex flex-wrap items-center gap-5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 140 140" className="size-full -rotate-90">
          <circle cx="70" cy="70" r={r} fill="none" stroke="currentColor" strokeOpacity="0.07" strokeWidth="16" />
          {segments.map((s) => {
            const len = (s.value / total) * c;
            const dash = `${len} ${c - len}`;
            const el = (
              <circle
                key={s.label}
                cx="70"
                cy="70"
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth="16"
                strokeDasharray={dash}
                strokeDashoffset={-offset}
                strokeLinecap="round"
              />
            );
            offset += len;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-extrabold">{centerValue}</span>
          <span className="mt-0.5 text-[8.5px] text-muted">{centerLabel}</span>
        </div>
      </div>
      <div className="space-y-2">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-[10px]">
            <span className="size-2 rounded-full" style={{ background: s.color }} />
            <span className="text-muted">{s.label}</span>
            <span className="font-bold">{fa(s.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Funnel({
  steps,
  color = "#0e5a4a",
}: {
  steps: { label: string; value: number }[];
  color?: string;
}) {
  const max = steps[0]?.value || 1;
  return (
    <div className="space-y-2.5">
      {steps.map((step, i) => {
        const pct = Math.max(18, Math.round((step.value / max) * 100));
        return (
          <div key={step.label} className="group">
            <div className="mb-1 flex items-center justify-between text-[10px]">
              <span className="text-muted">{step.label}</span>
              <span className="font-semibold">
                {fa(step.value)}
                <span className="ms-1 text-[8px] text-muted">({fa(Math.round((step.value / max) * 100))}٪)</span>
              </span>
            </div>
            <div
              className={cn("mx-auto flex h-7 items-center justify-center rounded-lg text-[9px] font-semibold text-white/90 transition-all duration-700")}
              style={{
                width: `${pct}%`,
                background: `linear-gradient(90deg, ${color}, ${color}bb)`,
                opacity: 1 - i * 0.08,
              }}
            >
              {step.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ProgressBar({
  value,
  color = "#0e5a4a",
  className,
}: {
  value: number;
  color?: string;
  className?: string;
}) {
  return (
    <div className={cn("h-1.5 overflow-hidden rounded-full bg-line/60", className)}>
      <div
        className="h-full rounded-full"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  );
}
