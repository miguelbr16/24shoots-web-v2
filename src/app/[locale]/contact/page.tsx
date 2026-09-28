import { notFound } from "next/navigation";
import { ContactForm } from "@/components/ContactForm";
import { SectionHeading } from "@/components/ui";
import { getPages, getServices, getPacks, getSiteConfig } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { getRoute, isValidLocale } from "@/lib/i18n";
import { buildMailtoLink } from "@/lib/mailto";
import type { Locale } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) return {};
  const locale = localeParam as Locale;
  const pages = getPages(locale);
  return buildMetadata({
    locale,
    title: pages.contact.title,
    description: pages.contact.description,
    path: "/contact",
  });
}

export default async function ContactEnPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ pack?: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();

  const { pack: packSlug } = await searchParams;

  const locale = localeParam as Locale;
  const pages = getPages(locale);
  const site = getSiteConfig();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24">
      <SectionHeading
        title={pages.contact.title}
        subtitle={pages.contact.subtitle}
      />
      <p className="mb-10 text-muted">{pages.contact.description}</p>

      <div className="mb-10 flex flex-wrap gap-6 text-sm">
        <a
          href={buildMailtoLink(site.contact.email, locale)}
          className="text-accent hover:underline"
        >
          {site.contact.email}
        </a>
        <a
          href={site.contact.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          Instagram
        </a>
      </div>

      <ContactForm
        services={getServices(locale)}
        packs={getPacks(locale)}
        initialPackSlug={packSlug}
        privacyHref={getRoute(locale, "privacy")}
        labels={{
          form: pages.contact.form,
          budgetOptions: pages.contact.budgetOptions,
          sectorOptions: pages.contact.sectorOptions,
        }}
        locale={locale}
        fallback={{
          email: site.contact.email,
          whatsappUrl: `https://wa.me/${site.contact.whatsapp.replace(/\D/g, "")}`,
        }}
      />
    </div>
  );
}
