import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/providers";

const vazirmatn = localFont({
  src: "../public/fonts/Vazirmatn.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-vazirmatn",
});

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: {
    default: "آرامش | املاک هوشمند تهران",
    template: "%s | آرامش",
  },
  description:
    "املاک آرامش؛ خرید، فروش، رهن و اجاره‌ی ملک در تهران با تجربه‌ای مدرن، شفاف و هوشمند.",
  icons: {
    icon: `${basePath}/favicon.svg`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={vazirmatn.variable}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
