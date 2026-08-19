# Roadmap

Cada fase termina en algo que se puede usar. Nada de "infraestructura" que no produce un deck.

## Fase 1 — Creador, visor y sistema de diseño ✅

**Entregable:** `npm start` abre el creador. Escribes Markdown a la izquierda, ves los slides on-brand a la derecha, presentas a pantalla completa y exportas a PDF y a HTML autocontenido.

- [x] `scripts/build-tokens.js` → `src/core/tokens.js` — 189 tokens con los `var()` resueltos
- [x] `src/core/layouts.js` — canvas 1920×1080, retícula 12×112, escala tipográfica y los 9 layouts
- [x] `src/core/inline.js` — `**negrita**` → runs
- [x] `src/core/parse.js` — `.md` → Deck IR con estimador de altura y lint de voz Sherpa
- [x] `src/render-html.js` — cajas → DOM *(luego `src/ui/Deck.jsx`)*
- [x] `index.html` — editor en vivo, modo presentación (flechas / Esc), PDF, HTML
- [x] `src/export/html.jsx` — `.html` autocontenido con fuentes y assets en data-URI
- [x] `decks/plantilla.md` — la plantilla, ejercita los 9 layouts
- [x] `test.js` — `node test.js` → 11 slides, 9 layouts, 71 cajas, 0 avisos

**Check:** el test valida que los 9 layouts parseen, que la plantilla no dispare avisos de estilo, y que **ninguna caja se salga del canvas** en ningún slide. Sin framework.

**Calibrado:** el estimador de ancho de carácter se ajustó midiendo Kiffo BdB a 120 px y Roboto a 32 px renderizados de verdad. Es la perilla documentada en [03-exportadores.md](03-exportadores.md).

## Fase 1.5 — Migración a React + Vite ✅

Se adoptó framework cuando el destino lo justificó: **más layouts, mejor editor de Markdown y un editor visual sobre la diapositiva**. Ese tercero es el disparador — selección, arrastre, deshacer/rehacer y decenas de piezas de estado. Migrar con ~400 líneas de UI costó una fracción de lo que habría costado después.

- [x] `src/core/` — `tokens`, `inline`, `layouts`, `parse` movidos **sin cambiar una línea**
- [x] `src/ui/` — `App.jsx`, `Editor.jsx`, `Deck.jsx` (cajas → JSX)
- [x] `src/export/html.jsx` — pasa a `renderToStaticMarkup(<Deck/>)`
- [x] Iconos de sherpa-assets: sintaxis `[categoria/nombre]`, tinte por token, `mask-image`
- [x] `export/html.jsx` embebe también las máscaras de icono
- [x] Tests de iconos, color y fuente

**Paridad verificada byte a byte:** capturas de los 11 slides antes y después de la migración con **el mismo SHA-256**.

**Lo que no se tocó y por qué importa:** `src/core/` sigue siendo lógica pura sin DOM. `node test.js` no necesita runner ni jsdom, y el día que haya que cambiar de framework otra vez, lo caro seguirá siendo barato.

## Fase 1.6 — Editor de Markdown ✅

- [x] `src/ui/md.js` — manipulación del deck en funciones **puras sobre strings**, probadas en node
- [x] Barra de herramientas: `+ Slide` por layout, negrita, icono, imagen, color de acento, fuente
- [x] `src/ui/IconPicker.jsx` — modal con búsqueda y filtro por las 16 categorías
- [x] `src/ui/iconos.js` — el filtrado es una función pura, también probada en node
- [x] Subida de imágenes por middleware del dev server de Vite a `decks/img/`
- [x] `src/ui/ListaSlides.jsx` — **editor y miniaturas fusionados**: cada slide es su miniatura + su propio textarea, con asa de arrastre, ↑ ↓, duplicar y borrar

**Dos decisiones que cambiaron respecto al plan:**

**Sin CodeMirror.** El plan lo ponía como primer paso y estaba mal: la barra de herramientas necesita insertar en el cursor, y eso lo da `selectionStart` de un `<textarea>` normal. Lo único que aportaría CodeMirror es resaltado de sintaxis. Se agrega si se echa de menos de verdad, no por adelantado.

**Sin File System Access API.** Se pensaba usar `showDirectoryPicker`, pero obliga al usuario a elegir la carpeta correcta a mano y a conceder permisos cada sesión, con el riesgo de que la ruta escrita en el `.md` no coincida con la que sirve el server. Como Vite ya está ahí, un middleware de ~25 líneas en `vite.config.js` lo resuelve sin dependencias y con la ruta garantizada. Sanea el nombre (basename + lista blanca de extensiones); es solo dev y sin auth, y así está comentado.

**Editor y miniaturas son un solo panel.** Un `<textarea>` único con todo el deck obliga a buscar dónde está el cursor para saber sobre qué slide actúa la barra, y mover el slide 7 al puesto 2 es cortar y pegar a ciegas. Fusionados, cada slide edita **su propio bloque de Markdown** al lado de su miniatura: la ambigüedad desaparece y el lienzo queda entero para mirar.

**Solo el asa arrastra**, no la fila entera: si el `<li>` fuera `draggable`, seleccionar texto dentro del textarea iniciaría un arrastre.

**El textarea usa estado local mientras tiene el foco.** `bloques()` recorta los extremos de cada bloque, así que sin esto pulsar Enter al final de un slide no haría nada visible: el salto se perdería antes de renderizarse.

**Accesibilidad:** los botones ↑ ↓ de cada miniatura no son decoración. El drag-and-drop nativo de HTML no se maneja con teclado, y reordenar tiene que poder hacerse sin ratón.

**La disciplina que se mantuvo:** toda la lógica del editor vive en funciones puras (`md.js`, `iconos.js`) que `node test.js` prueba sin navegador. Los componentes React solo las llaman. Reordenar, duplicar y borrar operan sobre la lista de bloques de Markdown, no sobre el IR: lo que se mueve es el texto, así que el `.md` sigue siendo la única fuente de verdad.

## Fase 1.7 — Edición por campos ✅

El `<textarea>` tenía dos problemas que resultaron ser el mismo: **los iconos se veían como `[finanzas/x]`** porque un textarea es texto plano por definición, y **el espacio quedaba corto** porque había 11 editores abiertos cuando solo se edita uno.

- [x] `src/ui/campos.js` — `CAMPOS` (qué campos usa cada layout) y la conversión campos ↔ bloque, pura
- [x] `src/core/inline.js` — `aTexto()`, inverso exacto de `runs()`
- [x] `src/ui/SlideForm.jsx` — formulario de la diapositiva seleccionada, con chips de icono reales
- [x] `src/ui/ListaSlides.jsx` — vuelve a ser solo miniaturas: navegar y reordenar
- [x] Botón **Markdown** por diapositiva: no se quita la edición cruda, se relega

**La garantía que lo sostiene:** `test.js` comprueba que `aBloque(aCampos(b))` produce **el mismo IR** que `b` en las 11 diapositivas de la plantilla. Editar por campos no puede perder información, y el `.md` sigue siendo la fuente de verdad — Figma, PDF y HTML no se enteran del cambio.

También verifica que `CAMPOS` y el catálogo de `layouts.js` coincidan: si se separaran, el formulario mostraría campos que no pinta nadie.

**Se descartó CodeMirror otra vez, y ahora con datos.** Habría resuelto el `[finanzas/x]` con widgets inline, pero no el problema del espacio, y a cambio traía una dependencia. El formulario resuelve los dos.

## Fase 2 — Figma Design ✅

**Entregable:** `npm run figma -- decks/plantilla.md` → una página de Figma con un frame de 1920×1080 por slide, en [Presentaciones](https://www.figma.com/design/CdvRz2CU20bcXHJIA7XNN4/Presentaciones).

- [x] `tools/figma/tree.mjs` — deck → árbol de cajas, **reusando `src/core/` tal cual**
- [x] `tools/figma/render-slides.js` — árbol → frames, dentro de `use_figma`
- [x] `tools/figma/push.py` — trocea, envía, renderiza y captura
- [x] Chequeo de fuentes antes de construir, con caída a Roboto y reporte
- [x] Logos e iconos con `createNodeFromSvg`; degradados CSS → `GRADIENT_LINEAR`
- [x] Una página por presentación; volver a correrla reemplaza, no duplica
- [x] Tests del árbol en `node test.js`, incluido que ningún SVG referenciado falte

**Verificado:** 11 slides, 71 cajas — las mismas que cuenta el test — sin fuentes ni SVG faltantes. Capturas de la portada, `bullets` e `image` comparadas contra el navegador.

**Lo que se trajo de `banca-movil/tools/figma`:** `mcp.py` (cliente del MCP remoto con el token del llavero) y `review.py` (diff visual que nombra capas). Se descartaron `extract.mjs`, `render.js`, `verify.js`, `build.py` e `icons.py`: traducen un árbol de DOM de Storybook con auto-layout, y aquí partimos de cajas absolutas, que es un caso más simple.

**Tres cosas que ese repo ya había pagado y nos ahorraron descubrir:**

1. **`use_figma` admite 50k por llamada.** El plan original era embeber los SVG en el script; habría reventado con dos slides. El árbol viaja troceado por `sharedPluginData`.
2. **El Roboto de Figma es 2-6% más ancho que el del navegador.** El texto va con ancho fijo y `textAutoResize = "HEIGHT"` para que Figma decida las líneas. El margen del estimador (0.45 frente a 0.41 medido) cubre la diferencia.
3. **El MCP local de Figma desktop es de solo lectura.** Para escribir hay que usar el remoto con OAuth.

**Y un detalle que habría costado una tarde:** en Figma la familia se llama `Kiffo BDB`, en mayúsculas, no `Kiffo BdB` como en el CSS.

### Pendiente en Figma

- [ ] Componentes para artefactos que se repitan (tarjetas y similares) — **no** para los iconos: son 532 y se usan sueltos
- [ ] Variables de color desde `core/tokens.js`
- [ ] Auto Layout en la pila de contenido, para que el texto refluya al editarlo
- [ ] Imágenes bitmap (hoy salen como rectángulo gris; los SVG sí entran)

## Fase 3 — PPTX editable

**Entregable:** el mismo deck abre en PowerPoint con texto seleccionable y editable.

- [ ] `assets-png/` — 5 logos rasterizados @2x, comprometidos al repo
- [ ] `src/export/pptx.js` — dos slide masters (claro y oscuro) y los 9 layouts
- [ ] Verificación visual: PPTX contra PDF, slide por slide

**Riesgo:** desalineación contra el PDF por el estimador de altura. Se ve en esa comparación y se corrige con la perilla `AVG`.

## Fase 4 — Solo si un deck real lo pide

En orden de probabilidad, no de ambición:

- Layouts `cards`, `table`, `timeline`
- Iconos en PPTX (rasterizado bajo demanda con caché)
- PDF en CI con `puppeteer-core`
- Gráficas — decidir si son imagen o formas nativas; pptxgenjs tiene `addChart`, Figma habría que dibujarlas
- Librería de componentes publicada en Figma (`/figma-generate-library`)

## Fase 5 — Editor visual sobre la diapositiva

Click en un elemento del slide para editarlo en sitio, con panel de propiedades. Va al final a propósito: para entonces el modelo de cajas habrá pasado la prueba de tres destinos distintos, que es la mejor validación posible de que la abstracción aguanta.

**La decisión que hay que respetar:** el editor visual edita **contenido y elección de layout, no geometría**. Click en el título lo edita, click en un icono abre el picker, un selector cambia el layout — y todo se escribe de vuelta al `.md`.

Si en cambio permitiera arrastrar cajas libremente, el `.md` dejaría de poder representar el deck (habría que pasar a JSON) y se rompería el contrato que hace posibles PPTX editable y Figma. Cuando haga falta mover algo, el camino sano es **añadir un layout o una variante**, no soltar la geometría.

## Fase 6 — Backend, solo si aparece el disparador

Hoy no hay estado compartido, ni rutas, ni sesión: todo corre local contra archivos en git.

| Disparador | Qué haría falta |
|---|---|
| Varias personas editando decks sin git | Auth, persistencia, rutas por deck |
| Galería de decks de la organización | Listado, búsqueda, permisos |
| Generación de decks desde datos en vivo | API o server components |

## Lo que se deja fuera a propósito

| Descartado | Por qué | Cuándo reconsiderar |
|---|---|---|
| Arrastre libre de cajas en el editor visual | Rompe el contrato de layouts y con él PPTX y Figma. | Nunca — se añaden layouts en su lugar |
| Backend / servidor | Todo corre local contra archivos en git. | Ver fase 6 |
| Slidev / Marp / reveal.js | Su export a PPTX es una imagen por slide. La decisión de PPTX editable los descarta a los tres. | Si el requisito de PPTX editable se cae |
| HTML libre por slide | Rompe PPTX y Figma. Un layout nuevo son ~40 líneas. | Nunca — es el contrato del proyecto |
| Round-trip Figma → Markdown | Problema mucho más difícil que la ida. | Si el diseño empieza a nacer en Figma en vez de en el `.md` |
| Temas configurables | Hay un tema: Sherpa, en claro y oscuro. | El día que exista un segundo tema real |
| Transiciones y animaciones | No sobreviven a PDF ni a Figma. | Nunca |
