"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpLeft, Bot, Loader2, Mic, Sparkles, WandSparkles } from "lucide-react";
import { assistantReply } from "@/lib/assistant";
import { getProperty } from "@/lib/data";
import { fa, propertyPrice } from "@/lib/utils";

const samples = [
  "پنت‌هاوس زیر ۴۰ میلیارد",
  "آپارتمان ۱۵۰ متری زعفرانیه",
  "ویلا با استخر",
  "اجاره در فرمانیه",
];

export function SmartHeroSearch() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof assistantReply> | null>(null);
  const [query, setQuery] = useState("");

  const ask = (text?: string) => {
    const q = (text ?? value).trim();
    if (!q) return;
    setQuery(q);
    setValue(q);
    setLoading(true);
    setResult(null);
    window.setTimeout(() => {
      setResult(assistantReply(q));
      setLoading(false);
    }, 700);
  };

  return (
    <div className="relative">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask();
        }}
        className="relative rounded-2xl border border-accent/25 bg-[#0a1015]/85 p-1.5 shadow-[0_0_60px_-20px_rgba(200,244,90,0.3)] backdrop-blur"
      >
        <div className="flex items-center gap-2">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
            <Sparkles size={18} />
          </span>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="دنبال چه خانه‌ای هستی؟ بودجه، منطقه یا متراژ را بنویس..."
            className="h-11 min-w-0 flex-1 bg-transparent text-[12px] text-ink outline-none placeholder:text-muted/60"
          />
          <button
            type="button"
            onClick={() => ask(value)}
            aria-label="جست‌وجوی صوتی (دمو)"
            className="hidden size-9 shrink-0 place-items-center rounded-xl border border-line text-muted transition hover:text-accent sm:grid"
          >
            <Mic size={15} />
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-accent px-4 text-[11px] font-bold text-[#0a0f0c] transition hover:bg-[#d4fa7a] disabled:opacity-60"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <WandSparkles size={15} />}
            <span className="hidden sm:inline">{loading ? "در حال تحلیل..." : "پیدا کن"}</span>
          </button>
        </div>
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="text-[9px] text-muted/70">امتحان کن:</span>
        {samples.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => ask(s)}
            className="rounded-full border border-line bg-white/[0.03] px-2.5 py-1 text-[9px] text-muted transition hover:border-accent/30 hover:text-accent"
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-line bg-[#0a1015]/80 px-3 py-2.5 text-[9.5px] text-muted backdrop-blur">
          <Bot size={13} className="text-accent" />
          دستیار در حال بررسی ۱۴ فایل، منطقه و بودجه...
          <span className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="size-1 animate-bounce rounded-full bg-accent"
                style={{ animationDelay: `${i * 120}ms` }}
              />
            ))}
          </span>
        </div>
      ) : null}

      {result ? (
        <div className="animate-fade-up absolute inset-x-0 top-[calc(100%+10px)] z-30 overflow-hidden rounded-2xl border border-accent/25 bg-[#0a1015]/97 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
            <span className="grid size-6 place-items-center rounded-full bg-accent text-[#0a0f0c]">
              <Bot size={12} />
            </span>
            <span className="text-[10px] font-bold">پاسخ دستیار آرامش</span>
            <span className="ms-auto rounded-full border border-accent/20 bg-accent/5 px-2 py-0.5 text-[8px] text-accent">
              تحلیل زنده
            </span>
          </div>
          <div className="p-4">
            <p className="whitespace-pre-line text-[10.5px] leading-6 text-ink/80">{result.text}</p>
            {result.propertyIds?.length ? (
              <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
                {result.propertyIds.slice(0, 2).map((id) => {
                  const p = getProperty(id);
                  if (!p) return null;
                  return (
                    <Link
                      key={id}
                      href={`/smart/properties/${id}`}
                      className="flex items-center gap-2 rounded-xl border border-line bg-white/[0.02] p-2 transition hover:border-accent/30"
                    >
                      <img src={p.images[0]} alt={p.title} className="size-10 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[9.5px] font-bold">{p.title}</div>
                        <div className="mt-0.5 text-[8px] text-muted">{p.district} · {fa(p.area)} متر</div>
                        <div className="text-[9px] font-semibold text-accent">{propertyPrice(p).main}</div>
                      </div>
                      <ArrowUpLeft size={11} className="text-muted" />
                    </Link>
                  );
                })}
              </div>
            ) : null}
            <div className="mt-3 flex items-center justify-between gap-2">
              <Link
                href={`/smart/explore?q=${encodeURIComponent(query)}`}
                className="flex items-center gap-1 text-[9px] font-semibold text-accent hover:underline"
              >
                جست‌وجوی کامل با این فیلترها <ArrowLeft size={11} />
              </Link>
              <Link href="/smart/explore#assistant" className="text-[9px] text-muted hover:text-accent">
                گفت‌وگو با دستیار
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
