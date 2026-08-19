# Formato del deck

Un deck es **un archivo `.md`** en `decks/`. Se parsea a un objeto (el *Deck IR*) que consumen los tres exportadores.

## Anatomía

````md
---
titulo: Resultados de adopción Sherpa
subtitulo: Vicepresidencia de Experiencia y Diseño
fecha: 2026-08-19
tema: light          # light | dark  (default: light)
logo: horizontal     # horizontal | vertical | isotipo | tipografico
---

<!-- layout: cover -->
# Resultados de adopción Sherpa
Vicepresidencia de Experiencia y Diseño

---

<!-- layout: bullets; tag: Contexto -->
# Tres cosas cambiaron este trimestre

- La adopción llegó a **78%** de los squads
- El handoff bajó de 5 a 2 días
- Se unificaron 3 librerías en una

---

<!-- layout: stats -->
# El trimestre en números

- 78% | Squads usando Sherpa
- 2 días | Tiempo de handoff
- 510 | Iconos en el sistema
````

### Reglas del formato

1. **El frontmatter YAML del inicio configura el deck completo.** Va una sola vez, arriba de todo.
2. **`---` en una línea sola separa slides.** Nada más.
3. **La configuración de cada slide va en un comentario HTML en su primera línea:** `<!-- layout: bullets; tag: Contexto -->`. Es un comentario, así que no colisiona nunca con el `---` separador y el parser es una regex. Los pares se separan con **`;`**, no con coma, para que un valor pueda llevar comas (`caption: María, directora`).
4. **Sin layout declarado → `title-body`.**
5. `# Título` es el título del slide. La lista `- …` son los items. El texto suelto es el cuerpo. Qué usa cada layout está en la tabla de abajo.
6. **Dentro de un item, `|` separa dos campos.** En `stats` es `valor | etiqueta`; en `two-cols` es `título | texto`. Una sola regla para los dos casos.
7. **`[categoria/nombre]` al inicio de un item pone un icono** de sherpa-assets: `- [finanzas/ahorro] Texto del bullet`. Funciona en `bullets` (sustituye la viñeta) y en `two-cols` (va sobre la regla). El prefijo se quita del texto.
8. **Inline: solo `**negrita**`.** No cursivas, no links, no código. Los tres destinos tienen que producir el mismo resultado y la negrita es lo único que Sherpa pide (`tone.md`: bold para énfasis).

## Opciones del deck y del slide

**Frontmatter (una vez, arriba del archivo):**

| Clave | Valores | Efecto |
|---|---|---|
| `titulo`, `subtitulo`, `fecha` | texto | Metadatos; la portada los usa |
| `tema` | `light` (default) \| `dark` | |
| `logo` | `horizontal` \| `vertical` \| `isotipo` \| `tipografico` | |
| `fuente` | `roboto` (default) \| `kiffo` | Familia del **cuerpo**. Los títulos siempre son Kiffo BdB. Solo las dos familias oficiales de Sherpa |

**Comentario del slide (pares separados por `;`):**

| Clave | Valores | Efecto |
|---|---|---|
| `layout` | uno de los 9 | Default `title-body` |
| `tag` | texto | Kicker sobre el título |
| `caption` | texto | Pie en `image` y atribución en `quote` |
| `imagen` | ruta | Para el layout `image` |
| `color` | nombre de token (`mustard-800`, `success-800`, `brand-yellow`…) | Tiñe iconos, viñetas y reglas del slide. Un token inexistente cae al azul interactivo sin romper nada |

El color es **un token de Sherpa, no un valor RGB libre** — el sistema de diseño manda sobre el deck.

## Catálogo de layouts

Canvas 1920×1080. Todas las coordenadas en px de canvas. Ver [02-design-system-slides.md](02-design-system-slides.md) para la retícula.

| Layout | Para qué | Campos | Fondo |
|---|---|---|---|
| `cover` | Portada del deck | `titulo`, `body` (subtítulo), meta del deck | `--bg-inverse` |
| `section` | Divisor de sección | `titulo`, `tag` (nº o kicker) | `--bg-inverse` |
| `title-body` | Título + párrafo | `tag`, `titulo`, `body` | `--bg-canvas` |
| `bullets` | Lista de 3–6 ideas | `tag`, `titulo`, `items[]`, `icono` opcional por item | `--bg-canvas` |
| `two-cols` | Comparación / antes-después | `tag`, `titulo`, `items[]` (2 bloques `## Subtítulo` + texto) | `--bg-canvas` |
| `stats` | 2–4 cifras clave | `titulo`, `items[]` con formato `valor \| etiqueta` | `--bg-canvas` o `--bg-subtle` |
| `image` | Imagen a sangre | `imagen`, `titulo` opcional, `caption` opcional | imagen |
| `quote` | Cita textual | `body` (la cita), `caption` (atribución) | `--bg-subtle` |
| `closing` | Cierre | `titulo`, `body` | `--bg-inverse` |

### Geometría

| Layout | Slot | x | y | w | h | Estilo |
|---|---|---|---|---|---|---|
| **cover** | logo | 112 | 96 | 320 | auto | `logo-white` |
| | título | 112 | 600 | 1552 | auto | display 120 / Kiffo Medium / `--fg-on-dark` (11 col: un título de portada no debe partirse) |
| | subtítulo | 112 | — | 1120 | auto | 32 / Roboto / `--fg-on-dark-subtle` |
| | meta (fecha) | 112 | 936 | 1120 | 24 | 20 / `--fg-on-dark-faint` |
| **section** | tag | 112 | 420 | 1696 | 32 | tag 24 / `--brand-yellow` |
| | título | 112 | 476 | 1424 | auto | h1 88 / `--fg-on-dark` |
| **title-body** | tag | 112 | 96 | 1120 | 32 | tag 24 / `--fg-accent` |
| | título | 112 | 152 | 1424 | auto | h2 64 |
| | cuerpo | 112 | 320 | 1120 | auto | 32 / interlínea 1.5 |
| **bullets** | tag / título | igual que `title-body` | | | | |
| | items | 112 | 340 | 1344 | auto | 32, gap 32, viñeta 12px `--accent-primary` |
| **two-cols** | col izq | 112 | 340 | 832 | auto | |
| | col der | 976 | 340 | 832 | auto | |
| **stats** | título | 112 | 96 | 1424 | auto | h2 64 |
| | item *i* de *n* | 112 + i·(1696+48)/n | 480 | (1696−48·(n−1))/n | auto | valor 96 Semibold `--accent-primary`, label 24 `--fg-muted` |
| **image** | imagen | 0 | 0 | 1920 | 1080 | cover |
| | caption | 112 | 936 | 1120 | 48 | 20, sobre velo `rgba(0,0,0,.45)` si hay texto |
| **quote** | cita | 224 | 380 | 1472 | auto | 56 Kiffo Light, interlínea 1.3 |
| | atribución | 224 | — | 1472 | 32 | 24 / `--fg-muted` |
| **closing** | logo | centrado | 420 | 360 | auto | `logo-white` |
| | título | 112 | 640 | 1696 | auto | h2 64 centrado / `--fg-on-dark` |

Los `y` marcados `—` se calculan tras medir el bloque anterior (`y_anterior + alto_medido + gap`). El PPTX y Figma necesitan alturas resueltas, así que la medición ocurre **una vez, en el parser**, y el resultado va en el IR — los tres renderers reciben geometría ya cerrada.

### Cabecera y pie fijos

Todos los layouts sobre `--bg-canvas` llevan:

- **Isotipo** en 32×32 en `x:1776, y:96` (esquina superior derecha).
- **Pie**: número de slide en `x:1776, y:960`, 16px `--fg-disabled`, alineado a la derecha. Se omite en `cover`, `section` y `closing`.

## Deck IR

Lo que produce el parser y consumen los tres renderers:

```js
{
  meta: { titulo, subtitulo, fecha, tema, logo },
  slides: [
    {
      layout: 'bullets',
      tag: 'Contexto',
      titulo: [{ t: 'Tres cosas cambiaron este trimestre', b: false }],
      body: null,
      items: [
        { runs: [{t:'La adopción llegó a ',b:false},{t:'78%',b:true},{t:' de los squads',b:false}], icono: null }
      ],
      imagen: null,
      caption: null,
      n: 2                       // número de slide
    }
  ]
}
```

Todo texto es un array de *runs* (`{t, b}`) — nunca un string con markup. Es lo único que PPTX (`addText` con array), Figma (`setRangeFontName`) y HTML (`<strong>`) pueden consumir por igual.

## Lint de contenido

Las reglas de voz de Sherpa (`base/README.md` → Content Fundamentals) son verificables. El parser emite **warnings, no errores** — nunca bloquea un export:

| Regla | Chequeo |
|---|---|
| Títulos sin punto final | `titulo` no termina en `.` |
| Títulos ≤ 2 líneas | `titulo` ≤ 80 caracteres |
| Bullets 3–6, ideal 5 | `items.length` entre 3 y 6 |
| Cuerpo ≤ 20 palabras por frase | split por `.` y contar |
| Sin emoji | regex de rango emoji |
| Montos en dígitos | heurística: "un millón" / "dos mil" en `body` |

## Candidatos fase 2

`cards` (2–4 tarjetas), `table`, `timeline`. Se agregan cuando un deck real los pida, no antes.
