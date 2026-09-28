import type { Metadata } from "next";
import { getServiceSlugPairs, getSiteConfig } from "./content";
import { localizePath } from "./i18n";
import type { Locale } from "./types";

export function buildMetadata({
  locale,
  title,
  description,
  path = "",
}: {
  locale: Locale;
  title?: string;
  description?: string;
  path?: string;
}): Metadata {
  const site = getSiteConfig();
  const fullTitle = title ? `${title} | ${site.name}` : site.name;
  const desc = description ?? site.description[locale];
  const localPath = `/${locale}${path}`;
  const url = `${site.url}${localPath}`;
  const pairs = getServiceSlugPairs();
  const altPath = (to: Locale) =>
    to === locale ? localPath : localizePath(localPath, to, pairs);

  return {
    title: fullTitle,
    description: desc,
    metadataBase: new URL(site.url),
    alternates: {
      canonical: url,
      languages: {
        es: `${site.url}${altPath("es")}`,
        en: `${site.url}${altPath("en")}`,
        "x-default": `${site.url}${altPath("es")}`,
      },
    },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: site.name,
      locale: locale === "es" ? "es_ES" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
    },
    robots: { index: true, follow: true },
  };
}

export function buildOrganizationJsonLd(locale: Locale) {
  const site = getSiteConfig();
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    description: site.description[locale],
    url: site.url,
    image: `${site.url}${site.logo}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Valencia",
      addressCountry: "ES",
    },
    sameAs: [site.contact.instagram],
    areaServed: "ES",
    priceRange: "€€",
  };
}
