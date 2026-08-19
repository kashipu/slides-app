// Deck IR → un único .html autocontenido: fuentes, logos, iconos e imágenes
// embebidos como data-URI. Se abre sin servidor, sin red y sin este proyecto al lado.
import { renderToStaticMarkup } from 'react-dom/server';
import { CANVAS } from '../core/layouts.js';
import { tokens as T } from '../core/tokens.js';
import { Deck } from '../ui/Deck.jsx';

const KIFFO = [['Light', 300], ['Regular', 400], ['Medium', 500], ['SemiBold', 600]];

const aDataURI = blob => new Promise(ok => {
  const fr = new FileReader();
  fr.onload = () => ok(fr.result);
  fr.readAsDataURL(blob);
});

const dataURI = async url => aDataURI(await (await fetch(url)).blob());

// Roboto no vive en el repo. Se baja de Google Fonts y se inlinea, con timeout:
// sin él, exportar sin conexión se cuelga para siempre en vez de degradar.
const CORTE = 8000;
async function roboto() {
  const url = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap';
  const css = await (await fetch(url, { signal: AbortSignal.timeout(CORTE) })).text();

  // Google sirve ~8 subsets por peso (cirílico, griego, vietnamita…). Nos quedamos con
  // el latino, que ya cubre el español con acentos y ñ: 3 archivos en vez de 24.
  let latino = css.split('@font-face')
    .filter(b => b.includes('U+0000-00FF'))
    .map(b => `@font-face${b}`).join('\n');

  const urls = [...new Set(latino.match(/https:\/\/fonts\.gstatic\.com\/[^)]+/g) ?? [])];
  const datos = await Promise.all(urls.map(async u =>
    aDataURI(await (await fetch(u, { signal: AbortSignal.timeout(CORTE) })).blob())));
  urls.forEach((u, i) => { latino = latino.replaceAll(u, datos[i]); });
  return latino;
}

// Assets referenciados por el markup: src="/base/…" de logos e imágenes, y
// url(/assets/iconos/…) de las máscaras de icono. Un solo barrido para los dos.
const REFS = /(?:src="|url\()(\/(?:assets|base|decks)\/[^")]+)/g;

async function embeber(markup) {
  const rutas = [...new Set([...markup.matchAll(REFS)].map(m => m[1]))];
  const datos = await Promise.all(rutas.map(async r => {
    try { return await dataURI(r); } catch { console.warn('no se pudo embeber', r); return null; }
  }));
  rutas.forEach((r, i) => { if (datos[i]) markup = markup.replaceAll(r, datos[i]); });
  return markup;
}

/** @returns {Promise<string>} el documento HTML completo */
export async function exportarHTML(ir) {
  const markup = await embeber(renderToStaticMarkup(<Deck ir={ir} />));

  const caras = await Promise.all(KIFFO.map(async ([nombre, peso]) =>
    `@font-face{font-family:"Kiffo BDB";src:url("${await dataURI(`/base/fonts/KiffoBDB-${nombre}.otf`)}") format("opentype");font-weight:${peso};font-style:normal}`));

  let fuenteBody;
  try { fuenteBody = await roboto(); }
  catch { fuenteBody = '/* Roboto no se pudo embeber; se usa la sans del sistema */'; }

  const titulo = (ir.meta.titulo ?? 'Presentación').replace(/[<&]/g, c => (c === '<' ? '&lt;' : '&amp;'));
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<title>${titulo}</title>
<style>
${caras.join('\n')}
${fuenteBody}
*{box-sizing:border-box}
html,body{margin:0;background:${T.carbon50}}
#deck{display:flex;flex-direction:column;gap:24px;padding:24px;width:max-content}
.slide{box-shadow:${T.shadowBox};border-radius:2px;flex:0 0 auto}
@page{size:${CANVAS.w}px ${CANVAS.h}px;margin:0}
@media print{html,body{background:#fff}#deck{gap:0;padding:0;zoom:1!important}
.slide{box-shadow:none;border-radius:0;break-after:page}}
</style></head>
<body>${markup}
<script>
const d=document.getElementById('deck');
const fit=()=>d.style.zoom=(innerWidth-48)/${CANVAS.w};
addEventListener('resize',fit);fit();
</${'script'}></body></html>`;
}

/** Dispara la descarga del .html */
export async function descargarHTML(ir) {
  const html = await exportarHTML(ir);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
  a.download = `${(ir.meta.titulo ?? 'deck').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.html`;
  a.click();
  URL.revokeObjectURL(a.href);
}
