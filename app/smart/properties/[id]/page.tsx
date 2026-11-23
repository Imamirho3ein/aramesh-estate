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
  Eye,
  Home,
  LandPlot,
  MapPin,
  Ruler,
  ScanEye,
  Sparkles,
  Star,
} from "lucide-react";
import { Container } from "@/components/ui/layout";
import { PropertyCardSmart } from "@/components/property-cards";
import {
  AiInsight,
  MiniConsultantRow,
  SmartActions,
  SmartContactCard,
  SmartGallery,
} from "@/components/smart/property-detail";
import { TehranMap } from "@/components/smart/tehran-map";
import { getProperty, properties } from "@/lib/data";
import { categoryLabels, dealLabels, fa } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = getProperty(id);
  return {
    title: property ? `${property.title} | آرامش هوشمند` : "ملک یافت نشد",
    description: property?.description.slice(0, 150),
  };
}

export default async function SmartPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = getProperty(id);
  if (!property) notFound();

  const similar = properties
    .filter(
      (p) =>
        p.id !== property.id &&
        (p.district === property.district || p.category === property.category),
    )
    .slice(0, 3);

  const specs = [
    { icon: Ruler, label: "متراژ بنا", value: `${fa(property.area)} متر` },
    { icon: BedDouble, label: "تعداد خواب", value: `${fa(property.rooms)} خواب` },
    { icon: Bath, label: "سرویس بهداشتی", value: `${fa(property.bathrooms)} سرویس` },
    { icon: Car, label: "پارکینگ", value: `${fa(property.parking)} پارکینگ` },
    { icon: CalendarDays, label: "سال ساخت", value: fa(property.year) },
    {
      icon: Building2,
      label: "طبقه",
      value: `${fa(property.floor)} از ${fa(property.totalFloors)}`,
    },
  ];

  return (
    <>
      <div className="border-b border-line bg-surface/20">
        <Container className="flex items-center gap-1.5 overflow-x-auto py-3.5 text-[10px] text-muted no-scrollbar">
          <Link href="/smart" className="flex items-center gap-1 transition hover:text-accent">
            <Home size={12} /> خانه
          </Link>
          <ChevronLeft size={11} />
          <Link href="/smart/explore" className="transition hover:text-accent">
            جست‌وجوی هوشمند
          </Link>
          <ChevronLeft size={11} />
          <span className="truncate text-ink">{property.title}</span>
        </Container>
      </div>

      <Container className="py-7 lg:py-10">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-full bg-accent px-3 py-1 text-[10px] font-bold text-[#0a0f0c]">
                {dealLabels[property.dealType]}
              </span>
              <span className="rounded-full border border-line bg-surface/50 px-3 py-1 text-[10px] font-semibold text-muted">
                {categoryLabels[property.category]}
              </span>
              {property.featured ? (
                <span className="flex items-center gap-1 rounded-full border border-[#f5c86b]/25 bg-[#f5c86b]/10 px-3 py-1 text-[10px] font-bold text-[#f5c86b]">
                  <Star size={10} fill="currentColor" /> فایل ویژه
                </span>
              ) : null}
              {property.tour ? (
                <span className="flex items-center gap-1 rounded-full border border-accent/25 bg-accent/5 px-3 py-1 text-[10px] font-semibold text-accent">
                  <ScanEye size={11} /> تور ۳۶۰
                </span>
              ) : null}
              <span className="flex items-center gap-1 text-[10px] text-muted">
                <MapPin size={11} /> {property.district}، تهران
              </span>
              <span className="flex items-center gap-1 text-[10px] text-muted">
                <Eye size={11} /> {fa(property.views)} بازدید
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl lg:text-[2.2rem]">
              {property.title}
            </h1>
            <p className="mt-2 max-w-2xl text-[12px] leading-6 text-muted">{property.subtitle}</p>
          </div>
          <div className="shrink-0">
            <SmartActions property={property} />
          </div>
        </div>

        <div className="mt-6">
          <SmartGallery property={property} />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="min-w-0 space-y-8">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="rounded-xl border border-line bg-surface/50 p-3.5 text-center"
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
                  <span className="h-5 w-1 rounded-full bg-accent" />
                  درباره‌ی این ملک
                </h2>
                <span className="text-[9px] text-muted">کد فایل: {property.id.toUpperCase()}</span>
              </div>
              <p className="mt-4 text-[12.5px] leading-8 text-muted">{property.description}</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {property.highlights.map((h) => (
                  <div
                    key={h}
                    className="flex items-center gap-2 rounded-xl border border-line bg-surface/40 px-3 py-2.5 text-[11px]"
                  >
                    <span className="grid size-5 place-items-center rounded-full bg-accent/10 text-accent">
                      <Check size={11} />
                    </span>
                    {h}
                  </div>
                ))}
              </div>
              {property.landArea ? (
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-line bg-surface/40 px-3 py-2.5 text-[11px]">
                  <LandPlot size={14} className="text-accent" />
                  متراژ زمین: {fa(property.landArea)} متر
                </div>
              ) : null}
            </section>

            <section>
              <h2 className="flex items-center gap-2 text-base font-extrabold">
                <span className="h-5 w-1 rounded-full bg-accent" />
                امکانات و ویژگی‌ها
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {property.amenities.map((a) => (
                  <div
                    key={a}
                    className="flex items-center gap-2 rounded-lg border border-line bg-surface/40 px-3 py-2.5 text-[10.5px] text-muted"
                  >
                    <span className="grid size-5 place-items-center rounded-full bg-accent/10 text-accent">
                      <Check size={11} />
                    </span>
                    {a}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <AiInsight property={property} />
            </section>

            <section>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="flex items-center gap-2 text-base font-extrabold">
                  <span className="h-5 w-1 rounded-full bg-accent" />
                  موقعیت مکانی
                </h2>
                <Link
                  href="/smart/explore#map"
                  className="text-[10px] font-semibold text-accent transition hover:opacity-75"
                >
                  مشاهده در نقشه تعاملی ←
                </Link>
              </div>
              <div className="mt-4 overflow-hidden rounded-2xl border border-line">
                <TehranMap items={[property, ...similar.slice(0, 2)]} className="h-[320px] w-full" />
                <div className="flex flex-col justify-between gap-2 border-t border-line bg-surface/40 px-4 py-3 sm:flex-row sm:items-center">
                  <p className="flex items-center gap-1.5 text-[10.5px] text-muted">
                    <MapPin size={12} className="text-accent" />
                    {property.address}
                  </p>
                  <span className="flex items-center gap-1 text-[9px] text-muted">
                    <Sparkles size={10} className="text-accent" />
                    دسترسی: ۵ دقیقه تا بزرگراه اصلی
                  </span>
                </div>
              </div>
            </section>

            <MiniConsultantRow property={property} />
          </div>

          <aside className="lg:sticky lg:top-[100px] lg:self-start">
            <SmartContactCard property={property} />
          </aside>
        </div>

        <section className="mt-14 border-t border-line pt-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-semibold tracking-widest text-accent">
                پیشنهادهای مشابه
              </span>
              <h2 className="mt-1 text-xl font-extrabold">شاید این‌ها را هم بپسندید</h2>
            </div>
            <Link
              href="/smart/explore"
              className="text-[10px] font-semibold text-accent transition hover:opacity-75"
            >
              همه املاک ←
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((p) => (
              <PropertyCardSmart key={p.id} property={p} />
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
