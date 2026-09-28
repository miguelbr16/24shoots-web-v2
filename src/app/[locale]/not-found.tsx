import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
        404
      </p>
      <h1 className="mt-4 text-balance text-3xl font-light tracking-tight md:text-4xl">
        Esta página no existe · This page doesn&apos;t exist
      </h1>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          href="/es"
          className="rounded-sm border border-accent bg-accent px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-background transition hover:bg-accent-hover"
        >
          Inicio
        </Link>
        <Link
          href="/en"
          className="rounded-sm border border-border px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-foreground transition hover:border-foreground/40"
        >
          Home
        </Link>
      </div>
    </section>
  );
}
