import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpLeft,
  BarChart3,
  Bot,
  Check,
  CircleCheck,
  Compass,
  GitCompareArrows,
  GraduationCap,
  Heart,
  Layers,
  Map,
  MapPin,
  MessageSquare,
  ScanEye,
  ShieldCheck,
  Sparkles,
  SquareKanban,
  Star,
  TrendingUp,
  Users,
  WandSparkles,
  Zap,
} from "lucide-react";
import { Container, Eyebrow, SectionHead } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/reveal";
import { PropertyCardSmart } from "@/components/property-cards";
import { SmartHeroSearch } from "@/components/smart/hero-search";
import { AssistantEmbedded } from "@/components/smart-assistant";
import { PanoramaViewer } from "@/components/smart/panorama";
import { TehranMap } from "@/components/smart/tehran-map";
import { FaqAccordion } from "@/components/faq-accordion";
import { properties } from "@/lib/data";
import { fa, propertyPrice } from "@/lib/utils";

const featured = ["p1", "p10", "p5"]
  .map((id) => properties.find((p) => p.id === id))
  .filter(Boolean) as typeof properties;

const mapItems = properties.filter((p) => ["p1", "p2", "p3", "p5", "p7", "p10", "p12"].includes(p.id));

const features = [
  { icon: Bot, title: "دستیار هوشمند", desc: "جست‌وجوی زبان طبیعی و پاسخ مبتنی بر داده‌های سامانه" },
  { icon: ScanEye, title: "تور مجازی ۳۶۰°", desc: "بازدید تعاملی از فضای ملک، بدون محدودیت زمان" },
  { icon: GitCompareArrows, title: "مقایسه هوشمند", desc: "مقایسه‌ی چند ملک و پیشنهاد متناسب با نیاز" },
  { icon: Heart, title: "پنل اختصاصی مشتری", desc: "ذخیره، مقایسه و پیگیری درخواست‌های بازدید" },
  { icon: Map, title: "نقشه تعاملی", desc: "نمایش موقعیت املاک و تحلیل محله" },
  { icon: SquareKanban, title: "CRM یکپارچه", desc: "مدیریت سرنخ، قیف فروش و پیگیری تیم" },
  { icon: BarChart3, title: "گزارش‌های پیشرفته", desc: "بازدید، تبدیل، کمیسیون و عملکرد مشاوران" },
  { icon: GraduationCap, title: "آموزش کامل", desc: "ویدئوهای اختصاصی مدیر و مشاوران" },
];

export default function SmartHomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="smart-glow pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[760px] grid-lines opacity-[0.14]" />
        <div className="pointer-events-none absolute -left-40 top-20 size-[520px] rounded-full border border-accent/[0.07]" />
        <div className="pointer-events-none absolute -left-20 top-40 size-[320px] rounded-full border border-accent/[0.09]" />
        <div className="pointer-events-none absolute left-1/3 top-10 size-64 rounded-full bg-accent/10 blur-[110px]" />

        <Container className="relative grid items-center gap-14 pb-16 pt-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:pb-24 lg:pt-16">
          <div>
            <div className="animate-fade-up">
              <Eyebrow variant="smart">نسل جدید جست‌وجوی ملک در تهران</Eyebrow>
            </div>
            <h1 className="animate-fade-up delay-1 mt-6 text-[2.6rem] font-black leading-[1.22] tracking-tight sm:text-[3.5rem] lg:text-[4.1rem]">
              خانه‌ای که
              <br />
              <span className="text-gradient-lime">با تو فکر می‌کند.</span>
            </h1>
            <p className="animate-fade-up delay-2 mt-6 max-w-xl text-[13.5px] leading-8 text-muted sm:text-[14.5px]">
              فقط یک جست‌وجوی ساده؛ بودجه، منطقه و سبک زندگی‌ات را بگو. دستیار آرامش
              فایل‌ها را پیدا می‌کند، مقایسه می‌کند و تور ۳۶۰ را برایت باز می‌کند.
            </p>

            <div className="animate-fade-up delay-3 relative z-20 mt-8">
              <SmartHeroSearch />
            </div>

            <div className="animate-fade-up delay-4 mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6">
              <div className="flex items-center gap-2">
                <span className="flex -space-x-2">
                  {["س‌ا", "ا‌ر", "ن‌م"].map((t, i) => (
                    <span
                      key={t}
                      className={`grid size-8 place-items-center rounded-full border-2 border-bg bg-gradient-to-br ${
                        ["from-emerald-700 to-teal-500", "from-amber-700 to-yellow-500", "from-rose-700 to-orange-500"][i]
                      } text-[8px] font-bold text-white`}
                    >
                      {t}
                    </span>
                  ))}
                </span>
                <div className="text-[10px] leading-4 text-muted">
                  <span className="flex items-center gap-1 font-bold text-ink">
                    <Star size={10} className="fill-accent text-accent" /> ۴.۹ / ۵
                  </span>
                  رضایت مشتریان
                </div>
              </div>
              <span className="hidden h-7 w-px bg-line sm:block" />
              <div className="flex items-center gap-2 text-[10px] text-muted">
                <span className="grid size-7 place-items-center rounded-full bg-accent/10 text-accent">
                  <ShieldCheck size={13} />
                </span>
                فایل‌های بررسی‌شده
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted">
                <span className="grid size-7 place-items-center rounded-full bg-accent/10 text-accent">
                  <Zap size={13} />
                </span>
                پاسخ آنی دستیار
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
            <div className="pointer-events-none absolute inset-6 rounded-[2.4rem] border border-accent/15" />
            <div className="pointer-events-none absolute -right-6 top-1/4 size-24 rounded-full border border-accent/20" />
            <div className="relative overflow-hidden rounded-[2rem] border border-line bg-surface">
              <img
                src="/images/villa-2.jpg"
                alt="ویلای لوکس با استخر"
                className="h-[440px] w-full object-cover sm:h-[520px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06090c] via-[#06090c]/10 to-[#06090c]/35" />

              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/35 px-2.5 py-1 text-[9px] text-white backdrop-blur">
                  <ScanEye size={11} className="text-accent" /> تور ۳۶۰ درجه
                </span>
                <span className="flex items-center gap-1 rounded-full border border-accent/30 bg-black/35 px-2.5 py-1 text-[9px] text-accent backdrop-blur">
                  <Sparkles size={11} /> AI Score ۹۶
                </span>
              </div>

              <div className="absolute bottom-4 right-4 left-4">
                <div className="rounded-2xl border border-white/10 bg-[#0a1015]/85 p-3.5 backdrop-blur-xl">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[11px] font-bold text-white">پنت‌هاوس زعفرانیه</div>
                      <div className="mt-0.5 flex items-center gap-2 text-[8.5px] text-white/50">
                        <span className="flex items-center gap-0.5"><MapPin size={8} /> زعفرانیه</span>
                        <span>·</span>
                        <span>۲۴۵ متر</span>
                        <span>·</span>
                        <span>۳ خواب</span>
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="text-[12px] font-extrabold text-accent">۴۲ میلیارد</div>
                      <div className="text-[7.5px] text-white/40">تومان</div>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-1.5">
                    {[
                      ["قیمت", "۴٪ زیر میانگین", "text-emerald-400"],
                      ["نور", "عالی", "text-accent"],
                      ["دسترسی", "۸.۵ / ۱۰", "text-accent2"],
                    ].map(([l, v, c]) => (
                      <div key={l} className="rounded-lg border border-white/8 bg-white/[0.03] px-2 py-1.5">
                        <div className="text-[7px] text-white/40">{l}</div>
                        <div className={`mt-0.5 text-[8.5px] font-semibold ${c}`}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-floaty absolute -right-3 top-24 z-20 hidden w-[190px] rounded-2xl border border-line bg-[#0a1015]/95 p-3 shadow-2xl backdrop-blur sm:block">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-xl bg-accent/10 text-accent">
                  <WandSparkles size={15} />
                </span>
                <div>
                  <div className="text-[9px] font-bold">تحلیل هوشمند</div>
                  <div className="text-[7.5px] text-muted">۳ فایل مشابه پیدا شد</div>
                </div>
              </div>
              <div className="mt-2 space-y-1.5">
                {[
                  ["تطابق با نیاز", 96],
                  ["ارزش خرید", 88],
                ].map(([l, v]) => (
                  <div key={l as string}>
                    <div className="mb-0.5 flex justify-between text-[7px] text-muted">
                      <span>{l as string}</span>
                      <span>{fa(v as number)}٪</span>
                    </div>
                    <div className="h-1 rounded-full bg-line">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-floaty-slow absolute -left-4 bottom-32 z-20 hidden items-center gap-2 rounded-2xl border border-line bg-[#0a1015]/95 px-3 py-2.5 shadow-2xl backdrop-blur sm:flex">
              <span className="grid size-8 place-items-center rounded-xl bg-accent text-[#0a0f0c]">
                <Map size={15} />
              </span>
              <div>
                <div className="text-[9px] font-bold">۱۴ ملک روی نقشه</div>
                <div className="text-[7.5px] text-muted">موقعیت و تحلیل محله</div>
              </div>
            </div>
          </div>
        </Container>

        <div className="relative border-y border-line bg-[#080d11]/70">
          <Container className="grid grid-cols-2 divide-x divide-x-reverse divide-line sm:grid-cols-4">
            {[
              ["۱۴", "فایل فعال و بررسی‌شده"],
              ["۲۸.۱K", "بازدید ماه گذشته"],
              ["۹۶٪", "دقت پیشنهاد دستیار"],
              ["۲۴/۷", "پشتیبانی هوشمند"],
            ].map(([v, l]) => (
              <div key={l} className="px-4 py-5 text-center sm:px-6">
                <div className="text-xl font-extrabold text-accent sm:text-2xl">{v}</div>
                <div className="mt-1 text-[9px] text-muted">{l}</div>
              </div>
            ))}
          </Container>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <Container>
          <Reveal>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { n: "۰۱", icon: MessageSquare, title: "بگو دنبال چه هستی", desc: "به زبان خودت بنویس؛ بودجه، محله، متراژ یا حتی سبک زندگی." },
                { n: "۰۲", icon: GitCompareArrows, title: "هوشمند مقایسه کن", desc: "دستیار فایل‌ها را مقایسه و بهترین گزینه‌ها را پیشنهاد می‌کند." },
                { n: "۰۳", icon: ScanEye, title: "بازدید کن و انتخاب کن", desc: "تور ۳۶۰ یا بازدید حضوری؛ با مشاور اختصاصی تا قرارداد." },
              ].map((step, i) => (
                <Reveal key={step.n} delay={i * 80}>
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-line bg-surface/50 p-5 transition hover:border-accent/25">
                    <span className="absolute left-4 top-4 text-[28px] font-black text-white/[0.04]">{step.n}</span>
                    <span className="grid size-10 place-items-center rounded-xl bg-accent/10 text-accent">
                      <step.icon size={19} />
                    </span>
                    <h3 className="mt-4 text-[13px] font-bold">{step.title}</h3>
                    <p className="mt-2 text-[10.5px] leading-6 text-muted">{step.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      <section id="assistant" className="scroll-mt-24 border-y border-line bg-[#080d11]/60 py-16 lg:py-24">
        <Container className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <div>
              <Eyebrow variant="smart">دستیار هوشمند</Eyebrow>
              <h2 className="mt-4 text-2xl font-black leading-[1.35] tracking-tight sm:text-3xl lg:text-[2.5rem]">
                فقط بپرس؛
                <br />
                <span className="text-gradient-lime">بقیه‌اش با من.</span>
              </h2>
              <p className="mt-4 max-w-md text-[12.5px] leading-7 text-muted">
                دستیار آرامش به داده‌های ثبت‌شده در سامانه متصل است؛ پاسخ‌ها را از دل
                فایل‌های واقعی می‌سازد، نه از حدس. تا ۵ سامانه را می‌توان به آن وصل کرد.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  "درک زبان طبیعی: «آپارتمان ۱۵۰ متری نزدیک پارک، تا ۳۰ میلیارد»",
                  "پاسخ مبتنی بر اطلاعات ثبت‌شده و موجودی واقعی",
                  "مقایسه‌ی چند ملک و پیشنهاد متناسب با نیاز مشتری",
                  "اتصال به وب‌سایت، تلگرام، واتس‌اپ و CRM",
                ].map((t) => (
                  <div key={t} className="flex items-start gap-2.5 text-[11px] leading-6 text-muted">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                      <Check size={11} />
                    </span>
                    {t}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/smart/explore"
                  className="group flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-xs font-bold text-[#0a0f0c] transition hover:bg-[#d4fa7a]"
                >
                  جست‌وجوی هوشمند
                  <ArrowLeft size={15} className="transition group-hover:-translate-x-1" />
                </Link>
                <span className="flex items-center gap-1.5 text-[9.5px] text-muted">
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
                    <span className="relative size-1.5 rounded-full bg-accent" />
                  </span>
                  آنلاین و آماده‌ی پاسخ
                </span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <AssistantEmbedded />
          </Reveal>
        </Container>
      </section>

      <section className="py-16 lg:py-24">
        <Container>
          <Reveal>
            <SectionHead
              variant="smart"
              eyebrow="تجربه‌ی بازدید"
              title={
                <>
                  قبل از رفتن، <span className="text-accent">خانه را بگرد.</span>
                </>
              }
              desc="تور ۳۶۰ درجه، فضای ملک را همان‌طور که هست نشان می‌دهد؛ بکش، بچرخان و از هر زاویه ببین."
              action={
                <Link
                  href="/smart/properties/p1"
                  className="group inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 text-xs font-semibold transition hover:border-accent/30 hover:text-accent"
                >
                  تور کامل پنت‌هاوس
                  <ArrowUpLeft size={14} className="transition group-hover:-translate-y-0.5 group-hover:-translate-x-0.5" />
                </Link>
              }
            />
          </Reveal>
          <Reveal>
            <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
              <PanoramaViewer
                image="/images/panorama.jpg"
                title="پنت‌هاوس زعفرانیه"
                className="aspect-[16/9] w-full"
                hotspots={[
                  { x: 22, y: 56, label: "نشیمن" },
                  { x: 55, y: 45, label: "آشپزخانه" },
                  { x: 78, y: 62, label: "تراس" },
                ]}
              />
              <div className="flex flex-col gap-3">
                <div className="flex-1 rounded-2xl border border-line bg-surface/50 p-5">
                  <span className="flex items-center gap-1.5 text-[9px] font-semibold text-accent">
                    <ScanEye size={12} /> داخل تور
                  </span>
                  <h3 className="mt-2 text-base font-bold">۵ نقطه‌ی تعاملی</h3>
                  <p className="mt-2 text-[10.5px] leading-6 text-muted">
                    روی هات‌اسپات‌ها بزن تا از نشیمن به آشپزخانه و تراس بروی. زوم و
                    تمام‌صفحه هم در دسترس است.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {["نشیمن", "آشپزخانه", "تراس", "اتاق خواب", "سرویس"].map((t) => (
                      <span key={t} className="rounded-full border border-line px-2.5 py-1 text-[8.5px] text-muted">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-accent/20 bg-accent/[0.05] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-muted">بازدید حضوری با تور</div>
                      <div className="mt-1 text-xl font-extrabold text-accent">+۴۰٪</div>
                    </div>
                    <TrendingUp size={24} className="text-accent/60" />
                  </div>
                  <p className="mt-2 text-[9px] leading-5 text-muted">
                    احتمال بازدید حضوری برای فایل‌های دارای تور مجازی.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section id="map" className="scroll-mt-24 border-y border-line bg-[#080d11]/60 py-16 lg:py-24">
        <Container>
          <Reveal>
            <SectionHead
              variant="smart"
              eyebrow="نقشه تعاملی"
              title="ملک را روی نقشه ببین، نه فقط در لیست."
              desc="موقعیت هر فایل، محله و دسترسی‌ها را یک‌جا ببین؛ روی هر پین بزن و خلاصه‌ی ملک را باز کن."
              action={
                <Link
                  href="/smart/explore#map"
                  className="group inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 text-xs font-semibold transition hover:border-accent/30 hover:text-accent"
                >
                  نقشه‌ی کامل
                  <ArrowLeft size={14} className="transition group-hover:-translate-x-1" />
                </Link>
              }
            />
          </Reveal>
          <div className="grid gap-4 lg:grid-cols-[1.5fr_0.5fr]">
            <Reveal>
              <TehranMap items={mapItems} className="h-[460px] w-full" />
            </Reveal>
            <Reveal delay={100}>
              <div className="flex h-full flex-col gap-3">
                <div className="rounded-2xl border border-line bg-surface/50 p-5">
                  <span className="text-[9px] font-semibold text-accent">تحلیل محله</span>
                  <h3 className="mt-1.5 text-sm font-bold">کدام منطقه برای تو بهتر است؟</h3>
                  <div className="mt-3 space-y-2">
                    {[
                      ["زعفرانیه", "لوکس، آرام، دسترسی عالی", "۲۱۰ م"],
                      ["الهیه", "مرکز خرید و رستوران", "۱۸۵ م"],
                      ["سعادت‌آباد", "خانوادگی و اقتصادی", "۱۱۸ م"],
                    ].map(([n, d, p]) => (
                      <div key={n} className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2.5">
                        <div>
                          <div className="text-[9.5px] font-semibold">{n}</div>
                          <div className="mt-0.5 text-[7.5px] text-muted">{d}</div>
                        </div>
                        <div className="text-[8.5px] font-bold text-accent">{p} / متر</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-line bg-surface/50 p-5">
                  <div className="flex items-center gap-2 text-[9px] text-muted">
                    <Layers size={13} className="text-accent" />
                    لایه‌های نقشه
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {["املاک", "مدارس", "مترو", "پارک"].map((l) => (
                      <span key={l} className="rounded-full border border-line px-2.5 py-1 text-[8px] text-muted">
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-24">
        <Container>
          <Reveal>
            <SectionHead
              variant="smart"
              eyebrow="منتخب هوشمند"
              title={
                <>
                  فایل‌هایی که <span className="text-accent">دستیار پیشنهاد می‌دهد</span>
                </>
              }
              desc="بر اساس تطابق با نیاز، ارزش خرید و بازخورد مشتریان رتبه‌بندی شده‌اند."
              action={
                <Link
                  href="/smart/explore"
                  className="group inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-xs font-bold text-[#0a0f0c] transition hover:bg-[#d4fa7a]"
                >
                  همه‌ی فایل‌ها
                  <ArrowLeft size={15} className="transition group-hover:-translate-x-1" />
                </Link>
              }
            />
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <PropertyCardSmart property={p} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-16 lg:pb-24">
        <Container>
          <Reveal>
            <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="relative overflow-hidden rounded-[1.6rem] border border-line bg-surface/50 p-6 sm:p-8">
                <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-accent/5 blur-3xl" />
                <Eyebrow variant="smart">مقایسه هوشمند</Eyebrow>
                <h2 className="mt-4 text-2xl font-black leading-[1.4] tracking-tight sm:text-3xl">
                  سه ملک را کنار هم بگذار،
                  <br />
                  <span className="text-gradient-lime">بهترین را انتخاب کن.</span>
                </h2>
                <p className="mt-3 max-w-lg text-[11.5px] leading-7 text-muted">
                  قیمت هر متر، متراژ، امکانات، امتیاز هوشمند و هزینه‌های جانبی؛ همه در یک
                  جدول شفاف.
                </p>
                <div className="mt-5 overflow-hidden rounded-xl border border-line">
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] bg-white/[0.03] px-3 py-2 text-[8px] text-muted">
                    <span>ویژگی</span>
                    <span className="text-center">پنت‌هاوس</span>
                    <span className="text-center">الهیه</span>
                    <span className="text-center">ولنجک</span>
                  </div>
                  {[
                    ["قیمت (میلیارد)", "۴۲", "۲۸.۵", "۳۵"],
                    ["متراژ", "۲۴۵", "۱۸۰", "۲۰۰"],
                    ["امتیاز AI", "۹۶", "۹۱", "۹۴"],
                  ].map((row, i) => (
                    <div
                      key={row[0]}
                      className={`grid grid-cols-[1.4fr_1fr_1fr_1fr] px-3 py-2.5 text-[9px] ${
                        i % 2 ? "bg-white/[0.015]" : ""
                      }`}
                    >
                      <span className="text-muted">{row[0]}</span>
                      <span className="text-center font-semibold">{row[1]}</span>
                      <span className="text-center font-semibold">{row[2]}</span>
                      <span className="text-center font-semibold text-accent">{row[3]}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/smart/compare"
                  className="group mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-xs font-bold text-[#0a0f0c] transition hover:bg-[#d4fa7a]"
                >
                  باز کردن مقایسه‌ی کامل
                  <ArrowLeft size={15} className="transition group-hover:-translate-x-1" />
                </Link>
              </div>

              <div className="grid gap-4">
                <Link
                  href="/smart/account"
                  className="group relative overflow-hidden rounded-[1.6rem] border border-line bg-surface/50 p-5 transition hover:border-accent/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="grid size-9 place-items-center rounded-xl bg-accent/10 text-accent">
                        <Heart size={16} />
                      </span>
                      <div>
                        <div className="text-[11px] font-bold">پنل اختصاصی مشتری</div>
                        <div className="text-[8px] text-muted">۶ ذخیره · ۲ بازدید</div>
                      </div>
                    </div>
                    <ArrowUpLeft size={14} className="text-muted transition group-hover:text-accent" />
                  </div>
                  <div className="mt-3 flex gap-1.5">
                    {["/images/villa-2.jpg", "/images/interior-6.jpg", "/images/villa-4.jpg"].map((im) => (
                      <img key={im} src={im} alt="" className="h-14 flex-1 rounded-lg object-cover" />
                    ))}
                  </div>
                </Link>

                <Link
                  href="/smart/crm"
                  className="group relative overflow-hidden rounded-[1.6rem] border border-line bg-surface/50 p-5 transition hover:border-accent/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="grid size-9 place-items-center rounded-xl bg-accent/10 text-accent">
                        <SquareKanban size={16} />
                      </span>
                      <div>
                        <div className="text-[11px] font-bold">CRM تیم فروش</div>
                        <div className="text-[8px] text-muted">۹ سرنخ فعال · ۳ مشاور</div>
                      </div>
                    </div>
                    <ArrowUpLeft size={14} className="text-muted transition group-hover:text-accent" />
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-1.5">
                    {[
                      ["جدید", "۳", "#8b99a4"],
                      ["بازدید", "۴", "#c8f45a"],
                      ["مذاکره", "۲", "#f5c86b"],
                    ].map(([l, v, c]) => (
                      <div key={l} className="rounded-lg border border-line bg-white/[0.02] p-2">
                        <div className="flex items-center gap-1 text-[7.5px] text-muted">
                          <span className="size-1.5 rounded-full" style={{ background: c }} /> {l}
                        </div>
                        <div className="mt-1 text-sm font-bold">{v}</div>
                      </div>
                    ))}
                  </div>
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-line bg-[#080d11]/60 py-16 lg:py-24">
        <Container>
          <Reveal>
            <SectionHead
              variant="smart"
              align="center"
              eyebrow="همه‌چیز در یک سامانه"
              title={
                <>
                  قابلیت‌هایی که <span className="text-accent">کار را جدی می‌کنند</span>
                </>
              }
              desc="پکیج ۲ شامل تمام امکانات پکیج ۱ است، به‌علاوه‌ی ابزارهای هوشمند برای تجربه‌ی مشتری و رشد کسب‌وکار."
            />
          </Reveal>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 50}>
                <div className="group h-full rounded-2xl border border-line bg-surface/40 p-4 transition hover:border-accent/25 hover:bg-accent/[0.03]">
                  <span className="grid size-9 place-items-center rounded-xl bg-accent/10 text-accent transition group-hover:bg-accent group-hover:text-[#0a0f0c]">
                    <f.icon size={17} />
                  </span>
                  <h3 className="mt-3 text-[11.5px] font-bold">{f.title}</h3>
                  <p className="mt-1.5 text-[9px] leading-5 text-muted">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <Reveal>
            <div>
              <Eyebrow variant="smart">سوالات متداول</Eyebrow>
              <h2 className="mt-4 text-2xl font-black leading-[1.4] tracking-tight sm:text-3xl">
                هر چه لازم است
                <br />
                <span className="text-accent">بدانی.</span>
              </h2>
              <p className="mt-4 max-w-sm text-[11.5px] leading-7 text-muted">
                درباره‌ی تور ۳۶۰، دستیار هوشمند، پنل مشتری و شرایط همکاری. اگر پاسخ
                سوالی نبود، از دستیار بپرس.
              </p>
              <Link
                href="/smart/explore#assistant"
                className="group mt-5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-accent"
              >
                گفت‌وگو با دستیار
                <ArrowUpLeft size={13} className="transition group-hover:-translate-y-0.5 group-hover:-translate-x-0.5" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <FaqAccordion variant="smart" />
          </Reveal>
        </Container>
      </section>

      <section className="pb-16 lg:pb-24">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-[1.8rem] border border-accent/20 bg-gradient-to-br from-[#0c1410] via-[#080d0b] to-[#06090c] px-6 py-12 text-center sm:px-10 lg:py-16">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
              <div className="pointer-events-none absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full bg-accent/10 blur-[90px]" />
              <div className="relative">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/5 px-3 py-1.5 text-[9.5px] font-semibold text-accent">
                  <Sparkles size={12} /> تجربه‌ی پکیج ۲
                </span>
                <h2 className="mx-auto mt-4 max-w-2xl text-2xl font-black leading-[1.45] tracking-tight sm:text-3xl lg:text-[2.4rem]">
                  آماده‌ای خانه‌ی بعدی‌ات را
                  <br />
                  <span className="text-gradient-lime">هوشمند پیدا کنی؟</span>
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-[11.5px] leading-7 text-muted">
                  همین حالا با دستیار گفت‌وگو کن یا فایل‌ها را روی نقشه ببین. تجربه‌ی
                  کامل پکیج ۲ در دسترس است.
                </p>
                <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    href="/smart/explore"
                    className="group flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-sm font-bold text-[#0a0f0c] shadow-[0_0_40px_-10px_rgba(200,244,90,0.5)] transition hover:bg-[#d4fa7a]"
                  >
                    شروع جست‌وجوی هوشمند
                    <ArrowLeft size={16} className="transition group-hover:-translate-x-1" />
                  </Link>
                  <Link
                    href="/smart/crm"
                    className="flex h-12 items-center gap-2 rounded-full border border-line px-6 text-sm font-semibold text-ink transition hover:border-accent/30 hover:text-accent"
                  >
                    <Users size={16} /> مشاهده CRM
                  </Link>
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[9px] text-muted">
                  <span className="flex items-center gap-1"><CircleCheck size={12} className="text-accent" /> پنل مشتری</span>
                  <span className="flex items-center gap-1"><CircleCheck size={12} className="text-accent" /> تور ۳۶۰</span>
                  <span className="flex items-center gap-1"><CircleCheck size={12} className="text-accent" /> دستیار هوشمند</span>
                  <span className="flex items-center gap-1"><CircleCheck size={12} className="text-accent" /> CRM</span>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
