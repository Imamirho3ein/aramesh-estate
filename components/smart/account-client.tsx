"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpLeft,
  Bell,
  Bot,
  CalendarDays,
  Check,
  CircleCheck,
  Clock,
  Heart,
  Home,
  MapPin,
  MessageSquare,
  Pencil,
  Phone,
  Plus,
  Scale,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  UserRound,
  Wallet,
  X,
} from "lucide-react";
import { Container } from "@/components/ui/layout";
import { PropertyCardSmart } from "@/components/property-cards";
import { useApp } from "@/components/providers";
import {
  getConsultant,
  getProperty,
  messages as sampleMessages,
  properties,
} from "@/lib/data";
import type { Message, Property } from "@/lib/types";
import {
  categoryLabels,
  cn,
  fa,
  propertyPrice,
} from "@/lib/utils";

const tabs = [
  { id: "overview", label: "نمای کلی", icon: Home },
  { id: "favorites", label: "ذخیره‌ها", icon: Heart },
  { id: "compare", label: "مقایسه", icon: Scale },
  { id: "visits", label: "بازدیدها", icon: CalendarDays },
  { id: "messages", label: "پیام‌ها", icon: MessageSquare },
  { id: "profile", label: "پروفایل", icon: UserRound },
] as const;

type TabId = (typeof tabs)[number]["id"];

interface Visit {
  id: string;
  propertyId: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "done" | "canceled";
  mode: string;
  consultant: string;
  upcoming: boolean;
}

const visitSeed: Visit[] = [
  {
    id: "v1",
    propertyId: "p1",
    date: "پنجشنبه ۲۹ آبان",
    time: "۱۷:۳۰",
    status: "confirmed",
    mode: "حضوری",
    consultant: "سارا احمدی",
    upcoming: true,
  },
  {
    id: "v2",
    propertyId: "p5",
    date: "جمعه ۳۰ آبان",
    time: "۱۱:۰۰",
    status: "pending",
    mode: "حضوری",
    consultant: "نگار موسوی",
    upcoming: true,
  },
  {
    id: "v3",
    propertyId: "p10",
    date: "شنبه ۲۴ آبان",
    time: "۱۶:۰۰",
    status: "done",
    mode: "تور مجازی",
    consultant: "سارا احمدی",
    upcoming: false,
  },
  {
    id: "v4",
    propertyId: "p2",
    date: "دوشنبه ۱۹ آبان",
    time: "۱۰:۳۰",
    status: "canceled",
    mode: "حضوری",
    consultant: "امیر رضایی",
    upcoming: false,
  },
];

const visitMeta: Record<Visit["status"], { label: string; className: string }> = {
  confirmed: { label: "تاییدشده", className: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300" },
  pending: { label: "در انتظار تایید", className: "border-[#f5c86b]/25 bg-[#f5c86b]/10 text-[#f5c86b]" },
  done: { label: "انجام‌شده", className: "border-line bg-white/[0.03] text-muted" },
  canceled: { label: "لغو‌شده", className: "border-rose-400/25 bg-rose-400/10 text-rose-300" },
};

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className={cn("relative h-5 w-9 shrink-0 rounded-full transition", checked ? "bg-accent" : "bg-line")}
    >
      <span
        className={cn(
          "absolute top-0.5 size-4 rounded-full bg-white shadow transition",
          checked ? "right-0.5" : "right-[18px]",
        )}
      />
    </button>
  );
}

function propertyList(ids: string[]): Property[] {
  return ids.map((id) => getProperty(id)).filter((p): p is Property => Boolean(p));
}

export function SmartAccount() {
  const { favorites, compare, toggleFavorite, toggleCompare, setCompareIds, pushToast } = useApp();
  const [tab, setTab] = useState<TabId>("overview");
  const [visits, setVisits] = useState<Visit[]>(visitSeed);
  const [threads, setThreads] = useState<Message[]>(sampleMessages);
  const [activeThread, setActiveThread] = useState<string | null>("m1");
  const [reply, setReply] = useState("");
  const [sentReplies, setSentReplies] = useState<Record<string, string[]>>({});
  const [profileName, setProfileName] = useState("سارا محمدی");
  const [visitModal, setVisitModal] = useState(false);
  const [visitForm, setVisitForm] = useState({
    propertyId: "p1",
    date: "",
    time: "عصر",
    mode: "حضوری",
  });
  const [notifications, setNotifications] = useState({
    sms: true,
    email: true,
    priceAlert: true,
    assistant: false,
  });

  const favoriteProps = propertyList(favorites);
  const compareProps = propertyList(compare);
  const upcoming = visits.filter((v) => v.upcoming);
  const unread = threads.filter((m) => m.unread).length;
  const currentThread = threads.find((m) => m.id === activeThread) ?? null;

  const stats = [
    { label: "ملک ذخیره‌شده", value: fa(favorites.length), icon: Heart, tone: "text-rose-300" },
    { label: "در لیست مقایسه", value: fa(compare.length), icon: Scale, tone: "text-accent" },
    { label: "بازدید پیش‌رو", value: fa(upcoming.length), icon: CalendarDays, tone: "text-[#7de2c3]" },
    { label: "پیام خوانده‌نشده", value: fa(unread), icon: MessageSquare, tone: "text-[#f5c86b]" },
  ];

  const suggestions = properties.filter((p) => !favorites.includes(p.id)).slice(0, 3);

  const submitVisit = (e: React.FormEvent) => {
    e.preventDefault();
    const property = getProperty(visitForm.propertyId);
    if (!property) return;
    const formattedDate = visitForm.date
      ? new Intl.DateTimeFormat("fa-IR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          timeZone: "UTC",
        }).format(new Date(visitForm.date))
      : "تاریخ پیشنهادی";
    setVisits((prev) => [
      {
        id: `v-${Date.now()}`,
        propertyId: property.id,
        date: formattedDate,
        time: visitForm.time,
        status: "pending",
        mode: visitForm.mode,
        consultant: getConsultant(property.consultantId)?.name ?? "تیم آرامش",
        upcoming: true,
      },
      ...prev,
    ]);
    setVisitModal(false);
    setVisitForm({ propertyId: "p1", date: "", time: "عصر", mode: "حضوری" });
    pushToast("درخواست بازدید ثبت شد؛ مشاور برای هماهنگی نهایی تماس می‌گیرد.");
  };

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="smart-glow pointer-events-none absolute inset-0" />
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-[0.06]" />
        <Container className="relative py-8 lg:py-10">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div className="flex items-center gap-4">
              <span className="relative grid size-16 place-items-center rounded-[1.3rem] bg-gradient-to-br from-emerald-700 to-teal-500 text-lg font-bold text-white shadow-lg">
                {profileName.split(" ").map((part) => part[0]).slice(0, 2).join("‌")}
                <span className="absolute -bottom-1 -left-1 grid size-6 place-items-center rounded-full border-2 border-bg bg-accent text-[#0a0f0c]">
                  <Check size={12} />
                </span>
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-extrabold sm:text-2xl">سلام، {profileName}</h1>
                  <span className="flex items-center gap-1 rounded-full border border-accent/25 bg-accent/5 px-2.5 py-1 text-[8.5px] font-semibold text-accent">
                    <Star size={9} fill="currentColor" /> مشتری ویژه
                  </span>
                </div>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-muted">
                  <span className="flex items-center gap-1">
                    <Phone size={10} /> ۰۹۱۲ ۴۴۵ ۸۸۹۰
                  </span>
                  <span>·</span>
                  <span>عضو از فروردین ۱۴۰۴</span>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/smart/explore"
                className="flex h-10 items-center gap-1.5 rounded-xl border border-line px-3.5 text-[9.5px] font-semibold text-muted transition hover:border-accent/30 hover:text-accent"
              >
                <Sparkles size={13} /> جست‌وجوی هوشمند
              </Link>
              <button
                type="button"
                onClick={() => setVisitModal(true)}
                className="flex h-10 items-center gap-1.5 rounded-xl bg-accent px-4 text-[9.5px] font-bold text-[#0a0f0c] transition hover:bg-[#d4fa7a]"
              >
                <Plus size={13} /> درخواست بازدید
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {stats.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => {
                  if (s.label.includes("ذخیره")) setTab("favorites");
                  else if (s.label.includes("مقایسه")) setTab("compare");
                  else if (s.label.includes("بازدید")) setTab("visits");
                  else setTab("messages");
                }}
                className="flex items-center gap-3 rounded-xl border border-line bg-surface/50 px-3 py-3 text-start transition hover:border-accent/30"
              >
                <span className={cn("grid size-9 place-items-center rounded-xl bg-white/[0.04]", s.tone)}>
                  <s.icon size={16} />
                </span>
                <div>
                  <div className="text-lg font-extrabold">{s.value}</div>
                  <div className="text-[8px] text-muted">{s.label}</div>
                </div>
              </button>
            ))}
          </div>
        </Container>
      </section>

      <Container className="py-6 lg:py-9">
        <div className="mb-5 flex gap-1 overflow-x-auto rounded-2xl border border-line bg-surface/50 p-1.5 no-scrollbar">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-[10px] font-semibold transition",
                tab === t.id ? "bg-accent text-[#0a0f0c]" : "text-muted hover:bg-white/[0.04] hover:text-accent",
              )}
            >
              <t.icon size={13} /> {t.label}
              {t.id === "messages" && unread ? (
                <span
                  className={cn(
                    "grid size-4 place-items-center rounded-full text-[7.5px] font-bold",
                    tab === t.id ? "bg-[#0a0f0c]/15 text-[#0a0f0c]" : "bg-accent text-[#0a0f0c]",
                  )}
                >
                  {fa(unread)}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {tab === "overview" ? (
          <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="space-y-4">
              <div className="rounded-2xl border border-line bg-surface/40 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-bold">ملک‌های ذخیره‌شده</h2>
                    <p className="mt-0.5 text-[9px] text-muted">
                      {favorites.length ? `${fa(favorites.length)} فایل در لیست تو` : "هنوز فایلی ذخیره نکرده‌ای"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTab("favorites")}
                    className="flex items-center gap-1 text-[9px] font-semibold text-accent"
                  >
                    مشاهده همه <ArrowLeft size={11} />
                  </button>
                </div>
                {favoriteProps.length ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {favoriteProps.slice(0, 2).map((p) => (
                      <PropertyCardSmart key={p.id} property={p} />
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {suggestions.map((p) => (
                      <Link
                        key={p.id}
                        href={`/smart/properties/${p.id}`}
                        className="group overflow-hidden rounded-xl border border-line bg-white/[0.02] transition hover:border-accent/30"
                      >
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="size-full object-cover transition duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#06090c]/80 to-transparent" />
                          <span className="absolute bottom-2 right-2 text-[8.5px] font-bold text-accent">
                            {propertyPrice(p).main}
                          </span>
                        </div>
                        <div className="p-2.5">
                          <div className="truncate text-[9.5px] font-bold">{p.title}</div>
                          <div className="mt-0.5 flex items-center gap-1 text-[7.5px] text-muted">
                            <MapPin size={8} /> {p.district} · {fa(p.area)} متر
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-line bg-surface/40 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-bold">بازدیدهای پیش‌رو</h2>
                    <p className="mt-0.5 text-[9px] text-muted">زمان و مشاور هر بازدید را ببین</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTab("visits")}
                    className="flex items-center gap-1 text-[9px] font-semibold text-accent"
                  >
                    تقویم بازدیدها <ArrowLeft size={11} />
                  </button>
                </div>
                <div className="mt-3 space-y-2">
                  {upcoming.length ? (
                    upcoming.map((v) => {
                      const p = getProperty(v.propertyId);
                      const meta = visitMeta[v.status];
                      return (
                        <div
                          key={v.id}
                          className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-white/[0.02] p-3"
                        >
                          <span className="grid size-10 place-items-center rounded-xl bg-accent/10 text-accent">
                            <CalendarDays size={17} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-[10.5px] font-semibold">{p?.title}</div>
                            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[8px] text-muted">
                              <span>{v.date}</span>
                              <span>·</span>
                              <span>{v.time}</span>
                              <span>·</span>
                              <span>{v.mode}</span>
                            </div>
                          </div>
                          <span className={cn("rounded-full border px-2 py-1 text-[7.5px] font-semibold", meta.className)}>
                            {meta.label}
                          </span>
                          <Link
                            href={`/smart/properties/${v.propertyId}`}
                            className="grid size-8 place-items-center rounded-lg border border-line text-muted transition hover:text-accent"
                            aria-label="مشاهده ملک"
                          >
                            <ArrowUpLeft size={12} />
                          </Link>
                        </div>
                      );
                    })
                  ) : (
                    <div className="rounded-xl border border-dashed border-line p-5 text-center text-[9.5px] text-muted">
                      بازدید پیش‌رویی نداری. از صفحه‌ی هر ملک درخواست بازدید بده.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/[0.07] to-transparent p-5">
                <div className="pointer-events-none absolute -left-8 -top-8 size-28 rounded-full bg-accent/10 blur-2xl" />
                <div className="flex items-center gap-2">
                  <span className="grid size-9 place-items-center rounded-xl bg-accent text-[#0a0f0c]">
                    <Bot size={17} />
                  </span>
                  <div>
                    <div className="text-[11px] font-bold">دستیار اختصاصی تو</div>
                    <div className="text-[8px] text-accent">آنلاین · آماده‌ی کمک</div>
                  </div>
                </div>
                <p className="mt-3 text-[9.5px] leading-5 text-muted">
                  بر اساس ذخیره‌ها و بودجه‌ات، سه فایل نزدیک به سلیقه‌ات پیدا کرده‌ام.
                </p>
                <div className="mt-3 space-y-1.5">
                  {properties.slice(0, 2).map((p) => (
                    <Link
                      key={p.id}
                      href={`/smart/properties/${p.id}`}
                      className="flex items-center gap-2 rounded-lg border border-line bg-white/[0.02] p-1.5 transition hover:border-accent/30"
                    >
                      <img src={p.images[0]} alt="" className="size-8 rounded-md object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[8.5px] font-semibold">{p.title}</div>
                        <div className="text-[7.5px] text-accent">{propertyPrice(p).main}</div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/smart/explore#assistant"
                  className="mt-3 flex h-9 items-center justify-center gap-1.5 rounded-xl bg-accent text-[9px] font-bold text-[#0a0f0c]"
                >
                  گفت‌وگو با دستیار <ArrowLeft size={11} />
                </Link>
              </div>

              <div className="rounded-2xl border border-line bg-surface/40 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell size={14} className="text-accent" />
                    <h2 className="text-[11px] font-bold">هشدار قیمت</h2>
                  </div>
                  <Toggle
                    checked={notifications.priceAlert}
                    onChange={(v) => {
                      setNotifications({ ...notifications, priceAlert: v });
                      pushToast(v ? "هشدار قیمت فعال شد." : "هشدار قیمت غیرفعال شد.", "info");
                    }}
                  />
                </div>
                <p className="mt-2 text-[9px] leading-5 text-muted">
                  اگر قیمت فایل‌های ذخیره‌شده تغییر کند، فوراً باخبر می‌شوی.
                </p>
                <div className="mt-3 space-y-1.5">
                  {favoriteProps.slice(0, 2).map((p) => (
                    <div key={p.id} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-2.5 py-2 text-[8.5px]">
                      <span className="truncate">{p.title}</span>
                      <span className="text-accent">{propertyPrice(p).main}</span>
                    </div>
                  ))}
                  {favoriteProps.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-line px-2.5 py-3 text-center text-[8.5px] text-muted">
                      هنوز فایلی ذخیره نکرده‌ای.
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-surface/40 p-5">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-accent" />
                  <h2 className="text-[11px] font-bold">پشتیبانی اختصاصی</h2>
                </div>
                <p className="mt-2 text-[9px] leading-5 text-muted">
                  مشاور و پشتیبانی حقوقی آرامش تا پایان معامله همراه تو هستند.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <a
                    href="tel:02122448890"
                    className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-line text-[9px] font-semibold text-muted transition hover:text-accent"
                  >
                    <Phone size={11} /> تماس
                  </a>
                  <button
                    type="button"
                    onClick={() => setTab("messages")}
                    className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-accent text-[9px] font-bold text-[#0a0f0c]"
                  >
                    <MessageSquare size={11} /> پیام
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {tab === "favorites" ? (
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold">ملک‌های ذخیره‌شده</h2>
                <p className="mt-0.5 text-[9px] text-muted">
                  {favorites.length ? `${fa(favorites.length)} فایل ذخیره شده` : "لیست ذخیره‌ها خالی است"}
                </p>
              </div>
              <Link
                href="/smart/explore"
                className="flex h-9 items-center gap-1.5 rounded-xl bg-accent px-3.5 text-[9px] font-bold text-[#0a0f0c]"
              >
                <Plus size={12} /> افزودن ملک
              </Link>
            </div>
            {favoriteProps.length ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {favoriteProps.map((p) => (
                  <PropertyCardSmart key={p.id} property={p} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface/40 px-6 py-14 text-center">
                <span className="grid size-14 place-items-center rounded-2xl bg-accent/10 text-accent">
                  <Heart size={25} />
                </span>
                <h3 className="mt-4 text-sm font-bold">هنوز فایلی ذخیره نکرده‌ای</h3>
                <p className="mt-2 max-w-sm text-[10px] leading-6 text-muted">
                  روی آیکون قلب هر ملک بزن تا اینجا ذخیره شود و بعداً راحت پیدایش کنی.
                </p>
                <div className="mt-4 grid w-full max-w-2xl gap-3 sm:grid-cols-3">
                  {suggestions.map((p) => (
                    <Link
                      key={p.id}
                      href={`/smart/properties/${p.id}`}
                      className="group overflow-hidden rounded-xl border border-line bg-white/[0.02] text-start transition hover:border-accent/30"
                    >
                      <img src={p.images[0]} alt={p.title} className="aspect-[16/10] w-full object-cover" />
                      <div className="p-2.5">
                        <div className="truncate text-[9px] font-bold">{p.title}</div>
                        <div className="mt-0.5 text-[8px] text-accent">{propertyPrice(p).main}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}

        {tab === "compare" ? (
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold">لیست مقایسه</h2>
                <p className="mt-0.5 text-[9px] text-muted">
                  {compare.length ? `${fa(compare.length)} فایل آماده‌ی مقایسه` : "لیست مقایسه خالی است"}
                </p>
              </div>
              {compare.length ? (
                <Link
                  href="/smart/compare"
                  className="flex h-9 items-center gap-1.5 rounded-xl bg-accent px-3.5 text-[9px] font-bold text-[#0a0f0c]"
                >
                  <Scale size={12} /> باز کردن مقایسه
                </Link>
              ) : null}
            </div>
            {compareProps.length ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {compareProps.map((p) => (
                  <div key={p.id} className="overflow-hidden rounded-xl border border-line bg-surface/40">
                    <img src={p.images[0]} alt={p.title} className="aspect-[16/9] w-full object-cover" />
                    <div className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-[10px] font-bold">{p.title}</div>
                          <div className="mt-0.5 text-[8px] text-muted">
                            {categoryLabels[p.category]} · {p.district}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleCompare(p.id, p.title)}
                          className="grid size-7 shrink-0 place-items-center rounded-lg border border-line text-muted transition hover:border-rose-400/30 hover:text-rose-300"
                          aria-label="حذف از مقایسه"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[9px]">
                        <span className="font-bold text-accent">{propertyPrice(p).main}</span>
                        <span className="text-muted">{fa(p.area)} متر</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface/40 px-6 py-14 text-center">
                <span className="grid size-14 place-items-center rounded-2xl bg-accent/10 text-accent">
                  <Scale size={25} />
                </span>
                <h3 className="mt-4 text-sm font-bold">برای مقایسه فایل انتخاب کن</h3>
                <p className="mt-2 max-w-sm text-[10px] leading-6 text-muted">
                  از صفحه‌ی املاک، روی آیکون مقایسه بزن یا سه پیشنهاد آماده‌ی دستیار را ببین.
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCompareIds(["p1", "p2", "p12"])}
                    className="flex h-9 items-center gap-1.5 rounded-xl bg-accent px-4 text-[9.5px] font-bold text-[#0a0f0c]"
                  >
                    <Sparkles size={12} /> سه پیشنهاد دستیار
                  </button>
                  <Link
                    href="/smart/explore"
                    className="flex h-9 items-center gap-1.5 rounded-xl border border-line px-4 text-[9.5px] font-semibold text-muted"
                  >
                    رفتن به املاک <ArrowLeft size={11} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {tab === "visits" ? (
          <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="rounded-2xl border border-line bg-surface/40">
              <div className="flex items-center justify-between border-b border-line px-4 py-3.5">
                <h2 className="text-sm font-bold">بازدیدهای من</h2>
                <button
                  type="button"
                  onClick={() => setVisitModal(true)}
                  className="flex h-8 items-center gap-1 rounded-lg bg-accent px-3 text-[8.5px] font-bold text-[#0a0f0c]"
                >
                  <Plus size={11} /> بازدید جدید
                </button>
              </div>
              <div className="divide-y divide-line">
                {visits.map((v) => {
                  const p = getProperty(v.propertyId);
                  const meta = visitMeta[v.status];
                  return (
                    <div key={v.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                      <span className="grid size-10 place-items-center rounded-xl bg-accent/10 text-accent">
                        <CalendarDays size={17} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[10px] font-semibold">{p?.title}</div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[8px] text-muted">
                          <span>{v.date}</span>
                          <span>·</span>
                          <span>{v.time}</span>
                          <span>·</span>
                          <span>{v.mode}</span>
                          <span>·</span>
                          <span>{v.consultant}</span>
                        </div>
                      </div>
                      <span className={cn("rounded-full border px-2 py-1 text-[7.5px] font-semibold", meta.className)}>
                        {meta.label}
                      </span>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/smart/properties/${v.propertyId}`}
                          className="grid size-7 place-items-center rounded-lg border border-line text-muted hover:text-accent"
                          aria-label="مشاهده ملک"
                        >
                          <ArrowUpLeft size={11} />
                        </Link>
                        {v.upcoming ? (
                          <button
                            type="button"
                            onClick={() => {
                              setVisits((prev) =>
                                prev.map((x) => (x.id === v.id ? { ...x, status: "canceled", upcoming: false } : x)),
                              );
                              pushToast("بازدید لغو شد؛ در صورت نیاز بازدید جدید ثبت کن.", "info");
                            }}
                            className="grid size-7 place-items-center rounded-lg border border-line text-muted transition hover:border-rose-400/30 hover:text-rose-300"
                            aria-label="لغو بازدید"
                          >
                            <X size={11} />
                          </button>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-line bg-surface/40 p-5">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-accent" />
                  <h2 className="text-[11px] font-bold">راهنمای بازدید</h2>
                </div>
                <div className="mt-3 space-y-2.5">
                  {[
                    "۱۵ دقیقه قبل در محل حاضر شو.",
                    "مدارک هویتی و چک‌لیست بازدید را همراه داشته باش.",
                    "برای فایل‌های دارای تور، اول تور مجازی را ببین.",
                    "هر سوالی داشتی از مشاور اختصاصی بپرس.",
                  ].map((t) => (
                    <div key={t} className="flex items-start gap-2 text-[9px] leading-5 text-muted">
                      <Check size={10} className="mt-0.5 shrink-0 text-accent" /> {t}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-accent/20 bg-accent/[0.05] p-5">
                <div className="flex items-center gap-2">
                  <ScanEyeIcon />
                  <h2 className="text-[11px] font-bold">تور مجازی داری؟</h2>
                </div>
                <p className="mt-2 text-[9px] leading-5 text-muted">
                  فایل‌های دارای تور ۳۶۰ را ببین و بدون رفتن، فضای ملک را ارزیابی کن.
                </p>
                <Link
                  href="/smart/explore?q=تور"
                  className="mt-3 flex h-9 items-center justify-center gap-1.5 rounded-xl border border-accent/25 text-[9px] font-semibold text-accent"
                >
                  فایل‌های دارای تور <ArrowLeft size={11} />
                </Link>
              </div>
            </div>
          </div>
        ) : null}

        {tab === "messages" ? (
          <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="overflow-hidden rounded-2xl border border-line bg-surface/40">
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <h2 className="text-[11.5px] font-bold">پیام‌ها</h2>
                <button
                  type="button"
                  onClick={() => {
                    setThreads((prev) => prev.map((m) => ({ ...m, unread: false })));
                    pushToast("همه‌ی پیام‌ها خوانده‌شده شدند.", "info");
                  }}
                  className="text-[8.5px] font-semibold text-accent"
                >
                  خواندن همه
                </button>
              </div>
              <div className="divide-y divide-line">
                {threads.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setActiveThread(m.id);
                      setThreads((prev) => prev.map((x) => (x.id === m.id ? { ...x, unread: false } : x)));
                    }}
                    className={cn(
                      "flex w-full items-start gap-2.5 px-4 py-3 text-start transition hover:bg-white/[0.03]",
                      activeThread === m.id && "bg-accent/[0.05]",
                    )}
                  >
                    <span className="relative grid size-9 shrink-0 place-items-center rounded-full bg-accent/10 text-[9px] font-bold text-accent">
                      {m.name.split(" ")[0]?.[0]}
                      {m.name.split(" ")[1]?.[0]}
                      {m.unread ? (
                        <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full border border-[#080d11] bg-accent" />
                      ) : null}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn("truncate text-[9.5px]", m.unread ? "font-bold text-ink" : "text-ink/80")}>
                          {m.name}
                        </span>
                        <span className="shrink-0 text-[7.5px] text-muted">{m.time}</span>
                      </div>
                      <div className="mt-0.5 truncate text-[8.5px] text-muted">{m.subject}</div>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <span className="rounded-full bg-white/[0.04] px-1.5 py-0.5 text-[7px] text-muted">{m.channel}</span>
                        <span className="truncate text-[8px] text-muted">{m.preview}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-line bg-surface/40">
              {currentThread ? (
                <>
                  <div className="flex items-center justify-between border-b border-line px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-emerald-700 to-teal-500 text-[9px] font-bold text-white">
                        {currentThread.name.split(" ")[0]?.[0]}
                        {currentThread.name.split(" ")[1]?.[0]}
                      </span>
                      <div>
                        <div className="text-[10.5px] font-bold">{currentThread.name}</div>
                        <div className="text-[8px] text-muted">{currentThread.channel} · {currentThread.time}</div>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 rounded-full border border-accent/20 bg-accent/5 px-2 py-1 text-[7.5px] text-accent">
                      <span className="size-1.5 rounded-full bg-accent" /> آنلاین
                    </span>
                  </div>
                  <div className="flex-1 space-y-3 overflow-y-auto p-4">
                    <div className="max-w-[85%] rounded-2xl rounded-br-md border border-line bg-white/[0.03] px-3.5 py-2.5">
                      <div className="text-[8px] font-semibold text-muted">{currentThread.subject}</div>
                      <p className="mt-1 text-[10px] leading-6 text-ink/85">{currentThread.preview}</p>
                    </div>
                    <div className="ms-auto max-w-[85%] rounded-2xl rounded-bl-md bg-accent px-3.5 py-2.5 text-[#0a0f0c]">
                      <p className="text-[10px] leading-6">
                        سلام، حتماً. لینک تور و جزئیات ملک را برایتان می‌فرستم؛ اگر زمان
                        بازدید را هم بگویید هماهنگ می‌کنم.
                      </p>
                    </div>
                    <div className="max-w-[85%] rounded-2xl rounded-br-md border border-line bg-white/[0.03] px-3.5 py-2.5">
                      <p className="text-[10px] leading-6 text-ink/85">
                        ممنون. لطفاً برای پنجشنبه عصر هماهنگ کنید.
                      </p>
                    </div>
                    {(sentReplies[currentThread.id] ?? []).map((text, i) => (
                      <div
                        key={`${currentThread.id}-${i}`}
                        className="ms-auto max-w-[85%] rounded-2xl rounded-bl-md bg-accent px-3.5 py-2.5 text-[#0a0f0c]"
                      >
                        <p className="text-[10px] leading-6">{text}</p>
                      </div>
                    ))}
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const text = reply.trim();
                      if (!text) return;
                      setSentReplies((prev) => ({
                        ...prev,
                        [currentThread.id]: [...(prev[currentThread.id] ?? []), text],
                      }));
                      pushToast("پیام برای مشاور ارسال شد.");
                      setReply("");
                    }}
                    className="flex items-center gap-2 border-t border-line p-3"
                  >
                    <input
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="پاسخ خود را بنویس..."
                      className="field !py-2.5 !text-[10px]"
                    />
                    <button
                      type="submit"
                      aria-label="ارسال پیام"
                      className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-[#0a0f0c]"
                    >
                      <Send size={14} />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                  <span className="grid size-12 place-items-center rounded-2xl bg-accent/10 text-accent">
                    <MessageSquare size={22} />
                  </span>
                  <h3 className="mt-3 text-[11px] font-bold">یک گفت‌وگو انتخاب کن</h3>
                  <p className="mt-1 text-[9px] text-muted">پیام‌های مشاور و پشتیبانی را اینجا ببین.</p>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {tab === "profile" ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-line bg-surface/40 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Pencil size={14} className="text-accent" />
                  <h2 className="text-[12px] font-bold">اطلاعات شخصی</h2>
                </div>
                <span className="rounded-full border border-accent/20 bg-accent/5 px-2 py-1 text-[7.5px] text-accent">
                  ۸۰٪ تکمیل
                </span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label>
                  <span className="mb-1.5 block text-[9px] text-muted">نام و نام خانوادگی</span>
                  <input
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="field !py-2.5 !text-[10px]"
                  />
                </label>
                <label>
                  <span className="mb-1.5 block text-[9px] text-muted">شماره موبایل</span>
                  <input defaultValue="۰۹۱۲ ۴۴۵ ۸۸۹۰" className="field !py-2.5 !text-[10px]" inputMode="tel" />
                </label>
                <label className="sm:col-span-2">
                  <span className="mb-1.5 block text-[9px] text-muted">ایمیل</span>
                  <input defaultValue="sara.mohammadi@example.com" className="field !py-2.5 !text-[10px]" type="email" />
                </label>
                <label>
                  <span className="mb-1.5 block text-[9px] text-muted">بودجه‌ی خرید</span>
                  <select defaultValue="30" className="field !py-2.5 !text-[10px]">
                    <option value="15">تا ۱۵ میلیارد</option>
                    <option value="30">تا ۳۰ میلیارد</option>
                    <option value="50">تا ۵۰ میلیارد</option>
                    <option value="100">بیش از ۵۰ میلیارد</option>
                  </select>
                </label>
                <label>
                  <span className="mb-1.5 block text-[9px] text-muted">منطقه‌ی مورد علاقه</span>
                  <select defaultValue="زعفرانیه" className="field !py-2.5 !text-[10px]">
                    {["زعفرانیه", "الهیه", "نیاوران", "ولنجک", "سعادت‌آباد", "فرمانیه"].map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </label>
                <label className="sm:col-span-2">
                  <span className="mb-1.5 block text-[9px] text-muted">سبک زندگی و نیازها</span>
                  <textarea
                    defaultValue="دنبال خانه‌ی روشن با ویو، حداقل سه خواب و پارکینگ دوگانه برای خانواده‌ی چهار نفره."
                    rows={3}
                    className="field !text-[10px]"
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={() => pushToast("پروفایل با موفقیت ذخیره شد.")}
                className="mt-4 flex h-10 items-center gap-1.5 rounded-xl bg-accent px-4 text-[9.5px] font-bold text-[#0a0f0c]"
              >
                <Check size={12} /> ذخیره تغییرات
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-line bg-surface/40 p-5">
                <div className="flex items-center gap-2">
                  <Bell size={14} className="text-accent" />
                  <h2 className="text-[12px] font-bold">اعلان‌ها</h2>
                </div>
                <div className="mt-3 space-y-1">
                  {[
                    ["sms", "پیامک یادآوری بازدید", "یک ساعت قبل از بازدید"],
                    ["email", "خبرنامه‌ی فایل‌های منتخب", "هفتگی، فقط فایل‌های هم‌سلیقه"],
                    ["priceAlert", "هشدار تغییر قیمت", "برای فایل‌های ذخیره‌شده"],
                    ["assistant", "پیشنهاد هوشمند دستیار", "حداکثر دو پیشنهاد در هفته"],
                  ].map(([key, title, desc]) => (
                    <div key={key} className="flex items-center justify-between gap-3 border-b border-line py-3 last:border-0">
                      <div>
                        <div className="text-[9.5px] font-semibold">{title}</div>
                        <div className="mt-0.5 text-[8px] text-muted">{desc}</div>
                      </div>
                      <Toggle
                        checked={notifications[key as keyof typeof notifications]}
                        onChange={(v) => setNotifications({ ...notifications, [key]: v })}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-surface/40 p-5">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-accent" />
                  <h2 className="text-[12px] font-bold">امنیت حساب</h2>
                </div>
                <div className="mt-3 space-y-2">
                  {[
                    ["ورود دو مرحله‌ای", "فعال"],
                    ["آخرین ورود", "امروز، ۰۹:۱۲"],
                    ["دستگاه‌های فعال", "۲ دستگاه"],
                  ].map(([t, d]) => (
                    <div key={t} className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2.5">
                      <span className="text-[9px] text-muted">{t}</span>
                      <span className="flex items-center gap-1 text-[9px] font-semibold">
                        {d} <CircleCheck size={11} className="text-accent" />
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => pushToast("لینک تغییر رمز به شماره‌ی شما ارسال شد.")}
                    className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-line text-[9px] font-semibold text-muted hover:text-accent"
                  >
                    <Wallet size={11} /> تغییر رمز
                  </button>
                  <Link
                    href="/classic/login"
                    className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-line text-[9px] font-semibold text-muted hover:text-accent"
                  >
                    <X size={11} /> خروج از حساب
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-accent/20 bg-accent/[0.05] p-5">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-accent" />
                  <h2 className="text-[11px] font-bold">پیشنهاد ما به تو</h2>
                </div>
                <p className="mt-2 text-[9px] leading-5 text-muted">
                  با بودجه‌ی ۳۰ میلیارد و علاقه به زعفرانیه، فایل‌های دارای تور ۳۶۰ و ویو
                  کوه را ببین.
                </p>
                <Link
                  href="/smart/explore?q=آپارتمان%20زعفرانیه%20تا%2030%20میلیارد"
                  className="mt-3 flex h-9 items-center justify-center gap-1.5 rounded-xl bg-accent text-[9px] font-bold text-[#0a0f0c]"
                >
                  دیدن پیشنهادها <ArrowLeft size={11} />
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </Container>

      {visitModal ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="بستن"
            onClick={() => setVisitModal(false)}
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
          />
          <form
            onSubmit={submitVisit}
            className="animate-fade-up relative w-full max-w-md overflow-hidden rounded-[1.5rem] border border-line bg-[#080d11] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div>
                <h3 className="text-sm font-bold">درخواست بازدید جدید</h3>
                <p className="mt-0.5 text-[9px] text-muted">زمان و نوع بازدید را انتخاب کن</p>
              </div>
              <button
                type="button"
                onClick={() => setVisitModal(false)}
                className="grid size-8 place-items-center rounded-full border border-line text-muted"
                aria-label="بستن"
              >
                <X size={15} />
              </button>
            </div>
            <div className="space-y-3 p-5">
              <label className="block">
                <span className="mb-1.5 block text-[9.5px] text-muted">انتخاب ملک</span>
                <select
                  value={visitForm.propertyId}
                  onChange={(e) => setVisitForm({ ...visitForm, propertyId: e.target.value })}
                  className="field !py-2.5 !text-[10px]"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} · {p.district}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["حضوری", "مجازی"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setVisitForm({ ...visitForm, mode: m })}
                    className={cn(
                      "rounded-xl border py-2.5 text-[9.5px] font-semibold transition",
                      visitForm.mode === m ? "border-accent bg-accent/10 text-accent" : "border-line text-muted",
                    )}
                  >
                    {m === "حضوری" ? "بازدید حضوری" : "تور مجازی"}
                  </button>
                ))}
              </div>
              <label className="block">
                <span className="mb-1.5 block text-[9.5px] text-muted">تاریخ پیشنهادی</span>
                <input
                  type="date"
                  value={visitForm.date}
                  onChange={(e) => setVisitForm({ ...visitForm, date: e.target.value })}
                  className="field !py-2.5 !text-[10px]"
                />
              </label>
              <div>
                <span className="mb-1.5 block text-[9.5px] text-muted">بازه‌ی زمانی</span>
                <div className="grid grid-cols-3 gap-2">
                  {["صبح", "عصر", "شب"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setVisitForm({ ...visitForm, time: t })}
                      className={cn(
                        "rounded-lg border py-2 text-[9.5px] font-semibold transition",
                        visitForm.time === t ? "border-accent bg-accent text-[#0a0f0c]" : "border-line text-muted",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent text-[10.5px] font-bold text-[#0a0f0c]"
              >
                <CalendarDays size={14} /> ثبت درخواست بازدید
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}

function ScanEyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-3.5 text-accent">
      <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  );
}
