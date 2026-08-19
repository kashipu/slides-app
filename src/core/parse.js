// .md → Deck IR. Corre igual en node y en el navegador: sin dependencias.
import { runs, plain } from './inline.js';
import { LAYOUTS, esEspecial, numRegiones } from './layouts.js';
import { TIPOS } from './componentes.js';

// ponytail: el frontmatter del deck es un mapa plano de key: value — 4 líneas de
// regex en vez de una dependencia de YAML que además habría que bundlear para el
// navegador. Si algún día necesita listas o anidamiento, ahí sí entra `yaml`.
const pares = txt => Object.fromEntries(
  txt.split('\n').map(l => l.match(/^\s*([\w-]+)\s*:\s*(.*?)\s*$/)).filter(Boolean)
     .map(([, k, v]) => [k, v.replace(/^["']|["']$/g, '')]),
);

const opciones = txt => pares(txt.split(';').join('\n'));

const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;

// Los layouts de antes de que existieran los componentes. Se mapean al nuevo
// catálogo y su contenido suelto se envuelve en el componente que corresponda,
// para que un deck viejo (o guardado en localStorage) siga abriendo.
const ALIAS = {
  'title-body': ['contenido', 'parrafo'],
  bullets: ['contenido', 'bullets'],
  stats: ['contenido', 'stats'],
  'two-cols': ['dos-columnas', 'tarjetas'],
  quote: ['destacado', 'cita'],
  closing: ['cierre', null],
  image: ['imagen', null],
};

/** "- [cat/nombre] Texto | Extra" → item */
function item(linea) {
  const ico = linea.match(/^\[([\w-]+\/[\w.-]+)\]\s*/);
  const [a, b] = linea.slice(ico?.[0].length ?? 0).split('|').map(s => s.trim());
  return { runs: runs(a), extra: b ? runs(b) : null, icono: ico?.[1] ?? null };
}

/** líneas de un bloque de componente → campos del componente */
function componente(tipo, cfg, lineas) {
  const items = [];
  const sueltas = [];
  for (const l of lineas) {
    const t = l.trim();
    if (!t) { if (sueltas.at(-1) !== '') sueltas.push(''); continue; }
    if (t.startsWith('- ')) items.push(item(t.slice(2)));
    else sueltas.push(t);
  }
  const texto = sueltas.join('\n').trim();

  switch (tipo) {
    case 'bullets':
    case 'stats':
    case 'tarjetas':
      return { tipo, items };
    case 'cita':
      // `caption` es como se llamaba la atribución en el formato anterior
      return { tipo, texto: runs(texto), autor: (cfg.autor || cfg.caption) ? runs(cfg.autor || cfg.caption) : null };
    case 'imagen':
      return { tipo, src: cfg.src ?? '', pie: cfg.pie ? runs(cfg.pie) : null };
    default:
      return { tipo: 'parrafo', texto: runs(texto) };
  }
}

/** parte un bloque de slide en su configuración y sus componentes */
function trocear(bloque) {
  // Un comentario cuyo primer segmento no lleva `:` es un componente; con `:`
  // es la configuración del slide. Sin ambigüedad y con una sola regex.
  const partes = bloque.split(/<!--([\s\S]*?)-->/);
  const salida = { cfg: {}, cuerpo: partes[0], comps: [] };
  for (let i = 1; i < partes.length; i += 2) {
    const dentro = partes[i].trim();
    const cuerpo = partes[i + 1] ?? '';
    const primero = dentro.split(';')[0].trim();
    if (primero.includes(':')) {
      Object.assign(salida.cfg, opciones(dentro));
      salida.cuerpo += cuerpo;
    } else {
      salida.comps.push({ tipo: primero, cfg: opciones(dentro.slice(primero.length).replace(/^;/, '')), cuerpo });
    }
  }
  return salida;
}

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
      const { cfg, cuerpo: texto, comps } = trocear(bloque);

      const pedido = cfg.layout ?? 'contenido';
      const [alias, implicito] = ALIAS[pedido] ?? [];
      const layout = alias ?? pedido;
      if (!LAYOUTS.includes(layout)) avisos.push(`Slide ${n}: layout "${pedido}" no existe → contenido`);
      const usado = LAYOUTS.includes(layout) ? layout : 'contenido';

      // Título, items y párrafos sueltos del slide (fuera de todo componente)
      let titulo = null;
      const sueltos = [];
      const parrafos = [];
      for (const l of texto.split('\n')) {
        const t = l.trim();
        if (!t) { if (parrafos.at(-1) !== '') parrafos.push(''); continue; }
        if (t.startsWith('# ')) { titulo = t.slice(2).trim(); continue; }
        if (t.startsWith('- ')) { sueltos.push(t.slice(2)); continue; }
        parrafos.push(t);
      }
      let body = parrafos.join('\n').trim();

      // Componentes por región; `<!-- columna -->` pasa a la siguiente
      const total = Math.max(1, numRegiones(usado));
      const regiones = Array.from({ length: total }, () => []);
      let r = 0;

      // Contenido suelto sin componente declarado: se envuelve solo. Hace que el
      // formato perdone (y que los decks del formato anterior sigan abriendo).
      if (!esEspecial(usado)) {
        const tipoLista = implicito && implicito !== 'parrafo' && implicito !== 'cita' ? implicito : 'bullets';
        // El texto suelto va primero: es el orden en que se lee en el archivo.
        // Sin esto se descartaría en silencio cuando el slide ya tiene componentes.
        if (body) {
          regiones[0].push(componente(implicito === 'cita' ? 'cita' : 'parrafo', cfg, body.split('\n')));
          body = '';
        }
        if (sueltos.length) regiones[0].push(componente(tipoLista, {}, sueltos.map(x => `- ${x}`)));
      }

      for (const c of comps) {
        if (c.tipo === 'columna') { r = Math.min(r + 1, total - 1); continue; }
        if (!TIPOS.includes(c.tipo)) { avisos.push(`Slide ${n}: componente "${c.tipo}" no existe`); continue; }
        regiones[r].push(componente(c.tipo, c.cfg, c.cuerpo.split('\n')));
      }

      // Lint de voz Sherpa — avisos, nunca bloquea el export.
      if (titulo?.endsWith('.')) avisos.push(`Slide ${n}: los títulos no llevan punto final`);
      if (titulo && titulo.length > 80) avisos.push(`Slide ${n}: título de ${titulo.length} caracteres (máximo 80, ≤2 líneas)`);
      for (const c of regiones.flat()) {
        if (c.tipo === 'bullets' && (c.items.length < 3 || c.items.length > 6)) {
          avisos.push(`Slide ${n}: ${c.items.length} puntos (Sherpa pide 3–6, ideal 5)`);
        }
      }
      if (EMOJI.test(bloque)) avisos.push(`Slide ${n}: emoji — no se usan en el sistema Sherpa`);

      return {
        n, layout: usado,
        tag: cfg.tag ? runs(cfg.tag) : null,
        titulo: titulo ? runs(titulo) : null,
        body: body ? runs(body) : null,
        caption: cfg.caption ? runs(cfg.caption) : null,
        imagen: cfg.imagen ?? null,
        color: cfg.color ?? null,
        regiones,
      };
    });

  for (const s of slides) {
    const textos = [s.body, ...s.regiones.flat().map(c => c.texto)].filter(Boolean);
    for (const t of textos) {
      if (plain(t).split(/[.;]/).some(f => f.trim().split(/\s+/).length > 20)) {
        avisos.push(`Slide ${s.n}: frase de más de 20 palabras`);
        break;
      }
    }
  }

  const fuentes = meta.fuente === 'kiffo'
    ? { display: 'Kiffo BdB', body: 'Kiffo BdB' }
    : { display: 'Kiffo BdB', body: 'Roboto' };

  return { meta, fuentes, slides, avisos };
}
