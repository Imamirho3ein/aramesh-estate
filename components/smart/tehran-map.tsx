"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpLeft,
  BedDouble,
  Compass,
  Layers,
  MapPin,
  Minus,
  Plus,
  Ruler,
  X,
} from "lucide-react";
import type { Property } from "@/lib/types";
import { cn, fa, propertyPrice } from "@/lib/utils";

const dealColor: Record<string, string> = {
  sale: "#c8f45a",
  rent: "#7de2c3",
  mortgage: "#f5c86b",
};

export function TehranMap({
  items,
  className,
  compact = false,
}: {
  items: Property[];
  className?: string;
  compact?: boolean;
}) {
  const [selected, setSelected] = useState<string | null>(items[0]?.id ?? null);
  const [zoom, setZoom] = useState(1);
  const selectedProperty = items.find((p) => p.id === selected);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.5rem] border border-line bg-[#080d12]",
        className,
      )}
    >
      <div className="absolute inset-0 opacity-[0.55] grid-lines" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_300px_at_65%_25%,rgba(200,244,90,0.07),transparent_70%)]" />

      <div
        className="absolute inset-0 origin-center transition-transform duration-500"
        style={{ transform: `scale(${zoom})` }}
      >
        <svg viewBox="0 0 800 520" className="size-full" aria-hidden>
          <defs>
            <linearGradient id="map-bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0a1117" />
              <stop offset="100%" stopColor="#070b0f" />
            </linearGradient>
            <linearGradient id="map-road" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#23313c" />
              <stop offset="100%" stopColor="#16212a" />
            </linearGradient>
          </defs>
          <rect width="800" height="520" fill="url(#map-bg)" />

          <g fill="#0e171e" stroke="#1a2832" strokeWidth="1">
            <path d="M80 90c60-35 150-30 200 5s40 95-10 120-140 20-180-15-35-80-10-110Z" />
            <path d="M320 60c70-20 150 5 185 55s15 100-30 120-120 5-155-35-30-115 0-140Z" />
            <path d="M540 90c60-25 140-5 170 45s5 95-45 115-115 5-140-35-15-100 15-125Z" />
            <path d="M120 300c50-20 130-10 170 35s20 100-25 125-130 15-165-25-20-110 20-135Z" />
            <path d="M350 320c55-30 140-20 185 25s30 105-15 130-135 15-170-25-30-100 0-130Z" />
            <path d="M580 310c50-15 120 0 150 40s10 90-30 115-110 10-140-25-15-110 20-130Z" />
          </g>

          <g fill="none" stroke="url(#map-road)" strokeLinecap="round">
            <path d="M-20 175C150 140 230 210 400 175s250-60 430-20" strokeWidth="16" />
            <path d="M-20 380c180-40 280 35 430 0s250-70 410-25" strokeWidth="13" />
            <path d="M160-20c30 120-35 190-5 300s85 150 95 260" strokeWidth="11" />
            <path d="M620-20c-30 120 30 200 5 300s-55 140-75 260" strokeWidth="10" />
            <path d="M330-20c10 130 40 200 20 300s-30 150-30 260" strokeWidth="7" />
          </g>

          <g stroke="#24323c" strokeWidth="2" fill="none" opacity="0.7">
            <path d="M0 275h800" strokeDasharray="3 8" />
            <path d="M470 0v520" strokeDasharray="3 8" />
            <path d="M250 60l540 300" strokeDasharray="3 8" opacity="0.4" />
            <path d="M60 440l620-350" strokeDasharray="3 8" opacity="0.3" />
          </g>

          <g fill="#4c5d69" fontSize="11" fontFamily="Vazirmatn, sans-serif">
            <text x="200" y="120">سعادت‌آباد</text>
            <text x="420" y="100">ونک</text>
            <text x="615" y="125">پاسداران</text>
            <text x="610" y="75">نیاوران</text>
            <text x="670" y="185">زعفرانیه</text>
            <text x="570" y="230">الهیه</text>
            <text x="655" y="260">فرمانیه</text>
            <text x="500" y="275">جردن</text>
            <text x="610" y="330">تجریش</text>
            <text x="520" y="390">ولنجک</text>
            <text x="180" y="360">شهرک غرب</text>
            <text x="250" y="440">اکباتان</text>
            <text x="720" y="420">لواسان</text>
          </g>

          <path
            d="M0 210c90 20 120 60 110 110s40 80 90 100 70 60 60 100"
            fill="none"
            stroke="#1b3a3f"
            strokeWidth="3"
            opacity="0.7"
          />
        </svg>

        {items.map((p) => {
          const active = selected === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelected(active ? null : p.id)}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
                active ? "z-20 scale-105" : "z-10 hover:z-20 hover:scale-105",
              )}
              style={{ left: `${p.coords.x}%`, top: `${p.coords.y}%` }}
              aria-label={p.title}
            >
              <span
                className={cn(
                  "flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-1 text-[8px] font-bold shadow-lg backdrop-blur transition",
                  active
                    ? "border-transparent text-[#0a0f0c]"
                    : "border-white/10 bg-[#0a1015]/85 text-white/80 hover:text-white",
                )}
                style={active ? { background: dealColor[p.dealType] } : undefined}
              >
                <MapPin size={9} style={{ color: active ? "#0a0f0c" : dealColor[p.dealType] }} />
                {propertyPrice(p).main}
              </span>
              <span
                className="mx-auto mt-0.5 block size-1.5 rounded-full"
                style={{ background: dealColor[p.dealType] }}
              />
            </button>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4">
        <div className="flex flex-wrap gap-1.5">
          <span className="flex items-center gap-1 rounded-full border border-white/10 bg-[#06090c]/75 px-2.5 py-1 text-[8.5px] text-white/70 backdrop-blur">
            <Layers size={10} className="text-accent" /> نقشه تعاملی
          </span>
          <span className="rounded-full border border-white/10 bg-[#06090c]/75 px-2.5 py-1 text-[8.5px] text-white/50 backdrop-blur">
            {fa(items.length)} ملک
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(1.5, +(z + 0.1).toFixed(2)))}
            className="pointer-events-auto grid size-7 place-items-center rounded-lg border border-white/10 bg-[#06090c]/80 text-white/60 backdrop-blur transition hover:text-accent"
            aria-label="بزرگ‌نمایی"
          >
            <Plus size={12} />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.85, +(z - 0.1).toFixed(2)))}
            className="pointer-events-auto grid size-7 place-items-center rounded-lg border border-white/10 bg-[#06090c]/80 text-white/60 backdrop-blur transition hover:text-accent"
            aria-label="کوچک‌نمایی"
          >
            <Minus size={12} />
          </button>
          <button
            type="button"
            onClick={() => {
              setZoom(1);
              setSelected(items[0]?.id ?? null);
            }}
            className="pointer-events-auto grid size-7 place-items-center rounded-lg border border-white/10 bg-[#06090c]/80 text-white/60 backdrop-blur transition hover:text-accent"
            aria-label="بازنشانی"
          >
            <Compass size={12} />
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-4 right-4 hidden items-center gap-3 rounded-full border border-white/10 bg-[#06090c]/70 px-3 py-1.5 text-[8px] text-white/50 backdrop-blur sm:flex">
        {[
          ["فروش", "#c8f45a"],
          ["اجاره", "#7de2c3"],
          ["رهن", "#f5c86b"],
        ].map(([l, c]) => (
          <span key={l} className="flex items-center gap-1">
            <span className="size-1.5 rounded-full" style={{ background: c }} /> {l}
          </span>
        ))}
      </div>

      {selectedProperty ? (
        <div className="absolute inset-x-3 bottom-3 z-30 sm:inset-x-auto sm:right-4 sm:w-[300px]">
          <div className="animate-fade-up overflow-hidden rounded-2xl border border-white/10 bg-[#0a1015]/95 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            <div className="flex gap-3 p-3">
              <img
                src={selectedProperty.images[0]}
                alt={selectedProperty.title}
                className="size-16 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="truncate text-[10.5px] font-bold">{selectedProperty.title}</div>
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="shrink-0 text-muted hover:text-ink"
                    aria-label="بستن"
                  >
                    <X size={12} />
                  </button>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[8px] text-muted">
                  <span className="flex items-center gap-0.5"><Ruler size={8} /> {fa(selectedProperty.area)} متر</span>
                  <span className="flex items-center gap-0.5"><BedDouble size={8} /> {fa(selectedProperty.rooms)} خواب</span>
                  <span>{selectedProperty.district}</span>
                </div>
                <div className="mt-1.5 text-[11px] font-bold text-accent">
                  {propertyPrice(selectedProperty).main}
                </div>
              </div>
            </div>
            <Link
              href={`/smart/properties/${selectedProperty.id}`}
              className="flex items-center justify-center gap-1.5 border-t border-line py-2 text-[9px] font-semibold text-accent transition hover:bg-accent/5"
            >
              مشاهده ملک <ArrowUpLeft size={11} />
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
