import type { Metadata } from "next";
import { NavbarSmart } from "@/components/navbar-smart";
import { FooterSmart } from "@/components/footers";
import { SmartAssistant } from "@/components/smart-assistant";

export const metadata: Metadata = {
  title: "آرامش هوشمند | سامانه پیشرفته املاک",
  description:
    "پکیج ۲: سامانه هوشمند املاک آرامش با تور ۳۶۰، دستیار هوشمند، نقشه تعاملی، پنل مشتری و CRM.",
};

export default function SmartLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-smart min-h-screen bg-bg text-ink">
      <NavbarSmart />
      <main>{children}</main>
      <FooterSmart />
      <SmartAssistant />
    </div>
  );
}
