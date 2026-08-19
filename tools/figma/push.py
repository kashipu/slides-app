#!/usr/bin/env python3
"""deck.md -> una página de Figma con un frame por diapositiva.

  python3 tools/figma/push.py decks/plantilla.md ["Nombre de la página"]
  python3 tools/figma/push.py decks/plantilla.md --review

Etapas: tree.mjs (deck -> árbol JSON) | render-slides.js (árbol -> frames)
        shot.mjs + review.py (--review, diff visual navegador vs Figma)

Cada presentación va a su propia página. Volver a correr el mismo nombre
**reemplaza** el contenido de esa página, no lo duplica.

  --review    compara cada diapositiva contra el navegador y nombra las capas
              que se desviaron. Necesita `npm start` corriendo y pillow+numpy.
  --slide n   revisa solo esa diapositiva (0-based)
  --umbral    fracción de una capa que cuenta como defecto (default 0.25)
  --png ruta  guarda la captura de Figma de la primera diapositiva

Requiere el MCP de Figma autenticado: /mcp -> figma -> Authenticate.
El servidor local de Figma desktop no sirve, es de solo lectura.
"""
import argparse
import base64
import json
import os
import subprocess
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(os.path.dirname(AQUI))
sys.path.insert(0, AQUI)
from mcp import use_figma  # noqa: E402

CFG = json.load(open(os.path.join(AQUI, "config.json")))
CFG["fileKey"] = os.environ.get("FIGMA_FILE_KEY", CFG["fileKey"])

CHUNK = 38000  # margen bajo el límite de 50k de use_figma, ya escapado
NS = "bdb.slides"
CACHE = os.path.join(AQUI, ".cache")

compacto = lambda o: json.dumps(o, separators=(",", ":"), ensure_ascii=False)
trozos = lambda s, n: [s[i:i + n] for i in range(0, len(s), n)] or [""]


def nombre_caja(b):
    """El mismo nombre que le pone render-slides.js, para que el diff lo reconozca."""
    if b["kind"] == "text":
        return "".join(r["t"] for r in b["runs"])[:40] or "Texto"
    if b["kind"] == "rect":
        return "Forma"
    return b.get("src", "Capa")


def arbol_revision(slide):
    """El árbol que espera review.py: rectángulos absolutos con nombre."""
    return {
        "name": slide["nombre"], "ax": 0, "ay": 0, "w": 1920, "h": 1080,
        "children": [
            {"name": nombre_caja(b), "ax": b["x"], "ay": b["y"],
             "w": b["w"], "h": b["h"], "children": []}
            for b in slide["boxes"]
        ],
    }


def captura_figma(pagina, i):
    """PNG del frame i, vía use_figma. `screenshot` sí devuelve la imagen; exportAsync no."""
    code = f'''
const p = figma.root.children.find(x => x.name === {compacto(pagina)});
await figma.setCurrentPageAsync(p);
const f = p.children[{i}];
await f.screenshot({{ scale: 1 }});
return {{ frame: f.name }};
'''
    _, imgs = use_figma(CFG["fileKey"], code, f"Capturar frame {i}")
    return base64.b64decode(imgs[0]) if imgs else None


def revisar(a, datos):
    import review as rv
    from shutil import which  # noqa: F401  (solo para fallar claro si falta node)

    os.makedirs(CACHE, exist_ok=True)
    base = os.path.splitext(os.path.basename(a.deck))[0]
    indices = [a.slide] if a.slide is not None else range(len(datos["slides"]))
    veredictos = []

    for i in indices:
        slide = datos["slides"][i]
        nav = os.path.join(CACHE, f"{base}-{i}.nav.png")
        fig = os.path.join(CACHE, f"{base}-{i}.figma.png")
        diff = os.path.join(CACHE, f"{base}-{i}.diff.png")

        subprocess.run(["node", os.path.join(AQUI, "shot.mjs"), a.deck, str(i), nav, a.url],
                       cwd=RAIZ, check=True)
        png = captura_figma(datos["pagina"], i)
        if not png:
            veredictos.append({"slide": i, "veredicto": "SIN CAPTURA"})
            continue
        with open(fig, "wb") as f:
            f.write(png)

        r = rv.compare(nav, fig, arbol_revision(slide), (1920, 1080),
                       out_png=diff, umbral=a.umbral)
        ok = not r["zonas"]
        veredictos.append({
            "slide": i, "nombre": slide["nombre"],
            "veredicto": "OK" if ok else "REVISAR",
            "similitud": r["similitud"], "zonas": r["zonas"],
            "ruido": r["ruido"], "diff": None if ok else diff,
        })
        print(compacto(veredictos[-1]))

    malos = [v for v in veredictos if v["veredicto"] != "OK"]
    print(compacto({"revisadas": len(veredictos), "a_revisar": len(malos)}), file=sys.stderr)
    return 1 if malos else 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("deck", help="ruta del .md")
    ap.add_argument("nombre", nargs="?", default=None, help="nombre de la página en Figma")
    ap.add_argument("--png", default=None, help="captura de Figma de la primera diapositiva")
    ap.add_argument("--review", action="store_true", help="diff visual navegador vs Figma")
    ap.add_argument("--slide", type=int, default=None, help="revisar solo esta diapositiva")
    ap.add_argument("--umbral", type=float, default=0.25)
    ap.add_argument("--url", default="http://localhost:5173", help="dev server para el render de referencia")
    a = ap.parse_args()

    cmd = ["node", os.path.join(AQUI, "tree.mjs"), a.deck] + ([a.nombre] if a.nombre else [])
    r = subprocess.run(cmd, cwd=RAIZ, capture_output=True, text=True, check=True)
    if r.stderr.strip():
        print(r.stderr.strip(), file=sys.stderr)
    arbol = r.stdout
    datos = json.loads(arbol)

    partes = trozos(arbol, CHUNK)
    for i, parte in enumerate(partes):
        use_figma(
            CFG["fileKey"],
            f'figma.root.setSharedPluginData("{NS}","arbol{i}",{compacto(parte)});return {{ok:{i}}};',
            f"Transferir árbol {i + 1}/{len(partes)}",
        )
    print(f"→ árbol enviado en {len(partes)} trozo(s), {len(arbol)} bytes", file=sys.stderr)

    code = open(os.path.join(AQUI, "render-slides.js")).read().replace("__CHUNKS__", str(len(partes)))
    if a.png:
        # `screenshot` es lo que devuelve la imagen a través del MCP; exportAsync no.
        code = code.replace("/*__SCREENSHOT__*/", "await screen.screenshot({ scale: 1 });")

    salida, imagenes = use_figma(CFG["fileKey"], code, f"Renderizar {a.deck} en Figma")
    print(salida)

    if a.png and imagenes:
        with open(a.png, "wb") as f:
            f.write(base64.b64decode(imagenes[0]))
        print(f"→ {a.png}", file=sys.stderr)

    print(f"→ {CFG['archivo']}", file=sys.stderr)

    if a.review:
        sys.exit(revisar(a, datos))


if __name__ == "__main__":
    main()
