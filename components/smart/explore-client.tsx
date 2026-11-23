"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpLeft,
  Bot,
  Check,
  ChevronDown,
  LayoutGrid,
  List,
  Map as MapIcon,
  RotateCcw,
  ScanEye,
  Search,
  SlidersHorizontal,
  Sparkles,
  WandSparkles,
  X,
} from "lucide-react";
import { Container, Eyebrow } from "@/components/ui/layout";
import { PropertyCardSmart } from "@/components/property-cards";
import { AssistantEmbedded } from "@/components/smart-assistant";
import { TehranMap } from "@/components/smart/tehran-map";
import { amenityOptions, properties } from "@/lib/data";
import { assistantReply } from "@/lib/assistant";
import {
  categoryLabels,
  cn,
  dealLabels,
  fa,
  normalizeText,
  propertyPrice,
} from "@/lib/utils";
import type { Property } from "@/lib/types";

const allDistricts = Array.from(new Set(properties.map((p) => p.district)));
const categories = ["apartment", "villa", "penthouse", "office", "duplex", "studio"] as const;

type SortKey = "smart" | "newest" | "cheap" | "expensive" | "area";

function amountOf(p: Property) {
  return p.dealType === "sale" ? p.price : p.deposit ?? 0;
}

export function SmartExplore() {
  const params = useSearchParams();
  const initialQ = params.get("q") ?? "";

  const [aiQuery, setAiQuery] = useState(initialQ);
  const [aiIds, setAiIds] = useState<string[] | null>(null);
  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const [text, setText] = useState("");
  const [deal, setDeal] = useState("all");
  const [district, setDistrict] = useState("all");
  const [category, setCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState(0);
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");
  const [rooms, setRooms] = useState(0);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [tourOnly, setTourOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("smart");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [mobileFilters, setMobileFilters] = useState(false);

  const runAi = (raw: string) => {
    const q = raw.trim();
    if (!q) return;
    setAiQuery(q);
    setAiLoading(true);
    setAiText("");
    setAiIds(null);
    window.setTimeout(() => {
      const reply = assistantReply(q);
      setAiText(reply.text);
      setAiIds(reply.propertyIds ?? []);
      setAiLoading(false);
    }, 650);
  };

  useEffect(() => {
    if (!initialQ) return;
    const reply = assistantReply(initialQ);
    setAiText(reply.text);
    setAiIds(reply.propertyIds ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const term = normalizeText(text);
    let list = properties.filter((p) => p.status === "active" || p.status === "pending");
    if (aiIds) list = list.filter((p) => aiIds.includes(p.id));
    if (deal !== "all") list = list.filter((p) => p.dealType === deal);
    if (district !== "all") list = list.filter((p) => p.district === district);
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (maxPrice) list = list.filter((p) => amountOf(p) <= maxPrice * 1_000_000_000);
    if (minArea) list = list.filter((p) => p.area >= Number(minArea));
    if (maxArea) list = list.filter((p) => p.area <= Number(maxArea));
    if (rooms) list = list.filter((p) => p.rooms >= rooms);
    if (tourOnly) list = list.filter((p) => p.tour);
    if (amenities.length)
      list = list.filter((p) => amenities.every((a) => p.amenities.some((x) => x.includes(a))));
    if (term) {
      list = list.filter((p) => {
        const haystack = normalizeText(
          `${p.title} ${p.district} ${p.address} ${p.description} ${categoryLabels[p.category]}`,
        );
        return haystack.includes(term);
      });
    }

    list = [...list].sort((a, b) => {
      if (sort === "cheap") return amountOf(a) - amountOf(b);
      if (sort === "expensive") return amountOf(b) - amountOf(a);
      if (sort === "area") return b.area - a.area;
      if (sort === "newest") return b.views - a.views;
      return (b.aiScore ?? 0) - (a.aiScore ?? 0);
    });
    return list;
  }, [aiIds, deal, district, category, maxPrice, minArea, maxArea, rooms, tourOnly, amenities, text, sort]);

  const activeCount =
    (aiIds ? 1 : 0) +
    (deal !== "all" ? 1 : 0) +
    (district !== "all" ? 1 : 0) +
    (category !== "all" ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    (minArea ? 1 : 0) +
    (maxArea ? 1 : 0) +
    (rooms ? 1 : 0) +
    amenities.length +
    (tourOnly ? 1 : 0) +
    (text ? 1 : 0);

  const reset = () => {
    setAiIds(null);
    setAiText("");
    setAiQuery("");
    setText("");
    setDeal("all");
    setDistrict("all");
    setCategory("all");
    setMaxPrice(0);
    setMinArea("");
    setMaxArea("");
    setRooms(0);
    setAmenities([]);
    setTourOnly(false);
    setSort("smart");
  };

  const toggleAmenity = (a: string) =>
    setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const mapItems = filtered.length ? filtered : properties.slice(0, 7);

  const filterBody = (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-bold">جست‌وجوی سریع</span>
          {text ? (
            <button type="button" onClick={() => setText("")} className="text-[9px] text-accent">
              پاک کردن
            </button>
          ) : null}
        </div>
        <div className="relative">
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="نام ملک، محله یا خیابان..."
            className="field !py-2.5 !pe-9 !text-[11px]"
          />
        </div>
      </div>

      <div>
        <span className="mb-2 block text-[11px] font-bold">نوع معامله</span>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            ["all", "همه"],
            ["sale", "فروش"],
            ["rent", "رهن و اجاره"],
            ["mortgage", "رهن کامل"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setDeal(id)}
              className={cn(
                "rounded-lg border py-2 text-[10px] font-semibold transition",
                deal === id
                  ? "border-accent bg-accent text-[#0a0f0c]"
                  : "border-line bg-white/[0.02] text-muted hover:border-accent/30 hover:text-accent",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label>
          <span className="mb-1.5 block text-[10px] text-muted">منطقه</span>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="field !py-2.5 !text-[10.5px]"
          >
            <option value="all">همه مناطق</option>
            {allDistricts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="mb-1.5 block text-[10px] text-muted">نوع ملک</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="field !py-2.5 !text-[10.5px]"
          >
            <option value="all">همه</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {categoryLabels[c]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between text-[10px]">
          <span className="font-bold">حداکثر قیمت / ودیعه</span>
          <span className="text-accent">
            {maxPrice ? `تا ${fa(maxPrice)} میلیارد` : "بدون محدودیت"}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full"
        />
        <div className="mt-1 flex justify-between text-[8px] text-muted">
          <span>همه</span>
          <span>۵۰ میلیارد</span>
          <span>۱۰۰ میلیارد</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label>
          <span className="mb-1.5 block text-[10px] text-muted">متراژ از</span>
          <input
            value={minArea}
            onChange={(e) => setMinArea(e.target.value.replace(/\D/g, ""))}
            placeholder="۸۰"
            inputMode="numeric"
            className="field !py-2.5 !text-[10.5px]"
          />
        </label>
        <label>
          <span className="mb-1.5 block text-[10px] text-muted">متراژ تا</span>
          <input
            value={maxArea}
            onChange={(e) => setMaxArea(e.target.value.replace(/\D/g, ""))}
            placeholder="۳۰۰"
            inputMode="numeric"
            className="field !py-2.5 !text-[10.5px]"
          />
        </label>
      </div>

      <div>
        <span className="mb-2 block text-[11px] font-bold">تعداد خواب</span>
        <div className="grid grid-cols-5 gap-1.5">
          {[0, 1, 2, 3, 4].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRooms(n)}
              className={cn(
                "rounded-lg border py-2 text-[10px] font-semibold transition",
                rooms === n
                  ? "border-accent bg-accent text-[#0a0f0c]"
                  : "border-line bg-white/[0.02] text-muted hover:border-accent/30",
              )}
            >
              {n === 0 ? "همه" : n === 4 ? "+۴" : fa(n)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="mb-2 block text-[11px] font-bold">امکانات</span>
        <div className="flex flex-wrap gap-1.5">
          {amenityOptions.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => toggleAmenity(a)}
              className={cn(
                "flex items-center gap-1 rounded-full border px-2.5 py-1 text-[9px] transition",
                amenities.includes(a)
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-line text-muted hover:border-accent/30",
              )}
            >
              {amenities.includes(a) ? <Check size={9} /> : null}
              {a}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setTourOnly((v) => !v)}
        className={cn(
          "flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-[10px] font-semibold transition",
          tourOnly
            ? "border-accent/40 bg-accent/10 text-accent"
            : "border-line text-muted hover:border-accent/30",
        )}
      >
        <span className="flex items-center gap-1.5">
          <ScanEye size={13} /> فقط فایل‌های دارای تور ۳۶۰
        </span>
        <span
          className={cn(
            "relative h-4 w-7 rounded-full transition",
            tourOnly ? "bg-accent" : "bg-line",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 size-3 rounded-full bg-white transition",
              tourOnly ? "right-0.5" : "right-3.5",
            )}
          />
        </span>
      </button>

      <button
        type="button"
        onClick={reset}
        className="flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-line text-[10px] font-semibold text-muted transition hover:border-accent/30 hover:text-accent"
      >
        <RotateCcw size={12} /> پاک کردن همه فیلترها
      </button>
    </div>
  );

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="smart-glow pointer-events-none absolute inset-0" />
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-[0.07]" />
        <div className="pointer-events-none absolute -left-20 top-0 size-72 rounded-full bg-accent/10 blur-[100px]" />
        <Container className="relative py-10 lg:py-14">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <Eyebrow variant="smart">جست‌وجوی هوشمند</Eyebrow>
              <h1 className="mt-4 text-3xl font-black leading-[1.3] tracking-tight sm:text-4xl lg:text-[2.8rem]">
                بگو دنبال چه هستی،
                <br />
                <span className="text-gradient-lime">پیدایش می‌کنم.</span>
              </h1>
              <p className="mt-3 text-[12.5px] leading-7 text-muted">
                با زبان طبیعی جست‌وجو کن یا فیلترها را دقیق تنظیم کن. دستیار آرامش فایل‌ها را
                تحلیل، مقایسه و بهترین گزینه‌ها را پیشنهاد می‌کند.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 lg:min-w-[330px]">
              {[
                [fa(properties.length), "فایل فعال"],
                ["۹۶٪", "دقت پیشنهاد"],
                ["۲۴/۷", "پاسخ دستیار"],
              ].map(([v, l]) => (
                <div
                  key={l}
                  className="rounded-xl border border-line bg-surface/50 px-3 py-3 text-center backdrop-blur"
                >
                  <div className="text-lg font-extrabold text-accent">{v}</div>
                  <div className="mt-0.5 text-[8px] text-muted">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              runAi(aiQuery);
            }}
            className="relative mt-7 rounded-2xl border border-accent/25 bg-[#0a1015]/85 p-1.5 shadow-[0_0_60px_-24px_rgba(200,244,90,0.35)] backdrop-blur"
          >
            <div className="flex items-center gap-2">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                <Sparkles size={18} />
              </span>
              <input
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="مثلاً: آپارتمان ۱۵۰ متری زعفرانیه تا ۳۰ میلیارد با پارکینگ"
                className="h-11 min-w-0 flex-1 bg-transparent text-[12px] text-ink outline-none placeholder:text-muted/60"
              />
              <button
                type="submit"
                disabled={aiLoading}
                className="flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-accent px-4 text-[11px] font-bold text-[#0a0f0c] transition hover:bg-[#d4fa7a] disabled:opacity-60"
              >
                <WandSparkles size={15} />
                <span className="hidden sm:inline">{aiLoading ? "در حال تحلیل..." : "تحلیل کن"}</span>
              </button>
            </div>
          </form>

          {aiLoading ? (
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-line bg-surface/50 px-4 py-3 text-[10px] text-muted">
              <Bot size={14} className="text-accent" />
              دستیار در حال بررسی فایل‌ها، بودجه و منطقه...
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

          {aiText && !aiLoading ? (
            <div className="animate-fade-up mt-3 rounded-2xl border border-accent/20 bg-accent/[0.04] p-4">
              <div className="flex items-start gap-2.5">
                <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-accent text-[#0a0f0c]">
                  <Bot size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold text-accent">تحلیل دستیار آرامش</span>
                    {aiIds ? (
                      <span className="rounded-full border border-accent/20 bg-accent/5 px-2 py-0.5 text-[8px] text-accent">
                        {fa(aiIds.length)} فایل پیشنهادی
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1.5 whitespace-pre-line text-[10.5px] leading-6 text-ink/80">
                    {aiText}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAiIds(null);
                        setAiText("");
                        setAiQuery("");
                      }}
                      className="text-[9px] font-semibold text-muted transition hover:text-accent"
                    >
                      نمایش همه‌ی فایل‌ها
                    </button>
                    <Link
                      href="#assistant"
                      className="flex items-center gap-1 text-[9px] font-semibold text-accent"
                    >
                      گفت‌وگوی کامل با دستیار <ArrowUpLeft size={10} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </Container>
      </section>

      <Container className="py-8 lg:py-12">
        <div className="grid gap-5 lg:grid-cols-[275px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-[100px] max-h-[calc(100vh-120px)] overflow-y-auto rounded-2xl border border-line bg-surface/50 p-4 no-scrollbar">
              <div className="mb-4 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11.5px] font-bold">
                  <SlidersHorizontal size={14} className="text-accent" /> فیلترها
                </span>
                {activeCount ? (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[8.5px] font-bold text-[#0a0f0c]">
                    {fa(activeCount)} فعال
                  </span>
                ) : null}
              </div>
              {filterBody}
            </div>
          </aside>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold">
                  {aiIds ? "نتایج پیشنهاد دستیار" : "همه‌ی املاک"}
                </h2>
                <p className="mt-0.5 text-[9.5px] text-muted">
                  {fa(filtered.length)} فایل مطابق جست‌وجو
                  {activeCount ? ` · ${fa(activeCount)} فیلتر فعال` : ""}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMobileFilters(true)}
                  className="flex h-9 items-center gap-1.5 rounded-xl border border-line px-3 text-[9.5px] font-semibold text-muted lg:hidden"
                >
                  <SlidersHorizontal size={12} /> فیلتر
                  {activeCount ? (
                    <span className="rounded-full bg-accent px-1.5 text-[8px] font-bold text-[#0a0f0c]">
                      {fa(activeCount)}
                    </span>
                  ) : null}
                </button>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="field !h-9 !w-[150px] !py-0 !ps-8 !text-[9.5px]"
                  >
                    <option value="smart">هوشمندترین</option>
                    <option value="newest">پربازدیدترین</option>
                    <option value="cheap">ارزان‌ترین</option>
                    <option value="expensive">گران‌ترین</option>
                    <option value="area">بزرگ‌ترین</option>
                  </select>
                  <ChevronDown
                    size={12}
                    className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted"
                  />
                </div>
                <div className="flex items-center gap-0.5 rounded-xl border border-line p-0.5">
                  {[
                    ["grid", LayoutGrid],
                    ["list", List],
                  ].map(([id, Icon]) => {
                    const I = Icon as typeof LayoutGrid;
                    return (
                      <button
                        key={id as string}
                        type="button"
                        onClick={() => setView(id as "grid" | "list")}
                        aria-label={id === "grid" ? "نمایش شبکه‌ای" : "نمایش لیستی"}
                        className={cn(
                          "grid size-8 place-items-center rounded-lg transition",
                          view === id ? "bg-accent text-[#0a0f0c]" : "text-muted hover:text-accent",
                        )}
                      >
                        <I size={14} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {activeCount ? (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {aiIds ? (
                  <button
                    type="button"
                    onClick={() => {
                      setAiIds(null);
                      setAiText("");
                      setAiQuery("");
                    }}
                    className="flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[9px] font-semibold text-accent"
                  >
                    پیشنهاد دستیار <X size={10} />
                  </button>
                ) : null}
                {deal !== "all" ? (
                  <button
                    type="button"
                    onClick={() => setDeal("all")}
                    className="flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-[9px] text-muted hover:text-accent"
                  >
                    {dealLabels[deal as keyof typeof dealLabels]} <X size={10} />
                  </button>
                ) : null}
                {district !== "all" ? (
                  <button
                    type="button"
                    onClick={() => setDistrict("all")}
                    className="flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-[9px] text-muted hover:text-accent"
                  >
                    {district} <X size={10} />
                  </button>
                ) : null}
                {category !== "all" ? (
                  <button
                    type="button"
                    onClick={() => setCategory("all")}
                    className="flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-[9px] text-muted hover:text-accent"
                  >
                    {categoryLabels[category as keyof typeof categoryLabels]} <X size={10} />
                  </button>
                ) : null}
                {maxPrice ? (
                  <button
                    type="button"
                    onClick={() => setMaxPrice(0)}
                    className="flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-[9px] text-muted hover:text-accent"
                  >
                    تا {fa(maxPrice)} میلیارد <X size={10} />
                  </button>
                ) : null}
                {rooms ? (
                  <button
                    type="button"
                    onClick={() => setRooms(0)}
                    className="flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-[9px] text-muted hover:text-accent"
                  >
                    {fa(rooms)}+ خواب <X size={10} />
                  </button>
                ) : null}
                {tourOnly ? (
                  <button
                    type="button"
                    onClick={() => setTourOnly(false)}
                    className="flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-[9px] text-muted hover:text-accent"
                  >
                    تور ۳۶۰ <X size={10} />
                  </button>
                ) : null}
                {amenities.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAmenity(a)}
                    className="flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-[9px] text-muted hover:text-accent"
                  >
                    {a} <X size={10} />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={reset}
                  className="text-[9px] font-semibold text-accent hover:underline"
                >
                  پاک کردن همه
                </button>
              </div>
            ) : null}

            {filtered.length ? (
              <div
                className={cn(
                  "mt-5 grid gap-4",
                  view === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1",
                )}
              >
                {filtered.map((p) =>
                  view === "grid" ? (
                    <PropertyCardSmart key={p.id} property={p} />
                  ) : (
                    <div
                      key={p.id}
                      className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-line bg-surface/60 p-3 transition hover:border-accent/30 sm:flex-row"
                    >
                      <div className="relative h-44 shrink-0 overflow-hidden rounded-xl sm:h-36 sm:w-56">
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="size-full object-cover transition duration-700 group-hover:scale-105"
                        />
                        {p.tour ? (
                          <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-[8px] text-white backdrop-blur">
                            <ScanEye size={9} className="text-accent" /> ۳۶۰°
                          </span>
                        ) : null}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-accent/20 bg-accent/5 px-2 py-0.5 text-[8px] font-semibold text-accent">
                            {dealLabels[p.dealType]}
                          </span>
                          <span className="text-[8.5px] text-muted">
                            {categoryLabels[p.category]} · {p.district}
                          </span>
                          {p.aiScore ? (
                            <span className="ms-auto flex items-center gap-1 text-[8.5px] font-semibold text-accent">
                              <Sparkles size={10} /> امتیاز {fa(p.aiScore)}
                            </span>
                          ) : null}
                        </div>
                        <h3 className="mt-1.5 text-[13px] font-bold transition group-hover:text-accent">
                          <Link href={`/smart/properties/${p.id}`} className="outline-none">
                            <span className="absolute inset-0 z-10" />
                            {p.title}
                          </Link>
                        </h3>
                        <p className="mt-1 line-clamp-1 text-[9.5px] text-muted">{p.subtitle}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-[9px] text-muted">
                          <span>{fa(p.area)} متر</span>
                          <span>·</span>
                          <span>{fa(p.rooms)} خواب</span>
                          <span>·</span>
                          <span>{fa(p.bathrooms)} سرویس</span>
                          <span>·</span>
                          <span>{fa(p.parking)} پارکینگ</span>
                        </div>
                        <div className="mt-auto flex items-end justify-between pt-3">
                          <div>
                            <div className="text-base font-extrabold text-accent">
                              {propertyPrice(p).main}{" "}
                              <span className="text-[9px] font-normal text-muted">
                                {propertyPrice(p).unit}
                              </span>
                            </div>
                            {propertyPrice(p).sub ? (
                              <div className="text-[8.5px] text-muted">{propertyPrice(p).sub}</div>
                            ) : null}
                          </div>
                          <span className="flex items-center gap-1 text-[9px] font-semibold text-accent">
                            جزئیات <ArrowLeft size={11} />
                          </span>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface/40 px-6 py-16 text-center">
                <span className="grid size-14 place-items-center rounded-2xl bg-accent/10 text-accent">
                  <Search size={24} />
                </span>
                <h3 className="mt-4 text-sm font-bold">فایلی با این فیلترها پیدا نشد</h3>
                <p className="mt-2 max-w-sm text-[10.5px] leading-6 text-muted">
                  بودجه یا منطقه را کمی بازتر کن؛ یا از دستیار بخواه گزینه‌های نزدیک به
                  خواسته‌ات را پیدا کند.
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={reset}
                    className="flex h-9 items-center gap-1.5 rounded-xl bg-accent px-4 text-[10px] font-bold text-[#0a0f0c]"
                  >
                    <RotateCcw size={12} /> پاک کردن فیلترها
                  </button>
                  <Link
                    href="#assistant"
                    className="flex h-9 items-center gap-1.5 rounded-xl border border-line px-4 text-[10px] font-semibold text-muted hover:text-accent"
                  >
                    <Bot size={12} /> پرسیدن از دستیار
                  </Link>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface/40 px-4 py-3">
              <span className="text-[9.5px] text-muted">
                نمایش {fa(filtered.length)} فایل از {fa(properties.length)} فایل فعال
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href="/smart/compare"
                  className="flex h-8 items-center gap-1.5 rounded-lg border border-line px-3 text-[9px] font-semibold text-muted transition hover:border-accent/30 hover:text-accent"
                >
                  مقایسه‌ی هوشمند <ArrowUpLeft size={11} />
                </Link>
                <Link
                  href="/smart/account"
                  className="flex h-8 items-center gap-1.5 rounded-lg bg-accent px-3 text-[9px] font-bold text-[#0a0f0c]"
                >
                  ذخیره‌ها و پنل من <ArrowUpLeft size={11} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <section id="map" className="scroll-mt-24 border-y border-line bg-[#080d11]/60 py-12 lg:py-16">
        <Container>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="flex items-center gap-1.5 text-[10px] font-semibold text-accent">
                <MapIcon size={13} /> نقشه‌ی تعاملی
              </span>
              <h2 className="mt-2 text-2xl font-black tracking-tight">
                {fa(mapItems.length)} ملک روی نقشه
              </h2>
              <p className="mt-1 text-[11px] text-muted">
                موقعیت فایل‌ها را ببین و روی هر پین برای خلاصه‌ی ملک کلیک کن.
              </p>
            </div>
            <span className="rounded-full border border-line bg-surface/50 px-3 py-1.5 text-[9px] text-muted">
              نتایج مطابق فیلترهای فعلی
            </span>
          </div>
          <TehranMap items={mapItems} className="h-[440px] w-full" />
        </Container>
      </section>

      <section id="assistant" className="scroll-mt-24 py-12 lg:py-16">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <Eyebrow variant="smart">دستیار هوشمند</Eyebrow>
              <h2 className="mt-4 text-2xl font-black leading-[1.35] tracking-tight sm:text-3xl">
                هر سوالی داری،
                <br />
                <span className="text-gradient-lime">همین‌جا بپرس.</span>
              </h2>
              <p className="mt-3 max-w-md text-[11.5px] leading-7 text-muted">
                دستیار آرامش به فایل‌های واقعی سامانه متصل است؛ می‌تواند بر اساس بودجه،
                منطقه، متراژ و امکانات جست‌وجو کند، چند ملک را مقایسه کند و مسیر بازدید را
                توضیح دهد.
              </p>
              <div className="mt-5 space-y-2.5">
                {[
                  "جست‌وجوی زبان طبیعی فارسی",
                  "مقایسه‌ی هوشمند چند فایل",
                  "پاسخ بر اساس موجودی واقعی",
                  "اتصال به تلگرام و واتس‌اپ",
                ].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-[10.5px] text-muted">
                    <span className="grid size-4.5 place-items-center rounded-full bg-accent/10 text-accent">
                      <Check size={10} />
                    </span>
                    {t}
                  </div>
                ))}
              </div>
              <Link
                href="/smart/compare"
                className="group mt-5 inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-[10.5px] font-semibold transition hover:border-accent/30 hover:text-accent"
              >
                مقایسه‌ی فایل‌های پیشنهادی
                <ArrowLeft size={13} className="transition group-hover:-translate-x-1" />
              </Link>
            </div>
            <AssistantEmbedded />
          </div>
        </Container>
      </section>

      {mobileFilters ? (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <button
            type="button"
            aria-label="بستن"
            onClick={() => setMobileFilters(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 right-0 w-[min(88vw,340px)] overflow-y-auto border-l border-line bg-[#080d11] p-4">
            <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
              <span className="flex items-center gap-1.5 text-xs font-bold">
                <SlidersHorizontal size={14} className="text-accent" /> فیلترها
              </span>
              <button
                type="button"
                onClick={() => setMobileFilters(false)}
                className="grid size-8 place-items-center rounded-full border border-line text-muted"
                aria-label="بستن"
              >
                <X size={15} />
              </button>
            </div>
            {filterBody}
            <button
              type="button"
              onClick={() => setMobileFilters(false)}
              className="mt-4 flex h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-accent text-[11px] font-bold text-[#0a0f0c]"
            >
              نمایش {fa(filtered.length)} نتیجه
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
