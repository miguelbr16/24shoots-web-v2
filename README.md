# 24Shoots Web — Media Agency Starter

Plantilla reutilizable Next.js para 24Shoots y futuras webs de clientes.

## Inicio rápido

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) → redirige a `/es`.

## Estructura

```
config/site.json          # Marca, contacto, tema, legal
content/es/               # Contenido en español (JSON)
content/en/               # Contenido en inglés (JSON)
src/components/           # UI reutilizable
src/app/[locale]/         # Páginas por idioma
scripts/new-site.mjs      # Crear web nueva para otro cliente
```

## Editar sin tocar código

| Qué cambiar | Archivo |
|-------------|---------|
| WhatsApp, email, Instagram | `config/site.json` |
| Añadir/quitar servicio | `content/es/services.json` + `content/en/services.json` |
| Portfolio | `content/es/portfolio.json` + `content/en/portfolio.json` |
| Textos de páginas | `content/es/pages.json` + `content/en/pages.json` |
| Logo | Sustituir `public/logo.jpg` |

## Crear web para otro cliente

```bash
npm run new-site -- nombre-cliente
```

## Deploy (Vercel)

1. Sube el repo a GitHub
2. Importa en [vercel.com](https://vercel.com)
3. Cuando tengas dominio → Settings → Domains → añade tu dominio
4. Actualiza `config/site.json` → `url`

**24Shoots (actual):** [24shoots-web.vercel.app](https://24shoots-web.vercel.app/es) — deploy automático desde `main`.

## Documentación de avances

Resumen funcional, funnel, rueda de clientes, portfolio y commits recientes:

→ [`docs/AVANCES-2026-07-24.md`](docs/AVANCES-2026-07-24.md)

## Formulario de contacto

Envía por email con Resend (API HTTP). Configura `RESEND_API_KEY` y `CONTACT_FROM_EMAIL` (ver `.env.example`). Sin configuración, la API responde 503 y el formulario muestra el email y WhatsApp como alternativa: nunca confirma un envío que no se ha hecho.

Diagnóstico y plan de mejora: [`docs/DIAGNOSTICO-Y-PLAN-2026-09.md`](docs/DIAGNOSTICO-Y-PLAN-2026-09.md)

## Pendiente del cliente

- [ ] Logo en alta resolución → `public/logo.jpg`
- [ ] WhatsApp y email reales → `config/site.json`
- [ ] Datos legales → `config/site.json` + `content/*/pages.json`
- [ ] Portfolio real (41 posts IG) → `content/*/portfolio.json`
- [ ] Dominio → Vercel + `config/site.json`
