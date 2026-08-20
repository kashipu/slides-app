// Manipulación del texto del deck para la barra de herramientas.
// Funciones puras sobre strings: se prueban en node sin navegador ni DOM.

/** longitud del frontmatter, 0 si no hay */
export const finFrontmatter = md => md.match(/^---\n[\s\S]*?\n---\n?/)?.[0].length ?? 0;

/**
 * Bloque de slide que contiene `pos`.
 * @returns {{ini:number, fin:number, frontmatter:boolean}}
 */
export function limites(md, pos) {
  const desde = finFrontmatter(md);
  if (pos < desde) return { ini: 0, fin: desde, frontmatter: true };

  // cortes = [inicio, sep0ini, sep0fin, sep1ini, sep1fin, …, final]
  const cortes = [desde];
  for (const m of md.slice(desde).matchAll(/^---[ \t]*$/gm)) {
    cortes.push(desde + m.index, desde + m.index + m[0].length);
  }
  cortes.push(md.length);

  for (let i = 0; i < cortes.length - 1; i += 2) {
    if (pos <= cortes[i + 1]) return { ini: cortes[i], fin: cortes[i + 1], frontmatter: false };
  }
  return { ini: desde, fin: md.length, frontmatter: false };
}

/** inserta texto en `pos`; devuelve el md nuevo y dónde dejar el cursor */
export const insertar = (md, pos, texto) => ({
  md: md.slice(0, pos) + texto + md.slice(pos),
  sel: pos + texto.length,
});

/** envuelve la selección en `marca`; si no hay selección, deja el cursor dentro */
export function envolver(md, ini, fin, marca = '**') {
  const dentro = md.slice(ini, fin);
  // Si ya está envuelto, se quita — el botón alterna en vez de acumular asteriscos.
  const yaEsta = md.slice(ini - marca.length, ini) === marca && md.slice(fin, fin + marca.length) === marca;
  if (yaEsta) {
    return {
      md: md.slice(0, ini - marca.length) + dentro + md.slice(fin + marca.length),
      sel: [ini - marca.length, fin - marca.length],
    };
  }
  return {
    md: md.slice(0, ini) + marca + dentro + marca + md.slice(fin),
    sel: [ini + marca.length, fin + marca.length],
  };
}

const parPares = txt => txt.split(';').map(p => p.match(/^\s*([\w-]+)\s*:\s*(.*?)\s*$/)).filter(Boolean)
  .map(([, k, v]) => [k, v]);

/**
 * Escribe `clave: valor` en el comentario del slide bajo el cursor.
 * Crea el comentario si no existe. `valor` vacío borra la clave.
 */
export function ponerOpcion(md, pos, clave, valor) {
  const { ini, fin, frontmatter } = limites(md, pos);
  if (frontmatter) return { md, sel: pos };

  const bloque = md.slice(ini, fin);
  const m = bloque.match(/<!--([\s\S]*?)-->/);

  const pares = m ? parPares(m[1]) : [];
  const i = pares.findIndex(([k]) => k === clave);
  if (!valor) { if (i >= 0) pares.splice(i, 1); }
  else if (i >= 0) pares[i][1] = valor;
  else pares.push([clave, valor]);

  if (!pares.length) {
    // sin opciones no hace falta comentario
    const limpio = m ? bloque.replace(/<!--[\s\S]*?-->\n?/, '') : bloque;
    return { md: md.slice(0, ini) + limpio + md.slice(fin), sel: ini + limpio.length };
  }

  const comentario = `<!-- ${pares.map(([k, v]) => `${k}: ${v}`).join('; ')} -->`;
  const nuevo = m
    ? bloque.replace(/<!--[\s\S]*?-->/, comentario)
    : bloque.replace(/^(\s*)/, `$1${comentario}\n`);

  return { md: md.slice(0, ini) + nuevo + md.slice(fin), sel: pos + (nuevo.length - bloque.length) };
}

/** escribe `clave: valor` en el frontmatter del deck, creándolo si no existe */
export function ponerFrontmatter(md, clave, valor) {
  const largo = finFrontmatter(md);
  if (!largo) return `---\n${clave}: ${valor}\n---\n\n${md}`;

  const bloque = md.slice(0, largo);
  const re = new RegExp(`^${clave}\\s*:.*$`, 'm');
  return re.test(bloque)
    ? bloque.replace(re, `${clave}: ${valor}`) + md.slice(largo)
    : bloque.replace(/\n---\n?$/, `\n${clave}: ${valor}\n---\n`) + md.slice(largo);
}

/** lee una clave del frontmatter */
export const leerFrontmatter = (md, clave) =>
  md.slice(0, finFrontmatter(md)).match(new RegExp(`^${clave}\\s*:\\s*(.*)$`, 'm'))?.[1].trim() ?? '';

/** lee una opción del slide bajo el cursor */
export function leerOpcion(md, pos, clave) {
  const { ini, fin, frontmatter } = limites(md, pos);
  if (frontmatter) return '';
  const m = md.slice(ini, fin).match(/<!--([\s\S]*?)-->/);
  return m ? (parPares(m[1]).find(([k]) => k === clave)?.[1] ?? '') : '';
}

export const ESQUELETOS = {
  cover: '<!-- layout: cover -->\n# Título de la portada\nSubtítulo o área',
  section: '<!-- layout: section; tag: 01 -->\n# Título de la sección',
  afirmacion: '<!-- layout: afirmacion; tag: Hallazgo -->\n# Las transferencias se completan en tres pasos\nMedido sobre las sesiones reales del último trimestre.',
  contenido: '<!-- layout: contenido; tag: Tema -->\n# Título de la diapositiva\n\n<!-- parrafo -->\nEl cuerpo va aquí, en frases de menos de 20 palabras.',
  'dos-columnas': '<!-- layout: dos-columnas; tag: Comparación -->\n# Título de la diapositiva\n\n<!-- parrafo -->\nColumna izquierda.\n\n<!-- columna -->\n\n<!-- parrafo -->\nColumna derecha.',
  'dos-tercios': '<!-- layout: dos-tercios; tag: Comparación -->\n# Antes y después del rediseño\n\n<!-- parrafo -->\nEl flujo anterior pedía cinco pantallas para completar una transferencia.\n\n<!-- columna -->\n\n<!-- stats -->\n- 3 | Pasos hoy',
  'media-lateral': '<!-- layout: media-lateral; imagen: decks/img/placeholder.svg; tag: Producto -->\n# La confirmación queda visible de inmediato\n\n<!-- parrafo -->\nEl usuario ve el estado de la operación sin salir de la pantalla.',
  destacado: '<!-- layout: destacado -->\n# Lo que queremos destacar\n\n<!-- cita; autor: Quién lo dijo -->\nLa cita va aquí, sin comillas.',
  imagen: '<!-- layout: imagen; imagen: decks/img/placeholder.svg; caption: Pie de la imagen -->\n# Título sobre la imagen',
  cierre: '<!-- layout: cierre -->\n# Gracias\nUna línea de cierre',
};

// --- reordenar, duplicar y borrar slides ---------------------------------
// El navegador de miniaturas opera sobre estas funciones. Trabajan con la lista
// de bloques de texto, no con el IR: lo que se mueve es el Markdown.

/** el texto de cada slide, sin el frontmatter */
export const bloques = md =>
  md.slice(finFrontmatter(md)).split(/^---[ \t]*$/m).map(b => b.trim()).filter(Boolean);

/** vuelve a armar el deck con `textos` como slides, conservando el frontmatter */
export function reconstruir(md, textos) {
  const fm = md.slice(0, finFrontmatter(md)).trimEnd();
  return (fm ? `${fm}\n\n` : '') + textos.join('\n\n---\n\n') + '\n';
}

/** posición del cursor al inicio del slide `i` */
export function inicioSlide(md, i) {
  const desde = finFrontmatter(md);
  const seps = [...md.slice(desde).matchAll(/^---[ \t]*$/gm)].map(m => desde + m.index + m[0].length);
  return [desde, ...seps][i] ?? desde;
}

/** sustituye el texto del slide `i` */
export function reemplazarBloque(md, i, texto) {
  const b = bloques(md);
  if (i < 0 || i >= b.length) return md;
  b[i] = texto;
  return reconstruir(md, b);
}

/** el frontmatter sin las vallas `---`, para editarlo */
export const frontmatterTexto = md =>
  md.slice(0, finFrontmatter(md)).replace(/^---\n/, '').replace(/\n---\n?$/, '');

/** reemplaza el frontmatter completo; vacío lo elimina */
export const ponerFrontmatterTexto = (md, texto) =>
  (texto.trim() ? `---\n${texto.trim()}\n---\n\n` : '') + md.slice(finFrontmatter(md)).replace(/^\n+/, '');

const conBloques = (md, fn) => {
  const b = bloques(md);
  const r = fn(b);
  return r === false ? md : reconstruir(md, b);
};

export const moverSlide = (md, desde, hasta) => conBloques(md, b => {
  if (desde === hasta || desde < 0 || hasta < 0 || desde >= b.length || hasta >= b.length) return false;
  b.splice(hasta, 0, ...b.splice(desde, 1));
});

export const borrarSlide = (md, i) => conBloques(md, b => {
  if (b.length <= 1 || i < 0 || i >= b.length) return false;   // nunca dejar el deck vacío
  b.splice(i, 1);
});

export const duplicarSlide = (md, i) => conBloques(md, b => {
  if (i < 0 || i >= b.length) return false;
  b.splice(i + 1, 0, b[i]);
});

/** añade un slide después del que contiene el cursor */
export function agregarSlide(md, pos, layout) {
  const { fin } = limites(md, pos);
  const cuerpo = ESQUELETOS[layout] ?? ESQUELETOS.contenido;
  const texto = `\n\n---\n\n${cuerpo}\n`;
  return { md: md.slice(0, fin) + texto + md.slice(fin), sel: fin + texto.length };
}
