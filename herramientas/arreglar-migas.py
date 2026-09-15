import re, pathlib
# En las migas de pan el separador debe apuntar a la derecha, no hacia abajo.
cambios = 0
for f in pathlib.Path(".").rglob("*.html"):
    texto = original = f.read_text(encoding="utf-8")
    def arreglar(m):
        return m.group(0).replace("i-chevron-down", "i-chevron-right")
    texto = re.sub(r'<nav class="migas".*?</nav>', arreglar, texto, flags=re.S)
    if texto != original:
        f.write_text(texto, encoding="utf-8")
        cambios += 1
        print("migas corregidas:", f)
print("ficheros modificados:", cambios)
