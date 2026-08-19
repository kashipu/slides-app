// Catálogo de layouts. Un layout ya no fija qué contenido lleva: define el fondo,
// si hay cabecera (tag + título) y **dónde** se apilan los componentes.
// Lo que va dentro lo decide quien arma la diapositiva.
import { tokens as T } from './tokens.js';
import { plain } from './inline.js';
import { CANVAS, TYPE, alto, cols } from './geometria.js';
import { apilar, tinta } from './componentes.js';

export { CANVAS, TYPE, alto, cols } from './geometria.js';

const { mx, my, w: W, h: H } = CANVAS;

const txt = (runs, style, x, y, w, extra = {}) => runs?.length ? ({
  kind: 'text', x, y, w,
  h: alto(plain(runs), style, w),
  runs, ...style, color: T.fgDefault, align: 'left', ...extra,
}) : null;

/**
 * Catálogo. `regiones(s)` devuelve dónde se apilan los componentes; `especial`
 * son los layouts cuyo contenido es la propia estructura (portada, sección,
 * cierre, imagen a sangre) y no admiten componentes sueltos.
 */
const L = {
  contenido: {
    label: 'Contenido',
    bg: T.bgCanvas,
    cabecera: true,
    regiones: () => [{ x: mx, y: 340, w: cols(12) }],
  },
  'dos-columnas': {
    label: 'Dos columnas',
    bg: T.bgCanvas,
    cabecera: true,
    regiones: () => [
      { x: mx, y: 340, w: cols(6) },
      { x: mx + cols(6) + CANVAS.gut, y: 340, w: cols(6) },
    ],
  },
  destacado: {
    label: 'Destacado',
    bg: T.bgSubtle,
    cabecera: true,
    regiones: () => [{ x: mx, y: 360, w: cols(12) }],
  },

  // --- especiales: su contenido es la estructura, no componentes ---
  cover: {
    label: 'Portada', bg: T.bgInverse, dark: true, especial: true,
    pintar: (s, c) => [
      { kind: 'svg', x: mx, y: my, w: 320, h: 76, src: 'logo-white' },
      txt(s.titulo, TYPE.display, mx, 600, cols(11), { color: T.fgOnDark }),
      txt(s.body, TYPE.bodyL, mx, 780, cols(8), { color: T.fgOnDarkSubtle }),
      c.meta.fecha && txt([{ t: c.meta.fecha, b: false }], TYPE.caption, mx, 936, cols(8), { color: T.fgOnDarkFaint }),
    ],
  },
  section: {
    label: 'Sección', bg: T.bgInverse, dark: true, especial: true,
    pintar: s => [
      txt(s.tag, TYPE.tag, mx, 420, cols(10), { color: T.brandYellow }),
      txt(s.titulo, TYPE.h1, mx, 476, cols(10), { color: T.fgOnDark }),
    ],
  },
  imagen: {
    label: 'Imagen a sangre', bg: T.bgMuted, especial: true,
    pintar: s => [
      s.imagen && { kind: 'image', x: 0, y: 0, w: W, h: H, src: s.imagen, fit: 'cover' },
      s.titulo && { kind: 'rect', x: 0, y: 640, w: W, h: 440, fill: 'linear-gradient(transparent, rgba(0,0,0,.72))' },
      txt(s.titulo, TYPE.h2, mx, 780, cols(10), { color: T.fgOnDark }),
      txt(s.caption, TYPE.caption, mx, 960, cols(8), { color: T.fgOnDarkSubtle }),
    ],
  },
  cierre: {
    label: 'Cierre', bg: T.bgInverse, dark: true, especial: true,
    pintar: s => [
      { kind: 'svg', x: (W - 360) / 2, y: 400, w: 360, h: 86, src: 'logo-white' },
      txt(s.titulo, TYPE.h2, mx, 620, cols(12), { color: T.fgOnDark, align: 'center' }),
      txt(s.body, TYPE.bodyL, mx + cols(2), 740, cols(8), { color: T.fgOnDarkSubtle, align: 'center' }),
    ],
  },
};

export const LAYOUTS = Object.keys(L);
export const CATALOGO = L;
export const esEspecial = l => !!L[l]?.especial;
export const numRegiones = l => (L[l]?.regiones ? L[l].regiones().length : 0);

const SIN_CHROME = new Set(['cover', 'section', 'cierre', 'imagen']);

/** cabecera común: tag + título, apilados */
function cabecera(s) {
  const boxes = [];
  let y = my;
  const t = txt(s.tag, TYPE.tag, mx, y, cols(10), { color: T.fgAccent });
  if (t) { boxes.push(t); y = t.y + t.h + 24; }
  const h = txt(s.titulo, TYPE.h2, mx, y, cols(10));
  if (h) { boxes.push(h); y = h.y + h.h; }
  return { boxes, y };
}

/** slide del IR → { bg, dark, boxes } */
export function componer(slide, ctx) {
  const def = L[slide.layout] ?? L.contenido;
  const boxes = [];

  if (def.especial) {
    boxes.push(...def.pintar(slide, ctx).filter(Boolean));
  } else {
    const cab = def.cabecera ? cabecera(slide) : { boxes: [], y: my };
    boxes.push(...cab.boxes);
    const pintura = { tinta: tinta(slide.color) };
    def.regiones(slide).forEach((r, i) => {
      // la región arranca donde termine la cabecera, si esta se pasó de largo
      const region = { ...r, y: Math.max(r.y, cab.y + 56) };
      boxes.push(...apilar(slide.regiones?.[i] ?? [], region, pintura).boxes);
    });
  }

  if (!SIN_CHROME.has(slide.layout)) {
    boxes.push(
      { kind: 'svg', x: 1776, y: my, w: 32, h: 32, src: 'isotipo' },
      txt([{ t: String(ctx.n), b: false }], TYPE.footer, 1600, 960, 208, { color: T.fgDisabled, align: 'right' }),
    );
  }
  return { bg: def.bg, dark: def.dark, boxes: boxes.filter(Boolean) };
}
