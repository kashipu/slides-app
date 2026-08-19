// Catálogo de layouts. Cada uno recibe un slide del IR y devuelve una lista plana
// de cajas posicionadas en px de canvas. HTML, Figma y PPTX solo dibujan cajas —
// ninguno reinterpreta el Markdown ni recalcula geometría.
import { tokens as T } from './tokens.js';
import { plain } from './inline.js';

export const CANVAS = {
  w: 1920, h: 1080,
  mx: 112, my: 96,          // márgenes
  col: 112, gut: 32,        // 12 columnas: 112 + 12*112 + 11*32 + 112 = 1920
  content: 1696,
};

/** ancho de n columnas */
export const cols = n => n * CANVAS.col + (n - 1) * CANVAS.gut;

export const TYPE = {
  display: { size: 120, font: 'display', weight: 500, lh: 1.1 },
  h1:      { size: 88,  font: 'display', weight: 500, lh: 1.15 },
  h2:      { size: 64,  font: 'display', weight: 500, lh: 1.2 },
  h3:      { size: 40,  font: 'display', weight: 500, lh: 1.25 },
  stat:    { size: 96,  font: 'display', weight: 600, lh: 1.1 },
  quote:   { size: 56,  font: 'display', weight: 300, lh: 1.3 },
  bodyL:   { size: 32,  font: 'body',    weight: 400, lh: 1.5 },
  body:    { size: 28,  font: 'body',    weight: 400, lh: 1.5 },
  tag:     { size: 24,  font: 'body',    weight: 600, lh: 1.3, tracking: 1.6 },
  caption: { size: 20,  font: 'body',    weight: 400, lh: 1.5 },
  footer:  { size: 16,  font: 'body',    weight: 400, lh: 1.5 },
};

// ponytail: estimación de alto por ancho medio de carácter, no métricas reales.
// Alcanza con slots holgados + el lint de longitud. Si algo se desborda, el upgrade
// es medir con canvas measureText en la preview y cachear el resultado en el IR.
// Calibrado midiendo Kiffo BdB 120px y Roboto 32px renderizados a 1920 (0.41 y 0.48
// reales); se deja margen al alza porque quedarse corto solapa cajas y pasarse solo
// reserva aire. Esta es la perilla: si un título se parte de más, bájalos.
const AVG = { display: 0.45, body: 0.50 };
export const alto = (texto, { size, font, lh }, w) =>
  Math.max(1, Math.ceil((texto.length * size * AVG[font]) / w)) * size * lh;

// Devuelve null si no hay texto: mientras escribes, un slide pasa por estados
// incompletos (layout declarado y título todavía vacío) y el render no puede
// reventar — una excepción aquí congela la preview entera.
const txt = (runs, style, x, y, w, extra = {}) => runs?.length ? ({
  kind: 'text', x, y, w,
  h: alto(plain(runs), style, w),
  runs, ...style, color: T.fgDefault, align: 'left', ...extra,
}) : null;

/** apila bloques verticalmente; devuelve las cajas y el y final */
function stack(x, y, w, bloques) {
  const boxes = [];
  for (const b of bloques) {
    const caja = b && txt(b.runs, b.style, x, y + (b.gap ?? 0), b.w ?? w, b.extra);
    if (!caja) continue;
    boxes.push(caja);
    y = caja.y + caja.h;
  }
  return { boxes, y };
}

const { mx, my, w: W, h: H } = CANVAS;

/** color de acento del slide: `color: mustard-800` en el comentario, si no el azul interactivo */
const camel = s => s.replace(/-(\w)/g, (_, c) => c.toUpperCase());
const color = s => T[camel(s.color ?? '')] ?? T.accentPrimary;

/** tag + título: la cabecera común de los layouts claros */
function cabecera(s, y = my) {
  return stack(mx, y, cols(10), [
    s.tag && { runs: s.tag, style: TYPE.tag, extra: { color: T.fgAccent } },
    s.titulo && { runs: s.titulo, style: TYPE.h2, gap: s.tag ? 24 : 0 },
  ]);
}

const L = {
  cover: (s, c) => ({
    bg: T.bgInverse, dark: true,
    boxes: [
      { kind: 'svg', x: mx, y: my, w: 320, h: 76, src: 'logo-white' },
      ...stack(mx, 600, cols(11), [
        { runs: s.titulo, style: TYPE.display, extra: { color: T.fgOnDark } },
        s.body && { runs: s.body, style: TYPE.bodyL, gap: 32, w: cols(8), extra: { color: T.fgOnDarkSubtle } },
      ]).boxes,
      c.meta.fecha && txt([{ t: c.meta.fecha, b: false }], TYPE.caption, mx, 936, cols(8), { color: T.fgOnDarkFaint }),
    ].filter(Boolean),
  }),

  section: s => ({
    bg: T.bgInverse, dark: true,
    boxes: stack(mx, 420, cols(10), [
      s.tag && { runs: s.tag, style: TYPE.tag, extra: { color: T.brandYellow } },
      { runs: s.titulo, style: TYPE.h1, gap: s.tag ? 24 : 0, extra: { color: T.fgOnDark } },
    ]).boxes,
  }),

  'title-body': s => {
    const cab = cabecera(s);
    return { bg: T.bgCanvas, boxes: [
      ...cab.boxes,
      ...(s.body ? stack(mx, Math.max(cab.y + 48, 320), cols(8), [{ runs: s.body, style: TYPE.bodyL, extra: { color: T.fgMuted } }]).boxes : []),
    ] };
  },

  bullets: s => {
    const cab = cabecera(s);
    const boxes = [...cab.boxes];
    const tinta = color(s);
    const conIcono = s.items.some(it => it.icono);
    const sangria = conIcono ? 72 : 56;
    let y = Math.max(cab.y + 56, 340);
    for (const it of s.items) {
      const caja = txt(it.runs, TYPE.bodyL, mx + sangria, y, cols(12) - sangria, { color: T.fgMuted });
      if (!caja) continue;
      const linea = TYPE.bodyL.size * TYPE.bodyL.lh;
      boxes.push(
        it.icono
          ? { kind: 'icon', x: mx, y: y + (linea - 44) / 2, w: 44, h: 44, src: it.icono, fill: tinta }
          : { kind: 'rect', x: mx, y: y + (linea - 14) / 2, w: 14, h: 14, fill: tinta, r: 7 },
        caja,
      );
      y = caja.y + caja.h + (conIcono ? 40 : 32);
    }
    return { bg: T.bgCanvas, boxes };
  },

  'two-cols': s => {
    const cab = cabecera(s);
    const tinta = color(s);
    const conIcono = s.items.some(it => it.icono);
    const y0 = Math.max(cab.y + 56, 340);
    const yRegla = y0 + (conIcono ? 80 : 0);
    const boxes = [...cab.boxes];
    s.items.slice(0, 2).forEach((it, i) => {
      const x = mx + i * (cols(6) + CANVAS.gut);
      if (it.icono) boxes.push({ kind: 'icon', x, y: y0, w: 56, h: 56, src: it.icono, fill: tinta });
      boxes.push(
        { kind: 'rect', x, y: yRegla, w: cols(6), h: 4, fill: tinta, r: 2 },
        ...stack(x, yRegla + 32, cols(6), [
          { runs: it.runs, style: TYPE.h3 },
          it.extra && { runs: it.extra, style: TYPE.body, gap: 20, extra: { color: T.fgMuted } },
        ]).boxes,
      );
    });
    return { bg: T.bgCanvas, boxes };
  },

  stats: s => {
    const cab = cabecera(s);
    const n = Math.min(s.items.length, 4) || 1;
    const gap = 48;
    const wItem = (cols(12) - gap * (n - 1)) / n;
    const boxes = [...cab.boxes];
    s.items.slice(0, 4).forEach((it, i) => {
      const x = mx + i * (wItem + gap);
      boxes.push(...stack(x, 470, wItem, [
        { runs: it.runs, style: TYPE.stat, extra: { color: T.accentPrimary } },
        it.extra && { runs: it.extra, style: TYPE.caption, gap: 16, extra: { color: T.fgMuted, size: 24 } },
      ]).boxes);
    });
    return { bg: T.bgSubtle, boxes };
  },

  image: (s) => ({
    bg: T.bgMuted,
    boxes: [
      s.imagen && { kind: 'image', x: 0, y: 0, w: W, h: H, src: s.imagen, fit: 'cover' },
      s.titulo && { kind: 'rect', x: 0, y: 640, w: W, h: 440, fill: 'linear-gradient(transparent, rgba(0,0,0,.72))' },
      s.titulo && txt(s.titulo, TYPE.h2, mx, 780, cols(10), { color: T.fgOnDark }),
      s.caption && txt(s.caption, TYPE.caption, mx, 960, cols(8), { color: T.fgOnDarkSubtle }),
    ].filter(Boolean),
  }),

  quote: s => ({
    bg: T.bgSubtle,
    boxes: stack(224, 380, 1472, [
      { runs: s.body, style: TYPE.quote },
      s.caption && { runs: s.caption, style: TYPE.caption, gap: 40, extra: { color: T.fgMuted, size: 24 } },
    ]).boxes,
  }),

  closing: s => ({
    bg: T.bgInverse, dark: true,
    boxes: [
      { kind: 'svg', x: (W - 360) / 2, y: 400, w: 360, h: 86, src: 'logo-white' },
      txt(s.titulo, TYPE.h2, mx, 620, cols(12), { color: T.fgOnDark, align: 'center' }),
      s.body && txt(s.body, TYPE.bodyL, mx + cols(2), 740, cols(8), { color: T.fgOnDarkSubtle, align: 'center' }),
    ].filter(Boolean),
  }),
};

export const LAYOUTS = Object.keys(L);
const SIN_CHROME = new Set(['cover', 'section', 'closing', 'image']);

/** slide del IR → { bg, dark, boxes } */
export function componer(slide, ctx) {
  const fn = L[slide.layout] ?? L['title-body'];
  const r = fn(slide, ctx);
  if (SIN_CHROME.has(slide.layout)) return r;
  r.boxes.push(
    { kind: 'svg', x: 1776, y: my, w: 32, h: 32, src: 'isotipo' },
    txt([{ t: String(ctx.n), b: false }], TYPE.footer, 1600, 960, 208, { color: T.fgDisabled, align: 'right' }),
  );
  return r;
}
