"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Phone,
  Scale,
  Share2,
  ShieldCheck,
  Star,
  X,
} from "lucide-react";
import { useApp } from "@/components/providers";
import { getConsultant } from "@/lib/data";
import type { Property } from "@/lib/types";
import { cn, fa, formatPriceFull, pricePerMeter, propertyPrice } from "@/lib/utils";

export function Gallery({ property }: { property: Property }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const images = property.images;

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
    <>
      <div className="grid gap-2 sm:grid-cols-[1.7fr_1fr]">
        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="group relative aspect-[16/11] overflow-hidden rounded-[1.4rem] border border-line bg-surface2 text-start sm:aspect-auto sm:min-h-[380px]"
        >
          <img
            src={images[active]}
            alt={property.title}
            className="size-full object-cover transition duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
          <span className="absolute bottom-3 right-3 rounded-full bg-black/45 px-3 py-1.5 text-[10px] font-medium text-white backdrop-blur">
            {fa(active + 1)} / {fa(images.length)} · گالری تصاویر
          </span>
          <span className="absolute bottom-3 left-3 grid size-9 place-items-center rounded-full bg-white/90 text-accent opacity-0 transition group-hover:opacity-100">
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
                active === i ? "border-accent" : "border-transparent hover:border-accent/40",
              )}
            >
              <img src={image} alt={`${property.title} ${i + 1}`} className="size-full object-cover" />
              {i === 3 && images.length > 4 ? (
                <span className="absolute inset-0 grid place-items-center bg-black/55 text-xs font-bold text-white">
                  +{fa(images.length - 4)} عکس
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

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
            <img
              src={images[active]}
              alt={property.title}
              className="max-h-full max-w-full rounded-2xl object-contain"
            />
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
                <img src={image} alt="" className="size-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

export function PropertyActions({ property }: { property: Property }) {
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
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => toggleFavorite(property.id, property.title)}
        className={cn(
          "flex h-9 items-center gap-1.5 rounded-full border px-3 text-[10px] font-semibold transition",
          fav
            ? "border-rose-200 bg-rose-50 text-rose-500"
            : "border-line bg-white text-muted hover:border-accent/30 hover:text-accent",
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
            ? "border-accent/30 bg-soft text-accent"
            : "border-line bg-white text-muted hover:border-accent/30 hover:text-accent",
        )}
      >
        <Scale size={14} />
        مقایسه
      </button>
      <button
        type="button"
        onClick={share}
        className="grid size-9 place-items-center rounded-full border border-line bg-white text-muted transition hover:border-accent/30 hover:text-accent"
        aria-label="اشتراک‌گذاری"
      >
        <Share2 size={14} />
      </button>
    </div>
  );
}

export function ContactCard({ property }: { property: Property }) {
  const consultant = getConsultant(property.consultantId);
  const { pushToast } = useApp();
  const [modal, setModal] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "عصر" });
  const price = propertyPrice(property);

  if (!consultant) return null;

  return (
    <>
      <div className="overflow-hidden rounded-[1.4rem] border border-line bg-white shadow-[0_20px_60px_-40px_rgba(20,32,27,0.45)]">
        <div className="border-b border-line bg-[#faf8f2] p-5">
          <span className="text-[10px] text-muted">
            {property.dealType === "sale" ? "قیمت فروش" : "شرایط پرداخت"}
          </span>
          <div className="mt-1 flex flex-wrap items-baseline gap-1.5">
            <span className="text-2xl font-black tracking-tight text-accent">{price.main}</span>
            <span className="text-[10px] text-muted">{price.unit}</span>
          </div>
          {price.sub ? <p className="mt-1 text-[11px] text-muted">{price.sub}</p> : null}
          <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-[10px] text-muted">
            <span>قیمت هر متر</span>
            <span className="font-bold text-ink">
              {fa(pricePerMeter(property))} تومان
            </span>
          </div>
          {property.dealType === "sale" ? (
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted">
              <span>کد فایل</span>
              <span className="font-semibold text-ink">{property.id.toUpperCase()}-۱۴۰۴</span>
            </div>
          ) : null}
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
                <Star size={9} className="fill-[#c19a4b] text-[#c19a4b]" />
                {fa(consultant.rating)} · {fa(consultant.deals)} معامله
              </div>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-soft px-2 py-1 text-[8px] font-semibold text-accent">
              <ShieldCheck size={10} /> تاییدشده
            </span>
          </div>

          <div className="mt-4 space-y-2">
            <button
              type="button"
              onClick={() => setModal(true)}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent text-xs font-bold text-white transition hover:bg-[#0b4a3d]"
            >
              <CalendarDays size={16} /> درخواست بازدید
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

          <p className="mt-3 text-center text-[9px] leading-5 text-muted">
            مشاوره و بازدید اولیه رایگان است · پاسخ در کمتر از ۲۴ ساعت
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-[1.4rem] border border-[#d9b872]/25 bg-[#0b2f27] p-5 text-white">
        <div className="flex items-center gap-2 text-[11px] font-bold text-[#d9b872]">
          <Star size={13} fill="currentColor" /> معامله‌ی مطمئن با آرامش
        </div>
        <p className="mt-2 text-[10.5px] leading-6 text-white/55">
          تمام مدارک این ملک توسط کارشناس حقوقی بررسی شده است. قرارداد و انتقال سند با
          همراهی تیم آرامش انجام می‌شود.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["سند بررسی‌شده", "قرارداد رسمی", "پشتیبانی حقوقی"].map((t) => (
            <span
              key={t}
              className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.05] px-2 py-1 text-[8.5px] text-white/65"
            >
              <Check size={9} className="text-[#d9b872]" /> {t}
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
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <div className="animate-fade-up relative w-full max-w-md overflow-hidden rounded-[1.5rem] border border-line bg-[#f7f4ed] shadow-2xl">
            <div className="flex items-center justify-between border-b border-line bg-white px-5 py-4">
              <div>
                <h3 className="text-sm font-bold">درخواست بازدید</h3>
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
                pushToast("درخواست بازدید ثبت شد؛ مشاور تا ۲۴ ساعت آینده تماس می‌گیرد.");
                setForm({ name: "", phone: "", date: "", time: "عصر" });
              }}
              className="space-y-3 p-5"
            >
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
                          ? "border-accent bg-accent text-white"
                          : "border-line bg-white text-muted",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent text-xs font-bold text-white"
              >
                <CalendarDays size={15} /> ثبت درخواست بازدید
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

export function PriceSummary({ property }: { property: Property }) {
  return <span>{formatPriceFull(property.price)}</span>;
}
