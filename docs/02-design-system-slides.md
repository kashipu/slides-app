# Design system aplicado a slides

El sistema base ya existe en [`base/colors_and_type.css`](../base/colors_and_type.css) — 189 tokens verificados contra el Sherpa Design System real. **No se redefine nada de ahí.** Este doc solo agrega la capa que el sistema web no cubre: el canvas de presentación.

## Canvas

**1920 × 1080 px.** Es la unidad universal del proyecto:

| Destino | Conversión |
|---|---|
| HTML / PDF | 1:1 (`@page { size: 1920px 1080px; margin: 0 }`) |
| PPTX | 13.333 × 7.5 in → **exactamente 144 px por pulgada**. `px / 144 = pulgadas`, sin redondeo raro. |
| Figma | 1:1, frames de 1920×1080 |

Que los tres coincidan sin factores fraccionarios es la razón de elegir 1920 y no 1280.

## Retícula

```
112 │ 12 columnas de 112px, gutter de 32px │ 112
    │◄──────────── 1696 px ───────────────►│
```

`112 + (12 × 112) + (11 × 32) + 112 = 1920` ✓

- **Margen horizontal:** 112 px
- **Margen vertical:** 96 px → alto de contenido 888 px
- **Columna:** 112 px · **Gutter:** 32 px
- Anchos útiles: 6 col = **832**, 8 col = **1120**, 10 col = **1424**, 12 col = **1696**

Todos son múltiplos de 8, coherentes con la escala `--s-*` de Sherpa (`spacing.md`).

> Los tokens `--slide-pad-x: 96px` / `--slide-pad-y: 80px` que ya existen en `colors_and_type.css` fueron dimensionados para un canvas menor. Para el canvas de 1920 se usan 112 / 96.

## Escala tipográfica de slides

La escala de Sherpa (`--text-h1: 56px`) está calibrada para lectura a 50 cm en un navegador. Un slide se lee a 3–8 metros en una sala. Se necesita una escala propia, **derivada** de la de Sherpa (mismos saltos, factor ≈1.6):

| Token slide | px | Familia / peso | Uso |
|---|---|---|---|
| `--sl-display` | 120 | Kiffo BdB Medium | Título de portada |
| `--sl-h1` | 88 | Kiffo BdB Medium | Título de sección |
| `--sl-h2` | 64 | Kiffo BdB Medium | Título de slide |
| `--sl-h3` | 40 | Kiffo BdB Medium | Subtítulo, título de columna |
| `--sl-stat` | 96 | Kiffo BdB SemiBold | Cifra en layout `stats` |
| `--sl-quote` | 56 | Kiffo BdB Light | Cita |
| `--sl-body-l` | 32 | Roboto Regular | Cuerpo, bullets |
| `--sl-body` | 28 | Roboto Regular | Cuerpo denso, columnas |
| `--sl-tag` | 24 | Roboto SemiBold, tracking `0.1rem` | Kicker sobre el título |
| `--sl-caption` | 20 | Roboto Regular | Pie de imagen, meta |
| `--sl-footer` | 16 | Roboto Regular | Número de slide |

**Piso de legibilidad: 20 px.** Nada por debajo en un slide — si el contenido no cabe a 20 px, el contenido sobra, no la tipografía.

> **Nota de la Fase A (20 de agosto de 2026):** la implementación real
> (`TYPE` en [`src/core/geometria.js`](../src/core/geometria.js)) sumó tres
> pasos por encima de `display`: `displayXL` (160px, titular de afirmación),
> `statHero` (240px, cifra protagonista de un `stats` con un solo item) y
> `numero` (200px, número gigante del layout `section`); `quote` subió de 56
> a 64px. Están documentados con detalle en la tabla "Escala de diapositiva"
> de [`../design.md`](../design.md), que es la fuente de verdad de esa
> escala. La tabla de arriba usa nombres `--sl-*` que ya no existen como
> variables CSS — la escala vive hoy como el objeto `TYPE` en
> `src/core/geometria.js` — y `Kiffo BdB` debería decir `Kiffo BDB`
> (corregido en `design.md`, sección «Estado de aplicación»). Reconciliar
> este documento con la implementación actual es trabajo aparte, fuera del
> alcance de la Fase A.

Interlínea: `1.25` en títulos (`--leading-tight`), `1.5` en cuerpo (`--leading-normal`). El `1.75` de Sherpa para párrafo web es demasiado aire en un slide.

Las dos familias mantienen el reparto de Sherpa (`typography.md`): **Kiffo BdB** para títulos y cifras, **Roboto** para todo el cuerpo.

## Color en slides

Se usan los roles semánticos, nunca los hex directos:

| Superficie | Token | Layouts |
|---|---|---|
| Slide claro | `--bg-canvas` (blanco) | `title-body`, `bullets`, `two-cols`, `stats` |
| Slide claro alterno | `--bg-subtle` (`--midnight-50`) | `quote`, `stats` |
| Slide oscuro institucional | `--bg-inverse` (`--midnight-800`) | `cover`, `section`, `closing` |

Reglas heredadas de Sherpa que aplican tal cual:

- **`--midnight-800` es el azul de superficie oscura**, no `--midnight-900` (ese es el estado hover).
- **La paleta extendida** (Bluey, Khaki, Mustard, Peach, Rose, Mauve) es para categorizar producto — gráficas, badges de categoría. Nunca como color principal de un slide.
- **`--brand-yellow` (`#FFBE00`)** solo como acento del `tag` en slides de sección. No es color de fondo.
- **Imagen nunca sobre el azul profundo** — enturbia. Va sobre blanco o `--bg-subtle`.
- **Fotografía**: personas reales, cálida-natural, sin duotono, sin filtros pesados, sin blanco y negro.

Contraste: `--fg-default` sobre `--bg-canvas` es negro sobre blanco (21:1). `--fg-on-dark` sobre `--bg-inverse` es blanco sobre `#0043A9` (8.3:1). Ambos pasan AAA. Las variantes `--fg-on-dark-subtle` (78%) y `-faint` (62%) bajan a ~6.5:1 y ~5.1:1 — siguen sobre AA, pero solo para metadatos, nunca para contenido.

## Assets

Vienen de [`diseno-exp/sherpa-assets`](https://github.com/diseno-exp/sherpa-assets) — 579 archivos.

| Carpeta | Contenido |
|---|---|
| `logos/` | 20 SVG: `bdb-{aval,horizontal,vertical,isotipo,tipografico}` × `{—,-solido}` × `{—,-dark}` |
| `iconos/` | ~510 SVG en 16 categorías: `esenciales` (71), `finanzas` (73), `marcas` (74), `navegacion` (55), `productos` (39), `naturaleza` (34), `transporte` (25), `vivienda`, `personas`, `autenticacion`, `accesibilidad` (19 c/u), `salud-y-seguros` (18), `dispositivos` (17), `compras` (15), `redes-sociales` (8), `semanticos` (6) |
| `fuentes/kiffo-bdb/` | Kiffo BdB en `.woff2`, `.woff` y `.otf`, 6 pesos (100–600) |
| `legales/` | Sellos Fogafín y Superintendencia Financiera, claro y oscuro |
| `manifest.json` | Índice completo — se usa para validar referencias de icono en el parser |

### Sincronización

No submódulo, no dependencia. Un script en `package.json`:

```json
"sync-assets": "rm -rf assets && git clone --depth 1 https://github.com/diseno-exp/sherpa-assets.git assets && rm -rf assets/.git"
```

`assets/` va en `.gitignore`. El repo está además publicado en `https://diseno-exp.github.io/sherpa-assets/`, útil para la preview HTML, pero los exports necesitan los archivos locales.

### Referencias en el deck

- Icono: `<!-- layout: bullets, icono: finanzas/ahorro -->` → `assets/iconos/finanzas/ahorro.svg`. El parser valida contra `manifest.json` y falla con la lista de nombres parecidos si no existe.
- Logo: `logo: horizontal` en el frontmatter → `assets/logos/bdb-horizontal.svg`, o `-dark.svg` sobre superficie oscura.

Los iconos son SVG monocromos de 32×32 con `fill="none"` y `path` con `fill-rule` — se recolorean con `currentColor` en HTML. Para PPTX hay que rasterizarlos: ver [03-exportadores.md](03-exportadores.md).

## Tipografía: la restricción real

Kiffo BdB es una fuente **propietaria**. Esto se comporta distinto en cada destino y hay que decirlo antes de que sorprenda:

| Destino | Situación |
|---|---|
| **HTML / PDF** | Sin problema. Se embebe el `.woff2` (o el `.otf` de `base/fonts/`) y el PDF la incrusta. |
| **PPTX** | PowerPoint usa la fuente **instalada en la máquina de quien abre el archivo**. pptxgenjs no puede embeber fuentes (solo PowerPoint para Windows lo hace, al guardar). Audiencia interna del banco: la tienen. Audiencia externa: caerá al fallback. |
| **Figma** | Figma solo ve fuentes locales a través de la **app de escritorio**; en el navegador no existen. `figma.loadFontAsync({family:'Kiffo BdB', ...})` falla si no está instalada. |

**Qué se hace:**

1. El fallback declarado en todos los destinos es `Roboto` (ya está en el sistema, es la segunda familia oficial). Nunca Arial ni Helvetica.
2. Los `.otf` de `base/fonts/` se entregan junto al `.pptx` para audiencias externas que quieran instalar.
3. El generador de Figma verifica las fuentes disponibles antes de escribir y avisa si va a caer al fallback, en vez de fallar a medio camino.

## `tokens.js`

Los tres renderers necesitan los valores **resueltos** — PPTX y Figma no entienden `var(--midnight-800)`.

`src/tokens.js` se genera desde `base/colors_and_type.css` con un script: regex de `--nombre: valor`, resolución recursiva de los `var()`, salida a un objeto plano. ~25 líneas, se corre cuando cambia el CSS. La fuente de verdad sigue siendo el CSS del design system; `tokens.js` es un artefacto derivado y así se documenta en su cabecera.
