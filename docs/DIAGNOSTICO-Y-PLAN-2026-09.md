# 24SHOOTS — Diagnóstico y plan de evolución (septiembre 2026)

Base: repo `miguelbr16/24shoots-web-v2` (commit `c302a4d`) y preview
`24shoots-web-v2.vercel.app`. El contenido del preview es idéntico al build
local (HTML comparado), así que las capturas y mediciones se han hecho sobre el
build de producción local: desktop 1440×900 y móvil 390×844.

Objetivo: **evolucionar** la web que gustaba al cliente, no sustituirla.

---

## 1. Verificación de la auditoría previa

| Punto de la auditoría | Estado real | Matiz |
|---|---|---|
| Hero oscuro varios segundos | ✅ Confirmado, y peor | No es la carga: **en scroll 0 todo está a opacidad 0 por diseño** (H1, logo, vídeo y póster). La pantalla sigue negra a los 4,5 s aunque el vídeo esté disponible. Solo aparece "SCROLL". |
| Hero de 31 MB | ⚠️ Matiz | El MP4 pesa 31 MB, pero no se descarga entero de golpe. Lo medido: **~6,7 MB en desktop y ~4,4 MB en móvil antes de hacer scroll**, porque los **6 vídeos** de la home empiezan a descargarse aunque no se vean. |
| "De la boda al negocio" / BODAS·EVENTOS | ✅ Confirmado | Aparece también en el marquee, la meta description, las FAQ y el contraste "Corporativo, marca, bodas…". |
| Stat "7 líneas" vs 10 | ✅ Confirmado → **corregido** | |
| +30 clientes y logos placeholder | ✅ Confirmado → **ocultado** | Los 14 logos son SVG de prueba con monogramas (GVA, AVV…). |
| Formulario falso OK | ✅ Confirmado → **corregido** | |
| Email `hola@24shootsmedia.com` vs `info@24shoots.es` | ✅ Confirmado | **Pendiente de confirmar** qué correo es el oficial (no lo he cambiado). |
| Title "24Shoots", SEO generalista | ✅ Confirmado | |
| Portfolio: 12 fillers | ✅ Confirmado, y más grave | Los fillers **reutilizan vídeos de clientes reales**: "Boda en Valencia · María & Carlos" reproduce el aftermovie oficial, "Restaurante La Marina" reproduce el de Huhtamaki… → **ocultados**. |
| "Portfolio teaser en home" | ❌ No existe | La home **no tiene sección de portfolio**. El trabajo solo aparece en "Detrás del objetivo" (grid IG) y como fotos en proceso/diferenciador. |
| `/hero-preview` 404 | ✅ | No existe en este repo. |

## 2. Problemas nuevos encontrados

### Errores objetivos (P0)
1. **Hero vacío en el primer viewport** (desktop y móvil): H1 con `opacity:0` → LCP = un párrafo; el visitante ve una pantalla negra. *(Requiere decisión creativa → ver §5).*
2. **Scrubbing de vídeo** (`video.currentTime = scroll × duración`) sobre un MP4 1080p de 69 s con GOP estándar: cada seek decodifica desde el keyframe anterior → saltos y bloqueos en móvil. Además solo usa ~60 % del recorrido y los **primeros frames son el cartel "Sol y luna events"** (logo de tercero) justo mientras se construyen las letras de 24SHOOTS, y se solapan.
3. **Pósters = cartela del vídeo**: los thumbnails son el primer frame (título "Huhtamaki", "Premios Isabel Ferrer", "Sol y luna events"). Todo el portfolio parece una colección de carátulas, no de imágenes. Es la mejora visual más barata y con más impacto.
4. **Logo de la web ≠ logo real**: `public/logo.svg` usa `<text>` (sin fuente embebida → cae a una fuente de sistema) e **invierte los colores** (24 blanco / SHOOTS naranja, en línea). El logo real (`logo.jpg`, perfil IG) es **24 naranja sobre SHOOTS blanco, apilado, con barra naranja y "DOMINA EL IMPACTO"**. Hace falta el vectorial original.
5. `<html lang="es">` también en `/en` → **corregido**.
6. **Rutas duplicadas**: `/en/servicios`, `/es/services`, `/es/contact`… respondían 200 con el mismo contenido; el hreflang de los servicios apuntaba a URLs inexistentes (`/en/servicios/…`) → **corregido** (redirección 308 + hreflang con slugs traducidos + x-default).
7. **Selector de idioma** siempre llevaba a la home del otro idioma → **corregido** (mantiene la página equivalente).
8. **Canonical/sitemap/OG apuntan a `24shoots-web.vercel.app`** (el otro proyecto) → ahora se puede fijar por entorno con `NEXT_PUBLIC_SITE_URL`.
9. Todas las páginas se renderizaban **bajo demanda** (SSR) → ahora **estáticas (SSG)**. Más rápido y portable a Cloudflare.
10. Grid IG con **3 celdas vacías** (6 piezas con la primera a 2×2) → **corregido** (5 piezas, rejilla cerrada).
11. "Hutamaki" → **Huhtamaki** (así aparece en su propio cartel) → **corregido**.
12. "Proyecto cliente" usaba el póster de Huhtamaki existiendo `cliente.jpg` → **corregido**.
13. Formulario: labels sin `for/id`, sin `autocomplete` → **corregido**.
14. Sin favicon (404), sin OG image, sin `apple-touch-icon`.
15. Legales: `[RAZÓN SOCIAL]`, `[CIF]`, `[FECHA]` en los textos, y **`config/site.json` publica en `legal.cif` un NIF de persona física** (formato DNI). Revisar si debe publicarse y dónde.

### UX
- Desktop: 240 vh de scroll de hero antes de ver contenido; 10,3 pantallas de home.
- Móvil: 9,9 pantallas; las pestañas del hub (Proceso/Por qué/Servicios) están bien, pero llegan después de otros 3 bloques.
- Alternancia claro/oscuro (servicios, por qué, FAQ en crema) → ritmo de plantilla, no de pieza audiovisual.
- Rueda de clientes recortada arriba y abajo; carrusel de reseñas con la 3.ª tarjeta cortada.
- Filtros de portfolio: siguen listando las 10 líneas aunque solo haya casos en 1 → filtros que llevan a "sin resultados" (P1).
- Etiqueta "REEL" en aftermovies 16:9, y todos los enlaces del grid IG van al perfil, no a la publicación.
- Botón "REC" parpadeando en el header: decorativo, compite con el CTA.

### CRO / confianza
- Sin prueba visual en el primer scroll: el trabajo aparece tarde y como "Instagram".
- 3 CTA distintos ("Presupuesto", "Solicitar presupuesto", "Contactar ahora", "Pedir presupuesto").
- Formulario de 9 campos + checkbox; la fecha muestra `mm/dd/yyyy`.
- Claims no demostrables: "Impacto medible", "Respuesta en 24h" (en contacto dice **24–48 h**), "Operador certificado" (dron), "cientos de particulares", "más reservas atribuidas".
- Imágenes de servicios engañosas: "Bodas & celebraciones" ilustrado con el cartel de Premios Isabel Ferrer; "Videoclip" con PIVC.

### Contenido
- 6 casos reales, **todos eventos/corporativo** → la web ya "dice" B2B/eventos con hechos; el copy dice otra cosa (bodas, fallas, dron…).
- "Aftermovie oficial" figura como cliente "24Shoots Media" pero el vídeo abre con "Sol y luna events" → confirmar cliente/autorización.
- EN: traducción correcta pero mismos problemas de posicionamiento.

### Técnico / repo
- `public/imagenes_insta/` = **186 MB sin uso** (11 reels + 5 fotos) que se suben en cada deploy.
- `backups/` con 3 copias completas del código, `.bat`, `.ps1` y documentos del cliente en la raíz del repo; `.git` pesa 342 MB.
- Componentes sin uso: `BeforeAfterSection`, `PacksSection`, `PortfolioShowcase`.
- Sin configuración de ESLint (`next lint` pide configurarse).
- Vídeos con audio AAC que nunca suena en los usos muted.

## 3. Qué conservar (ADN)

Paleta #141414 / #F0EBE4 / naranja #E8833A, grano, tono "cine", tipografía ligera grande, metadatos de rodaje (`4K · 16:9 · Valencia`), la construcción letra a letra de 24SHOOTS, acordeón de servicios, modal de caso (Reto · Enfoque · Entregables · Resultado), hub móvil por pestañas, WhatsApp flotante, stack Next 15 + JSON.

## 4. Dirección creativa: "la web como un montaje"

Principio: **el trabajo es la interfaz**. Menos cajas y más plano. El ritmo de la
home sigue la estructura de un aftermovie: **apertura → plano de marca → montaje
de trabajo → cómo lo hacemos → confianza → cierre**.

Patrones extraídos de productoras premium (Somesuch, CANADA, Stink, Pulse,
Noxediem; colecciones de Awwwards):
- El hero es **un plano en movimiento, silencioso, a sangre**, con la marca y *una* frase. Nunca pantalla vacía.
- El trabajo se presenta como **lista/índice de proyectos grandes** con preview de vídeo al hover (desktop) o en el viewport (móvil), no como tarjetas con texto.
- **Muy pocas palabras**: cliente · formato · año. La narrativa va dentro del caso.
- La conversión es **discreta pero constante**: un CTA fijo en header y un cierre fuerte, no bloques comerciales intermedios.
- Tipografía grande y espacio negro como "tiempo" entre planos; el color de marca solo como acento (la barra naranja es un recurso perfecto para esto).

### 5. Propuesta visual

**Hero (conservar el concepto, arreglar la ejecución)**
- **Estado inicial visible**: loop mudo de 6–8 s montado con los mejores planos reales (no la cartela), con póster AVIF de un frame fuerte como LCP. H1 + 1 frase + CTA visibles desde el primer frame.
- La construcción del logo 24SHOOTS se mantiene, pero **como intro de ~1,2 s basada en tiempo** (no en scroll), sobre el vídeo, y se asienta en su sitio. Sin scroll-lock, sin 240 vh; el hero ocupa 100 svh.
- `prefers-reduced-motion` → póster fijo.
- Copy propuesto (a validar): *"Producción audiovisual para marcas y eventos"* + *"Rodamos, editamos y entregamos piezas que se ven como cine. Valencia · España."* — conserva "Domina el impacto" como firma/claim del logo.
- Vídeo específico web: 1080p/720p, H.264 + (opcional) AV1/WebM, sin audio, ~1,5–2,5 MB; versión vertical 9:16 para móvil.

**Home (de 10 bloques a 6)**
1. Hero.
2. **Trabajo seleccionado**: 3–4 casos reales a gran tamaño (índice editorial con preview de vídeo) + "Ver todo el trabajo".
3. **Qué hacemos**: 3 líneas principales (Eventos corporativos · Contenido de marca · Documental/reportaje B2B) + "también" en una línea (aftermovies, videoclip, dron, campañas, bodas…). El acordeón se conserva en `/servicios`.
4. **Cómo trabajamos + por qué** fusionados en una sola banda de 4 pasos (desktop) / pestañas (móvil).
5. **Confianza**: solo datos verificables (clientes reales con permiso, 1–3 testimonios reales). Si no hay, este bloque no existe.
6. **Cierre**: CTA + FAQ corta (4 preguntas) + contacto directo.

Se eliminan: marquee de palabras, franja "Líneas de producción", stats Valencia/España, rueda de clientes, reseñas inventadas, el diferenciador duplicado.
Estimación: **≈5–6 pantallas en desktop y ≈6–7 en móvil** (hoy 10 y 10).

**Portfolio**
- Solo casos reales (hecho). Portada con los casos a pantalla ancha, ordenados por fuerza visual; filtros solo de líneas con casos.
- Pósters nuevos extraídos de los mejores frames (script ffmpeg) y **clips de preview de 3–4 s** (≈300–500 KB) para hover/viewport.
- Ruta propia por caso (`/portfolio/huhtamaki`) → SEO + enlace compartible; el modal puede seguir siendo la vista rápida.

**Servicios**: principales vs. capacidades adicionales; imágenes solo de trabajos de esa línea (si no hay, sin foto o con un frame genérico de rodaje real).

**Estudio (Nosotros)**: hoy son 2 párrafos y 3 valores genéricos. Necesita fotos reales del equipo o de rodaje (backstage), quién está detrás y el equipo/técnica real. Sin material, mejor corto y honesto.

**Contacto**: 4 campos obligatorios (nombre, email, qué necesitas, mensaje) + opcionales plegados (fecha, presupuesto, pack); WhatsApp y email como alternativa visible; tracking del envío (`generate_lead`) si hay consentimiento.

**Móvil**: hero vertical propio (9:16), CTA fijo inferior discreto (Presupuesto · WhatsApp) que sustituye al botón flotante, casos en scroll vertical a pantalla completa (no carruseles horizontales), vídeos que solo se cargan cuando entran en viewport.

## 6. Plan de implementación

### P0 — hecho en esta rama (`claude/trusting-lovelace-4szsgf`)
- [x] Formulario: validación, honeypot, envío real vía Resend (API HTTP, sin SDK), **503 si no está configurado** (nunca un falso "ok") y fallback visible a email/WhatsApp; labels accesibles.
- [x] Portfolio: 12 fillers marcados `published: false` (no se borran) y filtrados en toda la web.
- [x] Rueda "+30 clientes" y reseñas inventadas: solo se muestran si hay clientes con `verified: true` / reseñas con `verified: true`.
- [x] Stat 7 → 10; Huhtamaki; póster de "Proyecto cliente".
- [x] `lang` por idioma; páginas estáticas; 404 con marca.
- [x] Redirección de rutas cruzadas de idioma; hreflang correcto + x-default; selector de idioma a la página equivalente.
- [x] `NEXT_PUBLIC_SITE_URL` para el canonical por entorno; `.env.example`.
- [x] Grid IG sin huecos.

### P0 — pendiente de decisión o material
- [ ] Hero: estado inicial visible + intro por tiempo + vídeo web ligero (§5). **Requiere tu OK creativo.**
- [ ] Email oficial (`info@24shoots.es` vs `hola@24shootsmedia.com`) y dominio.
- [ ] Configurar `RESEND_API_KEY` / `CONTACT_FROM_EMAIL` (dominio verificado) en Vercel.
- [ ] Datos legales reales; decidir si se publica el NIF.
- [ ] Logo vectorial original.

### P1
- Nueva home de 6 bloques; portfolio con pósters y previews reales; servicios principales/adicionales.
- Copy B2B (title, description, H1, marquee, FAQ) sin bodas/dron en posiciones principales.
- OG image, favicon, `apple-touch-icon`; H1 en interiores (hoy solo la home y las fichas de servicio lo tienen).
- Vídeos: versión web sin audio y con keyframes cortos para previews; `preload="none"` + carga en viewport; posters AVIF/WebP.
- Rutas por caso (`/portfolio/[slug]`) + `VideoObject` schema.
- Limpieza del repo: sacar `public/imagenes_insta` (186 MB) y `backups/` del deploy.

### P2
- Turnstile (Cloudflare) o rate-limit en el formulario si aparece spam.
- Tracking de eventos (CTA, WhatsApp, envío) con consentimiento.
- ESLint, borrar componentes sin uso, test E2E mínimo (Playwright) de rutas y formulario.
- Evaluar servir vídeo desde R2/Stream o Blob en lugar de `public/`.

## 7. Herramientas evaluadas

- **Playwright** (preinstalado): capturas desktop/móvil, mediciones de bytes y QA de formulario → usado.
- **ffmpeg** (estático vía `imageio-ffmpeg`): análisis de vídeos; servirá para pósters, loops y previews.
- Plugins disponibles en el directorio de Anthropic: **frontend-design**, **Web Vitals Auditor** (Lighthouse/CWV) y **Design** (crítica y accesibilidad). Recomendado activar los dos primeros para la fase P1.
- **Lovable**: útil para explorar variantes rápidas del hero y de la home antes de implementarlas aquí; no para producción (cambiaría el stack).
- **Vercel MCP**: previews y logs; nada de lo implementado depende de Vercel.
- No hace falta ninguna librería de animación (GSAP/Framer): la intro del logo y las previews se resuelven con CSS + `IntersectionObserver`.

Referencias: Awwwards "Fullscreen case studies" (Noxediem), "Wanda — Video production company", colección "Portfolio"; web.dev "Video performance"; "Improving LCP for video hero components" (A. Grogg, 2026).
