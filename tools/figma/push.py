#!/usr/bin/env python3
"""deck.md -> una página de Figma con un frame por slide.

  python3 tools/figma/push.py decks/plantilla.md ["Nombre de la página"] [--png ruta]

Etapas: tree.mjs (deck -> árbol JSON) | render-slides.js (árbol -> frames)

Cada presentación va a su propia página. Volver a correr el mismo nombre
**reemplaza** el contenido de esa página, no lo duplica.

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

compacto = lambda o: json.dumps(o, separators=(",", ":"), ensure_ascii=False)
trozos = lambda s, n: [s[i:i + n] for i in range(0, len(s), n)] or [""]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("deck", help="ruta del .md")
    ap.add_argument("nombre", nargs="?", default=None, help="nombre de la página en Figma")
    ap.add_argument("--png", default=None, help="guarda una captura del primer slide")
    a = ap.parse_args()

    cmd = ["node", os.path.join(AQUI, "tree.mjs"), a.deck] + ([a.nombre] if a.nombre else [])
    r = subprocess.run(cmd, cwd=RAIZ, capture_output=True, text=True, check=True)
    if r.stderr.strip():
        print(r.stderr.strip(), file=sys.stderr)
    arbol = r.stdout

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
        code = code.replace("/*__SCREENSHOT__*/", "await screen.exportAsync({ format: 'PNG' });")

    salida, imagenes = use_figma(CFG["fileKey"], code, f"Renderizar {a.deck} en Figma")
    print(salida)

    if a.png and imagenes:
        with open(a.png, "wb") as f:
            f.write(base64.b64decode(imagenes[0]))
        print(f"→ {a.png}", file=sys.stderr)

    print(f"→ {CFG['archivo']}", file=sys.stderr)


if __name__ == "__main__":
    main()
