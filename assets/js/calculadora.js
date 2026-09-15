/* ============================================================================
   Estacionportatil · calculadora de consumo y dimensionado solar
   Dibuja los controles a partir de DISPOSITIVOS (datos.js) y calcula:
   consumo diario, batería necesaria con pérdidas reales y panel mínimo.
   ========================================================================== */

const zona = document.getElementById('zona-solar')
const dias = document.getElementById('dias-autonomia')
const lista = document.getElementById('lista-dispositivos')

/* Devuelve el marcado de un icono del sprite local. */
const icono = (nombre, clase = 'icono') =>
  `<svg class="${clase}" aria-hidden="true"><use href="${SPRITE}#i-${nombre}"/></svg>`

/* Un deslizante por dispositivo: añadir un aparato nuevo es añadir un objeto
   en datos.js, no copiar quince líneas de HTML. */
const dibujarDispositivos = () => {
  lista.innerHTML = DISPOSITIVOS.map(aparato => `
    <div class="dispositivo" id="fila-${aparato.id}">
      <div class="dispositivo__info">
        <span class="marco-icono">${icono(aparato.icono, 'icono icono--l')}</span>
        <div><strong>${aparato.nombre}</strong><small>${aparato.nota}</small></div>
      </div>
      <div class="dispositivo__control">
        <input type="range" id="${aparato.id}" min="0" max="24" step="0.5" value="${aparato.horas}"
               aria-label="Horas diarias de uso de ${aparato.nombre}">
        <output for="${aparato.id}">${aparato.horas} h/día</output>
      </div>
    </div>`).join('')
}

/* Suma el consumo diario y guarda el pico de potencia más alto en uso, que es
   lo que determina si el inversor de la estación aguanta el arranque. */
const medirConsumo = () => DISPOSITIVOS.reduce((total, aparato) => {
  const horas = Number(document.getElementById(aparato.id).value)
  document.querySelector(`output[for="${aparato.id}"]`).textContent = `${horas} h/día`
  document.getElementById(`fila-${aparato.id}`).classList.toggle('dispositivo--activo', horas > 0)
  return {
    wh: total.wh + aparato.vatios * horas,
    pico: horas > 0 ? Math.max(total.pico, aparato.vatios) : total.pico,
  }
}, { wh: 0, pico: 0 })

/* Devuelve el primer elemento que cubre la necesidad; si ninguno llega, el mayor. */
const elegir = (catalogo, campo, necesario) =>
  catalogo.find(elemento => elemento[campo] >= necesario) || catalogo.at(-1)

const calcular = () => {
  const { wh, pico } = medirConsumo()
  const hsp = HORAS_SOL_PICO.find(z => z.id === zona.value).hsp
  const bateriaWh = Math.round(wh * Number(dias.value) / (AJUSTES.profundidadDescarga * AJUSTES.rendimientoInversor))
  const panelWp = Math.round(wh / (hsp * AJUSTES.rendimientoFotovoltaico))
  const producto = elegir(PRODUCTOS, 'capacidadWh', bateriaWh)
  const panel = elegir(PANELES, 'wp', panelWp)

  document.getElementById('consumo-wh').textContent = wh.toLocaleString('es-ES')
  document.getElementById('consumo-ah').textContent = `${Math.round(wh / 12)} Ah a 12 V`
  document.getElementById('bateria-wh').textContent = `${bateriaWh.toLocaleString('es-ES')} Wh útiles`
  document.getElementById('panel-wp').textContent = `${panelWp} Wp · ${panel.nombre}`
  document.getElementById('producto-nombre').textContent = producto.nombre
  document.getElementById('producto-resumen').textContent =
    pico > producto.salidaW
      ? `Cubre tu consumo diario, pero tus ${pico} W de pico superan sus ${producto.salidaW} W de salida: revisa la comparativa antes de comprar.`
      : `${producto.capacidadWh} Wh y ${producto.salidaW} W de salida. ${producto.resumen}`

  document.getElementById('producto-enlace').dataset.producto = producto.id
  aplicarEnlacesAfiliados()
}

/* Un solo escuchador en el contenedor en lugar de uno por deslizante. */
const iniciarCalculadora = () => {
  if (!lista) return
  dibujarDispositivos()
  document.getElementById('calculadora').addEventListener('input', calcular)
  calcular()
}

document.addEventListener('DOMContentLoaded', iniciarCalculadora)
