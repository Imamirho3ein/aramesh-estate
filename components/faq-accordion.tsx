"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { faqs } from "@/lib/data";
import { cn } from "@/lib/utils";

export function FaqAccordion({
  variant = "classic",
  limit,
}: {
  variant?: "classic" | "smart";
  limit?: number;
}) {
  const [open, setOpen] = useState(0);
  const items = limit ? faqs.slice(0, limit) : faqs;

  return (
    <div className="space-y-2.5">
      {items.map((item, i) => {
        const active = open === i;
        return (
          <div
            key={item.q}
            className={cn(
              "overflow-hidden rounded-2xl border transition",
              variant === "smart"
                ? active
                  ? "border-accent/30 bg-accent/[0.04]"
                  : "border-line bg-surface/50"
                : active
                  ? "border-accent/20 bg-white shadow-[0_12px_40px_-24px_rgba(20,32,27,0.3)]"
                  : "border-line bg-white/60",
            )}
          >
            <button
              type="button"
              onClick={() => setOpen(active ? -1 : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start"
            >
              <span className="flex items-center gap-2.5 text-[12.5px] font-semibold">
                <HelpCircle
                  size={15}
                  className={variant === "smart" ? "text-accent" : "text-accent/70"}
                />
                {item.q}
              </span>
              <ChevronDown
                size={16}
                className={cn(
                  "shrink-0 text-muted transition",
                  active && "rotate-180 text-accent",
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-all duration-300",
                active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-4 ps-[3.2rem] text-[11.5px] leading-6 text-muted">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
