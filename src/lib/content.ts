import siteConfig from "../../config/site.json";
import servicesEs from "../../content/es/services.json";
import servicesEn from "../../content/en/services.json";
import portfolioEs from "../../content/es/portfolio.json";
import portfolioEn from "../../content/en/portfolio.json";
import pagesEs from "../../content/es/pages.json";
import pagesEn from "../../content/en/pages.json";
import packsEs from "../../content/es/packs.json";
import packsEn from "../../content/en/packs.json";
import clientsData from "../../content/clients.json";
import instagramEs from "../../content/es/instagram.json";
import instagramEn from "../../content/en/instagram.json";
import type { ServiceSlugPair } from "./i18n";
import type {
  Locale,
  InstagramPost,
  Pack,
  PagesContent,
  PortfolioItem,
  Service,
  SiteConfig,
  ClientLogo,
} from "./types";

const servicesByLocale: Record<Locale, Service[]> = {
  es: servicesEs as Service[],
  en: servicesEn as Service[],
};

const portfolioByLocale: Record<Locale, PortfolioItem[]> = {
  es: portfolioEs as PortfolioItem[],
  en: portfolioEn as PortfolioItem[],
};

const pagesByLocale: Record<Locale, PagesContent> = {
  es: pagesEs as PagesContent,
  en: pagesEn as PagesContent,
};

const instagramByLocale: Record<Locale, InstagramPost[]> = {
  es: instagramEs as InstagramPost[],
  en: instagramEn as InstagramPost[],
};

const packsByLocale: Record<Locale, Pack[]> = {
  es: packsEs as Pack[],
  en: packsEn as Pack[],
};

/**
 * `NEXT_PUBLIC_SITE_URL` permite fijar el dominio canónico por entorno
 * (preview, producción, Cloudflare…) sin tocar `config/site.json`.
 */
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || (siteConfig as SiteConfig).url
).replace(/\/$/, "");

export function getSiteConfig(): SiteConfig {
  return { ...(siteConfig as SiteConfig), url: siteUrl };
}

export function getServices(locale: Locale): Service[] {
  return servicesByLocale[locale];
}

export function getServiceBySlug(
  locale: Locale,
  slug: string
): Service | undefined {
  return getServices(locale).find((s) => s.slug === slug);
}

/** Pares de slugs ES/EN de cada servicio (mismo `id` en ambos idiomas). */
export function getServiceSlugPairs(): ServiceSlugPair[] {
  return servicesByLocale.es.map((service) => ({
    es: service.slug,
    en:
      servicesByLocale.en.find((s) => s.id === service.id)?.slug ??
      service.slug,
  }));
}

export function getPortfolio(locale: Locale): PortfolioItem[] {
  return portfolioByLocale[locale].filter((item) => item.published !== false);
}

export function getPages(locale: Locale): PagesContent {
  return pagesByLocale[locale];
}

export function getInstagramPosts(locale: Locale): InstagramPost[] {
  return instagramByLocale[locale];
}

export function getPacks(locale: Locale): Pack[] {
  return packsByLocale[locale];
}

const clients = clientsData as ClientLogo[];

export function getFeaturedClients(): ClientLogo[] {
  return clients.filter((c) => c.featured !== false && c.verified === true);
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === "es" ? "en" : "es";
}
