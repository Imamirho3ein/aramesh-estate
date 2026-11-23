import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpLeft,
  BadgeCheck,
  Bot,
  Building2,
  Check,
  Compass,
  Layers,
  Map,
  ScanEye,
  Sparkles,
  Users,
} from "lucide-react";
import { Container } from "@/components/ui/layout";
import { Logo } from "@/components/ui/logo";
import { Reveal } from "@/components/ui/reveal";
import { asset } from "@/lib/asset";

const classicFeatures = [
  "طراحی واکنش‌گرا برای موبایل، تبلت و کامپیوتر",
  "صفحه اصلی حرفه‌ای و معرفی مجموعه",
  "ثبت و مدیریت آگهی فروش، رهن و اجاره",
  "صفحه اختصاصی هر ملک با گالری و مشخصات کامل",
  "جست‌وجو و فیلتر پیشرفته بر اساس منطقه و قیمت",
  "پنل مدیریت و پنل اختصاصی مشاور",
  "اتصال به ربات تلگرام و دستیار پاسخگو",
  "سیستم پشتیبانی و پیام مستقیم به مدیر",
];

const smartFeatures = [
  "تمام امکانات پکیج ۱، به‌علاوه:",
  "تور مجازی ۳۶۰ درجه و بازدید تعاملی",
  "دستیار هوشمند با جست‌وجوی زبان طبیعی",
  "مقایسه هوشمند چند ملک و پیشنهاد متناسب",
  "پنل اختصاصی مشتری و ذخیره علاقه‌مندی‌ها",
  "نقشه تعاملی نمایش موقعیت املاک",
  "CRM، گزارش‌های پیشرفته و قیف فروش",
  "آموزش کامل مدیر و مشاور + ویدئو اختصاصی",
];

const comparisonRows = [
  ["وب‌سایت حرفه‌ای و ریسپانسیو", true, true],
  ["پنل مدیر و مشاور", true, true],
  ["جست‌وجو و فیلتر پیشرفته", true, true],
  ["دستیار پاسخگوی سوالات متداول", true, true],
  ["اتصال ربات تلگرام", true, true],
  ["تور مجازی ۳۶۰ درجه", false, true],
  ["دستیار هوشمند زبان طبیعی + مقایسه", false, true],
  ["پنل اختصاصی مشتری", false, true],
  ["نقشه تعاملی و CRM", false, true],
  ["آموزش ویدئویی اختصاصی", false, true],
];

function MiniBrowser() {
  return (
    <div className="overflow-hidden rounded-[1.4rem] border border-black/10 bg-[#f7f4ed] text-[#14201b] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.65)]">
      <div className="flex items-center gap-2 border-b border-black/5 bg-white/60 px-4 py-2.5">
        <span className="size-2 rounded-full bg-[#e0675a]" />
        <span className="size-2 rounded-full bg-[#e5b34b]" />
        <span className="size-2 rounded-full bg-[#7fb069]" />
        <span className="mx-auto flex items-center gap-1 rounded-full bg-black/[0.04] px-3 py-1 text-[8px] text-black/40">
          aramesh.estate
        </span>
      </div>
      <div className="relative aspect-[16/10]">
        <img src={asset("/images/villa-2.jpg")} alt="پیش‌نمایش سایت کلاسیک" className="size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-black/20" />
        <div className="absolute inset-x-3 top-3 flex items-center justify-between">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[8px] font-bold text-[#0e5a4a]">
            آرامش · املاک حرفه‌ای
          </span>
          <span className="rounded-full bg-black/30 px-2 py-1 text-[7px] text-white backdrop-blur">منو</span>
        </div>
        <div className="absolute inset-x-4 bottom-3">
          <p className="text-[11px] font-extrabold text-white">آرامش را پیدا کنید</p>
          <div className="mt-1.5 flex items-center gap-1 rounded-lg bg-white p-1 shadow-lg">
            <span className="flex-1 px-1.5 text-[7px] text-black/40">منطقه، متراژ یا بودجه...</span>
            <span className="grid size-5 place-items-center rounded-md bg-[#0e5a4a] text-white">
              <Compass size={10} />
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5 p-3">
        {["villa-4", "living-1", "interior-3"].map((im) => (
          <div key={im} className="overflow-hidden rounded-lg border border-black/5 bg-white">
            <img src={asset(`/images/${im}.jpg`)} alt="" className="h-10 w-full object-cover" />
            <div className="p-1.5">
              <div className="h-1 w-8 rounded bg-black/20" />
              <div className="mt-1 h-1 w-5 rounded bg-black/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SmartPreview() {
  return (
    <div className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#0c1116] text-[#f3f6f4] shadow-[0_40px_110px_-30px_rgba(200,244,90,0.18)]">
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-[#c8f45a]" />
          <span className="text-[8px] font-bold tracking-widest text-[#c8f45a]">ARAMESH AI</span>
        </div>
        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[7px] text-white/50">
          آنلاین
        </span>
      </div>
      <div className="relative aspect-[16/10]">
        <img src={asset("/images/interior-6.jpg")} alt="پیش‌نمایش سامانه هوشمند" className="size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06090c] via-[#06090c]/20 to-transparent" />
        <div className="absolute right-3 top-3 flex gap-1">
          <span className="flex items-center gap-1 rounded-full border border-white/15 bg-black/45 px-2 py-1 text-[7px] text-white backdrop-blur">
            <ScanEye size={8} /> تور ۳۶۰°
          </span>
          <span className="flex items-center gap-1 rounded-full border border-[#c8f45a]/30 bg-black/45 px-2 py-1 text-[7px] text-[#c8f45a] backdrop-blur">
            <Sparkles size={8} /> AI
          </span>
        </div>
        <div className="absolute inset-x-3 bottom-3 rounded-xl border border-white/10 bg-[#0a0f12]/85 p-2.5 backdrop-blur">
          <div className="flex items-start gap-2">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#c8f45a] text-[#0a0f0c]">
              <Bot size={11} />
            </span>
            <div>
              <p className="text-[8px] leading-4 text-white/80">
                «آپارتمان ۱۵۰ متری در زعفرانیه با ویو کوه، تا ۳۰ میلیارد»
              </p>
              <p className="mt-1 text-[7px] text-[#c8f45a]">۳ فایل متناسب پیدا کردم · مقایسه کنم؟</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex -space-x-1.5">
          {["villa-1", "living-2", "interior-2"].map((im) => (
            <img
              key={im}
              src={asset(`/images/${im}.jpg`)}
              alt=""
              className="size-6 rounded-full border border-[#0c1116] object-cover"
            />
          ))}
        </div>
        <span className="text-[7px] text-white/45">+۱۲ فایل پیشنهادی</span>
        <span className="rounded-full bg-[#c8f45a] px-2 py-1 text-[7px] font-bold text-[#0a0f0c]">
          مقایسه هوشمند
        </span>
      </div>
    </div>
  );
}

export default function HubPage() {
  return (
    <div className="theme-smart min-h-screen overflow-hidden bg-bg text-ink">
      <div className="smart-glow pointer-events-none absolute inset-x-0 top-0 h-[820px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[820px] grid-lines opacity-[0.12]" />

      <header className="relative z-20 border-b border-line/70">
        <Container className="flex h-20 items-center justify-between">
          <Logo href="/" variant="smart" />
          <nav className="hidden items-center gap-6 text-[12px] text-muted md:flex">
            <a href="#packages" className="transition hover:text-accent">
              پکیج‌ها
            </a>
            <a href="#compare" className="transition hover:text-accent">
              مقایسه
            </a>
            <a href="#note" className="transition hover:text-accent">
              نکته اجرایی
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-line px-3 py-1.5 text-[10px] text-muted sm:block">
              دموی تعاملی · داده‌های نمونه
            </span>
            <Link
              href="/smart"
              className="flex h-10 items-center gap-1.5 rounded-full bg-accent px-4 text-xs font-bold text-[#0a0f0c] transition hover:bg-[#d4fa7a]"
            >
              شروع تور <ArrowUpLeft size={14} />
            </Link>
          </div>
        </Container>
      </header>

      <main className="relative z-10">
        <section className="pb-20 pt-14 lg:pb-28 lg:pt-20">
          <Container className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
            <div>
              <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3.5 py-1.5 text-[11px] font-semibold text-accent">
                <Sparkles size={13} />
                املاک آرامش · تهران · استودیو دمو
              </div>
              <h1 className="animate-fade-up delay-1 mt-6 text-[2.6rem] font-black leading-[1.25] tracking-tight sm:text-6xl lg:text-[4.2rem]">
                دو تجربه،
                <br />
                یک برند.
                <span className="mt-3 block text-gradient-lime">خانه‌ای برای هر سلیقه.</span>
              </h1>
              <p className="animate-fade-up delay-2 mt-6 max-w-lg text-sm leading-8 text-muted sm:text-[15px]">
                دو پکیج کامل و قابل اجرا برای فروش املاک؛ از یک وب‌سایت حرفه‌ای و شفاف تا
                سامانه‌ی هوشمندی که با زبان طبیعی جست‌وجو می‌کند، تور ۳۶۰ درجه می‌سازد و
                مشتری‌ها را در CRM مدیریت می‌کند.
              </p>

              <div className="animate-fade-up delay-3 mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#packages"
                  className="group flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-bold text-[#0a0f0c] shadow-[0_0_40px_-8px_rgba(200,244,90,0.5)] transition hover:bg-[#d4fa7a]"
                >
                  دیدن هر دو پکیج
                  <ArrowLeft size={17} className="transition group-hover:-translate-x-1" />
                </a>
                <Link
                  href="/classic"
                  className="flex h-12 items-center justify-center gap-2 rounded-full border border-line bg-white/[0.03] px-6 text-sm font-semibold text-ink transition hover:border-accent/30 hover:bg-white/[0.06]"
                >
                  ورود مستقیم به پکیج ۱
                  <ArrowUpLeft size={16} className="text-accent" />
                </Link>
              </div>

              <div className="animate-fade-up delay-4 mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6">
                {[
                  ["۲", "پکیج کامل"],
                  ["۲۵+", "قابلیت واقعی"],
                  ["۱۴", "ملک نمونه"],
                ].map(([v, l]) => (
                  <div key={l}>
                    <div className="text-2xl font-extrabold text-accent">{v}</div>
                    <div className="mt-1 text-[11px] text-muted">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[560px]">
              <div className="pointer-events-none absolute left-1/2 top-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]" />
              <div className="pointer-events-none absolute left-1/2 top-1/2 size-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.08]" />
              <div className="pointer-events-none absolute left-1/2 top-1/2 size-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[70px]" />

              <div className="animate-floaty-slow relative z-10 w-[86%] rotate-[-3deg]">
                <MiniBrowser />
              </div>
              <div className="animate-floaty relative z-20 -mt-16 ml-auto w-[80%] rotate-[2.5deg]">
                <SmartPreview />
              </div>

              <div className="absolute -right-2 top-6 z-30 flex items-center gap-2 rounded-2xl border border-white/10 bg-[#0c1116]/90 px-3 py-2 shadow-xl backdrop-blur">
                <span className="grid size-8 place-items-center rounded-xl bg-accent/10 text-accent">
                  <ScanEye size={16} />
                </span>
                <div>
                  <div className="text-[10px] font-bold">تور ۳۶۰°</div>
                  <div className="text-[8px] text-muted">بازدید تعاملی</div>
                </div>
              </div>
              <div className="absolute -left-3 bottom-10 z-30 flex items-center gap-2 rounded-2xl border border-white/10 bg-[#0c1116]/90 px-3 py-2 shadow-xl backdrop-blur">
                <span className="grid size-8 place-items-center rounded-xl bg-accent/10 text-accent">
                  <Bot size={16} />
                </span>
                <div>
                  <div className="text-[10px] font-bold">دستیار هوشمند</div>
                  <div className="text-[8px] text-muted">جست‌وجوی زبان طبیعی</div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section id="packages" className="scroll-mt-24 border-y border-line bg-[#080d11]/60 py-16 lg:py-24">
          <Container>
            <Reveal>
              <div className="mx-auto mb-12 max-w-2xl text-center">
                <span className="text-[11px] font-semibold tracking-[0.2em] text-accent">TWO PACKAGES</span>
                <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                  کدام تجربه، <span className="text-gradient-lime">حساب شماست؟</span>
                </h2>
                <p className="mt-4 text-sm leading-7 text-muted">
                  هر دو دمو کاملاً قابل کلیک هستند؛ پنل‌ها، جست‌وجو، تور ۳۶۰ و دستیار هوشمند
                  با داده‌های نمونه کار می‌کنند.
                </p>
              </div>
            </Reveal>

            <div className="grid gap-5 lg:grid-cols-2">
              <Reveal delay={80}>
                <article className="group relative h-full overflow-hidden rounded-[1.8rem] border border-[#e3dbcb] bg-[#f7f4ed] text-[#14201b] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_35px_90px_-30px_rgba(0,0,0,0.7)]">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={asset("/images/villa-3.jpg")}
                      alt="پکیج ۱"
                      className="size-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#f7f4ed] via-black/10 to-black/30" />
                    <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold text-[#0e5a4a] backdrop-blur">
                      پکیج ۰۱
                    </span>
                    <span className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-black/35 px-3 py-1 text-[10px] text-white backdrop-blur">
                      <Building2 size={12} /> وب‌سایت حرفه‌ای
                    </span>
                    <div className="absolute bottom-4 right-5">
                      <h3 className="text-2xl font-black">آرامش کلاسیک</h3>
                      <p className="mt-1 text-xs text-black/55">وب‌سایت حرفه‌ای املاک</p>
                    </div>
                  </div>
                  <div className="p-6 pt-4">
                    <p className="text-[13px] leading-7 text-black/60">
                      مناسب مجموعه‌هایی که می‌خواهند فایل‌های خود را به‌شکل منظم و حرفه‌ای
                      معرفی کنند؛ با پنل مدیر، پنل مشاور و جست‌وجوی پیشرفته.
                    </p>
                    <ul className="mt-5 grid gap-2.5 text-[12px] text-black/70 sm:grid-cols-2">
                      {classicFeatures.slice(0, 6).map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <Check size={14} className="mt-0.5 shrink-0 text-[#0e5a4a]" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex items-center gap-3">
                      <Link
                        href="/classic"
                        className="group/btn flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#0e5a4a] text-sm font-bold text-white transition hover:bg-[#0b4a3d]"
                      >
                        ورود به دموی پکیج ۱
                        <ArrowLeft size={16} className="transition group-hover/btn:-translate-x-1" />
                      </Link>
                      <Link
                        href="/classic/dashboard"
                        className="flex h-11 items-center gap-1.5 rounded-full border border-black/10 px-4 text-xs font-semibold transition hover:bg-black/5"
                      >
                        <Users size={14} /> پنل مدیر
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>

              <Reveal delay={160}>
                <article className="group relative h-full overflow-hidden rounded-[1.8rem] border border-accent/20 bg-gradient-to-b from-[#0d1418] to-[#090e12] transition duration-500 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-[0_35px_100px_-30px_rgba(200,244,90,0.25)]">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={asset("/images/interior-6.jpg")}
                      alt="پکیج ۲"
                      className="size-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f12] via-black/20 to-black/40" />
                    <span className="absolute right-4 top-4 rounded-full bg-accent px-3 py-1 text-[10px] font-bold text-[#0a0f0c]">
                      پکیج ۰۲
                    </span>
                    <span className="absolute left-4 top-4 flex items-center gap-1 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[10px] text-white backdrop-blur">
                      <Sparkles size={12} className="text-accent" /> سامانه هوشمند
                    </span>
                    <div className="absolute bottom-4 right-5">
                      <h3 className="text-2xl font-black text-white">آرامش هوشمند</h3>
                      <p className="mt-1 text-xs text-white/50">سامانه پیشرفته و تعاملی</p>
                    </div>
                  </div>
                  <div className="p-6 pt-4">
                    <p className="text-[13px] leading-7 text-muted">
                      پکیج ۲ همه‌ی امکانات پکیج ۱ را دارد، به‌علاوه‌ی تور ۳۶۰، دستیار هوشمند،
                      نقشه تعاملی، پنل مشتری و CRM برای رشد کسب‌وکار.
                    </p>
                    <ul className="mt-5 grid gap-2.5 text-[12px] text-ink/75 sm:grid-cols-2">
                      {smartFeatures.slice(0, 6).map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <Check size={14} className="mt-0.5 shrink-0 text-accent" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex items-center gap-3">
                      <Link
                        href="/smart"
                        className="group/btn flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-accent text-sm font-bold text-[#0a0f0c] shadow-[0_0_30px_-8px_rgba(200,244,90,0.45)] transition hover:bg-[#d4fa7a]"
                      >
                        ورود به دموی پکیج ۲
                        <ArrowLeft size={16} className="transition group-hover/btn:-translate-x-1" />
                      </Link>
                      <Link
                        href="/smart/crm"
                        className="flex h-11 items-center gap-1.5 rounded-full border border-line px-4 text-xs font-semibold transition hover:border-accent/30 hover:text-accent"
                      >
                        <Layers size={14} /> CRM
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            </div>
          </Container>
        </section>

        <section id="compare" className="scroll-mt-24 py-16 lg:py-24">
          <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <Reveal>
              <div>
                <span className="text-[11px] font-semibold tracking-[0.2em] text-accent">COMPARE</span>
                <h2 className="mt-3 text-3xl font-black leading-[1.35] tracking-tight sm:text-4xl">
                  پکیج ۲ یک ارتقاست،
                  <br />
                  <span className="text-gradient-lime">نه یک انتخاب جدا.</span>
                </h2>
                <p className="mt-4 max-w-md text-sm leading-7 text-muted">
                  تمام قابلیت‌های پکیج ۱ در پکیج ۲ وجود دارد. تفاوت اصلی در تجربه‌ی
                  تعاملی، هوش مصنوعی و ابزارهای رشد کسب‌وکار است.
                </p>
                <div className="mt-6 space-y-3">
                  {[
                    [ScanEye, "بازدید مجازی ۳۶۰ درجه از فضای ملک"],
                    [Bot, "جست‌وجو با زبان طبیعی و پاسخ مبتنی بر داده"],
                    [Map, "نقشه تعاملی و مدیریت موقعیت املاک"],
                    [Users, "پنل مشتری، CRM و آموزش تیم"],
                  ].map(([Icon, label]) => {
                    const I = Icon as typeof ScanEye;
                    return (
                      <div key={label as string} className="flex items-center gap-3 text-[13px]">
                        <span className="grid size-9 place-items-center rounded-xl border border-line bg-surface text-accent">
                          <I size={16} />
                        </span>
                        {label as string}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="overflow-hidden rounded-[1.6rem] border border-line bg-surface/60">
                <div className="grid grid-cols-[1fr_100px_100px] items-center gap-2 border-b border-line bg-white/[0.02] px-5 py-4 text-[11px] font-bold sm:grid-cols-[1fr_130px_130px] sm:px-6">
                  <span className="text-muted">قابلیت</span>
                  <span className="text-center">پکیج ۱</span>
                  <span className="flex items-center justify-center gap-1 text-center text-accent">
                    <Sparkles size={12} /> پکیج ۲
                  </span>
                </div>
                {comparisonRows.map(([label, a, b], i) => (
                  <div
                    key={label as string}
                    className={`grid grid-cols-[1fr_100px_100px] items-center gap-2 px-5 py-3.5 text-[12px] sm:grid-cols-[1fr_130px_130px] sm:px-6 ${
                      i % 2 === 0 ? "bg-white/[0.012]" : ""
                    }`}
                  >
                    <span className="text-ink/80">{label as string}</span>
                    <span className="flex justify-center">
                      {a ? (
                        <span className="grid size-6 place-items-center rounded-full bg-white/5 text-white/60">
                          <Check size={13} />
                        </span>
                      ) : (
                        <span className="text-white/15">—</span>
                      )}
                    </span>
                    <span className="flex justify-center">
                      {b ? (
                        <span className="grid size-6 place-items-center rounded-full bg-accent/15 text-accent">
                          <Check size={13} />
                        </span>
                      ) : (
                        <span className="text-white/15">—</span>
                      )}
                    </span>
                  </div>
                ))}
                <div className="border-t border-line p-5 sm:p-6">
                  <Link
                    href="/smart"
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-accent text-sm font-bold text-[#0a0f0c] transition hover:bg-[#d4fa7a]"
                  >
                    تجربه‌ی پکیج کامل <ArrowLeft size={16} />
                  </Link>
                </div>
              </div>
            </Reveal>
          </Container>
        </section>

        <section id="note" className="scroll-mt-24 pb-20">
          <Container>
            <Reveal>
              <div className="relative overflow-hidden rounded-[1.6rem] border border-accent/15 bg-accent/[0.04] p-6 sm:p-8">
                <div className="absolute -left-10 -top-10 size-40 rounded-full bg-accent/10 blur-3xl" />
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-accent text-[#0a0f0c]">
                    <BadgeCheck size={22} />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold">نکته‌ی اجرایی</h3>
                    <p className="mt-2 max-w-3xl text-[12px] leading-7 text-muted">
                      اجرای تور مجازی به تولید محتوا و تصویربرداری حرفه‌ای وابسته است؛
                      اتصال دستیار هوشمند و برخی سرویس‌های پکیج ۲ نیز نیازمند زیرساخت و
                      هزینه‌ی اولیه است که در برآورد نهایی پروژه مشخص می‌شود. این صفحه یک
                      دموی تعاملی با داده‌های نمونه است.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </Container>
        </section>
      </main>

      <footer className="relative z-10 border-t border-line py-8">
        <Container className="flex flex-col items-center justify-between gap-4 text-[11px] text-muted sm:flex-row">
          <p>© ۱۴۰۴ املاک آرامش · دموی تعاملی دو پکیج</p>
          <div className="flex items-center gap-4">
            <Link href="/classic" className="transition hover:text-accent">
              آرامش کلاسیک
            </Link>
            <span className="h-3 w-px bg-line" />
            <Link href="/smart" className="transition hover:text-accent">
              آرامش هوشمند
            </Link>
            <span className="h-3 w-px bg-line" />
            <span>تهران</span>
          </div>
        </Container>
      </footer>
    </div>
  );
}
