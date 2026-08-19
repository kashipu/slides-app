// Árbol de cajas → frames de Figma. Se ejecuta dentro de use_figma.
// push.py inyecta __CHUNKS__ y reensambla el árbol desde sharedPluginData,
// porque use_figma admite 50k por llamada.
const NS = "bdb.slides";
let _raw = "";
for (let i = 0; i < __CHUNKS__; i++) _raw += figma.root.getSharedPluginData(NS, "arbol" + i);
const D = JSON.parse(_raw);

// --- color ---------------------------------------------------------------
function rgb(h) {
  h = String(h).replace("#", "");
  return { r: parseInt(h.slice(0, 2), 16) / 255, g: parseInt(h.slice(2, 4), 16) / 255, b: parseInt(h.slice(4, 6), 16) / 255 };
}
/** acepta #RRGGBB y rgba(r,g,b,a) — los dos formatos que produce tokens.js */
function color(v) {
  const m = String(v).match(/rgba?\(([^)]+)\)/);
  if (!m) return { c: rgb(v), a: 1 };
  const p = m[1].split(",").map(x => parseFloat(x.trim()));
  return { c: { r: p[0] / 255, g: p[1] / 255, b: p[2] / 255 }, a: p[3] == null ? 1 : p[3] };
}
const solido = v => { const { c, a } = color(v); return [{ type: "SOLID", color: c, opacity: a }]; };

// ponytail: layouts.js produce un solo gradiente — el velo de los slides de
// imagen, vertical y de transparente a negro. Se reconoce y se traduce; cualquier
// otro caería aquí y hay que ampliarlo entonces, no antes.
function relleno(v) {
  if (!String(v).startsWith("linear-gradient")) return solido(v);
  const fin = color((String(v).match(/rgba?\([^)]+\)/g) || ["rgba(0,0,0,.72)"]).pop());
  return [{
    type: "GRADIENT_LINEAR",
    gradientTransform: [[0, 1, 0], [-1, 0, 1]],   // 180°: arriba → abajo
    gradientStops: [
      { position: 0, color: { ...fin.c, a: 0 } },
      { position: 1, color: { ...fin.c, a: fin.a } },
    ],
  }];
}

/** repinta todos los fills/strokes de un árbol de nodos (los SVG traen fill negro fijo) */
function tenir(nodo, v) {
  const { c } = color(v), pila = [nodo];
  while (pila.length) {
    const n = pila.pop();
    if ("fills" in n && Array.isArray(n.fills)) n.fills = n.fills.map(f => (f.type === "SOLID" ? { ...f, color: c } : f));
    if ("strokes" in n && Array.isArray(n.strokes)) n.strokes = n.strokes.map(s => (s.type === "SOLID" ? { ...s, color: c } : s));
    if ("children" in n) pila.push(...n.children);
  }
}

// --- fuentes -------------------------------------------------------------
const estilo = (familia, peso) => (D.estilos[familia] || {})[String(peso)] || "Regular";
const NEGRITA = { display: 600, body: 700 };

const usadas = {};
for (const s of D.slides) {
  for (const b of s.boxes) {
    if (b.kind !== "text") continue;
    const fam = D.fuentes[b.font];
    usadas[fam + "|" + estilo(fam, b.weight)] = { family: fam, style: estilo(fam, b.weight) };
    const n = estilo(fam, NEGRITA[b.font]);
    usadas[fam + "|" + n] = { family: fam, style: n };
  }
}
const faltantes = [];
for (const k of Object.keys(usadas)) {
  try { await figma.loadFontAsync(usadas[k]); } catch { faltantes.push(k); }
}
// Si la fuente de marca no está, se avisa y se sigue en Roboto: mejor eso que
// dejar media presentación construida y reventar en el slide 6.
const RESPALDO = { family: "Roboto", style: "Regular" };
await figma.loadFontAsync(RESPALDO);
const fuente = (fam, peso) => {
  const f = { family: fam, style: estilo(fam, peso) };
  return faltantes.includes(f.family + "|" + f.style) ? RESPALDO : f;
};

// --- página: una por presentación ---------------------------------------
let page = figma.root.children.find(p => p.name === D.pagina);
if (page) {
  await figma.setCurrentPageAsync(page);
  for (const hijo of [...page.children]) hijo.remove();   // reemplaza, no duplica
} else {
  page = figma.createPage();
  page.name = D.pagina;
  await figma.setCurrentPageAsync(page);
}

// --- cajas ---------------------------------------------------------------
function texto(b) {
  const fam = D.fuentes[b.font];
  const t = figma.createText();
  t.fontName = fuente(fam, b.weight);
  t.characters = b.runs.map(r => r.t).join("");
  t.fontSize = b.size;
  t.lineHeight = { unit: "PERCENT", value: b.lh * 100 };
  if (b.tracking) t.letterSpacing = { unit: "PIXELS", value: b.tracking };
  t.textAlignHorizontal = (b.align || "left").toUpperCase();
  t.fills = solido(b.color);

  // negrita por rango, a partir de los offsets de los runs
  let i = 0;
  for (const r of b.runs) {
    if (r.b && r.t.length) t.setRangeFontName(i, i + r.t.length, fuente(fam, NEGRITA[b.font]));
    i += r.t.length;
  }

  // Ancho fijo y alto automático: el Roboto de Figma es 2-6% más ancho que el
  // del navegador, así que se deja que Figma decida cuántas líneas ocupa en vez
  // de imponerle el alto estimado.
  t.textAutoResize = "HEIGHT";
  t.resize(b.w, t.height);
  return t;
}

function desdeSVG(b) {
  const svg = D.svgs[b.src];
  if (!svg) return null;
  const n = figma.createNodeFromSvg(svg);
  if (n.width) n.rescale(b.w / n.width);
  if (b.kind === "icon") tenir(n, b.fill);
  return n;
}

let cajas = 0, sinSVG = [];
D.slides.forEach((s, i) => {
  const f = figma.createFrame();
  f.name = s.nombre;
  f.resize(1920, 1080);
  f.x = i * (1920 + D.separacion);
  f.y = 0;
  f.fills = solido(s.bg);
  f.clipsContent = true;
  page.appendChild(f);

  for (const b of s.boxes) {
    let n = null;
    if (b.kind === "text") { n = texto(b); n.name = b.runs.map(r => r.t).join("").slice(0, 40) || "Texto"; }
    else if (b.kind === "rect") {
      n = figma.createRectangle();
      n.resize(b.w, b.h);
      n.fills = relleno(b.fill);
      if (b.r) n.cornerRadius = b.r;
      n.name = "Forma";
    } else if (b.kind === "icon" || b.kind === "svg") {
      n = desdeSVG(b);
      if (!n) { sinSVG.push(b.src); continue; }
      n.name = b.src;
    }
    if (!n) continue;
    f.appendChild(n);
    n.x = b.x; n.y = b.y;
    cajas++;
  }
});

figma.currentPage.selection = [];
const screen = page.children[0];
/*__SCREENSHOT__*/

return { pagina: page.name, slides: D.slides.length, cajas, fuentesFaltantes: faltantes, sinSVG };
