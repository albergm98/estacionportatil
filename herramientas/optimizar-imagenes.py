"""
Voltio Nómada · genera las variantes WebP responsivas de cada fotografía.

Parte de los originales de alta resolución que deja `descargar-fotos.py` en
assets/img/foto/original/ y produce una escalera de anchos para servirlos con
srcset. Así una pantalla retina recibe el doble de píxeles y se ve nítida, y un
móvil no descarga una imagen de 2.400 px que no necesita.

Nunca amplía: si el original mide menos que el ancho pedido, se salta esa
variante.

Uso:  python herramientas/optimizar-imagenes.py
"""

from pathlib import Path

from PIL import Image

ANCHOS = [480, 800, 1200, 1600, 2400]
CALIDAD = {480: 80, 800: 80, 1200: 78, 1600: 76, 2400: 74}

origen = Path("assets/img/foto/original")
destino = Path("assets/img/foto")
destino.mkdir(parents=True, exist_ok=True)

# Imágenes para compartir en redes: recorte 1200x630 y JPEG a propósito, porque
# algunos rastreadores de enlaces todavía no leen WebP y se quedan sin
# previsualización.
OG_TAMANO = (1200, 630)
og = Path("assets/img/og")


def imagen_og(ruta: Path) -> int:
    salida = og / f"{ruta.stem}.jpg"
    if salida.exists():
        return salida.stat().st_size
    with Image.open(ruta) as imagen:
        imagen = imagen.convert("RGB")
        ancho, alto = OG_TAMANO
        escala = max(ancho / imagen.width, alto / imagen.height)
        imagen = imagen.resize(
            (round(imagen.width * escala), round(imagen.height * escala)), Image.LANCZOS
        )
        izq, arr = (imagen.width - ancho) // 2, (imagen.height - alto) // 2
        imagen.crop((izq, arr, izq + ancho, arr + alto)).save(
            salida, "JPEG", quality=82, optimize=True, progressive=True
        )
    return salida.stat().st_size


def variantes(ruta: Path) -> list[tuple[int, int]]:
    """Escribe las variantes de una foto y devuelve (ancho, bytes) de cada una."""
    generadas = []
    with Image.open(ruta) as imagen:
        imagen = imagen.convert("RGB")
        for ancho in ANCHOS:
            if ancho > imagen.width:
                continue
            salida = destino / f"{ruta.stem}-{ancho}.webp"
            if not salida.exists():
                copia = imagen.copy()
                copia.thumbnail((ancho, ancho * 3), Image.LANCZOS)
                copia.save(salida, "WEBP", quality=CALIDAD[ancho], method=6)
            generadas.append((ancho, salida.stat().st_size))
    return generadas


if __name__ == "__main__":
    og.mkdir(parents=True, exist_ok=True)
    total = 0
    for ruta in sorted(origen.glob("*.jpg")):
        with Image.open(ruta) as imagen:
            proporcion = f"{imagen.width}x{imagen.height}"
        generadas = variantes(ruta)
        total += sum(bytes_ for _, bytes_ in generadas) + imagen_og(ruta)
        detalle = "  ".join(f"{a}:{b // 1024}KB" for a, b in generadas)
        print(f"{ruta.stem:20} {proporcion:>11}  ->  {detalle}")
    print(f"\nTotal en disco: {total // 1024} KB · {len(list(destino.glob('*.webp')))} WebP + {len(list(og.glob('*.jpg')))} JPEG sociales")
