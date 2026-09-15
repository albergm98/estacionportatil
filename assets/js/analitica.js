/* ============================================================================
   Estacionportatil · Google Analytics 4 con consentimiento (modal)
   Consent Mode v2: medición solo con opt-in.
   localStorage consentimiento_analitica: "si" | "no" | (vacío = modal)
   ========================================================================== */

const CLAVE_CONSENTIMIENTO = 'consentimiento_analitica'
const idAnalitica = () => (typeof AJUSTES !== 'undefined' && AJUSTES.idAnalitica) || ''

const haConsentidoAnalitica = () => localStorage.getItem(CLAVE_CONSENTIMIENTO) === 'si'

const asegurarGtag = () => {
  window.dataLayer = window.dataLayer || []
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag(){ window.dataLayer.push(arguments) }
  }
}

const aplicarConsentimiento = otorgado => {
  asegurarGtag()
  gtag('consent', 'update', {
    analytics_storage: otorgado ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })
}

const cargarAnalitica = () => {
  const id = idAnalitica()
  if (!id) return
  asegurarGtag()
  if (!window.__ga4_cargado) {
    window.__ga4_cargado = true
    gtag('js', new Date())
    gtag('config', id, {
      anonymize_ip: true,
      send_page_view: true,
    })
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
    document.head.appendChild(script)
  }
  if (haConsentidoAnalitica()) {
    aplicarConsentimiento(true)
    gtag('event', 'page_view', { page_path: location.pathname + location.search })
  }
}

const cerrarModalCookies = () => {
  document.getElementById('modal-cookies')?.remove()
  document.body.classList.remove('modal-cookies-activo')
}

const guardarConsentimiento = valor => {
  localStorage.setItem(CLAVE_CONSENTIMIENTO, valor)
  cerrarModalCookies()
  if (valor === 'si') cargarAnalitica()
  else aplicarConsentimiento(false)
}
window.guardarConsentimiento = guardarConsentimiento

const mostrarModalCookies = () => {
  if (localStorage.getItem(CLAVE_CONSENTIMIENTO) || document.getElementById('modal-cookies')) return
  const raiz = document.body.dataset.raiz || './'
  const modal = document.createElement('div')
  modal.id = 'modal-cookies'
  modal.className = 'modal-cookies'
  modal.setAttribute('role', 'dialog')
  modal.setAttribute('aria-modal', 'true')
  modal.setAttribute('aria-labelledby', 'modal-cookies-titulo')
  modal.innerHTML = `
    <div class="modal-cookies__caja">
      <h2 id="modal-cookies-titulo">Cookies de analítica</h2>
      <p>Usamos <strong>Google Analytics</strong> solo si lo aceptas, para entender cómo se usa el sitio (IP anonimizada).
        Puedes rechazarlo y seguir navegando igual.
        <a href="${raiz}legal/cookies.html">Política de cookies</a>.</p>
      <div class="modal-cookies__acciones">
        <button type="button" class="boton boton--rechazar" data-consentimiento="no">Rechazar</button>
        <button type="button" class="boton boton--verde" data-consentimiento="si">Aceptar</button>
      </div>
    </div>`
  modal.addEventListener('click', e => {
    const boton = e.target.closest('[data-consentimiento]')
    if (boton) guardarConsentimiento(boton.dataset.consentimiento)
  })
  document.body.classList.add('modal-cookies-activo')
  document.body.appendChild(modal)
  modal.querySelector('[data-consentimiento="no"]')?.focus()
}

const iniciarConsentimiento = () => {
  const id = idAnalitica()
  if (!id) return
  asegurarGtag()
  gtag('consent', 'default', {
    analytics_storage: haConsentidoAnalitica() ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500,
  })
  if (haConsentidoAnalitica()) {
    cargarAnalitica()
  } else if (localStorage.getItem(CLAVE_CONSENTIMIENTO) !== 'no') {
    mostrarModalCookies()
  }
}

document.addEventListener('DOMContentLoaded', iniciarConsentimiento)
