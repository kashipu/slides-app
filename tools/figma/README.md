# Deck → Figma

Convierte un `.md` de `decks/` en una página de Figma con un frame de 1920×1080
por diapositiva. Una presentación es un comando.

## Uso

```bash
npm run figma -- decks/plantilla.md
npm run figma -- decks/q3.md "Resultados Q3" --png /tmp/portada.png
```

| Argumento | Qué hace |
|---|---|
| `deck` | Ruta del `.md` |
| `nombre` | Nombre de la página en Figma (por defecto, el `titulo` del frontmatter) |
| `--png` | Guarda una captura del primer slide |

**Cada presentación va a su propia página.** Volver a correr el mismo nombre
**reemplaza** el contenido de esa página, no lo duplica.

Para apuntar a otro archivo de Figma: `export FIGMA_FILE_KEY=...`

## Cómo funciona

```
decks/x.md  →  tree.mjs  →  árbol JSON  →  render-slides.js  →  frames en Figma
               (src/core)                   (use_figma)
```

`tree.mjs` corre en node y **reusa `src/core/` tal cual**: el mismo `parse` y la
misma geometría que ve el navegador. Si el export y la preview se separaran
alguna vez, el bug estaría ahí.

| Archivo | Rol |
|---|---|
| `tree.mjs` | deck → árbol de cajas + los SVG que necesita, en JSON |
| `render-slides.js` | Corre dentro de `use_figma`: árbol → frames |
| `push.py` | Orquesta: trocea, envía, renderiza, captura |
| `mcp.py` | Cliente del MCP remoto de Figma (token OAuth del llavero) |
| `review.py` | Diff visual: nombra las capas que se desviaron |
| `config.json` | `fileKey`, familias tipográficas y mapa peso → estilo |

## El límite de 50k

`use_figma` admite 50 000 caracteres por llamada. El árbol viaja en trozos de
38 000 por `sharedPluginData` bajo el namespace `bdb.slides`, y
`render-slides.js` lo reensambla dentro de Figma. Dentro del script no hay red
ni disco: **todo lo que se necesite tiene que ir en el árbol**, incluidos los
SVG de logos e iconos. `test.js` verifica que ningún SVG referenciado se quede
fuera.

## Tipografía

`Kiffo BDB` está disponible en Figma con los 6 pesos, y el proyecto usa esa
misma grafía desde que se aplicaron los Lineamientos de Marca — así que no hay
traducción de nombre entre el CSS y Figma.

Los pesos se mapean a estilos en `config.json`. Si una fuente no cargara,
`render-slides.js` lo detecta **antes** de construir nada, cae a Roboto y lo
reporta en `fuentesFaltantes` — en vez de reventar en el slide 6 dejando media
presentación a medias.

El texto va con ancho fijo y `textAutoResize = "HEIGHT"`: el Roboto de Figma es
2-6% más ancho que el `@font-face` del navegador, así que se deja que Figma
decida cuántas líneas ocupa en lugar de imponerle el alto estimado. El margen
que reserva el estimador de `layouts.js` (0.45 frente a 0.41 medido) absorbe la
diferencia.

## Límites conocidos

- **`--review` no es determinista todavía.** El render de referencia carga
  Roboto desde Google Fonts, y en headless la fuente a veces no llega antes de
  la captura: el texto sale con métricas de la fuente de respaldo y el diff
  reporta diferencias que no existen. Se mitigó con `display=block` y 20 s de
  presupuesto, pero sigue fallando en ~4 de 11 diapositivas. **Hasta arreglarlo,
  un `REVISAR` de `--review` hay que confirmarlo a ojo antes de creerlo.** El
  arreglo de verdad es embeber Roboto como data-URI, igual que Kiffo.

- **Imágenes bitmap** (`.png`, `.jpg`) salen como rectángulo gris: meter los
  bytes en el script reventaría el límite de 50k. Hay que subirlas a mano o con
  `upload_assets`. Los `.svg` sí entran. `push.py` los reporta en los avisos.
- **Sin componentes ni variables todavía.** Los frames son cajas absolutas.
  Cuando se repita un artefacto (tarjetas, por ejemplo) vale la pena volverlo
  componente; los iconos no, son demasiados y se usan sueltos.
- **Sin Auto Layout.** Los slides son geometría fija por diseño — es lo que hace
  posible que el mismo deck salga a PDF, HTML, Figma y PPTX. Agrupar la pila de
  contenido en auto-layout es una mejora pendiente, no un cambio de modelo.
- **De ida, no de vuelta.** Lo que el diseñador cambie en Figma no regresa
  al `.md`. La fuente de verdad es el archivo de texto.

## Requisitos

MCP de Figma autenticado: `/mcp` → `figma` → Authenticate. El servidor local de
Figma desktop **no sirve**, es de solo lectura.

`review.py` necesita `pillow` y `numpy`:

```bash
python3 -m pip install -r tools/figma/requirements.txt
```
