/* Menú suave + desplazamiento a anclas de la misma página. */

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
  cerrarGrupos()
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

document.addEventListener('click', evento => {
  const boton = evento.target.closest('.menu-boton')
  if (boton) {
    const cabecera = boton.closest('.cabecera')
    const abierto = cabecera.classList.toggle('cabecera--abierta')
    boton.setAttribute('aria-expanded', abierto ? 'true' : 'false')
    boton.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú')
    return
  }

  const enlace = evento.target.closest('a[href]')
  if (enlace) {
    let url
    try { url = new URL(enlace.href, location.href) } catch { return }
    if (url.hash && url.hash !== '#' && mismaPagina(url)) {
      const nodo = document.querySelector(url.hash)
      if (nodo) {
        evento.preventDefault()
        if (esMovil()) cerrarMenuMovil()
        const espera = esMovil() && !reduceMovimiento() ? 180 : 0
        setTimeout(() => irAAncla(url.hash), espera)
        return
      }
    }
    if (enlace.closest('.menu') && esMovil()) cerrarMenuMovil()
  }

  if (!evento.target.closest('.menu') && !evento.target.closest('.menu-boton')) {
    cerrarGrupos()
    if (esMovil()) cerrarMenuMovil()
  }
})

document.querySelectorAll('.menu__grupo').forEach(grupo => {
  grupo.addEventListener('toggle', () => {
    if (grupo.open) cerrarGrupos(grupo)
  })
})

/* Al llegar con #en-la-url, baja suave tras pintar la página. */
if (location.hash && document.querySelector(location.hash)) {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  window.scrollTo(0, 0)
  requestAnimationFrame(() => {
    setTimeout(() => irAAncla(location.hash), reduceMovimiento() ? 0 : 60)
  })
}
