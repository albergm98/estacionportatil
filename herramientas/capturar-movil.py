import http.server, socketserver, threading, functools
from playwright.sync_api import sync_playwright
PUERTO = 8096
socketserver.TCPServer.allow_reuse_address = True
srv = socketserver.TCPServer(("127.0.0.1", PUERTO), functools.partial(http.server.SimpleHTTPRequestHandler, directory="."))
threading.Thread(target=srv.serve_forever, daemon=True).start()
with sync_playwright() as p:
    nav = p.chromium.launch()
    for nombre, ancho, alto, completa in [("movil-final", 390, 780, False), ("portada-completa", 1440, 900, True)]:
        pag = nav.new_page(viewport={"width": ancho, "height": alto})
        pag.goto(f"http://127.0.0.1:{PUERTO}/index.html", wait_until="networkidle")
        pag.wait_for_timeout(800)
        pag.screenshot(path=f"herramientas/capturas/{nombre}.png", full_page=completa)
        pag.close()
    nav.close()
srv.shutdown()
print("capturas listas")
