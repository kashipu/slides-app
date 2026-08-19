import { useRef, useState } from 'react';
import { COMPONENTES, TIPOS } from '../core/componentes.js';
import { esEspecial } from '../core/layouts.js';
import { CAMPOS_SLIDE, LAYOUTS_UI, aBloque, aCampos, componenteVacio, itemVacio } from './campos.js';
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

/** chip que muestra el icono de verdad; en un textarea solo se veía [cat/nombre] */
function ChipIcono({ valor, onElegir, onQuitar }) {
  if (!valor) return <button className="chip vacio" onClick={onElegir} title="Añadir icono">＋</button>;
  return (
    <span className="chip">
      <button onClick={onElegir} title={valor}><img src={`/assets/iconos/${valor}.svg`} alt="" /></button>
      <button className="quitar" onClick={onQuitar} title="Quitar icono">✕</button>
    </span>
  );
}

/** un campo cualquiera, del slide o de un componente */
function Campo({ f, valor, onValor, onFoco, onPicker, onSubir }) {
  if (f.tipo === 'linea') return (
    <label>{f.label}
      <input value={valor ?? ''} placeholder={f.label} onFocus={onFoco}
        onChange={e => onValor(e.target.value)} />
    </label>
  );

  if (f.tipo === 'parrafo') return (
    <label>{f.label}
      <textarea rows={3} value={valor ?? ''} placeholder={f.label} onFocus={onFoco}
        onChange={e => onValor(e.target.value)} />
    </label>
  );

  if (f.tipo === 'imagen') return (
    <label>{f.label}
      <div className="fila">
        <input value={valor ?? ''} placeholder="decks/img/…" onFocus={onFoco}
          onChange={e => onValor(e.target.value)} />
        <button onClick={() => onSubir(onValor)}>Subir…</button>
      </div>
    </label>
  );

  // lista
  const items = valor ?? [];
  const setItem = (i, cambios) => onValor(items.map((it, j) => (j === i ? { ...it, ...cambios } : it)));
  const mover = (i, d) => { const x = [...items]; x.splice(i + d, 0, x.splice(i, 1)[0]); onValor(x); };

  return (
    <div className="lista-campo">
      <span className="etiqueta-campo">
        {f.label}
        <small>{items.length}{f.min ? ` · ${f.min}–${f.max} recomendado` : ''}</small>
      </span>
      {items.map((it, i) => (
        <div key={i} className="item">
          {f.icono && (
            <ChipIcono valor={it.icono}
              onElegir={() => onPicker(ref => setItem(i, { icono: ref }))}
              onQuitar={() => setItem(i, { icono: '' })} />
          )}
          <div className="campos-item">
            <input value={it.texto} placeholder={f.pares ? f.pares[0] : 'Texto'} onFocus={onFoco}
              onChange={e => setItem(i, { texto: e.target.value })} />
            {f.pares && (
              <input value={it.extra} placeholder={f.pares[1]} onFocus={onFoco}
                onChange={e => setItem(i, { extra: e.target.value })} />
            )}
          </div>
          <span className="acciones">
            <button title="Subir" disabled={i === 0} onClick={() => mover(i, -1)}>↑</button>
            <button title="Bajar" disabled={i === items.length - 1} onClick={() => mover(i, 1)}>↓</button>
            <button title="Quitar" disabled={items.length <= 1}
              onClick={() => onValor(items.filter((_, j) => j !== i))}>✕</button>
          </span>
        </div>
      ))}
      <button className="anadir" disabled={f.max && items.length >= f.max}
        onClick={() => onValor([...items, itemVacio(f)])}>＋ Añadir</button>
    </div>
  );
}

export function SlideForm({ bloque, indice, total, onBloque, onPicker, onImagen, onMarkdown, verMarkdown }) {
  const c = aCampos(bloque);
  const propios = CAMPOS_SLIDE[c.layout] ?? [];
  const conComponentes = !esEspecial(c.layout);
  const foco = useRef(null);
  const [subiendo, setSubiendo] = useState(null);
  const [menu, setMenu] = useState(null);   // región con el menú de componentes abierto

  const set = cambios => onBloque(aBloque({ ...c, ...cambios }));

  const setRegion = (r, lista) =>
    set({ regiones: c.regiones.map((x, i) => (i === r ? lista : x)) });
  const setComp = (r, i, cambios) =>
    setRegion(r, c.regiones[r].map((x, j) => (j === i ? { ...x, ...cambios } : x)));

  const subir = onValor => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const f = input.files?.[0];
      if (!f) return;
      setSubiendo('Subiendo…');
      try { onValor(await onImagen(f)); setSubiendo(null); }
      catch (e) { setSubiendo(`No se pudo subir: ${e.message}`); setTimeout(() => setSubiendo(null), 5000); }
    };
    input.click();
  };

  const negrita = () => {
    const el = foco.current;
    if (!el || el.selectionStart === el.selectionEnd) return;
    const { md, sel } = envolver(el.value, el.selectionStart, el.selectionEnd);
    // Se dispara el onChange de React con el setter nativo para no duplicar cableado
    const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement : HTMLInputElement;
    Object.getOwnPropertyDescriptor(proto.prototype, 'value').set.call(el, md);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    requestAnimationFrame(() => el.setSelectionRange(sel[0], sel[1]));
  };

  const marcarFoco = e => { foco.current = e.target; };

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
              {LAYOUTS_UI.map(l => <option key={l.k} value={l.k}>{l.label}</option>)}
            </select>
          </label>

          {propios.map(f => (
            <Campo key={f.k} f={f} valor={c[f.k]} onFoco={marcarFoco}
              onValor={v => set({ [f.k]: v })} onPicker={onPicker} onSubir={subir} />
          ))}

          {conComponentes && c.regiones.map((region, r) => (
            <div key={r} className="region">
              {c.regiones.length > 1 && <span className="etiqueta-region">Columna {r + 1}</span>}

              {region.map((comp, i) => {
                const def = COMPONENTES[comp.tipo];
                if (!def) return null;
                const mover = d => {
                  const x = [...region];
                  x.splice(i + d, 0, x.splice(i, 1)[0]);
                  setRegion(r, x);
                };
                return (
                  <div key={i} className="componente">
                    <div className="comp-cab">
                      <span className="comp-tipo">{def.label}</span>
                      <span className="acciones">
                        <button title="Subir" disabled={i === 0} onClick={() => mover(-1)}>↑</button>
                        <button title="Bajar" disabled={i === region.length - 1} onClick={() => mover(1)}>↓</button>
                        <button title="Quitar" onClick={() => setRegion(r, region.filter((_, j) => j !== i))}>✕</button>
                      </span>
                    </div>
                    {def.campos.map(f => (
                      <Campo key={f.k} f={f} valor={comp[f.k]} onFoco={marcarFoco}
                        onValor={v => setComp(r, i, { [f.k]: v })} onPicker={onPicker} onSubir={subir} />
                    ))}
                  </div>
                );
              })}

              {menu === r ? (
                <div className="menu-comp">
                  {TIPOS.map(t => (
                    <button key={t} title={COMPONENTES[t].ayuda}
                      onClick={() => { setRegion(r, [...region, componenteVacio(t)]); setMenu(null); }}>
                      {COMPONENTES[t].label}
                    </button>
                  ))}
                  <button className="cancelar" onClick={() => setMenu(null)}>Cancelar</button>
                </div>
              ) : (
                <button className="anadir comp" onClick={() => setMenu(r)}>＋ Componente</button>
              )}
            </div>
          ))}

          {subiendo && <small className="estado">{subiendo}</small>}

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
