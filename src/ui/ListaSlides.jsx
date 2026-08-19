import { useEffect, useRef, useState } from 'react';
import { CANVAS } from '../core/layouts.js';
import { Slide } from './Deck.jsx';

const ANCHO = 176;   // px de la miniatura
const ALTO = Math.round(ANCHO * CANVAS.h / CANVAS.w);

/**
 * Mientras el textarea tiene el foco manda el estado local, no el `md` canónico.
 * Sin esto, `bloques()` recorta los extremos y pulsar Enter al final de un slide
 * no haría nada: el salto de línea se perdería antes de verse.
 */
function useTextoLocal(texto) {
  const [local, setLocal] = useState(texto);
  const editando = useRef(false);
  useEffect(() => { if (!editando.current) setLocal(texto); }, [texto]);
  return {
    valor: local,
    props: {
      onChange: null,   // lo pone quien usa el hook
      onFocus: () => { editando.current = true; },
      onBlur: () => { editando.current = false; setLocal(texto); },
    },
    escribir: setLocal,
  };
}

function Fila({ slide, ir, texto, indice, total, actual, sobre, onTexto, onFoco, onIr, onMover, onDuplicar, onBorrar, drag }) {
  const t = useTextoLocal(texto);
  const ta = useRef(null);

  return (
    <li
      className={[indice === actual ? 'sel' : '', sobre ? 'sobre' : ''].filter(Boolean).join(' ')}
      onDragOver={e => { e.preventDefault(); drag.sobre(indice); }}
      onDrop={e => { e.preventDefault(); drag.soltar(indice); }}
    >
      <div className="cab">
        {/* Solo el asa arrastra: si el <li> entero fuera draggable, seleccionar
            texto dentro del textarea iniciaría un arrastre. */}
        <span className="asa" draggable title="Arrastra para reordenar"
          onDragStart={e => { drag.tomar(indice); e.dataTransfer.effectAllowed = 'move'; }}
          onDragEnd={drag.fin}>⠿</span>
        <span className="etiqueta">{slide.n} · {slide.layout}</span>
        <span className="acciones">
          <button title="Subir" disabled={indice === 0} onClick={() => onMover(indice, indice - 1)}>↑</button>
          <button title="Bajar" disabled={indice === total - 1} onClick={() => onMover(indice, indice + 1)}>↓</button>
          <button title="Duplicar" onClick={() => onDuplicar(indice)}>⧉</button>
          <button title="Borrar" disabled={total <= 1} onClick={() => onBorrar(indice)}>✕</button>
        </span>
      </div>

      <div className="cuerpo">
        <button className="mini" onClick={() => onIr(indice)} title="Ver en el lienzo"
          style={{ width: ANCHO, height: ALTO }}>
          <div style={{ zoom: ANCHO / CANVAS.w }}><Slide slide={slide} ir={ir} /></div>
        </button>

        <textarea ref={ta} spellCheck={false} value={t.valor}
          onChange={e => { t.escribir(e.target.value); onTexto(indice, e.target.value); }}
          onFocus={e => { t.props.onFocus(); onFoco(indice, e.target); }}
          onBlur={t.props.onBlur} />
      </div>
    </li>
  );
}

export function ListaSlides({ ir, textos, actual, onTexto, onFoco, onIr, onMover, onDuplicar, onBorrar }) {
  const [sobre, setSobre] = useState(null);
  const tomado = useRef(null);

  const drag = {
    tomar: i => { tomado.current = i; },
    sobre: i => setSobre(i),
    fin: () => { tomado.current = null; setSobre(null); },
    soltar: destino => {
      const origen = tomado.current;
      drag.fin();
      if (origen !== null && origen !== destino) onMover(origen, destino);
    },
  };

  return (
    <ol className="slides">
      {ir.slides.map((s, i) => (
        <Fila key={i} slide={s} ir={ir} texto={textos[i] ?? ''} indice={i} total={ir.slides.length}
          actual={actual} sobre={sobre === i} drag={drag}
          onTexto={onTexto} onFoco={onFoco} onIr={onIr}
          onMover={onMover} onDuplicar={onDuplicar} onBorrar={onBorrar} />
      ))}
    </ol>
  );
}
