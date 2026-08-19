// Catálogo de componentes. Un componente sabe dos cosas: cuánto mide con un
// ancho dado, y qué cajas produce. Nada más — no conoce el slide ni la página.
//
// Esto es lo que permite que el contenido sea armable sin romper el contrato:
// los componentes se APILAN en regiones de geometría conocida, no flotan libres.
// Si un día pudieran posicionarse a mano, se caen PPTX y Figma con ellos.
import { tokens as T } from './tokens.js';
import { plain } from './inline.js';
import { TYPE, alto, cols } from './geometria.js';

const txt = (runs, style, x, y, w, extra = {}) => runs?.length ? ({
  kind: 'text', x, y, w,
  h: alto(plain(runs), style, w),
  runs, ...style, color: T.fgDefault, align: 'left', ...extra,
}) : null;

/** apila bloques verticalmente desde y; devuelve cajas y el y final */
function pila(x, y, w, bloques) {
  const boxes = [];
  for (const b of bloques) {
    const caja = b && txt(b.runs, b.style, x, y + (b.gap ?? 0), b.w ?? w, b.extra);
    if (!caja) continue;
    boxes.push(caja);
    y = caja.y + caja.h;
  }
  return { boxes, y };
}

/** color de acento del slide, con caída al azul interactivo */
const camel = s => s.replace(/-(\w)/g, (_, c) => c.toUpperCase());
export const tinta = color => T[camel(color ?? '')] ?? T.accentPrimary;

// --- componentes -----------------------------------------------------------
// pintar(c, {x, y, w, ctx}) → { boxes, alto }

const parrafo = (c, { x, y, w }) => {
  const r = pila(x, y, w, [{ runs: c.texto, style: TYPE.bodyL, extra: { color: T.fgMuted } }]);
  return { boxes: r.boxes, alto: r.y - y };
};

const bullets = (c, { x, y, w, ctx }) => {
  const boxes = [];
  const conIcono = c.items.some(it => it.icono);
  const sangria = conIcono ? 72 : 56;
  const linea = TYPE.bodyL.size * TYPE.bodyL.lh;
  let cy = y;
  for (const it of c.items) {
    const caja = txt(it.runs, TYPE.bodyL, x + sangria, cy, w - sangria, { color: T.fgMuted });
    if (!caja) continue;
    boxes.push(
      it.icono
        ? { kind: 'icon', x, y: cy + (linea - 44) / 2, w: 44, h: 44, src: it.icono, fill: ctx.tinta }
        : { kind: 'rect', x, y: cy + (linea - 14) / 2, w: 14, h: 14, fill: ctx.tinta, r: 7 },
      caja,
    );
    cy = caja.y + caja.h + (conIcono ? 40 : 32);
  }
  return { boxes, alto: Math.max(0, cy - y - (conIcono ? 40 : 32)) };
};

const stats = (c, { x, y, w, ctx }) => {
  const n = Math.min(c.items.length, 4) || 1;
  const gap = 48;
  const ancho = (w - gap * (n - 1)) / n;
  const boxes = [];
  let fin = y;
  c.items.slice(0, 4).forEach((it, i) => {
    const r = pila(x + i * (ancho + gap), y, ancho, [
      { runs: it.runs, style: TYPE.stat, extra: { color: ctx.tinta } },
      it.extra && { runs: it.extra, style: TYPE.caption, gap: 16, extra: { color: T.fgMuted, size: 24 } },
    ]);
    boxes.push(...r.boxes);
    fin = Math.max(fin, r.y);
  });
  return { boxes, alto: fin - y };
};

const cita = (c, { x, y, w }) => {
  const r = pila(x, y, w, [
    { runs: c.texto, style: TYPE.quote },
    c.autor && { runs: c.autor, style: TYPE.caption, gap: 40, extra: { color: T.fgMuted, size: 24 } },
  ]);
  return { boxes: r.boxes, alto: r.y - y };
};

const tarjetas = (c, { x, y, w, ctx }) => {
  const n = Math.min(Math.max(c.items.length, 1), 4);
  const gap = 32;
  const ancho = (w - gap * (n - 1)) / n;
  const boxes = [];
  let fin = y;
  c.items.slice(0, 4).forEach((it, i) => {
    const cx = x + i * (ancho + gap);
    if (it.icono) boxes.push({ kind: 'icon', x: cx + 32, y: y + 32, w: 48, h: 48, src: it.icono, fill: ctx.tinta });
    const r = pila(cx + 32, y + (it.icono ? 104 : 32), ancho - 64, [
      { runs: it.runs, style: TYPE.h3 },
      it.extra && { runs: it.extra, style: TYPE.body, gap: 16, extra: { color: T.fgMuted } },
    ]);
    boxes.push(...r.boxes);
    fin = Math.max(fin, r.y + 32);
  });
  // la tarjeta se dibuja detrás, ya sabiendo el alto de la más alta
  const altoCaja = fin - y;
  const fondos = c.items.slice(0, 4).map((_, i) => ({
    kind: 'rect', x: x + i * (ancho + gap), y, w: ancho, h: altoCaja,
    fill: T.bgSubtle, r: 20,
  }));
  return { boxes: [...fondos, ...boxes], alto: altoCaja };
};

const imagen = (c, { x, y, w }) => {
  const h = Math.round(w * 9 / 16);
  const boxes = [{ kind: 'image', x, y, w, h, src: c.src, fit: 'cover' }];
  const pie = txt(c.pie, TYPE.caption, x, y + h + 16, w, { color: T.fgMuted });
  if (pie) boxes.push(pie);
  return { boxes, alto: h + (pie ? 16 + pie.h : 0) };
};

// `campos` describe el componente para el formulario Y para el prompt de una IA
// que arme presentaciones: una sola fuente, en core, para que no se separen.
export const COMPONENTES = {
  parrafo: {
    label: 'Párrafo', pintar: parrafo, gap: 40,
    ayuda: 'Texto corrido. Frases de menos de 20 palabras.',
    campos: [{ k: 'texto', tipo: 'parrafo', label: 'Texto' }],
  },
  bullets: {
    label: 'Puntos', pintar: bullets, gap: 48,
    ayuda: 'Lista de ideas paralelas. Sherpa pide de 3 a 6, idealmente 5.',
    campos: [{ k: 'items', tipo: 'lista', label: 'Puntos', icono: true, min: 3, max: 6 }],
  },
  stats: {
    label: 'Cifras', pintar: stats, gap: 56,
    ayuda: 'De 2 a 4 cifras clave. Los montos siempre en dígitos.',
    campos: [{ k: 'items', tipo: 'lista', label: 'Cifras', pares: ['Valor', 'Etiqueta'], min: 2, max: 4 }],
  },
  cita: {
    label: 'Cita', pintar: cita, gap: 48,
    ayuda: 'Cita textual, sin comillas. La atribución va aparte.',
    campos: [
      { k: 'texto', tipo: 'parrafo', label: 'Cita' },
      { k: 'autor', tipo: 'linea', label: 'Quién lo dijo' },
    ],
  },
  tarjetas: {
    label: 'Tarjetas', pintar: tarjetas, gap: 48,
    ayuda: 'De 2 a 4 bloques con título y texto, cada uno con su icono.',
    campos: [{ k: 'items', tipo: 'lista', label: 'Tarjetas', icono: true, pares: ['Título', 'Texto'], min: 2, max: 4 }],
  },
  imagen: {
    label: 'Imagen', pintar: imagen, gap: 40,
    ayuda: 'Imagen 16:9 dentro de la región, con pie opcional.',
    campos: [
      { k: 'src', tipo: 'imagen', label: 'Imagen' },
      { k: 'pie', tipo: 'linea', label: 'Pie' },
    ],
  },
};

export const TIPOS = Object.keys(COMPONENTES);

/** apila una lista de componentes en una región; devuelve las cajas */
export function apilar(componentes, region, ctx) {
  const boxes = [];
  let y = region.y;
  for (const c of componentes) {
    const def = COMPONENTES[c.tipo];
    if (!def) continue;
    const r = def.pintar(c, { x: region.x, y, w: region.w, ctx });
    boxes.push(...r.boxes);
    y += r.alto + def.gap;
  }
  return { boxes, alto: y - region.y };
}
