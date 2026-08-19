// node test.js — el único check de la fase 1. Sin framework, a propósito.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from './src/core/parse.js';
import { componer, CANVAS, LAYOUTS } from './src/core/layouts.js';
import { runs, plain } from './src/core/inline.js';
import { filtrarIconos } from './src/ui/iconos.js';
import { CAMPOS, aCampos, aBloque, itemVacio } from './src/ui/campos.js';
import { aTexto } from './src/core/inline.js';
import { arbol } from './tools/figma/tree.mjs';
import { finFrontmatter as finFm, limites, envolver, ponerOpcion, leerOpcion, ponerFrontmatter, leerFrontmatter, agregarSlide, ESQUELETOS,
  bloques, reconstruir, inicioSlide, moverSlide, borrarSlide, duplicarSlide,
  reemplazarBloque, frontmatterTexto, ponerFrontmatterTexto } from './src/ui/md.js';

const md = readFileSync(new URL('./decks/plantilla.md', import.meta.url), 'utf8');
const ir = parse(md);

// --- inline ---
assert.deepEqual(runs('hola **mundo** ya'), [
  { t: 'hola ', b: false }, { t: 'mundo', b: true }, { t: ' ya', b: false },
]);
assert.equal(plain(runs('**a**b')), 'ab');

// --- parser ---
assert.equal(ir.meta.titulo, 'Plantilla de presentaciones');
assert.equal(ir.meta.tema, 'light');
assert.equal(ir.slides.length, 11, 'la plantilla tiene 11 slides');
assert.equal(ir.slides[0].layout, 'cover');
assert.equal(plain(ir.slides[0].titulo), 'Plantilla de presentaciones');
assert.equal(plain(ir.slides[1].tag), '01');

const cols2 = ir.slides.find(s => s.layout === 'two-cols');
assert.equal(cols2.items.length, 2, 'two-cols parsea 2 bloques');
assert.ok(cols2.items[0].extra, 'el separador | divide título y texto');

const stats = ir.slides.find(s => s.layout === 'stats');
assert.equal(plain(stats.items[0].runs), '189');
assert.equal(plain(stats.items[0].extra), 'Tokens de diseño verificados');

// La plantilla debe ejercitar los 9 layouts del catálogo.
const usados = new Set(ir.slides.map(s => s.layout));
assert.deepEqual([...LAYOUTS].filter(l => !usados.has(l)), [], 'la plantilla usa todos los layouts');

// --- lint ---
assert.deepEqual(ir.avisos, [], `la plantilla no debe generar avisos:\n${ir.avisos.join('\n')}`);
assert.ok(parse('# Un título con punto.').avisos.some(a => a.includes('punto final')));
assert.ok(parse('<!-- layout: bullets -->\n# T\n- a\n- b').avisos.some(a => a.includes('bullets')));
assert.ok(parse('# Hola 🎉').avisos.some(a => a.includes('emoji')));
assert.ok(parse('<!-- layout: nope -->\n# T').avisos.some(a => a.includes('no existe')));

// --- geometría: nada se sale del canvas ---
let cajas = 0;
for (const s of ir.slides) {
  const { boxes } = componer(s, { meta: ir.meta, n: s.n, total: ir.slides.length });
  assert.ok(boxes.length, `slide ${s.n} (${s.layout}) sin cajas`);
  for (const b of boxes) {
    cajas++;
    const ctx = `slide ${s.n} (${s.layout}) caja ${b.kind}`;
    assert.ok(b.x >= 0 && b.x + b.w <= CANVAS.w, `${ctx} se sale a lo ancho: x=${b.x} w=${b.w}`);
    assert.ok(b.y >= 0, `${ctx} arranca fuera del canvas: y=${b.y}`);
    assert.ok(b.y + b.h <= CANVAS.h, `${ctx} se sale a lo alto: y=${b.y} h=${Math.round(b.h)}`);
    assert.ok(Number.isFinite(b.h) && b.h > 0, `${ctx} sin alto resuelto`);
  }
}

// --- iconos, color y fuente ---
const conIcono = parse('<!-- layout: bullets; color: mustard-800 -->\n# T\n- [finanzas/ahorro] Texto **fuerte**\n- Sin icono\n- [esenciales/x-y.z] Otro');
const [i0, i1, i2] = conIcono.slides[0].items;
assert.equal(i0.icono, 'finanzas/ahorro');
assert.equal(plain(i0.runs), 'Texto fuerte', 'el prefijo [icono] se quita del texto');
assert.equal(i1.icono, null);
assert.equal(i2.icono, 'esenciales/x-y.z', 'acepta puntos y guiones en el nombre');
assert.equal(conIcono.slides[0].color, 'mustard-800');

const cajasIcono = componer(conIcono.slides[0], { meta: {}, n: 1, total: 1 }).boxes;
const iconos = cajasIcono.filter(b => b.kind === 'icon');
assert.equal(iconos.length, 2, 'una caja icon por item con icono');
assert.equal(iconos[0].fill, '#927200', 'color: mustard-800 tiñe el icono');
assert.equal(cajasIcono.filter(b => b.kind === 'rect' && b.r === 7).length, 1, 'el item sin icono conserva su viñeta');

// token de color inexistente → azul interactivo, sin romper
const malColor = parse('<!-- layout: bullets; color: no-existe -->\n# T\n- [a/b] x');
assert.equal(componer(malColor.slides[0], { meta: {}, n: 1, total: 1 }).boxes.find(b => b.kind === 'icon').fill, '#0043A9');

assert.deepEqual(parse('---\nfuente: kiffo\n---\n# T').fuentes, { display: 'Kiffo BdB', body: 'Kiffo BdB' });
assert.deepEqual(parse('# T').fuentes, { display: 'Kiffo BdB', body: 'Roboto' });

// Las referencias de icono de la plantilla deben existir de verdad (si assets/ está sincronizado)
try {
  const manifest = JSON.parse(readFileSync(new URL('./assets/manifest.json', import.meta.url), 'utf8'));
  for (const s of ir.slides) {
    for (const it of s.items) {
      if (!it.icono) continue;
      const [cat, nombre] = it.icono.split('/');
      assert.ok(manifest.icons[cat]?.includes(`${nombre}.svg`), `icono inexistente en plantilla.md: ${it.icono}`);
    }
  }
} catch (e) {
  if (e.code !== 'ENOENT') throw e;
  console.warn('aviso: assets/ sin sincronizar, no se validaron las rutas de icono (npm run sync-assets)');
}

// --- edición: las funciones que mueve la barra de herramientas ---
{
  const doc = '---\ntitulo: X\n---\n\n<!-- layout: cover -->\n# Uno\n\n---\n\n<!-- layout: bullets -->\n# Dos\n- a';
  const posUno = doc.indexOf('# Uno');
  const posDos = doc.indexOf('# Dos');

  assert.ok(limites(doc, 5).frontmatter, 'el cursor en el frontmatter se detecta');
  assert.equal(doc.slice(...Object.values(limites(doc, posUno)).slice(0, 2)).trim(), '<!-- layout: cover -->\n# Uno');
  assert.equal(doc.slice(...Object.values(limites(doc, posDos)).slice(0, 2)).trim(), '<!-- layout: bullets -->\n# Dos\n- a');

  // negrita: envuelve y desenvuelve
  const b1 = envolver('hola mundo', 5, 10);
  assert.equal(b1.md, 'hola **mundo**');
  assert.equal(envolver(b1.md, 7, 12).md, 'hola mundo', 'el botón alterna, no acumula asteriscos');

  // opciones del slide
  assert.match(ponerOpcion(doc, posDos, 'color', 'mustard-800').md, /<!-- layout: bullets; color: mustard-800 -->/);
  assert.equal(leerOpcion(ponerOpcion(doc, posDos, 'color', 'mustard-800').md, posDos, 'color'), 'mustard-800');
  assert.match(ponerOpcion(doc, posDos, 'layout', 'stats').md, /<!-- layout: stats -->/, 'reemplaza, no duplica');
  const sinLayout = ponerOpcion(doc, posDos, 'layout', '').md;
  const { ini, fin } = limites(sinLayout, sinLayout.indexOf('# Dos'));
  assert.ok(!sinLayout.slice(ini, fin).includes('<!--'), 'sin opciones no queda comentario huérfano');
  assert.match(sinLayout, /<!-- layout: cover -->/, 'no toca los otros slides');

  const sinComentario = '# Solo título';
  assert.match(ponerOpcion(sinComentario, 3, 'tag', 'Hola').md, /^<!-- tag: Hola -->\n# Solo título/);
  assert.equal(leerOpcion(doc, 5, 'layout'), '', 'en el frontmatter no hay opciones de slide');

  // frontmatter
  assert.match(ponerFrontmatter(doc, 'fuente', 'kiffo'), /^---\ntitulo: X\nfuente: kiffo\n---/);
  assert.match(ponerFrontmatter(doc, 'titulo', 'Y'), /^---\ntitulo: Y\n---/);
  assert.match(ponerFrontmatter('# Sin frontmatter', 'fuente', 'kiffo'), /^---\nfuente: kiffo\n---\n\n# Sin/);
  assert.equal(leerFrontmatter(doc, 'titulo'), 'X');

  // agregar slide: el resultado debe parsear y componer sin excepción
  for (const layout of Object.keys(ESQUELETOS)) {
    const { md: nuevo } = agregarSlide(doc, posUno, layout);
    const p = parse(nuevo);
    assert.equal(p.slides.length, 3, `agregarSlide(${layout}) debe dejar 3 slides`);
    assert.equal(p.slides[1].layout, layout, `el slide nuevo va justo después del cursor`);
    p.slides.forEach(s => componer(s, { meta: p.meta, n: s.n, total: 3 }));
  }
}

// --- reordenar, duplicar y borrar slides ---
{
  const t = ir.slides.map(s => s.layout);   // los 11 de la plantilla
  const orden = doc => parse(doc).slides.map(s => s.layout);

  assert.deepEqual(bloques(md).length, 11);
  assert.deepEqual(orden(reconstruir(md, bloques(md))), t, 'reconstruir es idempotente');
  assert.match(reconstruir(md, bloques(md)), /^---\ntitulo:/, 'conserva el frontmatter');

  const movido = moverSlide(md, 10, 1);   // el cierre al segundo lugar
  assert.deepEqual(orden(movido), [t[0], t[10], ...t.slice(1, 10)]);
  assert.deepEqual(orden(moverSlide(movido, 1, 10)), t, 'mover y devolver deja el orden original');
  assert.equal(moverSlide(md, 3, 3), md, 'mover a la misma posición no cambia nada');
  assert.equal(moverSlide(md, 0, 99), md, 'índice fuera de rango no rompe');

  assert.deepEqual(orden(duplicarSlide(md, 0)), [t[0], t[0], ...t.slice(1)]);
  assert.deepEqual(orden(borrarSlide(md, 0)), t.slice(1));
  assert.equal(bloques(borrarSlide('# Único', 0)).length, 1, 'nunca deja el deck vacío');

  // el cursor cae dentro del slide que se pidió
  for (let i = 0; i < 11; i++) {
    const { ini, fin } = limites(md, inicioSlide(md, i));
    assert.equal(bloques(md.slice(ini, fin)).length, 1, `inicioSlide(${i}) cae en un solo bloque`);
    assert.equal(md.slice(ini, fin).trim(), bloques(md)[i], `inicioSlide(${i}) apunta al slide ${i}`);
  }
}

// --- edición por bloque: cada slide tiene su propio textarea ---
{
  const nuevo = reemplazarBloque(md, 1, '<!-- layout: section; tag: 99 -->\n# Otra cosa');
  const b = bloques(nuevo);
  assert.equal(b.length, 11, 'reemplazar no cambia el número de slides');
  assert.match(b[1], /tag: 99/);
  assert.equal(b[0], bloques(md)[0], 'no toca los vecinos');
  assert.equal(b[2], bloques(md)[2]);
  assert.equal(parse(nuevo).slides[1].layout, 'section');
  assert.equal(reemplazarBloque(md, 99, 'x'), md, 'índice fuera de rango no rompe');

  // escribir --- dentro de un bloque parte el slide en dos: es el comportamiento esperado
  assert.equal(bloques(reemplazarBloque(md, 0, '# Uno\n\n---\n\n# Dos')).length, 12);

  // frontmatter como texto editable
  assert.match(frontmatterTexto(md), /^titulo: Plantilla de presentaciones/);
  assert.ok(!frontmatterTexto(md).includes('---'), 'sin las vallas');
  const cambiado = ponerFrontmatterTexto(md, 'titulo: Otro\nfuente: kiffo');
  assert.equal(parse(cambiado).meta.titulo, 'Otro');
  assert.deepEqual(parse(cambiado).fuentes, { display: 'Kiffo BdB', body: 'Kiffo BdB' });
  assert.equal(bloques(cambiado).length, 11, 'cambiar el frontmatter no toca los slides');
  assert.equal(finFm(ponerFrontmatterTexto(md, '   ')), 0, 'frontmatter vacío se elimina');
}

// --- formulario: campos ↔ bloque ---
{
  // aTexto es el inverso exacto de runs()
  for (const t of ['hola **mundo** ya', '**todo**', 'sin nada', '']) {
    assert.equal(aTexto(runs(t)), t, `ida y vuelta de runs con ${JSON.stringify(t)}`);
  }

  // El formulario solo puede editar layouts que existan, y todos deben tener campos.
  assert.deepEqual(Object.keys(CAMPOS).sort(), [...LAYOUTS].sort(),
    'CAMPOS y el catálogo de layouts tienen que coincidir');

  // La garantía que sostiene el formulario: editar por campos no pierde nada.
  for (const b of bloques(md)) {
    const vuelta = aBloque(aCampos(b));
    assert.deepEqual(parse(vuelta).slides[0], parse(b).slides[0],
      `campos → bloque cambia el IR:\n${b}\n---\n${vuelta}`);
  }

  // Campos vacíos no dejan opciones huérfanas en el comentario
  const limpio = aBloque({ layout: 'bullets', titulo: 'T', tag: '', items: [{ texto: 'a', extra: '', icono: '' }] });
  assert.equal(limpio.split('\n')[0], '<!-- layout: bullets -->');
  assert.ok(!limpio.includes('| '), 'sin extra no se escribe el separador |');

  // Un icono elegido en el picker sobrevive el viaje al Markdown
  const conIcono = aBloque({ layout: 'bullets', titulo: 'T', items: [{ texto: 'x', extra: '', icono: 'finanzas/ahorro' }] });
  assert.match(conIcono, /- \[finanzas\/ahorro\] x/);
  assert.equal(aCampos(conIcono).items[0].icono, 'finanzas/ahorro');

  // itemVacio respeta si el layout usa pares
  assert.equal(itemVacio(CAMPOS.stats.find(f => f.tipo === 'lista')).extra, 'Etiqueta');
  assert.equal(itemVacio(CAMPOS.bullets.find(f => f.tipo === 'lista')).extra, '');
}

// --- búsqueda del picker de iconos ---
{
  const falso = { icons: { finanzas: ['ahorro-cuenta.svg', 'tarjeta.svg'], vivienda: ['casa-hogar.svg'] } };
  assert.equal(filtrarIconos(falso).length, 3);
  assert.equal(filtrarIconos(falso, '', 'finanzas').length, 2, 'filtra por categoría');
  assert.deepEqual(filtrarIconos(falso, 'hogar')[0], { ref: 'vivienda/casa-hogar', nombre: 'casa hogar', cat: 'vivienda' });
  assert.equal(filtrarIconos(falso, 'AHORRO').length, 1, 'la búsqueda ignora mayúsculas');
  assert.equal(filtrarIconos(falso, 'vivienda').length, 1, 'también busca por nombre de categoría');
  assert.equal(filtrarIconos(falso, 'nada de nada').length, 0);
  assert.deepEqual(filtrarIconos(null), [], 'sin manifiesto no revienta');

  // Las refs que produce el picker deben ser exactamente las que parsea el formato
  const ref = filtrarIconos(falso, 'hogar')[0].ref;
  assert.equal(parse(`<!-- layout: bullets -->\n# T\n- [${ref}] x`).slides[0].items[0].icono, ref);
}

// --- exportador de Figma: el árbol que viaja al MCP ---
{
  const a = arbol(md);
  assert.equal(a.slides.length, 11);
  assert.equal(a.pagina, 'Plantilla de presentaciones', 'la página toma el título del deck');
  assert.equal(a.fuentes.display, 'Kiffo BDB', 'el nombre de familia en Figma va en mayúsculas, no como en el CSS');
  assert.deepEqual(a.avisos, [], `el árbol de la plantilla no debe avisar:\n${a.avisos.join('\n')}`);

  const cajas = a.slides.flatMap(s => s.boxes);
  assert.equal(cajas.length, cajas.filter(b => b.kind).length, 'toda caja lleva kind');
  assert.deepEqual([...new Set(cajas.map(b => b.kind))].sort(), ['rect', 'svg', 'text']);

  // Todo SVG referenciado tiene que viajar dentro del árbol: dentro de Figma no
  // hay red ni disco, solo lo que se envió por sharedPluginData.
  for (const b of cajas) {
    if (b.kind === 'svg' || b.kind === 'icon') {
      assert.ok(a.svgs[b.src]?.startsWith('<svg'), `falta el svg de ${b.src}`);
    }
  }

  // El límite duro: use_figma admite 50k por llamada y push.py trocea a 38k.
  const bytes = JSON.stringify(a).length;
  assert.ok(bytes < 38000 * 20, `árbol de ${bytes} bytes: revisa el troceado`);

  // `fuente: kiffo` en el deck también cambia el cuerpo en Figma
  assert.equal(arbol('---\nfuente: kiffo\n---\n# T').fuentes.body, 'Kiffo BDB');
}

// --- estados parciales: mientras escribes, el render no puede reventar ---
const parciales = ['', '# ', '---', '- ', '<!-- ', '**', '<!-- layout: bullets -->\n- '];
for (const l of LAYOUTS) parciales.push(`<!-- layout: ${l} -->`, `<!-- layout: ${l} -->\n# T`, `<!-- layout: ${l} -->\n# T\n- a | b`);
for (const md of parciales) {
  assert.doesNotThrow(() => {
    const p = parse(md);
    p.slides.forEach(s => componer(s, { meta: p.meta, n: 1, total: 1 }));
  }, `revienta con entrada parcial: ${JSON.stringify(md.slice(0, 40))}`);
}

console.log(`ok — ${ir.slides.length} slides, ${LAYOUTS.length} layouts, ${cajas} cajas, 0 avisos, ${parciales.length} estados parciales`);
