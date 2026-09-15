import json, pathlib
from PIL import Image, ImageDraw

fichas = json.loads(pathlib.Path("herramientas/creditos-fotos.json").read_text(encoding="utf-8"))
CELDA_A, CELDA_H, COLS, BANDA = 460, 300, 4, 24
nombres = list(fichas)
filas = -(-len(nombres) // COLS)
hoja = Image.new("RGB", (CELDA_A * COLS, (CELDA_H + BANDA) * filas), (17, 20, 27))
lapiz = ImageDraw.Draw(hoja)

for i, nombre in enumerate(nombres):
    x, y = (i % COLS) * CELDA_A, (i // COLS) * (CELDA_H + BANDA)
    with Image.open(pathlib.Path("assets/img/foto/original") / fichas[nombre]["fichero"]) as im:
        im = im.convert("RGB")
        escala = max(CELDA_A / im.width, CELDA_H / im.height)
        im = im.resize((round(im.width * escala), round(im.height * escala)), Image.LANCZOS)
        izq, arr = (im.width - CELDA_A) // 2, (im.height - CELDA_H) // 2
        hoja.paste(im.crop((izq, arr, izq + CELDA_A, arr + CELDA_H)), (x, y + BANDA))
    lapiz.text((x + 6, y + 6), f"{i+1}. {nombre}  [{fichas[nombre]['licencia']}]", fill=(200, 230, 210))

hoja.save("herramientas/capturas/hoja-contactos.png")
print("hoja de contactos:", hoja.size, "|", len(nombres), "fotos")
