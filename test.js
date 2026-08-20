// node test.js — el único check del proyecto. Sin framework, a propósito.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from './src/core/parse.js';
import { componer, CANVAS, LAYOUTS } from './src/core/layouts.js';
import { TIPOS, apilar } from './src/core/componentes.js';
import { runs, plain, aTexto } from './src/core/inline.js';
import { filtrarIconos } from './src/ui/iconos.js';
import { CAMPOS_SLIDE, aCampos, aBloque, componenteVacio, itemVacio } from './src/ui/campos.js';
import { arbol } from './tools/figma/tree.mjs';
import {
  finFrontmatter as finFm, limites, envolver, ponerOpcion, leerOpcion, ponerFrontmatter,
  leerFrontmatter, agregarSlide, ESQUELETOS, bloques, reconstruir, inicioSlide, moverSlide,
  borrarSlide, duplicarSlide, reemplazarBloque, frontmatterTexto, ponerFrontmatterTexto,
} from './src/ui/md.js';

const md = readFileSync(new URL('./decks/plantilla.md', import.meta.url), 'utf8');
const ir = parse(md);

// --- inline: runs y su inverso ---
assert.deepEqual(runs('hola **mundo** ya'), [
  { t: 'hola ', b: false }, { t: 'mundo', b: true }, { t: ' ya', b: false },
]);
assert.equal(plain(runs('**a**b')), 'ab');
for (const t of ['hola **mundo** ya', '**todo**', 'sin nada', '']) {
  assert.equal(aTexto(runs(t)), t, `ida y vuelta de runs con ${JSON.stringify(t)}`);
}

// --- parser ---
assert.equal(ir.meta.titulo, 'Plantilla de presentaciones');
assert.equal(ir.slides.length, 13, 'la plantilla tiene 13 diapositivas');
assert.equal(ir.slides[0].layout, 'cover');
assert.equal(plain(ir.slides[0].titulo), 'Plantilla de presentaciones');
assert.equal(plain(ir.slides[1].tag), '01');

// La plantilla debe ejercitar todo el catálogo.
const layoutsUsados = new Set(ir.slides.map(s => s.layout));
assert.deepEqual([...LAYOUTS].filter(l => !layoutsUsados.has(l)), [], 'la plantilla usa todos los layouts');
const tiposUsados = new Set(ir.slides.flatMap(s => s.regiones.flat()).map(c => c.tipo));
assert.deepEqual(TIPOS.filter(t => !tiposUsados.has(t)), [],
  'la plantilla usa todos los componentes');

// Varios componentes en una región: lo que antes obligaba a inventar un layout.
const mixtos = ir.slides.filter(s => s.regiones[0].length > 1);
assert.ok(mixtos.length >= 2, 'varias diapositivas combinan componentes en una región');
assert.ok(mixtos.some(s => s.regiones[0].map(c => c.tipo).join('+') === 'stats+parrafo'),
  'cifras y párrafo conviven en la misma región');

// `columna` reparte los componentes entre regiones
const dos = ir.slides.find(s => s.layout === 'dos-columnas');
assert.equal(dos.regiones.length, 2);
assert.ok(dos.regiones[0].length && dos.regiones[1].length);

// Un componente recién añadido trae sus filas vacías: tienen que sobrevivir a
// la ida y vuelta por markdown, o se borran solas mientras se escribe.
{
  const recien = '<!-- layout: contenido -->\n# T\n\n<!-- bullets -->\n- \n- \n- ';
  assert.equal(parse(recien).slides[0].regiones[0][0].items.length, 3,
    'las filas vacías de una lista no se pierden al releer el markdown');

  const aMedias = '<!-- layout: contenido -->\n# T\n\n<!-- bullets -->\n- \n- algo\n- ';
  const items = parse(aMedias).slides[0].regiones[0][0].items;
  assert.equal(items.length, 3, 'escribir en una fila no borra las vecinas vacías');
  assert.equal(plain(items[1].runs), 'algo');
}

// --- compatibilidad con el formato anterior ---
{
  const viejo = [
    '<!-- layout: bullets; tag: R -->\n# T\n\n- uno\n- dos\n- tres',
    '<!-- layout: stats -->\n# T\n\n- 189 | Tokens\n- 532 | Iconos',
    '<!-- layout: quote; caption: Sherpa -->\nUna cita del formato viejo.',
    '<!-- layout: two-cols -->\n# T\n\n- Antes | Uno\n- Después | Dos',
    '<!-- layout: title-body -->\n# T\n\nUn párrafo.',
    '<!-- layout: closing -->\n# Gracias',
    '<!-- layout: image; imagen: decks/img/placeholder.svg -->\n# T',
  ].join('\n\n---\n\n');
  const p = parse(viejo);
  assert.deepEqual(p.avisos, [], `un deck del formato anterior no debe avisar:\n${p.avisos.join('\n')}`);
  assert.deepEqual(p.slides.map(s => s.layout),
    ['contenido', 'contenido', 'destacado', 'dos-columnas', 'contenido', 'cierre', 'imagen']);
  assert.equal(p.slides[0].regiones[0][0].tipo, 'bullets');
  assert.equal(p.slides[1].regiones[0][0].tipo, 'stats');
  assert.equal(plain(p.slides[2].regiones[0][0].autor), 'Sherpa', 'la atribución de `caption` sobrevive');
  assert.equal(p.slides[4].regiones[0][0].tipo, 'parrafo');
  p.slides.forEach(s => componer(s, { meta: {}, n: s.n, total: 7 }));

  // El texto suelto junto a componentes no se descarta en silencio
  const mezcla = parse('<!-- layout: contenido -->\n# T\nTexto suelto.\n\n<!-- bullets -->\n- a\n- b\n- c');
  assert.deepEqual(mezcla.slides[0].regiones[0].map(c => c.tipo), ['parrafo', 'bullets']);
}

// --- lint ---
assert.deepEqual(ir.avisos, [], `la plantilla no debe generar avisos:\n${ir.avisos.join('\n')}`);
assert.ok(parse('# Un título con punto.').avisos.some(a => a.includes('punto final')));
assert.ok(parse('<!-- layout: contenido -->\n# T\n<!-- bullets -->\n- a\n- b').avisos.some(a => a.includes('puntos')));
assert.ok(parse('# Hola 🎉').avisos.some(a => a.includes('emoji')));
assert.ok(parse('<!-- layout: nope -->\n# T').avisos.some(a => a.includes('no existe')));
assert.ok(parse('<!-- layout: contenido -->\n<!-- inventado -->\nx').avisos.some(a => a.includes('componente')));

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

// --- componentes: cada uno mide lo que ocupa y se apila ---
{
  const region = { x: 112, y: 340, w: 1696 };
  const ctx = { tinta: '#0043A9' };
  for (const tipo of TIPOS) {
    const c = componenteVacio(tipo);
    if (c.items?.length) c.items = c.items.map((_, i) => ({ runs: runs(`Item ${i + 1}`), extra: runs('Nota'), icono: null }));
    if (tipo === 'parrafo' || tipo === 'cita') c.texto = runs('Un texto de prueba con longitud razonable.');
    if (tipo === 'imagen') c.src = 'decks/img/placeholder.svg';
    // `tabla` guarda texto en el formulario y celdas en el IR: aquí se pinta el IR
    if (tipo === 'tabla') c.filas = [['Canal', 'Estado'], ['Portal', 'Vivo']].map(f => f.map(t => runs(t)));
    const r = apilar([c], region, ctx);
    assert.ok(r.alto > 0, `el componente ${tipo} no reporta alto`);
    for (const b of r.boxes) {
      assert.ok(b.x >= region.x - 1 && b.x + b.w <= region.x + region.w + 1,
        `${tipo} se sale de la región: x=${b.x} w=${b.w}`);
    }
  }

  const r = apilar([{ tipo: 'parrafo', texto: runs('Primero') }, { tipo: 'parrafo', texto: runs('Segundo') }], region, ctx);
  assert.ok(r.boxes[1].y >= r.boxes[0].y + r.boxes[0].h, 'los componentes se apilan con separación, no se solapan');
}

// --- iconos y color ---
const conIcono = parse('<!-- layout: contenido; color: mustard-800 -->\n# T\n<!-- bullets -->\n- [finanzas/ahorro] Texto **fuerte**\n- Sin icono\n- [esenciales/x-y.z] Otro');
const [i0, i1, i2] = conIcono.slides[0].regiones[0][0].items;
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

const malColor = parse('<!-- layout: contenido; color: no-existe -->\n# T\n<!-- bullets -->\n- [a/b] x');
assert.equal(componer(malColor.slides[0], { meta: {}, n: 1, total: 1 }).boxes.find(b => b.kind === 'icon').fill, '#0043A9');

assert.deepEqual(parse('---\nfuente: kiffo\n---\n# T').fuentes, { display: 'Kiffo BDB', body: 'Kiffo BDB' });
assert.deepEqual(parse('# T').fuentes, { display: 'Kiffo BDB', body: 'Roboto' });

// Las referencias de icono de la plantilla deben existir de verdad
try {
  const manifest = JSON.parse(readFileSync(new URL('./assets/manifest.json', import.meta.url), 'utf8'));
  for (const s of ir.slides) {
    for (const c of s.regiones.flat()) {
      for (const it of c.items ?? []) {
        if (!it.icono) continue;
        const [cat, nombre] = it.icono.split('/');
        assert.ok(manifest.icons[cat]?.includes(`${nombre}.svg`), `icono inexistente en plantilla.md: ${it.icono}`);
      }
    }
  }
} catch (e) {
  if (e.code !== 'ENOENT') throw e;
  console.warn('aviso: assets/ sin sincronizar, no se validaron las rutas de icono (npm run sync-assets)');
}

// --- formulario: campos ↔ bloque ---
{
  assert.deepEqual(Object.keys(CAMPOS_SLIDE).sort(), [...LAYOUTS].sort(),
    'CAMPOS_SLIDE y el catálogo de layouts tienen que coincidir');

  // La garantía que sostiene el formulario: editar por campos no pierde nada.
  for (const b of bloques(md)) {
    const vuelta = aBloque(aCampos(b));
    assert.deepEqual(parse(vuelta).slides[0], parse(b).slides[0],
      `campos → bloque cambia el IR:\n${b}\n---\n${vuelta}`);
  }

  // Añadir cualquier componente produce Markdown que vuelve a parsear y componer
  for (const tipo of TIPOS) {
    const c = aCampos('<!-- layout: contenido -->\n# T');
    c.regiones[0].push(componenteVacio(tipo));
    const p = parse(aBloque(c)).slides[0];
    assert.equal(p.regiones[0][0]?.tipo, tipo, `añadir ${tipo} no sobrevive el viaje al Markdown`);
    componer(p, { meta: {}, n: 1, total: 1 });
  }

  // Quitar el último componente deja la diapositiva válida
  const sinComps = aCampos('<!-- layout: contenido -->\n# T\n\n<!-- parrafo -->\nx');
  sinComps.regiones = [[]];
  assert.equal(parse(aBloque(sinComps)).slides[0].regiones[0].length, 0);

  // Un icono elegido en el picker sobrevive el viaje al Markdown
  const conIco = aCampos('<!-- layout: contenido -->\n# T');
  conIco.regiones[0].push(componenteVacio('bullets'));
  conIco.regiones[0][0].items[0] = { texto: 'x', extra: '', icono: 'finanzas/ahorro' };
  assert.match(aBloque(conIco), /- \[finanzas\/ahorro\] x/);

  assert.equal(componenteVacio('stats').items.length, 2, 'stats arranca con el mínimo de cifras');
  assert.equal(componenteVacio('bullets').items.length, 3, 'bullets arranca con 3 puntos');
  assert.equal(itemVacio({ pares: ['a', 'b'] }).extra, '');
}

// --- exportador de Figma: el árbol que viaja al MCP ---
{
  const a = arbol(md);
  assert.equal(a.slides.length, 13);
  assert.equal(a.pagina, 'Plantilla de presentaciones', 'la página toma el título del deck');
  assert.equal(a.fuentes.display, 'Kiffo BDB', 'el nombre de familia en Figma va en mayúsculas, no como en el CSS');
  assert.deepEqual(a.avisos, [], `el árbol de la plantilla no debe avisar:\n${a.avisos.join('\n')}`);

  const todas = a.slides.flatMap(s => s.boxes);
  assert.equal(todas.length, todas.filter(b => b.kind).length, 'toda caja lleva kind');

  // Dentro de Figma no hay red ni disco: todo SVG referenciado tiene que viajar.
  for (const b of todas) {
    if (b.kind === 'svg' || b.kind === 'icon') {
      assert.ok(a.svgs[b.src]?.startsWith('<svg'), `falta el svg de ${b.src}`);
    }
  }

  // El límite duro: use_figma admite 50k por llamada y push.py trocea a 38k.
  const bytes = JSON.stringify(a).length;
  assert.ok(bytes < 38000 * 20, `árbol de ${bytes} bytes: revisa el troceado`);

  assert.equal(arbol('---\nfuente: kiffo\n---\n# T').fuentes.body, 'Kiffo BDB');
}

// --- edición del deck: reordenar, duplicar, borrar ---
{
  const t = ir.slides.map(s => s.layout);
  const orden = doc => parse(doc).slides.map(s => s.layout);

  assert.equal(bloques(md).length, 13);
  assert.deepEqual(orden(reconstruir(md, bloques(md))), t, 'reconstruir es idempotente');
  assert.match(reconstruir(md, bloques(md)), /^---\ntitulo:/, 'conserva el frontmatter');

  const ult = t.length - 1;
  const movido = moverSlide(md, ult, 1);
  assert.deepEqual(orden(movido), [t[0], t[ult], ...t.slice(1, ult)]);
  assert.deepEqual(orden(moverSlide(movido, 1, ult)), t, 'mover y devolver deja el orden original');
  assert.equal(moverSlide(md, 3, 3), md, 'mover a la misma posición no cambia nada');
  assert.equal(moverSlide(md, 0, 99), md, 'índice fuera de rango no rompe');

  assert.deepEqual(orden(duplicarSlide(md, 0)), [t[0], t[0], ...t.slice(1)]);
  assert.deepEqual(orden(borrarSlide(md, 0)), t.slice(1));
  assert.equal(bloques(borrarSlide('# Único', 0)).length, 1, 'nunca deja el deck vacío');

  for (let i = 0; i < t.length; i++) {
    const { ini, fin } = limites(md, inicioSlide(md, i));
    assert.equal(md.slice(ini, fin).trim(), bloques(md)[i], `inicioSlide(${i}) apunta a la diapositiva ${i}`);
  }

  const nuevo = reemplazarBloque(md, 1, '<!-- layout: section; tag: 99 -->\n# Otra cosa');
  assert.equal(bloques(nuevo).length, t.length);
  assert.equal(parse(nuevo).slides[1].layout, 'section');
  assert.equal(bloques(nuevo)[0], bloques(md)[0], 'no toca los vecinos');
  assert.equal(reemplazarBloque(md, 99, 'x'), md, 'índice fuera de rango no rompe');

  assert.match(frontmatterTexto(md), /^titulo: Plantilla de presentaciones/);
  assert.ok(!frontmatterTexto(md).includes('---'), 'sin las vallas');
  const cambiado = ponerFrontmatterTexto(md, 'titulo: Otro\nfuente: kiffo');
  assert.equal(parse(cambiado).meta.titulo, 'Otro');
  assert.equal(bloques(cambiado).length, t.length, 'cambiar el frontmatter no toca las diapositivas');
  assert.equal(finFm(ponerFrontmatterTexto(md, '   ')), 0, 'frontmatter vacío se elimina');
}

// --- edición: las funciones que mueve la barra ---
{
  const doc = '---\ntitulo: X\n---\n\n<!-- layout: cover -->\n# Uno\n\n---\n\n<!-- layout: contenido -->\n# Dos';
  const posUno = doc.indexOf('# Uno');
  const posDos = doc.indexOf('# Dos');

  assert.ok(limites(doc, 5).frontmatter, 'el cursor en el frontmatter se detecta');

  const b1 = envolver('hola mundo', 5, 10);
  assert.equal(b1.md, 'hola **mundo**');
  assert.equal(envolver(b1.md, 7, 12).md, 'hola mundo', 'el botón alterna, no acumula asteriscos');

  assert.match(ponerOpcion(doc, posDos, 'color', 'mustard-800').md, /<!-- layout: contenido; color: mustard-800 -->/);
  assert.equal(leerOpcion(ponerOpcion(doc, posDos, 'color', 'mustard-800').md, posDos, 'color'), 'mustard-800');
  assert.match(ponerOpcion(doc, posDos, 'layout', 'section').md, /<!-- layout: section -->/, 'reemplaza, no duplica');
  assert.equal(leerOpcion(doc, 5, 'layout'), '', 'en el frontmatter no hay opciones de diapositiva');

  assert.match(ponerFrontmatter(doc, 'fuente', 'kiffo'), /^---\ntitulo: X\nfuente: kiffo\n---/);
  assert.match(ponerFrontmatter('# Sin frontmatter', 'fuente', 'kiffo'), /^---\nfuente: kiffo\n---\n\n# Sin/);
  assert.equal(leerFrontmatter(doc, 'titulo'), 'X');

  for (const layout of Object.keys(ESQUELETOS)) {
    const { md: n } = agregarSlide(doc, posUno, layout);
    const p = parse(n);
    assert.equal(p.slides.length, 3, `agregarSlide(${layout}) debe dejar 3 diapositivas`);
    assert.equal(p.slides[1].layout, layout, 'la diapositiva nueva va justo después del cursor');
    p.slides.forEach(s => componer(s, { meta: p.meta, n: s.n, total: 3 }));
  }
}

// --- búsqueda del picker de iconos ---
{
  const falso = { icons: { finanzas: ['ahorro-cuenta.svg', 'tarjeta.svg'], vivienda: ['casa-hogar.svg'] } };
  assert.equal(filtrarIconos(falso).length, 3);
  assert.equal(filtrarIconos(falso, '', 'finanzas').length, 2, 'filtra por categoría');
  assert.deepEqual(filtrarIconos(falso, 'hogar')[0], { ref: 'vivienda/casa-hogar', nombre: 'casa hogar', cat: 'vivienda' });
  assert.equal(filtrarIconos(falso, 'AHORRO').length, 1, 'la búsqueda ignora mayúsculas');
  assert.equal(filtrarIconos(falso, 'vivienda').length, 1, 'también busca por nombre de categoría');
  assert.deepEqual(filtrarIconos(null), [], 'sin manifiesto no revienta');
}

// --- estados parciales: mientras escribes, el render no puede reventar ---
const parciales = ['', '# ', '---', '- ', '<!-- ', '**', '<!-- layout: contenido -->\n<!-- bullets -->\n- '];
for (const l of LAYOUTS) parciales.push(`<!-- layout: ${l} -->`, `<!-- layout: ${l} -->\n# T`);
for (const t of TIPOS) parciales.push(`<!-- layout: contenido -->\n<!-- ${t} -->`, `<!-- layout: contenido -->\n<!-- ${t} -->\n- a | b`);
for (const x of parciales) {
  assert.doesNotThrow(() => {
    const p = parse(x);
    p.slides.forEach(s => componer(s, { meta: p.meta, n: 1, total: 1 }));
  }, `revienta con entrada parcial: ${JSON.stringify(x.slice(0, 40))}`);
}

console.log(`ok — ${ir.slides.length} diapositivas, ${LAYOUTS.length} layouts, ${TIPOS.length} componentes, ${cajas} cajas, 0 avisos, ${parciales.length} estados parciales`);
