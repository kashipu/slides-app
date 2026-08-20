import { useEffect, useMemo, useRef, useState } from 'react';
import { parse } from '../core/parse.js';
import { CANVAS } from '../core/layouts.js';
import { Deck } from './Deck.jsx';
import { Editor } from './Editor.jsx';
import { borrarSlide, duplicarSlide, moverSlide } from './md.js';
import { descargarHTML } from '../export/html.jsx';

const CLAVE = 'slides-app:decks';
const CLAVE_ACTUAL = 'slides-app:actual';
const PRIMERA = 'Mi presentación';

// Los .md de decks/ los resuelve Vite en build: la lista sale sola, sin
// endpoint que liste el directorio y sin buscar el archivo a mano.
const ARCHIVOS = import.meta.glob('/decks/*.md', { query: '?raw', import: 'default' });
const DEL_PROYECTO = Object.fromEntries(
  Object.entries(ARCHIVOS).map(([ruta, cargar]) => [ruta.split('/').pop().replace(/\.md$/, ''), cargar]),
);

const deckVacio = titulo =>
  `---\ntitulo: ${titulo}\ntema: light\n---\n\n<!-- layout: cover -->\n# ${titulo}\n\n---\n\n<!-- layout: contenido -->\n# Primera diapositiva\n\n<!-- parrafo -->\nEscribe aquí.\n`;

/** Todas las presentaciones viven en una clave: {nombre: markdown}. */
function cargarDecks() {
  try {
    const guardados = JSON.parse(localStorage.getItem(CLAVE) || 'null');
    if (guardados && Object.keys(guardados).length) return guardados;
    // La app guardaba una sola presentación en `slides-app:md`. Si queda algo
    // ahí es el trabajo del usuario: se migra en vez de perderse.
    const viejo = localStorage.getItem('slides-app:md');
    if (viejo?.trim()) return { [PRIMERA]: viejo };
  } catch { /* localStorage corrupto: se empieza de cero */ }
  return { [PRIMERA]: deckVacio(PRIMERA) };
}

export function App() {
  const [decks, setDecks] = useState(cargarDecks);
  const [nombre, setNombre] = useState(() => {
    const guardado = localStorage.getItem(CLAVE_ACTUAL);
    return guardado && decks[guardado] ? guardado : Object.keys(decks)[0];
  });
  // La plantilla es solo de lectura: es el catálogo, no un deck editable.
  const [verPlantilla, setVerPlantilla] = useState(false);
  const [plantilla, setPlantilla] = useState('');
  const [actual, setActual] = useState(0);
  const [presentando, setPresentando] = useState(false);
  const [zoom, setZoom] = useState(1);
  const lienzo = useRef(null);

  const md = verPlantilla ? plantilla : (decks[nombre] ?? '');
  const setMd = txt => setDecks(d => ({ ...d, [nombre]: txt }));

  // Un deck a medio escribir puede tener estados que el compositor no espera.
  // parse y componer ya toleran campos vacíos, pero si algo escapa preferimos
  // mostrar el error a congelar la vista en el último render bueno.
  const { ir, error } = useMemo(() => {
    try { return { ir: parse(md), error: null }; }
    catch (e) { return { ir: { meta: {}, slides: [], avisos: [] }, error: String(e.message ?? e) }; }
  }, [md]);

  useEffect(() => { localStorage.setItem(CLAVE, JSON.stringify(decks)); }, [decks]);
  useEffect(() => { localStorage.setItem(CLAVE_ACTUAL, nombre); }, [nombre]);

  // La plantilla se baja una sola vez, la primera que se abre la vista.
  useEffect(() => {
    if (!verPlantilla || plantilla) return;
    fetch('/decks/plantilla.md').then(r => r.text()).then(setPlantilla);
  }, [verPlantilla]);

  useEffect(() => {
    const ajustar = () => {
      const el = lienzo.current;
      if (!el) return;
      const ancho = el.clientWidth - (presentando ? 0 : 48);
      setZoom(presentando
        ? Math.min(ancho / CANVAS.w, el.clientHeight / CANVAS.h)
        : ancho / CANVAS.w);
    };
    ajustar();
    addEventListener('resize', ajustar);
    return () => removeEventListener('resize', ajustar);
    // slides.length entra en las deps para re-medir cuando el deck carga: en el
    // primer render todavía no hay barra vertical y clientWidth sale de más.
  }, [presentando, ir.slides.length]);

  useEffect(() => {
    if (!presentando) return;
    const tecla = e => {
      if (e.key === 'ArrowRight' || e.key === ' ') setActual(n => Math.min(n + 1, ir.slides.length - 1));
      if (e.key === 'ArrowLeft') setActual(n => Math.max(n - 1, 0));
      if (e.key === 'Escape') { setPresentando(false); document.exitFullscreen?.(); }
    };
    addEventListener('keydown', tecla);
    return () => removeEventListener('keydown', tecla);
  }, [presentando, ir.slides.length]);

  /** selecciona el slide i y lo trae al lienzo */
  const irA = i => {
    setActual(i);
    lienzo.current?.querySelector(`[data-n="${i + 1}"]`)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  };

  const reordenar = (desde, hasta) => {
    setMd(moverSlide(md, desde, hasta));
    setActual(hasta);
  };

  const abrir = n => { setNombre(n); setVerPlantilla(false); setActual(0); };

  const crear = () => {
    const n = prompt('Nombre de la presentación nueva')?.trim();
    if (!n) return;
    if (!decks[n]) setDecks(d => ({ ...d, [n]: deckVacio(n) }));
    abrir(n);
  };

  /** un .md entra como presentación; si el nombre choca, se numera */
  const importar = (base, txt) => {
    let n = base || 'Importada';
    for (let i = 2; decks[n]; i++) n = `${base} ${i}`;
    setDecks(d => ({ ...d, [n]: txt }));
    abrir(n);
  };

  /** abre uno de los .md que viven en decks/ */
  const abrirDelProyecto = async base => {
    if (decks[base]) return abrir(base);
    importar(base, await DEL_PROYECTO[base]());
  };

  const borrarDeck = () => {
    const otros = Object.keys(decks).filter(n => n !== nombre);
    if (!otros.length || !confirm(`¿Borrar «${nombre}»? No se puede deshacer.`)) return;
    setDecks(d => Object.fromEntries(Object.entries(d).filter(([n]) => n !== nombre)));
    abrir(otros[0]);
  };

  return (
    <div id="app" className={presentando ? 'presentando' : undefined}>
      {/* Editor y miniaturas son un solo panel: cada slide se edita en su propio
          bloque, junto a su miniatura. El lienzo queda entero para mirar. */}
      <Editor
        md={md} ir={ir} onChange={setMd} avisos={ir.avisos} error={error}
        actual={actual} onIr={irA}
        onMover={reordenar}
        onDuplicar={i => { setMd(duplicarSlide(md, i)); setActual(i + 1); }}
        onBorrar={i => { setMd(borrarSlide(md, i)); setActual(Math.max(0, i - 1)); }}
        nombre={nombre} nombres={Object.keys(decks)}
        onAbrir={abrir} onCrear={crear} onBorrarDeck={borrarDeck} onImportar={importar}
        delProyecto={Object.keys(DEL_PROYECTO)} onAbrirDelProyecto={abrirDelProyecto}
        verPlantilla={verPlantilla}
        onPlantilla={() => { setVerPlantilla(v => !v); setActual(0); }}
        onHTML={() => descargarHTML(ir)}
        onPresentar={() => { setPresentando(true); document.documentElement.requestFullscreen?.(); }}
        onPDF={() => print()}
      />

      <main id="lienzo" ref={lienzo}>
        <Deck ir={ir} actual={actual} zoom={zoom} />
      </main>
    </div>
  );
}
