#!/usr/bin/env python3
"""Cliente mínimo del servidor MCP remoto de Figma (https://mcp.figma.com/mcp)."""
import json
import os
import platform
import subprocess
import urllib.request

ENDPOINT = "https://mcp.figma.com/mcp"
CREDENCIALES = os.path.expanduser("~/.claude/.credentials.json")

AYUDA = """No se encontró el token de Figma. Tres opciones, en orden de preferencia:

  1. Autenticar en Claude Code:  /mcp  ->  figma  ->  Authenticate
  2. Exportar el token a mano:   export FIGMA_MCP_TOKEN=figu_...
  3. Revisar que exista ~/.claude/.credentials.json con la entrada `figma|...`

El servidor local de Figma desktop no sirve: es de solo lectura."""


def _del_llavero():
    """macOS: Claude Code guarda las credenciales en el llavero."""
    if platform.system() != "Darwin":
        return None
    try:
        raw = subprocess.run(
            ["security", "find-generic-password", "-s", "Claude Code-credentials", "-w"],
            capture_output=True, text=True, check=True,
        ).stdout
    except (subprocess.CalledProcessError, FileNotFoundError):
        return None
    return _buscar_figma(raw)


def _del_archivo():
    """Linux y Windows: Claude Code las guarda en un archivo."""
    if not os.path.exists(CREDENCIALES):
        return None
    with open(CREDENCIALES) as f:
        return _buscar_figma(f.read())


def _buscar_figma(raw):
    try:
        datos = json.loads(raw).get("mcpOAuth", {})
    except json.JSONDecodeError:
        return None
    for clave, valor in datos.items():
        if clave.startswith("figma|"):
            return valor.get("accessToken")
    return None


def token():
    """Token OAuth de Figma: variable de entorno, llavero o archivo."""
    for origen in (lambda: os.environ.get("FIGMA_MCP_TOKEN"), _del_llavero, _del_archivo):
        encontrado = origen()
        if encontrado:
            return encontrado
    raise SystemExit(AYUDA)


def call(tool, arguments):
    """Invoca una tool del MCP. Devuelve (textos, imagenes_base64)."""
    body = json.dumps({
        "jsonrpc": "2.0", "id": 1, "method": "tools/call",
        "params": {"name": tool, "arguments": arguments},
    }).encode()
    req = urllib.request.Request(ENDPOINT, data=body, headers={
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
        "Authorization": "Bearer " + token(),
    })
    try:
        raw = urllib.request.urlopen(req).read().decode()
    except urllib.error.HTTPError as e:
        if e.code == 401:
            raise SystemExit("El token de Figma no sirve o expiró.\n\n" + AYUDA)
        raise
    # El servidor responde SSE aunque sea stateless.
    for line in raw.splitlines():
        if line.startswith("data: "):
            raw = line[6:]
    res = json.loads(raw)
    if res.get("error"):
        raise SystemExit("MCP ERROR: " + json.dumps(res["error"])[:2000])
    content = res["result"]["content"]
    texts = [c["text"] for c in content if c.get("type") == "text"]
    images = [c["data"] for c in content if c.get("type") == "image"]
    if res["result"].get("isError"):
        raise SystemExit("TOOL ERROR: " + "\n".join(texts)[:3000])
    return texts, images


def use_figma(file_key, code, description):
    texts, images = call("use_figma", {
        "fileKey": file_key, "code": code,
        "description": description, "skillNames": "figma-use",
    })
    return texts[0] if texts else "", images
