"use client";

import Link from "next/link";
import {
  ArrowUpLeft,
  Bath,
  BedDouble,
  Car,
  Heart,
  MapPin,
  Ruler,
  ScanEye,
  Scale,
  Sparkles,
  Star,
} from "lucide-react";
import type { Property } from "@/lib/types";
import { asset } from "@/lib/asset";
import {
  categoryLabels,
  cn,
  dealLabels,
  fa,
  propertyPrice,
} from "@/lib/utils";
import { useApp } from "@/components/providers";

export function PropertyCardClassic({
  property,
  layout = "grid",
}: {
  property: Property;
  layout?: "grid" | "row";
}) {
  const { isFavorite, isCompare, toggleFavorite, toggleCompare } = useApp();
  const price = propertyPrice(property);
  const fav = isFavorite(property.id);
  const cmp = isCompare(property.id);

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[1.35rem] border border-line bg-surface card-lift hover:shadow-[0_22px_60px_-24px_rgba(20,32,27,0.28)]",
        layout === "row" && "sm:flex",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-surface2",
          layout === "grid" ? "aspect-[4/3]" : "aspect-[4/3] sm:aspect-auto sm:w-[44%] sm:min-h-[250px]",
        )}
      >
        <img
          src={asset(property.images[0])}
          alt={property.title}
          loading="lazy"
          className="size-full object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/5" />

        <div className="absolute top-3.5 right-3.5 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-[#0e5a4a] px-3 py-1 text-[11px] font-bold text-white shadow-sm">
            {dealLabels[property.dealType]}
          </span>
        </div>

        <div className="absolute top-3.5 left-3.5 z-20 flex gap-1.5">
          <button
            type="button"
            onClick={() => toggleFavorite(property.id, property.title)}
            aria-label="افزودن به علاقه‌مندی"
            className={cn(
              "grid size-8 place-items-center rounded-full bg-white/92 backdrop-blur transition hover:bg-white",
              fav ? "text-rose-500" : "text-[#3d4742]",
            )}
          >
            <Heart size={15} fill={fav ? "currentColor" : "none"} />
          </button>
          <button
            type="button"
            onClick={() => toggleCompare(property.id, property.title)}
            aria-label="افزودن به مقایسه"
            className={cn(
              "grid size-8 place-items-center rounded-full bg-white/92 backdrop-blur transition hover:bg-white",
              cmp ? "text-[#0e5a4a]" : "text-[#3d4742]",
            )}
          >
            <Scale size={15} />
          </button>
        </div>

        <div className="absolute bottom-3.5 right-4 flex items-center gap-1 text-[11px] font-semibold text-white/90">
          <MapPin size={12} />
          {property.district}، تهران
        </div>
        {property.featured ? (
          <div className="absolute bottom-3.5 left-4 flex items-center gap-1 rounded-full bg-[#c19a4b] px-2 py-1 text-[10px] font-bold text-white">
            <Star size={10} fill="currentColor" /> ویژه
          </div>
        ) : null}
      </div>

      <div className={cn("flex flex-1 flex-col p-5", layout === "row" && "sm:p-6")}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[11px] font-medium text-muted">
              {categoryLabels[property.category]}
              <span className="divider-dot" />
              {fa(property.area)} متر
            </span>
            <h3 className="mt-1 text-[17px] font-bold leading-7 text-ink transition group-hover:text-accent">
              <Link href={`/classic/properties/${property.id}`} className="outline-none">
                <span className="absolute inset-0 z-10" />
                {property.title}
              </Link>
            </h3>
          </div>
          <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-full border border-line text-muted transition group-hover:border-accent group-hover:bg-accent group-hover:text-white">
            <ArrowUpLeft size={15} />
          </span>
        </div>

        <p className="mt-2 line-clamp-1 text-xs leading-6 text-muted">{property.address}</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-line/80 py-3 text-[12px] text-muted">
          <span className="flex items-center gap-1.5">
            <BedDouble size={15} className="text-accent/80" /> {fa(property.rooms)} خواب
          </span>
          <span className="flex items-center gap-1.5">
            <Bath size={15} className="text-accent/80" /> {fa(property.bathrooms)} سرویس
          </span>
          <span className="flex items-center gap-1.5">
            <Car size={15} className="text-accent/80" /> {fa(property.parking)} پارکینگ
          </span>
          <span className="flex items-center gap-1.5">
            <Ruler size={15} className="text-accent/80" /> {fa(property.area)} متر
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            <span className="text-[10px] text-muted">
              {property.dealType === "rent" ? "ودیعه / اجاره" : "قیمت"}
            </span>
            <div className="mt-0.5 flex flex-wrap items-baseline gap-1">
              <span className="text-lg font-extrabold tracking-tight text-accent">{price.main}</span>
              <span className="text-[10px] text-muted">{price.unit}</span>
            </div>
            {price.sub ? <span className="text-[10px] text-muted">{price.sub}</span> : null}
          </div>
          <span className="rounded-full bg-soft px-3 py-1.5 text-[10px] font-semibold text-accent">
            {property.status === "active" ? "فعال" : "در حال بررسی"}
          </span>
        </div>
      </div>
    </article>
  );
}

export function PropertyCardSmart({ property }: { property: Property }) {
  const { isFavorite, isCompare, toggleFavorite, toggleCompare } = useApp();
  const price = propertyPrice(property);
  const fav = isFavorite(property.id);
  const cmp = isCompare(property.id);

  return (
    <article className="group relative overflow-hidden rounded-[1.4rem] border border-line bg-surface/70 card-lift hover:border-accent/35 hover:shadow-[0_24px_70px_-28px_rgba(200,244,90,0.18)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={asset(property.images[0])}
          alt={property.title}
          loading="lazy"
          className="size-full object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06090c] via-transparent to-black/20" />

        <div className="absolute top-3.5 right-3.5 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full border border-accent/25 bg-[#06090c]/70 px-2.5 py-1 text-[10px] font-bold text-accent backdrop-blur">
            {dealLabels[property.dealType]}
          </span>
          {property.tour ? (
            <span className="flex items-center gap-1 rounded-full border border-white/15 bg-black/50 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur">
              <ScanEye size={11} /> ۳۶۰°
            </span>
          ) : null}
        </div>

        <div className="absolute top-3.5 left-3.5 z-20 flex gap-1.5">
          <button
            type="button"
            onClick={() => toggleFavorite(property.id, property.title)}
            aria-label="افزودن به علاقه‌مندی"
            className={cn(
              "grid size-8 place-items-center rounded-full border border-white/15 bg-black/45 backdrop-blur transition hover:bg-black/70",
              fav ? "text-rose-400" : "text-white/80",
            )}
          >
            <Heart size={15} fill={fav ? "currentColor" : "none"} />
          </button>
          <button
            type="button"
            onClick={() => toggleCompare(property.id, property.title)}
            aria-label="افزودن به مقایسه"
            className={cn(
              "grid size-8 place-items-center rounded-full border border-white/15 bg-black/45 backdrop-blur transition hover:bg-black/70",
              cmp ? "text-accent" : "text-white/80",
            )}
          >
            <Scale size={15} />
          </button>
        </div>

        {property.aiScore ? (
          <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5 rounded-full border border-accent/30 bg-[#06090c]/75 px-2.5 py-1 text-[10px] font-bold text-accent backdrop-blur">
            <Sparkles size={11} /> امتیاز هوشمند {fa(property.aiScore)}
          </div>
        ) : null}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-medium text-muted">
              {categoryLabels[property.category]} · {property.district}
            </span>
            <h3 className="mt-1 text-base font-bold leading-7 text-ink transition group-hover:text-accent">
              <Link href={`/smart/properties/${property.id}`} className="outline-none">
                <span className="absolute inset-0 z-10" />
                {property.title}
              </Link>
            </h3>
          </div>
          <span className="mt-0.5 flex items-center gap-1 rounded-full border border-line px-2 py-1 text-[10px] text-muted">
            <ScanEye size={11} /> {fa(property.views)}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-3 border-y border-line/80 py-3 text-[11px] text-muted">
          <span className="flex items-center gap-1.5">
            <BedDouble size={14} /> {fa(property.rooms)}
          </span>
          <span className="h-3 w-px bg-line" />
          <span className="flex items-center gap-1.5">
            <Bath size={14} /> {fa(property.bathrooms)}
          </span>
          <span className="h-3 w-px bg-line" />
          <span className="flex items-center gap-1.5">
            <Ruler size={14} /> {fa(property.area)} متر
          </span>
          <span className="h-3 w-px bg-line" />
          <span className="flex items-center gap-1.5">
            <Car size={14} /> {fa(property.parking)}
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <span className="text-[10px] text-muted">
              {property.dealType === "rent" ? "ودیعه / اجاره ماهانه" : "قیمت"}
            </span>
            <div className="mt-0.5 flex flex-wrap items-baseline gap-1">
              <span className="text-lg font-extrabold tracking-tight text-accent">{price.main}</span>
              <span className="text-[10px] text-muted">{price.unit}</span>
            </div>
            {price.sub ? <span className="text-[10px] text-muted">{price.sub}</span> : null}
          </div>
          <span className="grid size-9 place-items-center rounded-full bg-accent text-[#0a0f0c] transition group-hover:scale-110">
            <ArrowUpLeft size={16} />
          </span>
        </div>
      </div>
    </article>
  );
}
