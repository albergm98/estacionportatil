import re, pathlib
# Pictogramas de verdad (los que hay que eliminar)
emojis = re.compile("[\U0001F000-\U0001FAFF\u2600-\u26FF\u2700-\u27BF\uFE0F\u2B00-\u2BFF]")
total = 0
for f in sorted(pathlib.Path(".").rglob("*.html")):
    hallados = emojis.findall(f.read_text(encoding="utf-8"))
    if hallados:
        total += len(hallados)
        print(f"{str(f):52} {len(hallados):3}  {' '.join(sorted(set(hallados)))}")
print("TOTAL PICTOGRAMAS:", total)
