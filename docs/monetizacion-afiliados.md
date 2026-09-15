# Cómo monetizar Estacionportatil con marketing de afiliados

Documento operativo. Datos verificados el 15 de septiembre de 2026 en las fuentes
oficiales de cada programa. Las condiciones cambian: revísalas antes de decidir.

---

## 1. La conclusión primero: Amazon no es tu programa principal

Es el error que arruina la mayoría de las webs de este nicho. Amazon es cómodo y
convierte muy bien, pero en esta categoría paga fatal:

| Programa | Comisión | Cookie | Comisión real por una estación de 1.000 € |
|---|---|---|---|
| Amazon España · electrodomésticos y electrónica | 2,5 % | 24 h | **25 €** |
| Amazon España · resto de categorías | 3,0 % | 24 h | 30 € |
| EcoFlow (red Awin) | 5 % (anuncian 5-8 %) | 7-30 días según programa | **50 €** |
| Bluetti EU (red Awin) | 5 % base, hasta 10 % negociado | 30 días | **50-100 €** |
| Jackery (red Awin) | ~6 % según sus fichas de programa | ~30 días | 60 € |

Traducido: **la misma venta te paga entre dos y cuatro veces más en el programa
de marca que en Amazon**, y además la cookie dura 30 días en lugar de 24 horas,
lo que importa mucho cuando hablamos de una compra de 1.000 € que nadie decide
en la primera visita.

**Estrategia recomendada:** programas de marca como fuente principal y Amazon
como red de seguridad, porque hay gente que solo compra en Amazon y porque te
paga cualquier cosa que el visitante meta en el carrito en esas 24 horas.

---

## 2. En qué orden dar de alta los programas

### Paso 1 · Awin (prioritario)
Awin agrupa EcoFlow, Bluetti y Jackery, así que con una sola cuenta tienes los
tres anunciantes principales del nicho.

- Registro como *publisher* en Awin. Suele haber una tasa de acceso reembolsable
  (del orden de 5 €) que se te devuelve con las primeras comisiones.
- Awin revisa el sitio antes de aprobarte: necesitas la web ya publicada, con
  contenido real, aviso legal, privacidad y la página de afiliación visibles.
  Este proyecto ya lleva todo eso.
- Después solicitas cada anunciante por separado. La aprobación de EcoFlow o
  Bluetti no es automática: mira tu tráfico y tu contenido.
- Identificadores de anunciante en Awin: EcoFlow `59181`, Bluetti EU `95479`.

### Paso 2 · Contacto directo con las marcas
Merece mucho la pena. Bluetti anuncia abiertamente **hasta el 10 %** para
afiliados de calidad, es decir, el doble de su tarifa estándar. Se negocia por
correo enseñando cifras: visitas mensuales, clics salientes y ventas atribuidas.

- EcoFlow Europa: `eu.affiliate@ecoflow.com`
- Bluetti: formulario de su programa de afiliados (retirada mínima 100 €, pago en 30 días)

No escribas el primer día. Escribe cuando tengas dos o tres meses de datos: la
conversación cambia por completo.

### Paso 3 · Amazon Afiliados España
Ojo con los requisitos, que son la causa habitual de las expulsiones:

- **3 ventas cualificadas en los primeros 180 días** o te cierran la cuenta.
  Las compras que hagas tú no cuentan.
- Contenido original, **mínimo unas 10 publicaciones**, público y creado en los
  últimos 60 días. Desde el 14 de abril de 2026 «original» exige expresamente
  análisis, comentario o transformación que aporte valor: copiar fichas técnicas
  ya no vale.
- La web debe ser de tu propiedad.
- Pago a los ~60 días del cierre de mes, con mínimo de 25 € por transferencia.
- No envíes tráfico de anuncios pagados a Amazon: desde abril de 2026 esas
  compras quedan excluidas de comisión.

Consejo práctico: **da de alta Amazon cuando ya tengas tráfico**, no el primer
día, para no quemar la ventana de 180 días con una web que nadie visita todavía.

---

## 3. Cómo se meten los enlaces en este proyecto

Todo está centralizado. No hay que tocar ni un HTML.

### 3.1 Pegar los enlaces
Abre `assets/js/datos.js` y rellena `ENLACES_AFILIADOS`:

```js
const ENLACES_AFILIADOS = {
  'ecoflow-delta-2': 'https://www.awin1.com/cread.php?awinmid=59181&awinaffid=TU_ID&ued=...',
  'bluetti-ac180': 'https://www.awin1.com/cread.php?awinmid=95479&awinaffid=TU_ID&ued=...',
  'jackery-1000-plus': 'https://www.amazon.es/dp/XXXXXXXXXX',
  ...
}
```

Y tu etiqueta de Amazon en `AJUSTES.etiquetaAmazon`.

Lo que hace el sitio solo, sin que tengas que acordarte:

- Pone `rel="sponsored nofollow noopener"` y `target="_blank"` en cada enlace
  monetizado. Es lo que **exige Google** para enlaces de pago; si no lo pones,
  te expones a una acción manual por esquemas de enlaces.
- Añade `?tag=tu-etiqueta` a cualquier URL de Amazon en la que te la hayas
  olvidado, sin duplicarla si ya estaba.
- Si un producto tiene la cadena vacía, el botón **lleva a tu comparativa
  interna** en lugar de a una página muerta. Nunca pierdes la visita.
- La calculadora elige sola el producto recomendado según el resultado, y su
  botón apunta al enlace correcto de ese producto.

### 3.2 Saber qué gana dinero
Cada clic monetizado empuja un evento `clic_afiliado` a `dataLayer` con el
producto, la página y el texto del botón. Funciona con GA4 o Google Tag Manager
sin tocar código: solo tienes que crear el evento en la herramienta.

Es la métrica que de verdad manda. Te dice qué artículo genera clics y qué
artículo solo genera visitas, que no es lo mismo ni se parece.

### 3.3 Enmascarar los enlaces (opcional)
En `_redirects` tienes preparado el sistema para servir los enlaces como
`/ir/ecoflow-delta-2`. Funciona en Cloudflare Pages y en Netlify. Ventajas:
cambiar una URL en un solo sitio, sobrevivir a un cambio de programa sin editar
contenido, y ver los clics en los registros del servidor. `robots.txt` ya
excluye `/ir/` del rastreo.

---

## 4. Obligaciones legales que no son opcionales

- **Aviso visible** junto a los enlaces, no escondido en el pie. El proyecto usa
  el bloque `.divulgacion` al principio de cada página con enlaces.
- **Fórmula literal de Amazon**, ya incluida en el pie: «Como Afiliado de Amazon,
  obtenemos ingresos por las compras adscritas que cumplen los requisitos
  aplicables».
- **`rel="sponsored"`** en todos los enlaces monetizados. Automático aquí.
- **Aviso legal** (Ley 34/2002, LSSI-CE) con los datos del titular, y
  **política de privacidad y cookies** conforme al RGPD y la LOPDGDD. Están
  creados; hay que rellenar los campos `[COMPLETAR: ...]` en
  `DATOS_LEGALES` dentro de `assets/js/datos.js`.
- Si instalas analítica, necesitas **banner de consentimiento previo** según la
  guía de la AEPD. Sin analítica no hace falta, porque el sitio no pone cookies
  propias.

---

## 5. Cuánto tráfico hace falta: las cuentas sin humo

Las comisiones son datos oficiales. **Las tasas de conversión son estimaciones**
razonables para este vertical; mídelas en tu caso, porque varían mucho.

Objetivo: **1.000 € al mes**.

1. Comisión media por venta, mezclando programas de marca y Amazon: **≈ 45 €**.
2. Ventas necesarias: 1.000 / 45 = **≈ 22 ventas al mes**.
3. Conversión estimada de clic saliente a venta en electrónica de ticket alto:
   **3-5 %**. Necesitas entre **440 y 730 clics salientes** al mes.
4. Porcentaje de visitantes que pulsan un enlace de afiliado en una página de
   comparativa bien hecha: **15-25 %**. Necesitas entre **1.800 y 4.900 visitas
   al mes a páginas de dinero**.
5. Las páginas de dinero suelen ser el 30-40 % del tráfico total. Total
   aproximado: **5.000-15.000 visitas al mes**.

Es un objetivo de 8 a 14 meses de trabajo constante en un nicho competido. Quien
te prometa otra cosa te está vendiendo un curso.

---

## 6. Palanca infravalorada: la calculadora

La calculadora no está ahí de adorno; es el mejor activo comercial del sitio:

- **Capta enlaces.** Las herramientas gratuitas y útiles consiguen enlaces
  naturales de foros, grupos de vanlife y blogs. Eso es autoridad que no se
  compra.
- **Cualifica al visitante.** Quien mueve los deslizadores y ve «necesitas
  1.050 Wh» ya sabe qué comprar. El clic que da después vale mucho más que el de
  alguien que llega de una búsqueda vaga.
- **Recomienda sola.** Da el resultado y el producto exacto que lo cubre, con su
  enlace, en la misma pantalla.
- **Diferencia.** La mayoría de la competencia solo tiene tablas copiadas de las
  fichas del fabricante.

Promociónala aparte del contenido: en Reddit (r/vandwellers, r/solar), en foros
de autocaravanas, en grupos de Facebook de camperización. Como herramienta, no
como enlace de compra.

---

## 7. Errores que cuestan la cuenta o el posicionamiento

1. Dar de alta Amazon antes de tener tráfico y quemar los 180 días.
2. Copiar especificaciones del fabricante sin análisis propio: incumple la
   definición de contenido original de Amazon desde abril de 2026.
3. Olvidar `rel="sponsored"`. Aquí es automático, pero si añades enlaces a mano
   en el HTML, ponlo.
4. Escribir reseñas sin apartado de inconvenientes. Google lo detecta y el
   lector también.
5. Publicar precios fijos en el HTML: se quedan obsoletos en una semana y dañan
   la credibilidad. Este proyecto no fija precios a propósito.
6. Inventar pruebas que no has hecho. Si no has medido el producto, di que te
   basas en fichas oficiales y pruebas de terceros, como hace
   `metodologia.html`.
