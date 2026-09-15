/* ============================================================================
   Estacionportatil · relleno de datos legales (LSSI / RGPD)
   Completa [data-legal] y mailto desde DATOS_LEGALES en datos.js.
   ========================================================================== */

const valorLegalPendiente = valor =>
  typeof valor === 'string' && valor.startsWith('[COMPLETAR')

const rellenarDatosLegales = () => {
  document.querySelectorAll('[data-legal]').forEach(nodo => {
    const valor = DATOS_LEGALES[nodo.dataset.legal]
    if (valor == null || valor === '') {
      nodo.closest('li, p, tr')?.classList.add('oculto-legal')
      return
    }
    nodo.textContent = valor
    if (valorLegalPendiente(valor)) nodo.classList.add('dato-pendiente')
  })

  document.querySelectorAll('[data-legal-email]').forEach(enlace => {
    const email = DATOS_LEGALES.email
    if (!email || valorLegalPendiente(email)) return
    enlace.href = `mailto:${email}`
    if (!enlace.textContent.trim() || valorLegalPendiente(enlace.textContent.trim())) {
      enlace.textContent = email
    }
  })
}

document.addEventListener('DOMContentLoaded', rellenarDatosLegales)
