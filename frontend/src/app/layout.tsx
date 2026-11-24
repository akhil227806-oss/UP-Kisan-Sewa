import type { Metadata, Viewport } from "next";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth";
import { SiteChrome } from "@/components/layout/SiteChrome";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#15803d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "Awadh Kisan Seva | Digital Farmer Support Platform for UP",
    template: "%s | Awadh Kisan Seva",
  },
  description:
    "Digital agriculture support platform for farmers of Uttar Pradesh — verified crop packages, daily mandi prices, agro-weather advisories, government schemes, and expert consultation.",
  keywords: [
    "Awadh Kisan Seva",
    "Kisan Seva UP",
    "UP Agriculture Support",
    "Mandi Prices UP",
    "UP Agriculture Schemes",
    "Crop Advisory UP",
  ],
  authors: [{ name: "Awadh Kisan Seva Project Team" }],
  openGraph: {
    title: "Awadh Kisan Seva — Digital Agriculture Support Platform",
    description: "Farmer's Progress, State's Prosperity — Certified crop guidance, live mandi rates & government schemes",
    siteName: "Awadh Kisan Seva",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-font-size="md">
      <body className="min-h-screen bg-[#f8faf5] text-[#1f2937] font-sans antialiased">
        <I18nProvider>
          <AuthProvider>
            <SiteChrome>{children}</SiteChrome>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
