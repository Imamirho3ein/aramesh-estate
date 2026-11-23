"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpLeft,
  Bot,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock,
  Heart,
  Images,
  MapPin,
  Phone,
  ScanEye,
  Scale,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { useApp } from "@/components/providers";
import { asset } from "@/lib/asset";
import { PanoramaViewer } from "@/components/smart/panorama";
import { districtPrices, getConsultant } from "@/lib/data";
import type { Property } from "@/lib/types";
import {
  cn,
  fa,
  formatPriceShort,
  pricePerMeter,
  propertyPrice,
} from "@/lib/utils";

export function SmartGallery({ property }: { property: Property }) {
  const [tab, setTab] = useState<"photos" | "tour">("photos");
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const images = property.images;
  const { pushToast } = useApp();

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowLeft") setActive((v) => (v + 1) % images.length);
      if (e.key === "ArrowRight") setActive((v) => (v - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, images.length]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => setTab("photos")}
          className={cn(
            "flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[10px] font-semibold transition",
            tab === "photos"
              ? "border-accent bg-accent text-[#0a0f0c]"
              : "border-line bg-surface/40 text-muted hover:border-accent/30 hover:text-accent",
          )}
        >
          <Images size={13} /> تصاویر ({fa(images.length)})
        </button>
        <button
          type="button"
          onClick={() => setTab("tour")}
          className={cn(
            "flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[10px] font-semibold transition",
            tab === "tour"
              ? "border-accent bg-accent text-[#0a0f0c]"
              : "border-line bg-surface/40 text-muted hover:border-accent/30 hover:text-accent",
          )}
        >
          <ScanEye size={13} /> تور مجازی ۳۶۰°
          {property.tour ? (
            <span className="rounded-full bg-[#0a0f0c]/15 px-1.5 py-0.5 text-[7.5px]">فعال</span>
          ) : null}
        </button>
      </div>

      {tab === "photos" ? (
        <div className="grid gap-2 sm:grid-cols-[1.7fr_1fr]">
          <button
            type="button"
            onClick={() => setLightbox(true)}
            className="group relative aspect-[16/11] overflow-hidden rounded-[1.4rem] border border-line bg-surface2 text-start sm:aspect-auto sm:min-h-[390px]"
          >
            <img
              src={asset(images[active])}
              alt={property.title}
              className="size-full object-cover transition duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06090c]/70 via-transparent to-[#06090c]/25" />
            <span className="absolute bottom-3 right-3 rounded-full border border-white/10 bg-black/45 px-3 py-1.5 text-[9px] font-medium text-white backdrop-blur">
              {fa(active + 1)} / {fa(images.length)} · گالری تصاویر
            </span>
            <span className="absolute bottom-3 left-3 grid size-9 place-items-center rounded-full bg-accent text-[#0a0f0c] opacity-0 transition group-hover:opacity-100">
              <svg viewBox="0 0 24 24" fill="none" className="size-4" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" />
              </svg>
            </span>
          </button>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-2">
            {images.slice(0, 4).map((image, i) => (
              <button
                key={image + i}
                type="button"
                onClick={() => {
                  setActive(i);
                  setLightbox(true);
                }}
                className={cn(
                  "relative aspect-[4/3] overflow-hidden rounded-xl border-2 transition sm:aspect-auto sm:h-full",
                  active === i
                    ? "border-accent"
                    : "border-transparent opacity-85 hover:border-accent/40 hover:opacity-100",
                )}
              >
                <img src={asset(image)} alt={`${property.title} ${i + 1}`} className="size-full object-cover" />
                {i === 3 && images.length > 4 ? (
                  <span className="absolute inset-0 grid place-items-center bg-black/55 text-xs font-bold text-white">
                    +{fa(images.length - 4)} عکس
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      ) : property.tour ? (
        <PanoramaViewer
          image={asset("/images/panorama.jpg")}
          title={property.title}
          className="aspect-[16/9] w-full sm:aspect-[16/8]"
          hotspots={[
            { x: 24, y: 55, label: "نشیمن" },
            { x: 57, y: 46, label: "آشپزخانه" },
            { x: 79, y: 61, label: "تراس" },
            { x: 40, y: 70, label: "اتاق خواب" },
          ]}
        />
      ) : (
        <div className="flex aspect-[16/9] flex-col items-center justify-center rounded-[1.4rem] border border-dashed border-line bg-surface/40 px-6 text-center sm:aspect-[16/7]">
          <span className="grid size-14 place-items-center rounded-2xl bg-accent/10 text-accent">
            <ScanEye size={26} />
          </span>
          <h3 className="mt-4 text-sm font-bold">تور ۳۶۰ این فایل هنوز ثبت نشده</h3>
          <p className="mt-2 max-w-md text-[10.5px] leading-6 text-muted">
            برای این ملک می‌توانید درخواست تهیه‌ی تور مجازی بدهید؛ کارشناس محتوا حداکثر
            تا ۴۸ ساعت هماهنگ می‌کند.
          </p>
          <button
            type="button"
            onClick={() => pushToast("درخواست تهیه تور ۳۶۰ ثبت شد؛ کارشناس تماس می‌گیرد.")}
            className="mt-4 flex h-10 items-center gap-1.5 rounded-full bg-accent px-4 text-[10px] font-bold text-[#0a0f0c]"
          >
            <CalendarDays size={13} /> درخواست تهیه تور
          </button>
        </div>
      )}

      {lightbox ? (
        <div className="fixed inset-0 z-[110] flex flex-col bg-black/92 backdrop-blur">
          <div className="flex items-center justify-between px-5 py-4 text-white">
            <span className="text-xs">{property.title}</span>
            <button
              type="button"
              onClick={() => setLightbox(false)}
              className="grid size-10 place-items-center rounded-full border border-white/15 text-white/80 transition hover:bg-white/10"
              aria-label="بستن گالری"
            >
              <X size={20} />
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center px-4 pb-6">
            <button
              type="button"
              onClick={() => setActive((v) => (v - 1 + images.length) % images.length)}
              className="absolute right-4 z-10 grid size-11 place-items-center rounded-full border border-white/15 bg-black/30 text-white transition hover:bg-white/10"
              aria-label="عکس قبلی"
            >
              <ChevronRight size={22} />
            </button>
            <img src={asset(images[active])} alt={property.title} className="max-h-full max-w-full rounded-2xl object-contain" />
            <button
              type="button"
              onClick={() => setActive((v) => (v + 1) % images.length)}
              className="absolute left-4 z-10 grid size-11 place-items-center rounded-full border border-white/15 bg-black/30 text-white transition hover:bg-white/10"
              aria-label="عکس بعدی"
            >
              <ChevronLeft size={22} />
            </button>
          </div>
          <div className="flex justify-center gap-2 overflow-x-auto px-4 pb-5">
            {images.map((image, i) => (
              <button
                key={image + i}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "size-14 shrink-0 overflow-hidden rounded-lg border-2",
                  active === i ? "border-accent" : "border-transparent opacity-60",
                )}
              >
                <img src={asset(image)} alt="" className="size-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function SmartActions({ property }: { property: Property }) {
  const { isFavorite, isCompare, toggleFavorite, toggleCompare, pushToast } = useApp();
  const fav = isFavorite(property.id);
  const cmp = isCompare(property.id);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      pushToast("لینک ملک کپی شد؛ برای مشتری یا دوستت بفرست.");
    } catch {
      pushToast("لینک ملک آماده‌ی اشتراک‌گذاری است.");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <button
        type="button"
        onClick={() => toggleFavorite(property.id, property.title)}
        className={cn(
          "flex h-9 items-center gap-1.5 rounded-full border px-3 text-[10px] font-semibold transition",
          fav
            ? "border-rose-400/30 bg-rose-400/10 text-rose-300"
            : "border-line bg-surface/40 text-muted hover:border-accent/30 hover:text-accent",
        )}
      >
        <Heart size={14} fill={fav ? "currentColor" : "none"} />
        {fav ? "ذخیره شد" : "ذخیره"}
      </button>
      <button
        type="button"
        onClick={() => toggleCompare(property.id, property.title)}
        className={cn(
          "flex h-9 items-center gap-1.5 rounded-full border px-3 text-[10px] font-semibold transition",
          cmp
            ? "border-accent/30 bg-accent/10 text-accent"
            : "border-line bg-surface/40 text-muted hover:border-accent/30 hover:text-accent",
        )}
      >
        <Scale size={14} />
        {cmp ? "در مقایسه" : "مقایسه"}
      </button>
      <button
        type="button"
        onClick={share}
        className="grid size-9 place-items-center rounded-full border border-line bg-surface/40 text-muted transition hover:border-accent/30 hover:text-accent"
        aria-label="اشتراک‌گذاری"
      >
        <Share2 size={14} />
      </button>
    </div>
  );
}

export function SmartContactCard({ property }: { property: Property }) {
  const consultant = getConsultant(property.consultantId);
  const { pushToast } = useApp();
  const [modal, setModal] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "عصر", mode: "حضوری" });
  const price = propertyPrice(property);
  const amount = property.dealType === "sale" ? property.price : property.deposit ?? 0;
  const ppm = property.area ? Math.round(amount / property.area) : 0;

  if (!consultant) return null;

  return (
    <>
      <div className="overflow-hidden rounded-[1.4rem] border border-line bg-surface/60 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]">
        <div className="border-b border-line bg-white/[0.02] p-5">
          <span className="text-[9.5px] text-muted">
            {property.dealType === "sale" ? "قیمت فروش" : property.dealType === "rent" ? "ودیعه و اجاره" : "رهن کامل"}
          </span>
          <div className="mt-1 flex flex-wrap items-baseline gap-1.5">
            <span className="text-2xl font-black tracking-tight text-accent">{price.main}</span>
            <span className="text-[10px] text-muted">{price.unit}</span>
          </div>
          {price.sub ? <p className="mt-1 text-[10.5px] text-muted">{price.sub}</p> : null}
          <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-[9.5px] text-muted">
            <span>{property.dealType === "sale" ? "قیمت هر متر" : "ودیعه هر متر"}</span>
            <span className="font-bold text-ink">{formatPriceShort(ppm)} تومان</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[9.5px] text-muted">
            <span>کد فایل</span>
            <span className="font-semibold text-ink">{property.id.toUpperCase()}-۱۴۰۴</span>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-3">
            <span
              className={`grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${consultant.tone} text-xs font-bold text-white`}
            >
              {consultant.initials}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-bold">{consultant.name}</div>
              <div className="mt-0.5 text-[9px] text-muted">{consultant.role}</div>
              <div className="mt-1 flex items-center gap-1 text-[9px]">
                <Star size={9} className="fill-accent text-accent" />
                {fa(consultant.rating)} · {fa(consultant.deals)} معامله
              </div>
            </div>
            <span className="flex items-center gap-1 rounded-full border border-accent/20 bg-accent/5 px-2 py-1 text-[8px] font-semibold text-accent">
              <ShieldCheck size={10} /> تاییدشده
            </span>
          </div>

          <div className="mt-4 space-y-2">
            <button
              type="button"
              onClick={() => setModal(true)}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent text-xs font-bold text-[#0a0f0c] transition hover:bg-[#d4fa7a]"
            >
              <CalendarDays size={16} /> درخواست بازدید یا تور
            </button>
            <button
              type="button"
              onClick={() => setShowPhone((v) => !v)}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-line text-xs font-semibold text-ink transition hover:border-accent/30 hover:text-accent"
            >
              <Phone size={15} />
              {showPhone ? consultant.phone : "نمایش شماره تماس"}
            </button>
          </div>

          <p className="mt-3 text-center text-[8.5px] leading-5 text-muted">
            مشاوره و بازدید اولیه رایگان است · پاسخ در کمتر از ۲۴ ساعت
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-[1.4rem] border border-accent/15 bg-gradient-to-br from-[#0c1410] to-[#080d0b] p-5">
        <div className="flex items-center gap-2 text-[11px] font-bold text-accent">
          <Sparkles size={13} /> معامله‌ی مطمئن با آرامش
        </div>
        <p className="mt-2 text-[10px] leading-6 text-muted">
          مدارک این ملک توسط کارشناس حقوقی بررسی شده است. قرارداد و انتقال سند با
          همراهی تیم آرامش انجام می‌شود.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["سند بررسی‌شده", "قرارداد رسمی", "پشتیبانی حقوقی"].map((t) => (
            <span
              key={t}
              className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-[8.5px] text-muted"
            >
              <Check size={9} className="text-accent" /> {t}
            </span>
          ))}
        </div>
      </div>

      {modal ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="بستن"
            onClick={() => setModal(false)}
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
          />
          <div className="animate-fade-up relative w-full max-w-md overflow-hidden rounded-[1.5rem] border border-line bg-[#080d11] shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div>
                <h3 className="text-sm font-bold">درخواست بازدید / تور</h3>
                <p className="mt-0.5 text-[9px] text-muted">{property.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setModal(false)}
                className="grid size-8 place-items-center rounded-full border border-line text-muted"
                aria-label="بستن"
              >
                <X size={16} />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setModal(false);
                pushToast(
                  `درخواست ${form.mode === "مجازی" ? "تور مجازی" : "بازدید حضوری"} ثبت شد؛ مشاور تا ۲۴ ساعت آینده تماس می‌گیرد.`,
                );
                setForm({ name: "", phone: "", date: "", time: "عصر", mode: "حضوری" });
              }}
              className="space-y-3 p-5"
            >
              <div className="grid grid-cols-2 gap-2">
                {["حضوری", "مجازی"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setForm({ ...form, mode: m })}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-[10px] font-semibold transition",
                      form.mode === m
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-line text-muted",
                    )}
                  >
                    {m === "حضوری" ? <MapPin size={12} /> : <ScanEye size={12} />}
                    {m === "حضوری" ? "بازدید حضوری" : "تور مجازی ۳۶۰"}
                  </button>
                ))}
              </div>
              <label className="block">
                <span className="mb-1.5 block text-[10px] font-medium text-muted">نام و نام خانوادگی</span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="field !py-2.5 !text-[11px]"
                  placeholder="مثلاً سارا محمدی"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[10px] font-medium text-muted">شماره تماس</span>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="field !py-2.5 !text-[11px]"
                  placeholder="۰۹۱۲..."
                  inputMode="tel"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[10px] font-medium text-muted">تاریخ پیشنهادی</span>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="field !py-2.5 !text-[11px]"
                />
              </label>
              <div>
                <span className="mb-1.5 block text-[10px] font-medium text-muted">بازه‌ی زمانی</span>
                <div className="grid grid-cols-3 gap-2">
                  {["صبح", "عصر", "شب"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm({ ...form, time: t })}
                      className={cn(
                        "rounded-lg border py-2 text-[10px] font-semibold transition",
                        form.time === t
                          ? "border-accent bg-accent text-[#0a0f0c]"
                          : "border-line text-muted",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent text-xs font-bold text-[#0a0f0c]"
              >
                <Send size={14} /> ثبت درخواست
              </button>
              <p className="text-center text-[8.5px] text-muted">
                با ثبت درخواست، با تماس مشاور موافقت می‌کنید.
              </p>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function AiInsight({ property }: { property: Property }) {
  const district = districtPrices.find((d) => d.district === property.district);
  const amount = property.dealType === "sale" ? property.price : property.deposit ?? 0;
  const ppm = property.area ? amount / property.area : 0;
  const avg = district ? district.price * 1_000_000 : ppm;
  const diff = avg ? Math.round(((ppm - avg) / avg) * 100) : 0;
  const score = property.aiScore ?? 85;

  const priceScore =
    property.dealType === "sale"
      ? Math.max(55, Math.min(98, Math.round(88 - diff)))
      : Math.max(70, Math.min(95, 86));
  const lightScore = Math.min(97, 68 + Math.round(property.floor * 2.2));
  const accessScore = Math.min(96, 72 + property.amenities.length * 2.4);
  const amenityScore = Math.min(98, 58 + property.amenities.length * 5);

  const bars = [
    { label: "تطابق قیمت با منطقه", value: priceScore, tone: "#c8f45a" },
    { label: "نور و ویو", value: lightScore, tone: "#7de2c3" },
    { label: "دسترسی و موقعیت", value: accessScore, tone: "#f5c86b" },
    { label: "کامل بودن امکانات", value: amenityScore, tone: "#a6e3a1" },
  ];

  return (
    <div className="overflow-hidden rounded-[1.4rem] border border-accent/20 bg-gradient-to-br from-accent/[0.06] via-[#0a100d] to-[#080d0b]">
      <div className="flex items-center justify-between border-b border-accent/15 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-xl bg-accent text-[#0a0f0c]">
            <Bot size={16} />
          </span>
          <div>
            <div className="text-[11.5px] font-bold">تحلیل هوشمند آرامش</div>
            <div className="mt-0.5 text-[8px] text-muted">بر اساس داده‌های سامانه و میانگین محله</div>
          </div>
        </div>
        <span className="flex items-center gap-1 rounded-full border border-accent/20 bg-accent/5 px-2 py-1 text-[8px] font-semibold text-accent">
          <Sparkles size={9} /> AI
        </span>
      </div>

      <div className="grid gap-5 p-5 sm:grid-cols-[120px_1fr]">
        <div className="flex flex-col items-center justify-center">
          <div className="relative grid size-24 place-items-center">
            <svg viewBox="0 0 120 120" className="absolute inset-0 size-full -rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="8" />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="#c8f45a"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(score / 100) * 326.7} 326.7`}
              />
            </svg>
            <div className="text-center">
              <div className="text-2xl font-black text-accent">{fa(score)}</div>
              <div className="text-[7.5px] text-muted">امتیاز کل</div>
            </div>
          </div>
          <span className="mt-2 rounded-full border border-accent/20 bg-accent/5 px-2 py-1 text-[8px] text-accent">
            {score >= 94 ? "انتخاب ویژه" : score >= 88 ? "پیشنهاد قوی" : "گزینه‌ی مناسب"}
          </span>
        </div>

        <div>
          <p className="text-[10.5px] leading-6 text-ink/80">
            {property.dealType === "sale" ? (
              <>
                قیمت هر متر این فایل {formatPriceShort(ppm)} تومان است؛{" "}
                <span className={diff <= 0 ? "font-bold text-accent2" : "font-bold text-[#f5c86b]"}>
                  {diff === 0 ? "برابر با" : `${fa(Math.abs(diff))}٪ ${diff < 0 ? "کمتر از" : "بیشتر از"}`}
                </span>{" "}
                میانگین {property.district}. با {fa(property.amenities.length)} امکانات ثبت‌شده و
                موقعیت {property.district}، این فایل برای خریدارانی که {property.highlights[0]} را
                می‌خواهند گزینه‌ی قابل بررسی است.
              </>
            ) : (
              <>
                این فایل با ودیعه {formatPriceShort(property.deposit ?? 0)} و اجاره ماهانه{" "}
                {formatPriceShort(property.monthly ?? 0)} تومان در {property.district} ثبت شده است.
                با {fa(property.amenities.length)} امکانات و {fa(property.area)} متر فضا، برای
                سکونت {property.rooms >= 3 ? "خانوادگی" : "جوانان و زوج‌ها"} مناسب ارزیابی می‌شود.
              </>
            )}
          </p>

          <div className="mt-4 space-y-2.5">
            {bars.map((b) => (
              <div key={b.label}>
                <div className="mb-1 flex items-center justify-between text-[8.5px]">
                  <span className="text-muted">{b.label}</span>
                  <span className="font-semibold">{fa(b.value)}٪</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${b.value}%`, background: b.tone }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {diff <= 0 && property.dealType === "sale" ? (
              <span className="flex items-center gap-1 rounded-full border border-accent2/25 bg-accent2/10 px-2 py-1 text-[8px] font-semibold text-accent2">
                <TrendingDown size={9} /> قیمت مناسب‌تر از میانگین
              </span>
            ) : property.dealType === "sale" ? (
              <span className="flex items-center gap-1 rounded-full border border-[#f5c86b]/25 bg-[#f5c86b]/10 px-2 py-1 text-[8px] font-semibold text-[#f5c86b]">
                <TrendingUp size={9} /> بالاتر از میانگین منطقه
              </span>
            ) : null}
            {property.tour ? (
              <span className="flex items-center gap-1 rounded-full border border-accent/20 bg-accent/5 px-2 py-1 text-[8px] font-semibold text-accent">
                <ScanEye size={9} /> دارای تور ۳۶۰
              </span>
            ) : null}
            <span className="flex items-center gap-1 rounded-full border border-line px-2 py-1 text-[8px] text-muted">
              <CircleCheck size={9} className="text-accent" /> مدارک بررسی‌شده
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-accent/10 px-5 py-3">
        <span className="text-[8px] leading-4 text-muted">
          این تحلیل جایگزین بازدید حضوری نیست و بر اساس اطلاعات ثبت‌شده تهیه شده است.
        </span>
        <Link
          href="/smart/compare"
          className="flex items-center gap-1 text-[9px] font-semibold text-accent hover:underline"
        >
          مقایسه با فایل‌های مشابه <ArrowUpLeft size={10} />
        </Link>
      </div>
    </div>
  );
}

export function MiniConsultantRow({ property }: { property: Property }) {
  const consultant = getConsultant(property.consultantId);
  if (!consultant) return null;
  return (
    <div className="flex flex-col items-start gap-3 rounded-2xl border border-line bg-surface/50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span
          className={`grid size-11 place-items-center rounded-2xl bg-gradient-to-br ${consultant.tone} text-[10px] font-bold text-white`}
        >
          {consultant.initials}
        </span>
        <div>
          <div className="text-[11px] font-bold">مشاور اختصاصی این ملک</div>
          <div className="mt-0.5 text-[9.5px] text-muted">
            {consultant.name} · {consultant.role}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-[8.5px] text-muted">
          <Clock size={10} /> پاسخ سریع
        </span>
        <Link
          href="/smart/explore"
          className="flex h-9 items-center gap-1.5 rounded-full border border-line px-3.5 text-[9.5px] font-semibold transition hover:border-accent/30 hover:text-accent"
        >
          فایل‌های بیشتر <ArrowLeft size={11} />
        </Link>
      </div>
    </div>
  );
}
