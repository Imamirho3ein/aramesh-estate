"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  Eye,
  EyeOff,
  Lock,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react";
import { Container } from "@/components/ui/layout";
import { useApp } from "@/components/providers";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/utils";

const roles = [
  {
    id: "manager",
    label: "مدیر مجموعه",
    desc: "دسترسی به آگهی‌ها، سرنخ‌ها و گزارش‌ها",
    href: "/classic/dashboard",
    icon: Building2,
  },
  {
    id: "agent",
    label: "مشاور",
    desc: "مدیریت فایل‌های شخصی و مشتریان",
    href: "/classic/panel",
    icon: Users,
  },
  {
    id: "customer",
    label: "مشتری",
    desc: "علاقه‌مندی‌ها و درخواست بازدید",
    href: "/smart/account",
    icon: UserRound,
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { pushToast } = useApp();
  const [role, setRole] = useState("manager");
  const [showPass, setShowPass] = useState(false);
  const [phone, setPhone] = useState("۰۹۱۲ ۲۴۵ ۸۸۹۰");
  const [pass, setPass] = useState("aramesh-demo");

  const selected = roles.find((r) => r.id === role) ?? roles[0];

  return (
    <Container className="py-12 lg:py-20">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[1.8rem] border border-line bg-white shadow-[0_35px_100px_-45px_rgba(20,32,27,0.5)] lg:grid-cols-[1fr_0.9fr]">
        <div className="p-6 sm:p-9">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-soft px-3 py-1 text-[10px] font-semibold text-accent">
            <ShieldCheck size={12} /> ورود به حساب کاربری
          </span>
          <h1 className="mt-4 text-2xl font-black tracking-tight">خوش برگشتی 👋</h1>
          <p className="mt-2 text-[12px] leading-6 text-muted">
            برای ورود به پنل، نقش خود را انتخاب کن. در نسخه‌ی دمو، هر شماره و رمزی پذیرفته
            می‌شود.
          </p>

          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={cn(
                  "rounded-xl border p-3 text-start transition",
                  role === r.id
                    ? "border-accent bg-soft/70 shadow-sm"
                    : "border-line hover:border-accent/25",
                )}
              >
                <r.icon
                  size={17}
                  className={role === r.id ? "text-accent" : "text-muted"}
                />
                <div className="mt-2 text-[10.5px] font-bold">{r.label}</div>
                <div className="mt-0.5 text-[8.5px] leading-4 text-muted">{r.desc}</div>
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              pushToast(`ورود موفق به‌عنوان ${selected.label}`);
              router.push(selected.href);
            }}
            className="mt-6 space-y-3"
          >
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-medium text-muted">شماره موبایل</span>
              <div className="relative">
                <Phone size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="field !py-3 !pe-9 !text-[11px]"
                  inputMode="tel"
                  required
                />
              </div>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-medium text-muted">رمز عبور</span>
              <div className="relative">
                <Lock size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type={showPass ? "text" : "password"}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  className="field !py-3 !ps-10 !pe-9 !text-[11px]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  aria-label="نمایش رمز"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </label>
            <div className="flex items-center justify-between text-[9.5px]">
              <label className="flex items-center gap-1.5 text-muted">
                <input type="checkbox" defaultChecked className="accent-[#0e5a4a]" />
                مرا به خاطر بسپار
              </label>
              <button type="button" className="text-accent hover:underline">
                فراموشی رمز؟
              </button>
            </div>
            <button
              type="submit"
              className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent text-xs font-bold text-white transition hover:bg-[#0b4a3d]"
            >
              ورود به {selected.label}
              <ArrowLeft size={15} className="transition group-hover:-translate-x-1" />
            </button>
          </form>

          <div className="mt-5 rounded-xl border border-dashed border-line bg-[#faf8f2] p-3 text-[9px] leading-5 text-muted">
            <span className="font-bold text-ink">دسترسی سریع دمو:</span> روی هر نقش بزن و
            مستقیم وارد پنل شو. اطلاعات نمونه است و تغییری در سامانه‌ی واقعی ایجاد نمی‌شود.
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-[10px]">
            <Link href="/classic" className="text-muted transition hover:text-accent">
              ← بازگشت به سایت
            </Link>
            <span className="flex items-center gap-1 text-muted">
              <BadgeCheck size={12} className="text-accent" /> اتصال امن SSL
            </span>
          </div>
        </div>

        <div className="relative hidden overflow-hidden bg-[#0b2f27] lg:block">
          <img
            src={asset("/images/interior-2.jpg")}
            alt="فضای داخلی لوکس"
            className="size-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b2f27] via-[#0b2f27]/40 to-[#0b2f27]/20" />
          <div className="absolute inset-x-0 bottom-0 p-8 text-white">
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-[#d9b872]">
              <Sparkles size={13} /> پکیج ۱ · وب‌سایت حرفه‌ای املاک
            </span>
            <h2 className="mt-3 text-2xl font-black leading-[1.4]">
              همه‌چیز برای مدیریت
              <br />
              یک مجموعه‌ی حرفه‌ای.
            </h2>
            <p className="mt-3 max-w-xs text-[11px] leading-6 text-white/55">
              آگهی‌ها، مشاوران، سرنخ‌ها و گزارش‌ها در یک پنل ساده و شفاف.
            </p>
            <div className="mt-5 flex gap-2">
              {["پنل مدیر", "پنل مشاور", "گزارش زنده"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[9px] text-white/65"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
