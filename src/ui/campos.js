// Campos ↔ bloque de Markdown. El formulario edita campos; el .md sigue siendo
// la fuente de verdad, así que la ida y la vuelta tienen que cerrar.
// Funciones puras: se prueban en node.
import { parse } from '../core/parse.js';
import { aTexto } from '../core/inline.js';

/**
 * Qué campos tiene cada layout. Sale del catálogo de docs/01-formato-deck.md;
 * si aquí y layouts.js se separaran, el formulario mostraría campos que no
 * pinta nadie — por eso test.js compara las dos listas.
 */
export const CAMPOS = {
  cover: [
    { k: 'titulo', tipo: 'linea', label: 'Título' },
    { k: 'body', tipo: 'linea', label: 'Subtítulo' },
  ],
  section: [
    { k: 'tag', tipo: 'linea', label: 'Número o kicker' },
    { k: 'titulo', tipo: 'linea', label: 'Título de sección' },
  ],
  'title-body': [
    { k: 'tag', tipo: 'linea', label: 'Tag' },
    { k: 'titulo', tipo: 'linea', label: 'Título' },
    { k: 'body', tipo: 'parrafo', label: 'Cuerpo' },
  ],
  bullets: [
    { k: 'tag', tipo: 'linea', label: 'Tag' },
    { k: 'titulo', tipo: 'linea', label: 'Título' },
    { k: 'items', tipo: 'lista', label: 'Puntos', icono: true, min: 3, max: 6 },
  ],
  'two-cols': [
    { k: 'tag', tipo: 'linea', label: 'Tag' },
    { k: 'titulo', tipo: 'linea', label: 'Título' },
    { k: 'items', tipo: 'lista', label: 'Columnas', icono: true, pares: ['Título', 'Texto'], min: 2, max: 2 },
  ],
  stats: [
    { k: 'titulo', tipo: 'linea', label: 'Título' },
    { k: 'items', tipo: 'lista', label: 'Cifras', pares: ['Valor', 'Etiqueta'], min: 2, max: 4 },
  ],
  image: [
    { k: 'imagen', tipo: 'imagen', label: 'Imagen' },
    { k: 'titulo', tipo: 'linea', label: 'Título sobre la imagen' },
    { k: 'caption', tipo: 'linea', label: 'Pie de foto' },
  ],
  quote: [
    { k: 'body', tipo: 'parrafo', label: 'Cita' },
    { k: 'caption', tipo: 'linea', label: 'Atribución' },
  ],
  closing: [
    { k: 'titulo', tipo: 'linea', label: 'Título' },
    { k: 'body', tipo: 'linea', label: 'Línea de cierre' },
  ],
};

/** bloque de Markdown → campos editables */
export function aCampos(bloque) {
  const s = parse(bloque).slides[0];
  if (!s) return { layout: 'title-body', tag: '', titulo: '', body: '', caption: '', imagen: '', color: '', items: [] };
  return {
    layout: s.layout,
    tag: aTexto(s.tag),
    titulo: aTexto(s.titulo),
    body: aTexto(s.body),
    caption: aTexto(s.caption),
    imagen: s.imagen ?? '',
    color: s.color ?? '',
    items: s.items.map(it => ({ texto: aTexto(it.runs), extra: aTexto(it.extra), icono: it.icono ?? '' })),
  };
}

/** campos → bloque de Markdown */
export function aBloque(c) {
  const usa = k => (CAMPOS[c.layout] ?? []).some(f => f.k === k);

  // El comentario solo lleva lo que tiene valor: nada de `tag: ` vacíos.
  const opciones = [['layout', c.layout]];
  if (usa('tag') && c.tag) opciones.push(['tag', c.tag]);
  if (usa('caption') && c.caption) opciones.push(['caption', c.caption]);
  if (usa('imagen') && c.imagen) opciones.push(['imagen', c.imagen]);
  if (c.color) opciones.push(['color', c.color]);

  const lineas = [`<!-- ${opciones.map(([k, v]) => `${k}: ${v}`).join('; ')} -->`];
  if (usa('titulo') && c.titulo) lineas.push(`# ${c.titulo}`);
  if (usa('body') && c.body) lineas.push('', c.body);
  if (usa('items') && c.items?.length) {
    lineas.push('');
    for (const it of c.items) {
      const ico = it.icono ? `[${it.icono}] ` : '';
      const par = it.extra ? ` | ${it.extra}` : '';
      lineas.push(`- ${ico}${it.texto}${par}`);
    }
  }
  return lineas.join('\n');
}

/** item vacío del tipo que pida el layout */
export const itemVacio = campo => ({
  texto: campo?.pares ? campo.pares[0] : 'Nuevo punto',
  extra: campo?.pares ? campo.pares[1] : '',
  icono: '',
});
