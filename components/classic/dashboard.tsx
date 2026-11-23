"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowUpLeft,
  BarChart3,
  Bell,
  Bot,
  Building2,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronDown,
  CircleAlert,
  CircleDollarSign,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Phone,
  Play,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  Users,
  Video,
  X,
} from "lucide-react";
import { AreaChart, BarList, Donut, Funnel, ProgressBar } from "@/components/charts";
import { useApp } from "@/components/providers";
import {
  consultants,
  districtPrices,
  leads,
  messages,
  monthlyPerformance,
  properties,
  trainingVideos,
} from "@/lib/data";
import type { Lead, Property, PropertyStatus } from "@/lib/types";
import { cn, fa, formatPriceShort, propertyPrice, statusLabels } from "@/lib/utils";

const nav = [
  { id: "overview", label: "نمای کلی", icon: LayoutDashboard },
  { id: "listings", label: "آگهی‌ها", icon: Building2, badge: "۱۴" },
  { id: "leads", label: "سرنخ‌ها", icon: MessageSquare, badge: "۹" },
  { id: "consultants", label: "مشاوران", icon: Users },
  { id: "reports", label: "گزارش‌ها", icon: BarChart3 },
  { id: "training", label: "آموزش", icon: GraduationCap },
  { id: "settings", label: "تنظیمات", icon: Settings },
];

const stageMeta: Record<Lead["stage"], { label: string; className: string }> = {
  new: { label: "سرنخ جدید", className: "bg-sky-50 text-sky-600 border-sky-100" },
  contacted: { label: "تماس گرفته شده", className: "bg-violet-50 text-violet-600 border-violet-100" },
  visit: { label: "بازدید", className: "bg-amber-50 text-amber-600 border-amber-100" },
  negotiation: { label: "مذاکره", className: "bg-orange-50 text-orange-600 border-orange-100" },
  closed: { label: "قرارداد", className: "bg-emerald-50 text-emerald-600 border-emerald-100" },
};

const statusMeta: Record<PropertyStatus, string> = {
  active: "bg-emerald-50 text-emerald-600 border-emerald-100",
  pending: "bg-amber-50 text-amber-600 border-amber-100",
  sold: "bg-slate-100 text-slate-500 border-slate-200",
  rented: "bg-sky-50 text-sky-600 border-sky-100",
};

function StatCard({
  label,
  value,
  change,
  icon: Icon,
  spark,
}: {
  label: string;
  value: string;
  change: string;
  icon: typeof Eye;
  spark: number[];
}) {
  const max = Math.max(...spark);
  const min = Math.min(...spark);
  const pts = spark
    .map((v, i) => `${(i / (spark.length - 1)) * 70},${24 - ((v - min) / (max - min || 1)) * 20}`)
    .join(" ");
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <div className="flex items-start justify-between">
        <span className="grid size-9 place-items-center rounded-xl bg-soft text-accent">
          <Icon size={17} />
        </span>
        <span className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[8.5px] font-bold text-emerald-600">
          <TrendingUp size={9} /> {change}
        </span>
      </div>
      <div className="mt-3 text-xl font-extrabold tracking-tight">{value}</div>
      <div className="mt-0.5 flex items-end justify-between">
        <span className="text-[9.5px] text-muted">{label}</span>
        <svg viewBox="0 0 70 28" className="h-6 w-16 overflow-visible">
          <polyline
            points={pts}
            fill="none"
            stroke="#0e5a4a"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.7"
          />
        </svg>
      </div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-5 w-9 rounded-full transition",
        checked ? "bg-accent" : "bg-line",
      )}
      aria-pressed={checked}
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

export function ClassicDashboard() {
  const { pushToast } = useApp();
  const [tab, setTab] = useState("overview");
  const [mobile, setMobile] = useState(false);
  const [myListings, setMyListings] = useState<Property[]>(properties);
  const [listingFilter, setListingFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [leadFilter, setLeadFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadStages, setLeadStages] = useState<Record<string, Lead["stage"]>>(
    Object.fromEntries(leads.map((l) => [l.id, l.stage])),
  );
  const [settings, setSettings] = useState({
    telegram: true,
    sms: true,
    email: false,
    autoPublish: false,
  });
  const [videoOpen, setVideoOpen] = useState<(typeof trainingVideos)[number] | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>(
    Object.fromEntries(trainingVideos.map((v) => [v.id, v.progress])),
  );
  const [newListing, setNewListing] = useState({
    title: "",
    district: "زعفرانیه",
    deal: "sale",
    category: "apartment",
    price: "",
    area: "",
    rooms: "2",
  });

  const activeTab = nav.find((n) => n.id === tab) ?? nav[0];
  const filteredListings =
    listingFilter === "all"
      ? myListings
      : myListings.filter((p) => p.status === listingFilter);
  const filteredLeads =
    leadFilter === "all"
      ? leads
      : leads.filter((l) => (leadStages[l.id] ?? l.stage) === leadFilter);

  const totalViews = myListings.reduce((s, p) => s + p.views, 0);

  const addListing = (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(newListing.price) * 1_000_000_000;
    const created: Property = {
      ...properties[0],
      id: `n${Date.now()}`,
      title: newListing.title || "ملک جدید بدون عنوان",
      subtitle: "ثبت‌شده از پنل مدیریت",
      dealType: newListing.deal as Property["dealType"],
      category: newListing.category as Property["category"],
      district: newListing.district,
      address: `${newListing.district}، تهران`,
      price: newListing.deal === "sale" ? price : 0,
      deposit: newListing.deal !== "sale" ? price : 0,
      monthly: newListing.deal === "rent" ? 50_000_000 : 0,
      area: Number(newListing.area) || 100,
      rooms: Number(newListing.rooms) || 2,
      images: ["/images/living-1.jpg", "/images/villa-3.jpg"],
      status: "pending",
      featured: false,
      views: 0,
      createdAt: "همین حالا",
      tour: false,
    };
    setMyListings((prev) => [created, ...prev]);
    setAddOpen(false);
    setTab("listings");
    setNewListing({ title: "", district: "زعفرانیه", deal: "sale", category: "apartment", price: "", area: "", rooms: "2" });
    pushToast("ملک جدید ثبت شد و در انتظار تایید است.");
  };

  const changeStatus = (id: string, status: PropertyStatus) => {
    setMyListings((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    pushToast(`وضعیت فایل به «${statusLabels[status]}» تغییر کرد.`);
  };

  return (
    <div className="bg-[#f4f1e9] py-6 lg:py-8">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[248px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-[92px] overflow-hidden rounded-[1.4rem] bg-[#0b2f27] text-white shadow-xl">
              <div className="border-b border-white/10 px-5 py-5">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-9 place-items-center rounded-xl bg-[#c19a4b] text-white">
                    <Building2 size={17} />
                  </span>
                  <div>
                    <div className="text-[13px] font-bold">پنل مدیریت</div>
                    <div className="text-[9px] text-white/45">املاک آرامش · تهران</div>
                  </div>
                </div>
              </div>
              <nav className="space-y-1 p-3">
                {nav.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTab(item.id)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[11.5px] font-medium transition",
                      tab === item.id
                        ? "bg-white/10 text-white"
                        : "text-white/55 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    <item.icon size={16} className={tab === item.id ? "text-[#d9b872]" : ""} />
                    <span className="flex-1 text-start">{item.label}</span>
                    {item.badge ? (
                      <span className="grid min-w-5 place-items-center rounded-full bg-[#c19a4b]/20 px-1.5 py-0.5 text-[8.5px] font-bold text-[#d9b872]">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                ))}
              </nav>
              <div className="m-3 rounded-xl border border-white/10 bg-white/[0.04] p-3">
                <div className="flex items-center gap-1.5 text-[9px] font-semibold text-[#d9b872]">
                  <Sparkles size={11} /> نسخه دمو
                </div>
                <p className="mt-1.5 text-[8.5px] leading-4 text-white/45">
                  همه‌ی داده‌ها نمونه هستند و تغییرات ذخیره نمی‌شوند.
                </p>
              </div>
              <div className="border-t border-white/10 p-3">
                <div className="flex items-center gap-2.5 rounded-xl px-2 py-2">
                  <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-emerald-700 to-teal-500 text-[9px] font-bold">
                    س‌ا
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[10.5px] font-bold">سارا احمدی</div>
                    <div className="text-[8px] text-white/40">مدیر مجموعه</div>
                  </div>
                  <Link href="/classic/login" aria-label="خروج" className="text-white/35 hover:text-white">
                    <LogOut size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-5 flex flex-col justify-between gap-3 rounded-2xl border border-line bg-white px-4 py-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobile(true)}
                  className="grid size-9 place-items-center rounded-xl border border-line lg:hidden"
                  aria-label="منو"
                >
                  <Menu size={17} />
                </button>
                <div>
                  <h1 className="text-base font-extrabold">{activeTab.label}</h1>
                  <p className="mt-0.5 text-[9px] text-muted">
                    خوش برگشتی، سارا. امروز ۳ سرنخ جدید داری.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative hidden sm:block">
                  <Search size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    placeholder="جست‌وجو در پنل..."
                    className="field !h-9 !w-52 !py-0 !pe-8 !text-[10px]"
                  />
                </div>
                <span className="flex h-9 items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 text-[9px] font-semibold text-emerald-600">
                  <span className="size-1.5 rounded-full bg-emerald-500" /> ربات متصل
                </span>
                <button
                  type="button"
                  onClick={() => pushToast("۲ پیام خوانده‌نشده داری.")}
                  className="relative grid size-9 place-items-center rounded-full border border-line text-muted transition hover:text-accent"
                  aria-label="اعلان‌ها"
                >
                  <Bell size={15} />
                  <span className="absolute right-2 top-2 size-1.5 rounded-full bg-rose-500" />
                </button>
                <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-emerald-700 to-teal-500 text-[9px] font-bold text-white">
                  س‌ا
                </span>
              </div>
            </div>

            {tab === "overview" ? (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard label="بازدید کل فایل‌ها" value={fa(totalViews)} change="+۱۲.۴٪" icon={Eye} spark={[12, 18, 15, 22, 19, 26, 24, 31]} />
                  <StatCard label="سرنخ فعال" value="۱۷۲" change="+۹.۸٪" icon={Users} spark={[8, 12, 10, 15, 14, 18, 17, 22]} />
                  <StatCard label="معامله این ماه" value="۱۸" change="+۲۰٪" icon={CircleDollarSign} spark={[3, 5, 4, 6, 8, 7, 10, 12]} />
                  <StatCard label="کمیسیون (میلیون)" value="۱٬۲۴۰" change="+۱۴.۲٪" icon={TrendingUp} spark={[20, 26, 22, 30, 28, 34, 32, 40]} />
                </div>

                <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
                  <div className="rounded-2xl border border-line bg-white p-5">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="text-[12.5px] font-bold">روند بازدید و سرنخ</h3>
                        <p className="mt-0.5 text-[9px] text-muted">۸ ماه گذشته · به‌روزرسانی زنده</p>
                      </div>
                      <div className="flex items-center gap-3 text-[8.5px]">
                        <span className="flex items-center gap-1 text-muted">
                          <span className="size-2 rounded-full bg-accent" /> بازدید
                        </span>
                        <span className="flex items-center gap-1 text-muted">
                          <span className="size-2 rounded-full bg-[#c19a4b]" /> سرنخ
                        </span>
                        <span className="rounded-full bg-soft px-2 py-1 font-semibold text-accent">
                          +۱۲.۴٪ رشد
                        </span>
                      </div>
                    </div>
                    <AreaChart
                      id="classic-views"
                      data={monthlyPerformance.map((m) => ({ label: m.month, value: m.views }))}
                      height={210}
                    />
                  </div>

                  <div className="rounded-2xl border border-line bg-white p-5">
                    <h3 className="text-[12.5px] font-bold">منبع سرنخ‌ها</h3>
                    <p className="mt-0.5 text-[9px] text-muted">مهر و آبان ۱۴۰۴</p>
                    <div className="mt-5">
                      <Donut
                        segments={[
                          { label: "دستیار هوشمند", value: 42, color: "#0e5a4a" },
                          { label: "اینستاگرام", value: 38, color: "#c19a4b" },
                          { label: "وب‌سایت", value: 31, color: "#7fb069" },
                          { label: "دیوار", value: 25, color: "#d9c8a3" },
                        ]}
                        centerLabel="سرنخ جدید"
                        centerValue="۱۳۶"
                        size={140}
                      />
                    </div>
                    <div className="mt-4 rounded-xl bg-[#faf8f2] p-3 text-[9px] leading-5 text-muted">
                      <span className="font-bold text-ink">دستیار هوشمند</span> بیشترین سرنخ
                      باکیفیت را آورده؛ نرخ تبدیل ۲۳٪.
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
                  <div className="overflow-hidden rounded-2xl border border-line bg-white">
                    <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
                      <h3 className="text-[12.5px] font-bold">آخرین سرنخ‌ها</h3>
                      <button
                        type="button"
                        onClick={() => setTab("leads")}
                        className="flex items-center gap-1 text-[9px] font-semibold text-accent"
                      >
                        همه سرنخ‌ها <ArrowLeft size={11} />
                      </button>
                    </div>
                    <div className="divide-y divide-line">
                      {leads.slice(0, 5).map((lead) => {
                        const stage = stageMeta[leadStages[lead.id] ?? lead.stage];
                        return (
                          <button
                            key={lead.id}
                            type="button"
                            onClick={() => {
                              setSelectedLead(lead);
                              setTab("leads");
                            }}
                            className="flex w-full items-center gap-3 px-5 py-3 text-start transition hover:bg-[#faf8f2]"
                          >
                            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-soft text-[9px] font-bold text-accent">
                              {lead.name.split(" ")[0]?.[0]}
                              {lead.name.split(" ")[1]?.[0]}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-[10.5px] font-semibold">{lead.name}</div>
                              <div className="mt-0.5 text-[8.5px] text-muted">
                                {lead.source} · {lead.createdAt}
                              </div>
                            </div>
                            <span className={cn("rounded-full border px-2 py-1 text-[8px] font-semibold", stage.className)}>
                              {stage.label}
                            </span>
                            <span className="hidden text-[9px] font-semibold text-muted sm:block">
                              {formatPriceShort(lead.value)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-line bg-white p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[12.5px] font-bold">فایل‌های پربازدید</h3>
                        <Link href="/classic/properties" className="text-[9px] text-accent">
                          همه
                        </Link>
                      </div>
                      <div className="mt-3 space-y-2.5">
                        {properties.slice(0, 3).map((p) => (
                          <div key={p.id} className="flex items-center gap-2.5">
                            <img src={p.images[0]} alt="" className="size-10 rounded-lg object-cover" />
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-[10px] font-semibold">{p.title}</div>
                              <div className="mt-0.5 text-[8px] text-muted">
                                {fa(p.views)} بازدید · {p.district}
                              </div>
                            </div>
                            <span className="text-[9px] font-bold text-accent">{propertyPrice(p).main}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl bg-[#0b2f27] p-5 text-white">
                      <div className="pointer-events-none absolute -left-8 -top-8 size-28 rounded-full border border-white/10" />
                      <div className="flex items-center gap-2">
                        <span className="grid size-9 place-items-center rounded-xl bg-[#c19a4b] text-white">
                          <Bot size={17} />
                        </span>
                        <div>
                          <div className="text-[11px] font-bold">ربات تلگرام</div>
                          <div className="flex items-center gap-1 text-[8px] text-emerald-300">
                            <span className="size-1.5 rounded-full bg-emerald-400" /> متصل و فعال
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-end justify-between">
                        <div>
                          <div className="text-lg font-extrabold text-[#d9b872]">۵۲</div>
                          <div className="text-[8px] text-white/45">پیام امروز</div>
                        </div>
                        <div>
                          <div className="text-lg font-extrabold text-[#d9b872]">۱۴</div>
                          <div className="text-[8px] text-white/45">سرنخ از ربات</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setTab("settings")}
                          className="rounded-lg border border-white/15 px-2.5 py-1.5 text-[8.5px] text-white/70 transition hover:bg-white/10"
                        >
                          مدیریت
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { icon: Plus, title: "افزودن ملک", desc: "ثبت فایل جدید با عکس", action: () => setAddOpen(true) },
                    { icon: Send, title: "ارسال پیام", desc: "پیام به مشاوران یا مشتریان", action: () => { setTab("leads"); pushToast("بخش پیام‌ها آماده است."); } },
                    { icon: Download, title: "خروجی گزارش", desc: "دریافت اکسل عملکرد ماه", action: () => pushToast("گزارش اکسل در نسخه دمو غیرفعال است.") },
                  ].map((q) => (
                    <button
                      key={q.title}
                      type="button"
                      onClick={q.action}
                      className="group flex items-center gap-3 rounded-2xl border border-line bg-white p-4 text-start transition hover:border-accent/25 hover:shadow-sm"
                    >
                      <span className="grid size-10 place-items-center rounded-xl bg-soft text-accent transition group-hover:bg-accent group-hover:text-white">
                        <q.icon size={18} />
                      </span>
                      <div className="flex-1">
                        <div className="text-[11px] font-bold">{q.title}</div>
                        <div className="mt-0.5 text-[8.5px] text-muted">{q.desc}</div>
                      </div>
                      <ArrowUpLeft size={14} className="text-muted transition group-hover:text-accent" />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {tab === "listings" ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white p-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      ["all", "همه"],
                      ["active", "فعال"],
                      ["pending", "در انتظار"],
                      ["sold", "فروخته‌شده"],
                      ["rented", "اجاره‌ای"],
                    ].map(([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setListingFilter(id)}
                        className={cn(
                          "rounded-full px-3 py-1.5 text-[9.5px] font-semibold transition",
                          listingFilter === id
                            ? "bg-accent text-white"
                            : "bg-[#f4f1e9] text-muted hover:text-accent",
                        )}
                      >
                        {label}
                        <span className="ms-1 opacity-60">
                          {id === "all" ? fa(myListings.length) : fa(myListings.filter((p) => p.status === id).length)}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => pushToast("فیلتر پیشرفته در نسخه دمو غیرفعال است.")}
                      className="flex h-9 items-center gap-1.5 rounded-xl border border-line px-3 text-[9.5px] font-semibold text-muted"
                    >
                      <Filter size={12} /> فیلتر
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddOpen(true)}
                      className="flex h-9 items-center gap-1.5 rounded-xl bg-accent px-3.5 text-[9.5px] font-bold text-white"
                    >
                      <Plus size={13} /> افزودن ملک
                    </button>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-line bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-start">
                      <thead>
                        <tr className="border-b border-line bg-[#faf8f2] text-[9px] text-muted">
                          <th className="px-4 py-3 text-start font-medium">ملک</th>
                          <th className="px-3 py-3 text-start font-medium">نوع</th>
                          <th className="px-3 py-3 text-start font-medium">قیمت</th>
                          <th className="px-3 py-3 text-start font-medium">بازدید</th>
                          <th className="px-3 py-3 text-start font-medium">وضعیت</th>
                          <th className="px-3 py-3 text-start font-medium">عملیات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line">
                        {filteredListings.map((p) => (
                          <tr key={p.id} className="transition hover:bg-[#faf8f2]/60">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <img src={p.images[0]} alt="" className="size-10 rounded-lg object-cover" />
                                <div>
                                  <div className="max-w-[190px] truncate text-[10px] font-semibold">{p.title}</div>
                                  <div className="mt-0.5 flex items-center gap-1 text-[8px] text-muted">
                                    <MapPin size={8} /> {p.district} · {fa(p.area)} متر
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3 text-[9px] text-muted">
                              {p.dealType === "sale" ? "فروش" : p.dealType === "rent" ? "اجاره" : "رهن"}
                            </td>
                            <td className="px-3 py-3 text-[9.5px] font-semibold text-accent">
                              {propertyPrice(p).main}
                            </td>
                            <td className="px-3 py-3 text-[9px] text-muted">{fa(p.views)}</td>
                            <td className="px-3 py-3">
                              <select
                                value={p.status}
                                onChange={(e) => changeStatus(p.id, e.target.value as PropertyStatus)}
                                className={cn(
                                  "cursor-pointer rounded-full border px-2 py-1 text-[8px] font-semibold outline-none",
                                  statusMeta[p.status],
                                )}
                              >
                                <option value="active">فعال</option>
                                <option value="pending">در انتظار</option>
                                <option value="sold">فروخته‌شده</option>
                                <option value="rented">اجاره‌ای</option>
                              </select>
                            </td>
                            <td className="px-3 py-3">
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => pushToast("ویرایش فایل در نسخه دمو غیرفعال است.")}
                                  className="grid size-7 place-items-center rounded-lg border border-line text-muted transition hover:text-accent"
                                  aria-label="ویرایش"
                                >
                                  <Pencil size={11} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setMyListings((prev) => prev.filter((x) => x.id !== p.id));
                                    pushToast("فایل از لیست حذف شد.");
                                  }}
                                  className="grid size-7 place-items-center rounded-lg border border-line text-muted transition hover:border-rose-200 hover:text-rose-500"
                                  aria-label="حذف"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex flex-col items-center justify-between gap-2 border-t border-line px-4 py-3 text-[9px] text-muted sm:flex-row">
                    <span>نمایش {fa(filteredListings.length)} فایل</span>
                    <span className="flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-emerald-500" /> همگام‌سازی با سایت فعال است
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            {tab === "leads" ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white p-4">
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      ["all", "همه"],
                      ["new", "جدید"],
                      ["contacted", "تماس"],
                      ["visit", "بازدید"],
                      ["negotiation", "مذاکره"],
                      ["closed", "قرارداد"],
                    ].map(([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setLeadFilter(id)}
                        className={cn(
                          "rounded-full px-3 py-1.5 text-[9.5px] font-semibold transition",
                          leadFilter === id ? "bg-accent text-white" : "bg-[#f4f1e9] text-muted",
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => pushToast("لینک فرم ثبت سرنخ کپی شد.")}
                    className="flex h-9 items-center gap-1.5 rounded-xl border border-line px-3 text-[9.5px] font-semibold text-muted"
                  >
                    <ArrowUpLeft size={12} /> فرم دریافت سرنخ
                  </button>
                </div>

                <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
                  <div className="space-y-2">
                    {filteredLeads.map((lead) => {
                      const stage = stageMeta[leadStages[lead.id] ?? lead.stage];
                      const property = properties.find((p) => p.id === lead.propertyId);
                      return (
                        <button
                          key={lead.id}
                          type="button"
                          onClick={() => setSelectedLead(lead)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-2xl border bg-white p-4 text-start transition hover:border-accent/25",
                            selectedLead?.id === lead.id ? "border-accent/40 shadow-sm" : "border-line",
                          )}
                        >
                          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-soft text-[10px] font-bold text-accent">
                            {lead.name.split(" ")[0]?.[0]}
                            {lead.name.split(" ")[1]?.[0]}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[11px] font-bold">{lead.name}</span>
                              <span className={cn("rounded-full border px-2 py-0.5 text-[7.5px] font-semibold", stage.className)}>
                                {stage.label}
                              </span>
                            </div>
                            <div className="mt-1 truncate text-[9px] text-muted">
                              {property?.title} · {lead.source}
                            </div>
                          </div>
                          <div className="text-end">
                            <div className="text-[9.5px] font-bold text-accent">
                              {formatPriceShort(lead.value)}
                            </div>
                            <div className="mt-0.5 text-[8px] text-muted">{lead.createdAt}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-4">
                    {selectedLead ? (
                      <div className="rounded-2xl border border-line bg-white p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <span className="grid size-11 place-items-center rounded-full bg-soft text-[11px] font-bold text-accent">
                              {selectedLead.name.split(" ")[0]?.[0]}
                              {selectedLead.name.split(" ")[1]?.[0]}
                            </span>
                            <div>
                              <div className="text-[12px] font-bold">{selectedLead.name}</div>
                              <div className="mt-0.5 text-[9px] text-muted">{selectedLead.phone}</div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedLead(null)}
                            className="text-muted hover:text-ink"
                            aria-label="بستن"
                          >
                            <X size={15} />
                          </button>
                        </div>
                        <div className="mt-4 space-y-2 rounded-xl bg-[#faf8f2] p-3 text-[9.5px] leading-5">
                          <div className="flex justify-between">
                            <span className="text-muted">ملک مورد نظر</span>
                            <span className="font-semibold">
                              {properties.find((p) => p.id === selectedLead.propertyId)?.title}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted">منبع</span>
                            <span>{selectedLead.source}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted">مشاور</span>
                            <span>
                              {consultants.find((c) => c.id === selectedLead.agentId)?.name}
                            </span>
                          </div>
                          <p className="border-t border-line pt-2 text-muted">{selectedLead.note}</p>
                        </div>
                        <div className="mt-4">
                          <span className="mb-2 block text-[9.5px] font-semibold">تغییر مرحله</span>
                          <div className="flex flex-wrap gap-1.5">
                            {(Object.keys(stageMeta) as Lead["stage"][]).map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => {
                                  setLeadStages((prev) => ({ ...prev, [selectedLead.id]: s }));
                                  pushToast(`مرحله‌ی سرنخ به «${stageMeta[s].label}» تغییر کرد.`);
                                }}
                                className={cn(
                                  "rounded-full border px-2 py-1 text-[8px] font-semibold transition",
                                  (leadStages[selectedLead.id] ?? selectedLead.stage) === s
                                    ? stageMeta[s].className
                                    : "border-line text-muted hover:border-accent/25",
                                )}
                              >
                                {stageMeta[s].label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button
                            type="button"
                            onClick={() => pushToast("پیام برای مشتری در صف ارسال قرار گرفت.")}
                            className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-accent text-[9.5px] font-bold text-white"
                          >
                            <Send size={12} /> ارسال پیام
                          </button>
                          <a
                            href={`tel:${selectedLead.phone}`}
                            className="flex h-9 items-center justify-center gap-1.5 rounded-xl border border-line px-3 text-[9.5px] font-semibold text-muted"
                          >
                            <Phone size={12} /> تماس
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white/60 p-8 text-center">
                        <span className="grid size-12 place-items-center rounded-2xl bg-soft text-accent">
                          <MessageSquare size={22} />
                        </span>
                        <h3 className="mt-3 text-[11px] font-bold">یک سرنخ انتخاب کن</h3>
                        <p className="mt-1 text-[9px] leading-5 text-muted">
                          جزئیات، تاریخچه و مرحله‌ی پیگیری هر سرنخ را ببین.
                        </p>
                      </div>
                    )}

                    <div className="rounded-2xl border border-line bg-white p-5">
                      <h3 className="text-[11px] font-bold">قیف فروش این ماه</h3>
                      <div className="mt-4">
                        <Funnel
                          steps={[
                            { label: "بازدید فایل", value: 28100 },
                            { label: "سرنخ", value: 172 },
                            { label: "بازدید حضوری", value: 64 },
                            { label: "مذاکره", value: 31 },
                            { label: "قرارداد", value: 18 },
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {tab === "consultants" ? (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {consultants.map((c) => (
                    <div key={c.id} className="rounded-2xl border border-line bg-white p-4">
                      <div className="flex items-center gap-2.5">
                        <span className={`grid size-11 place-items-center rounded-xl bg-gradient-to-br ${c.tone} text-[10px] font-bold text-white`}>
                          {c.initials}
                        </span>
                        <div>
                          <div className="text-[11px] font-bold">{c.name}</div>
                          <div className="mt-0.5 text-[8px] text-muted">{c.role}</div>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-[#faf8f2] p-2.5 text-center">
                        <div>
                          <div className="text-[11px] font-bold">{fa(c.deals)}</div>
                          <div className="text-[7.5px] text-muted">معامله</div>
                        </div>
                        <div>
                          <div className="flex items-center justify-center gap-0.5 text-[11px] font-bold">
                            {fa(c.rating)} <Star size={9} className="fill-[#c19a4b] text-[#c19a4b]" />
                          </div>
                          <div className="text-[7.5px] text-muted">امتیاز</div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="mb-1 flex justify-between text-[8px] text-muted">
                          <span>تحقق هدف ماه</span>
                          <span>{fa(Math.min(100, Math.round((c.deals % 10) * 10 + 30)))}٪</span>
                        </div>
                        <ProgressBar value={Math.min(100, (c.deals % 10) * 10 + 30)} />
                      </div>
                      <button
                        type="button"
                        onClick={() => pushToast(`پروفایل ${c.name} باز شد (دمو).`)}
                        className="mt-3 flex h-8 w-full items-center justify-center gap-1 rounded-lg border border-line text-[8.5px] font-semibold text-muted transition hover:text-accent"
                      >
                        <Eye size={11} /> مشاهده عملکرد
                      </button>
                    </div>
                  ))}
                </div>

                <div className="overflow-hidden rounded-2xl border border-line bg-white">
                  <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
                    <h3 className="text-[12px] font-bold">جدول عملکرد مشاوران</h3>
                    <span className="text-[8.5px] text-muted">آبان ۱۴۰۴</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] text-start">
                      <thead>
                        <tr className="border-b border-line bg-[#faf8f2] text-[8.5px] text-muted">
                          <th className="px-4 py-2.5 text-start font-medium">مشاور</th>
                          <th className="px-3 py-2.5 text-start font-medium">فایل فعال</th>
                          <th className="px-3 py-2.5 text-start font-medium">سرنخ</th>
                          <th className="px-3 py-2.5 text-start font-medium">معامله</th>
                          <th className="px-3 py-2.5 text-start font-medium">کمیسیون</th>
                          <th className="px-3 py-2.5 text-start font-medium">رضایت</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line text-[9px]">
                        {consultants.map((c, i) => (
                          <tr key={c.id}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className={`grid size-7 place-items-center rounded-full bg-gradient-to-br ${c.tone} text-[8px] font-bold text-white`}>
                                  {c.initials}
                                </span>
                                {c.name}
                              </div>
                            </td>
                            <td className="px-3 py-3 text-muted">{fa(4 + i)}</td>
                            <td className="px-3 py-3 text-muted">{fa(38 - i * 4)}</td>
                            <td className="px-3 py-3 font-semibold">{fa(18 - i * 3)}</td>
                            <td className="px-3 py-3 text-accent">{formatPriceShort((18 - i * 3) * 72_000_000)}</td>
                            <td className="px-3 py-3">
                              <span className="flex items-center gap-0.5">
                                {fa(c.rating)} <Star size={9} className="fill-[#c19a4b] text-[#c19a4b]" />
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : null}

            {tab === "reports" ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white p-4">
                  <div>
                    <h2 className="text-[12px] font-bold">گزارش‌های مدیریتی</h2>
                    <p className="mt-0.5 text-[9px] text-muted">داده‌های نمونه · آبان ۱۴۰۴</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => pushToast("بازه‌ی گزارش به ۳۰ روز اخیر تغییر کرد.")}
                      className="flex h-9 items-center gap-1.5 rounded-xl border border-line px-3 text-[9px] font-semibold text-muted"
                    >
                      <CalendarDays size={12} /> ۳۰ روز اخیر
                    </button>
                    <button
                      type="button"
                      onClick={() => pushToast("گزارش برای دانلود آماده شد (دمو).")}
                      className="flex h-9 items-center gap-1.5 rounded-xl bg-accent px-3 text-[9px] font-bold text-white"
                    >
                      <Download size={12} /> خروجی اکسل
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
                  <div className="rounded-2xl border border-line bg-white p-5">
                    <h3 className="text-[12px] font-bold">بازدید فایل‌ها در ۸ ماه</h3>
                    <div className="mt-4">
                      <AreaChart
                        id="classic-reports"
                        data={monthlyPerformance.map((m) => ({ label: m.month, value: m.views }))}
                        height={230}
                      />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-line bg-white p-5">
                    <h3 className="text-[12px] font-bold">میانگین قیمت هر متر</h3>
                    <p className="mt-0.5 text-[8.5px] text-muted">میلیون تومان · منطقه‌های منتخب</p>
                    <div className="mt-5">
                      <BarList
                        data={districtPrices.map((d) => ({
                          label: d.district,
                          value: d.price,
                          growth: d.growth,
                        }))}
                        suffix="م"
                        showGrowth
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <div className="rounded-2xl border border-line bg-white p-5">
                    <h3 className="text-[11.5px] font-bold">نرخ تبدیل</h3>
                    <div className="mt-4">
                      <Donut
                        segments={[
                          { label: "تبدیل‌شده", value: 18, color: "#0e5a4a" },
                          { label: "در حال پیگیری", value: 64, color: "#c19a4b" },
                          { label: "از دست رفته", value: 90, color: "#e3dbcb" },
                        ]}
                        centerLabel="نرخ تبدیل"
                        centerValue="۱۰.۵٪"
                        size={130}
                      />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-line bg-white p-5">
                    <h3 className="text-[11.5px] font-bold">قیف فروش</h3>
                    <div className="mt-4">
                      <Funnel
                        steps={[
                          { label: "بازدید", value: 28100 },
                          { label: "سرنخ", value: 172 },
                          { label: "بازدید حضوری", value: 64 },
                          { label: "قرارداد", value: 18 },
                        ]}
                      />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-line bg-white p-5">
                    <h3 className="text-[11.5px] font-bold">عملکرد ماهانه</h3>
                    <div className="mt-3 space-y-2.5">
                      {monthlyPerformance.slice(-4).map((m) => (
                        <div key={m.month} className="flex items-center justify-between rounded-lg bg-[#faf8f2] px-3 py-2 text-[9px]">
                          <span className="text-muted">{m.month}</span>
                          <span>{fa(m.leads)} سرنخ</span>
                          <span className="font-bold text-accent">{fa(m.deals)} معامله</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-[8.5px] text-emerald-600">
                      رشد ۱۸٪ نسبت به ماه قبل
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {tab === "training" ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-line bg-white p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-[12.5px] font-bold">آموزش استفاده از پنل</h2>
                      <p className="mt-1 text-[9px] text-muted">
                        ویدئوهای کوتاه، قدم‌به‌قدم؛ مخصوص مدیر و مشاوران.
                      </p>
                    </div>
                    <span className="flex items-center gap-1.5 rounded-full bg-soft px-3 py-1.5 text-[8.5px] font-semibold text-accent">
                      <GraduationCap size={12} /> ۴ دوره · ۱ ساعت و ۱۰ دقیقه
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {trainingVideos.map((v, i) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVideoOpen(v)}
                      className="group overflow-hidden rounded-2xl border border-line bg-white text-start transition hover:border-accent/25 hover:shadow-md"
                    >
                      <div className="relative aspect-[16/8] overflow-hidden">
                        <img
                          src={["/images/interior-3.jpg", "/images/living-1.jpg", "/images/interior-2.jpg", "/images/living-2.jpg"][i]}
                          alt={v.title}
                          className="size-full object-cover transition duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b2f27]/80 to-transparent" />
                        <span className="absolute right-3 top-3 rounded-full bg-black/40 px-2 py-1 text-[8px] text-white backdrop-blur">
                          {v.level}
                        </span>
                        <span className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-accent shadow-lg transition group-hover:scale-110">
                          <Play size={18} fill="currentColor" className="ms-0.5" />
                        </span>
                        <span className="absolute bottom-2 left-3 flex items-center gap-1 rounded bg-black/50 px-1.5 py-0.5 text-[8px] text-white">
                          <Clock size={9} /> {v.duration}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="text-[11.5px] font-bold">{v.title}</h3>
                        <p className="mt-1 text-[9px] text-muted">{v.desc}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <ProgressBar value={progress[v.id]} className="flex-1" />
                          <span className="text-[8px] text-muted">{fa(progress[v.id])}٪</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-line bg-white p-5 sm:flex-row">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-soft text-accent">
                      <FileText size={18} />
                    </span>
                    <div>
                      <div className="text-[10.5px] font-bold">راهنمای PDF پنل مدیریت</div>
                      <div className="mt-0.5 text-[8.5px] text-muted">نسخه ۲.۱ · ۲۴ صفحه</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => pushToast("راهنمای PDF در نسخه دمو غیرفعال است.")}
                    className="flex h-9 items-center gap-1.5 rounded-xl border border-line px-4 text-[9px] font-semibold text-muted transition hover:text-accent"
                  >
                    <Download size={12} /> دانلود راهنما
                  </button>
                </div>
              </div>
            ) : null}

            {tab === "settings" ? (
              <div className="grid gap-4 xl:grid-cols-2">
                <div className="rounded-2xl border border-line bg-white p-5">
                  <h2 className="text-[12.5px] font-bold">اتصال ربات تلگرام</h2>
                  <p className="mt-1 text-[9px] leading-5 text-muted">
                    پیام‌های مشتریان، اعلان سرنخ جدید و گزارش روزانه از طریق ربات.
                  </p>
                  <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2.5">
                    <span className="flex items-center gap-2 text-[9.5px] font-semibold text-emerald-600">
                      <Bot size={14} /> ربات متصل است
                    </span>
                    <Toggle checked={settings.telegram} onChange={(v) => setSettings({ ...settings, telegram: v })} />
                  </div>
                  <label className="mt-4 block">
                    <span className="mb-1.5 block text-[9.5px] font-medium text-muted">توکن ربات</span>
                    <input value="••••••••••••••••••••••" readOnly className="field !py-2.5 !text-[10px]" />
                  </label>
                  <label className="mt-3 block">
                    <span className="mb-1.5 block text-[9.5px] font-medium text-muted">Chat ID مدیر</span>
                    <input value="128944021" readOnly className="field !py-2.5 !text-[10px]" />
                  </label>
                  <button
                    type="button"
                    onClick={() => pushToast("تنظیمات ربات ذخیره شد (دمو).")}
                    className="mt-4 flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-accent text-[9.5px] font-bold text-white"
                  >
                    <CheckCheck size={13} /> ذخیره تنظیمات
                  </button>
                </div>

                <div className="rounded-2xl border border-line bg-white p-5">
                  <h2 className="text-[12.5px] font-bold">اعلان‌ها</h2>
                  <div className="mt-3 space-y-1">
                    {[
                      ["sms", "پیامک سرنخ جدید", "ارسال پیامک به مشاور مسئول"],
                      ["email", "گزارش ایمیلی هفتگی", "ارسال گزارش به مدیر مجموعه"],
                      ["autoPublish", "انتشار خودکار آگهی", "بعد از تایید کارشناس"],
                    ].map(([key, title, desc]) => (
                      <div key={key} className="flex items-center justify-between gap-3 border-b border-line py-3 last:border-0">
                        <div>
                          <div className="text-[10px] font-semibold">{title}</div>
                          <div className="mt-0.5 text-[8.5px] text-muted">{desc}</div>
                        </div>
                        <Toggle
                          checked={settings[key as keyof typeof settings]}
                          onChange={(v) => setSettings({ ...settings, [key]: v })}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-line bg-white p-5">
                  <h2 className="text-[12.5px] font-bold">پروفایل مجموعه</h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <label>
                      <span className="mb-1.5 block text-[9px] text-muted">نام مجموعه</span>
                      <input defaultValue="املاک آرامش" className="field !py-2.5 !text-[10px]" />
                    </label>
                    <label>
                      <span className="mb-1.5 block text-[9px] text-muted">شماره تماس</span>
                      <input defaultValue="۰۲۱ ۲۲۴۴ ۸۸۹۰" className="field !py-2.5 !text-[10px]" />
                    </label>
                    <label className="sm:col-span-2">
                      <span className="mb-1.5 block text-[9px] text-muted">آدرس</span>
                      <input defaultValue="تهران، زعفرانیه، مقدس اردبیلی، پلاک ۲۴" className="field !py-2.5 !text-[10px]" />
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => pushToast("پروفایل مجموعه ذخیره شد (دمو).")}
                    className="mt-4 flex h-9 items-center gap-1.5 rounded-xl bg-accent px-4 text-[9.5px] font-bold text-white"
                  >
                    <Check size={13} /> ذخیره تغییرات
                  </button>
                </div>

                <div className="rounded-2xl border border-line bg-white p-5">
                  <h2 className="text-[12.5px] font-bold">امنیت و دسترسی</h2>
                  <div className="mt-3 space-y-2">
                    {[
                      ["ورود دو مرحله‌ای", "فعال برای مدیر و مشاوران"],
                      ["محدودیت IP پنل", "فقط دفتر و مدیر"],
                      ["لاگ فعالیت‌ها", "ذخیره ۹۰ روز اخیر"],
                    ].map(([t, d]) => (
                      <div key={t} className="flex items-center justify-between rounded-xl bg-[#faf8f2] px-3 py-2.5">
                        <div>
                          <div className="text-[9.5px] font-semibold">{t}</div>
                          <div className="mt-0.5 text-[8px] text-muted">{d}</div>
                        </div>
                        <ShieldCheck size={14} className="text-emerald-500" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {mobile ? (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <button type="button" aria-label="بستن" onClick={() => setMobile(false)} className="absolute inset-0 bg-black/45 backdrop-blur-sm" />
          <div className="absolute inset-y-0 right-0 w-[280px] bg-[#0b2f27] p-4 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-[#c19a4b]">
                  <Building2 size={15} />
                </span>
                <span className="text-xs font-bold">پنل مدیریت</span>
              </div>
              <button type="button" onClick={() => setMobile(false)} aria-label="بستن">
                <X size={18} />
              </button>
            </div>
            <nav className="mt-3 space-y-1">
              {nav.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setTab(item.id);
                    setMobile(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[11px]",
                    tab === item.id ? "bg-white/10 text-white" : "text-white/55",
                  )}
                >
                  <item.icon size={15} /> {item.label}
                </button>
              ))}
            </nav>
            <Link href="/classic/login" className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-[10px] text-white/55">
              <LogOut size={14} /> خروج از حساب
            </Link>
          </div>
        </div>
      ) : null}

      {addOpen ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <button type="button" aria-label="بستن" onClick={() => setAddOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <form onSubmit={addListing} className="animate-fade-up relative w-full max-w-lg overflow-hidden rounded-[1.4rem] border border-line bg-[#f7f4ed] shadow-2xl">
            <div className="flex items-center justify-between border-b border-line bg-white px-5 py-4">
              <div>
                <h3 className="text-sm font-bold">افزودن ملک جدید</h3>
                <p className="mt-0.5 text-[9px] text-muted">اطلاعات اولیه را وارد کن؛ کارشناس تکمیل می‌کند.</p>
              </div>
              <button type="button" onClick={() => setAddOpen(false)} aria-label="بستن" className="grid size-8 place-items-center rounded-full border border-line text-muted">
                <X size={15} />
              </button>
            </div>
            <div className="grid gap-3 p-5 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-[9.5px] text-muted">عنوان ملک</span>
                <input required value={newListing.title} onChange={(e) => setNewListing({ ...newListing, title: e.target.value })} placeholder="مثلاً آپارتمان ۱۴۰ متری پاسداران" className="field !py-2.5 !text-[10.5px]" />
              </label>
              <label>
                <span className="mb-1.5 block text-[9.5px] text-muted">منطقه</span>
                <select value={newListing.district} onChange={(e) => setNewListing({ ...newListing, district: e.target.value })} className="field !py-2.5 !text-[10.5px]">
                  {["زعفرانیه", "الهیه", "نیاوران", "فرمانیه", "سعادت‌آباد", "ونک", "پاسداران", "ولنجک"].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="mb-1.5 block text-[9.5px] text-muted">نوع معامله</span>
                <select value={newListing.deal} onChange={(e) => setNewListing({ ...newListing, deal: e.target.value })} className="field !py-2.5 !text-[10.5px]">
                  <option value="sale">فروش</option>
                  <option value="rent">رهن و اجاره</option>
                  <option value="mortgage">رهن کامل</option>
                </select>
              </label>
              <label>
                <span className="mb-1.5 block text-[9.5px] text-muted">نوع ملک</span>
                <select value={newListing.category} onChange={(e) => setNewListing({ ...newListing, category: e.target.value })} className="field !py-2.5 !text-[10.5px]">
                  <option value="apartment">آپارتمان</option>
                  <option value="villa">ویلا</option>
                  <option value="penthouse">پنت‌هاوس</option>
                  <option value="office">اداری</option>
                  <option value="duplex">دوبلکس</option>
                  <option value="studio">استودیو</option>
                </select>
              </label>
              <label>
                <span className="mb-1.5 block text-[9.5px] text-muted">قیمت / ودیعه (میلیارد)</span>
                <input required value={newListing.price} onChange={(e) => setNewListing({ ...newListing, price: e.target.value.replace(/\D/g, "") })} placeholder="۱۵" className="field !py-2.5 !text-[10.5px]" inputMode="numeric" />
              </label>
              <label>
                <span className="mb-1.5 block text-[9.5px] text-muted">متراژ</span>
                <input required value={newListing.area} onChange={(e) => setNewListing({ ...newListing, area: e.target.value.replace(/\D/g, "") })} placeholder="۱۲۰" className="field !py-2.5 !text-[10.5px]" inputMode="numeric" />
              </label>
              <label>
                <span className="mb-1.5 block text-[9.5px] text-muted">تعداد خواب</span>
                <select value={newListing.rooms} onChange={(e) => setNewListing({ ...newListing, rooms: e.target.value })} className="field !py-2.5 !text-[10.5px]">
                  {["1", "2", "3", "4", "5"].map((r) => (
                    <option key={r} value={r}>{r} خواب</option>
                  ))}
                </select>
              </label>
              <div className="rounded-xl border border-dashed border-line bg-white/60 p-3 text-[8.5px] leading-5 text-muted sm:col-span-2">
                عکس‌ها و مدارک را می‌توانی بعد از ثبت اولیه از صفحه‌ی ویرایش اضافه کنی.
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-line bg-white px-5 py-3">
              <button type="button" onClick={() => setAddOpen(false)} className="h-9 rounded-xl border border-line px-4 text-[9.5px] font-semibold text-muted">انصراف</button>
              <button type="submit" className="flex h-9 items-center gap-1.5 rounded-xl bg-accent px-4 text-[9.5px] font-bold text-white">
                <Plus size={13} /> ثبت ملک
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {videoOpen ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <button type="button" aria-label="بستن" onClick={() => setVideoOpen(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="animate-fade-up relative w-full max-w-2xl overflow-hidden rounded-[1.4rem] border border-line bg-[#0b2f27] text-white shadow-2xl">
            <div className="relative aspect-video">
              <img src="/images/interior-2.jpg" alt="" className="size-full object-cover opacity-40" />
              <div className="absolute inset-0 grid place-items-center">
                <span className="grid size-16 place-items-center rounded-full bg-white/10 backdrop-blur">
                  <Play size={28} fill="white" className="ms-1 text-white" />
                </span>
              </div>
              <span className="absolute bottom-3 right-4 rounded-full bg-black/50 px-2 py-1 text-[8px] backdrop-blur">
                {videoOpen.duration} · {videoOpen.level}
              </span>
            </div>
            <div className="p-5">
              <h3 className="text-sm font-bold">{videoOpen.title}</h3>
              <p className="mt-1 text-[10px] text-white/50">{videoOpen.desc}</p>
              <div className="mt-4 flex items-center gap-3">
                <ProgressBar value={progress[videoOpen.id]} color="#c19a4b" className="flex-1" />
                <span className="text-[9px] text-white/50">{fa(progress[videoOpen.id])}٪</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setProgress((prev) => ({ ...prev, [videoOpen.id]: Math.min(100, (prev[videoOpen.id] ?? 0) + 25) }));
                    pushToast("پیشرفت دوره به‌روزرسانی شد (دمو).");
                  }}
                  className="flex h-9 items-center gap-1.5 rounded-xl bg-[#c19a4b] px-4 text-[9.5px] font-bold text-white"
                >
                  <Play size={12} /> ادامه دوره
                </button>
                <button
                  type="button"
                  onClick={() => setVideoOpen(null)}
                  className="h-9 rounded-xl border border-white/15 px-4 text-[9.5px] font-semibold text-white/60"
                >
                  بستن
                </button>
              </div>
              <p className="mt-3 text-[8px] text-white/30">ویدئوی واقعی در نسخه‌ی نهایی بارگذاری می‌شود.</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
