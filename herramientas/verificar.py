import json, pathlib, re, http.server, socketserver, threading, functools
from playwright.sync_api import sync_playwright

raiz = pathlib.Path(".")

# --- 1. JSON-LD valido -------------------------------------------------------
print("== JSON-LD ==")
for f in sorted(raiz.rglob("*.html")):
    for i, bloque in enumerate(re.findall(r'<script type="application/ld\+json">(.*?)</script>', f.read_text(encoding="utf-8"), re.S)):
        try:
            json.loads(bloque)
        except Exception as e:
            print(f"  ERROR {f} bloque {i}: {e}")
print("  revisados todos los ficheros")

# --- 2. Enlaces internos y recursos -----------------------------------------
print("== enlaces y recursos internos ==")
roto = 0
for f in sorted(raiz.rglob("*.html")):
    texto = f.read_text(encoding="utf-8")
    refs = re.findall(r'(?:href|src)="([^"#:]+?)(?:#[^"]*)?"', texto)
    # srcset e imagesrcset: lista de "ruta 800w, ruta 1200w, ..."
    for conjunto in re.findall(r'(?:image)?srcset="([^"]+)"', texto):
        refs += [c.strip().split()[0] for c in conjunto.split(",") if c.strip()]
    for ref in set(refs):
        if ref.startswith(("http", "mailto", "//", "data:")) or not ref.strip():
            continue
        destino = (f.parent / ref).resolve()
        if not destino.exists():
            print(f"  ROTO  {f}  ->  {ref}")
            roto += 1
print(f"  enlaces rotos: {roto}")

# --- 3. Iconos referenciados que existen en el sprite -----------------------
sprite = (raiz / "assets/img/iconos.svg").read_text(encoding="utf-8")
disponibles = set(re.findall(r'id="(i-[a-z0-9-]+)"', sprite))
usados = set()
for f in raiz.rglob("*.html"):
    usados |= set(re.findall(r'iconos\.svg#(i-[a-z0-9-]+)', f.read_text(encoding="utf-8")))
for f in raiz.rglob("assets/js/*.js"):
    usados |= {"i-" + n for n in re.findall(r"icono: '([a-z-]+)'", f.read_text(encoding="utf-8"))}
print("== iconos ==")
print(f"  usados {len(usados)}, en sprite {len(disponibles)}, inexistentes: {sorted(usados - disponibles) or 'ninguno'}")

# --- 4. Captura de la portada -----------------------------------------------
PUERTO = 8098
socketserver.TCPServer.allow_reuse_address = True
srv = socketserver.TCPServer(("127.0.0.1", PUERTO), functools.partial(http.server.SimpleHTTPRequestHandler, directory="."))
threading.Thread(target=srv.serve_forever, daemon=True).start()
with sync_playwright() as p:
    nav = p.chromium.launch()
    pag = nav.new_page(viewport={"width": 1440, "height": 800})
    pag.goto(f"http://127.0.0.1:{PUERTO}/index.html", wait_until="networkidle")
    pag.wait_for_timeout(600)
    pag.screenshot(path="herramientas/capturas/portada-final.png")
    nav.close()
srv.shutdown()
print("== captura guardada ==")
