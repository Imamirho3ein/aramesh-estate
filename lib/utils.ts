import type { DealType, Property, PropertyCategory, PropertyStatus } from "./types";

const faFormatter = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 1 });
const faFullFormatter = new Intl.NumberFormat("fa-IR");

export function fa(value: number | string): string {
  if (typeof value === "string") {
    const n = Number(toEnglishDigits(value));
    return Number.isNaN(n) ? value : faFormatter.format(n);
  }
  return faFormatter.format(value);
}

export function faFull(value: number): string {
  return faFullFormatter.format(value);
}

export function toEnglishDigits(input: string): string {
  const map: Record<string, string> = {
    "۰": "0",
    "۱": "1",
    "۲": "2",
    "۳": "3",
    "۴": "4",
    "۵": "5",
    "۶": "6",
    "۷": "7",
    "۸": "8",
    "۹": "9",
    "٠": "0",
    "١": "1",
    "٢": "2",
    "٣": "3",
    "٤": "4",
    "٥": "5",
    "٦": "6",
    "٧": "7",
    "٨": "8",
    "٩": "9",
  };
  return input.replace(/[۰-۹٠-٩]/g, (d) => map[d] ?? d);
}

export function normalizeText(input: string): string {
  return toEnglishDigits(input)
    .replace(/[ي]/g, "ی")
    .replace(/[ك]/g, "ک")
    .replace(/\u200c/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function formatPriceShort(value: number): string {
  if (!value) return "توافقی";
  if (value >= 1_000_000_000) {
    const v = Math.round((value / 1_000_000_000) * 10) / 10;
    return `${fa(v)} میلیارد`;
  }
  if (value >= 1_000_000) {
    const v = Math.round(value / 1_000_000);
    return `${fa(v)} میلیون`;
  }
  return fa(value);
}

export function formatPriceFull(value: number): string {
  return `${faFull(value)} تومان`;
}

export const dealLabels: Record<DealType, string> = {
  sale: "فروش",
  rent: "رهن و اجاره",
  mortgage: "رهن کامل",
};

export const categoryLabels: Record<PropertyCategory, string> = {
  apartment: "آپارتمان",
  villa: "ویلا",
  penthouse: "پنت‌هاوس",
  office: "اداری",
  duplex: "دوبلکس",
  studio: "استودیو",
};

export const statusLabels: Record<PropertyStatus, string> = {
  active: "فعال",
  pending: "در انتظار تایید",
  sold: "فروخته شده",
  rented: "اجاره داده شده",
};

export function propertyPrice(property: Property): {
  main: string;
  sub?: string;
  unit: string;
} {
  if (property.dealType === "sale") {
    return { main: formatPriceShort(property.price), unit: "تومان" };
  }
  if (property.dealType === "mortgage") {
    return {
      main: formatPriceShort(property.deposit ?? 0),
      unit: "رهن کامل",
    };
  }
  return {
    main: `ودیعه ${formatPriceShort(property.deposit ?? 0)}`,
    sub: `اجاره ماهانه ${formatPriceShort(property.monthly ?? 0)}`,
    unit: "تومان",
  };
}

export function pricePerMeter(property: Property): number {
  if (!property.area) return 0;
  return Math.round(property.price / property.area);
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function withBase(path: string, base: string): string {
  return `${base}${path}`;
}

export function initials(name: string): string {
  const parts = name.trim().split(" ");
  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`;
}
