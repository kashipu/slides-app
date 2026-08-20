// **negrita** → runs. Lo único que soporta el formato, a propósito:
// PPTX y Figma consumen runs de texto, no HTML, y la negrita es lo único
// que Sherpa pide para énfasis (tone.md).

/** @returns {{t:string,b:boolean,r?:boolean}[]} */
export function runs(texto = '') {
  const out = [];
  // `==resaltado==` pinta la barra amarilla de marca detrás del texto; se parte
  // en la misma pasada que la negrita para que puedan convivir en una frase.
  for (const parte of String(texto).split(/(\*\*[^*]+\*\*|==[^=]+==)/g)) {
    if (!parte) continue;
    const b = parte.startsWith('**') && parte.endsWith('**');
    const r = parte.startsWith('==') && parte.endsWith('==');
    out.push({ t: b || r ? parte.slice(2, -2) : parte, b, ...(r && { r }) });
  }
  return out.length ? out : [{ t: '', b: false }];
}

export const plain = rs => rs.map(r => r.t).join('');

/** inverso de runs(): vuelve a Markdown con **negrita** y ==resaltado== */
export const aTexto = rs => (rs ?? []).map(r => {
  if (!r.t) return r.t;
  if (r.r) return `==${r.t}==`;
  return r.b ? `**${r.t}**` : r.t;
}).join('');
