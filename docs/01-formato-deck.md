# Formato del deck

Un deck es **un archivo `.md`** en `decks/`. Normalmente no se escribe a mano — el
creador tiene un formulario — pero el `.md` es el formato de almacenamiento, la
fuente de verdad y lo que se versiona en git.

## El modelo: layouts y componentes

**El layout no decide qué contenido lleva la diapositiva.** Decide el fondo, si
hay cabecera y **dónde** se apila el contenido. Lo que va dentro son
**componentes** que se añaden, quitan y reordenan.

Eso es lo que permite combinar cifras con un párrafo sin inventar un layout para
la combinación, y sigue siendo compatible con el contrato del proyecto: los
componentes **se apilan en regiones de geometría conocida**, no flotan libres.
Cada componente sabe medirse con un ancho dado, la región los apila, y las cajas
salen igual para PDF, HTML, Figma y PPTX.

> Si algún día los componentes pudieran posicionarse a mano, se caen PPTX y Figma
> con ellos. Cuando haga falta una disposición nueva, se **añade un layout**.

## Anatomía

````md
---
titulo: Resultados de adopción Sherpa
subtitulo: Vicepresidencia de Experiencia y Diseño
fecha: 2026-08-19
fuente: roboto
---

<!-- layout: cover -->
# Resultados de adopción Sherpa
Vicepresidencia de Experiencia y Diseño

---

<!-- layout: contenido; tag: Contexto; color: mustard-800 -->
# Tres cosas cambiaron este trimestre

<!-- parrafo -->
El trimestre cerró por encima de lo previsto en **adopción**.

<!-- bullets -->
- [finanzas/ahorro] La adopción llegó a **78%** de los squads
- [esenciales/agregar-usuario] El handoff bajó de 5 a 2 días
- [autenticacion/token-activo] Se unificaron 3 librerías en una

<!-- stats -->
- 78% | Squads usando Sherpa
- 2 días | Tiempo de handoff
````

### Reglas

1. **El frontmatter YAML del inicio configura el deck completo.** Va una sola vez.
2. **`---` en una línea sola separa diapositivas.**
3. **Un comentario cuyo primer segmento lleva `:` es la configuración de la diapositiva.** Sin `:`, es un **componente**. Sin ambigüedad y con una sola regex.
4. Los pares se separan con **`;`**, no con coma, para que un valor pueda llevar comas.
5. `# Título` es el título de la diapositiva. Va en la cabecera, fuera de los componentes.
6. **`<!-- columna -->`** pasa a la siguiente región en los layouts de varias columnas.
7. **Dentro de un item, `|` separa dos campos** — `valor | etiqueta` en cifras, `título | texto` en tarjetas.
8. **`[categoria/nombre]` al inicio de un item pone un icono** de sherpa-assets.
9. **Inline: solo `**negrita**`.** Ni cursivas ni links: los cuatro destinos deben coincidir.

### El formato perdona

Texto suelto sin componente declarado se envuelve en un `parrafo`; líneas `- `
sueltas, en `bullets`. Los layouts del formato anterior (`title-body`, `bullets`,
`stats`, `quote`, `two-cols`, `closing`, `image`) siguen abriendo: se mapean al
catálogo nuevo y su contenido se envuelve en el componente que corresponde.

## Catálogo de layouts

| Layout | Para qué | Regiones | Fondo |
|---|---|---|---|
| `cover` | Portada | — | `--bg-inverse` |
| `section` | Divisor de sección | — | `--bg-inverse` |
| `afirmacion` | Titular de afirmación, sin decoración | — | `--bg-canvas` |
| `contenido` | El de uso general | 1, a 12 columnas | `--bg-canvas` |
| `dos-columnas` | Comparación, antes/después (simétrico 6+6) | 2, a 6 columnas | `--bg-canvas` |
| `dos-tercios` | Idea principal + cifra o apoyo (asimétrico 8+4) | 2, a 8 + 4 columnas | `--bg-canvas` |
| `media-lateral` | Producto o screenshot como medio protagonista | 1, a 5 columnas + imagen a sangre | `--bg-canvas` |
| `destacado` | Una idea sola con aire | 1, a 12 columnas | `--bg-subtle` |
| `imagen` | Imagen a sangre | — | la imagen |
| `cierre` | Cierre | — | `--bg-inverse` |

`afirmacion`, `dos-tercios` y `media-lateral` se agregaron en la Fase A del
plan rector ([06-plan-producto-premium.md](06-plan-producto-premium.md)) para
que el catálogo pudiera dar tipografía dominante, asimetría real y un medio
protagonista — hasta entonces la única variedad de composición disponible era
6+6 columnas con un mismo tamaño de título en todos lados.

Los que no tienen regiones son **estructura**, no contenido armable: su forma es
el mensaje. Los demás aceptan cualquier componente en cualquier orden.

## Catálogo de componentes

| Componente | Campos | Notas |
|---|---|---|
| `parrafo` | `texto` | Frases de menos de 20 palabras |
| `bullets` | `items` con icono | Sherpa pide de 3 a 6, idealmente 5 |
| `stats` | `items` `valor \| etiqueta` | De 2 a 4. Los montos siempre en dígitos |
| `cita` | `texto`, `autor` | Sin comillas; la atribución va aparte |
| `tarjetas` | `items` `título \| texto` con icono | De 2 a 4 |
| `tabla` | `filas`, primera fila es encabezado | Columnas separadas por `\|` |
| `imagen` | `src`, `pie` | 16:9 dentro de la región |

El catálogo vive en [`src/core/componentes.js`](../src/core/componentes.js) con
sus campos declarados, y es lo que lee **tanto el formulario como cualquier
generador automático**: una sola fuente, para que no se separen.

## Opciones

**Frontmatter (una vez, arriba):**

| Clave | Valores | Efecto |
|---|---|---|
| `titulo`, `subtitulo`, `fecha` | texto | Metadatos; la portada los usa |
| `tema` | `light` (default) \| `dark` | |
| `fuente` | `roboto` (default) \| `kiffo` | Familia del **cuerpo**. Los títulos siempre son Kiffo BdB |

**Comentario de la diapositiva:**

| Clave | Efecto |
|---|---|
| `layout` | Uno del catálogo. Default `contenido` |
| `tag` | Kicker sobre el título |
| `imagen`, `caption` | `imagen` para los layouts `imagen` y `media-lateral`; `caption` solo para `imagen` |
| `color` | Token de Sherpa (`mustard-800`, `success-800`…). Tiñe iconos, viñetas y cifras. Uno inexistente cae al azul interactivo sin romper nada |

El color es **un token del sistema, no un valor RGB libre** — el design system
manda sobre el deck.

## Deck IR

Lo que produce el parser y consumen los cuatro renderers:

```js
{
  meta: { titulo, fecha, tema, fuente },
  fuentes: { display: 'Kiffo BdB', body: 'Roboto' },
  slides: [{
    n: 2,
    layout: 'contenido',
    tag: [{ t: 'Contexto', b: false }],
    titulo: [{ t: 'Tres cosas cambiaron', b: false }],
    color: 'mustard-800',
    regiones: [                            // una lista de componentes por región
      [
        { tipo: 'parrafo', texto: [...] },
        { tipo: 'bullets', items: [{ runs: [...], extra: null, icono: 'finanzas/ahorro' }] },
      ],
    ],
  }],
  avisos: [],
}
```

Todo texto es un array de *runs* (`{t, b}`) — nunca un string con markup. Es lo
único que PPTX (`addText` con array), Figma (`setRangeFontName`) y HTML
(`<strong>`) pueden consumir por igual.

## Lint de contenido

Las reglas de voz de Sherpa (`base/README.md` → Content Fundamentals) son
verificables. El parser emite **avisos, nunca errores** — no bloquea un export:

| Regla | Chequeo |
|---|---|
| Títulos sin punto final | `titulo` no termina en `.` |
| Títulos ≤ 2 líneas | `titulo` ≤ 80 caracteres |
| Bullets 3–6, ideal 5 | por componente `bullets` |
| Cuerpo ≤ 20 palabras por frase | split por `.` y contar |
| Sin emoji | regex de rango emoji |
| Layout o componente inexistente | contra el catálogo |
