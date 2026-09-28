"use client";

import type { ClientLogo, Locale } from "@/lib/types";
import { getRoute } from "@/lib/i18n";
import { Button } from "./ui";
import { ReviewsCarousel } from "./ReviewsCarousel";
import { ClientLogoArcWheel } from "./ClientLogoArcWheel";
import { ClientLogoMarquee } from "./ClientLogoMarquee";
import { AccentDivider } from "./AccentRule";

interface Review {
  quote: string;
  author: string;
  role: string;
  service: string;
}

interface ClientSocialProofSectionProps {
  locale: Locale;
  clients: ClientLogo[];
  headline: string;
  headlineAccent: string;
  headlineBrand?: string;
  subline: string;
  dragHint: string;
  privacyNote: string;
  ctaLabel: string;
  reviewsTitle: string;
  reviewsSubtitle: string;
  reviews: Review[];
}

export function ClientSocialProofSection({
  locale,
  clients,
  headline,
  headlineAccent,
  headlineBrand = "24Shoots",
  subline,
  dragHint,
  privacyNote,
  ctaLabel,
  reviewsTitle,
  reviewsSubtitle,
  reviews,
}: ClientSocialProofSectionProps) {
  const center = (
    <>
      <h2 className="text-balance leading-[1.12] tracking-tight">
        <span className="block text-[clamp(1.2rem,2.8vw,1.85rem)] font-semibold text-foreground">
          {headline}
        </span>
        <span className="mt-1 block text-[clamp(1.2rem,2.8vw,1.85rem)] font-light text-foreground/90">
          {headlineAccent}{" "}
          <span className="font-serif text-[1.08em] font-normal italic text-accent">
            {headlineBrand}
          </span>
        </span>
      </h2>
      <p className="mx-auto mt-3 max-w-[15rem] text-pretty text-[11px] leading-relaxed text-muted sm:max-w-xs md:text-xs">
        {subline}
      </p>
      <div className="mt-5">
        <Button
          href={getRoute(locale, "contact")}
          showArrow
          className="!rounded-full !px-7 !py-3.5 !text-[10px] !tracking-[0.18em] shadow-lg shadow-accent/30"
        >
          {ctaLabel}
        </Button>
      </div>
    </>
  );

  return (
    <section className="section-rule-y relative bg-background">
      {/* Móvil: titular + logos en horizontal */}
      <div className="relative overflow-hidden py-8 lg:hidden">
        <div className="mx-auto max-w-sm px-4 text-center">{center}</div>
        <div className="mt-6">
          <ClientLogoMarquee clients={clients} ariaLabel={dragHint} />
        </div>
      </div>

      {/* Escritorio: rueda orbital fija */}
      <div className="relative hidden overflow-hidden py-4 md:py-6 lg:block">
        <ClientLogoArcWheel clients={clients} ariaLabel={dragHint} center={center} />

        <p className="relative z-10 -mt-1 pb-2 text-center text-[10px] uppercase tracking-[0.22em] text-muted/70">
          {dragHint}
        </p>
      </div>

      {reviews.length > 0 && (
        <div className="relative z-20 bg-surface pb-14 pt-4 md:pb-20 md:pt-6">
          <AccentDivider className="mb-8 px-4 md:mb-10" />
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <ReviewsCarousel title={reviewsTitle} subtitle={reviewsSubtitle} items={reviews} />
            <p className="mx-auto mt-10 max-w-lg text-center text-xs leading-relaxed text-muted/75">
              {privacyNote}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
