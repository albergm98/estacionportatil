# Estacionportatil

Web de afiliación sobre energía solar portátil y sistemas off-grid: calculadora
de consumo, comparativas técnicas y guías de instalación.

Sitio **estático, sin compilación y sin dependencias externas en tiempo de
ejecución**. Se abre con doble clic y se publica subiendo la carpeta.

---

## Puesta en marcha

```powershell
# Servidor local (necesario: el sprite de iconos no carga bien desde file://)
python -m http.server 8000
# Abre http://localhost:8000
```

Publicación: arrastra la carpeta a **Cloudflare Pages** o **Netlify**. Ambos
tienen plan gratuito suficiente y entienden el fichero `_redirects`.

---

## Estructura

```
index.html              Portada: calculadora, comparativa resumida, guías, FAQ
comparativa.html        Página de dinero: 5 estaciones con pros y contras
metodologia.html        Cómo puntuamos y qué fórmulas usa la calculadora
creditos.html           Origen y licencia de imágenes, iconos y tipografías
guias/                  4 guías técnicas
legal/                  Aviso legal, privacidad, cookies y afiliación
robots.txt  sitemap.xml  _redirects

assets/css/estilos.css  Todo el diseño. Sin framework ni CDN
assets/js/datos.js      FUENTE ÚNICA DE DATOS: productos, enlaces, datos legales
assets/js/calculadora.js  Cálculo y dibujado de la calculadora
assets/js/afiliados.js  Resuelve enlaces, pone rel="sponsored" y mide clics
assets/js/legal.js      Rellena los datos del titular en las páginas legales
assets/img/iconos.svg   Sprite con 47 iconos de Lucide. Sin JavaScript
assets/img/foto/        8 fotografías en WebP, 5 anchos cada una (srcset)
assets/img/foto/original/  Originales de 3.300-8.200 px, fuente de las variantes
assets/img/og/          Recortes 1200x630 en JPEG para redes sociales
assets/fuentes/         Inter y Space Grotesk variables, auto-alojadas

herramientas/           Scripts de mantenimiento
docs/                   Estrategia de monetización y plan de contenidos
```

---

## Qué tocar para cada cosa

| Quiero› | Edito |
|---|---|
| Poner mis enlaces de afiliado | `ENLACES_AFILIADOS` en `assets/js/datos.js` |
| Mi etiqueta de Amazon | `AJUSTES.etiquetaAmazon` en `datos.js` |
| Mis datos como titular (NIF, domicilio, email) | `DATOS_LEGALES` en `datos.js` |
| Añadir o cambiar un producto | `PRODUCTOS` en `datos.js` |
| Añadir un aparato a la calculadora | `DISPOSITIVOS` en `datos.js` |
| Cambiar colores o tipografías | Variables `:root` en `estilos.css` |
| Añadir un icono | `herramientas/construir-sprite.ps1` |
| Añadir una foto nueva | `herramientas/descargar-fotos.py` y luego `optimizar-imagenes.py` |

**Antes de publicar, obligatorio:** rellenar los `[COMPLETAR: ...]`. Aparecen
resaltados en amarillo en las páginas legales para que no se te pasen, y hay dos
grupos:

1. **Datos del titular** (nombre, NIF, domicilio, correo): se editan una sola
   vez en `DATOS_LEGALES` de `assets/js/datos.js` y se propagan solos.
   `telefono` y `registroMercantil` pueden quedarse vacíos: sus filas se
   ocultan automáticamente.
2. **Proveedor de alojamiento y herramienta de analítica**: están escritos
   directamente en el HTML de `legal/privacidad.html` y `legal/cookies.html`,
   porque cada uno aparece en un contexto distinto y no se pueden centralizar.

---

## Herramientas

```powershell
.\herramientas\construir-sprite.ps1         # Regenera el sprite de iconos
python herramientas\descargar-fotos.py      # Baja originales de Wikimedia Commons
python herramientas\optimizar-imagenes.py   # Genera los 5 anchos WebP + JPEG social
python herramientas\buscar-emojis.py        # Comprueba que no quedan emojis
python herramientas\verificar.py            # JSON-LD, enlaces, iconos y captura
python herramientas\medir-contraste.py      # Contraste real del texto de portada
python herramientas\capturar.py             # Capturas y errores de consola
```

Los scripts de imágenes no repiten trabajo: si el fichero ya existe, lo saltan.

---

## Decisiones de diseño y por qué

- **Sin Tailwind por CDN.** Compila en el navegador y retrasa el LCP, que es
  factor de posicionamiento. El CSS va escrito y precompilado.
- **Iconos en sprite local, no librería por CDN.** 47 iconos de Lucide en 10 KB,
  sin JavaScript y sin peticiones a terceros.
- **Tipografías auto-alojadas.** Cargarlas desde Google Fonts transfiere la IP
  del visitante a un tercero, lo que en la UE es un problema de protección de
  datos. Las dos variables pesan 70 KB juntas.
- **Fotografía real con licencia libre, no imágenes generadas.** Originales de
  hasta 8.200 px de Wikimedia Commons, servidos con `srcset` en cinco anchos.
  Se descartaron los bancos que topan en 960 px porque se veían borrosos. Los
  esquemas técnicos son SVG propio. Atribución completa en `creditos.html`.
- **Nada de precios en el HTML.** Se quedan obsoletos en días y queman la
  credibilidad, que es el único activo real de una web de reseñas.
- **Contenido crítico en HTML estático.** Solo la calculadora depende de
  JavaScript; textos, tablas y enlaces internos se rastrean sin ejecutar nada.

---

## Estado y pendientes

Hecho: diseño, calculadora, comparativa, 4 guías, legales, SEO técnico
(canónicas, Open Graph, JSON-LD con Article, FAQPage, ItemList y BreadcrumbList,
sitemap y robots) e infraestructura de afiliación.

Pendiente antes de publicar:

1. Rellenar `DATOS_LEGALES`.
2. Dar de alta los programas de afiliación y pegar los enlaces
   (ver `docs/monetizacion-afiliados.md`).
3. **Verificar las especificaciones de los productos** en las fichas oficiales y
   anotar la fecha en el campo `revisadoEl` de cada producto en `datos.js`.
   Están tomadas de fichas de fabricante pero no auditadas una por una.
4. Cambiar el dominio `estacionportatil.com` por el tuyo en las etiquetas
   canónicas, Open Graph, `sitemap.xml` y `robots.txt`.
5. Poner un autor real con nombre y experiencia en las fichas de autor: es el
   factor E-E-A-T que más cuesta y más diferencia.
