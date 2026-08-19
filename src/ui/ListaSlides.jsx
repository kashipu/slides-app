import { useRef, useState } from 'react';
import { CANVAS } from '../core/layouts.js';
import { Slide } from './Deck.jsx';

const ANCHO = 150;
const ALTO = Math.round(ANCHO * CANVAS.h / CANVAS.w);

/**
 * Tira de miniaturas: navegar y reordenar. La edición vive en el formulario,
 * no aquí — con 11 editores abiertos a la vez no cabía nada.
 * Los botones ↑ ↓ no son decoración: el drag-and-drop nativo no se maneja con
 * teclado y reordenar tiene que poder hacerse sin ratón.
 */
export function ListaSlides({ ir, actual, onIr, onMover, onDuplicar, onBorrar }) {
  const [sobre, setSobre] = useState(null);
  const tomado = useRef(null);

  const soltar = destino => {
    const origen = tomado.current;
    tomado.current = null;
    setSobre(null);
    if (origen !== null && origen !== destino) onMover(origen, destino);
  };

  return (
    <ol className="slides">
      {ir.slides.map((s, i) => (
        <li key={i} className={[i === actual ? 'sel' : '', sobre === i ? 'sobre' : ''].filter(Boolean).join(' ')}
          draggable
          onDragStart={e => { tomado.current = i; e.dataTransfer.effectAllowed = 'move'; }}
          onDragOver={e => { e.preventDefault(); setSobre(i); }}
          onDrop={e => { e.preventDefault(); soltar(i); }}
          onDragEnd={() => { tomado.current = null; setSobre(null); }}
        >
          <button className="mini" onClick={() => onIr(i)} title={`${s.n} · ${s.layout}`}
            style={{ width: ANCHO, height: ALTO }}>
            <div style={{ zoom: ANCHO / CANVAS.w }}><Slide slide={s} ir={ir} /></div>
          </button>
          <div className="cab">
            <span className="etiqueta">{s.n} · {s.layout}</span>
            <span className="acciones">
              <button title="Subir" disabled={i === 0} onClick={() => onMover(i, i - 1)}>↑</button>
              <button title="Bajar" disabled={i === ir.slides.length - 1} onClick={() => onMover(i, i + 1)}>↓</button>
              <button title="Duplicar" onClick={() => onDuplicar(i)}>⧉</button>
              <button title="Borrar" disabled={ir.slides.length <= 1} onClick={() => onBorrar(i)}>✕</button>
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}
