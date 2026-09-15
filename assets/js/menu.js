/* Menú móvil + anclas suaves + tablas sin scroll lateral. */

const reduceMovimiento = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const esMovil = () => window.matchMedia('(max-width: 860px)').matches

const mismaPagina = url => {
  const actual = location.pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/'
  const destino = url.pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/'
  return actual === destino || actual.endsWith(destino) || destino.endsWith(actual)
}

const cerrarGrupos = excepto => {
  document.querySelectorAll('.menu__grupo[open]').forEach(grupo => {
    if (grupo !== excepto) grupo.removeAttribute('open')
  })
}

const cerrarMenuMovil = () => {
  const cabecera = document.querySelector('.cabecera')
  const boton = document.querySelector('.menu-boton')
  if (!cabecera || !boton) return
  cabecera.classList.remove('cabecera--abierta')
  boton.setAttribute('aria-expanded', 'false')
  boton.setAttribute('aria-label', 'Abrir menú')
  document.body.classList.remove('cuerpo--menu-abierto')
  cerrarGrupos()
}

const abrirOCerrarMenu = () => {
  const cabecera = document.querySelector('.cabecera')
  const boton = document.querySelector('.menu-boton')
  if (!cabecera || !boton) return
  const abierto = cabecera.classList.toggle('cabecera--abierta')
  boton.setAttribute('aria-expanded', abierto ? 'true' : 'false')
  boton.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú')
  document.body.classList.toggle('cuerpo--menu-abierto', abierto && esMovil())
  if (!abierto) cerrarGrupos()
}

const irAAncla = hash => {
  const destino = document.querySelector(hash)
  if (!destino) return false
  destino.scrollIntoView({
    behavior: reduceMovimiento() ? 'auto' : 'smooth',
    block: 'start',
  })
  history.pushState(null, '', hash)
  return true
}

/* Etiqueta cada <td> con el título de columna del thead (para tarjetas en móvil). */
const prepararTablas = () => {
  document.querySelectorAll('.tabla-envoltorio table').forEach(tabla => {
    const etiquetas = [...tabla.querySelectorAll('thead th')].map(th =>
      (th.textContent || '').replace(/\s+/g, ' ').trim()
    )
    if (!etiquetas.length) return
    tabla.querySelectorAll('tbody tr').forEach(fila => {
      const desfase = fila.querySelector(':scope > th') ? 1 : 0
      fila.querySelectorAll(':scope > td').forEach((celda, indice) => {
        if (celda.dataset.etiqueta) {
          if ((celda.textContent || '').trim().length > 48) celda.classList.add('celda-texto')
          return
        }
        const etiqueta = etiquetas[indice + desfase]
        if (!etiqueta) return
        celda.dataset.etiqueta = etiqueta
        if ((celda.textContent || '').trim().length > 48) celda.classList.add('celda-texto')
      })
    })
  })
}

document.addEventListener('click', evento => {
  if (evento.target.closest('.menu-boton')) {
    abrirOCerrarMenu()
    return
  }

  const enlace = evento.target.closest('a[href]')
  if (enlace) {
    let url
    try { url = new URL(enlace.href, location.href) } catch { return }
    const enMenu = enlace.closest('.menu') || enlace.closest('.cabecera .boton--verde')
    if (url.hash && url.hash !== '#' && mismaPagina(url) && document.querySelector(url.hash)) {
      evento.preventDefault()
      if (esMovil()) cerrarMenuMovil()
      setTimeout(() => irAAncla(url.hash), esMovil() && !reduceMovimiento() ? 80 : 0)
      return
    }
    if (enMenu && esMovil()) cerrarMenuMovil()
    return
  }

  if (evento.target.closest('.menu')) return

  cerrarGrupos()
  if (esMovil()) cerrarMenuMovil()
})

document.addEventListener('keydown', evento => {
  if (evento.key === 'Escape') cerrarMenuMovil()
})

window.matchMedia('(max-width: 860px)').addEventListener('change', () => cerrarMenuMovil())

document.querySelectorAll('.menu__grupo').forEach(grupo => {
  grupo.addEventListener('toggle', () => {
    if (grupo.open) cerrarGrupos(grupo)
  })
})

prepararTablas()

if (location.hash && location.hash !== '#') {
  requestAnimationFrame(() => {
    const nodo = document.querySelector(location.hash)
    if (nodo) nodo.scrollIntoView({ behavior: reduceMovimiento() ? 'auto' : 'smooth', block: 'start' })
  })
}
