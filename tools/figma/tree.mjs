// deck.md → árbol JSON para Figma.  node tools/figma/tree.mjs decks/plantilla.md
//
// Corre en node reusando src/core/ tal cual: el mismo parse y la misma geometría
// que ve el navegador. Si esto y la preview se separaran, el bug estaría aquí.
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from '../../src/core/parse.js';
import { componer } from '../../src/core/layouts.js';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const CFG = JSON.parse(readFileSync(`${RAIZ}/tools/figma/config.json`, 'utf8'));

const RUTAS_SVG = {
  'logo-white': 'base/assets/logo-white.svg',
  logo: 'base/assets/logo.svg',
  isotipo: 'base/assets/isotipo.svg',
};

const leerSVG = ruta => {
  try { return readFileSync(resolve(RAIZ, ruta), 'utf8'); }
  catch { return null; }
};

export function arbol(md, nombreDeck) {
  const ir = parse(md);
  const svgs = {};
  const faltan = [];
  const bitmaps = [];

  const pedirSVG = (clave, ruta) => {
    if (svgs[clave]) return true;
    const txt = leerSVG(ruta);
    if (txt) { svgs[clave] = txt; return true; }
    faltan.push(ruta);
    return false;
  };

  const slides = ir.slides.map(s => {
    const { bg, boxes } = componer(s, { meta: ir.meta, n: s.n, total: ir.slides.length });
    const salida = [];
    for (const b of boxes) {
      if (b.kind === 'icon') {
        if (pedirSVG(b.src, `assets/iconos/${b.src}.svg`)) salida.push(b);
        continue;
      }
      if (b.kind === 'svg') {
        if (pedirSVG(b.src, RUTAS_SVG[b.src] ?? b.src)) salida.push(b);
        continue;
      }
      if (b.kind === 'image') {
        // ponytail: solo SVG. Un bitmap exige figma.createImage con los bytes
        // dentro del script, y eso revienta el límite de 50k de use_figma.
        // Se marca y sale como rectángulo, igual que hace la tool de banca-móvil.
        if (b.src.endsWith('.svg') && pedirSVG(b.src, b.src)) salida.push({ ...b, kind: 'svg' });
        else { bitmaps.push(b.src); salida.push({ kind: 'rect', x: b.x, y: b.y, w: b.w, h: b.h, fill: '#E6E6E6' }); }
        continue;
      }
      salida.push(b);
    }
    return { n: s.n, nombre: `${s.n} · ${s.layout}`, bg, boxes: salida };
  });

  return {
    pagina: nombreDeck || ir.meta.titulo || 'Presentación',
    fuentes: { display: CFG.fuentes.display, body: ir.fuentes.body === 'Kiffo BdB' ? CFG.fuentes.display : CFG.fuentes.body },
    estilos: CFG.estilos,
    separacion: CFG.separacionFrames,
    slides,
    svgs,
    avisos: [
      ...faltan.map(r => `no encontré ${r}`),
      ...bitmaps.map(r => `${r} es un bitmap: sale como rectángulo gris (sube la imagen a mano en Figma)`),
      ...ir.avisos,
    ],
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const ruta = process.argv[2];
  if (!ruta) { console.error('uso: node tools/figma/tree.mjs decks/mi-deck.md ["Nombre de la página"]'); process.exit(1); }
  const a = arbol(readFileSync(ruta, 'utf8'), process.argv[3]);
  for (const x of a.avisos) console.error(`aviso: ${x}`);
  process.stdout.write(JSON.stringify(a));
}
