// Campos ↔ bloque de Markdown. El formulario edita campos; el .md sigue siendo
// la fuente de verdad, así que la ida y la vuelta tienen que cerrar.
// Funciones puras: se prueban en node.
import { parse } from '../core/parse.js';
import { aTexto } from '../core/inline.js';
import { CATALOGO, esEspecial, numRegiones } from '../core/layouts.js';
import { COMPONENTES } from '../core/componentes.js';

/**
 * Campos propios del slide, aparte de los componentes. Los layouts especiales
 * (portada, sección, imagen, cierre) son estructura, no contenido armable.
 */
export const CAMPOS_SLIDE = {
  cover: [
    { k: 'titulo', tipo: 'linea', label: 'Título' },
    { k: 'body', tipo: 'linea', label: 'Subtítulo' },
  ],
  section: [
    { k: 'tag', tipo: 'linea', label: 'Número o kicker' },
    { k: 'titulo', tipo: 'linea', label: 'Título de sección' },
  ],
  imagen: [
    { k: 'imagen', tipo: 'imagen', label: 'Imagen a sangre' },
    { k: 'titulo', tipo: 'linea', label: 'Título sobre la imagen' },
    { k: 'caption', tipo: 'linea', label: 'Pie de foto' },
  ],
  cierre: [
    { k: 'titulo', tipo: 'linea', label: 'Título' },
    { k: 'body', tipo: 'linea', label: 'Línea de cierre' },
  ],
  // Los que llevan componentes solo aportan la cabecera
  contenido: [
    { k: 'tag', tipo: 'linea', label: 'Tag' },
    { k: 'titulo', tipo: 'linea', label: 'Título' },
  ],
};
CAMPOS_SLIDE['dos-columnas'] = CAMPOS_SLIDE.contenido;
CAMPOS_SLIDE.destacado = CAMPOS_SLIDE.contenido;

export const LAYOUTS_UI = Object.entries(CATALOGO).map(([k, v]) => ({
  k, label: v.label, especial: !!v.especial, regiones: numRegiones(k),
}));

const desItem = it => ({ texto: aTexto(it.runs), extra: aTexto(it.extra), icono: it.icono ?? '' });

/** bloque de Markdown → campos editables */
export function aCampos(bloque) {
  const s = parse(bloque).slides[0];
  if (!s) return { layout: 'contenido', tag: '', titulo: '', body: '', caption: '', imagen: '', color: '', regiones: [[]] };
  return {
    layout: s.layout,
    tag: aTexto(s.tag),
    titulo: aTexto(s.titulo),
    body: aTexto(s.body),
    caption: aTexto(s.caption),
    imagen: s.imagen ?? '',
    color: s.color ?? '',
    regiones: s.regiones.map(r => r.map(c => ({
      tipo: c.tipo,
      texto: aTexto(c.texto),
      autor: aTexto(c.autor),
      src: c.src ?? '',
      pie: aTexto(c.pie),
      items: (c.items ?? []).map(desItem),
    }))),
  };
}

const lineasItems = items => items.map(it => {
  const ico = it.icono ? `[${it.icono}] ` : '';
  const par = it.extra ? ` | ${it.extra}` : '';
  return `- ${ico}${it.texto}${par}`;
});

/** un componente → su bloque de Markdown */
function bloqueComponente(c) {
  const op = [];
  if (c.tipo === 'cita' && c.autor) op.push(`autor: ${c.autor}`);
  if (c.tipo === 'imagen') {
    if (c.src) op.push(`src: ${c.src}`);
    if (c.pie) op.push(`pie: ${c.pie}`);
  }
  const cabecera = `<!-- ${[c.tipo, ...op].join('; ')} -->`;
  if (c.tipo === 'imagen') return cabecera;
  if (['bullets', 'stats', 'tarjetas'].includes(c.tipo)) return [cabecera, ...lineasItems(c.items ?? [])].join('\n');
  return [cabecera, c.texto ?? ''].join('\n');
}

/** campos → bloque de Markdown */
export function aBloque(c) {
  const propios = CAMPOS_SLIDE[c.layout] ?? [];
  const usa = k => propios.some(f => f.k === k);

  // El comentario solo lleva lo que tiene valor: nada de `tag: ` vacíos.
  const opciones = [['layout', c.layout]];
  if (usa('tag') && c.tag) opciones.push(['tag', c.tag]);
  if (usa('caption') && c.caption) opciones.push(['caption', c.caption]);
  if (usa('imagen') && c.imagen) opciones.push(['imagen', c.imagen]);
  if (c.color) opciones.push(['color', c.color]);

  const partes = [`<!-- ${opciones.map(([k, v]) => `${k}: ${v}`).join('; ')} -->`];
  if (usa('titulo') && c.titulo) partes.push(`# ${c.titulo}`);
  if (usa('body') && c.body) partes.push(c.body);

  if (!esEspecial(c.layout)) {
    (c.regiones ?? []).forEach((region, i) => {
      if (i > 0) partes.push('<!-- columna -->');
      for (const comp of region) partes.push(bloqueComponente(comp));
    });
  }
  return partes.join('\n\n');
}

/** componente nuevo del tipo pedido, con un item de ejemplo si lo necesita */
export function componenteVacio(tipo) {
  const def = COMPONENTES[tipo];
  const c = { tipo, texto: '', autor: '', src: '', pie: '', items: [] };
  const lista = def?.campos.find(f => f.tipo === 'lista');
  if (lista) {
    const n = lista.min ?? 1;
    c.items = Array.from({ length: n }, () => itemVacio(lista));
  }
  if (tipo === 'parrafo' || tipo === 'cita') c.texto = '';
  return c;
}

/** item vacío del tipo que pida el campo */
export const itemVacio = campo => ({
  texto: '',
  extra: campo?.pares ? '' : '',
  icono: '',
});
