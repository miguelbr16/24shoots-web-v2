export type Locale = "es" | "en";

export interface SiteConfig {
  name: string;
  tagline: Record<Locale, string>;
  description: Record<Locale, string>;
  url: string;
  locale: { default: Locale; supported: Locale[] };
  theme: {
    background: string;
    foreground: string;
    accent: string;
    accentHover?: string;
    muted: string;
    surface?: string;
    border?: string;
    premium?: string;
  };
  contact: {
    phone?: string;
    whatsapp: string;
    email: string;
    instagram: string;
    location: Record<Locale, string>;
  };
  legal: {
    companyName: string;
    cif: string;
    address: string;
    lastUpdated?: Record<Locale, string>;
  };
  logo: string;
  heroVideo?: string | null;
  heroPoster?: string | null;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  icon: string;
  featured: boolean;
  highlights: string[];
  image?: string;
}

export interface Pack {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  featured: boolean;
  includes: string[];
}

export interface PackComparisonRow {
  id: string;
  label: string;
  packs: Record<string, boolean>;
}

export interface ClientLogo {
  id: string;
  name: string;
  monogram?: string;
  logo: string | null;
  featured?: boolean;
  /** Solo se muestra si el cliente ha autorizado el uso de su logo real */
  verified?: boolean;
  url?: string | null;
}

export interface PortfolioItem {
  id: string;
  /** false = ejemplo/placeholder: no se publica en la web */
  published?: boolean;
  title: string;
  description: string;
  services: string[];
  /** @deprecated use categories — kept for legacy filters */
  sectors: string[];
  categories: string[];
  type: "video" | "photo";
  thumbnail: string;
  videoUrl: string | null;
  instagramUrl: string;
  featured: boolean;
  client?: string;
  format?: string;
  location?: string;
  challenge?: string;
  approach?: string;
  deliverables?: string[];
  result?: string;
}

export interface Sector {
  id: string;
  label: string;
}

export interface InstagramPost {
  id: string;
  image?: string;
  url: string;
  type: "photo" | "video";
  caption?: string;
  /** Local mp4 in /public, e.g. /instagram/reel-1.mp4 */
  video?: string;
  /** Use Instagram official embed for this post URL */
  embed?: boolean;
}

export interface PagesContent {
  sectors?: Sector[];
  portfolioCategories: Sector[];
  home: {
    hero: {
      title: string;
      eyebrow: string;
      subtitle: string;
      description: string;
      ctaPrimary: string;
      ctaSecondary: string;
    };
    differentiatorSection: {
      eyebrow: string;
      title: string;
      subtitle: string;
      contrast: { instead: string; with: string }[];
      pillars: { title: string; description: string }[];
      media?: string[];
    };
    sectorsSection: { title: string };
    beforeAfterSection: {
      title: string;
      subtitle: string;
      rawLabel: string;
      editedLabel: string;
      dragHint: string;
      image: string;
    };
    servicesSection: { title: string; subtitle: string };
    packsSection: {
      title: string;
      subtitle: string;
      quoteNote: string;
      featuredBadge: string;
      ctaLabel: string;
    };
    portfolioSection: { title: string; subtitle: string; featuredLabel: string };
    whySection: {
      title: string;
      items: { title: string; description: string }[];
    };
    ctaSection: { title: string; description: string; button: string };
    processSection: {
      title: string;
      subtitle: string;
      steps: { title: string; description: string; image?: string }[];
    };
    statsSection: { value: string; label: string }[];
    clientsSection: {
      headline: string;
      headlineAccent: string;
      headlineBrand?: string;
      subline: string;
      dragHint: string;
      privacyNote: string;
      ctaLabel: string;
    };
    testimonialSection: { label: string; quote: string; author: string; role: string };
    reviewsSection: {
      title: string;
      subtitle: string;
      items: {
        quote: string;
        author: string;
        role: string;
        service: string;
        /** Solo se publican reseñas reales y autorizadas */
        verified?: boolean;
      }[];
    };
    reelSection: { title: string; subtitle: string; cta: string; image?: string; video?: string };
    marqueeText: string;
    marqueeMedia?: string[];
    metadataTicker?: string[];
    instagramSection: {
      title: string;
      subtitle: string;
      followLabel: string;
      embedFallback: string;
      embedCta: string;
    };
    faqSection: {
      title: string;
      subtitle: string;
      items: { question: string; answer: string }[];
    };
  };
  about: {
    title: string;
    subtitle: string;
    content: string;
    values: { title: string; description: string }[];
  };
  contact: {
    title: string;
    subtitle: string;
    description: string;
    form: Record<string, string>;
    budgetOptions: string[];
    sectorOptions: string[];
    packOptions?: string[];
  };
  portfolio: Record<string, string>;
  services: Record<string, string>;
  packs: {
    title: string;
    subtitle: string;
    quoteNote: string;
    featuredBadge: string;
    ctaLabel: string;
    compareTitle: string;
    compareYes: string;
    compareNo: string;
    comparisonRows: PackComparisonRow[];
  };
  nav: Record<string, string>;
  footer: Record<string, string>;
  legal: {
    notice: { title: string; content: string };
    privacy: { title: string; content: string };
    cookies: { title: string; content: string };
  };
  cookieBanner: {
    message: string;
    accept: string;
    reject: string;
    policyLink: string;
  };
}
