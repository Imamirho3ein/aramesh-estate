"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ChevronDown,
  Filter,
  LayoutGrid,
  List,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Container } from "@/components/ui/layout";
import { PropertyCardClassic } from "@/components/property-cards";
import { amenityOptions, properties } from "@/lib/data";
import { categoryLabels, cn, fa, normalizeText } from "@/lib/utils";

const allDistricts = Array.from(new Set(properties.map((p) => p.district)));
const categories = ["apartment", "villa", "penthouse", "office", "duplex", "studio"] as const;
const PAGE_SIZE = 6;

type SortKey = "newest" | "cheap" | "expensive" | "area" | "views";

function amountOf(p: (typeof properties)[number]) {
  return p.dealType === "sale" ? p.price : p.deposit ?? 0;
}

export function PropertiesExplorer() {
  const params = useSearchParams();
  const [deal, setDeal] = useState(params.get("deal") ?? "all");
  const [district, setDistrict] = useState(params.get("district") ?? "all");
  const [category, setCategory] = useState(params.get("category") ?? "all");
  const [maxPrice, setMaxPrice] = useState(() => {
    const m = params.get("max");
    return m ? String(Number(m) / 1_000_000) : "";
  });
  const [minPrice, setMinPrice] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");
  const [rooms, setRooms] = useState(0);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState(false);

  const filtered = useMemo(() => {
    const term = normalizeText(q);
    let list = properties.filter((p) => {
      if (deal !== "all" && p.dealType !== deal) return false;
      if (district !== "all" && p.district !== district) return false;
      if (category !== "all" && p.category !== category) return false;
      if (rooms && p.rooms < rooms) return false;
      if (minArea && p.area < Number(minArea)) return false;
      if (maxArea && p.area > Number(maxArea)) return false;
      if (minPrice && amountOf(p) < Number(minPrice) * 1_000_000) return false;
      if (maxPrice && amountOf(p) > Number(maxPrice) * 1_000_000) return false;
      if (amenities.length && !amenities.every((a) => p.amenities.some((x) => x.includes(a))))
        return false;
      if (term) {
        const haystack = normalizeText(
          `${p.title} ${p.district} ${p.address} ${p.description} ${categoryLabels[p.category]}`,
        );
        if (!haystack.includes(term)) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === "cheap") return amountOf(a) - amountOf(b);
      if (sort === "expensive") return amountOf(b) - amountOf(a);
      if (sort === "area") return b.area - a.area;
      if (sort === "views") return b.views - a.views;
      return b.featured === a.featured ? b.views - a.views : Number(b.featured) - Number(a.featured);
    });
    return list;
  }, [deal, district, category, rooms, minArea, maxArea, minPrice, maxPrice, amenities, q, sort]);

  useEffect(() => setPage(1), [deal, district, category, rooms, minArea, maxArea, minPrice, maxPrice, amenities, q, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const reset = () => {
    setDeal("all");
    setDistrict("all");
    setCategory("all");
    setMinPrice("");
    setMaxPrice("");
    setMinArea("");
    setMaxArea("");
    setRooms(0);
    setAmenities([]);
    setQ("");
    setSort("newest");
  };

  const activeCount =
    (deal !== "all" ? 1 : 0) +
    (district !== "all" ? 1 : 0) +
    (category !== "all" ? 1 : 0) +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    (minArea ? 1 : 0) +
    (maxArea ? 1 : 0) +
    (rooms ? 1 : 0) +
    amenities.length +
    (q ? 1 : 0);

  const toggleAmenity = (a: string) =>
    setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const filterContent = (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-bold">جست‌وجوی متنی</span>
          {q ? (
            <button type="button" onClick={() => setQ("")} className="text-[9px] text-accent">
              پاک کردن
            </button>
          ) : null}
        </div>
        <div className="relative">
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
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
                  ? "border-accent bg-accent text-white"
                  : "border-line bg-white text-muted hover:border-accent/30",
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
        <span className="mb-2 block text-[11px] font-bold">
          {deal === "sale" ? "قیمت (میلیون تومان)" : "ودیعه (میلیون تومان)"}
        </span>
        <div className="flex items-center gap-2">
          <input
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value.replace(/\D/g, ""))}
            placeholder="از"
            inputMode="numeric"
            className="field !py-2.5 !text-[10.5px]"
          />
          <span className="text-muted">—</span>
          <input
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ""))}
            placeholder="تا"
            inputMode="numeric"
            className="field !py-2.5 !text-[10.5px]"
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {[
            ["5000", "تا ۵ میلیارد"],
            ["10000", "تا ۱۰"],
            ["20000", "تا ۲۰"],
            ["40000", "تا ۴۰"],
          ].map(([v, l]) => (
            <button
              key={v}
              type="button"
              onClick={() => setMaxPrice(maxPrice === v ? "" : v)}
              className={cn(
                "rounded-full border px-2 py-1 text-[8.5px] transition",
                maxPrice === v
                  ? "border-accent bg-soft text-accent"
                  : "border-line text-muted hover:border-accent/30",
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="mb-2 block text-[11px] font-bold">متراژ (متر)</span>
        <div className="flex items-center gap-2">
          <input
            value={minArea}
            onChange={(e) => setMinArea(e.target.value.replace(/\D/g, ""))}
            placeholder="از"
            inputMode="numeric"
            className="field !py-2.5 !text-[10.5px]"
          />
          <span className="text-muted">—</span>
          <input
            value={maxArea}
            onChange={(e) => setMaxArea(e.target.value.replace(/\D/g, ""))}
            placeholder="تا"
            inputMode="numeric"
            className="field !py-2.5 !text-[10.5px]"
          />
        </div>
      </div>

      <div>
        <span className="mb-2 block text-[11px] font-bold">حداقل تعداد خواب</span>
        <div className="flex gap-1.5">
          {[
            [0, "همه"],
            [1, "+۱"],
            [2, "+۲"],
            [3, "+۳"],
            [4, "+۴"],
          ].map(([v, l]) => (
            <button
              key={v}
              type="button"
              onClick={() => setRooms(Number(v))}
              className={cn(
                "flex-1 rounded-lg border py-2 text-[10px] font-semibold transition",
                rooms === Number(v)
                  ? "border-accent bg-accent text-white"
                  : "border-line bg-white text-muted hover:border-accent/30",
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="mb-2 block text-[11px] font-bold">امکانات</span>
        <div className="grid grid-cols-2 gap-1.5">
          {amenityOptions.map((a) => {
            const checked = amenities.includes(a);
            return (
              <button
                key={a}
                type="button"
                onClick={() => toggleAmenity(a)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border px-2 py-2 text-[9.5px] transition",
                  checked
                    ? "border-accent/40 bg-soft text-accent"
                    : "border-line bg-white text-muted hover:border-accent/25",
                )}
              >
                <span
                  className={cn(
                    "grid size-3.5 place-items-center rounded border",
                    checked ? "border-accent bg-accent text-white" : "border-line",
                  )}
                >
                  {checked ? (
                    <svg viewBox="0 0 10 10" className="size-2.5" fill="none">
                      <path d="M1.5 5.2 4 7.5l4.5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  ) : null}
                </span>
                {a}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={reset}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-line py-2.5 text-[10.5px] font-semibold text-muted transition hover:border-accent/30 hover:text-accent"
      >
        <RotateCcw size={12} /> حذف همه فیلترها
      </button>
    </div>
  );

  return (
    <Container className="py-10 lg:py-14">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-[104px] rounded-2xl border border-line bg-white p-5">
            <div className="mb-5 flex items-center justify-between border-b border-line pb-3">
              <span className="flex items-center gap-2 text-xs font-bold">
                <SlidersHorizontal size={15} className="text-accent" />
                فیلتر پیشرفته
              </span>
              {activeCount ? (
                <span className="grid size-5 place-items-center rounded-full bg-accent text-[9px] font-bold text-white">
                  {activeCount}
                </span>
              ) : null}
            </div>
            {filterContent}
          </div>
        </aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDrawer(true)}
                className="flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-[10.5px] font-semibold lg:hidden"
              >
                <Filter size={13} /> فیلتر
                {activeCount ? (
                  <span className="grid size-4 place-items-center rounded-full bg-accent text-[8px] text-white">
                    {activeCount}
                  </span>
                ) : null}
              </button>
              <span className="text-[11px] text-muted">
                <strong className="text-ink">{fa(filtered.length)}</strong> ملک پیدا شد
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="field !h-9 !w-[150px] !py-0 !text-[10.5px]"
                >
                  <option value="newest">جدیدترین</option>
                  <option value="cheap">ارزان‌ترین</option>
                  <option value="expensive">گران‌ترین</option>
                  <option value="area">بزرگ‌ترین متراژ</option>
                  <option value="views">پربازدیدترین</option>
                </select>
              </div>
              <div className="flex rounded-lg border border-line p-0.5">
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  aria-label="نمایش شبکه‌ای"
                  className={cn(
                    "grid size-8 place-items-center rounded-md transition",
                    view === "grid" ? "bg-accent text-white" : "text-muted",
                  )}
                >
                  <LayoutGrid size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  aria-label="نمایش لیستی"
                  className={cn(
                    "grid size-8 place-items-center rounded-md transition",
                    view === "list" ? "bg-accent text-white" : "text-muted",
                  )}
                >
                  <List size={14} />
                </button>
              </div>
            </div>
          </div>

          {activeCount ? (
            <div className="mb-4 flex flex-wrap items-center gap-1.5">
              {deal !== "all" ? (
                <Chip label={deal === "sale" ? "فروش" : deal === "rent" ? "رهن و اجاره" : "رهن کامل"} onClear={() => setDeal("all")} />
              ) : null}
              {district !== "all" ? <Chip label={district} onClear={() => setDistrict("all")} /> : null}
              {category !== "all" ? (
                <Chip label={categoryLabels[category as keyof typeof categoryLabels]} onClear={() => setCategory("all")} />
              ) : null}
              {q ? <Chip label={`«${q}»`} onClear={() => setQ("")} /> : null}
              {rooms ? <Chip label={`${fa(rooms)}+ خواب`} onClear={() => setRooms(0)} /> : null}
              {amenities.map((a) => (
                <Chip key={a} label={a} onClear={() => toggleAmenity(a)} />
              ))}
              {minPrice ? <Chip label={`از ${fa(Number(minPrice))} میلیون`} onClear={() => setMinPrice("")} /> : null}
              {maxPrice ? <Chip label={`تا ${fa(Number(maxPrice))} میلیون`} onClear={() => setMaxPrice("")} /> : null}
              <button
                type="button"
                onClick={reset}
                className="px-2 text-[9px] font-semibold text-accent hover:underline"
              >
                حذف همه
              </button>
            </div>
          ) : null}

          {current.length ? (
            <div
              className={cn(
                view === "grid" ? "grid gap-4 sm:grid-cols-2" : "flex flex-col gap-4",
              )}
            >
              {current.map((property) => (
                <PropertyCardClassic
                  key={property.id}
                  property={property}
                  layout={view === "list" ? "row" : "grid"}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white/60 px-6 py-20 text-center">
              <span className="grid size-14 place-items-center rounded-2xl bg-soft text-accent">
                <Search size={24} />
              </span>
              <h3 className="mt-4 text-sm font-bold">فایلی با این فیلترها پیدا نشد</h3>
              <p className="mt-2 max-w-xs text-[11px] leading-6 text-muted">
                فیلترها را کمی بازتر کن یا جست‌وجوی متنی را پاک کن. می‌توانی با مشاور هم
                تماس بگیری.
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-4 flex h-10 items-center gap-2 rounded-full bg-accent px-5 text-[11px] font-bold text-white"
              >
                <RotateCcw size={13} /> حذف فیلترها
              </button>
            </div>
          )}

          {pages > 1 ? (
            <div className="mt-7 flex items-center justify-center gap-1.5">
              {Array.from({ length: pages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setPage(i + 1);
                    window.scrollTo({ top: 220, behavior: "smooth" });
                  }}
                  className={cn(
                    "grid size-9 place-items-center rounded-full border text-[11px] font-semibold transition",
                    page === i + 1
                      ? "border-accent bg-accent text-white"
                      : "border-line bg-white text-muted hover:border-accent/30 hover:text-accent",
                  )}
                >
                  {fa(i + 1)}
                </button>
              ))}
            </div>
          ) : null}

          <div className="mt-6 flex flex-col items-center justify-between gap-2 rounded-2xl border border-line bg-white px-4 py-3 text-[10px] text-muted sm:flex-row">
            <span>
              نمایش {fa(current.length ? (page - 1) * PAGE_SIZE + 1 : 0)} تا{" "}
              {fa(Math.min(page * PAGE_SIZE, filtered.length))} از {fa(filtered.length)} فایل
            </span>
            <Link href="/classic/panel" className="font-semibold text-accent hover:underline">
              ملک خود را ثبت کنید ←
            </Link>
          </div>
        </div>
      </div>

      {drawer ? (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button
            type="button"
            aria-label="بستن"
            onClick={() => setDrawer(false)}
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 right-0 w-[88%] max-w-sm overflow-y-auto bg-[#f7f4ed] p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-bold">
                <SlidersHorizontal size={16} className="text-accent" /> فیلتر پیشرفته
              </span>
              <button
                type="button"
                onClick={() => setDrawer(false)}
                className="grid size-8 place-items-center rounded-full border border-line bg-white"
              >
                <X size={16} />
              </button>
            </div>
            {filterContent}
            <button
              type="button"
              onClick={() => setDrawer(false)}
              className="sticky bottom-3 mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent text-xs font-bold text-white shadow-lg"
            >
              نمایش {fa(filtered.length)} نتیجه
              <ChevronDown size={14} />
            </button>
          </div>
        </div>
      ) : null}
    </Container>
  );
}

function Chip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="flex items-center gap-1 rounded-full border border-accent/20 bg-soft px-2.5 py-1 text-[9px] font-medium text-accent">
      {label}
      <button type="button" onClick={onClear} aria-label={`حذف ${label}`}>
        <X size={10} />
      </button>
    </span>
  );
}
