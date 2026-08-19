import { useRef, useState } from 'react';
import { CAMPOS, aBloque, aCampos, itemVacio } from './campos.js';
import { envolver } from './md.js';

// Colores de acento: tokens de Sherpa, no un selector RGB libre.
const COLORES = [
  ['', 'Azul (por defecto)'],
  ['brand-yellow', 'Amarillo de marca'],
  ['success-800', 'Verde'],
  ['error-800', 'Rojo'],
  ['mustard-800', 'Mostaza'],
  ['peach-800', 'Durazno'],
  ['mauve-800', 'Malva'],
  ['bluey-800', 'Azul verdoso'],
  ['carbon-800', 'Gris'],
];

const LAYOUTS = Object.keys(CAMPOS);

/** chip que muestra el icono de verdad; en un textarea solo se veía [cat/nombre] */
function ChipIcono({ valor, onElegir, onQuitar }) {
  if (!valor) return <button className="chip vacio" onClick={onElegir} title="Añadir icono">＋</button>;
  return (
    <span className="chip">
      <button onClick={onElegir} title={valor}>
        <img src={`/assets/iconos/${valor}.svg`} alt="" />
      </button>
      <button className="quitar" onClick={onQuitar} title="Quitar icono">✕</button>
    </span>
  );
}

export function SlideForm({ bloque, indice, total, onBloque, onPicker, onImagen, onMarkdown, verMarkdown }) {
  const c = aCampos(bloque);
  const campos = CAMPOS[c.layout] ?? [];
  const foco = useRef(null);
  const [subiendo, setSubiendo] = useState(null);

  const set = cambios => onBloque(aBloque({ ...c, ...cambios }));
  const setItem = (i, cambios) => {
    const items = c.items.map((it, j) => (j === i ? { ...it, ...cambios } : it));
    set({ items });
  };
  const campoLista = campos.find(f => f.tipo === 'lista');

  const negrita = () => {
    const el = foco.current;
    if (!el || el.selectionStart === el.selectionEnd) return;
    const r = envolver(el.value, el.selectionStart, el.selectionEnd);
    const k = el.dataset.campo;
    const i = el.dataset.item;
    if (i == null) set({ [k]: r.md });
    else setItem(Number(i), { [k]: r.md });
  };

  const props = (k, i) => ({
    ref: null,
    'data-campo': k,
    'data-item': i,
    onFocus: e => { foco.current = e.target; },
  });

  const subir = async e => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    setSubiendo('Subiendo…');
    try {
      const ruta = await onImagen(f);
      set({ imagen: ruta });
      setSubiendo(null);
    } catch (err) {
      setSubiendo(`No se pudo subir: ${err.message}`);
      setTimeout(() => setSubiendo(null), 5000);
    }
  };

  return (
    <div className="form">
      <div className="form-cab">
        <span className="num">Diapositiva {indice + 1} de {total}</span>
        <button onClick={onMarkdown} className={verMarkdown ? 'primary' : ''}>Markdown</button>
      </div>

      {verMarkdown ? (
        <textarea className="crudo" spellCheck={false} value={bloque}
          onChange={e => onBloque(e.target.value)} />
      ) : (
        <>
          <label>Layout
            <select value={c.layout} onChange={e => set({ layout: e.target.value })}>
              {LAYOUTS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </label>

          {campos.map(f => {
            if (f.tipo === 'linea') return (
              <label key={f.k}>{f.label}
                <input value={c[f.k]} placeholder={f.label} {...props(f.k)}
                  onChange={e => set({ [f.k]: e.target.value })} />
              </label>
            );

            if (f.tipo === 'parrafo') return (
              <label key={f.k}>{f.label}
                <textarea rows={3} value={c[f.k]} placeholder={f.label} {...props(f.k)}
                  onChange={e => set({ [f.k]: e.target.value })} />
              </label>
            );

            if (f.tipo === 'imagen') return (
              <label key={f.k}>{f.label}
                <div className="fila">
                  <input value={c.imagen} placeholder="decks/img/…" {...props('imagen')}
                    onChange={e => set({ imagen: e.target.value })} />
                  <button onClick={() => document.getElementById('subir-img').click()}>Subir…</button>
                  <input id="subir-img" type="file" accept="image/*" hidden onChange={subir} />
                </div>
                {subiendo && <small>{subiendo}</small>}
              </label>
            );

            // lista
            return (
              <div key={f.k} className="lista-campo">
                <span className="etiqueta-campo">
                  {f.label}
                  <small>{c.items.length}{f.min ? ` · ${f.min}–${f.max} recomendado` : ''}</small>
                </span>

                {c.items.map((it, i) => (
                  <div key={i} className="item">
                    {f.icono && (
                      <ChipIcono
                        valor={it.icono}
                        onElegir={() => onPicker(ref => setItem(i, { icono: ref }))}
                        onQuitar={() => setItem(i, { icono: '' })}
                      />
                    )}
                    <div className="campos-item">
                      <input value={it.texto} placeholder={f.pares ? f.pares[0] : 'Texto del punto'}
                        {...props('texto', i)} onChange={e => setItem(i, { texto: e.target.value })} />
                      {f.pares && (
                        <input value={it.extra} placeholder={f.pares[1]}
                          {...props('extra', i)} onChange={e => setItem(i, { extra: e.target.value })} />
                      )}
                    </div>
                    <span className="acciones">
                      <button title="Subir" disabled={i === 0}
                        onClick={() => { const x = [...c.items]; x.splice(i - 1, 0, x.splice(i, 1)[0]); set({ items: x }); }}>↑</button>
                      <button title="Bajar" disabled={i === c.items.length - 1}
                        onClick={() => { const x = [...c.items]; x.splice(i + 1, 0, x.splice(i, 1)[0]); set({ items: x }); }}>↓</button>
                      <button title="Quitar" disabled={c.items.length <= 1}
                        onClick={() => set({ items: c.items.filter((_, j) => j !== i) })}>✕</button>
                    </span>
                  </div>
                ))}

                <button className="anadir" disabled={f.max && c.items.length >= f.max}
                  onClick={() => set({ items: [...c.items, itemVacio(f)] })}>＋ Añadir</button>
              </div>
            );
          })}

          <div className="fila-final">
            <label className="crece">Color de acento
              <select value={c.color} onChange={e => set({ color: e.target.value })}>
                {COLORES.map(([v, n]) => <option key={v} value={v}>{n}</option>)}
              </select>
            </label>
            <button onClick={negrita} title="Negrita en la selección"><b>B</b></button>
          </div>
        </>
      )}
    </div>
  );
}
