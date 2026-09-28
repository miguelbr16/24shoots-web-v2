import { NextResponse } from "next/server";
import { getSiteConfig } from "@/lib/content";

/**
 * Envío del formulario de contacto.
 *
 * Proveedor: Resend (API HTTP, sin SDK → funciona igual en Vercel, Node o
 * Cloudflare). Variables de entorno:
 *   RESEND_API_KEY      clave de Resend (obligatoria para enviar)
 *   CONTACT_FROM_EMAIL  remitente verificado en Resend, p. ej. "24Shoots <web@24shoots.es>"
 *   CONTACT_TO_EMAIL    destinatario (por defecto, contact.email de config/site.json)
 *
 * Sin configuración responde 503: el formulario muestra el error y las vías
 * directas (email / WhatsApp). Nunca devuelve `ok: true` sin haber enviado.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIMITS = {
  name: 120,
  email: 200,
  phone: 40,
  short: 200,
  message: 5000,
} as const;

function field(body: Record<string, unknown>, key: string, max: number) {
  const value = body[key];
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  // Honeypot: campo oculto que solo rellenan los bots. Se descarta en silencio.
  if (field(body, "website", LIMITS.short)) {
    return NextResponse.json({ ok: true });
  }

  const data = {
    name: field(body, "name", LIMITS.name),
    email: field(body, "email", LIMITS.email),
    phone: field(body, "phone", LIMITS.phone),
    service: field(body, "service", LIMITS.short),
    pack: field(body, "pack", LIMITS.short),
    sector: field(body, "sector", LIMITS.short),
    date: field(body, "date", LIMITS.short),
    budget: field(body, "budget", LIMITS.short),
    message: field(body, "message", LIMITS.message),
    locale: field(body, "locale", 5) || "es",
  };

  if (
    !data.name ||
    !EMAIL_RE.test(data.email) ||
    !data.service ||
    !data.message ||
    body.privacyAccepted !== "yes"
  ) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || getSiteConfig().contact.email;

  if (!apiKey || !from) {
    console.error(
      "[contact] Email provider not configured (RESEND_API_KEY / CONTACT_FROM_EMAIL)",
    );
    return NextResponse.json(
      { ok: false, error: "not_configured" },
      { status: 503 },
    );
  }

  const rows: [string, string][] = [
    ["Nombre", data.name],
    ["Email", data.email],
    ["Teléfono", data.phone],
    ["Servicio", data.service],
    ["Pack", data.pack],
    ["Sector", data.sector],
    ["Fecha", data.date],
    ["Presupuesto", data.budget],
    ["Idioma", data.locale],
  ];
  const filled = rows.filter(([, v]) => v);

  const text = [...filled.map(([k, v]) => `${k}: ${v}`), "", data.message].join(
    "\n",
  );

  const html = `
    <table cellpadding="6" style="font-family:sans-serif;font-size:14px">
      ${filled
        .map(
          ([k, v]) =>
            `<tr><td style="color:#888">${k}</td><td>${escapeHtml(v)}</td></tr>`,
        )
        .join("")}
    </table>
    <p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(
      data.message,
    )}</p>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: data.email,
        subject: `Nueva solicitud web — ${data.service} — ${data.name}`,
        text,
        html,
      }),
    });

    if (!res.ok) {
      console.error("[contact] Resend error", res.status, await res.text());
      return NextResponse.json(
        { ok: false, error: "send_failed" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] Send failed", error);
    return NextResponse.json(
      { ok: false, error: "send_failed" },
      { status: 502 },
    );
  }
}
