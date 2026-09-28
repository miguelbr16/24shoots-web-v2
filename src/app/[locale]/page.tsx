import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { ScrollHero } from "@/components/ScrollHero";
import { Marquee } from "@/components/Marquee";
import { DifferentiatorSection } from "@/components/DifferentiatorSection";
import { SectorsBand } from "@/components/SectorsBand";
import { ProcessSteps } from "@/components/ProcessSteps";
import { StatsStrip } from "@/components/StatsStrip";
import { SectionHeading, Button } from "@/components/ui";
import { LightBand } from "@/components/LightBand";
import {
  getFeaturedClients,
  getInstagramPosts,
  getPages,
  getServices,
  getSiteConfig,
} from "@/lib/content";
import { buildMetadata, buildOrganizationJsonLd } from "@/lib/seo";
import { getRoute, isValidLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

const sectionFallback = (minHeight: string) =>
  function SectionFallback() {
    return <div className={`${minHeight} bg-transparent`} aria-hidden />;
  };

const HomeMobileHub = dynamic(
  () =>
    import("@/components/HomeMobileHub").then((m) => ({
      default: m.HomeMobileHub,
    })),
  { loading: sectionFallback("min-h-[280px]") }
);

const ServicesAccordion = dynamic(
  () =>
    import("@/components/ServicesAccordion").then((m) => ({
      default: m.ServicesAccordion,
    })),
  { loading: sectionFallback("min-h-[320px]") }
);

const InstagramGrid = dynamic(
  () =>
    import("@/components/InstagramGrid").then((m) => ({
      default: m.InstagramGrid,
    })),
  { loading: sectionFallback("min-h-[480px]") }
);

const ClientSocialProofSection = dynamic(
  () =>
    import("@/components/ClientSocialProofSection").then((m) => ({
      default: m.ClientSocialProofSection,
    })),
  { loading: sectionFallback("min-h-[640px]") }
);

const FaqSection = dynamic(
  () =>
    import("@/components/FaqSection").then((m) => ({
      default: m.FaqSection,
    })),
  { loading: sectionFallback("min-h-[320px]") }
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) return {};
  const locale = localeParam as Locale;
  const site = getSiteConfig();
  return buildMetadata({ locale, description: site.description[locale] });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();

  const locale = localeParam as Locale;
  const site = getSiteConfig();
  const pages = getPages(locale);
  const services = getServices(locale);
  const instagramPosts = getInstagramPosts(locale);
  const featuredClients = getFeaturedClients();
  const { home } = pages;
  const verifiedReviews = home.reviewsSection.items.filter((r) => r.verified);

  const jsonLd = buildOrganizationJsonLd(locale);
  const instagramHandle = site.contact.instagram
    .replace(/https?:\/\/(www\.)?instagram\.com\//, "")
    .replace(/\/$/, "");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Gancho */}
      <ScrollHero
        locale={locale}
        eyebrow={home.hero.eyebrow}
        title={home.hero.title}
        subtitle={home.hero.subtitle}
        description={home.hero.description}
        ctaPrimary={home.hero.ctaPrimary}
        ctaSecondary={home.hero.ctaSecondary}
        logoSrc={site.logo}
        videoSrc={site.heroVideo}
        posterSrc={site.heroPoster}
      />
      <Marquee text={home.marqueeText} />
      <DifferentiatorSection
        eyebrow={home.differentiatorSection.eyebrow}
        title={home.differentiatorSection.title}
        subtitle={home.differentiatorSection.subtitle}
        contrast={home.differentiatorSection.contrast}
        pillars={home.differentiatorSection.pillars}
        media={home.differentiatorSection.media}
      />

      {/* 2. Mapa mental */}
      <SectorsBand
        title={home.sectorsSection.title}
        sectors={pages.portfolioCategories}
      />

      {/* 3. Hub móvil: servicios + proceso + por qué en pestañas */}
      <HomeMobileHub
        locale={locale}
        servicesTitle={home.servicesSection.title}
        servicesSubtitle={home.servicesSection.subtitle}
        services={services}
        processTitle={home.processSection.title}
        processSubtitle={home.processSection.subtitle}
        steps={home.processSection.steps}
        whyTitle={home.whySection.title}
        whyItems={home.whySection.items}
        viewLabel={pages.services.cta}
        allServicesLabel={pages.nav.services}
      />

      <div className="hidden lg:block">
        <ServicesAccordion
          title={home.servicesSection.title}
          subtitle={home.servicesSection.subtitle}
          services={services}
          locale={locale}
          viewLabel={pages.services.cta}
          highlightsLabel={pages.services.highlights}
          allServicesLabel={pages.nav.services}
        />
      </div>

      <ProcessSteps
        className="hidden lg:block"
        title={home.processSection.title}
        subtitle={home.processSection.subtitle}
        steps={home.processSection.steps}
      />

      <LightBand accent="top" className="hidden lg:block">
        <SectionHeading title={home.whySection.title} tone="light" />
        <div className="grid gap-8 md:grid-cols-3 md:gap-12">
          {home.whySection.items.map((item, i) => (
            <div
              key={item.title}
              className={`border-t border-light-band-border pt-6 md:border-t-0 md:pt-0 ${
                i > 0 ? "md:border-l md:border-accent/40 md:pl-8" : ""
              }`}
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-lg font-medium tracking-tight text-light-band-text">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-light-band-muted">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </LightBand>

      <InstagramGrid
        title={home.instagramSection.title}
        subtitle={home.instagramSection.subtitle}
        handle={instagramHandle}
        profileUrl={site.contact.instagram}
        followLabel={home.instagramSection.followLabel}
        embedFallback={home.instagramSection.embedFallback}
        embedCta={home.instagramSection.embedCta}
        posts={instagramPosts}
      />
      <StatsStrip stats={home.statsSection} />

      {/* Confianza social: solo con logos y reseñas reales autorizados */}
      {featuredClients.length > 0 && (
        <ClientSocialProofSection
          locale={locale}
          clients={featuredClients}
          headline={home.clientsSection.headline}
          headlineAccent={home.clientsSection.headlineAccent}
          headlineBrand={home.clientsSection.headlineBrand}
          subline={home.clientsSection.subline}
          dragHint={home.clientsSection.dragHint}
          privacyNote={home.clientsSection.privacyNote}
          ctaLabel={home.clientsSection.ctaLabel}
          reviewsTitle={home.reviewsSection.title}
          reviewsSubtitle={home.reviewsSection.subtitle}
          reviews={verifiedReviews}
        />
      )}

      {/* 9. Fricción final */}
      <FaqSection
        title={home.faqSection.title}
        subtitle={home.faqSection.subtitle}
        items={home.faqSection.items}
      />

      {/* 10. Cierre */}
      <section className="section-rule-strong-t bg-panel py-16 md:py-20">
        <div className="mx-auto max-w-2xl px-4 text-center md:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
            24Shoots
          </p>
          <h2 className="mt-4 text-balance text-3xl font-light tracking-tight md:text-4xl">
            {home.ctaSection.title}
          </h2>
          <p className="mt-4 text-muted">{home.ctaSection.description}</p>
          <div className="mt-10">
            <Button href={getRoute(locale, "contact")} showArrow>
              {home.ctaSection.button}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
