"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowUpLeft,
  Bot,
  Heart,
  Menu,
  Scale,
  Sparkles,
  X,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Container } from "@/components/ui/layout";
import { cn } from "@/lib/utils";
import { useApp } from "@/components/providers";

const links = [
  { href: "/smart", label: "خانه" },
  { href: "/smart/explore", label: "جست‌وجوی هوشمند" },
  { href: "/smart/compare", label: "مقایسه" },
  { href: "/smart/account", label: "پنل من" },
  { href: "/smart/crm", label: "CRM" },
];

export function NavbarSmart() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { favorites, compare } = useApp();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-accent/15 bg-[#0a120c]">
        <Container className="flex h-8 items-center justify-between text-[10px] sm:text-[11px]">
          <span className="flex items-center gap-1.5 text-accent">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
            </span>
            پکیج ۲ · سامانه هوشمند و پیشرفته املاک
          </span>
          <Link href="/" className="text-white/45 transition hover:text-accent">
            تغییر دمو
          </Link>
        </Container>
      </div>

      <div className="glass-nav border-b border-line/80">
        <Container className="flex h-[74px] items-center justify-between gap-6">
          <Logo href="/smart" variant="smart" />

          <nav className="hidden items-center gap-0.5 lg:flex">
            {links.map((link) => {
              const active =
                link.href === "/smart" ? pathname === "/smart" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-[13px] font-medium transition",
                    active
                      ? "bg-accent/10 text-accent"
                      : "text-muted hover:bg-white/[0.04] hover:text-ink",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 sm:flex">
            <Link
              href="/smart/compare"
              className="relative grid size-10 place-items-center rounded-full border border-line text-muted transition hover:border-accent/30 hover:text-accent"
              aria-label="مقایسه"
            >
              <Scale size={17} />
              {compare.length ? (
                <span className="absolute -top-1 -right-1 grid size-4.5 place-items-center rounded-full bg-accent text-[9px] font-bold text-[#0a0f0c]">
                  {compare.length}
                </span>
              ) : null}
            </Link>
            <Link
              href="/smart/account"
              className="relative grid size-10 place-items-center rounded-full border border-line text-muted transition hover:border-accent/30 hover:text-accent"
              aria-label="علاقه‌مندی‌ها"
            >
              <Heart size={17} />
              {favorites.length ? (
                <span className="absolute -top-1 -right-1 grid size-4.5 place-items-center rounded-full bg-accent text-[9px] font-bold text-[#0a0f0c]">
                  {favorites.length}
                </span>
              ) : null}
            </Link>
            <Link
              href="/smart/explore#assistant"
              className="group flex h-10 items-center gap-2 rounded-full bg-accent px-4 text-[13px] font-bold text-[#0a0f0c] shadow-[0_0_30px_-6px_rgba(200,244,90,0.45)] transition hover:bg-[#d4fa7a]"
            >
              <Sparkles size={15} />
              دستیار هوشمند
              <ArrowUpLeft size={14} className="transition group-hover:-translate-y-0.5 group-hover:-translate-x-0.5" />
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
        <div className="border-b border-line bg-[#080d10] shadow-2xl lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-xl px-3 py-3 text-sm font-medium",
                  pathname === link.href
                    ? "bg-accent/10 text-accent"
                    : "text-ink hover:bg-white/5",
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-line pt-3">
              <Link
                href="/smart/explore"
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-accent text-sm font-bold text-[#0a0f0c]"
              >
                <Bot size={16} /> جست‌وجوی هوشمند
              </Link>
              <Link
                href="/smart/account"
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-line text-sm font-semibold"
              >
                <Heart size={16} /> پنل من
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
