# slides-app — generador de presentaciones Banco de Bogotá

Genera presentaciones on-brand y las exporta a **PDF**, **HTML autocontenido**, **Figma Design** y (pendiente) **PPTX editable**, usando el design system Sherpa de `base/`. Se editan con formulario; el `.md` es el formato de almacenamiento y la fuente de verdad.

## Índice

| Doc | Qué contiene |
|---|---|
| [../design.md](../design.md) | **El sistema de diseño**: color, tipografía, retícula, catálogos y reglas de marca |
| Este archivo | Arquitectura, decisiones, stack y cómo se corre |
| [01-formato-deck.md](01-formato-deck.md) | Cómo se escribe un deck y el catálogo de layouts |
| [02-design-system-slides.md](02-design-system-slides.md) | Canvas, retícula, escala tipográfica de slides y uso de assets |
| [03-exportadores.md](03-exportadores.md) | Los cuatro exportadores: PDF, HTML, Figma y PPTX |
| [04-roadmap.md](04-roadmap.md) | Fases de implementación y qué se deja fuera |

---

## Decisiones

Tomadas antes de escribir código, para no descubrirlas a mitad:

| Decisión | Elegido | Por qué |
|---|---|---|
| **Autoría** | Formulario por diapositiva sobre archivos `.md` en `decks/` | El `.md` es versionable en git, diffeable y generable por un agente. El formulario evita escribirlo a mano — ver fase 1.7. |
| **PPTX** | Editable nativo (formas y texto reales) | El destinatario tiene que poder ajustar el deck en PowerPoint. Obliga a layouts fijos — ver abajo. |
| **Figma** | Archivo Figma **Design** (frames 1920×1080), no Figma Slides | El diseñador retoca en el entorno que ya usa, con la librería del banco a mano. Se genera con el MCP de Figma (`use_figma`). |
| **Design system** | El que ya existe en `base/` | 189 tokens, Kiffo BdB en 6 pesos, logos y previews. No se reconstruye nada. |
| **Orden de entrega** | Creador/visor → Figma → PPTX | El visor es lo que valida el sistema de diseño; sin él los exportadores son a ciegas. |
| **Salida HTML** | Un `.html` autocontenido | Se entrega y se abre sin servidor, sin red y sin este proyecto al lado. |
| **React + Vite** | Adoptados en la fase 1.5 | La fase 1 se hizo con cero dependencias. Se migró cuando el destino lo justificó: editor visual sobre la diapositiva. `src/core/` no cambió ni una línea. |

## La restricción que define la arquitectura

PPTX editable y Figma Design **no aceptan HTML arbitrario**. Un PPTX editable son cajas de texto y formas posicionadas; un frame de Figma son nodos con `x`, `y`, `width`, `height`. Ninguno de los dos puede "renderizar un div con flexbox".

Por lo tanto: **un slide no es HTML libre, es una instancia de un layout con geometría conocida en píxeles.** Ese es el contrato. Todo lo demás sale de ahí.

Consecuencia práctica: el contenido **sí** es armable — un layout define regiones y tú metes componentes dentro — pero los componentes **se apilan**, no se posicionan a mano. Cada uno sabe medirse con un ancho dado y la región los apila.

Si hace falta una disposición que ningún layout cubre, se **agrega un layout**. Son ~15 líneas.

## Cómo se corre

```bash
npm install
npm start          # Vite en http://localhost:5173
npm test           # valida el parser, el lint y que nada se salga del canvas
npm run tokens     # regenera src/core/tokens.js si cambia base/colors_and_type.css
npm run sync-assets   # trae los 532 iconos y logos de sherpa-assets a assets/
```

`base/` **no está versionado** (lleva tipografía propietaria del banco) — ver el README de la raíz.

`base/` y `assets/` se sirven desde la raíz del proyecto en dev (`publicDir: false` en `vite.config.js`), así los `url("fonts/…")` relativos de `base/colors_and_type.css` siguen resolviendo solos.

## Pipeline

```
decks/mi-deck.md
      │
      ▼  parse.js
   Deck IR          ← { meta, slides: [{ layout, tag, titulo, items, ... }] }
      │
      ▼  layouts.js  ← geometría: cada slide se vuelve una lista plana de cajas
   { bg, boxes: [{kind, x, y, w, h, ...}] }
      │
      ├──▶ ui/Deck.jsx      ──▶ creador/visor ──▶ Cmd+P ──▶ PDF
      ├──▶ export/html.jsx  ──▶ un .html autocontenido (fuentes y assets embebidos)
      ├──▶ tools/figma/     ──▶ MCP use_figma ──▶ una página de Figma Design
      └──▶ export/pptx.js   ──▶ pptxgenjs ──▶ .pptx editable
```

**Ningún renderer reinterpreta el Markdown ni recalcula geometría** — solo dibujan cajas. Un cambio de padding se aplica a los cuatro a la vez o no se aplica a ninguno.

Todo lo que está en `src/core/` es **lógica pura sin DOM**: corre igual en el navegador y en node, y por eso `node test.js` no necesita ni runner ni jsdom. Es también lo que hizo barata la migración a React: `core/` no cambió ni una línea.

## Estructura de archivos

```
slides-app/
├── index.html               ← entry de Vite
├── vite.config.js           ← plugin react + endpoint de subida a decks/img/
├── base/                    ← design system BdB (existente — no se toca)
├── decks/
│   ├── plantilla.md         ← la plantilla: ejercita los 9 layouts
│   └── img/placeholder.svg
├── assets/                  ← sherpa-assets: 532 iconos y 20 logos (npm run sync-assets)
├── scripts/build-tokens.js  ← base/colors_and_type.css → src/core/tokens.js
├── src/
│   ├── main.jsx
│   ├── core/                ← PURO, sin DOM, corre en node y en el navegador
│   │   ├── tokens.js        ← GENERADO — 189 tokens con los var() resueltos
│   │   ├── inline.js        ← **negrita** → runs
│   │   ├── geometria.js     ← canvas, retícula y escala tipográfica
│   │   ├── componentes.js   ← los 6 componentes: saben medirse y pintarse
│   │   ├── layouts.js       ← los 7 layouts: fondo, cabecera y regiones
│   │   └── parse.js         ← .md → Deck IR + lint de voz Sherpa
│   ├── ui/
│   │   ├── App.jsx          ← estado: markdown, slide actual, presentación
│   │   ├── Editor.jsx       ← panel izquierdo: barra, ajustes del deck y lista
│   │   ├── Deck.jsx         ← cajas → JSX
│   │   ├── IconPicker.jsx   ← modal de los 532 iconos
│   │   ├── ListaSlides.jsx  ← miniaturas: navegar, arrastrar, duplicar, borrar
│   │   ├── SlideForm.jsx    ← formulario de la diapositiva seleccionada
│   │   ├── campos.js        ← campos ↔ bloque de Markdown: función PURA
│   │   ├── md.js            ← edición del deck: funciones PURAS sobre strings
│   │   └── iconos.js        ← búsqueda en el catálogo: función PURA
│   └── export/
│       ├── html.jsx         ← deck → .html autocontenido
│       └── pptx.js          ← (fase 3)
├── tools/figma/             ← deck → una página de Figma (npm run figma)
├── test.js
└── docs/
```

## Dependencias

React + Vite. Se adoptaron cuando el destino del proyecto lo justificó — editor visual sobre la diapositiva — no antes: la fase 1 se construyó entera con cero dependencias.

| Paquete | Para qué |
|---|---|
| `react`, `react-dom` | La UI del creador y, más adelante, el editor visual |
| `vite`, `@vitejs/plugin-react` | Dev server y transformación de JSX |
| `pptxgenjs` | (fase 3) generar el `.pptx` |

Lo que se sigue **sin** usar, y por qué:

- **Sin librería de Markdown.** Un parser de Markdown produce HTML, y PPTX y Figma no consumen HTML — necesitan *runs* de texto (`[{t, b}]`). Se soporta solo `**negrita**` con un splitter de 3 líneas en `core/inline.js`, compartido por todos los renderers. Menos código y además correcto para los cuatro destinos.
- **Sin librería de YAML.** El frontmatter del deck es un mapa plano `clave: valor` — 4 líneas de regex. Si algún día necesita listas o anidamiento, ahí sí entra `yaml`.
- **Sin Puppeteer.** El HTML lleva `@page { size: 1920px 1080px; margin: 0 }`, así que Cmd+P desde cualquier navegador produce el PDF exacto.
- **Sin kit de UI** (MUI, shadcn, Chakra). El proyecto ya tiene design system propio: meter otro sería pelear contra Sherpa en cada componente.
- **Sin CodeMirror.** Se consideró para pintar los `[categoria/icono]` como widgets inline, pero no resolvía el otro problema — la falta de espacio. El formulario por campos resuelve los dos sin dependencia.

## Lo que NO se construye

- **Arrastre libre de cajas.** El editor visual de la fase 5 editará contenido y elección de layout, no geometría. Soltar la geometría rompe el contrato que hace posibles PPTX y Figma.
- **Backend.** Todo corre local contra archivos en git. El dev server de Vite solo añade el endpoint de subida de imágenes, sin auth y solo en dev.
- **Motor de temas configurable.** Hay un tema (Sherpa) con dos variantes: claro y oscuro (`--bg-inverse`). Un tercer tema se agrega el día que exista un tercer tema.
- **Animaciones y transiciones.** No sobreviven a PDF ni a Figma, y en PPTX serían un renderer más.
