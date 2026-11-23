"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpLeft,
  BarChart3,
  Bell,
  Bot,
  Building2,
  CalendarDays,
  Check,
  CheckCheck,
  CircleDollarSign,
  Clock,
  Download,
  Eye,
  FileText,
  GripVertical,
  GraduationCap,
  MessageSquare,
  Phone,
  Play,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  SquareKanban,
  Star,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { AreaChart, BarList, Donut, Funnel, ProgressBar } from "@/components/charts";
import { Container, Eyebrow } from "@/components/ui/layout";
import { useApp } from "@/components/providers";
import {
  consultants,
  crmStages,
  districtPrices,
  leads as seedLeads,
  monthlyPerformance,
  properties,
  trainingVideos,
} from "@/lib/data";
import type { Lead } from "@/lib/types";
import {
  cn,
  fa,
  formatPriceShort,
  propertyPrice,
  statusLabels,
} from "@/lib/utils";

const tabs = [
  { id: "pipeline", label: "قیف فروش", icon: SquareKanban },
  { id: "leads", label: "سرنخ‌ها", icon: MessageSquare },
  { id: "agents", label: "مشاوران", icon: Users },
  { id: "reports", label: "گزارش‌ها", icon: BarChart3 },
  { id: "training", label: "آموزش", icon: GraduationCap },
  { id: "settings", label: "تنظیمات", icon: Settings },
] as const;

type TabId = (typeof tabs)[number]["id"];

const stageMeta: Record<Lead["stage"], { label: string; className: string; dot: string }> = {
  new: { label: "سرنخ جدید", className: "border-slate-400/25 bg-slate-400/10 text-slate-300", dot: "#8b99a4" },
  contacted: { label: "تماس گرفته شده", className: "border-[#7de2c3]/25 bg-[#7de2c3]/10 text-[#7de2c3]", dot: "#7de2c3" },
  visit: { label: "بازدید", className: "border-accent/25 bg-accent/10 text-accent", dot: "#c8f45a" },
  negotiation: { label: "مذاکره", className: "border-[#f5c86b]/25 bg-[#f5c86b]/10 text-[#f5c86b]", dot: "#f5c86b" },
  closed: { label: "قرارداد", className: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300", dot: "#a6e3a1" },
};

const sourceColors: Record<string, string> = {
  "دستیار هوشمند": "#c8f45a",
  اینستاگرام: "#7de2c3",
  "وب‌سایت": "#f5c86b",
  دیوار: "#8b99a4",
  "معرفی مشتری": "#a6e3a1",
  "تماس تلفنی": "#e3a1c8",
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

export function SmartCrm() {
  const { pushToast } = useApp();
  const [tab, setTab] = useState<TabId>("pipeline");
  const [localLeads, setLocalLeads] = useState<Lead[]>(seedLeads);
  const [leadStages, setLeadStages] = useState<Record<string, Lead["stage"]>>(
    Object.fromEntries(seedLeads.map((l) => [l.id, l.stage])),
  );
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [videoOpen, setVideoOpen] = useState<(typeof trainingVideos)[number] | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>(
    Object.fromEntries(trainingVideos.map((v) => [v.id, v.progress])),
  );
  const [settings, setSettings] = useState({
    telegram: true,
    sms: true,
    email: false,
    autoPublish: true,
    roundRobin: true,
    aiSuggest: true,
  });
  const [newLead, setNewLead] = useState({
    name: "",
    phone: "",
    propertyId: "p1",
    stage: "new" as Lead["stage"],
    source: "دستیار هوشمند",
    note: "",
  });

  const stageOf = (lead: Lead) => leadStages[lead.id] ?? lead.stage;

  const moveLead = (id: string, stage: Lead["stage"]) => {
    setLeadStages((prev) => ({ ...prev, [id]: stage }));
    const lead = localLeads.find((l) => l.id === id);
    pushToast(`مرحله‌ی «${lead?.name ?? "سرنخ"}» به «${stageMeta[stage].label}» تغییر کرد.`);
  };

  const totalValue = localLeads.reduce((sum, l) => sum + l.value, 0);
  const closedValue = localLeads
    .filter((l) => stageOf(l) === "closed")
    .reduce((sum, l) => sum + l.value, 0);
  const activeLeads = localLeads.filter((l) => stageOf(l) !== "closed").length;

  const filteredLeads = useMemo(() => {
    const term = search.trim();
    return localLeads.filter((l) => {
      if (stageFilter !== "all" && stageOf(l) !== stageFilter) return false;
      if (term && !`${l.name} ${l.phone} ${l.note}`.includes(term)) return false;
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localLeads, stageFilter, search, leadStages]);

  const addLead = (e: React.FormEvent) => {
    e.preventDefault();
    const property = properties.find((p) => p.id === newLead.propertyId) ?? properties[0];
    const created: Lead = {
      id: `lead-${Date.now()}`,
      name: newLead.name,
      phone: newLead.phone,
      propertyId: property.id,
      stage: newLead.stage,
      value: property.dealType === "sale" ? property.price : property.deposit ?? 0,
      source: newLead.source,
      agentId: property.consultantId,
      createdAt: "همین حالا",
      note: newLead.note || "سرنخ ثبت‌شده از پنل CRM.",
    };
    setLocalLeads((prev) => [created, ...prev]);
    setLeadStages((prev) => ({ ...prev, [created.id]: created.stage }));
    setAddOpen(false);
    setNewLead({
      name: "",
      phone: "",
      propertyId: "p1",
      stage: "new",
      source: "دستیار هوشمند",
      note: "",
    });
    pushToast("سرنخ جدید ثبت شد و به قیف فروش اضافه شد.");
  };

  const stats = [
    { label: "سرنخ فعال", value: fa(activeLeads), change: "+۹.۸٪", icon: Users },
    { label: "ارزش قیف فروش", value: formatPriceShort(totalValue), change: "+۱۴.۲٪", icon: CircleDollarSign },
    { label: "قرارداد بسته‌شده", value: formatPriceShort(closedValue), change: "+۲۰٪", icon: CheckCheck },
    { label: "نرخ تبدیل", value: "۱۰.۵٪", change: "+۲.۱٪", icon: TrendingUp },
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="smart-glow pointer-events-none absolute inset-0" />
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-[0.06]" />
        <Container className="relative py-8 lg:py-10">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <Eyebrow variant="smart">CRM و مدیریت فروش</Eyebrow>
              <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                تیم فروش، در یک نگاه.
              </h1>
              <p className="mt-2 max-w-xl text-[11.5px] leading-6 text-muted">
                سرنخ‌ها را از ورود تا قرارداد پیگیری کن؛ عملکرد مشاوران، قیف فروش و
                گزارش‌ها به‌صورت زنده به‌روز می‌شوند.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex h-10 items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3.5 text-[9.5px] text-emerald-300">
                <span className="size-1.5 rounded-full bg-emerald-400" /> همگام‌سازی زنده
              </span>
              <button
                type="button"
                onClick={() => setAddOpen(true)}
                className="flex h-10 items-center gap-1.5 rounded-xl bg-accent px-4 text-[9.5px] font-bold text-[#0a0f0c] transition hover:bg-[#d4fa7a]"
              >
                <Plus size={13} /> سرنخ جدید
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2 xl:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-line bg-surface/50 p-3.5">
                <div className="flex items-start justify-between">
                  <span className="grid size-8 place-items-center rounded-lg bg-accent/10 text-accent">
                    <s.icon size={15} />
                  </span>
                  <span className="flex items-center gap-0.5 rounded-full bg-emerald-400/10 px-1.5 py-0.5 text-[7.5px] font-bold text-emerald-300">
                    <TrendingUp size={8} /> {s.change}
                  </span>
                </div>
                <div className="mt-2.5 text-lg font-extrabold">{s.value}</div>
                <div className="mt-0.5 text-[8.5px] text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Container className="py-6 lg:py-8">
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
            </button>
          ))}
        </div>

        {tab === "pipeline" ? (
          <>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold">قیف فروش</h2>
                <p className="mt-0.5 text-[9px] text-muted">
                  کارت‌ها را بین ستون‌ها بکش یا روی هر کارت بزن تا جزئیات را ببینی.
                </p>
              </div>
              <span className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[8.5px] text-muted">
                <GripVertical size={11} className="text-accent" /> کشیدن و رها کردن فعال
              </span>
            </div>

            <div className="grid gap-3 overflow-x-auto pb-2 md:grid-cols-3 xl:grid-cols-5">
              {crmStages.map((stage) => {
                const columnLeads = localLeads.filter((l) => stageOf(l) === stage.id);
                const columnValue = columnLeads.reduce((s, l) => s + l.value, 0);
                return (
                  <div
                    key={stage.id}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(stage.id);
                    }}
                    onDragLeave={() => setDragOver((v) => (v === stage.id ? null : v))}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (dragging) moveLead(dragging, stage.id as Lead["stage"]);
                      setDragging(null);
                      setDragOver(null);
                    }}
                    className={cn(
                      "flex min-h-[300px] min-w-[240px] flex-col rounded-2xl border bg-surface/30 transition",
                      dragOver === stage.id ? "border-accent/50 bg-accent/[0.04]" : "border-line",
                    )}
                  >
                    <div className="flex items-center justify-between border-b border-line px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full" style={{ background: stage.tone }} />
                        <span className="text-[10px] font-bold">{stage.label}</span>
                        <span className="grid size-4.5 place-items-center rounded-full bg-white/[0.05] text-[7.5px] text-muted">
                          {fa(columnLeads.length)}
                        </span>
                      </div>
                      <span className="text-[7.5px] text-muted">{formatPriceShort(columnValue)}</span>
                    </div>
                    <div className="flex-1 space-y-2 p-2">
                      {columnLeads.map((lead) => {
                        const property = properties.find((p) => p.id === lead.propertyId);
                        const agent = consultants.find((c) => c.id === lead.agentId);
                        return (
                          <div
                            key={lead.id}
                            draggable
                            onDragStart={() => setDragging(lead.id)}
                            onDragEnd={() => {
                              setDragging(null);
                              setDragOver(null);
                            }}
                            onClick={() => setSelectedLead(lead)}
                            className={cn(
                              "group cursor-grab rounded-xl border border-line bg-[#0a1015] p-3 transition hover:border-accent/30 active:cursor-grabbing",
                              dragging === lead.id && "opacity-40",
                            )}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="grid size-7 place-items-center rounded-full bg-accent/10 text-[8px] font-bold text-accent">
                                  {lead.name.split(" ")[0]?.[0]}
                                  {lead.name.split(" ")[1]?.[0]}
                                </span>
                                <div>
                                  <div className="text-[9.5px] font-bold">{lead.name}</div>
                                  <div className="mt-0.5 text-[7.5px] text-muted">{lead.phone}</div>
                                </div>
                              </div>
                              <GripVertical size={11} className="text-muted/40 group-hover:text-accent" />
                            </div>
                            <div className="mt-2 truncate text-[8.5px] text-muted">{property?.title}</div>
                            <div className="mt-1 flex items-center justify-between">
                              <span className="text-[9px] font-bold text-accent">{formatPriceShort(lead.value)}</span>
                              <span
                                className="rounded-full px-1.5 py-0.5 text-[7px]"
                                style={{
                                  background: `${sourceColors[lead.source] ?? "#8b99a4"}15`,
                                  color: sourceColors[lead.source] ?? "#8b99a4",
                                }}
                              >
                                {lead.source}
                              </span>
                            </div>
                            <div className="mt-2 flex items-center justify-between border-t border-line pt-2 text-[7.5px] text-muted">
                              <span className="flex items-center gap-1">
                                <span className={`grid size-4 place-items-center rounded-full bg-gradient-to-br ${agent?.tone} text-[6px] font-bold text-white`}>
                                  {agent?.initials}
                                </span>
                                {agent?.name.split(" ")[0]}
                              </span>
                              <span>{lead.createdAt}</span>
                            </div>
                          </div>
                        );
                      })}
                      {columnLeads.length === 0 ? (
                        <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-line text-[8.5px] text-muted">
                          کارتی در این مرحله نیست
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : null}

        {tab === "leads" ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface/40 p-4">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setStageFilter("all")}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-[9px] font-semibold transition",
                    stageFilter === "all" ? "bg-accent text-[#0a0f0c]" : "bg-white/[0.04] text-muted",
                  )}
                >
                  همه ({fa(localLeads.length)})
                </button>
                {crmStages.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStageFilter(s.id)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-[9px] font-semibold transition",
                      stageFilter === s.id ? "bg-accent text-[#0a0f0c]" : "bg-white/[0.04] text-muted",
                    )}
                  >
                    {s.label} ({fa(localLeads.filter((l) => stageOf(l) === s.id).length)})
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="جست‌وجوی نام یا شماره..."
                    className="field !h-9 !w-48 !py-0 !pe-8 !text-[9px]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setAddOpen(true)}
                  className="flex h-9 items-center gap-1.5 rounded-xl bg-accent px-3 text-[9px] font-bold text-[#0a0f0c]"
                >
                  <Plus size={12} /> سرنخ
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-line bg-surface/40">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-start">
                  <thead>
                    <tr className="border-b border-line bg-white/[0.02] text-[8.5px] text-muted">
                      <th className="px-4 py-3 text-start font-medium">سرنخ</th>
                      <th className="px-3 py-3 text-start font-medium">ملک</th>
                      <th className="px-3 py-3 text-start font-medium">مشاور</th>
                      <th className="px-3 py-3 text-start font-medium">ارزش</th>
                      <th className="px-3 py-3 text-start font-medium">منبع</th>
                      <th className="px-3 py-3 text-start font-medium">مرحله</th>
                      <th className="px-3 py-3 text-start font-medium">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {filteredLeads.map((lead) => {
                      const property = properties.find((p) => p.id === lead.propertyId);
                      const agent = consultants.find((c) => c.id === lead.agentId);
                      return (
                        <tr key={lead.id} className="transition hover:bg-white/[0.015]">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="grid size-8 place-items-center rounded-full bg-accent/10 text-[8px] font-bold text-accent">
                                {lead.name.split(" ")[0]?.[0]}
                                {lead.name.split(" ")[1]?.[0]}
                              </span>
                              <div>
                                <div className="text-[9.5px] font-semibold">{lead.name}</div>
                                <div className="mt-0.5 text-[7.5px] text-muted">{lead.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="max-w-[170px] truncate px-3 py-3 text-[8.5px] text-muted">{property?.title}</td>
                          <td className="px-3 py-3 text-[8.5px]">
                            <span className="flex items-center gap-1.5">
                              <span className={`grid size-5 place-items-center rounded-full bg-gradient-to-br ${agent?.tone} text-[6px] font-bold text-white`}>
                                {agent?.initials}
                              </span>
                              {agent?.name}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-[8.5px] font-semibold text-accent">{formatPriceShort(lead.value)}</td>
                          <td className="px-3 py-3">
                            <span
                              className="rounded-full px-2 py-0.5 text-[7px]"
                              style={{
                                background: `${sourceColors[lead.source] ?? "#8b99a4"}15`,
                                color: sourceColors[lead.source] ?? "#8b99a4",
                              }}
                            >
                              {lead.source}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <select
                              value={stageOf(lead)}
                              onChange={(e) => moveLead(lead.id, e.target.value as Lead["stage"])}
                              className={cn(
                                "cursor-pointer rounded-full border px-2 py-1 text-[7.5px] font-semibold outline-none",
                                stageMeta[stageOf(lead)].className,
                              )}
                            >
                              {crmStages.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setSelectedLead(lead)}
                                className="grid size-7 place-items-center rounded-lg border border-line text-muted transition hover:text-accent"
                                aria-label="جزئیات"
                              >
                                <Eye size={11} />
                              </button>
                              <a
                                href={`tel:${lead.phone}`}
                                className="grid size-7 place-items-center rounded-lg border border-line text-muted transition hover:text-accent"
                                aria-label="تماس"
                              >
                                <Phone size={11} />
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-line px-4 py-3 text-[8.5px] text-muted">
                نمایش {fa(filteredLeads.length)} سرنخ از {fa(localLeads.length)}
              </div>
            </div>
          </div>
        ) : null}

        {tab === "agents" ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {consultants.map((c) => {
                const files = properties.filter((p) => p.consultantId === c.id);
                const agentLeads = localLeads.filter((l) => l.agentId === c.id);
                const target = Math.min(100, 42 + agentLeads.length * 7);
                return (
                  <div key={c.id} className="rounded-2xl border border-line bg-surface/40 p-4">
                    <div className="flex items-center gap-2.5">
                      <span className={`grid size-11 place-items-center rounded-xl bg-gradient-to-br ${c.tone} text-[10px] font-bold text-white`}>
                        {c.initials}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-[11px] font-bold">{c.name}</div>
                        <div className="mt-0.5 truncate text-[8px] text-muted">{c.role}</div>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-white/[0.03] p-2 text-center">
                      <div>
                        <div className="text-[11px] font-bold">{fa(files.length)}</div>
                        <div className="text-[7px] text-muted">فایل</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-bold">{fa(agentLeads.length)}</div>
                        <div className="text-[7px] text-muted">سرنخ</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-0.5 text-[11px] font-bold">
                          {fa(c.rating)} <Star size={8} className="fill-accent text-accent" />
                        </div>
                        <div className="text-[7px] text-muted">امتیاز</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="mb-1 flex items-center justify-between text-[7.5px] text-muted">
                        <span>تحقق هدف ماه</span>
                        <span>{fa(target)}٪</span>
                      </div>
                      <ProgressBar value={target} color="#c8f45a" />
                    </div>
                    <div className="mt-3 flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => pushToast(`پروفایل ${c.name} باز شد (دمو).`)}
                        className="flex h-8 flex-1 items-center justify-center gap-1 rounded-lg border border-line text-[8px] font-semibold text-muted transition hover:text-accent"
                      >
                        <Eye size={10} /> پروفایل
                      </button>
                      <button
                        type="button"
                        onClick={() => pushToast(`پیام برای ${c.name} در صف ارسال قرار گرفت.`)}
                        className="grid size-8 place-items-center rounded-lg bg-accent text-[#0a0f0c]"
                        aria-label="پیام"
                      >
                        <Send size={11} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="overflow-hidden rounded-2xl border border-line bg-surface/40">
              <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
                <h3 className="text-[11.5px] font-bold">جدول عملکرد مشاوران</h3>
                <span className="text-[8px] text-muted">آبان ۱۴۰۴</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-start">
                  <thead>
                    <tr className="border-b border-line bg-white/[0.02] text-[8px] text-muted">
                      <th className="px-4 py-2.5 text-start font-medium">مشاور</th>
                      <th className="px-3 py-2.5 text-start font-medium">فایل فعال</th>
                      <th className="px-3 py-2.5 text-start font-medium">سرنخ</th>
                      <th className="px-3 py-2.5 text-start font-medium">معامله</th>
                      <th className="px-3 py-2.5 text-start font-medium">کمیسیون</th>
                      <th className="px-3 py-2.5 text-start font-medium">رضایت</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line text-[8.5px]">
                    {consultants.map((c, i) => (
                      <tr key={c.id}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`grid size-6 place-items-center rounded-full bg-gradient-to-br ${c.tone} text-[7px] font-bold text-white`}>
                              {c.initials}
                            </span>
                            {c.name}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-muted">{fa(properties.filter((p) => p.consultantId === c.id).length)}</td>
                        <td className="px-3 py-3 text-muted">{fa(38 - i * 4)}</td>
                        <td className="px-3 py-3 font-semibold">{fa(18 - i * 3)}</td>
                        <td className="px-3 py-3 text-accent">{formatPriceShort((18 - i * 3) * 72_000_000)}</td>
                        <td className="px-3 py-3">
                          <span className="flex items-center gap-0.5">
                            {fa(c.rating)} <Star size={8} className="fill-accent text-accent" />
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
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface/40 p-4">
              <div>
                <h2 className="text-[12px] font-bold">گزارش‌های مدیریتی</h2>
                <p className="mt-0.5 text-[8.5px] text-muted">داده‌های نمونه · آبان ۱۴۰۴</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => pushToast("بازه‌ی گزارش به ۳۰ روز اخیر تغییر کرد.", "info")}
                  className="flex h-9 items-center gap-1.5 rounded-xl border border-line px-3 text-[8.5px] font-semibold text-muted"
                >
                  <CalendarDays size={11} /> ۳۰ روز اخیر
                </button>
                <button
                  type="button"
                  onClick={() => pushToast("گزارش اکسل برای دانلود آماده شد (دمو).")}
                  className="flex h-9 items-center gap-1.5 rounded-xl bg-accent px-3 text-[8.5px] font-bold text-[#0a0f0c]"
                >
                  <Download size={11} /> خروجی اکسل
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["نرخ تبدیل سرنخ", "۱۰.۵٪", "+۲.۱٪", Target],
                ["میانگین زمان پاسخ", "۴ دقیقه", "-۳۸٪", Clock],
                ["میانگین ارزش معامله", "۲۸.۵ میلیارد", "+۱۲٪", CircleDollarSign],
                ["رضایت مشتری", "۴.۸ / ۵", "+۰.۲", Star],
              ].map(([label, value, change, Icon]) => {
                const I = Icon as typeof Target;
                return (
                  <div key={label as string} className="rounded-2xl border border-line bg-surface/40 p-4">
                    <div className="flex items-center justify-between">
                      <span className="grid size-8 place-items-center rounded-lg bg-accent/10 text-accent">
                        <I size={14} />
                      </span>
                      <span className="text-[8px] font-bold text-emerald-300">{change as string}</span>
                    </div>
                    <div className="mt-2 text-base font-extrabold">{value as string}</div>
                    <div className="mt-0.5 text-[8px] text-muted">{label as string}</div>
                  </div>
                );
              })}
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
              <div className="rounded-2xl border border-line bg-surface/40 p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-[12px] font-bold">روند بازدید و سرنخ</h3>
                    <p className="mt-0.5 text-[8.5px] text-muted">۸ ماه گذشته</p>
                  </div>
                  <div className="flex items-center gap-3 text-[8px] text-muted">
                    <span className="flex items-center gap-1">
                      <span className="size-2 rounded-full bg-accent" /> بازدید
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="size-2 rounded-full bg-[#7de2c3]" /> سرنخ
                    </span>
                  </div>
                </div>
                <AreaChart
                  id="crm-views"
                  data={monthlyPerformance.map((m) => ({ label: m.month, value: m.views }))}
                  height={220}
                  color="#c8f45a"
                />
              </div>

              <div className="rounded-2xl border border-line bg-surface/40 p-5">
                <h3 className="text-[12px] font-bold">منبع سرنخ‌ها</h3>
                <p className="mt-0.5 text-[8.5px] text-muted">مهر و آبان ۱۴۰۴</p>
                <div className="mt-4">
                  <Donut
                    segments={[
                      { label: "دستیار هوشمند", value: 42, color: "#c8f45a" },
                      { label: "اینستاگرام", value: 38, color: "#7de2c3" },
                      { label: "وب‌سایت", value: 31, color: "#f5c86b" },
                      { label: "دیوار", value: 25, color: "#8b99a4" },
                    ]}
                    centerLabel="سرنخ جدید"
                    centerValue="۱۳۶"
                    size={140}
                  />
                </div>
                <div className="mt-4 rounded-xl border border-accent/15 bg-accent/[0.04] p-3 text-[8.5px] leading-5 text-muted">
                  <span className="font-bold text-accent">دستیار هوشمند</span> بیشترین سرنخ
                  باکیفیت را آورده؛ نرخ تبدیل ۲۳٪.
                </div>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
              <div className="rounded-2xl border border-line bg-surface/40 p-5">
                <h3 className="text-[11.5px] font-bold">قیف فروش</h3>
                <div className="mt-4">
                  <Funnel
                    steps={[
                      { label: "بازدید فایل", value: 28100 },
                      { label: "سرنخ", value: 172 },
                      { label: "بازدید حضوری", value: 64 },
                      { label: "مذاکره", value: 31 },
                      { label: "قرارداد", value: 18 },
                    ]}
                    color="#c8f45a"
                  />
                </div>
              </div>
              <div className="rounded-2xl border border-line bg-surface/40 p-5">
                <h3 className="text-[11.5px] font-bold">میانگین قیمت هر متر</h3>
                <p className="mt-0.5 text-[8px] text-muted">میلیون تومان · مناطق منتخب</p>
                <div className="mt-4">
                  <BarList
                    data={districtPrices.map((d) => ({
                      label: d.district,
                      value: d.price,
                      growth: d.growth,
                    }))}
                    suffix="م"
                    color="#7de2c3"
                    showGrowth
                  />
                </div>
              </div>
              <div className="rounded-2xl border border-line bg-surface/40 p-5">
                <h3 className="text-[11.5px] font-bold">عملکرد ماهانه</h3>
                <div className="mt-3 space-y-2">
                  {monthlyPerformance.slice(-4).map((m) => (
                    <div key={m.month} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2 text-[8.5px]">
                      <span className="text-muted">{m.month}</span>
                      <span>{fa(m.leads)} سرنخ</span>
                      <span className="font-bold text-accent">{fa(m.deals)} معامله</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 rounded-lg border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 text-[8px] text-emerald-300">
                  رشد ۱۸٪ نسبت به ماه قبل
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {tab === "training" ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface/40 p-5">
              <div>
                <h2 className="text-[12.5px] font-bold">آموزش مدیر و مشاوران</h2>
                <p className="mt-1 text-[8.5px] text-muted">
                  ویدئوهای کوتاه و قدم‌به‌قدم برای استفاده‌ی کامل از سامانه.
                </p>
              </div>
              <span className="flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/5 px-3 py-1.5 text-[8px] font-semibold text-accent">
                <GraduationCap size={11} /> ۴ دوره · ۱ ساعت و ۱۰ دقیقه
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {trainingVideos.map((v, i) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVideoOpen(v)}
                  className="group overflow-hidden rounded-2xl border border-line bg-surface/40 text-start transition hover:border-accent/30 hover:shadow-lg"
                >
                  <div className="relative aspect-[16/8] overflow-hidden">
                    <img
                      src={["/images/interior-3.jpg", "/images/living-1.jpg", "/images/interior-2.jpg", "/images/living-2.jpg"][i]}
                      alt={v.title}
                      className="size-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#06090c]/90 to-transparent" />
                    <span className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/40 px-2 py-1 text-[7.5px] text-white backdrop-blur">
                      {v.level}
                    </span>
                    <span className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-[#0a0f0c] shadow-lg transition group-hover:scale-110">
                      <Play size={17} fill="currentColor" className="ms-0.5" />
                    </span>
                    <span className="absolute bottom-2 left-3 flex items-center gap-1 rounded bg-black/50 px-1.5 py-0.5 text-[7.5px] text-white">
                      <Clock size={8} /> {v.duration}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-[11px] font-bold">{v.title}</h3>
                    <p className="mt-1 text-[8.5px] text-muted">{v.desc}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <ProgressBar value={progress[v.id]} color="#c8f45a" className="flex-1" />
                      <span className="text-[7.5px] text-muted">{fa(progress[v.id])}٪</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-line bg-surface/40 p-5 sm:flex-row">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-accent/10 text-accent">
                  <FileText size={17} />
                </span>
                <div>
                  <div className="text-[10.5px] font-bold">راهنمای PDF سامانه هوشمند</div>
                  <div className="mt-0.5 text-[8px] text-muted">نسخه ۲.۱ · ۳۲ صفحه</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => pushToast("راهنمای PDF در نسخه دمو غیرفعال است.", "info")}
                className="flex h-9 items-center gap-1.5 rounded-xl border border-line px-4 text-[8.5px] font-semibold text-muted transition hover:text-accent"
              >
                <Download size={11} /> دانلود راهنما
              </button>
            </div>
          </div>
        ) : null}

        {tab === "settings" ? (
          <div className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-2xl border border-line bg-surface/40 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot size={15} className="text-accent" />
                  <h2 className="text-[12px] font-bold">ربات تلگرام و دستیار</h2>
                </div>
                <Toggle
                  checked={settings.telegram}
                  onChange={(v) => {
                    setSettings({ ...settings, telegram: v });
                    pushToast(v ? "ربات تلگرام متصل شد." : "ربات تلگرام قطع شد.", "info");
                  }}
                />
              </div>
              <p className="mt-2 text-[8.5px] leading-5 text-muted">
                دریافت سرنخ، ارسال گزارش روزانه و پاسخ خودکار به سوالات پرتکرار.
              </p>
              <div className="mt-3 flex items-center justify-between rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-3 py-2.5">
                <span className="flex items-center gap-2 text-[9px] font-semibold text-emerald-300">
                  <span className="size-1.5 rounded-full bg-emerald-400" /> ربات متصل است
                </span>
                <span className="text-[7.5px] text-emerald-300/70">۵۲ پیام امروز</span>
              </div>
              <label className="mt-4 block">
                <span className="mb-1.5 block text-[8.5px] text-muted">توکن ربات</span>
                <input value="••••••••••••••••••••••" readOnly className="field !py-2.5 !text-[9.5px]" />
              </label>
              <label className="mt-3 block">
                <span className="mb-1.5 block text-[8.5px] text-muted">Chat ID مدیر</span>
                <input value="128944021" readOnly className="field !py-2.5 !text-[9.5px]" />
              </label>
              <button
                type="button"
                onClick={() => pushToast("تنظیمات ربات ذخیره شد (دمو).")}
                className="mt-4 flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-accent text-[9px] font-bold text-[#0a0f0c]"
              >
                <Check size={12} /> ذخیره تنظیمات
              </button>
            </div>

            <div className="rounded-2xl border border-line bg-surface/40 p-5">
              <div className="flex items-center gap-2">
                <Bell size={15} className="text-accent" />
                <h2 className="text-[12px] font-bold">اعلان‌ها و اتوماسیون</h2>
              </div>
              <div className="mt-3 space-y-1">
                {[
                  ["sms", "پیامک سرنخ جدید", "ارسال فوری به مشاور مسئول"],
                  ["email", "گزارش ایمیلی هفتگی", "ارسال به مدیر مجموعه"],
                  ["autoPublish", "انتشار خودکار آگهی", "بعد از تایید کارشناس"],
                  ["roundRobin", "توزیع گردشی سرنخ", "بین مشاوران فعال منطقه"],
                  ["aiSuggest", "پیشنهاد هوشمند پیگیری", "اولویت‌بندی سرنخ‌ها با AI"],
                ].map(([key, title, desc]) => (
                  <div key={key} className="flex items-center justify-between gap-3 border-b border-line py-2.5 last:border-0">
                    <div>
                      <div className="text-[9px] font-semibold">{title}</div>
                      <div className="mt-0.5 text-[7.5px] text-muted">{desc}</div>
                    </div>
                    <Toggle
                      checked={settings[key as keyof typeof settings]}
                      onChange={(v) => setSettings({ ...settings, [key]: v })}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-surface/40 p-5">
              <div className="flex items-center gap-2">
                <Users size={15} className="text-accent" />
                <h2 className="text-[12px] font-bold">دسترسی تیم</h2>
              </div>
              <div className="mt-3 space-y-2">
                {consultants.map((c, i) => (
                  <div key={c.id} className="flex items-center gap-2.5 rounded-xl border border-line bg-white/[0.02] p-2.5">
                    <span className={`grid size-8 place-items-center rounded-full bg-gradient-to-br ${c.tone} text-[8px] font-bold text-white`}>
                      {c.initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[9px] font-semibold">{c.name}</div>
                      <div className="mt-0.5 text-[7.5px] text-muted">{i === 0 ? "مدیر · دسترسی کامل" : "مشاور · دسترسی فایل‌های خود"}</div>
                    </div>
                    <span className="rounded-full border border-accent/20 bg-accent/5 px-2 py-0.5 text-[7px] text-accent">
                      {i === 0 ? "Admin" : "Agent"}
                    </span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => pushToast("دعوت‌نامه‌ی عضو جدید در نسخه دمو غیرفعال است.", "info")}
                className="mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-line text-[8.5px] font-semibold text-muted hover:text-accent"
              >
                <Plus size={11} /> دعوت عضو جدید
              </button>
            </div>

            <div className="rounded-2xl border border-line bg-surface/40 p-5">
              <div className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-accent" />
                <h2 className="text-[12px] font-bold">امنیت و یکپارچه‌سازی</h2>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  ["ورود دو مرحله‌ای", "فعال"],
                  ["لاگ فعالیت", "۹۰ روز"],
                  ["وب‌سایت", "متصل"],
                  ["اینستاگرام", "متصل"],
                  ["واتس‌اپ", "متصل"],
                  ["درگاه پرداخت", "آماده"],
                ].map(([t, d]) => (
                  <div key={t} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-2.5 py-2">
                    <span className="text-[8px] text-muted">{t}</span>
                    <span className="flex items-center gap-1 text-[8px] font-semibold">
                      {d} <Check size={9} className="text-accent" />
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-xl border border-dashed border-line p-3 text-[7.5px] leading-5 text-muted">
                اتصال به سامانه‌های خارجی و کلید API در نسخه‌ی نهایی، پس از خرید پکیج
                فعال می‌شود.
              </div>
            </div>
          </div>
        ) : null}
      </Container>

      {selectedLead ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="بستن"
            onClick={() => setSelectedLead(null)}
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
          />
          <div className="animate-fade-up relative w-full max-w-md overflow-hidden rounded-[1.5rem] border border-line bg-[#080d11] shadow-2xl">
            <div className="flex items-start justify-between border-b border-line px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-accent/10 text-[10px] font-bold text-accent">
                  {selectedLead.name.split(" ")[0]?.[0]}
                  {selectedLead.name.split(" ")[1]?.[0]}
                </span>
                <div>
                  <h3 className="text-sm font-bold">{selectedLead.name}</h3>
                  <p className="mt-0.5 text-[8.5px] text-muted">{selectedLead.phone}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="grid size-8 place-items-center rounded-full border border-line text-muted"
                aria-label="بستن"
              >
                <X size={15} />
              </button>
            </div>
            <div className="p-5">
              <div className="space-y-2 rounded-xl bg-white/[0.03] p-3 text-[8.5px]">
                {[
                  ["ملک", properties.find((p) => p.id === selectedLead.propertyId)?.title],
                  ["مشاور", consultants.find((c) => c.id === selectedLead.agentId)?.name],
                  ["منبع", selectedLead.source],
                  ["ارزش", formatPriceShort(selectedLead.value)],
                  ["زمان ثبت", selectedLead.createdAt],
                ].map(([l, v]) => (
                  <div key={l as string} className="flex items-center justify-between gap-3">
                    <span className="text-muted">{l}</span>
                    <span className="truncate font-semibold">{v}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 rounded-xl border border-line p-3 text-[8.5px] leading-5 text-muted">
                {selectedLead.note}
              </p>
              <div className="mt-4">
                <span className="mb-2 block text-[8.5px] font-semibold">تغییر مرحله</span>
                <div className="flex flex-wrap gap-1.5">
                  {crmStages.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        moveLead(selectedLead.id, s.id);
                        setSelectedLead({ ...selectedLead, stage: s.id });
                      }}
                      className={cn(
                        "rounded-full border px-2 py-1 text-[7.5px] font-semibold transition",
                        stageOf(selectedLead) === s.id
                          ? stageMeta[s.id].className
                          : "border-line text-muted hover:border-accent/30",
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <a
                  href={`tel:${selectedLead.phone}`}
                  className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-accent text-[9px] font-bold text-[#0a0f0c]"
                >
                  <Phone size={12} /> تماس
                </a>
                <button
                  type="button"
                  onClick={() => {
                    pushToast("پیام برای مشتری در صف ارسال قرار گرفت.");
                    setSelectedLead(null);
                  }}
                  className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-line text-[9px] font-semibold text-muted"
                >
                  <Send size={12} /> ارسال پیام
                </button>
              </div>
              <button
                type="button"
                onClick={() => pushToast("یادآوری پیگیری برای فردا تنظیم شد.")}
                className="mt-2 flex h-9 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-line text-[8.5px] text-muted hover:text-accent"
              >
                <Clock size={11} /> تنظیم یادآوری پیگیری
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {addOpen ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="بستن"
            onClick={() => setAddOpen(false)}
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
          />
          <form
            onSubmit={addLead}
            className="animate-fade-up relative w-full max-w-lg overflow-hidden rounded-[1.5rem] border border-line bg-[#080d11] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div>
                <h3 className="text-sm font-bold">ثبت سرنخ جدید</h3>
                <p className="mt-0.5 text-[8.5px] text-muted">اطلاعات اولیه را وارد کن؛ بقیه را تیم تکمیل می‌کند.</p>
              </div>
              <button
                type="button"
                onClick={() => setAddOpen(false)}
                className="grid size-8 place-items-center rounded-full border border-line text-muted"
                aria-label="بستن"
              >
                <X size={15} />
              </button>
            </div>
            <div className="grid gap-3 p-5 sm:grid-cols-2">
              <label>
                <span className="mb-1.5 block text-[8.5px] text-muted">نام و نام خانوادگی</span>
                <input
                  required
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  className="field !py-2.5 !text-[10px]"
                  placeholder="مثلاً مهدی کریمی"
                />
              </label>
              <label>
                <span className="mb-1.5 block text-[8.5px] text-muted">شماره تماس</span>
                <input
                  required
                  value={newLead.phone}
                  onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                  className="field !py-2.5 !text-[10px]"
                  placeholder="۰۹۱۲..."
                  inputMode="tel"
                />
              </label>
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-[8.5px] text-muted">ملک مورد نظر</span>
                <select
                  value={newLead.propertyId}
                  onChange={(e) => setNewLead({ ...newLead, propertyId: e.target.value })}
                  className="field !py-2.5 !text-[10px]"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} · {p.district} · {propertyPrice(p).main}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="mb-1.5 block text-[8.5px] text-muted">منبع</span>
                <select
                  value={newLead.source}
                  onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                  className="field !py-2.5 !text-[10px]"
                >
                  {["دستیار هوشمند", "اینستاگرام", "وب‌سایت", "دیوار", "معرفی مشتری", "تماس تلفنی"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="mb-1.5 block text-[8.5px] text-muted">مرحله</span>
                <select
                  value={newLead.stage}
                  onChange={(e) => setNewLead({ ...newLead, stage: e.target.value as Lead["stage"] })}
                  className="field !py-2.5 !text-[10px]"
                >
                  {crmStages.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-[8.5px] text-muted">یادداشت</span>
                <textarea
                  value={newLead.note}
                  onChange={(e) => setNewLead({ ...newLead, note: e.target.value })}
                  rows={2}
                  className="field !text-[10px]"
                  placeholder="نیاز مشتری، بودجه یا زمان بازدید..."
                />
              </label>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-line px-5 py-3">
              <button
                type="button"
                onClick={() => setAddOpen(false)}
                className="h-9 rounded-xl border border-line px-4 text-[9px] font-semibold text-muted"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="flex h-9 items-center gap-1.5 rounded-xl bg-accent px-4 text-[9px] font-bold text-[#0a0f0c]"
              >
                <Plus size={12} /> ثبت سرنخ
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {videoOpen ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="بستن"
            onClick={() => setVideoOpen(null)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <div className="animate-fade-up relative w-full max-w-2xl overflow-hidden rounded-[1.5rem] border border-line bg-[#080d11] shadow-2xl">
            <div className="relative aspect-video">
              <img src="/images/interior-2.jpg" alt="" className="size-full object-cover opacity-40" />
              <div className="absolute inset-0 grid place-items-center">
                <span className="grid size-16 place-items-center rounded-full bg-accent text-[#0a0f0c]">
                  <Play size={27} fill="currentColor" className="ms-1" />
                </span>
              </div>
              <span className="absolute bottom-3 right-4 rounded-full border border-white/10 bg-black/50 px-2 py-1 text-[8px] text-white backdrop-blur">
                {videoOpen.duration} · {videoOpen.level}
              </span>
            </div>
            <div className="p-5">
              <h3 className="text-sm font-bold">{videoOpen.title}</h3>
              <p className="mt-1 text-[9.5px] text-muted">{videoOpen.desc}</p>
              <div className="mt-4 flex items-center gap-3">
                <ProgressBar value={progress[videoOpen.id]} color="#c8f45a" className="flex-1" />
                <span className="text-[8.5px] text-muted">{fa(progress[videoOpen.id])}٪</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setProgress((prev) => ({
                      ...prev,
                      [videoOpen.id]: Math.min(100, (prev[videoOpen.id] ?? 0) + 25),
                    }));
                    pushToast("پیشرفت دوره به‌روزرسانی شد (دمو).");
                  }}
                  className="flex h-9 items-center gap-1.5 rounded-xl bg-accent px-4 text-[9px] font-bold text-[#0a0f0c]"
                >
                  <Play size={11} /> ادامه دوره
                </button>
                <button
                  type="button"
                  onClick={() => setVideoOpen(null)}
                  className="h-9 rounded-xl border border-line px-4 text-[9px] font-semibold text-muted"
                >
                  بستن
                </button>
              </div>
              <p className="mt-3 text-[7.5px] text-muted">ویدئوی واقعی در نسخه‌ی نهایی بارگذاری می‌شود.</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
