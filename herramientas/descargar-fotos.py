"""
Voltio Nómada · descarga de fotografías desde Wikimedia Commons.

Commons permite pedir cualquier resolución hasta el original, así que aquí se
bajan a 2600 px de ancho: suficiente para servir una portada nítida en pantallas
retina. StockSnap y Rawpixel se descartaron porque topan en 960-1024 px.

Guarda también autor, licencia y URL de origen en creditos-fotos.json, que es lo
que alimenta creditos.html. Las licencias CC BY y CC BY-SA obligan a atribuir.

Uso:  python herramientas/descargar-fotos.py
"""

import html
import json
import re
import time
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import quote
from urllib.request import urlopen, Request

API = "https://commons.wikimedia.org/w/api.php"
ANCHO = 2600
AGENTE = {"User-Agent": "VoltioNomada/1.0 (proyecto educativo; contacto pendiente)"}

# nombre local -> frase de búsqueda exacta en Commons
FOTOS = {
    "cielo-vialactea": "Milky Way rises over Cascade-Siskiyou National Monument",
    "tiendas-vialactea": "Lighted tents with the milky way close to the Barrhorn",
    "autocaravana-estrellas": "Tired of camping in an RV parking lot Starlight",
    "acampada-deosai": "Camping at Deosai",
    "camper-interior-lectura": "Woman enjoying a quiet afternoon reading a book in a cozy",
    "camper-interior-vw": "Bespoke Volkswagen campervan interior built by The Wee Camper",
    "estacion-allpowers": "Allpowers S300 portable solar generator P1110388",
    "estacion-goalzero": "Goal Zero Yeti 1400 Lithium Portable Power Station",
    "celdas-lifepo4": "Lithium Iron Phosphate LiFePO4 Cells 400 Ah Amp Hours",
    "instalador-tejado": "Solar installation technician on rooftop",
    "paneles-hilera": "Powering the Future",
    "planta-solar": "Topaz Solar Farm maintenance of a huge solar farm",
    "camper-carretera": "Campervan at the side of the road in the countryside",
}

destino = Path("assets/img/foto/original")
destino.mkdir(parents=True, exist_ok=True)


def pedir(url: str, intentos: int = 4) -> bytes:
    """Commons limita las peticiones seguidas: reintenta con espera creciente."""
    for intento in range(intentos):
        try:
            return urlopen(Request(url, headers=AGENTE), timeout=120).read()
        except HTTPError as error:
            if error.code != 429 or intento == intentos - 1:
                raise
            time.sleep(5 * (intento + 1))
    raise RuntimeError("inalcanzable")


def limpiar(marcado: str | None) -> str:
    """Commons devuelve el autor como HTML; aquí se queda en texto plano."""
    if not marcado:
        return ""
    return html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", marcado))).strip()


def buscar(frase: str) -> dict | None:
    consulta = (
        f"{API}?action=query&format=json&generator=search&gsrnamespace=6"
        f"&gsrsearch=filetype:bitmap%20{quote(frase)}&gsrlimit=1"
        f"&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth={ANCHO}"
    )
    datos = json.loads(pedir(consulta))
    paginas = datos.get("query", {}).get("pages")
    if not paginas:
        return None
    pagina = next(iter(paginas.values()))
    info = pagina["imageinfo"][0]
    meta = info.get("extmetadata", {})
    return {
        "titulo": pagina["title"].removeprefix("File:"),
        "autor": limpiar(meta.get("Artist", {}).get("value")),
        "licencia": meta.get("LicenseShortName", {}).get("value", "desconocida"),
        "origen": info["descriptionurl"],
        "ancho_original": info["width"],
        "alto_original": info["height"],
        "descarga": info.get("thumburl") or info["url"],
    }


if __name__ == "__main__":
    creditos = {}
    for nombre, frase in FOTOS.items():
        ficha = buscar(frase)
        if not ficha:
            print(f"{nombre:26} SIN RESULTADO")
            continue
        ruta = destino / f"{nombre}.jpg"
        if not ruta.exists():
            ruta.write_bytes(pedir(ficha["descarga"]))
            time.sleep(2)  # cortesía con la API de Commons
        ficha["fichero"] = ruta.name
        creditos[nombre] = ficha
        print(
            f"{nombre:26} {ruta.stat().st_size // 1024:5} KB  "
            f"{ficha['ancho_original']}x{ficha['alto_original']} orig  "
            f"{ficha['licencia']:15} {ficha['autor'][:30]}"
        )

    Path("herramientas/creditos-fotos.json").write_text(
        json.dumps(creditos, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    print(f"\n{len(creditos)} fichas guardadas en herramientas/creditos-fotos.json")
