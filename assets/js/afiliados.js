/* ============================================================================
   Estacionportatil · gestión de enlaces de afiliado
   Cualquier <a data-producto="id"> recibe automáticamente:
     · su URL desde ENLACES_AFILIADOS (datos.js), única fuente de verdad
     · la etiqueta de Amazon, si es un enlace de Amazon y se la han olvidado
     · rel="sponsored nofollow noopener", que es lo que exige Google
     · medición del clic, para saber qué contenido genera comisiones
   Si un producto todavía no tiene programa de afiliación, el botón lleva a la
   comparativa interna en lugar de a una página muerta: nunca se pierde la visita.
   ========================================================================== */

/* `data-raiz` en <body> indica la profundidad de la página ("./" o "../"),
   para que enlaces y sprite de iconos funcionen en cualquier carpeta. */
const RAIZ = document.body.dataset.raiz
const SPRITE = `${RAIZ}assets/img/iconos.svg`

/* Añade la etiqueta de afiliado de Amazon solo si falta, para no duplicarla. */
const conEtiquetaAmazon = url =>
  !url.includes('amazon.') || url.includes('tag=')
    ? url
    : `${url}${url.includes('?') ? '&' : '?'}tag=${AJUSTES.etiquetaAmazon}`

const aplicarEnlacesAfiliados = () => {
  document.querySelectorAll('a[data-producto]').forEach(enlace => {
    const destino = ENLACES_AFILIADOS[enlace.dataset.producto]
    if (!destino) {
      enlace.href = `${RAIZ}comparativa.html`
      return
    }
    enlace.href = conEtiquetaAmazon(destino)
    enlace.rel = 'sponsored nofollow noopener'
    enlace.target = '_blank'
  })
}

/* Un único escuchador delegado registra todos los clics monetizados.
   Compatible con GA4 y Google Tag Manager a través de dataLayer; si no hay
   ninguna herramienta instalada, simplemente no hace nada visible. */
const medirClicAfiliado = evento => {
  const enlace = evento.target.closest('a[data-producto]')
  if (!enlace || !ENLACES_AFILIADOS[enlace.dataset.producto]) return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'clic_afiliado',
    producto: enlace.dataset.producto,
    pagina: location.pathname,
    texto: enlace.textContent.trim(),
  })
}

document.addEventListener('DOMContentLoaded', aplicarEnlacesAfiliados)
document.addEventListener('click', medirClicAfiliado)
