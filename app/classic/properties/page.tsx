import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft, Home, SlidersHorizontal } from "lucide-react";
import { Container } from "@/components/ui/layout";
import { PropertiesExplorer } from "@/components/classic/properties-explorer";
import { fa } from "@/lib/utils";
import { properties } from "@/lib/data";

export const metadata = {
  title: "املاک | آرامش کلاسیک",
  description: "جست‌وجو و فیلتر پیشرفته‌ی املاک تهران؛ خرید، فروش، رهن و اجاره.",
};

export default function PropertiesPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-[#f0ebdf]/60">
        <div className="pointer-events-none absolute -left-20 -top-20 size-72 rounded-full border border-[#c19a4b]/20" />
        <div className="pointer-events-none absolute -left-8 -top-8 size-44 rounded-full border border-[#c19a4b]/15" />
        <div className="pointer-events-none absolute right-10 top-8 hidden text-[110px] font-black leading-none text-transparent [-webkit-text-stroke:1px_#e3dbcb] lg:block">
          املاک
        </div>
        <Container className="relative py-10 lg:py-14">
          <nav className="flex items-center gap-1.5 text-[10px] text-muted">
            <Link href="/classic" className="flex items-center gap-1 transition hover:text-accent">
              <Home size={12} /> خانه
            </Link>
            <ChevronLeft size={11} />
            <span className="text-ink">املاک</span>
          </nav>
          <div className="mt-5 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/15 bg-soft px-3 py-1 text-[10px] font-semibold text-accent">
                <SlidersHorizontal size={11} /> جست‌وجوی پیشرفته
              </span>
              <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-4xl">
                همه‌ی املاک <span className="text-accent">آرامش</span>
              </h1>
              <p className="mt-2 max-w-xl text-[12px] leading-6 text-muted">
                {fa(properties.length)} فایل فعال و بررسی‌شده در محله‌های تهران؛ با فیلتر
                دقیق، عکس‌های واقعی و مشاور اختصاصی.
              </p>
            </div>
            <div className="flex gap-5 border-t border-line pt-4 text-[10px] text-muted lg:border-0 lg:pt-0">
              <div>
                <span className="block text-base font-extrabold text-ink">۱۴</span>
                فایل فعال
              </div>
              <div className="h-8 w-px bg-line" />
              <div>
                <span className="block text-base font-extrabold text-ink">۶</span>
                محله منتخب
              </div>
              <div className="h-8 w-px bg-line" />
              <div>
                <span className="block text-base font-extrabold text-ink">۲۴ ساعت</span>
                زمان پاسخ مشاور
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Suspense
        fallback={
          <Container className="py-14">
            <div className="grid animate-pulse gap-6 lg:grid-cols-[280px_1fr]">
              <div className="h-[520px] rounded-2xl bg-surface2" />
              <div className="grid gap-4 sm:grid-cols-2">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-80 rounded-2xl bg-surface2" />
                ))}
              </div>
            </div>
          </Container>
        }
      >
        <PropertiesExplorer />
      </Suspense>
    </>
  );
}
