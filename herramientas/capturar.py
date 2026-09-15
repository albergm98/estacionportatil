import http.server, socketserver, threading, functools
from playwright.sync_api import sync_playwright

PUERTO = 8095
socketserver.TCPServer.allow_reuse_address = True
srv = socketserver.TCPServer(("127.0.0.1", PUERTO), functools.partial(http.server.SimpleHTTPRequestHandler, directory="."))
threading.Thread(target=srv.serve_forever, daemon=True).start()

VISTAS = [
    ("movil-final", "/index.html", 390, 800),
    ("tarjetas", "/index.html#guias", 1440, 900),
    ("comparativa", "/comparativa.html", 1440, 900),
    ("guia-baterias", "/guias/mejores-baterias-lifepo4-100ah.html", 1440, 900),
    ("metodologia", "/metodologia.html", 1440, 900),
    ("creditos", "/creditos.html", 1440, 900),
]
with sync_playwright() as p:
    nav = p.chromium.launch()
    for nombre, ruta, ancho, alto in VISTAS:
        pag = nav.new_page(viewport={"width": ancho, "height": alto}, device_scale_factor=1)
        fallos = []
        pag.on("console", lambda m: fallos.append(m.text) if m.type == "error" else None)
        pag.on("requestfailed", lambda r: fallos.append("FALLO " + r.url))
        pag.goto(f"http://127.0.0.1:{PUERTO}{ruta}", wait_until="networkidle")
        pag.wait_for_timeout(800)
        pag.screenshot(path=f"herramientas/capturas/{nombre}.png")
        print(f"{nombre:16} {'OK' if not fallos else ' | '.join(fallos[:3])}")
        pag.close()
    nav.close()
srv.shutdown()
