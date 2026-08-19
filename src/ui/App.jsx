import { useEffect, useMemo, useRef, useState } from 'react';
import { parse } from '../core/parse.js';
import { CANVAS } from '../core/layouts.js';
import { Deck } from './Deck.jsx';
import { Editor } from './Editor.jsx';
import { borrarSlide, duplicarSlide, moverSlide } from './md.js';
import { descargarHTML } from '../export/html.jsx';

const CLAVE = 'slides-app:md';

export function App() {
  const [md, setMd] = useState(() => localStorage.getItem(CLAVE) ?? '');
  const [actual, setActual] = useState(0);
  const [presentando, setPresentando] = useState(false);
  const [zoom, setZoom] = useState(1);
  const lienzo = useRef(null);

  // Un deck a medio escribir puede tener estados que el compositor no espera.
  // parse y componer ya toleran campos vacíos, pero si algo escapa preferimos
  // mostrar el error a congelar la vista en el último render bueno.
  const { ir, error } = useMemo(() => {
    try { return { ir: parse(md), error: null }; }
    catch (e) { return { ir: { meta: {}, slides: [], avisos: [] }, error: String(e.message ?? e) }; }
  }, [md]);

  useEffect(() => { localStorage.setItem(CLAVE, md); }, [md]);

  useEffect(() => {
    if (md) return;
    fetch('/decks/plantilla.md').then(r => r.text()).then(setMd);
  }, []);

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
        onPlantilla={() => fetch('/decks/plantilla.md').then(r => r.text()).then(setMd)}
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
