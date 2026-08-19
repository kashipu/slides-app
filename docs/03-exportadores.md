# Exportadores

Los cuatro consumen las mismas cajas que compone `layouts.js`. Ninguno reinterpreta el Markdown ni recalcula geometría.

Orden de entrega: **PDF** (hecho) → **HTML autocontenido** (hecho) → **Figma** → **PPTX**.

## Cómo se resuelve la altura del texto

PPTX y Figma necesitan alturas **cerradas** en píxeles; no hay motor de layout que las calcule. Y no queremos arrastrar un navegador headless solo para medir.

Solución: **slots de posición fija + estimador de líneas.**

```js
// ponytail: estimación por ancho medio de carácter, no métricas reales de la fuente.
// Sobra con slots generosos + el lint de longitud. Si algún día se desborda,
// el upgrade es medir con Canvas measureText en la preview y cachear.
const AVG = { display: 0.45, body: 0.50 };   // ancho medio de carácter / tamaño de fuente
export const alto = (texto, { size, font, lh }, w) =>
  Math.max(1, Math.ceil((texto.length * size * AVG[font]) / w)) * size * lh;
```

El estimador se llama **una vez, al componer el slide** en `layouts.js`. Las cajas salen con `y` y `h` resueltos y los renderers solo posicionan. El margen de error es de ~1 línea, absorbido por slots holgados y por el lint de longitud de [01-formato-deck.md](01-formato-deck.md), y `test.js` verifica que ninguna caja se salga del canvas.

Los coeficientes `AVG` son la perilla de calibración: si Kiffo resulta más estrecha de lo estimado, se ajusta el número y los cuatro exports se corrigen juntos.

**Ya calibrado contra medición real:** Kiffo BdB a 120 px da 0.41 y Roboto a 32 px da 0.48. Los valores en el código son `display: 0.45` y `body: 0.50` — se deja margen al alza a propósito, porque quedarse corto solapa cajas y pasarse solo reserva aire de más.

---

## 1. HTML → PDF

El más simple y la referencia visual de los otros tres.

**Salida:** el creador/visor (`src/ui/Deck.jsx`). Un `<section class="slide">` por slide, con cada caja en un `div` de `position:absolute` y todos los estilos inline. Nada de clases CSS por layout: la geometría manda.

Los iconos se pintan con `mask-image` + `background`, no con `<img>`: los SVG de Sherpa traen `fill="black"` fijo, y la máscara los recolorea sin fetch, sin async y sin tocar el archivo original.

```css
@page { size: 1920px 1080px; margin: 0 }
.slide { position: relative; width: 1920px; height: 1080px; overflow: hidden;
         break-after: page; }
@media screen { .slide { margin: 0 auto 40px; box-shadow: var(--shadow-lg) } }
```

**PDF:** Cmd+P desde el navegador → "Guardar como PDF", sin márgenes y con "Gráficos de fondo" activado. Sale a escala exacta.

Para CI se agrega después `puppeteer-core` apuntando al Chrome ya instalado (`executablePath`), sin descargar Chromium:

```js
await page.pdf({ path:'out/deck.pdf', width:'1920px', height:'1080px', printBackground:true });
```

En el creador, las fuentes vienen de `base/colors_and_type.css` por ruta relativa. La versión embebida es el exportador siguiente.

---

## 2. HTML autocontenido

`src/export/html.jsx` → un único `.html` que se abre sin servidor, sin red y sin este proyecto al lado. Es el formato de entrega cuando el destinatario no necesita editar.

El markup sale de `renderToStaticMarkup(<Deck/>)` — el mismo componente que ves en pantalla, así que no hay forma de que el export se desincronice de la preview.

Qué se embebe como data-URI:

| Recurso | De dónde | Nota |
|---|---|---|
| Kiffo BdB (Light, Regular, Medium, SemiBold) | `base/fonts/*.otf` | Los 4 pesos que usa la escala tipográfica, no los 6 |
| Roboto (400/500/700) | Google Fonts | Solo el subset **latino** — ya cubre acentos y ñ. Google sirve ~8 subsets por peso; filtrarlos baja de 24 archivos a 3 y el export de decenas de segundos a ~200 ms |
| Logos, isotipo, imágenes | `base/assets/`, `decks/img/` | Un solo barrido de regex sobre el markup |
| Iconos | `assets/iconos/` | Mismo barrido: captura tanto `src="…"` como el `url(…)` de las máscaras |

Toda descarga remota lleva `AbortSignal.timeout(8000)`: sin él, exportar sin conexión se cuelga para siempre en vez de degradar a la sans del sistema.

El documento resultante lleva las mismas reglas de `@page`, así que también imprime a PDF exacto, y un script de 3 líneas ajusta el `zoom` al ancho de la ventana.

Medido sobre un deck con 3 iconos: **449 KB, 898 ms, 0 referencias remotas**, con las 6 máscaras de icono embebidas.

Como `Deck.jsx` pone **todos los estilos inline en cada caja**, el archivo exportado no necesita arrastrar el CSS del design system: solo las `@font-face` y cuatro reglas de página.

---

## 3. Figma Design

Archivo de **Figma Design** con un frame de 1920×1080 por slide, no Figma Slides. Se escribe con el MCP de Figma.

### Flujo

1. **Crear el archivo** — skill `/figma-create-new-file` y luego `create_new_file` (`editorType: design`). La skill es prerrequisito obligatorio del tool.
2. **Cargar la skill de escritura** — `/figma-use` es prerrequisito obligatorio de **cada** llamada a `use_figma`. Saltársela produce fallos difíciles de depurar.
3. **Verificar fuentes primero.** Antes de escribir nada, listar las fuentes disponibles y comprobar `Kiffo BdB`. Si no está, avisar y caer a Roboto — no fallar a mitad del deck con 12 frames a medio construir.
4. **Escribir por lotes**, un `use_figma` por slide o por grupo de slides. Un solo script gigante es más difícil de reintentar cuando algo falla.

### Generación de nodos

`render-figma.js` no habla con Figma: emite el **script de Plugin API** que el MCP ejecuta. Esquema por slide:

```js
const f = figma.createFrame();
f.name = `${n}. ${titulo}`;
f.resize(1920, 1080);
f.x = (n - 1) * 2120;             // 1920 + 200 de separación, en una fila
f.fills = [{ type: 'SOLID', color: hexToRgb(tokens.bgInverse) }];

const t = figma.createText();
await figma.loadFontAsync({ family: 'Kiffo BdB', style: 'Medium' });
t.fontName = { family: 'Kiffo BdB', style: 'Medium' };
t.characters = runs.map(r => r.t).join('');
t.fontSize = 64;
// negrita por rango, a partir de los offsets de los runs:
t.setRangeFontName(ini, fin, { family: 'Kiffo BdB', style: 'SemiBold' });
t.x = slot.x; t.y = slot.y; t.resize(slot.w, t.height);
f.appendChild(t);
```

Puntos concretos:

- **Iconos y logos sí funcionan**: `figma.createNodeFromSvg(svgString)` importa el SVG como vectores editables. Figma es el único de los tres destinos donde los SVG entran sin rasterizar.
- **Auto Layout en el bloque de contenido** (tag + título + cuerpo/items) con `layoutMode:'VERTICAL'` e `itemSpacing` del gap del layout. El frame mantiene posición absoluta, pero el interior refluye cuando el diseñador edita un texto. Es la diferencia entre un archivo que se puede trabajar y uno que se pelea.
- **`loadFontAsync` antes de tocar `characters` o `fontSize`**, siempre. Es la causa número uno de fallos del Plugin API.
- **Variables de Figma**: los tokens de color se crean una vez como variables locales (`figma.variables.createVariable`) y los fills se bindean a ellas. Así el diseñador cambia el azul en un sitio. Vale las ~30 líneas.

### Fuera de alcance

- **Librería de componentes publicada** en Figma. Es la otra mitad del problema (que el diseñador arme decks a mano en Figma instanciando componentes). Si se necesita, la skill `/figma-generate-library` cubre ese camino y el sistema de layouts de aquí es la especificación exacta de qué componentes crear.
- **Round-trip Figma → Markdown.** Leer de vuelta lo que el diseñador cambió y regenerar el `.md` es un problema distinto y más difícil. El flujo es de una vía: el `.md` es la fuente, Figma es la entrega.

---

## 4. PPTX editable

`pptxgenjs`. Cada slide sale con cajas de texto y formas reales, editables en PowerPoint y Keynote.

### Conversión de unidades

```
pulgadas = px / 144        (1920 px = 13.333 in)
puntos   = px / 2          (144 dpi → 72 pt/in)
```

La escala tipográfica cae en valores redondos: título 64 px = **32 pt**, cuerpo 32 px = **16 pt**, caption 20 px = **10 pt**, cifra 96 px = **48 pt**. Ningún redondeo.

### Estructura

```js
const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'BDB169', width: 13.333, height: 7.5 });
pptx.layout = 'BDB169';

// Dos masters: claro y oscuro. Llevan el fondo, el isotipo y el pie.
pptx.defineSlideMaster({
  title: 'BDB_CLARO',
  background: { color: 'FFFFFF' },
  objects: [{ image: { path: 'assets-png/isotipo.png', x: 12.33, y: 0.67, w: 0.22, h: 0.22 } }],
  slideNumber: { x: 12.33, y: 6.67, fontFace: 'Roboto', fontSize: 8, color: '808080', align: 'right' },
});
pptx.defineSlideMaster({ title: 'BDB_OSCURO', background: { color: '0043A9' } });
```

Los runs del IR mapean 1:1 al formato de `addText`:

```js
slide.addText(
  slot.runs.map(r => ({ text: r.t, options: { bold: r.b } })),
  { x: slot.x/144, y: slot.y/144, w: slot.w/144, h: slot.h/144,
    fontFace: 'Kiffo BdB', fontSize: slot.size/2, color: tokens.fgDefault.slice(1),
    lineSpacingMultiple: slot.lh, valign: 'top', margin: 0 }
);
```

Detalles que muerden:

- Los colores van **sin `#`** (`'0043A9'`).
- `margin: 0` en cada `addText`, si no PowerPoint mete su padding y desalinea contra el PDF.
- Bullets: `bullet: { code: '2022' }` en las opciones, no glifos escritos a mano.
- `valign: 'top'` siempre; el centrado se hace con la geometría, no con el motor de PowerPoint.

### Gaps conocidos del PPTX

| Gap | Estado |
|---|---|
| **Iconos** | pptxgenjs no acepta SVG. Fase 1: los layouts con icono lo **omiten en PPTX** y avisan por consola. Fase 2: script de rasterizado bajo demanda a `assets-png/`, cacheado. |
| **Logos** | Se comprometen 5 PNG @2x en `assets-png/` (horizontal, vertical, isotipo, y sus variantes dark). Son 5 archivos que no cambian nunca; rasterizarlos en build no vale el aparato. |
| **Kiffo BdB** | Depende de que esté instalada en la máquina que abre el archivo. Ver [02-design-system-slides.md](02-design-system-slides.md#tipografía-la-restricción-real). |
| **Imágenes a sangre** | Sí funcionan (`addImage` con `sizing:{type:'cover'}`), pero deben ser JPG/PNG locales. |

---
