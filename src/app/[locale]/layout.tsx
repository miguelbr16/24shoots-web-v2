import type { Viewport } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnalyticsScripts } from "@/components/AnalyticsScripts";
import { CookieBanner } from "@/components/CookieBanner";
import { WhatsAppFloat } from "@/components/ui";
import { getPages, getServiceSlugPairs, getSiteConfig } from "@/lib/content";
import { isValidLocale, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#141414",
};

// Páginas pre-renderizadas por idioma (HTML estático, portable a cualquier hosting)
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();

  const locale = localeParam as Locale;
  const site = getSiteConfig();
  const pages = getPages(locale);

  const whatsappMessage =
    locale === "es"
      ? "Hola, me interesa un servicio de 24Shoots"
      : "Hi, I'm interested in a 24Shoots service";

  return (
    <html lang={locale} className={inter.variable}>
      <body className="font-sans antialiased">
        <Header
          locale={locale}
          nav={pages.nav}
          logo={site.logo}
          siteName={site.name}
          serviceSlugs={getServiceSlugPairs()}
        />
        <main>{children}</main>
        <Footer
          locale={locale}
          footer={pages.footer}
          contact={{
            email: site.contact.email,
            instagram: site.contact.instagram,
            location: site.contact.location[locale],
          }}
          siteName={site.name}
        />
        <WhatsAppFloat
          phone={site.contact.whatsapp}
          message={whatsappMessage}
        />
        <CookieBanner
          locale={locale}
          message={pages.cookieBanner.message}
          accept={pages.cookieBanner.accept}
          reject={pages.cookieBanner.reject}
          policyLink={pages.cookieBanner.policyLink}
        />
        <AnalyticsScripts />
      </body>
    </html>
  );
}
