# Referencia: trade-ledger-report

```yaml
source:
  repository: SlideSpeak/slide-design-skill
  license: MIT
  path: examples/trade-ledger-report.html
  fetched: 2026-08-20
register_general: editorial de prensa/newsletter — masthead serif, cuerpo en
  dos columnas, drop-cap, acento burdeos oscuro. El registro más distinto de
  los cinco: se lee como un boletín impreso, no como slides de negocio.
```

9 secciones, las 9 se aceptan por composición. Es la fuente más útil para el
registro "ejecutivo editorial" en su expresión más seria — el que Sherpa
llamaría "autoridad tranquila".

| # | `data-slide-type` | Intent Sherpa | Verdicto | Nota |
|---|---|---|---|---|
| 01 | front-page | **`masthead-cover`** (variante nueva) | Aceptar | Ver ficha abajo |
| 02 | lead | `problem-evidence` | Aceptar | Dos columnas de cuerpo + callout box con borde a la derecha — variante editorial de `dos-columnas` |
| 03 | dispatch | `executive-summary` (variante) | Aceptar | 4 ítems en grid 2×2, cada uno con lead-in en negrita — misma familia que executive-summary pero sin numerar |
| 04 | indicator | `kpi-hero` | Aceptar | 6ª validación independiente: cifra enorme izquierda + texto con filete a la derecha |
| 05 | chart-story | `drivers` | Aceptar | Barras divergentes (positivas en burdeos, negativas en gris) + columna "qué significa" a la derecha |
| 06 | agate | `business-table` | Aceptar | Tabla densa de 5 filas × 4 columnas, sin fondo, numeración alineada a la derecha |
| 07 | trendline | `trend` | Aceptar | Área con anotación de pico — título declara el hallazgo, no "Tendencia" |
| 08 | pull | `cita` | Aceptar | Cita grande en caja con borde completo fino — variante de la barra izquierda que ya tiene `cita` en la Fase A |
| 09 | colophon | `decision-ask` | Aceptar | Cierre-masthead con la recomendación como remate |

## 01 · front-page → `masthead-cover` (variante de registro nueva)

```yaml
id: trade-ledger-report-01
intent: masthead-cover   # variante de cover-editorial con identidad de boletín
register: ejecutivo editorial (expresión "newsletter")
content: { title_chars: 58, body_words: 90 }
media: { kind: none }
composition:
  focal_point: masthead centrado ("The Trade Ledger") + regla doble
  hierarchy: metadata (número de edición, sección) → masthead → titular serif
    grande → lead en dos columnas con drop-cap
  asymmetry: low
  density: medium (la portada ya lleva texto, no solo título)
  surface: light
  distinctive_device: masthead tipográfico como ancla de marca en vez de logo
    — funciona porque el "logo" es la tipografía misma
fit: { sherpa: medio, business: alto }
use_when: [reporte periódico — trimestral, mensual — con identidad de serie]
avoid_when: [pitch o decisión puntual, sin cadencia de "edición"]
```

**Nota:** esta variante no encaja directamente en el `cover` institucional de
Sherpa (que lleva el logo del banco a sangre), pero sí es un candidato fuerte
para un registro "reporte trimestral" si el banco publica series recurrentes
— coincide con el segundo de los tres decks patrón que pide
`docs/06-plan-producto-premium.md` ("Reporte trimestral de resultados").

## 08 · pull → variante de `cita`

```yaml
id: trade-ledger-report-08
intent: cita
register: ejecutivo editorial
content: { body_words: 35 }
media: { kind: none }
composition:
  focal_point: cita entre comillas tipográficas, serif grande
  hierarchy: eyebrow "Leader / Comment" → cita → atribución en monospace
  asymmetry: low
  density: low
  surface: light
  distinctive_device: caja con borde completo de 1px (no solo la barra
    izquierda que usa `cita` en la Fase A) — variante de la misma familia
fit: { sherpa: alto, business: alto }
use_when: [cita de una sola voz, con peso editorial]
avoid_when: [—]
```

Confirma que la barra izquierda de `cita` (Fase A) es una variante válida
dentro de una familia más amplia de "cita enmarcada"; no contradice el
rediseño, lo sitúa como una interpretación Sherpa de un patrón real.
