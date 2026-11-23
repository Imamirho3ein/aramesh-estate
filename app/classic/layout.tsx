import type { Metadata } from "next";
import { NavbarClassic } from "@/components/navbar-classic";
import { FooterClassic } from "@/components/footers";

export const metadata: Metadata = {
  title: "آرامش کلاسیک | وب‌سایت حرفه‌ای املاک",
  description:
    "پکیج ۱: وب‌سایت حرفه‌ای املاک آرامش با جست‌وجوی پیشرفته، پنل مدیر، پنل مشاور و مدیریت آگهی.",
};

export default function ClassicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <NavbarClassic />
      <main>{children}</main>
      <FooterClassic />
    </div>
  );
}
