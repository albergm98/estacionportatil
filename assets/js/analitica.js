/* ============================================================================
   Estacionportatil · Google Analytics 4 con consentimiento (AEPD / LSSI)
   GA solo se carga tras opt-in. Clave localStorage: consentimiento_analitica
   Valores: "si" | "no". Sin valor → se muestra el banner.
   ========================================================================== */

const CLAVE_CONSENTIMIENTO = 'consentimiento_analitica'
const ID_ANALITICA = () => AJUSTES.idAnalitica

const haConsentidoAnalitica = () => localStorage.getItem(CLAVE_CONSENTIMIENTO) === 'si'

const cargarAnalitica = () => {
  if (!ID_ANALITICA() || window.gtag) return
  const id = ID_ANALITICA()
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(){ dataLayer.push(arguments) }
  gtag('js', new Date())
  gtag('config', id, { anonymize_ip: true })
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
  document.head.appendChild(script)
}

const guardarConsentimiento = valor => {
  localStorage.setItem(CLAVE_CONSENTIMIENTO, valor)
  document.getElementById('banner-cookies')?.remove()
  if (valor === 'si') cargarAnalitica()
}
window.guardarConsentimiento = guardarConsentimiento

const mostrarBannerCookies = () => {
  if (localStorage.getItem(CLAVE_CONSENTIMIENTO) || document.getElementById('banner-cookies')) return
  const raiz = document.body.dataset.raiz || './'
  const banner = document.createElement('div')
  banner.id = 'banner-cookies'
  banner.className = 'banner-cookies'
  banner.setAttribute('role', 'dialog')
  banner.setAttribute('aria-label', 'Consentimiento de cookies de analítica')
  banner.innerHTML = `
    <p>Usamos <strong>Google Analytics</strong> solo si lo aceptas, para entender el uso del sitio (IP anonimizada).
      <a href="${raiz}legal/cookies.html">Política de cookies</a>.</p>
    <div class="banner-cookies__acciones">
      <button type="button" class="boton boton--contorno boton--mini" data-consentimiento="no">Rechazar</button>
      <button type="button" class="boton boton--verde boton--mini" data-consentimiento="si">Aceptar analítica</button>
    </div>`
  banner.addEventListener('click', e => {
    const boton = e.target.closest('[data-consentimiento]')
    if (boton) guardarConsentimiento(boton.dataset.consentimiento)
  })
  document.body.appendChild(banner)
}

const iniciarConsentimiento = () => {
  if (!ID_ANALITICA()) return
  if (haConsentidoAnalitica()) cargarAnalitica()
  else if (localStorage.getItem(CLAVE_CONSENTIMIENTO) !== 'no') mostrarBannerCookies()
}

document.addEventListener('DOMContentLoaded', iniciarConsentimiento)
