"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpLeft,
  Bot,
  CalendarDays,
  Check,
  Crown,
  GitCompareArrows,
  MapPin,
  Plus,
  Ruler,
  ScanEye,
  Sparkles,
  Star,
  Trash2,
  TrendingDown,
  X,
} from "lucide-react";
import { Container, Eyebrow } from "@/components/ui/layout";
import { useApp } from "@/components/providers";
import { asset } from "@/lib/asset";
import { getConsultant, getProperty, properties } from "@/lib/data";
import type { Property } from "@/lib/types";
import {
  categoryLabels,
  cn,
  dealLabels,
  fa,
  formatPriceShort,
  propertyPrice,
} from "@/lib/utils";

const DEFAULT_IDS = ["p1", "p2", "p12"];

function amountOf(p: Property) {
  return p.dealType === "sale" ? p.price : p.deposit ?? 0;
}

function ppmOf(p: Property) {
  return p.area ? Math.round(amountOf(p) / p.area) : 0;
}

interface Row {
  label: string;
  value: (p: Property) => ReactNode;
  metric?: (p: Property) => number;
  better?: "low" | "high";
}

const rows: Row[] = [
  {
    label: "قیمت / ودیعه",
    value: (p) => (
      <span className="font-bold text-accent">
        {propertyPrice(p).main}{" "}
        <span className="text-[8px] font-normal text-muted">{propertyPrice(p).unit}</span>
      </span>
    ),
    metric: amountOf,
    better: "low",
  },
  {
    label: "قیمت / ودیعه هر متر",
    value: (p) => <span>{formatPriceShort(ppmOf(p))} تومان</span>,
    metric: ppmOf,
    better: "low",
  },
  {
    label: "اجاره ماهانه",
    value: (p) =>
      p.dealType === "rent" && p.monthly ? (
        <span>{formatPriceShort(p.monthly)} تومان</span>
      ) : (
        <span className="text-muted">—</span>
      ),
    metric: (p) => p.monthly ?? 0,
    better: "low",
  },
  {
    label: "متراژ",
    value: (p) => <span>{fa(p.area)} متر</span>,
    metric: (p) => p.area,
    better: "high",
  },
  {
    label: "تعداد خواب",
    value: (p) => <span>{fa(p.rooms)} خواب</span>,
    metric: (p) => p.rooms,
    better: "high",
  },
  {
    label: "سرویس بهداشتی",
    value: (p) => <span>{fa(p.bathrooms)} سرویس</span>,
    metric: (p) => p.bathrooms,
    better: "high",
  },
  {
    label: "پارکینگ",
    value: (p) => <span>{fa(p.parking)} پارکینگ</span>,
    metric: (p) => p.parking,
    better: "high",
  },
  {
    label: "سال ساخت",
    value: (p) => <span>{fa(p.year)}</span>,
    metric: (p) => p.year,
    better: "high",
  },
  {
    label: "طبقه",
    value: (p) => (
      <span>
        {fa(p.floor)} از {fa(p.totalFloors)}
      </span>
    ),
  },
  {
    label: "نوع ملک",
    value: (p) => <span>{categoryLabels[p.category]}</span>,
  },
  {
    label: "نوع معامله",
    value: (p) => <span>{dealLabels[p.dealType]}</span>,
  },
  {
    label: "منطقه",
    value: (p) => (
      <span className="flex items-center justify-center gap-1">
        <MapPin size={10} className="text-accent" /> {p.district}
      </span>
    ),
  },
  {
    label: "تعداد امکانات",
    value: (p) => <span>{fa(p.amenities.length)} مورد</span>,
    metric: (p) => p.amenities.length,
    better: "high",
  },
  {
    label: "تور مجازی ۳۶۰",
    value: (p) =>
      p.tour ? (
        <span className="inline-flex items-center gap-1 text-accent">
          <Check size={12} /> دارد
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-muted">
          <X size={12} /> ندارد
        </span>
      ),
    metric: (p) => (p.tour ? 1 : 0),
    better: "high",
  },
  {
    label: "امتیاز هوشمند",
    value: (p) => (
      <span className="inline-flex items-center gap-1 rounded-full border border-accent/25 bg-accent/5 px-2 py-0.5 font-bold text-accent">
        <Sparkles size={9} /> {fa(p.aiScore ?? 0)}
      </span>
    ),
    metric: (p) => p.aiScore ?? 0,
    better: "high",
  },
  {
    label: "مشاور",
    value: (p) => <span>{getConsultant(p.consultantId)?.name ?? "—"}</span>,
  },
];

export function SmartCompare() {
  const { compare, ready, setCompareIds, toggleCompare, clearCompare, pushToast } = useApp();
  const [seededOnce, setSeededOnce] = useState(false);
  const seeded = useRef(false);

  useEffect(() => {
    if (!ready || seeded.current) return;
    seeded.current = true;
    setSeededOnce(true);
    if (compare.length === 0) setCompareIds(DEFAULT_IDS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const displayIds = compare.length ? compare : !seededOnce ? DEFAULT_IDS : [];
  const selected = displayIds
    .map((id) => getProperty(id))
    .filter((p): p is Property => Boolean(p));

  const suggestions = properties
    .filter((p) => !displayIds.includes(p.id))
    .slice(0, 4);

  const best = selected.length
    ? [...selected].sort((a, b) => (b.aiScore ?? 0) - (a.aiScore ?? 0))[0]
    : null;
  const cheapest = selected.length
    ? [...selected].sort((a, b) => ppmOf(a) - ppmOf(b))[0]
    : null;
  const largest = selected.length
    ? [...selected].sort((a, b) => b.area - a.area)[0]
    : null;

  const sharedAmenities = selected.length
    ? selected[0].amenities.filter((a) => selected.every((p) => p.amenities.includes(a)))
    : [];

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="smart-glow pointer-events-none absolute inset-0" />
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-[0.07]" />
        <div className="pointer-events-none absolute -left-24 top-0 size-80 rounded-full bg-accent/10 blur-[110px]" />
        <Container className="relative py-10 lg:py-14">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <Eyebrow variant="smart">مقایسه‌ی هوشمند</Eyebrow>
              <h1 className="mt-4 text-3xl font-black leading-[1.3] tracking-tight sm:text-4xl lg:text-[2.8rem]">
                کنار هم بگذار،
                <br />
                <span className="text-gradient-lime">بهترین را انتخاب کن.</span>
              </h1>
              <p className="mt-3 text-[12.5px] leading-7 text-muted">
                قیمت هر متر، متراژ، امکانات، تور ۳۶۰ و امتیاز هوشمند؛ همه در یک جدول شفاف.
                دستیار آرامش هم بهترین گزینه را از بین فایل‌ها پیشنهاد می‌دهد.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex h-10 items-center gap-1.5 rounded-full border border-line bg-surface/50 px-4 text-[10px] text-muted">
                <GitCompareArrows size={13} className="text-accent" />
                {fa(selected.length)} از ۳ فایل
              </span>
              <Link
                href="/smart/explore"
                className="flex h-10 items-center gap-1.5 rounded-full bg-accent px-4 text-[10px] font-bold text-[#0a0f0c] transition hover:bg-[#d4fa7a]"
              >
                افزودن از املاک <ArrowLeft size={12} />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-8 lg:py-12">
        {selected.length ? (
          <>
            {best ? (
              <div className="mb-6 overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/[0.06] to-transparent">
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-[#0a0f0c]">
                      <Bot size={19} />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold text-accent">پیشنهاد دستیار آرامش</span>
                        <span className="rounded-full border border-accent/20 bg-accent/5 px-2 py-0.5 text-[8px] text-accent">
                          تحلیل بر اساس {fa(selected.length)} فایل
                        </span>
                      </div>
                      <p className="mt-1.5 text-[10.5px] leading-6 text-ink/80">
                        بین این فایل‌ها،{" "}
                        <Link href={`/smart/properties/${best.id}`} className="font-bold text-accent hover:underline">
                          «{best.title}»
                        </Link>{" "}
                        بالاترین امتیاز هوشمند ({fa(best.aiScore ?? 0)}) را دارد.
                        {cheapest && cheapest.id !== best.id
                          ? ` «${cheapest.title}» مناسب‌ترین قیمت هر متر را دارد و`
                          : ""}{" "}
                        {largest ? `«${largest.title}» بزرگ‌ترین متراژ را.` : ""} برای تصمیم
                        نهایی، امکانات و سال ساخت را هم مقایسه کن.
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/smart/properties/${best.id}`}
                    className="flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-accent px-4 text-[10px] font-bold text-[#0a0f0c]"
                  >
                    مشاهده پیشنهاد <ArrowUpLeft size={12} />
                  </Link>
                </div>
              </div>
            ) : null}

            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { icon: Crown, label: "بالاترین امتیاز", value: best?.title ?? "—" },
                  { icon: TrendingDown, label: "مناسب‌ترین قیمت", value: cheapest?.title ?? "—" },
                  { icon: Ruler, label: "بزرگ‌ترین فضا", value: largest?.title ?? "—" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 rounded-xl border border-line bg-surface/50 px-3 py-2"
                  >
                    <item.icon size={13} className="text-accent" />
                    <div>
                      <div className="text-[7.5px] text-muted">{item.label}</div>
                      <div className="max-w-[130px] truncate text-[9px] font-semibold">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  clearCompare();
                  pushToast("لیست مقایسه پاک شد.", "info");
                }}
                className="flex h-9 items-center gap-1.5 rounded-xl border border-line px-3 text-[9.5px] font-semibold text-muted transition hover:border-rose-400/30 hover:text-rose-300"
              >
                <Trash2 size={12} /> پاک کردن لیست
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-line bg-surface/40">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-center">
                  <thead>
                    <tr className="border-b border-line">
                      <th className="sticky right-0 z-20 w-[150px] bg-[#080d11] px-3 py-4 text-start text-[10px] font-medium text-muted">
                        مشخصات
                      </th>
                      {selected.map((p) => (
                        <th key={p.id} className="min-w-[190px] border-r border-line px-3 py-3 align-top">
                          <div className="relative overflow-hidden rounded-xl border border-line">
                            <img
                              src={asset(p.images[0])}
                              alt={p.title}
                              className="aspect-[16/10] w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#06090c]/80 to-transparent" />
                            <button
                              type="button"
                              onClick={() => toggleCompare(p.id, p.title)}
                              aria-label="حذف از مقایسه"
                              className="absolute left-2 top-2 grid size-7 place-items-center rounded-full border border-white/15 bg-black/50 text-white/70 backdrop-blur transition hover:bg-rose-500 hover:text-white"
                            >
                              <X size={12} />
                            </button>
                            {p.tour ? (
                              <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/50 px-1.5 py-0.5 text-[7.5px] text-white backdrop-blur">
                                <ScanEye size={8} className="text-accent" /> ۳۶۰°
                              </span>
                            ) : null}
                          </div>
                          <Link
                            href={`/smart/properties/${p.id}`}
                            className="mt-2 block truncate text-[10.5px] font-bold text-ink transition hover:text-accent"
                          >
                            {p.title}
                          </Link>
                          <div className="mt-0.5 text-[8px] text-muted">
                            {p.district} · {fa(p.area)} متر
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {rows.map((row) => {
                      const bestMetric =
                        row.metric && row.better && selected.length > 1
                          ? row.better === "low"
                            ? Math.min(...selected.map((p) => row.metric!(p)))
                            : Math.max(...selected.map((p) => row.metric!(p)))
                          : null;
                      return (
                        <tr key={row.label} className="transition hover:bg-white/[0.015]">
                          <td className="sticky right-0 z-10 bg-[#080d11] px-3 py-3 text-start text-[9.5px] text-muted">
                            {row.label}
                          </td>
                          {selected.map((p) => {
                            const isBest =
                              bestMetric !== null && row.metric && row.metric(p) === bestMetric;
                            return (
                              <td
                                key={p.id}
                                className={cn(
                                  "border-r border-line px-3 py-3 text-[9.5px]",
                                  isBest ? "bg-accent/[0.045] font-bold text-accent" : "text-ink/80",
                                )}
                              >
                                <span className="inline-flex items-center gap-1">
                                  {isBest ? <Check size={10} className="text-accent" /> : null}
                                  {row.value(p)}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-3 text-[8.5px] text-muted">
                <span className="flex items-center gap-1">
                  <Check size={10} className="text-accent" /> بهترین مقدار هر ردیف مشخص شده است
                </span>
                <span>برای دیدن همه‌ی ستون‌ها، جدول را بکشید.</span>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
              <div className="rounded-2xl border border-line bg-surface/40 p-5">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-accent" />
                  <h2 className="text-[12px] font-bold">امکانات مشترک هر سه فایل</h2>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {sharedAmenities.length ? (
                    sharedAmenities.map((a) => (
                      <span
                        key={a}
                        className="rounded-full border border-accent/20 bg-accent/5 px-2.5 py-1 text-[9px] text-accent"
                      >
                        {a}
                      </span>
                    ))
                  ) : (
                    <span className="text-[9.5px] text-muted">
                      این فایل‌ها امکانات کاملاً مشترکی ندارند؛ برای جزئیات هر ستون را ببین.
                    </span>
                  )}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4 text-center">
                  {[
                    [fa(selected.length), "فایل در مقایسه"],
                    [fa(Math.round(selected.reduce((s, p) => s + p.area, 0) / selected.length)), "میانگین متراژ"],
                    [fa(Math.round(selected.reduce((s, p) => s + (p.aiScore ?? 0), 0) / selected.length)), "میانگین امتیاز"],
                  ].map(([v, l]) => (
                    <div key={l}>
                      <div className="text-lg font-extrabold text-accent">{v}</div>
                      <div className="mt-0.5 text-[8px] text-muted">{l}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-surface/40 p-5">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-accent" />
                  <h2 className="text-[12px] font-bold">قدم بعدی</h2>
                </div>
                <div className="mt-3 space-y-2">
                  {[
                    { icon: ScanEye, text: "تور ۳۶۰ فایل‌های دارای تور را ببین", href: "/smart/explore?q=تور" },
                    { icon: CalendarDays, text: "برای بازدید حضوری زمان انتخاب کن", href: "/smart/account" },
                    { icon: Bot, text: "از دستیار درباره‌ی تفاوت‌ها بپرس", href: "/smart/explore#assistant" },
                  ].map((item) => (
                    <Link
                      key={item.text}
                      href={item.href}
                      className="flex items-center gap-2.5 rounded-xl border border-line bg-white/[0.02] px-3 py-2.5 text-[9.5px] text-muted transition hover:border-accent/30 hover:text-accent"
                    >
                      <item.icon size={13} className="text-accent" />
                      <span className="flex-1">{item.text}</span>
                      <ArrowUpLeft size={11} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-bold">افزودن فایل دیگر به مقایسه</h2>
                <span className="text-[8.5px] text-muted">حداکثر ۳ فایل</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {suggestions.map((p) => (
                  <div
                    key={p.id}
                    className="group overflow-hidden rounded-xl border border-line bg-surface/40 transition hover:border-accent/30"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img
                        src={asset(p.images[0])}
                        alt={p.title}
                        className="size-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#06090c]/80 to-transparent" />
                      <span className="absolute bottom-2 right-2 text-[8.5px] font-bold text-white">
                        {propertyPrice(p).main}
                      </span>
                    </div>
                    <div className="p-3">
                      <div className="truncate text-[9.5px] font-bold">{p.title}</div>
                      <div className="mt-0.5 flex items-center gap-1 text-[7.5px] text-muted">
                        <MapPin size={8} /> {p.district} · {fa(p.area)} متر
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleCompare(p.id, p.title)}
                        disabled={selected.length >= 3}
                        className="mt-2 flex h-8 w-full items-center justify-center gap-1 rounded-lg border border-accent/25 bg-accent/5 text-[8.5px] font-semibold text-accent transition hover:bg-accent hover:text-[#0a0f0c] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Plus size={10} /> افزودن به مقایسه
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[1.6rem] border border-dashed border-line bg-surface/40 px-6 py-20 text-center">
            <span className="grid size-16 place-items-center rounded-2xl bg-accent/10 text-accent">
              <GitCompareArrows size={30} />
            </span>
            <h2 className="mt-5 text-lg font-bold">لیست مقایسه خالی است</h2>
            <p className="mt-2 max-w-md text-[11px] leading-6 text-muted">
              سه فایل پیشنهادی دستیار را ببین یا از صفحه‌ی املاک، فایل‌های مورد علاقه‌ات را
              اضافه کن. حداکثر سه ملک را می‌توانی هم‌زمان مقایسه کنی.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCompareIds(DEFAULT_IDS)}
                className="flex h-10 items-center gap-1.5 rounded-xl bg-accent px-4 text-[10px] font-bold text-[#0a0f0c]"
              >
                <Sparkles size={13} /> مقایسه سه پیشنهاد دستیار
              </button>
              <Link
                href="/smart/explore"
                className="flex h-10 items-center gap-1.5 rounded-xl border border-line px-4 text-[10px] font-semibold text-muted hover:text-accent"
              >
                رفتن به املاک <ArrowLeft size={12} />
              </Link>
            </div>
          </div>
        )}

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: Sparkles,
              title: "امتیاز هوشمند",
              desc: "ترکیبی از قیمت، موقعیت، امکانات و بازخورد مشتریان.",
            },
            {
              icon: ScanEye,
              title: "تور ۳۶۰",
              desc: "قبل از بازدید حضوری، فضای ملک را مجازی ببین.",
            },
            {
              icon: Star,
              title: "پیشنهاد شخصی",
              desc: "دستیار بر اساس نیاز تو، بهترین گزینه را معرفی می‌کند.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-line bg-surface/40 p-4">
              <span className="grid size-9 place-items-center rounded-xl bg-accent/10 text-accent">
                <item.icon size={16} />
              </span>
              <h3 className="mt-3 text-[11px] font-bold">{item.title}</h3>
              <p className="mt-1 text-[9px] leading-5 text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
