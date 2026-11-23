"use client";

import { useRef, useState } from "react";
import {
  Compass,
  Maximize2,
  Minimize2,
  MoveHorizontal,
  Plus,
  RotateCcw,
  ScanEye,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Hotspot {
  x: number;
  y: number;
  label: string;
}

export function PanoramaViewer({
  image,
  hotspots = [],
  className,
  title = "تور مجازی ۳۶۰ درجه",
}: {
  image: string;
  hotspots?: Hotspot[];
  className?: string;
  title?: string;
}) {
  const [pan, setPan] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [full, setFull] = useState(false);
  const start = useRef({ x: 0, pan: 0 });
  const boxRef = useRef<HTMLDivElement>(null);

  const down = (e: React.PointerEvent) => {
    setDragging(true);
    start.current = { x: e.clientX, pan };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const move = (e: React.PointerEvent) => {
    if (!dragging) return;
    const delta = (start.current.x - e.clientX) * 0.22;
    setPan(Math.max(-42, Math.min(42, start.current.pan + delta)));
  };
  const up = () => setDragging(false);

  const toggleFull = async () => {
    if (!boxRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await boxRef.current.requestFullscreen();
        setFull(true);
      } else {
        await document.exitFullscreen();
        setFull(false);
      }
    } catch {
      setFull((v) => !v);
    }
  };

  return (
    <div
      ref={boxRef}
      className={cn(
        "group relative overflow-hidden rounded-[1.4rem] border border-line bg-[#080d10] select-none",
        full && "rounded-none border-0",
        className,
      )}
    >
      <div
        role="img"
        aria-label={title}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerLeave={up}
        className={cn(
          "absolute inset-0 transition-[background-position] duration-75",
          dragging ? "cursor-grabbing" : "cursor-grab",
        )}
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: `${165 * zoom}% auto`,
          backgroundPosition: `${50 + pan}% center`,
          backgroundRepeat: "no-repeat",
          touchAction: "none",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06090c]/85 via-transparent to-[#06090c]/45" />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5" />

      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-1 rounded-full border border-accent/30 bg-[#06090c]/70 px-2.5 py-1 text-[9px] font-bold text-accent backdrop-blur">
            <ScanEye size={11} /> ۳۶۰°
          </span>
          <span className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[9px] text-white/70 backdrop-blur">
            {title}
          </span>
        </div>
        <span className="flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[8.5px] text-white/55 backdrop-blur">
          <Compass size={10} className="text-accent" /> شمال
        </span>
      </div>

      {hotspots.map((h) => (
        <button
          key={h.label}
          type="button"
          onClick={() => setActive(active === h.label ? null : h.label)}
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${h.x}%`, top: `${h.y}%` }}
        >
          <span className="relative flex size-3 items-center justify-center">
            <span className="absolute inline-flex size-3 animate-ping rounded-full bg-accent/60" />
            <span className="relative inline-flex size-2.5 rounded-full border border-[#06090c] bg-accent" />
          </span>
          <span
            className={cn(
              "absolute right-1/2 top-4 translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-[#06090c]/85 px-2 py-1 text-[8px] text-white/85 backdrop-blur transition",
              active === h.label ? "opacity-100" : "opacity-0 group-hover:opacity-70",
            )}
          >
            {h.label}
          </span>
        </button>
      ))}

      <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-2 p-4">
        <div>
          <p className="text-[10px] font-semibold text-white/85">برای چرخش، تصویر را بکشید</p>
          <p className="mt-0.5 flex items-center gap-1 text-[8.5px] text-white/40">
            <MoveHorizontal size={10} /> چپ و راست · {active ? `نمای ${active}` : "نمای اصلی"}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(1, +(z - 0.15).toFixed(2)))}
            className="grid size-8 place-items-center rounded-full border border-white/15 bg-black/40 text-white/70 backdrop-blur transition hover:border-accent/40 hover:text-accent"
            aria-label="کوچک‌نمایی"
          >
            <MinusIcon />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(1.6, +(z + 0.15).toFixed(2)))}
            className="grid size-8 place-items-center rounded-full border border-white/15 bg-black/40 text-white/70 backdrop-blur transition hover:border-accent/40 hover:text-accent"
            aria-label="بزرگ‌نمایی"
          >
            <Plus size={13} />
          </button>
          <button
            type="button"
            onClick={() => {
              setPan(0);
              setZoom(1);
              setActive(null);
            }}
            className="grid size-8 place-items-center rounded-full border border-white/15 bg-black/40 text-white/70 backdrop-blur transition hover:border-accent/40 hover:text-accent"
            aria-label="بازنشانی"
          >
            <RotateCcw size={12} />
          </button>
          <button
            type="button"
            onClick={toggleFull}
            className="grid size-8 place-items-center rounded-full border border-accent/30 bg-accent text-[#0a0f0c] transition hover:bg-[#d4fa7a]"
            aria-label="تمام‌صفحه"
          >
            {full ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          </button>
        </div>
      </div>
    </div>
  );
}

function MinusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-3">
      <path d="M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

export function TourModal({
  open,
  onClose,
  image,
  title,
}: {
  open: boolean;
  onClose: () => void;
  image: string;
  title: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6">
      <div className="relative w-full max-w-5xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-11 left-0 flex items-center gap-1 rounded-full border border-white/15 px-3 py-1.5 text-[10px] text-white/70 transition hover:text-white"
        >
          <X size={13} /> بستن تور
        </button>
        <PanoramaViewer
          image={image}
          title={title}
          className="aspect-[16/9] w-full"
          hotspots={[
            { x: 24, y: 55, label: "نشیمن" },
            { x: 58, y: 48, label: "آشپزخانه" },
            { x: 78, y: 60, label: "تراس" },
          ]}
        />
      </div>
    </div>
  );
}
