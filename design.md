---
version: alpha
name: Sherpa Slides
system: SHERPA Design System · Banco de Bogotá
description: >
  Sistema de presentaciones sobre el Design System SHERPA. Un lienzo fijo de
  1920×1080 con retícula de doce columnas; el layout decide dónde va el
  contenido y los componentes se apilan dentro de sus regiones. La geometría
  queda cerrada en píxeles porque el mismo archivo tiene que salir a PDF, HTML,
  Figma y PPTX editable — ninguno de los dos últimos acepta HTML arbitrario.
  Kiffo BDB para títulos y cifras, Roboto para el cuerpo.

fuentes-de-verdad:
  1: Manual de Marca 2026 (PDF oficial)
  2: Sitio Sherpa Design System
  3: Skill del Design System Auditor
  nota: ante conflicto se sigue ese orden; este documento ya lo aplica.

canvas:
  ancho: 1920
  alto: 1080
  margen-x: 112
  margen-y: 96
  columnas: 12
  ancho-columna: 112
  canal: 32
  ancho-contenido: 1696

fuentes:
  display: "Kiffo BDB"
  body: "Roboto"

corporativos:
  bluebrand-800: "#0043A9"
  yellowbrand-800: "#F9B818"
  redbrand-900: "#EC3030"

serie-datos:
  - "#0070D9"
  - "#DA8658"
  - "#00856D"
  - "#927200"
  - "#A81023"
---

# Sherpa Slides — sistema de diseño

## Política de lienzo fijo

Una diapositiva **no es HTML libre**: es una instancia de un layout con
geometría conocida en píxeles. Todo lo demás sale de ahí.

La razón no es estética. Un PPTX editable son cajas de texto y formas
posicionadas; un frame de Figma son nodos con `x`, `y`, `width`, `height`.
Ninguno de los dos puede renderizar un `div` con flexbox. El contenido **sí** es
armable —un layout define regiones y tú metes componentes dentro— pero los
componentes **se apilan**: cada uno sabe medirse con un ancho dado y la región
los coloca. El día que pudieran posicionarse a mano, se caen los dos
exportadores que sostienen el proyecto.

Cuando haga falta una disposición que ningún layout cubre, se **agrega un
layout**. Son ~15 líneas.

---

## Overview

| | |
|---|---|
| Lienzo | 1920 × 1080 px, fijo |
| Retícula | 12 columnas de 112 px, canal 32 px, margen 112 / 96 |
| Familias | Kiffo BDB (marca) · Roboto (producto) |
| Layouts | 10 |
| Componentes | 7 |
| Destinos | PDF · HTML autocontenido · Figma Design · PPTX editable |

`112 + (12 × 112) + (11 × 32) + 112 = 1920` — la retícula cierra exacta, y todos
los anchos útiles son múltiplos de 8, coherentes con la escala de espaciado.

---

## Colores

Nunca se usa un hex directo en el código: se usa el **token semántico**, para
que el rol quede explícito. Los nombres de token de esta sección son
literalmente los mismos que las variables de Figma, agrupados en las colecciones
`Grises`, `Azules`, `Corporativos`, `Semánticos`, `Foreground`, `Background`,
`Border`.

### Foreground (texto)

| Token | Hex | Rol |
|---|---|---|
| `sp-color-foreground-primary` | `#000000` | Títulos, jerarquía primaria |
| `sp-color-foreground-secondary` | `#444444` | Párrafos, labels, captions |
| `sp-color-foreground-disabled` | `#808080` | Texto inactivo, número de diapositiva |
| `sp-color-foreground-inverse-primary` | `#FFFFFF` | Texto sobre fondos oscuros |
| `sp-color-foreground-interactive` | `#0043A9` | Tag sobre el título, acentos |

Sobre fondo oscuro el sistema de slides usa además tres opacidades del blanco:
`0.92` (muted), `0.78` (subtle) y `0.62` (faint). Son solo para metadatos —
fecha, pie, texto de apoyo— nunca para contenido.

### Azules (Midnight)

| Token | Hex | Rol |
|---|---|---|
| `sp-midnight-50` | `#F6FAFF` | Fondo general de interfaz; superficie de `destacado` |
| `sp-midnight-200` | `#D4E5F8` | Hover sobre componentes de fondo blanco |
| `sp-midnight-600` | `#4D86D4` | Borde de foco |
| `sp-midnight-700` | `#1054B7` | **Fondos de elementos no interactivos** — el fondo de diapositiva |
| `sp-midnight-800` | `#0043A9` | Color interactivo: texto, bordes, acentos |
| `sp-midnight-900` | `#00317E` | Hover de botones y enlaces |

> **midnight-700 es el fondo, midnight-800 es el acento.** Es la distinción que
> más se confunde: el 800 está documentado como *color interactivo*, no como
> superficie. Los layouts oscuros (`cover`, `section`, `cierre`) van en 700.

### Grises (Carbon)

`sp-carbon-50` `#F2F2F2` · `200` `#E6E6E6` (bordes) · `400` `#B3B3B3` ·
`600` `#808080` (piso para texto) · `800` `#444444` · `900` `#000000`.

### Semánticos — reservados

`error` `#C94740` · `success` `#198500` · `warning` `#B15C00` · `info` `#2076C2`
(escalón `-800`; cada familia tiene 100 / 500 / 800 / 900).

Escalones: `-900` texto sobre fondos de su familia · `-800` iconos semánticos y
texto sobre blanco · `-500` fondo sólido de contexto · `-100` fondo tenue.

**Están reservados para estado.** Una serie de gráfica con color semántico se
lee como una alerta, no como una categoría. No se usan para nada más.

### Extendida — categorías de producto

Bluey, Khaki, Mustard, Peach, Rose, Mauve en cuatro escalones (900/800/500/200),
más Burgundy `#B95477` y Green `#00856D`. Es la paleta para **categorizar
producto**: gráficas, badges de categoría. Nunca un CTA primario.

### Corporativos y segmentos

| Token | Hex |
|---|---|
| `sp-bluebrand-800` | `#0043A9` |
| `sp-yellowbrand-800` | `#F9B818` |
| `sp-redbrand-900` | `#EC3030` |
| `sp-nato-800` (afluente) | `#112A3B` |
| `sp-gray-800` (preferente) | `#BABABA` |
| `sp-carbon-900` (premium) | `#000000` |

> Corregidos según el Manual de Marca 2026. El sitio Sherpa listaba
> `#14327D` / `#FFBE00` / `#CD3232`, que quedan reemplazados. **Ya aplicados en
> el código.**

### Uso en diapositivas

| Superficie | Token | Layouts |
|---|---|---|
| Clara | `#FFFFFF` | `contenido`, `dos-columnas` |
| Clara alterna | `sp-midnight-50` | `destacado` |
| Oscura institucional | `sp-midnight-700` | `cover`, `section`, `cierre` |

La fotografía va sobre blanco o sobre la superficie tenue, **nunca sobre el azul
profundo** — lo enturbia.

### Contraste

Mínimo AA: 4.5:1 texto normal, 3:1 texto grande (>18 pt). Negro sobre blanco da
21:1; blanco sobre `midnight-700` da 6.9:1. Las opacidades de metadato (78 % y
62 %) caen a ~5.4:1 y ~4.3:1 — siguen sobre AA a tamaño grande, y por eso solo
llevan metadatos.

Nunca comunicar significado solo con color: siempre acompañado de icono o texto.

---

## Tipografía

Dos familias con roles distintos. **No son intercambiables y ninguna es respaldo
de la otra.**

| | Kiffo BDB | Roboto |
|---|---|---|
| Rol | Tipografía de marca | Tipografía de producto |
| Dónde | Títulos, cifras, piezas de marca | Cuerpo, labels, todo el copy funcional |
| Pesos | Thin 100 → SemiBold 600 | Regular 400, Medium 500 |
| Origen | `fuentes/kiffo-bdb/*.woff2` en sherpa-assets | Google Fonts / sistema |

La familia se llama **`Kiffo BDB`**, en mayúsculas — así está en Figma y en el
manual, y es la grafía que usa el proyecto desde que se aplicaron los
lineamientos — CSS, IR, export HTML y Figma coinciden, sin traducción de por
medio.

Si el archivo de fuente no carga, el respaldo es **Roboto**, directo y sin
placeholder.

### Escala de producto (SHERPA)

Tamaños permitidos: 10 · 12 · 14 · 16 · 18 · 20 · 24 · 32 · 40 · 48 · 56 px.
Headings H1–H8 en Medium; párrafos en Regular; `tag` en Semibold con tracking
`0.1rem`.

### Escala de diapositiva

La escala de producto está calibrada para leer a 50 cm en un navegador. Una
diapositiva se lee a 3–8 metros en una sala, así que el sistema usa una escala
propia **derivada** de aquella, con los mismos saltos:

| Estilo | Tamaño | Interlínea | Familia / peso | Uso |
|---|---|---|---|---|
| displayXL | 160 | 1.05 | Kiffo Medium | Titular de afirmación (layout `afirmacion`) |
| display | 120 | 1.1 | Kiffo Medium | Título de portada |
| h1 | 88 | 1.15 | Kiffo Medium | Título de sección |
| h2 | 64 | 1.2 | Kiffo Medium | Título de diapositiva |
| h3 | 40 | 1.25 | Kiffo Medium | Subtítulo, título de columna |
| statHero | 240 | 1.0 | Kiffo SemiBold | Cifra protagonista (`stats` con un solo item) |
| stat | 96 | 1.1 | Kiffo SemiBold | Cifra |
| numero | 200 | 1.0 | Kiffo Light | Número gigante de sección (`section`) |
| quote | 64 | 1.3 | Kiffo Light | Cita |
| bodyL | 32 | 1.5 | Roboto Regular | Cuerpo, puntos |
| body | 28 | 1.5 | Roboto Regular | Cuerpo denso, columnas |
| tag | 24 | 1.3 | Roboto SemiBold, tracking 1.6 px | Kicker sobre el título |
| caption | 20 | 1.5 | Roboto Regular | Pie, metadatos |
| footer | 16 | 1.5 | Roboto Regular | Número de diapositiva |

Los tres primeros y `numero` amplían la escala derivada para dar registro
editorial (afirmación tipográfica, cifra protagonista, número de sección
gigante); la escala de producto (`H1`/`paragraph-m`) no se toca — ver «Fase A»
en [docs/06-plan-producto-premium.md](docs/06-plan-producto-premium.md).

**Piso de legibilidad: 20 px.** Si el contenido no cabe a 20 px, sobra
contenido, no falta tipografía.

El manual autoriza explícitamente esta salida de la escala nominal: la
convención de nombres `H1`/`paragraph-m` aplica **solo a interfaces de
producto**; en presentaciones basta usar Kiffo BDB con peso y tamaño según
jerarquía visual.

### Longitud de línea

60–100 caracteres por línea en bloques de más de 3 líneas. En el lienzo eso
equivale a un cuerpo de 32 px sobre 8–10 columnas; a 12 columnas la línea se
pasa de largo y hay que partir en dos regiones.

---

## Layout

### Sistema de lienzo

```
112 │ 12 columnas de 112 px, canal de 32 px │ 112
    │◄──────────── 1696 px ────────────────►│
```

Márgenes: 112 horizontal, 96 vertical → alto de contenido 888 px.
Anchos útiles: 6 col = **832** · 8 col = **1120** · 10 col = **1424** · 12 col = **1696**.

Todo elemento respeta los márgenes. Solo sangran los que están explícitamente
diseñados para ello (`imagen` a sangre completa).

### Modelo de regiones

Un layout declara fondo, si lleva cabecera (tag + título) y **una o más
regiones** con su origen y ancho. Los componentes se apilan en la región en
orden de documento, cada uno con su separación propia. La región arranca donde
termine la cabecera si esta se pasó de largo.

### Catálogo de layouts

| Layout | Fondo | Cabecera | Regiones |
|---|---|---|---|
| `cover` | midnight-700 | — | estructura fija |
| `section` | midnight-700 | — | estructura fija |
| `afirmacion` | blanco | — | estructura fija |
| `contenido` | blanco | sí | 1 × 12 col |
| `dos-columnas` | blanco | sí | 2 × 6 col |
| `dos-tercios` | blanco | sí | 2 × (8 + 4) col |
| `media-lateral` | blanco + imagen a sangre | sí, 5 col | 1 × 5 col |
| `destacado` | midnight-50 | sí | 1 × 12 col |
| `imagen` | la imagen | — | estructura fija |
| `cierre` | midnight-700 | — | estructura fija |

Los que no tienen regiones son **estructura**: su forma es el mensaje y no
admiten componentes sueltos.

`dos-tercios` da la asimetría 8+4 que `dos-columnas` no puede dar. `afirmacion`
es tipografía dominante con espacio negativo: título en `displayXL` y nada más
compitiendo por atención. `media-lateral` reserva el 57% del lienzo a una
imagen a sangre (`media-lateral.fijas`, no una región) — dentro del rango de
45–75% que exige la definición de "premium" del plan rector; por eso mismo va
sin isotipo ni folio de página (`SIN_CHROME`), igual que `imagen`.

### Catálogo de componentes

| Componente | Campos | Regla |
|---|---|---|
| `parrafo` | texto | Frases de menos de 20 palabras |
| `bullets` | items, icono opcional | 3 a 6, idealmente 5 |
| `stats` | valor \| etiqueta | 2 a 4; montos siempre en dígitos |
| `cita` | texto, autor | Sin comillas; la atribución va aparte |
| `tarjetas` | título \| texto, icono | 2 a 4 |
| `tabla` | filas (encabezado + cuerpo) | Primera fila es encabezado; columnas separadas por `\|` |
| `imagen` | src, pie | 16:9 dentro de la región |

El catálogo vive en `src/core/componentes.js` con sus campos declarados, y lo
leen **tanto el formulario del editor como cualquier generador automático**: una
sola fuente, para que no se separen.

---

## Visualización de datos

Sherpa **no define paleta categórica**. El manual autoriza explícitamente
generarla (§13.1) siempre que se declare como propuesta no validada. Esta lo es.

### Paleta de series

| # | Token | Hex | Nombre |
|---|---|---|---|
| 1 | `sp-midnight-500` | `#0070D9` | Azul |
| 2 | `sp-peach-500` | `#DA8658` | Durazno |
| 3 | `sp-green-800` | `#00856D` | Verde |
| 4 | `sp-mustard-800` | `#927200` | Mostaza |
| 5 | `sp-rose-900` | `#A81023` | Vino |

Sale de la paleta extendida, que el sistema ya reserva para categorizar. Los
cuatro semánticos quedan fuera por definición.

### Tres límites, medidos y no opinados

**Cinco series es el techo.** No es preferencia: con seis, algún par deja de
distinguirse incluso con visión normal. A partir de la sexta hay que agrupar en
«Otros», partir en varias gráficas o usar múltiplos pequeños.

**Solo sobre fondo claro.** Contra el azul de marca la validación de contraste
falla, así que las gráficas no van en `cover`, `section` ni `cierre`.

**Etiqueta directa obligatoria.** El durazno queda en 2.72:1 contra el blanco,
por debajo del mínimo. Cada marca lleva su valor escrito encima: el color
acompaña la identidad, nunca la carga solo. Eso resuelve además el requisito de
no depender del color.

### Reglas de forma

- El color sigue a la entidad, nunca a su posición. Un filtro que cambia el
  número de series no debe repintar las que quedan.
- Nunca doble eje. Dos medidas de escala distinta son dos gráficas.
- Secuencial: un solo tono claro→oscuro. Divergente: dos tonos con gris neutro
  en medio. Nunca arcoíris.
- Marcas finas, rejilla recesiva, sin número sobre cada punto.

---

## Iconografía

~532 iconos en 16 categorías en `sherpa-assets/iconos/`. Tamaños de uso: 16, 20,
24 y 32 px. Vienen con `fill="black"` fijo y se recolorean con máscara.

En la diapositiva se usan a 44 px (viñeta de `bullets`), 48 px (`tarjetas`) y
56 px (bloque de columna) — por encima de la escala de UI, porque se leen a
distancia de sala, no de pantalla.

- Elegir por categoría semántica correcta.
- Los de `semanticos/` son los oficiales para estados.
- Los de `marcas/` (Visa, Mastercard, bancos) solo en su contexto original.
- **Nunca** usar un icono de 16–32 px como sustituto de un logotipo
  institucional a tamaño completo.

Si no se puede traer el SVG real, sí está permitido recrear un icono
equivalente siguiendo el estilo documentado: trazo uniforme, sin relleno,
esquinas redondeadas, geometría simple.

---

## Logotipo y marcas legales

### Logotipo

Variantes: aval, horizontal, isotipo, tipográfico, vertical — cada una en
normal, sólido, dark y sólido-dark.

- **Siempre completo** (texto e isotipo juntos). Solo se separa usando la
  variante `isotipo` oficial, y solo en espacios muy reducidos.
- **Alto mínimo 32 px.** Nunca por debajo.
- **Zona de protección:** un módulo `x` libre en los cuatro lados, donde `x` es
  el ancho de la «O» de la tipografía del logotipo. En el isotipo a tamaño
  reducido se acepta `x/2`.
- Nunca recolorear fuera de las variantes provistas; nunca sombras, glow ni 3D.
- **Nunca recrearlo a mano.** Si no se puede traer el archivo, va un placeholder
  textual explícito con la ruta exacta, y se avisa de que quedó pendiente.

### Legales — obligatorios

**Superintendencia Financiera de Colombia:** obligatorio en toda pieza pública
con el logotipo del banco. Solo se exceptúa la comunicación interna.

> En presentaciones y documentos va **vertical, rotado 90°, en el margen** (por
> ejemplo el lateral izquierdo), a tamaño pequeño — como el membrete oficial.
> Esta es la forma estándar para este tipo de pieza, no una excepción.

**Fogafín:** se suma cuando la pieza promociona productos de captación (débito,
CDT, cuentas de ahorro). Va perpendicular a los legales de la Superintendencia.

Ambos tienen variante `-dark` para fondos oscuros. El icono
`iconos/marcas/fogafin.svg` **no** sirve para esto: es el icono funcional de
16–32 px, no el logotipo institucional.

> Hoy ningún layout del generador pone los legales. Ver *Vacíos conocidos*.

---

## Espaciado, bordes, elevación y movimiento

### Espaciado

Base 8 px con paso de 4 px en tamaños pequeños. Tolerancia **0 px**: todo
padding y gap coincide exactamente con un token.

`0 · 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 56 · 80 · 120 · 160`

Interlineado mínimo 1.5× el tamaño de fuente en bloques de texto; espacio tras
párrafo, 2×.

### Radios

Escala oficial, tolerancia 0 px: `0 · 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40`.

### Elevación

Tres tokens, un solo offset/blur — `0px 4px 12px 0px`:

| Token | Valor | Uso |
|---|---|---|
| `--sp-color-shadow` | `rgba(0, 67, 169, 0.3)` | Por defecto |
| `--sp-color-shadow-inverse` | `rgba(148, 186, 233, 0.3)` | Sobre fondo oscuro |
| `--sp-color-shadow-box` | `rgba(128, 128, 128, 0.3)` | Neutra, sin tinte de marca |

**No hay escala de elevación por tamaño ni tokens de z-index.** No inventarlos.

### Movimiento

Ease-out propio: `cubic-bezier(0.2, 0.8, 0.4, 1)`. Nunca lineal, nunca el
ease-out genérico del navegador.

| Duración | Tiempo | Uso |
|---|---|---|
| Corta | 150 ms | Botones, checks |
| Media | 300–400 ms | Dropdowns, tooltips |
| Larga | 500–700 ms | Modales, cambio de contexto |

Sherpa no define tokens `sp-motion-*`; se referencian por categoría y valor.

> El generador de presentaciones **no usa movimiento**: no sobrevive a PDF ni a
> Figma, y en PPTX sería otro renderizador. Esta sección queda documentada para
> el editor, no para las diapositivas.

---

## Do's and Don'ts

### Do

- Usar el token semántico, no el hex — el rol es la información.
- `midnight-700` para superficies oscuras; `midnight-800` para acentos.
- Kiffo BDB en títulos y cifras; Roboto en cuerpo y labels.
- Etiqueta directa sobre cada marca de una gráfica.
- Sello de la Superintendencia en toda pieza pública con el logotipo.
- Montos siempre en dígitos; títulos en sentence case y sin punto final.
- Voz activa y tuteo en todos los segmentos, incluidas empresas.

### Don't

- Inventar tonos intermedios o hex «parecidos».
- Usar los cuatro semánticos como colores de serie.
- Valores de espaciado o radio fuera de la escala.
- Emoji: no aparecen en ninguna parte del sistema.
- Gradientes de fondo: los fondos son planos.
- Separar el isotipo del texto del logotipo.
- Doble eje en una gráfica.
- Recrear el logotipo institucional a mano.

---

## Comportamiento de exportación

| Destino | Qué produce | Límite |
|---|---|---|
| PDF | Impresión a 1920×1080 sin márgenes | — |
| HTML | Un archivo con fuentes y assets en data-URI | Roboto se baja de Google Fonts al exportar |
| Figma | Una página por deck, un frame por diapositiva | Sin variables ni componentes todavía; imágenes bitmap salen como rectángulo |
| PPTX | Cajas de texto y formas reales | Pendiente |

Conversión de unidades a PPTX: `px / 144 = pulgadas`, `px / 2 = puntos`. La
escala cae en valores redondos — título 64 px = 32 pt, cuerpo 32 px = 16 pt.

En Figma la familia se llama `Kiffo BDB` y el Roboto de Figma es 2–6 % más ancho
que el del navegador; por eso el texto va con ancho fijo y alto automático.

---

## Estado de aplicación

Las nueve diferencias que documentaba la primera versión de este archivo están
**aplicadas**. `base/colors_and_type.css` es hoy un reflejo del manual.

| Qué | Antes | Ahora |
|---|---|---|
| Amarillo de marca | `#FFBE00` | `#F9B818` |
| Rojo de marca | `#CD3232` | `#EC3030` |
| Azul de marca | `#14327D` | `#0043A9` |
| Familia display | `"Kiffo BdB"` | `"Kiffo BDB"` |
| `--bg-inverse` | `midnight-800` | `midnight-700` |
| Respaldo de `--font-body` | `Roboto, Kiffo BdB` | `Roboto, sans-serif` |
| `--r-sm` | `6px` | `8px` |
| `--r-xl` | `28px` | eliminado |
| Sombras | 4 tamaños inventados | 3 tokens, `0 4px 12px` |
| Easing | `(0.2, 0, 0, 1)` + una segunda curva | `(0.2, 0.8, 0.4, 1)`, una sola |
| Duraciones | 150 / 240 / 400 ms | 150 / 300 / 600 ms |

**Impacto medido en la salida:** exactamente **cuatro** de las once diapositivas
de la plantilla cambian — `cover`, las dos de `section` y `cierre`. Las de
`section` por partida doble: fondo y color del tag. Ninguna otra caja del deck
referencia un valor modificado, comprobado recorriendo las cajas compuestas y no
por captura.

De los once cambios, seis no alteran un solo píxel: `--brand-red`,
`--brand-blue`, el easing, las duraciones y `--r-xl` estaban declarados sin que
nadie los consumiera. Radios y sombras solo los usa la interfaz del editor.

## Vacíos conocidos

Confirmados como **no documentados** en Sherpa ni en el Manual 2026 — no es que
falte cargarlos, es que el lineamiento no existe. Se señalan como pendientes en
vez de inventar un valor.

- **Escala de elevación y z-index.** Solo existe un offset/blur; no hay
  variantes por nivel ni orden de capas.
- **Zoning del logotipo** para combinaciones de formato distintas a «logo
  horizontal en formato vertical».
- **Lookbook de fotografía** para Preferente, Premium y Masivo. Solo Afluente
  tiene uno propio; el resto sigue las reglas generales.
- **Render de `Color=Dark`** del componente de logo en Figma: se asume que
  equivale a `bdb-horizontal-dark.svg`, falta confirmarlo visualmente.

Del lado del generador, y sí accionables:

- Ningún layout pone los **legales obligatorios**.
- No hay componente de **gráfica** en el catálogo; la paleta ya está validada.
- Figma sale sin **variables de color** ni componentes reutilizables.
- **PPTX** sin empezar.

---

## Guía de iteración

Al agregar un layout: declarar fondo, cabecera y regiones en
`src/core/layouts.js`, y su fila de campos en `src/ui/campos.js`. `node test.js`
verifica que los dos catálogos no se separen y que ninguna caja se salga del
lienzo.

Al agregar un componente: `pintar(c, {x, y, w, ctx})` devuelve cajas y su alto,
y `campos` describe qué edita el formulario. Nada más — no conoce la diapositiva
ni la página.

Al tocar color o tipografía: se edita `base/colors_and_type.css` y se corre
`npm run tokens`. Ese CSS es la fuente; `src/core/tokens.js` es un artefacto
derivado.

Al proponer color de series: correr el validador antes de decidir. La paleta de
este documento salió de eso, no de criterio visual — y la primera propuesta,
que parecía obvia, falló cuatro de cinco chequeos.
