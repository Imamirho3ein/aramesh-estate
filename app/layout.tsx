import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: {
    default: "آرامش | املاک هوشمند تهران",
    template: "%s | آرامش",
  },
  description:
    "املاک آرامش؛ خرید، فروش، رهن و اجاره‌ی ملک در تهران با تجربه‌ای مدرن، شفاف و هوشمند.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
