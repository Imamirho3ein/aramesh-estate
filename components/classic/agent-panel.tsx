"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpLeft,
  Building2,
  CalendarDays,
  Check,
  CheckCheck,
  Clock,
  Eye,
  FileText,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Phone,
  Plus,
  Star,
  Target,
  TrendingUp,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { AreaChart, ProgressBar } from "@/components/charts";
import { useApp } from "@/components/providers";
import { asset } from "@/lib/asset";
import { consultants, leads, monthlyPerformance, properties } from "@/lib/data";
import type { Property, PropertyStatus } from "@/lib/types";
import { cn, fa, formatPriceShort, propertyPrice, statusLabels } from "@/lib/utils";

const tabs = [
  { id: "overview", label: "نمای کلی", icon: LayoutDashboard },
  { id: "listings", label: "فایل‌های من", icon: Building2 },
  { id: "leads", label: "سرنخ‌ها", icon: MessageSquare },
  { id: "visits", label: "بازدیدها", icon: CalendarDays },
  { id: "profile", label: "پروفایل", icon: UserRound },
];

const statusMeta: Record<PropertyStatus, string> = {
  active: "bg-emerald-50 text-emerald-600",
  pending: "bg-amber-50 text-amber-600",
  sold: "bg-slate-100 text-slate-500",
  rented: "bg-sky-50 text-sky-600",
};

const visits = [
  { id: "v1", property: "پنت‌هاوس دزاشیب", client: "مهدی کریمی", time: "امروز · ۱۷:۳۰", status: "تاییدشده", tone: "emerald" },
  { id: "v2", property: "آپارتمان پاسداران", client: "مریم رستمی", time: "فردا · ۱۱:۰۰", status: "در انتظار تایید", tone: "amber" },
  { id: "v3", property: "دوبلکس شهرک غرب", client: "لیلا حیدری", time: "پنجشنبه · ۱۶:۰۰", status: "تاییدشده", tone: "emerald" },
  { id: "v4", property: "ویلا لواسان", client: "آرش تهرانی", time: "جمعه · ۱۰:۳۰", status: "هماهنگ‌نشده", tone: "slate" },
];

export function AgentPanel() {
  const { pushToast } = useApp();
  const me = consultants[0];
  const [tab, setTab] = useState("overview");
  const [myListings, setMyListings] = useState<Property[]>(properties.filter((p) => p.consultantId === "c1" || p.consultantId === "c2").slice(0, 6));
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ title: "", district: "زعفرانیه", price: "", area: "", deal: "sale" });
  const myLeads = leads.filter((l) => l.agentId === "c1" || l.agentId === "c2");

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Property = {
      ...properties[0],
      id: `agent-${Date.now()}`,
      title: form.title,
      district: form.district,
      address: `${form.district}، تهران`,
      dealType: form.deal as Property["dealType"],
      price: form.deal === "sale" ? Number(form.price) * 1_000_000_000 : 0,
      deposit: form.deal !== "sale" ? Number(form.price) * 1_000_000_000 : 0,
      monthly: form.deal === "rent" ? 45_000_000 : 0,
      area: Number(form.area) || 100,
      images: ["/images/living-1.jpg"],
      status: "pending",
      featured: false,
      views: 0,
      createdAt: "همین حالا",
      consultantId: "c1",
      tour: false,
    };
    setMyListings((prev) => [created, ...prev]);
    setAddOpen(false);
    setForm({ title: "", district: "زعفرانیه", price: "", area: "", deal: "sale" });
    pushToast("فایل جدید ثبت شد و برای تایید ارسال شد.");
  };

  const stats = [
    { label: "فایل فعال", value: fa(myListings.filter((p) => p.status === "active").length), icon: Building2 },
    { label: "بازدید این ماه", value: "۸٬۴۲۰", icon: Eye },
    { label: "سرنخ فعال", value: fa(myLeads.length), icon: Users },
    { label: "معامله این ماه", value: "۶", icon: CheckCheck },
  ];

  return (
    <div className="bg-[#f4f1e9] py-6 lg:py-8">
      <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="mb-5 overflow-hidden rounded-[1.5rem] bg-[#0b2f27] p-5 text-white sm:p-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <span className={`grid size-14 place-items-center rounded-2xl bg-gradient-to-br ${me.tone} text-sm font-bold`}>
                {me.initials}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-extrabold">پنل مشاور</h1>
                  <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[8px] text-white/55">
                    پکیج ۱
                  </span>
                </div>
                <p className="mt-1 text-[10.5px] text-white/50">
                  سلام {me.name} · امروز ۳ پیگیری مهم داری
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/classic/properties"
                className="flex h-9 items-center gap-1.5 rounded-xl border border-white/15 px-3 text-[9.5px] font-semibold text-white/70 transition hover:bg-white/10"
              >
                مشاهده سایت <ArrowUpLeft size={12} />
              </Link>
              <button
                type="button"
                onClick={() => setAddOpen(true)}
                className="flex h-9 items-center gap-1.5 rounded-xl bg-[#c19a4b] px-4 text-[9.5px] font-bold text-white transition hover:bg-[#ad8a3f]"
              >
                <Plus size={13} /> ثبت فایل جدید
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
                <s.icon size={14} className="text-[#d9b872]" />
                <div className="mt-1.5 text-base font-extrabold">{s.value}</div>
                <div className="text-[8px] text-white/45">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4 flex gap-1 overflow-x-auto rounded-2xl border border-line bg-white p-1.5 no-scrollbar">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-[10px] font-semibold transition",
                tab === t.id ? "bg-accent text-white" : "text-muted hover:bg-soft hover:text-accent",
              )}
            >
              <t.icon size={13} /> {t.label}
            </button>
          ))}
        </div>

        {tab === "overview" ? (
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-4">
              <div className="rounded-2xl border border-line bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-[12px] font-bold">روند بازدید فایل‌های من</h2>
                    <p className="mt-0.5 text-[8.5px] text-muted">۶ ماه گذشته</p>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-semibold text-emerald-600">
                    <TrendingUp size={10} /> +۱۸٪
                  </span>
                </div>
                <div className="mt-3">
                  <AreaChart
                    id="agent-views"
                    data={monthlyPerformance.slice(-6).map((m) => ({ label: m.month, value: Math.round(m.views * 0.35) }))}
                    height={200}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-white p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-[12px] font-bold">پیگیری‌های امروز</h2>
                  <button type="button" onClick={() => setTab("leads")} className="text-[8.5px] font-semibold text-accent">
                    همه سرنخ‌ها
                  </button>
                </div>
                <div className="mt-3 space-y-2">
                  {myLeads.slice(0, 4).map((l) => (
                    <div key={l.id} className="flex items-center gap-3 rounded-xl border border-line p-3">
                      <span className="grid size-8 place-items-center rounded-full bg-soft text-[9px] font-bold text-accent">
                        {l.name.split(" ")[0]?.[0]}
                        {l.name.split(" ")[1]?.[0]}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-semibold">{l.name}</div>
                        <div className="mt-0.5 truncate text-[8px] text-muted">{l.note}</div>
                      </div>
                      <a href={`tel:${l.phone}`} className="grid size-7 place-items-center rounded-full border border-line text-accent" aria-label="تماس">
                        <Phone size={11} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-line bg-white p-5">
                <div className="flex items-center gap-2">
                  <Target size={15} className="text-accent" />
                  <h2 className="text-[12px] font-bold">هدف ماه</h2>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <span className="text-2xl font-extrabold">۶ / ۸</span>
                  <span className="text-[9px] text-muted">۷۵٪ تحقق</span>
                </div>
                <ProgressBar value={75} className="mt-2" />
                <p className="mt-2 text-[8.5px] leading-5 text-muted">
                  با بستن ۲ قرارداد دیگر، پاداش عملکرد ماه را دریافت می‌کنی.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-[#faf8f2] p-3 text-center">
                    <div className="text-[13px] font-bold text-accent">{formatPriceShort(6 * 72_000_000)}</div>
                    <div className="mt-0.5 text-[7.5px] text-muted">کمیسیون این ماه</div>
                  </div>
                  <div className="rounded-xl bg-[#faf8f2] p-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-[13px] font-bold text-accent">
                      {fa(me.rating)} <Star size={10} className="fill-[#c19a4b] text-[#c19a4b]" />
                    </div>
                    <div className="mt-0.5 text-[7.5px] text-muted">امتیاز مشتریان</div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-white p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-[12px] font-bold">بازدیدهای پیش‌رو</h2>
                  <button type="button" onClick={() => setTab("visits")} className="text-[8.5px] font-semibold text-accent">
                    تقویم
                  </button>
                </div>
                <div className="mt-3 space-y-2">
                  {visits.slice(0, 3).map((v) => (
                    <div key={v.id} className="flex items-start gap-2.5 rounded-xl bg-[#faf8f2] p-3">
                      <span className="mt-0.5 grid size-7 place-items-center rounded-lg bg-white text-accent">
                        <CalendarDays size={12} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[9.5px] font-semibold">{v.property}</div>
                        <div className="mt-0.5 text-[8px] text-muted">{v.client} · {v.time}</div>
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 text-[7px] font-semibold",
                          v.tone === "emerald" ? "bg-emerald-50 text-emerald-600" : v.tone === "amber" ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-500",
                        )}
                      >
                        {v.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-white p-5">
                <h2 className="text-[12px] font-bold">آموزش سریع</h2>
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-dashed border-line p-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-soft text-accent">
                    <FileText size={16} />
                  </span>
                  <div className="flex-1">
                    <div className="text-[9.5px] font-semibold">ثبت ملک و عکاسی حرفه‌ای</div>
                    <div className="mt-0.5 text-[8px] text-muted">۱۸ دقیقه · سطح مشاوران</div>
                  </div>
                  <button type="button" onClick={() => pushToast("ویدئو در نسخه دمو غیرفعال است.")} className="grid size-7 place-items-center rounded-full bg-accent text-white">
                    <ArrowLeft size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {tab === "listings" ? (
          <div className="overflow-hidden rounded-2xl border border-line bg-white">
            <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
              <h2 className="text-[12px] font-bold">فایل‌های من</h2>
              <button type="button" onClick={() => setAddOpen(true)} className="flex h-8 items-center gap-1 rounded-lg bg-accent px-3 text-[9px] font-bold text-white">
                <Plus size={12} /> فایل جدید
              </button>
            </div>
            <div className="divide-y divide-line">
              {myListings.map((p) => (
                <div key={p.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                  <img src={asset(p.images[0])} alt="" className="size-12 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[10.5px] font-semibold">{p.title}</div>
                    <div className="mt-0.5 flex items-center gap-2 text-[8px] text-muted">
                      <span className="flex items-center gap-0.5"><MapPin size={8} /> {p.district}</span>
                      <span>·</span>
                      <span>{fa(p.area)} متر</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5"><Eye size={8} /> {fa(p.views)}</span>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-accent">{propertyPrice(p).main}</div>
                  <select
                    value={p.status}
                    onChange={(e) => {
                      const status = e.target.value as PropertyStatus;
                      setMyListings((prev) => prev.map((x) => (x.id === p.id ? { ...x, status } : x)));
                      pushToast(`وضعیت فایل به «${statusLabels[status]}» تغییر کرد.`);
                    }}
                    className={cn("rounded-full border-0 px-2 py-1 text-[8px] font-semibold outline-none", statusMeta[p.status])}
                  >
                    <option value="active">فعال</option>
                    <option value="pending">در انتظار</option>
                    <option value="sold">فروخته‌شده</option>
                    <option value="rented">اجاره‌ای</option>
                  </select>
                  <Link href={`/classic/properties/${p.id}`} className="grid size-7 place-items-center rounded-lg border border-line text-muted hover:text-accent" aria-label="مشاهده">
                    <ArrowUpLeft size={12} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {tab === "leads" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {myLeads.map((l) => {
              const p = properties.find((x) => x.id === l.propertyId);
              return (
                <div key={l.id} className="rounded-2xl border border-line bg-white p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="grid size-9 place-items-center rounded-full bg-soft text-[9px] font-bold text-accent">
                        {l.name.split(" ")[0]?.[0]}
                        {l.name.split(" ")[1]?.[0]}
                      </span>
                      <div>
                        <div className="text-[10.5px] font-bold">{l.name}</div>
                        <div className="mt-0.5 text-[8px] text-muted">{l.phone}</div>
                      </div>
                    </div>
                    <span className="rounded-full bg-[#faf8f2] px-2 py-1 text-[7.5px] text-muted">{l.source}</span>
                  </div>
                  <p className="mt-3 text-[9px] leading-5 text-muted">{l.note}</p>
                  <div className="mt-2 flex items-center gap-1.5 text-[8px] text-muted">
                    <Building2 size={10} /> {p?.title}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <a href={`tel:${l.phone}`} className="flex h-8 flex-1 items-center justify-center gap-1 rounded-lg bg-accent text-[8.5px] font-bold text-white">
                      <Phone size={11} /> تماس
                    </a>
                    <button type="button" onClick={() => pushToast("یادآوری پیگیری برای فردا تنظیم شد.")} className="flex h-8 flex-1 items-center justify-center gap-1 rounded-lg border border-line text-[8.5px] font-semibold text-muted">
                      <Clock size={11} /> یادآوری
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        {tab === "visits" ? (
          <div className="space-y-3">
            <div className="grid grid-cols-7 gap-1.5 rounded-2xl border border-line bg-white p-4">
              {["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"].map((d, i) => (
                <div key={d} className={cn("rounded-xl p-2 text-center", i === 2 ? "bg-accent text-white" : "bg-[#faf8f2]")}>
                  <div className="text-[8px] opacity-70">{d}</div>
                  <div className="mt-1 text-sm font-bold">{fa(18 + i)}</div>
                  <div className={cn("mt-1 text-[7px]", i === 2 ? "text-white/70" : "text-muted")}>
                    {i === 2 ? "۳ بازدید" : i % 2 === 0 ? "۱ بازدید" : "—"}
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-line bg-white">
              <div className="border-b border-line px-5 py-3.5">
                <h2 className="text-[12px] font-bold">لیست بازدیدها</h2>
              </div>
              <div className="divide-y divide-line">
                {visits.map((v) => (
                  <div key={v.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                    <span className="grid size-9 place-items-center rounded-xl bg-soft text-accent">
                      <CalendarDays size={15} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-semibold">{v.property}</div>
                      <div className="mt-0.5 text-[8px] text-muted">{v.client} · {v.time}</div>
                    </div>
                    <span className={cn("rounded-full px-2 py-1 text-[7.5px] font-semibold", v.tone === "emerald" ? "bg-emerald-50 text-emerald-600" : v.tone === "amber" ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-500")}>
                      {v.status}
                    </span>
                    <button type="button" onClick={() => pushToast("پیام یادآوری برای مشتری ارسال شد.")} className="rounded-lg border border-line px-2.5 py-1.5 text-[8px] text-muted hover:text-accent">
                      ارسال یادآوری
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {tab === "profile" ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-line bg-white p-5">
              <h2 className="text-[12px] font-bold">اطلاعات مشاور</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label>
                  <span className="mb-1.5 block text-[9px] text-muted">نام و نام خانوادگی</span>
                  <input defaultValue={me.name} className="field !py-2.5 !text-[10px]" />
                </label>
                <label>
                  <span className="mb-1.5 block text-[9px] text-muted">شماره تماس</span>
                  <input defaultValue={me.phone} className="field !py-2.5 !text-[10px]" />
                </label>
                <label className="sm:col-span-2">
                  <span className="mb-1.5 block text-[9px] text-muted">تخصص‌ها</span>
                  <input defaultValue={me.specialties.join("، ")} className="field !py-2.5 !text-[10px]" />
                </label>
                <label className="sm:col-span-2">
                  <span className="mb-1.5 block text-[9px] text-muted">معرفی کوتاه</span>
                  <textarea defaultValue={me.bio} rows={3} className="field !text-[10px]" />
                </label>
              </div>
              <button type="button" onClick={() => pushToast("پروفایل مشاور ذخیره شد (دمو).")} className="mt-4 flex h-9 items-center gap-1.5 rounded-xl bg-accent px-4 text-[9px] font-bold text-white">
                <Check size={12} /> ذخیره پروفایل
              </button>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-line bg-white p-5">
                <h2 className="text-[12px] font-bold">آمار پروفایل</h2>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[
                    ["۸۲۰+", "بازدید پروفایل"],
                    ["۴.۹", "امتیاز"],
                    ["۱۲", "سال تجربه"],
                    ["۲۱۴", "معامله"],
                  ].map(([v, l]) => (
                    <div key={l} className="rounded-xl bg-[#faf8f2] p-3 text-center">
                      <div className="text-sm font-extrabold text-accent">{v}</div>
                      <div className="mt-0.5 text-[7.5px] text-muted">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl bg-[#0b2f27] p-5 text-white">
                <h2 className="text-[12px] font-bold">دسترسی سریع</h2>
                <div className="mt-3 space-y-2">
                  <Link href="/classic/dashboard" className="flex items-center justify-between rounded-xl border border-white/10 px-3 py-2.5 text-[9.5px] text-white/65 hover:bg-white/5">
                    پنل مدیریت مجموعه <ArrowLeft size={12} />
                  </Link>
                  <Link href="/classic/consultants" className="flex items-center justify-between rounded-xl border border-white/10 px-3 py-2.5 text-[9.5px] text-white/65 hover:bg-white/5">
                    پروفایل عمومی من <ArrowLeft size={12} />
                  </Link>
                  <Link href="/classic/login" className="flex items-center justify-between rounded-xl border border-white/10 px-3 py-2.5 text-[9.5px] text-white/65 hover:bg-white/5">
                    خروج از حساب <ArrowLeft size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {addOpen ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <button type="button" aria-label="بستن" onClick={() => setAddOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <form onSubmit={add} className="animate-fade-up relative w-full max-w-md overflow-hidden rounded-[1.4rem] border border-line bg-[#f7f4ed] shadow-2xl">
            <div className="flex items-center justify-between border-b border-line bg-white px-5 py-4">
              <h3 className="text-sm font-bold">ثبت فایل جدید</h3>
              <button type="button" onClick={() => setAddOpen(false)} aria-label="بستن" className="grid size-8 place-items-center rounded-full border border-line text-muted">
                <X size={15} />
              </button>
            </div>
            <div className="space-y-3 p-5">
              <label className="block">
                <span className="mb-1.5 block text-[9.5px] text-muted">عنوان ملک</span>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="آپارتمان ۱۴۰ متری پاسداران" className="field !py-2.5 !text-[10.5px]" />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label>
                  <span className="mb-1.5 block text-[9.5px] text-muted">منطقه</span>
                  <select value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} className="field !py-2.5 !text-[10.5px]">
                    {["زعفرانیه", "الهیه", "نیاوران", "فرمانیه", "سعادت‌آباد", "ونک", "پاسداران", "ولنجک"].map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="mb-1.5 block text-[9.5px] text-muted">نوع معامله</span>
                  <select value={form.deal} onChange={(e) => setForm({ ...form, deal: e.target.value })} className="field !py-2.5 !text-[10.5px]">
                    <option value="sale">فروش</option>
                    <option value="rent">رهن و اجاره</option>
                    <option value="mortgage">رهن کامل</option>
                  </select>
                </label>
                <label>
                  <span className="mb-1.5 block text-[9.5px] text-muted">قیمت / ودیعه (میلیارد)</span>
                  <input required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value.replace(/\D/g, "") })} placeholder="۱۵" className="field !py-2.5 !text-[10.5px]" inputMode="numeric" />
                </label>
                <label>
                  <span className="mb-1.5 block text-[9.5px] text-muted">متراژ</span>
                  <input required value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value.replace(/\D/g, "") })} placeholder="۱۲۰" className="field !py-2.5 !text-[10.5px]" inputMode="numeric" />
                </label>
              </div>
              <button type="submit" className="flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-accent text-[10px] font-bold text-white">
                <Plus size={13} /> ثبت و ارسال برای تایید
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
