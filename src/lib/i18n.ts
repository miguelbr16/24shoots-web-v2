import type { Locale } from "./types";

export const locales: Locale[] = ["es", "en"];
export const defaultLocale: Locale = "es";

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

const routeMap = {
  es: {
    services: "servicios",
    portfolio: "portfolio",
    about: "sobre-nosotros",
    contact: "contacto",
    packs: "packs",
    legal: "aviso-legal",
    privacy: "privacidad",
    cookies: "cookies",
  },
  en: {
    services: "services",
    portfolio: "portfolio",
    about: "about",
    contact: "contact",
    packs: "packs",
    legal: "legal-notice",
    privacy: "privacy",
    cookies: "cookies",
  },
} as const;

export type RouteKey = keyof typeof routeMap.es;

export function getRoute(locale: Locale, key: RouteKey): string {
  return `/${locale}/${routeMap[locale][key]}`;
}

export function getHomeRoute(locale: Locale): string {
  return `/${locale}`;
}

export interface ServiceSlugPair {
  es: string;
  en: string;
}

function findRouteKey(locale: Locale, segment: string): RouteKey | undefined {
  return (Object.keys(routeMap[locale]) as RouteKey[]).find(
    (key) => routeMap[locale][key] === segment
  );
}

/**
 * Traduce una ruta al otro idioma (sección y slug de servicio).
 * `/es/servicios/eventos-corporativos` → `/en/services/corporate-events`
 */
export function localizePath(
  pathname: string,
  to: Locale,
  serviceSlugs: ServiceSlugPair[] = []
): string {
  const [, from, section, slug, ...rest] = pathname.split("/");
  if (!isValidLocale(from)) return `/${to}`;
  if (!section) return `/${to}`;

  const key = findRouteKey(from, section);
  if (!key) return `/${to}`;

  const segments: string[] = [to, routeMap[to][key]];
  if (slug) {
    const pair = serviceSlugs.find((p) => p[from] === slug);
    segments.push(pair ? pair[to] : slug, ...rest);
  }
  return `/${segments.join("/")}`;
}

/**
 * Si la sección de la URL pertenece al otro idioma (p. ej. `/es/services`),
 * devuelve la ruta correcta (`/es/servicios`) para redirigir y evitar
 * contenido duplicado. Devuelve null si la ruta ya es correcta.
 */
export function fixCrossLocaleSection(pathname: string): string | null {
  const [, locale, section, ...rest] = pathname.split("/");
  if (!isValidLocale(locale) || !section) return null;
  if (findRouteKey(locale, section)) return null;

  const other: Locale = locale === "es" ? "en" : "es";
  const key = findRouteKey(other, section);
  if (!key) return null;
  return `/${[locale, routeMap[locale][key], ...rest].join("/")}`;
}
