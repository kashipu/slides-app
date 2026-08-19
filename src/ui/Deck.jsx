// Cajas → JSX. El equivalente exacto del antiguo render-html.js: los renderers
// solo dibujan lo que compone layouts.js, no reinterpretan nada.
import { CANVAS, componer } from '../core/layouts.js';

const SVG = {
  'logo-white': '/base/assets/logo-white.svg',
  logo: '/base/assets/logo.svg',
  isotipo: '/base/assets/isotipo.svg',
};

const NEGRITA = { display: 600, body: 700 };

/** "finanzas/ahorro" → ruta del svg en sherpa-assets */
export const rutaIcono = src => `/assets/iconos/${src}.svg`;

const FUENTES_POR_DEFECTO = { display: 'Kiffo BDB', body: 'Roboto' };

function Caja({ b, fuentes }) {
  const base = { position: 'absolute', left: b.x, top: b.y, width: b.w };

  if (b.kind === 'rect') {
    const pintura = b.fill.startsWith('linear-gradient')
      ? { backgroundImage: b.fill } : { background: b.fill };
    return <div style={{ ...base, height: b.h, borderRadius: b.r ?? 0, ...pintura }} />;
  }

  // Los iconos de Sherpa traen fill="black" fijo. Se pintan con mask + background:
  // recolorea cualquier SVG sin fetch, sin async y sin tocar el archivo original.
  if (b.kind === 'icon') {
    const url = `url(${rutaIcono(b.src)})`;
    return <div data-icono={b.src} style={{
      ...base, height: b.h, background: b.fill,
      maskImage: url, WebkitMaskImage: url,
      maskSize: 'contain', WebkitMaskSize: 'contain',
      maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat',
      maskPosition: 'center', WebkitMaskPosition: 'center',
    }} />;
  }

  if (b.kind === 'svg') {
    return <img alt="" src={SVG[b.src] ?? b.src}
      style={{ ...base, height: b.h, objectFit: 'contain', objectPosition: 'left center' }} />;
  }

  if (b.kind === 'image') {
    return <img alt="" src={b.src} style={{ ...base, height: b.h, objectFit: b.fit ?? 'cover' }} />;
  }

  return (
    <div style={{
      ...base,
      fontFamily: `"${fuentes[b.font]}", "Roboto", sans-serif`,
      fontSize: b.size,
      fontWeight: b.weight,
      lineHeight: b.lh,
      color: b.color,
      textAlign: b.align,
      letterSpacing: b.tracking ? b.tracking : 'normal',
      whiteSpace: 'pre-wrap',
      margin: 0,
    }}>
      {b.runs.map((r, i) =>
        <span key={i} style={r.b ? { fontWeight: NEGRITA[b.font] } : undefined}>{r.t}</span>)}
    </div>
  );
}

export function Slide({ slide, ir, actual }) {
  const { bg, boxes } = componer(slide, { meta: ir.meta, n: slide.n, total: ir.slides.length });
  const fuentes = ir.fuentes ?? FUENTES_POR_DEFECTO;
  return (
    <section className={`slide${actual ? ' actual' : ''}`} data-n={slide.n} style={{
      position: 'relative', width: CANVAS.w, height: CANVAS.h,
      overflow: 'hidden', background: bg, flex: '0 0 auto',
    }}>
      {boxes.map((b, i) => <Caja key={i} b={b} fuentes={fuentes} />)}
    </section>
  );
}

export function Deck({ ir, actual, zoom }) {
  return (
    <div id="deck" style={zoom ? { zoom } : undefined}>
      {ir.slides.map((s, i) => <Slide key={s.n} slide={s} ir={ir} actual={i === actual} />)}
    </div>
  );
}
