import http.server, socketserver, threading, functools, statistics
from playwright.sync_api import sync_playwright
from PIL import Image

PUERTO = 8097
socketserver.TCPServer.allow_reuse_address = True
srv = socketserver.TCPServer(("127.0.0.1", PUERTO), functools.partial(http.server.SimpleHTTPRequestHandler, directory="."))
threading.Thread(target=srv.serve_forever, daemon=True).start()

def luminancia(rgb):
    def canal(v):
        v /= 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = (canal(c) for c in rgb[:3])
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def contraste(a, b):
    la, lb = luminancia(a), luminancia(b)
    claro, oscuro = max(la, lb), min(la, lb)
    return (claro + 0.05) / (oscuro + 0.05)

with sync_playwright() as p:
    nav = p.chromium.launch()
    pag = nav.new_page(viewport={"width": 1440, "height": 820})
    pag.goto(f"http://127.0.0.1:{PUERTO}/index.html", wait_until="networkidle")
    pag.wait_for_timeout(600)
    # Ocultamos el texto para medir SOLO el fondo que queda detras de el.
    caja = pag.locator(".portada p").first.bounding_box()
    pag.eval_on_selector(".portada p", "e => e.style.visibility = 'hidden'")
    pag.eval_on_selector(".confianza", "e => e.style.visibility = 'hidden'")
    pag.screenshot(path="herramientas/capturas/_fondo.png")
    pag.eval_on_selector(".portada p", "e => e.style.visibility = 'visible'")
    pag.eval_on_selector(".confianza", "e => e.style.visibility = 'visible'")
    pag.screenshot(path="herramientas/capturas/portada-final.png")
    nav.close()
srv.shutdown()

img = Image.open("herramientas/capturas/_fondo.png").convert("RGB")
x, y, w, h = (int(caja[k]) for k in ("x", "y", "width", "height"))
zona = img.crop((x, y, x + w, y + h))
pixeles = list(zona.getdata())
medio = tuple(round(statistics.mean(p[i] for p in pixeles)) for i in range(3))
peor = max(pixeles, key=luminancia)

print(f"Fondo detras del parrafo -> medio rgb{medio}  |  mas claro rgb{peor}")
for nombre, color in [("texto parrafo #d7dee7", (0xd7, 0xde, 0xe7))]:
    print(f"  {nombre}: contraste medio {contraste(color, medio):.2f}:1  | peor caso {contraste(color, peor):.2f}:1  (AA normal exige 4.5)")
