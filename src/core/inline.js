// **negrita** → runs. Lo único que soporta el formato, a propósito:
// PPTX y Figma consumen runs de texto, no HTML, y la negrita es lo único
// que Sherpa pide para énfasis (tone.md).

/** @returns {{t:string,b:boolean}[]} */
export function runs(texto = '') {
  const out = [];
  for (const parte of String(texto).split(/(\*\*[^*]+\*\*)/g)) {
    if (!parte) continue;
    const b = parte.startsWith('**') && parte.endsWith('**');
    out.push({ t: b ? parte.slice(2, -2) : parte, b });
  }
  return out.length ? out : [{ t: '', b: false }];
}

export const plain = rs => rs.map(r => r.t).join('');
