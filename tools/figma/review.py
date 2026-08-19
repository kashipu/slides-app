#!/usr/bin/env python3
"""Compara la captura del navegador contra la del frame de Figma.

La gracia: no devuelve una imagen para que alguien la mire, devuelve **los nombres
de las capas que se desviaron**. Solo vale la pena abrir el PNG cuando el veredicto
dice que algo se rompió.
"""
import numpy as np
from PIL import Image, ImageFilter

# Desenfoque previo: mata el ruido de antialiasing (el Roboto de Figma y el del
# navegador nunca rasterizan igual) sin ocultar desplazamientos ni colores malos.
BLUR = 2.6
# Un píxel cuenta como distinto si difiere más que esto en cualquier canal (0-255).
TOL = 28
# Los bordes se comparan aparte: una tarjeta blanca que desaparece sobre un fondo
# casi blanco casi no mueve el color, pero sí borra sus contornos.
TOL_BORDE = 60
# Una celda de la rejilla se marca si este % de sus píxeles difiere.
CELL_RATIO = 0.18
GRID = 24


def _abrir(path, size):
    img = Image.open(path).convert("RGB")
    return img.resize(size, Image.LANCZOS) if img.size != size else img


def load(path, size):
    """Devuelve (color desenfocado, mapa de bordes) para comparar ambos."""
    img = _abrir(path, size)
    color = np.asarray(img.filter(ImageFilter.GaussianBlur(BLUR))).astype(np.int16)
    bordes = np.asarray(
        img.convert("L").filter(ImageFilter.FIND_EDGES).filter(ImageFilter.GaussianBlur(BLUR))
    ).astype(np.int16)
    return color, bordes


def deepest_node(tree, cx, cy):
    """Capa más profunda cuyo rectángulo contiene el punto."""
    best = None

    def walk(n):
        nonlocal best
        ax, ay = n.get("ax"), n.get("ay")
        if ax is None or ay is None:
            return
        if ax <= cx <= ax + n.get("w", 0) and ay <= cy <= ay + n.get("h", 0):
            if n.get("name"):
                best = n
            for c in n.get("children", []):
                walk(c)

    walk(tree)
    return best


def compare(dom_png, figma_png, tree, size, out_png=None, umbral=0.25):
    """El veredicto sale de **qué fracción de cada capa** se desvió.

    Contar celdas sueltas no sirve: el ruido de rasterizado de una capa con mucho
    texto suma tantas celdas como un defecto ancho y delgado. En cambio el ruido
    ocupa una parte pequeña del área de su capa, y una capa rota ocupa casi toda.
    """
    ac, ab = load(dom_png, size)
    bc, bb = load(figma_png, size)
    d_color = np.abs(ac - bc).max(axis=2)
    d_borde = np.abs(ab - bb)
    delta = np.maximum(d_color, d_borde)
    mask = (d_color > TOL) | (d_borde > TOL_BORDE)
    similitud = 100.0 * (1.0 - mask.mean())

    W, H = size
    cw, ch = max(1, W // GRID), max(1, H // GRID)
    area_celda = cw * ch
    zonas = {}
    for gy in range(0, H, ch):
        for gx in range(0, W, cw):
            cell = mask[gy:gy + ch, gx:gx + cw]
            if not cell.size or cell.mean() <= CELL_RATIO:
                continue
            capa = deepest_node(tree, gx + cw // 2, gy + ch // 2)
            if capa is None:
                continue
            z = zonas.setdefault(capa["name"], {
                "celdas": 0, "peor": 0, "y": gy,
                "area": max(1, capa.get("w", 1) * capa.get("h", 1)),
            })
            z["celdas"] += 1
            z["peor"] = max(z["peor"], int(delta[gy:gy + ch, gx:gx + cw].max()))
            z["y"] = min(z["y"], gy)

    if out_png:
        vis = np.asarray(_abrir(figma_png, size)).copy()
        vis[mask] = [255, 0, 128]  # magenta donde difiere
        combo = Image.new("RGB", (W * 3 + 16, H), "white")
        combo.paste(_abrir(dom_png, size), (0, 0))
        combo.paste(_abrir(figma_png, size), (W + 8, 0))
        combo.paste(Image.fromarray(vis), (W * 2 + 16, 0))
        combo.save(out_png)

    graves = []
    for nombre, z in zonas.items():
        cubre = min(1.0, z["celdas"] * area_celda / z["area"])
        if cubre >= umbral and z["celdas"] >= 3:
            graves.append({
                "capa": nombre, "cubre": round(cubre, 2),
                "celdas": z["celdas"], "delta": z["peor"], "y": z["y"],
            })
    graves.sort(key=lambda g: -g["cubre"])

    return {
        "similitud": round(similitud, 2),
        "zonas": graves[:10],
        "ruido": len(zonas) - len(graves),
    }
