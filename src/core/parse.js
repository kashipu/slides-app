// .md → Deck IR. Corre igual en node y en el navegador: sin dependencias.
import { runs, plain } from './inline.js';
import { LAYOUTS } from './layouts.js';

// ponytail: el frontmatter del deck es un mapa plano de key: value — 4 líneas de regex
// en vez de una dependencia de YAML que además habría que bundlear para el navegador.
// Si algún día necesita listas o anidamiento, ahí sí entra `yaml`.
const pares = txt => Object.fromEntries(
  txt.split('\n').map(l => l.match(/^\s*([\w-]+)\s*:\s*(.*?)\s*$/)).filter(Boolean)
     .map(([, k, v]) => [k, v.replace(/^["']|["']$/g, '')]),
);

const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;

export function parse(md) {
  const avisos = [];
  let cuerpo = md.replace(/\r\n/g, '\n').trim();
  let meta = {};

  const fm = cuerpo.match(/^---\n([\s\S]*?)\n---\n?/);
  if (fm) { meta = pares(fm[1]); cuerpo = cuerpo.slice(fm[0].length); }
  meta.tema ??= 'light';

  const slides = cuerpo.split(/^---[ \t]*$/m).map(b => b.trim()).filter(Boolean)
    .map((bloque, i) => {
      const n = i + 1;
      const cfgM = bloque.match(/^<!--([\s\S]*?)-->\s*/);
      const cfg = cfgM ? pares(cfgM[1].split(';').join('\n')) : {};
      const lineas = (cfgM ? bloque.slice(cfgM[0].length) : bloque).split('\n');

      const layout = cfg.layout ?? 'title-body';
      if (!LAYOUTS.includes(layout)) avisos.push(`Slide ${n}: layout "${layout}" no existe → title-body`);

      let titulo = null;
      const items = [];
      const parrafos = [];
      for (const l of lineas) {
        const t = l.trim();
        if (!t) { if (parrafos.at(-1) !== '') parrafos.push(''); continue; }
        if (t.startsWith('# ')) { titulo = t.slice(2).trim(); continue; }
        if (t.startsWith('- ')) {
          // [categoria/nombre] al inicio del item = icono de sherpa-assets
          const ico = t.slice(2).match(/^\[([\w-]+\/[\w.-]+)\]\s*/);
          const [a, b] = t.slice(2 + (ico?.[0].length ?? 0)).split('|').map(s => s.trim());
          items.push({ runs: runs(a), extra: b ? runs(b) : null, icono: ico?.[1] ?? null });
          continue;
        }
        parrafos.push(t);
      }
      const body = parrafos.join('\n').trim();

      // Lint de voz Sherpa — avisos, nunca bloquea el export.
      if (titulo?.endsWith('.')) avisos.push(`Slide ${n}: los títulos no llevan punto final`);
      if (titulo && titulo.length > 80) avisos.push(`Slide ${n}: título de ${titulo.length} caracteres (máximo 80, ≤2 líneas)`);
      if (layout === 'bullets' && (items.length < 3 || items.length > 6)) avisos.push(`Slide ${n}: ${items.length} bullets (Sherpa pide 3–6, ideal 5)`);
      if (EMOJI.test(bloque)) avisos.push(`Slide ${n}: emoji — no se usan en el sistema Sherpa`);

      return {
        n, layout: LAYOUTS.includes(layout) ? layout : 'title-body',
        tag: cfg.tag ? runs(cfg.tag) : null,
        titulo: titulo ? runs(titulo) : null,
        body: body ? runs(body) : null,
        caption: cfg.caption ? runs(cfg.caption) : null,
        imagen: cfg.imagen ?? null,
        color: cfg.color ?? null,   // token de color para los iconos del slide
        items,
      };
    });

  for (const s of slides) {
    if (s.body && plain(s.body).split(/[.;]/).some(f => f.trim().split(/\s+/).length > 20))
      avisos.push(`Slide ${s.n}: frase de más de 20 palabras`);
  }

  // Las dos familias oficiales de Sherpa y nada más. `fuente: kiffo` en el
  // frontmatter pasa el cuerpo a Kiffo; por defecto el cuerpo es Roboto.
  const fuentes = meta.fuente === 'kiffo'
    ? { display: 'Kiffo BdB', body: 'Kiffo BdB' }
    : { display: 'Kiffo BdB', body: 'Roboto' };

  return { meta, fuentes, slides, avisos };
}
