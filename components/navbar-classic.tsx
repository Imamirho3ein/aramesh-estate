"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  Heart,
  Menu,
  Phone,
  PlusCircle,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Container } from "@/components/ui/layout";
import { cn } from "@/lib/utils";
import { useApp } from "@/components/providers";

const links = [
  { href: "/classic", label: "خانه" },
  { href: "/classic/properties", label: "املاک" },
  { href: "/classic/consultants", label: "مشاوران" },
  { href: "/classic/dashboard", label: "پنل مدیریت" },
  { href: "/classic/panel", label: "پنل مشاور" },
];

export function NavbarClassic() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { favorites } = useApp();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50">
      <div className="hidden bg-[#0b2f27] text-[#f7f4ed] md:block">
        <Container className="flex h-9 items-center justify-between text-[11px]">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 text-white/75">
              <Phone size={12} /> ۰۲۱ ۲۲۴۴ ۸۸۹۰
            </span>
            <span className="text-white/45">شنبه تا پنجشنبه، ۹ تا ۲۰</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#d9b872]">
              <Sparkles size={12} />
              پکیج ۱ · وب‌سایت حرفه‌ای املاک
            </span>
            <Link href="/" className="text-white/60 transition hover:text-white">
              تغییر دمو
            </Link>
          </div>
        </Container>
      </div>

      <div
        className={cn(
          "classic-nav border-b border-line/70 transition-all duration-300",
          scrolled && "shadow-[0_10px_40px_-24px_rgba(20,32,27,0.35)]",
        )}
      >
        <Container className="flex h-[72px] items-center justify-between gap-6">
          <Logo href="/classic" />

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((link) => {
              const active =
                link.href === "/classic"
                  ? pathname === "/classic"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-[13px] font-medium transition",
                    active
                      ? "bg-soft text-accent"
                      : "text-muted hover:bg-soft/60 hover:text-ink",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <button
              type="button"
              className="flex items-center gap-1 rounded-full px-3.5 py-2 text-[13px] font-medium text-muted transition hover:bg-soft/60 hover:text-ink"
            >
              بیشتر <ChevronDown size={13} />
            </button>
          </nav>

          <div className="hidden items-center gap-2.5 sm:flex">
            <Link
              href="/smart/account"
              className="relative grid size-10 place-items-center rounded-full border border-line text-muted transition hover:border-accent/30 hover:text-accent"
              aria-label="علاقه‌مندی‌ها"
            >
              <Heart size={17} />
              {favorites.length ? (
                <span className="absolute -top-1 -right-1 grid size-4.5 place-items-center rounded-full bg-accent text-[9px] font-bold text-white">
                  {favorites.length}
                </span>
              ) : null}
            </Link>
            <Link
              href="/classic/login"
              className="flex h-10 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold text-ink transition hover:bg-soft"
            >
              <UserRound size={16} className="text-muted" />
              ورود
            </Link>
            <Link
              href="/classic/panel"
              className="group flex h-10 items-center gap-2 rounded-full bg-accent px-4 text-[13px] font-bold text-white shadow-[0_8px_24px_-10px_rgba(14,90,74,0.65)] transition hover:bg-[#0b4a3d]"
            >
              <PlusCircle size={16} />
              ثبت ملک
              <ArrowLeft size={14} className="transition group-hover:-translate-x-0.5" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-full border border-line text-ink lg:hidden"
            aria-label="منو"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </Container>
      </div>

      {open ? (
        <div className="border-b border-line bg-surface shadow-xl lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-xl px-3 py-3 text-sm font-medium",
                  pathname === link.href ? "bg-soft text-accent" : "text-ink hover:bg-soft/60",
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-line pt-3">
              <Link
                href="/classic/login"
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-line text-sm font-semibold"
              >
                <UserRound size={16} /> ورود
              </Link>
              <Link
                href="/classic/panel"
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-accent text-sm font-bold text-white"
              >
                <PlusCircle size={16} /> ثبت ملک
              </Link>
            </div>
            <Link href="/" className="mt-1 py-2 text-center text-xs text-muted">
              تغییر دمو / بازگشت به صفحه‌ی انتخاب پکیج
            </Link>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
