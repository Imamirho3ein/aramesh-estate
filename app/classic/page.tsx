import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpLeft,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Headphones,
  KeyRound,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { Container, Eyebrow, SectionHead } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/reveal";
import { HomeSearch } from "@/components/classic/home-search";
import { PropertyCardClassic } from "@/components/property-cards";
import { FaqAccordion } from "@/components/faq-accordion";
import { consultants, districts, properties } from "@/lib/data";
import { fa } from "@/lib/utils";

const featured = ["p1", "p3", "p10"]
  .map((id) => properties.find((p) => p.id === id))
  .filter(Boolean) as typeof properties;

const stats = [
  { value: "۱۲", label: "سال تجربه در بازار تهران", icon: TrendingUp },
  { value: "۲٬۴۰۰+", label: "فایل فعال و بررسی‌شده", icon: Building2 },
  { value: "۹۸٪", label: "رضایت مشتریان", icon: BadgeCheck },
  { value: "۲۱۴", label: "معامله موفق ثبت‌شده", icon: KeyRound },
];

const services = [
  {
    icon: Search,
    title: "جست‌وجوی دقیق و شفاف",
    desc: "فیلتر بر اساس منطقه، متراژ، بودجه و امکانات؛ بدون فایل تکراری و آگهی منقضی.",
  },
  {
    icon: ShieldCheck,
    title: "بررسی حقوقی و سندی",
    desc: "هر فایل قبل از انتشار از نظر سند، بازداشت و مالکیت توسط کارشناس بررسی می‌شود.",
  },
  {
    icon: MapPin,
    title: "بازدید حضوری هماهنگ",
    desc: "زمان‌بندی دقیق بازدید و همراهی مشاور اختصاصی از اولین دیدار تا قرارداد.",
  },
  {
    icon: Headphones,
    title: "پشتیبانی تا تحویل کلید",
    desc: "از مذاکره و قرارداد تا تخلیه و تحویل؛ یک مسیر روشن و بدون سردرگمی.",
  },
];

const process = [
  { n: "۰۱", title: "نیازت را بگو", desc: "بودجه، منطقه و سبک زندگی‌ات را می‌شنویم." },
  { n: "۰۲", title: "فایل‌های منتخب", desc: "سه تا پنج گزینه‌ی واقعاً متناسب دریافت می‌کنی." },
  { n: "۰۳", title: "بازدید و مقایسه", desc: "با مشاور، بازدید می‌کنی و جوانب را می‌سنجی." },
  { n: "۰۴", title: "قرارداد و کلید", desc: "مذاکره، قرارداد و تحویل با همراهی کامل." },
];

export default function ClassicHomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-grain">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(700px_400px_at_85%_10%,rgba(193,154,75,0.10),transparent_65%),radial-gradient(600px_400px_at_5%_60%,rgba(14,90,74,0.06),transparent_65%)]" />
        <div className="pointer-events-none absolute -left-24 top-40 size-[420px] rounded-full border border-[#e3dbcb]/60" />
        <div className="pointer-events-none absolute -left-16 top-48 size-[300px] rounded-full border border-[#e3dbcb]/40" />

        <Container className="relative grid items-center gap-12 pb-14 pt-12 lg:grid-cols-[1.03fr_0.97fr] lg:gap-10 lg:pb-20 lg:pt-16">
          <div>
            <div className="animate-fade-up">
              <Eyebrow>املاک آرامش · تهران · از ۱۳۹۲</Eyebrow>
            </div>
            <h1 className="animate-fade-up delay-1 mt-5 text-[2.5rem] font-black leading-[1.3] tracking-tight text-ink sm:text-[3.4rem] lg:text-[3.9rem]">
              آرامش را در
              <br />
              <span className="relative inline-block">
                <span className="text-gradient-gold">خانه‌ی بعدی‌ات</span>
                <svg
                  viewBox="0 0 300 14"
                  className="absolute -bottom-2 right-0 h-3 w-full text-[#c19a4b]/50"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <path
                    d="M2 10C60 3 150 2 298 8"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br />
              پیدا کن.
            </h1>
            <p className="animate-fade-up delay-2 mt-7 max-w-xl text-[13.5px] leading-8 text-muted sm:text-[14.5px]">
              خرید، فروش، رهن و اجاره‌ی ملک در تهران؛ با مشاوره‌ی تخصصی، فایل‌های
              بررسی‌شده و تجربه‌ای شفاف از اولین جست‌وجو تا تحویل کلید.
            </p>

            <div className="animate-fade-up delay-3 mt-8">
              <HomeSearch />
            </div>

            <div className="animate-fade-up delay-4 mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center">
                {consultants.slice(0, 3).map((c, i) => (
                  <span
                    key={c.id}
                    className={`grid size-9 place-items-center rounded-full border-2 border-[#f7f4ed] bg-gradient-to-br ${c.tone} text-[10px] font-bold text-white ${
                      i > 0 ? "-me-2.5" : ""
                    }`}
                  >
                    {c.initials}
                  </span>
                ))}
                <span className="-me-2.5 grid size-9 place-items-center rounded-full border-2 border-[#f7f4ed] bg-[#14201b] text-[9px] font-bold text-white">
                  +۲۴
                </span>
              </div>
              <div className="text-[11px] leading-5 text-muted">
                <span className="flex items-center gap-1 font-bold text-ink">
                  <Star size={12} className="fill-[#c19a4b] text-[#c19a4b]" />
                  ۴.۹ از ۵
                </span>
                رضایت بیش از ۲٬۴۰۰ مشتری
              </div>
              <div className="hidden h-8 w-px bg-line sm:block" />
              <div className="flex items-center gap-2 text-[11px] text-muted">
                <span className="grid size-8 place-items-center rounded-full bg-soft text-accent">
                  <Phone size={14} />
                </span>
                <span>
                  مشاوره‌ی رایگان
                  <br />
                  <span className="font-bold text-ink">۰۲۱ ۲۲۴۴ ۸۸۹۰</span>
                </span>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none">
            <div className="pointer-events-none absolute -right-4 -top-4 hidden text-[150px] font-black leading-none text-transparent [-webkit-text-stroke:1px_#e3dbcb] lg:block">
              آرامش
            </div>
            <div className="absolute inset-x-6 bottom-6 top-10 rounded-t-full border border-[#c19a4b]/30" />
            <div className="relative mx-auto h-[430px] w-[88%] overflow-hidden rounded-t-full rounded-b-[2rem] border-[7px] border-white bg-surface2 shadow-[0_35px_90px_-30px_rgba(20,32,27,0.45)] sm:h-[500px]">
              <img
                src="/images/villa-2.jpg"
                alt="ویلای لوکس با استخر در تهران"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-black/10" />
              <div className="absolute bottom-5 right-5 left-5 flex items-end justify-between gap-2">
                <div className="text-white">
                  <span className="rounded-full bg-white/20 px-2.5 py-1 text-[9px] backdrop-blur">
                    منتخب هفته
                  </span>
                  <p className="mt-2 text-sm font-bold">ویلای استخردار لواسان</p>
                  <p className="mt-1 flex items-center gap-1 text-[10px] text-white/70">
                    <MapPin size={11} /> لواسان · ۵۰۰ متر زمین
                  </p>
                </div>
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#c19a4b] px-3 py-1.5 text-[10px] font-bold text-white">
                  <BadgeCheck size={12} /> فایل تاییدشده
                </span>
              </div>
            </div>

            <div className="animate-floaty absolute -left-2 top-16 z-10 hidden w-[190px] rounded-2xl border border-line bg-white/95 p-3 shadow-[0_20px_50px_-20px_rgba(20,32,27,0.35)] backdrop-blur sm:block lg:-left-6">
              <div className="flex items-center gap-2">
                <span className="grid size-9 place-items-center rounded-xl bg-soft text-accent">
                  <BadgeCheck size={17} />
                </span>
                <div>
                  <div className="text-sm font-extrabold">۲۱۴</div>
                  <div className="text-[9px] text-muted">معامله موفق</div>
                </div>
              </div>
              <div className="mt-2.5 flex items-center gap-1 border-t border-line pt-2.5 text-[9px] text-muted">
                <Star size={10} className="fill-[#c19a4b] text-[#c19a4b]" />
                ۴.۹ · ۱۲ سال تجربه
              </div>
            </div>

            <div className="animate-floaty-slow absolute -bottom-4 left-2 z-10 w-[235px] rounded-2xl border border-line bg-white p-2.5 shadow-[0_20px_50px_-20px_rgba(20,32,27,0.35)] sm:-left-4">
              <div className="flex items-center gap-2.5">
                <img
                  src="/images/villa-4.jpg"
                  alt="پیشنهاد ویژه"
                  className="size-14 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10.5px] font-bold">ویلا استخردار لواسان</p>
                  <p className="mt-0.5 text-[9px] text-muted">۵۰۰ متر · ۵ خواب</p>
                  <p className="mt-1 text-[11px] font-extrabold text-accent">۸۵ میلیارد تومان</p>
                </div>
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent text-white">
                  <ArrowUpLeft size={13} />
                </span>
              </div>
            </div>

            <div className="absolute -right-1 bottom-28 z-10 hidden items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[9px] font-semibold text-accent shadow-lg sm:flex">
              <CheckCircle2 size={12} /> سند بررسی‌شده
            </div>
          </div>
        </Container>

        <div className="relative border-y border-line bg-white/55 backdrop-blur">
          <Container className="grid grid-cols-2 divide-x divide-x-reverse divide-line sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 px-4 py-5 sm:px-6">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-soft text-accent">
                  <stat.icon size={18} />
                </span>
                <div>
                  <div className="text-lg font-extrabold tracking-tight sm:text-xl">{stat.value}</div>
                  <div className="mt-0.5 text-[9.5px] leading-4 text-muted">{stat.label}</div>
                </div>
              </div>
            ))}
          </Container>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <Container>
          <Reveal>
            <SectionHead
              eyebrow="فایل‌های منتخب"
              title={
                <>
                  خانه‌هایی که <span className="text-accent">باید ببینی</span>
                </>
              }
              desc="گزیده‌ای از بهترین فایل‌های این هفته؛ هر ملک توسط کارشناس بررسی و قیمت‌گذاری شده است."
              action={
                <Link
                  href="/classic/properties"
                  className="group inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white px-5 text-xs font-semibold transition hover:border-accent/30 hover:text-accent"
                >
                  مشاهده همه املاک
                  <ArrowLeft size={15} className="transition group-hover:-translate-x-1" />
                </Link>
              }
            />
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((property, i) => (
              <Reveal key={property.id} delay={i * 90}>
                <PropertyCardClassic property={property} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-[#f0ebdf]/55 py-16 lg:py-24">
        <Container>
          <Reveal>
            <SectionHead
              eyebrow="محله‌های تهران"
              title="از کدام محله شروع کنیم؟"
              desc="فایل‌های هر محله را یک‌جا ببین؛ از زعفرانیه و الهیه تا سعادت‌آباد و لواسان."
              action={
                <Link
                  href="/classic/properties"
                  className="group inline-flex items-center gap-1.5 text-xs font-semibold text-accent"
                >
                  همه محله‌ها
                  <ArrowUpLeft size={14} className="transition group-hover:-translate-y-0.5 group-hover:-translate-x-0.5" />
                </Link>
              }
            />
          </Reveal>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {districts.map((district, i) => (
              <Reveal key={district.name} delay={i * 70}>
                <Link
                  href={`/classic/properties?district=${encodeURIComponent(district.name)}`}
                  className="group relative block overflow-hidden rounded-[1.3rem] border border-line"
                >
                  <div className="aspect-[4/3] overflow-hidden sm:aspect-[16/10]">
                    <img
                      src={district.image}
                      alt={district.name}
                      loading="lazy"
                      className="size-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b2f27]/90 via-[#0b2f27]/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                    <div>
                      <h3 className="text-base font-bold text-white">{district.name}</h3>
                      <p className="mt-1 text-[10px] text-white/60">{fa(district.count)} فایل فعال</p>
                    </div>
                    <span className="grid size-8 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition group-hover:bg-[#c19a4b] group-hover:border-[#c19a4b]">
                      <ArrowUpLeft size={14} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal>
            <div className="relative">
              <div className="grid grid-cols-2 gap-3">
                <div className="overflow-hidden rounded-[1.4rem] border border-line">
                  <img
                    src="/images/interior-2.jpg"
                    alt="طراحی داخلی کلاسیک"
                    loading="lazy"
                    className="aspect-[3/4] w-full object-cover"
                  />
                </div>
                <div className="mt-8 space-y-3">
                  <div className="overflow-hidden rounded-[1.4rem] border border-line">
                    <img
                      src="/images/living-1.jpg"
                      alt="نشیمن روشن"
                      loading="lazy"
                      className="aspect-square w-full object-cover"
                    />
                  </div>
                  <div className="overflow-hidden rounded-[1.4rem] border border-line">
                    <img
                      src="/images/villa-3.jpg"
                      alt="ویلای مدرن"
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-5 right-1/2 flex translate-x-1/2 items-center gap-2.5 rounded-2xl border border-line bg-white px-4 py-3 shadow-xl">
                <span className="grid size-9 place-items-center rounded-xl bg-accent text-white">
                  <ShieldCheck size={17} />
                </span>
                <div>
                  <div className="text-[11px] font-bold">۱۰۰٪ فایل بررسی‌شده</div>
                  <div className="text-[9px] text-muted">سند، مالکیت و بازداشت</div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div>
              <Eyebrow>چرا آرامش؟</Eyebrow>
              <h2 className="mt-4 text-2xl font-extrabold leading-[1.4] tracking-tight sm:text-3xl lg:text-[2.4rem]">
                معامله‌ی ملک، بدون
                <br />
                <span className="text-accent">استرس و ابهام.</span>
              </h2>
              <p className="mt-4 max-w-lg text-[13px] leading-7 text-muted">
                ما فقط فایل نمایش نمی‌دهیم؛ مسیر تصمیم‌گیری را ساده می‌کنیم. از ارزیابی
                قیمت و بررسی سند تا مذاکره و تنظیم قرارداد، همه‌چیز شفاف است.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {services.map((service) => (
                  <div
                    key={service.title}
                    className="group rounded-2xl border border-line bg-white p-4 transition hover:border-accent/25 hover:shadow-[0_16px_40px_-26px_rgba(20,32,27,0.35)]"
                  >
                    <span className="grid size-9 place-items-center rounded-xl bg-soft text-accent transition group-hover:bg-accent group-hover:text-white">
                      <service.icon size={17} />
                    </span>
                    <h3 className="mt-3 text-[12.5px] font-bold">{service.title}</h3>
                    <p className="mt-1.5 text-[10.5px] leading-6 text-muted">{service.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-line pt-5">
                <Link
                  href="/classic/consultants"
                  className="group inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-xs font-bold text-white transition hover:bg-[#0b4a3d]"
                >
                  گفت‌وگو با مشاور
                  <ArrowLeft size={15} className="transition group-hover:-translate-x-1" />
                </Link>
                <span className="flex items-center gap-1.5 text-[10px] text-muted">
                  <Sparkles size={13} className="text-[#c19a4b]" />
                  مشاوره‌ی اولیه رایگان است
                </span>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-line bg-[#0b2f27] py-16 text-white lg:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <Reveal>
              <div>
                <span className="text-[10px] font-semibold tracking-[0.24em] text-[#d9b872]">
                  HOW IT WORKS
                </span>
                <h2 className="mt-3 text-2xl font-extrabold leading-[1.4] sm:text-3xl">
                  چهار قدم تا
                  <br />
                  <span className="text-[#d9b872]">خانه‌ی آرامش.</span>
                </h2>
                <p className="mt-4 max-w-sm text-[12px] leading-7 text-white/55">
                  فرایندی روشن و قابل پیگیری؛ در هر مرحله می‌دانی چه اتفاقی می‌افتد و
                  قدم بعدی چیست.
                </p>
                <Link
                  href="/classic/properties"
                  className="group mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[#c19a4b] px-5 text-xs font-bold text-white transition hover:bg-[#ad8a3f]"
                >
                  شروع جست‌وجو
                  <ArrowLeft size={15} className="transition group-hover:-translate-x-1" />
                </Link>
              </div>
            </Reveal>
            <div className="grid gap-3 sm:grid-cols-2">
              {process.map((step, i) => (
                <Reveal key={step.n} delay={i * 80}>
                  <div className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-[#d9b872]/40 hover:bg-white/[0.06]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-widest text-[#d9b872]">
                        {step.n}
                      </span>
                      <span className="grid size-7 place-items-center rounded-full border border-white/10 text-white/40 transition group-hover:border-[#d9b872]/40 group-hover:text-[#d9b872]">
                        <ArrowUpLeft size={12} />
                      </span>
                    </div>
                    <h3 className="mt-4 text-sm font-bold">{step.title}</h3>
                    <p className="mt-1.5 text-[10.5px] leading-6 text-white/50">{step.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-24">
        <Container>
          <Reveal>
            <SectionHead
              eyebrow="تیم آرامش"
              title="مشاورانی که محله را می‌شناسند"
              desc="هر مشاور متخصص یک یا چند محله است؛ ارتباط مستقیم، بدون واسطه و بدون اتلاف وقت."
              action={
                <Link
                  href="/classic/consultants"
                  className="group inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white px-5 text-xs font-semibold transition hover:border-accent/30 hover:text-accent"
                >
                  همه مشاوران
                  <ArrowLeft size={15} className="transition group-hover:-translate-x-1" />
                </Link>
              }
            />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {consultants.map((c, i) => (
              <Reveal key={c.id} delay={i * 80}>
                <div className="group flex h-full flex-col rounded-[1.3rem] border border-line bg-white p-5 transition hover:border-accent/25 hover:shadow-[0_20px_50px_-30px_rgba(20,32,27,0.4)]">
                  <div className="flex items-center gap-3">
                    <span
                      className={`grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${c.tone} text-sm font-bold text-white shadow-sm`}
                    >
                      {c.initials}
                    </span>
                    <div>
                      <h3 className="text-[13px] font-bold">{c.name}</h3>
                      <p className="mt-0.5 text-[9.5px] text-muted">{c.role}</p>
                      <div className="mt-1 flex items-center gap-1 text-[9px]">
                        <Star size={10} className="fill-[#c19a4b] text-[#c19a4b]" />
                        {fa(c.rating)} · {fa(c.deals)} معامله
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1">
                    {c.specialties.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-soft px-2 py-1 text-[8.5px] text-accent"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-4">
                    <span className="text-[9px] text-muted">{fa(c.experience)} سال تجربه</span>
                    <a
                      href={`tel:${c.phone.replace(/\s/g, "")}`}
                      className="grid size-8 place-items-center rounded-full border border-line text-accent transition group-hover:border-accent group-hover:bg-accent group-hover:text-white"
                      aria-label={`تماس با ${c.name}`}
                    >
                      <Phone size={13} />
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-16 lg:pb-24">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <Reveal>
            <div>
              <Eyebrow>سوالات متداول</Eyebrow>
              <h2 className="mt-4 text-2xl font-extrabold leading-[1.4] tracking-tight sm:text-3xl">
                قبل از تصمیم،
                <br />
                <span className="text-accent">پاسخ‌ها را بدان.</span>
              </h2>
              <p className="mt-4 text-[12.5px] leading-7 text-muted">
                پرتکرارترین سوال‌های مشتریان درباره‌ی ثبت ملک، بازدید و شرایط معامله.
                پاسخ سوال دیگری داری؟ دستیار پاسخگو یا مشاور ما آماده است.
              </p>
              <Link
                href="/classic/panel"
                className="group mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-accent"
              >
                ثبت ملک در پنل مشاور
                <ArrowUpLeft size={14} className="transition group-hover:-translate-y-0.5 group-hover:-translate-x-0.5" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <FaqAccordion />
          </Reveal>
        </Container>
      </section>

      <section className="pb-16 lg:pb-24">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-[1.8rem] bg-[#0b2f27] px-6 py-10 text-white sm:px-10 lg:px-14 lg:py-14">
              <div className="pointer-events-none absolute -left-16 -top-16 size-64 rounded-full border border-white/10" />
              <div className="pointer-events-none absolute -left-6 -top-6 size-44 rounded-full border border-[#d9b872]/20" />
              <div className="pointer-events-none absolute -bottom-24 left-1/3 size-72 rounded-full bg-[#c19a4b]/10 blur-3xl" />
              <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d9b872]/30 bg-[#d9b872]/10 px-3 py-1.5 text-[10px] font-semibold text-[#d9b872]">
                    <Users size={12} /> ملک شما، در دستان درست
                  </span>
                  <h2 className="mt-4 max-w-xl text-2xl font-extrabold leading-[1.45] sm:text-3xl lg:text-[2.1rem]">
                    ملک خود را به آرامش بسپارید؛
                    <br />
                    <span className="text-[#d9b872]">بازاریابی و فروش با تیم حرفه‌ای.</span>
                  </h2>
                  <p className="mt-4 max-w-lg text-[12px] leading-7 text-white/55">
                    عکاسی حرفه‌ای، معرفی در شبکه‌های اجتماعی، بازدید هدفمند و مذاکره
                    تخصصی؛ همه در یک بسته.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href="/classic/panel"
                      className="group flex h-11 items-center gap-2 rounded-full bg-[#c19a4b] px-5 text-xs font-bold text-white transition hover:bg-[#ad8a3f]"
                    >
                      ثبت ملک
                      <ArrowLeft size={15} className="transition group-hover:-translate-x-1" />
                    </Link>
                    <a
                      href="tel:02122448890"
                      className="flex h-11 items-center gap-2 rounded-full border border-white/15 px-5 text-xs font-semibold text-white/80 transition hover:border-white/30 hover:text-white"
                    >
                      <Phone size={14} /> ۰۲۱ ۲۲۴۴ ۸۸۹۰
                    </a>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["۲۴ ساعت", "میانگین زمان انتشار آگهی"],
                    ["۴۰٪", "افزایش بازدید با عکاسی حرفه‌ای"],
                    ["۱ مشاور", "اختصاصی برای هر فایل"],
                    ["۰ ریال", "هزینه‌ی مشاوره‌ی اولیه"],
                  ].map(([v, l]) => (
                    <div
                      key={l}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center backdrop-blur"
                    >
                      <div className="text-lg font-extrabold text-[#d9b872]">{v}</div>
                      <div className="mt-1 text-[9px] leading-4 text-white/50">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
