"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Clock,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/layout";
import { Logo } from "@/components/ui/logo";
import { useApp } from "@/components/providers";

function Socials({ tone = "light" }: { tone?: "light" | "smart" }) {
  const base =
    tone === "smart"
      ? "border-line text-muted hover:border-accent/40 hover:text-accent"
      : "border-white/12 text-white/60 hover:border-white/30 hover:text-white";
  return (
    <div className="flex items-center gap-2">
      <a
        href="#"
        aria-label="اینستاگرام"
        className={`grid size-9 place-items-center rounded-full border transition ${base}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-4">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      </a>
      <a
        href="#"
        aria-label="تلگرام"
        className={`grid size-9 place-items-center rounded-full border transition ${base}`}
      >
        <Send size={15} />
      </a>
      <a
        href="#"
        aria-label="لینکدین"
        className={`grid size-9 place-items-center rounded-full border transition ${base}`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
          <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.6c0-1.34-.03-3.06-1.9-3.06-1.9 0-2.2 1.45-2.2 2.96V21h-4V9Z" />
        </svg>
      </a>
    </div>
  );
}

function Newsletter({
  variant = "classic",
}: {
  variant?: "classic" | "smart";
}) {
  const { pushToast } = useApp();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        pushToast("ایمیل شما ثبت شد؛ خبرها را زودتر دریافت می‌کنید.");
      }}
      className={`flex items-center gap-2 rounded-2xl border p-1.5 ${
        variant === "smart" ? "border-line bg-white/[0.03]" : "border-white/15 bg-white/[0.06]"
      }`}
    >
      <input
        type="email"
        required
        placeholder="ایمیل شما"
        className={`h-10 flex-1 bg-transparent px-3 text-xs outline-none ${
          variant === "smart" ? "text-ink placeholder:text-muted" : "text-white placeholder:text-white/40"
        }`}
      />
      <button
        type="submit"
        className={`flex h-10 items-center gap-1.5 rounded-xl px-3.5 text-xs font-bold transition ${
          variant === "smart"
            ? "bg-accent text-[#0a0f0c] hover:bg-[#d4fa7a]"
            : "bg-[#c19a4b] text-white hover:bg-[#ad8a3f]"
        }`}
      >
        عضویت <ArrowLeft size={14} />
      </button>
    </form>
  );
}

export function FooterClassic() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-[#0b2f27] text-[#f7f4ed]">
      <div className="pointer-events-none absolute -top-28 left-1/4 size-[420px] rounded-full bg-[#c19a4b]/10 blur-[100px]" />
      <Container className="relative py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1.2fr]">
          <div>
            <Logo href="/classic" variant="light" />
            <p className="mt-5 max-w-sm text-[13px] leading-7 text-white/55">
              آرامش؛ تجربه‌ای شفاف و حرفه‌ای از خرید، فروش، رهن و اجاره‌ی ملک در تهران.
              از اولین جست‌وجو تا تحویل کلید، کنار شما هستیم.
            </p>
            <div className="mt-6 flex items-center gap-2 text-[11px] text-[#d9b872]">
              <ShieldCheck size={15} />
              عضو اتحادیه مشاوران املاک تهران
            </div>
            <div className="mt-5">
              <Socials />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold">دسترسی سریع</h4>
            <ul className="mt-4 space-y-2.5 text-[12px] text-white/55">
              {[
                ["خانه", "/classic"],
                ["املاک", "/classic/properties"],
                ["مشاوران", "/classic/consultants"],
                ["پنل مدیریت", "/classic/dashboard"],
                ["پنل مشاور", "/classic/panel"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="transition hover:text-[#d9b872]">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold">خدمات</h4>
            <ul className="mt-4 space-y-2.5 text-[12px] text-white/55">
              {["خرید ملک", "فروش ملک", "رهن و اجاره", "مشاوره سرمایه‌گذاری", "ارزیابی قیمت"].map(
                (label) => (
                  <li key={label}>
                    <Link href="/classic/properties" className="transition hover:text-[#d9b872]">
                      {label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold">در تماس باشیم</h4>
            <ul className="mt-4 space-y-3 text-[12px] text-white/55">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="mt-0.5 shrink-0 text-[#d9b872]" />
                تهران، زعفرانیه، خیابان مقدس اردبیلی، پلاک ۲۴
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="shrink-0 text-[#d9b872]" /> ۰۲۱ ۲۲۴۴ ۸۸۹۰
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="shrink-0 text-[#d9b872]" /> hello@aramesh.demo
              </li>
              <li className="flex items-center gap-2.5">
                <Clock size={15} className="shrink-0 text-[#d9b872]" /> شنبه تا پنجشنبه، ۹ تا ۲۰
              </li>
            </ul>
            <div className="mt-5">
              <Newsletter />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-[11px] text-white/40 sm:flex-row">
          <p>© ۱۴۰۴ املاک آرامش. تمام حقوق محفوظ است.</p>
          <p className="flex items-center gap-1.5">
            <Sparkles size={12} className="text-[#d9b872]" />
            دموی پکیج ۱ · وب‌سایت حرفه‌ای املاک
          </p>
        </div>
      </Container>
    </footer>
  );
}

export function FooterSmart() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-[#06090c]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 size-[440px] rounded-full bg-accent/5 blur-[120px]" />
      <Container className="relative py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.7fr_0.9fr_1.2fr]">
          <div>
            <Logo href="/smart" variant="smart" />
            <p className="mt-5 max-w-sm text-[13px] leading-7 text-muted">
              سامانه‌ی هوشمند املاک آرامش؛ جست‌وجوی زبان طبیعی، تور ۳۶۰ درجه، نقشه‌ی تعاملی
              و CRM یکپارچه برای تیم‌های حرفه‌ای.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1.5 text-[11px] text-accent">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
              </span>
              همه‌ی سرویس‌ها آنلاین
            </div>
            <div className="mt-5">
              <Socials tone="smart" />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold">سامانه</h4>
            <ul className="mt-4 space-y-2.5 text-[12px] text-muted">
              {[
                ["جست‌وجوی هوشمند", "/smart/explore"],
                ["مقایسه املاک", "/smart/compare"],
                ["پنل مشتری", "/smart/account"],
                ["CRM مدیریت", "/smart/crm"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="transition hover:text-accent">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold">قابلیت‌ها</h4>
            <ul className="mt-4 space-y-2.5 text-[12px] text-muted">
              {[
                "تور مجازی ۳۶۰°",
                "دستیار هوشمند املاک",
                "نقشه‌ی تعاملی",
                "گزارش‌های پیشرفته",
                "آموزش مدیر و مشاور",
              ].map((label) => (
                <li key={label} className="flex items-center gap-1.5">
                  <Check size={12} className="text-accent" /> {label}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold">خبرنامه هوشمند</h4>
            <p className="mt-3 text-[12px] leading-6 text-muted">
              فایل‌های منتخب و تحلیل هفتگی بازار را دریافت کنید.
            </p>
            <div className="mt-4">
              <Newsletter variant="smart" />
            </div>
            <div className="mt-5 flex items-center gap-2 text-[11px] text-muted">
              <MapPin size={13} className="text-accent" /> تهران، زعفرانیه، مقدس اردبیلی
            </div>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-muted">
              <Phone size={13} className="text-accent" /> ۰۲۱ ۲۲۴۴ ۸۸۹۰
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-[11px] text-muted sm:flex-row">
          <p>© ۱۴۰۴ آرامش هوشمند. تمام حقوق محفوظ است.</p>
          <p className="flex items-center gap-1.5">
            <Sparkles size={12} className="text-accent" />
            دموی پکیج ۲ · سامانه هوشمند و پیشرفته املاک
          </p>
        </div>
      </Container>
    </footer>
  );
}
