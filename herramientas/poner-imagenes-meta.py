"""
Voltio Nómada · declara la imagen de cada guía en Open Graph y en JSON-LD.

Google recomienda la propiedad `image` en el esquema Article, y sin `og:image`
un enlace compartido sale sin previsualización. Se ejecuta una sola vez tras
asignar las fotos; es idempotente, así que repetirlo no duplica nada.

Uso:  python herramientas/poner-imagenes-meta.py
"""

import re
from pathlib import Path

RAIZ = "https://estacionportatil.com"

# fichero de la guía -> nombre de la foto asignada
GUIAS = {
    "guias/ecoflow-delta-2-vs-bluetti-ac180.html": "estacion-goalzero",
    "guias/cuantos-paneles-solares-necesito.html": "planta-solar",
    "guias/mejores-baterias-lifepo4-100ah.html": "celdas-lifepo4",
    "guias/instalacion-segura-kit-solar-12v.html": "instalador-tejado",
}


def anadir_og(texto: str, foto: str) -> str:
    if "og:image" in texto:
        return texto
    etiquetas = (
        f'<meta property="og:image" content="{RAIZ}/assets/img/og/{foto}.jpg">\n'
        f'<meta property="og:image:width" content="1200">\n'
        f'<meta property="og:image:height" content="630">\n'
        f'<meta name="twitter:card" content="summary_large_image">'
    )
    return re.sub(r'(<meta property="og:title"[^>]*>)', rf"\1\n{etiquetas}", texto, count=1)


def anadir_jsonld(texto: str, foto: str) -> str:
    if '"image"' in texto:
        return texto
    imagen = f'      "image": "{RAIZ}/assets/img/foto/{foto}-1200.webp",'
    return re.sub(r'(\n\s*"description": "[^"]*",)', rf"\1\n{imagen}", texto, count=1)


if __name__ == "__main__":
    for ruta, foto in GUIAS.items():
        fichero = Path(ruta)
        original = fichero.read_text(encoding="utf-8")
        texto = anadir_jsonld(anadir_og(original, foto), foto)
        estado = "sin cambios"
        if texto != original:
            fichero.write_text(texto, encoding="utf-8")
            estado = "og:image + JSON-LD image"
        print(f"{fichero.name:46} {estado}")
