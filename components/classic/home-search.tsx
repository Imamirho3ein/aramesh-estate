"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { districts } from "@/lib/data";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "sale", label: "خرید" },
  { id: "rent", label: "رهن و اجاره" },
  { id: "mortgage", label: "رهن کامل" },
];

const categories = [
  { value: "", label: "همه انواع ملک" },
  { value: "apartment", label: "آپارتمان" },
  { value: "villa", label: "ویلا" },
  { value: "penthouse", label: "پنت‌هاوس" },
  { value: "office", label: "اداری" },
  { value: "duplex", label: "دوبلکس" },
  { value: "studio", label: "استودیو" },
];

const budgets = [
  { value: "", label: "هر بودجه‌ای" },
  { value: "5000000000", label: "تا ۵ میلیارد" },
  { value: "10000000000", label: "تا ۱۰ میلیارد" },
  { value: "15000000000", label: "تا ۱۵ میلیارد" },
  { value: "25000000000", label: "تا ۲۵ میلیارد" },
  { value: "40000000000", label: "تا ۴۰ میلیارد" },
  { value: "80000000000", label: "بالای ۴۰ میلیارد" },
];

export function HomeSearch() {
  const router = useRouter();
  const [deal, setDeal] = useState("sale");
  const [district, setDistrict] = useState("");
  const [category, setCategory] = useState("");
  const [max, setMax] = useState("");

  const submit = () => {
    const params = new URLSearchParams();
    params.set("deal", deal);
    if (district) params.set("district", district);
    if (category) params.set("category", category);
    if (max) params.set("max", max);
    router.push(`/classic/properties?${params.toString()}`);
  };

  return (
    <div className="relative">
      <div className="rounded-[1.6rem] border border-line bg-surface p-3 shadow-[0_28px_80px_-32px_rgba(20,32,27,0.35)] sm:p-4">
        <div className="flex items-center gap-1 rounded-xl bg-surface2/70 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setDeal(tab.id);
                setMax("");
              }}
              className={cn(
                "flex-1 rounded-lg py-2 text-[11px] font-semibold transition sm:text-xs",
                deal === tab.id
                  ? "bg-white text-accent shadow-sm"
                  : "text-muted hover:text-ink",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
          <label className="relative block">
            <span className="mb-1.5 block px-1 text-[9px] font-medium text-muted">منطقه</span>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="field !py-2.5 !text-[11px]"
            >
              <option value="">همه مناطق تهران</option>
              {districts.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}
                </option>
              ))}
              <option value="ونک">ونک</option>
              <option value="پاسداران">پاسداران</option>
              <option value="جردن">جردن</option>
              <option value="تجریش">تجریش</option>
              <option value="ولنجک">ولنجک</option>
              <option value="اکباتان">اکباتان</option>
            </select>
          </label>

          <label className="relative block">
            <span className="mb-1.5 block px-1 text-[9px] font-medium text-muted">نوع ملک</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="field !py-2.5 !text-[11px]"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>

          <label className="relative block">
            <span className="mb-1.5 block px-1 text-[9px] font-medium text-muted">
              {deal === "sale" ? "حداکثر قیمت" : "حداکثر ودیعه"}
            </span>
            <select
              value={max}
              onChange={(e) => setMax(e.target.value)}
              className="field !py-2.5 !text-[11px]"
            >
              {budgets.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={submit}
            className="group flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-xs font-bold text-white shadow-[0_10px_28px_-10px_rgba(14,90,74,0.7)] transition hover:bg-[#0b4a3d] lg:mt-[22px] lg:h-[42px]"
          >
            <Search size={16} />
            جست‌وجو
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-muted">
          <span className="text-muted/70">پرجست‌وجوترین‌ها:</span>
          {["زعفرانیه", "الهیه", "نیاوران", "سعادت‌آباد"].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => router.push(`/classic/properties?district=${encodeURIComponent(d)}`)}
              className="rounded-full border border-line bg-white/60 px-2.5 py-1 transition hover:border-accent/30 hover:text-accent"
            >
              {d}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => router.push("/classic/properties")}
          className="flex items-center gap-1 text-[10px] font-semibold text-accent transition hover:opacity-75"
        >
          <SlidersHorizontal size={12} />
          جست‌وجوی پیشرفته
        </button>
      </div>
    </div>
  );
}
