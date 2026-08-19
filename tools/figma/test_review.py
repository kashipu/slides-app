#!/usr/bin/env python3
"""Comprueba que el desenfoque de review.py no lo dejó ciego a defectos reales.

  python3 tools/figma/test_review.py

Usa las capturas que dejó la última corrida en .cache/. Inyecta defectos conocidos
sobre la captura de Figma y exige que el veredicto los detecte.
"""
import glob
import json
import os
import sys

from PIL import Image, ImageChops

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import review as rv  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, ".cache")


def caso(nombre, transform, dom, figma, tree, size, n_base):
    """Aplica `transform` a la captura de Figma y exige que el diff lo destaque."""
    tmp = os.path.join(CACHE, f"_test_{nombre}.png")
    transform(Image.open(figma).convert("RGB").resize(size)).save(tmp)
    r = rv.compare(dom, tmp, tree, size)
    os.remove(tmp)
    ok = len(r["zonas"]) > n_base
    print(f"  {'OK   ' if ok else 'FALLA'} {nombre:22} zonas={len(r['zonas'])} "
          f"(base {n_base}) similitud={r['similitud']:6.2f}")
    assert ok, f"{nombre}: {len(r['zonas'])} zonas, igual que la base; no lo detectó"
    return r


def main():
    jsons = [p for p in glob.glob(os.path.join(CACHE, "*.json")) if ".figma" not in p]
    if not jsons:
        raise SystemExit("Sin capturas en .cache/. Corre antes: npm run figma -- <story> <nombre> --review")

    fallos = 0
    for meta_path in jsons:
        story = os.path.basename(meta_path)[:-5]
        dom = meta_path.replace(".json", ".png")
        figma = os.path.join(CACHE, f"{story}.figma.png")
        if not (os.path.exists(dom) and os.path.exists(figma)):
            continue

        meta = json.load(open(meta_path))
        size = (meta["width"], meta["height"])
        tree = meta["root"]
        print(f"\n{story}")

        # Referencia: sin tocar nada debe dar por encima del umbral.
        # La línea base no tiene por qué ser cero: puede haber desviaciones reales
        # ya conocidas. Lo que se exige es que un defecto inyectado destaque por
        # encima de ella, que es para lo que sirve el detector.
        base = rv.compare(dom, figma, tree, size)
        n_base = len(base["zonas"])
        print(f"  base  zonas={n_base} similitud={base['similitud']:6.2f}"
              + (f"  ({', '.join(z['capa'] for z in base['zonas'])})" if n_base else ""))

        try:
            # Un corrimiento de 10px es un error de layout que hay que ver.
            caso("corrimiento 10px", lambda im: ImageChops.offset(im, 10, 0),
                 dom, figma, tree, size, n_base)
            # Un tinte de color equivocado también.
            caso("tinte de color", lambda im: Image.blend(im, Image.new("RGB", im.size, (255, 90, 0)), 0.25),
                 dom, figma, tree, size, n_base)
            # Una franja en blanco simula una capa que no se renderizó.
            def borrar(im):
                im = im.copy()
                im.paste((255, 255, 255), (0, 380, im.width, 470))
                return im
            caso("capa faltante", borrar, dom, figma, tree, size, n_base)
        except AssertionError as e:
            print(f"  {e}")
            fallos += 1

    print("\n" + ("FALLÓ" if fallos else "Todo OK: el diff sigue detectando defectos reales"))
    return 1 if fallos else 0


if __name__ == "__main__":
    sys.exit(main())
