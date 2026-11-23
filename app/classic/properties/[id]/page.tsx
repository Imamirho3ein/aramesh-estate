import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  Car,
  Check,
  ChevronLeft,
  Home,
  MapPin,
  Ruler,
  Sparkles,
  Star,
} from "lucide-react";
import { Container } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/reveal";
import {
  ContactCard,
  Gallery,
  PropertyActions,
} from "@/components/classic/property-detail-client";
import { PropertyCardClassic } from "@/components/property-cards";
import { getConsultant, getProperty, properties } from "@/lib/data";
import { categoryLabels, dealLabels, fa } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return properties.map((property) => ({ id: property.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = getProperty(id);
  return {
    title: property ? `${property.title} | آرامش` : "ملک یافت نشد",
    description: property?.description.slice(0, 150),
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = getProperty(id);
  if (!property) notFound();

  const consultant = getConsultant(property.consultantId);
  const similar = properties
    .filter((p) => p.id !== property.id && (p.district === property.district || p.category === property.category))
    .slice(0, 3);

  const specs = [
    { icon: Ruler, label: "متراژ بنا", value: `${fa(property.area)} متر` },
    { icon: BedDouble, label: "تعداد خواب", value: `${fa(property.rooms)} خواب` },
    { icon: Bath, label: "سرویس بهداشتی", value: `${fa(property.bathrooms)} سرویس` },
    { icon: Car, label: "پارکینگ", value: `${fa(property.parking)} پارکینگ` },
    { icon: CalendarDays, label: "سال ساخت", value: fa(property.year) },
    { icon: Building2, label: "طبقه", value: `${fa(property.floor)} از ${fa(property.totalFloors)}` },
  ];

  return (
    <>
      <div className="border-b border-line bg-white/50">
        <Container className="flex items-center gap-1.5 py-3.5 text-[10px] text-muted">
          <Link href="/classic" className="flex items-center gap-1 transition hover:text-accent">
            <Home size={12} /> خانه
          </Link>
          <ChevronLeft size={11} />
          <Link href="/classic/properties" className="transition hover:text-accent">
            املاک
          </Link>
          <ChevronLeft size={11} />
          <span className="truncate text-ink">{property.title}</span>
        </Container>
      </div>

      <Container className="py-7 lg:py-10">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-full bg-accent px-3 py-1 text-[10px] font-bold text-white">
                {dealLabels[property.dealType]}
              </span>
              <span className="rounded-full border border-line bg-white px-3 py-1 text-[10px] font-semibold text-muted">
                {categoryLabels[property.category]}
              </span>
              {property.featured ? (
                <span className="flex items-center gap-1 rounded-full bg-[#f7edda] px-3 py-1 text-[10px] font-bold text-[#a47c2e]">
                  <Star size={10} fill="currentColor" /> فایل ویژه
                </span>
              ) : null}
              <span className="flex items-center gap-1 text-[10px] text-muted">
                <MapPin size={11} /> {property.district}، تهران
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl lg:text-[2.2rem]">
              {property.title}
            </h1>
            <p className="mt-2 max-w-2xl text-[12px] leading-6 text-muted">{property.subtitle}</p>
          </div>
          <div className="shrink-0">
            <PropertyActions property={property} />
          </div>
        </div>

        <div className="mt-6">
          <Gallery property={property} />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="min-w-0 space-y-8">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="rounded-xl border border-line bg-white p-3.5 text-center"
                >
                  <spec.icon size={17} className="mx-auto text-accent" />
                  <div className="mt-2 text-[10px] text-muted">{spec.label}</div>
                  <div className="mt-0.5 text-[11px] font-bold">{spec.value}</div>
                </div>
              ))}
            </div>

            <section>
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-base font-extrabold">
                  <span className="h-5 w-1 rounded-full bg-[#c19a4b]" />
                  درباره‌ی این ملک
                </h2>
                <span className="text-[9px] text-muted">کد فایل: {property.id.toUpperCase()}</span>
              </div>
              <p className="mt-4 text-[12.5px] leading-8 text-muted">{property.description}</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {property.highlights.map((h) => (
                  <div
                    key={h}
                    className="flex items-center gap-2 rounded-xl border border-line bg-white/70 px-3 py-2.5 text-[11px]"
                  >
                    <span className="grid size-5 place-items-center rounded-full bg-soft text-accent">
                      <Check size={11} />
                    </span>
                    {h}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="flex items-center gap-2 text-base font-extrabold">
                <span className="h-5 w-1 rounded-full bg-[#c19a4b]" />
                امکانات و ویژگی‌ها
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {property.amenities.map((a) => (
                  <div
                    key={a}
                    className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2.5 text-[10.5px] text-muted"
                  >
                    <span className="grid size-5 place-items-center rounded-full bg-soft text-accent">
                      <Check size={11} />
                    </span>
                    {a}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="flex items-center gap-2 text-base font-extrabold">
                  <span className="h-5 w-1 rounded-full bg-[#c19a4b]" />
                  موقعیت مکانی
                </h2>
                <Link
                  href="/smart/explore#map"
                  className="text-[10px] font-semibold text-accent transition hover:opacity-75"
                >
                  مشاهده در نقشه تعاملی ←
                </Link>
              </div>
              <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-white">
                <div className="relative h-[240px] overflow-hidden bg-[#eee8da]">
                  <svg viewBox="0 0 800 300" className="size-full" aria-hidden>
                    <rect width="800" height="300" fill="#efe9db" />
                    <g stroke="#ddd3c0" strokeWidth="14" strokeLinecap="round">
                      <path d="M-20 80C140 60 240 120 380 90s240-60 440-20" />
                      <path d="M-20 210c160-40 260 30 400 0s260-60 440-10" />
                      <path d="M180-20c20 100-40 150-10 250s80 70 90 100" />
                      <path d="M560-20c-20 100 30 160 10 250s-60 60-80 90" />
                    </g>
                    <g stroke="#e6ddcb" strokeWidth="4">
                      <path d="M0 145h800" />
                      <path d="M320 0v300" />
                      <path d="M680 0v300" />
                    </g>
                    <g fill="#e2d8c4">
                      <rect x="380" y="40" width="100" height="60" rx="8" />
                      <rect x="500" y="120" width="120" height="70" rx="8" />
                      <rect x="60" y="110" width="90" height="55" rx="8" />
                      <rect x="200" y="220" width="90" height="45" rx="8" />
                      <rect x="620" y="200" width="100" height="60" rx="8" />
                    </g>
                    <g fill="#d8cdb7">
                      <circle cx="120" cy="230" r="24" />
                      <circle cx="700" cy="70" r="20" />
                      <rect x="420" y="200" width="60" height="30" rx="6" />
                    </g>
                    <text x="410" y="26" fill="#9b8f7a" fontSize="11" fontFamily="sans-serif">
                      {property.district}
                    </text>
                    <text x="90" y="40" fill="#b3a892" fontSize="9">
                      تهران
                    </text>
                  </svg>
                  <div
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${property.coords.x}%`, top: `${property.coords.y}%` }}
                  >
                    <span className="absolute inset-0 -m-3 animate-ping rounded-full bg-accent/20" />
                    <span className="relative flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[9px] font-bold text-white shadow-lg">
                      <MapPin size={11} /> {property.title}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-between gap-2 border-t border-line px-4 py-3 sm:flex-row sm:items-center">
                  <p className="flex items-center gap-1.5 text-[10.5px] text-muted">
                    <MapPin size={12} className="text-accent" />
                    {property.address}
                  </p>
                  <span className="text-[9px] text-muted">دسترسی: ۵ دقیقه تا بزرگراه اصلی</span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-line bg-white p-5">
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`grid size-12 place-items-center rounded-2xl bg-gradient-to-br ${consultant?.tone} text-xs font-bold text-white`}
                  >
                    {consultant?.initials}
                  </span>
                  <div>
                    <div className="text-[12px] font-bold">مشاور اختصاصی این ملک</div>
                    <div className="mt-0.5 text-[10px] text-muted">
                      {consultant?.name} · {consultant?.role}
                    </div>
                  </div>
                </div>
                <Link
                  href="/classic/consultants"
                  className="flex h-9 items-center gap-1.5 rounded-full border border-line px-4 text-[10px] font-semibold transition hover:border-accent/30 hover:text-accent"
                >
                  <Sparkles size={12} /> مشاهده تیم مشاوران
                </Link>
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-[100px] lg:self-start">
            <ContactCard property={property} />
          </aside>
        </div>

        <section className="mt-14 border-t border-line pt-10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold tracking-widest text-[#c19a4b]">پیشنهادهای مشابه</span>
              <h2 className="mt-1 text-xl font-extrabold">شاید این‌ها را هم بپسندید</h2>
            </div>
            <Link
              href="/classic/properties"
              className="text-[10px] font-semibold text-accent transition hover:opacity-75"
            >
              همه املاک ←
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((p) => (
              <PropertyCardClassic key={p.id} property={p} />
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
