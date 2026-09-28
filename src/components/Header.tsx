"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/types";
import {
  getRoute,
  getHomeRoute,
  localizePath,
  type ServiceSlugPair,
} from "@/lib/i18n";
import { Button, LocaleSwitcher } from "./ui";

interface HeaderProps {
  locale: Locale;
  nav: Record<string, string>;
  logo: string;
  siteName: string;
  serviceSlugs: ServiceSlugPair[];
}

function ViewfinderMark() {
  return (
    <span className="hidden text-accent/50 md:inline" aria-hidden>
      <span className="mr-1 inline-block h-3 w-3 border-l border-t border-current" />
      <span className="inline-block h-3 w-3 border-r border-t border-current" />
    </span>
  );
}

export function Header({
  locale,
  nav,
  logo,
  siteName,
  serviceSlugs,
}: HeaderProps) {
  const pathname = usePathname();
  const alternatePath = localizePath(
    pathname,
    locale === "es" ? "en" : "es",
    serviceSlugs
  );
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { href: getHomeRoute(locale), label: nav.home },
    { href: getRoute(locale, "services"), label: nav.services },
    { href: getRoute(locale, "packs"), label: nav.packs },
    { href: getRoute(locale, "portfolio"), label: nav.portfolio },
    { href: getRoute(locale, "about"), label: nav.about },
    { href: getRoute(locale, "contact"), label: nav.contact },
  ];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ${
          scrolled
            ? "border-border bg-background/95 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl"
            : "border-border/60 bg-background/80 backdrop-blur-md"
        }`}
      >
        {/* Accent rail — 24Shoots signature, not a pill */}
        <div
          className={`h-0.5 w-full bg-accent transition-opacity duration-500 ${
            scrolled ? "opacity-100" : "opacity-70"
          }`}
        />

        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 md:px-6 md:py-4">
          <Link
            href={getHomeRoute(locale)}
            className="group flex min-w-0 shrink items-center gap-3"
          >
            <span className="hidden h-8 w-1 shrink-0 bg-accent sm:block" aria-hidden />
            <Image
              src={logo}
              alt={siteName}
              width={130}
              height={44}
              className="h-8 w-auto max-w-[120px] object-contain brightness-110 sm:max-w-none md:h-9"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-1 xl:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/70 transition hover:bg-surface hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-2 border border-border px-2.5 py-1.5 lg:flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-muted">
                Rec
              </span>
            </span>

            <div className="hidden sm:block">
              <LocaleSwitcher locale={locale} alternatePath={alternatePath} />
            </div>

            <Button
              href={getRoute(locale, "contact")}
              className="hidden !px-4 !py-2.5 !text-[10px] sm:inline-flex md:!px-5"
            >
              {locale === "es" ? "Presupuesto" : "Quote"}
            </Button>

            <button
              type="button"
              className="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1.5 border border-border bg-surface/80 xl:hidden"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
            >
              <span
                className={`block h-px w-5 bg-foreground transition ${open ? "translate-y-[5px] rotate-45" : ""}`}
              />
              <span
                className={`block h-px w-5 bg-foreground transition ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-px w-5 bg-foreground transition ${open ? "-translate-y-[5px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / tablet drawer */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity xl:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      <div
        className={`fixed inset-x-0 top-[57px] z-50 max-h-[calc(100vh-57px)] overflow-y-auto border-b border-accent/40 bg-background shadow-2xl transition-transform duration-300 xl:hidden ${
          open ? "translate-y-0" : "-translate-y-4 pointer-events-none opacity-0"
        }`}
      >
        <div className="border-l-4 border-accent px-4 py-6">
          <div className="mb-4 flex items-center justify-between">
            <ViewfinderMark />
            <LocaleSwitcher locale={locale} alternatePath={alternatePath} />
          </div>
          <nav className="flex flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border-b border-border py-4 text-sm font-medium uppercase tracking-[0.2em] text-foreground/90 active:text-accent"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6">
            <Button href={getRoute(locale, "contact")} className="w-full justify-center">
              {locale === "es" ? "Solicitar presupuesto" : "Request a quote"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
