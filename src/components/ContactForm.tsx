"use client";

import Link from "next/link";
import { useState } from "react";
import type { Pack, Service } from "@/lib/types";
import { Button } from "./ui";

interface ContactFormProps {
  services: Service[];
  packs: Pack[];
  labels: {
    form: Record<string, string>;
    budgetOptions: string[];
    sectorOptions: string[];
  };
  locale: string;
  privacyHref: string;
  initialPackSlug?: string;
  /** Vías directas que se muestran si el envío falla */
  fallback: { email: string; whatsappUrl: string };
}

export function ContactForm({
  services,
  packs,
  labels,
  locale,
  privacyHref,
  initialPackSlug,
  fallback,
}: ContactFormProps) {
  const defaultPackTitle =
    packs.find((p) => p.slug === initialPackSlug)?.title ?? "";

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });

      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-sm border border-border bg-background px-4 py-3.5 text-sm outline-none transition focus:border-accent";
  const labelClass =
    "mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted";

  if (status === "success") {
    return (
      <div
        role="status"
        className="border border-accent/30 bg-surface p-10 text-center"
      >
        <p className="text-base font-light text-foreground">
          {labels.form.success}
        </p>
      </div>
    );
  }

  const packLabel = labels.form.pack ?? "Pack";
  const packNotSure = labels.form.packNotSure ?? "—";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot anti-spam: invisible para personas */}
      <div
        aria-hidden
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label htmlFor="cf-website">Website</label>
        <input
          id="cf-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className={labelClass}>
            {labels.form.name} *
          </label>
          <input
            id="cf-name"
            name="name"
            required
            autoComplete="name"
            maxLength={120}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="cf-email" className={labelClass}>
            {labels.form.email} *
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="cf-phone" className={labelClass}>
            {labels.form.phone}
          </label>
          <input
            id="cf-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="cf-service" className={labelClass}>
            {labels.form.service} *
          </label>
          <select
            id="cf-service"
            name="service"
            required
            className={inputClass}
          >
            <option value="">—</option>
            {services.map((s) => (
              <option key={s.id} value={s.title}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="cf-pack" className={labelClass}>
            {packLabel}
          </label>
          <select
            id="cf-pack"
            name="pack"
            defaultValue={defaultPackTitle}
            className={inputClass}
            key={defaultPackTitle}
          >
            <option value="">—</option>
            {packs.map((p) => (
              <option key={p.id} value={p.title}>
                {p.title}
              </option>
            ))}
            <option value={packNotSure}>{packNotSure}</option>
          </select>
        </div>
        <div>
          <label htmlFor="cf-sector" className={labelClass}>
            {labels.form.sector}
          </label>
          <select id="cf-sector" name="sector" className={inputClass}>
            <option value="">—</option>
            {labels.sectorOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cf-date" className={labelClass}>
            {labels.form.date}
          </label>
          <input id="cf-date" name="date" type="date" className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="cf-budget" className={labelClass}>
            {labels.form.budget}
          </label>
          <select id="cf-budget" name="budget" className={inputClass}>
            <option value="">—</option>
            {labels.budgetOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="cf-message" className={labelClass}>
            {labels.form.message} *
          </label>
          <textarea
            id="cf-message"
            name="message"
            required
            rows={5}
            maxLength={5000}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={`${labelClass} !normal-case !tracking-normal`}>
            <input
              type="checkbox"
              name="privacyAccepted"
              value="yes"
              required
              className="mr-3 accent-accent"
            />
            {labels.form.privacyAccept}{" "}
            <Link
              href={privacyHref}
              className="text-accent underline-offset-2 hover:underline"
            >
              {labels.form.privacyPolicyLink}
            </Link>
            *
          </label>
        </div>
      </div>

      {status === "error" && (
        <div
          role="alert"
          className="border border-red-400/40 bg-red-400/5 p-4 text-sm"
        >
          <p className="text-red-300">{labels.form.error}</p>
          <p className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            <a
              href={`mailto:${fallback.email}`}
              className="text-accent hover:underline"
            >
              {fallback.email}
            </a>
            <a
              href={fallback.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              WhatsApp
            </a>
          </p>
        </div>
      )}

      <Button type="submit" disabled={status === "loading"} showArrow>
        {status === "loading" ? "..." : labels.form.submit}
      </Button>
    </form>
  );
}
