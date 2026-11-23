import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Clock,
  MessageCircle,
  Phone,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { Container, Eyebrow, SectionHead } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/reveal";
import { consultants } from "@/lib/data";
import { fa } from "@/lib/utils";

export const metadata = {
  title: "مشاوران | آرامش کلاسیک",
  description: "تیم مشاوران متخصص املاک آرامش در محله‌های تهران.",
};

export default function ConsultantsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#0b2f27] text-white">
        <div className="pointer-events-none absolute -right-20 -top-24 size-80 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-8 -top-10 size-52 rounded-full border border-[#d9b872]/20" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 size-72 rounded-full bg-[#c19a4b]/10 blur-3xl" />
        <Container className="relative py-14 lg:py-20">
          <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d9b872]/30 bg-[#d9b872]/10 px-3 py-1.5 text-[10px] font-semibold text-[#d9b872]">
                <Users size={12} /> تیم آرامش
              </span>
              <h1 className="mt-5 text-3xl font-black leading-[1.35] tracking-tight sm:text-4xl lg:text-[3rem]">
                مشاورانی که
                <br />
                <span className="text-[#d9b872]">محله را می‌شناسند.</span>
              </h1>
              <p className="mt-5 max-w-xl text-[13px] leading-8 text-white/55">
                هر مشاور متخصص یک یا چند محله است؛ با تجربه‌ی واقعی، داده‌ی بازار و
                ارتباط مستقیم. بدون واسطه، بدون اتلاف وقت.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                ["۴", "مشاور متخصص"],
                ["۸۲۰+", "معامله موفق"],
                ["۴.۹", "میانگین امتیاز"],
              ].map(([v, l]) => (
                <div
                  key={l}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center backdrop-blur"
                >
                  <div className="text-xl font-extrabold text-[#d9b872]">{v}</div>
                  <div className="mt-1 text-[9px] leading-4 text-white/50">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 lg:py-20">
        <Container>
          <Reveal>
            <SectionHead
              eyebrow="معرفی تیم"
              title={
                <>
                  یک مشاور، <span className="text-accent">یک مسیر مشخص</span>
                </>
              }
              desc="پروفایل هر مشاور را ببین، تخصصش را بسنج و مستقیم تماس بگیر. همه‌ی مشاوران آرامش دارای مجوز و سابقه‌ی قابل بررسی هستند."
            />
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2">
            {consultants.map((c, i) => (
              <Reveal key={c.id} delay={i * 80}>
                <article className="group h-full overflow-hidden rounded-[1.5rem] border border-line bg-white transition hover:border-accent/25 hover:shadow-[0_24px_60px_-35px_rgba(20,32,27,0.45)]">
                  <div className="flex flex-col gap-4 p-5 sm:flex-row sm:p-6">
                    <div className="flex shrink-0 items-start gap-3">
                      <span
                        className={`grid size-20 place-items-center rounded-[1.4rem] bg-gradient-to-br ${c.tone} text-xl font-bold text-white shadow-lg`}
                      >
                        {c.initials}
                      </span>
                      <div className="sm:hidden">
                        <h2 className="text-base font-extrabold">{c.name}</h2>
                        <p className="mt-1 text-[10px] text-muted">{c.role}</p>
                        <div className="mt-1.5 flex items-center gap-1 text-[10px]">
                          <Star size={11} className="fill-[#c19a4b] text-[#c19a4b]" />
                          {fa(c.rating)} · {fa(c.deals)} معامله
                        </div>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="hidden items-start justify-between gap-3 sm:flex">
                        <div>
                          <h2 className="text-base font-extrabold">{c.name}</h2>
                          <p className="mt-1 text-[10px] text-muted">{c.role}</p>
                        </div>
                        <div className="flex items-center gap-1 rounded-full bg-[#f7edda] px-2.5 py-1 text-[9px] font-bold text-[#a47c2e]">
                          <BadgeCheck size={11} /> تاییدشده
                        </div>
                      </div>
                      <p className="mt-2 text-[11px] leading-6 text-muted sm:mt-3">{c.bio}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {c.specialties.map((s) => (
                          <span
                            key={s}
                            className="rounded-full bg-soft px-2.5 py-1 text-[9px] font-medium text-accent"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 divide-x divide-x-reverse divide-line border-y border-line bg-[#faf8f2]">
                    {[
                      [fa(c.deals), "معامله موفق", TrendingUp],
                      [fa(c.experience), "سال تجربه", Clock],
                      [fa(c.rating), "امتیاز مشتری", Star],
                    ].map(([v, l, Icon]) => {
                      const I = Icon as typeof Star;
                      return (
                        <div key={l as string} className="flex items-center justify-center gap-2 py-3">
                          <I size={13} className="text-accent/70" />
                          <div>
                            <div className="text-[11px] font-bold">{v as string}</div>
                            <div className="text-[8px] text-muted">{l as string}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 p-4 sm:px-6">
                    <a
                      href={`tel:${c.phone.replace(/\s/g, "")}`}
                      className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-accent text-[11px] font-bold text-white transition hover:bg-[#0b4a3d]"
                    >
                      <Phone size={14} /> تماس مستقیم
                    </a>
                    <a
                      href={`https://wa.me/98${c.phone.replace(/\D/g, "").replace(/^0/, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-10 items-center justify-center gap-2 rounded-xl border border-line px-4 text-[10px] font-semibold text-muted transition hover:border-accent/30 hover:text-accent"
                    >
                      <MessageCircle size={14} /> واتس‌اپ
                    </a>
                    <Link
                      href="/classic/properties"
                      className="flex h-10 items-center justify-center gap-1 rounded-xl border border-line px-4 text-[10px] font-semibold text-muted transition hover:border-accent/30 hover:text-accent"
                    >
                      فایل‌های مشاور
                      <ArrowLeft size={13} />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-[1.5rem] border border-line bg-white p-6 sm:flex-row sm:p-8">
              <div className="flex items-center gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-soft text-accent">
                  <Sparkles size={22} />
                </span>
                <div>
                  <h3 className="text-sm font-bold">می‌خواهی عضو تیم آرامش شوی؟</h3>
                  <p className="mt-1 text-[11px] leading-5 text-muted">
                    اگر بازار محله‌ات را می‌شناسی و به کار حرفه‌ای اعتقاد داری، با ما
                    گفت‌وگو کن.
                  </p>
                </div>
              </div>
              <Link
                href="/classic/panel"
                className="group flex h-11 shrink-0 items-center gap-2 rounded-full bg-accent px-5 text-xs font-bold text-white transition hover:bg-[#0b4a3d]"
              >
                درخواست همکاری
                <ArrowLeft size={15} className="transition group-hover:-translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
