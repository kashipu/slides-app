# Referencia: cost-to-serve-teardown

```yaml
source:
  repository: SlideSpeak/slide-design-skill
  license: MIT
  path: examples/cost-to-serve-teardown.html
  fetched: 2026-08-20
register_general: data-led (consulting analítico) — blanco, negro, un solo
  acento rojo. Es la referencia más alineada con el Financial Times Visual
  Vocabulary que cita docs/05-corpus-visual-business.md.
```

11 secciones, las 11 se aceptan. Es la fuente con más gráficas reales del
corpus (waterfall, ranking, matriz, tabla) — cubre exactamente el hueco que
`04-roadmap.md` marca como pendiente: "No hay componente de gráfica en el
catálogo".

| # | `data-slide-type` | Intent Sherpa | Verdicto | Nota |
|---|---|---|---|---|
| 01 | cover | `cover-editorial` | Aceptar | Kicker monospace + título bold 64px, sin logo — variante seria de portada |
| 02 | index | **`agenda-index`** (nuevo) | Aceptar | Ver ficha abajo |
| 03 | verdict | `finding-evidence` | Aceptar | Titular con énfasis rojo inline + cifra en columna angosta a la derecha con regla vertical — mismo filete de `cita`/kpi-hero |
| 04 | bignumber | `kpi-hero` | Aceptar | Cifra serif negra enorme + unidad roja pequeña debajo — 4ª validación independiente del kpi-hero |
| 05 | bridge | `drivers` | Aceptar | Ver ficha abajo — waterfall real |
| 06 | breakdown | `breakdown` | Aceptar | Barras horizontales rankeadas + columna de anotación a la derecha, sin leyenda de color inventada |
| 07 | matrix | **`framework-2x2`** (nuevo) | Aceptar | Matriz impacto/esfuerzo — 2ª fuente independiente que usa este patrón (ver `consulting-northwind-06`) |
| 08 | ledger | `recommendation` | Aceptar | Lista numerada de 8 iniciativas con dueño y cifra, filas separadas por regla de 1px — sin tarjetas |
| 09 | datatable | `business-table` | Aceptar | Ver ficha abajo — valida la tabla de la Fase A |
| 10 | mandate | `kpi-hero` | Aceptar | Porcentaje enorme en rojo + frase de mandato con una palabra en rojo — 5ª validación del kpi-hero |
| 11 | closing | `decision-ask` | Aceptar | Misma familia que `consulting-northwind-08`: cierre claro, sin logo grande |

## 02 · index → `agenda-index` (composición nueva, candidata a taxonomía)

```yaml
id: cost-to-serve-teardown-02
intent: agenda-index   # NO existe hoy en docs/05-corpus-visual-business.md
register: data-led
content: { title_chars: 60, body_words: 40 }
media: { kind: none }
composition:
  focal_point: 4 números rojos grandes (01-04) alineados a la izquierda, cada
    uno con una pregunta de una línea a su derecha
  hierarchy: título-pregunta → lista numerada de preguntas que responde el deck
  asymmetry: low
  density: low
  surface: light
  distinctive_device: numeración como protagonista visual, regla horizontal
    fina separando cada fila
fit: { sherpa: alto, business: alto }
use_when: [slide 2 de un deck analítico largo, anticipa la estructura]
avoid_when: [el deck tiene menos de 6 slides — no hace falta agenda]
```

**Candidata nueva:** ni `executive-summary` ni `steps` cubren bien "estas son
las preguntas que respondo, en orden" — es agenda, no hallazgo ni proceso.
Vale la pena como composición propia en la Fase 3.

## 05 · bridge → `drivers` (waterfall real)

```yaml
id: cost-to-serve-teardown-05
intent: drivers
register: data-led
content: { title_chars: 48, series: 6 }
media: { kind: chart, chart_type: waterfall, canvas_share: 0.55 }
composition:
  focal_point: gráfica de cascada (4.18 → −0.31 → −0.22 → −0.19 → −0.06 → 3.40)
  hierarchy: título-conclusión → waterfall con etiqueta directa por barra →
    columna de anotación "cómo leer el puente" a la derecha
  asymmetry: medium
  density: medium
  surface: light
  distinctive_device: valores inicial/final en negro, deltas en rojo — el
    color codifica dirección, no categoría, y cada barra lleva su cifra encima
fit: { sherpa: alto, business: alto }
use_when: [descomponer una cifra en los factores que la explican]
avoid_when: [más de 6 factores — agrupar en "otros" antes]
```

**Capacidad requerida:** el waterfall/cascada es una de las "cinco familias de
gráficas de uso frecuente" que la Fase 4 del plan rector deja pendiente
(`docs/06-plan-producto-premium.md`). Esta referencia es el ejemplo concreto a
usar quimicamente al implementarlo — etiqueta directa obligatoria, sin eje
secundario, exactamente como exige la sección "Visualización de datos" de
`design.md`.

## 09 · datatable → `business-table`

```yaml
id: cost-to-serve-teardown-09
intent: business-table
register: data-led
content: { title_chars: 50, table_rows: 4, table_cols: 3 }
media: { kind: table }
composition:
  focal_point: tabla "Initiative scorecard" — 4 filas × 3 columnas de dinero
  hierarchy: título-conclusión → tabla con encabezado en texto normal (no
    fondo de color) → regla de 1-2px bajo cada fila
  asymmetry: low
  density: medium
  surface: light
  distinctive_device: cifras alineadas a la derecha por magnitud, sin celdas
    de color ni radio — jerarquía por alineación, exactamente el tratamiento
    de `tabla` en la Fase A
fit: { sherpa: alto, business: alto }
use_when: [comparar pocas filas de cifras financieras entre sí]
avoid_when: [más de 6-8 filas — partir en dos tablas o resumir]
```

**Validación directa de la Fase A:** confirma punto por punto el rediseño de
`tabla` en `src/core/componentes.js` (regla de acento bajo el encabezado,
filete de 1px entre filas, alineación numérica a la derecha, cero celdas con
fondo). No hay divergencia que corregir.
