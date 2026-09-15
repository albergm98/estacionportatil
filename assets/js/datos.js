/* ============================================================================
   Estacionportatil · fuente única de datos
   Todo el contenido variable del sitio vive aquí: productos, enlaces de
   afiliado, dispositivos de la calculadora y constantes de cálculo.
   Para cambiar de producto recomendado o de etiqueta de afiliado NO se toca
   ningún HTML: se edita este fichero.
   ========================================================================== */

/* Ajustes generales del sitio y de los cálculos eléctricos. */
const AJUSTES = {
  marca: 'Estacionportatil',
  dominio: 'https://estacionportatil.com',
  // Etiqueta de Amazon Afiliados. Sustitúyela por la tuya antes de publicar.
  etiquetaAmazon: 'estacionportatil-21',
  // Pérdidas reales de un sistema de 12 V: inversor, cableado y temperatura.
  rendimientoInversor: 0.85,
  // LiFePO4 admite descargas del 90 % sin penalizar su vida útil.
  profundidadDescarga: 0.9,
  // Pérdidas del conjunto panel + regulador MPPT + orientación no ideal.
  rendimientoFotovoltaico: 0.75,
}

/* Identidad del prestador (LSSI-CE art. 10 + RGPD).
   Obligatorios: titular, nif, domicilio, email.
   Teléfono y registro mercantil son opcionales (autónomo = sin registro). */
const DATOS_LEGALES = {
  titular: 'Alberto Gallardo Morales',
  nif: '06023563R',
  domicilio: 'C/ Golondrinas 4, 2º B, 28400 Collado Villalba, Madrid',
  email: 'gallardomorales.98@gmail.com',
  telefono: '',
  registroMercantil: '',
  dominio: 'https://estacionportatil.com',
  actividad: 'Información editorial y análisis técnicos sobre energía solar portátil, autoconsumo y sistemas off-grid, financiados con programas de afiliación. Actividad económica como trabajador autónomo. El sitio no vende productos propios ni presta servicios de instalación.',
  fechaActualizacion: '15 de septiembre de 2026',
}

/* Horas de sol pico (HSP) medias en España según zona y época.
   Fuente: atlas de radiación PVGIS. Se usan para dimensionar el panel. */
const HORAS_SOL_PICO = [
  { id: 'verano-sur', nombre: 'Verano · sur de España', hsp: 6 },
  { id: 'verano-norte', nombre: 'Verano · norte y Cantábrico', hsp: 4.8 },
  { id: 'media-anual', nombre: 'Media anual (recomendado)', hsp: 4 },
  { id: 'invierno-sur', nombre: 'Invierno · sur de España', hsp: 3 },
  { id: 'invierno-norte', nombre: 'Invierno · norte y Cantábrico', hsp: 2 },
]

/* Dispositivos de la calculadora. Los vatios son consumos medios reales;
   en el frigorífico las horas son de compresor en marcha, no de nevera
   enchufada (un compresor trabaja entre el 40 % y el 60 % del tiempo).
   `icono` es el identificador del sprite de Lucide, sin el prefijo "i-". */
const DISPOSITIVOS = [
  { id: 'nevera', nombre: 'Frigorífico de compresor', icono: 'refrigerator', vatios: 45, horas: 12, nota: '45 W · horas de compresor en marcha' },
  { id: 'portatil', nombre: 'Ordenador portátil', icono: 'laptop', vatios: 65, horas: 4, nota: '65 W · carga y uso simultáneo' },
  { id: 'luces', nombre: 'Iluminación LED', icono: 'lightbulb', vatios: 15, horas: 5, nota: '15 W · tira LED de 12 V' },
  { id: 'movil', nombre: 'Móviles y tablet', icono: 'smartphone', vatios: 15, horas: 3, nota: '15 W · carga USB-C' },
  { id: 'bomba', nombre: 'Bomba de agua', icono: 'droplets', vatios: 50, horas: 1, nota: '50 W · funcionamiento intermitente' },
  { id: 'ventilador', nombre: 'Ventilador o extractor', icono: 'fan', vatios: 25, horas: 6, nota: '25 W · ventilación de techo' },
  { id: 'induccion', nombre: 'Placa de inducción', icono: 'cooking-pot', vatios: 1500, horas: 0, nota: '1500 W · el gran devorador de batería' },
  { id: 'cafetera', nombre: 'Cafetera o hervidor', icono: 'coffee', vatios: 1000, horas: 0, nota: '1000 W · picos cortos pero intensos' },
]

/* Estaciones de energía ordenadas por capacidad: la calculadora elige la
   primera cuya capacidad cubre la necesidad estimada.
   s⚠️ Especificaciones según ficha del fabricante. Verifícalas y anota la fecha
   en `revisadoEl` antes de publicar: es lo que sostiene tu credibilidad. */
const PRODUCTOS = [
  {
    id: 'ecoflow-river-2-pro',
    nombre: 'EcoFlow River 2 Pro',
    capacidadWh: 768,
    salidaW: 800,
    picoW: 1600,
    quimica: 'LiFePO4',
    ciclos: '3.000 al 80 %',
    pesoKg: 7.8,
    puntuacion: 9.1,
    resumen: 'La más ligera con autonomía real para un fin de semana.',
    idealPara: 'Escapadas cortas, camper ligera, teletrabajo sin cocina eléctrica.',
    pros: ['Solo 7,8 kg', 'Carga completa en 70 minutos', 'Precio de entrada contenido'],
    contras: ['800 W no mueven inducción ni hervidor', 'No amplía capacidad'],
    revisadoEl: '',
  },
  {
    id: 'ecoflow-delta-2',
    nombre: 'EcoFlow Delta 2',
    capacidadWh: 1024,
    salidaW: 1800,
    picoW: 2700,
    quimica: 'LiFePO4',
    ciclos: '3.000 al 80 %',
    pesoKg: 12,
    puntuacion: 9.6,
    resumen: 'El equilibrio más fino entre potencia, peso y velocidad de carga.',
    idealPara: 'Camper de uso continuo, respaldo doméstico, cafetera puntual.',
    pros: ['0-80 % en 50 minutos desde la red', 'Amplía hasta 3 kWh con batería extra', 'App y control de carga muy maduros'],
    contras: ['El ventilador se oye al cargar rápido', 'Batería de ampliación cara'],
    revisadoEl: '',
  },
  {
    id: 'bluetti-ac180',
    nombre: 'Bluetti AC180',
    capacidadWh: 1152,
    salidaW: 1800,
    picoW: 2700,
    quimica: 'LiFePO4',
    ciclos: '3.500 al 80 %',
    pesoKg: 16,
    puntuacion: 9.4,
    resumen: 'Más vatios-hora por euro que casi cualquier rival de su tamaño.',
    idealPara: 'Quien prioriza capacidad y precio sobre el peso.',
    pros: ['1.152 Wh por el precio de 1.000', 'Modo silencioso de carga', 'UPS con conmutación rápida'],
    contras: ['16 kg se notan al moverla', 'Sin ampliación de batería'],
    revisadoEl: '',
  },
  {
    id: 'jackery-1000-plus',
    nombre: 'Jackery Explorer 1000 Plus',
    capacidadWh: 1264,
    salidaW: 2000,
    picoW: 4000,
    quimica: 'LiFePO4',
    ciclos: '4.000 al 70 %',
    pesoKg: 14.5,
    puntuacion: 9.2,
    resumen: 'La que más ciclos promete y la que mejor amplía en su gama.',
    idealPara: 'Instalaciones que crecerán: admite hasta 5 kWh en total.',
    pros: ['4.000 ciclos de vida útil', 'Ampliable a 5 kWh', '2.000 W mueven inducción'],
    contras: ['Más caro por vatio-hora', 'App menos completa que EcoFlow'],
    revisadoEl: '',
  },
  {
    id: 'bluetti-ac200max',
    nombre: 'Bluetti AC200MAX',
    capacidadWh: 2048,
    salidaW: 2200,
    picoW: 4800,
    quimica: 'LiFePO4',
    ciclos: '3.500 al 80 %',
    pesoKg: 28.1,
    puntuacion: 9,
    resumen: 'Capacidad de cabaña en un formato todavía transportable.',
    idealPara: 'Vivienda off-grid, varios días sin sol, herramienta eléctrica.',
    pros: ['2 kWh ampliables a 8 kWh', 'Entrada solar de 900 W', 'Salida de 30 A para autocaravana'],
    contras: ['28 kg: se mueve poco', 'Necesita mucho panel para recargarse'],
    revisadoEl: '',
  },
]

/* Paneles solares recomendados según los vatios-pico que salgan del cálculo. */
const PANELES = [
  { id: 'panel-100w', nombre: 'Panel plegable de 100 W', wp: 100 },
  { id: 'panel-220w', nombre: 'Panel plegable de 220 W', wp: 220 },
  { id: 'panel-400w', nombre: 'Dos paneles de 220 W en paralelo', wp: 440 },
  { id: 'panel-600w', nombre: 'Kit rígido de 600 W en techo', wp: 600 },
]

/* Enlaces de afiliado (Amazon.es). La etiqueta se añade en afiliados.js.
   Cadena vacía → el botón va a la comparativa interna. ASINs revisados 2026-09. */
const ENLACES_AFILIADOS = {
  'ecoflow-river-2-pro': 'https://www.amazon.es/dp/B0BFQD5RMJ',
  'ecoflow-delta-2': 'https://www.amazon.es/dp/B0BBLV8WJH',
  // Listado más estable en ES: kit AC180 + panel 200 W (la estación es la misma).
  'bluetti-ac180': 'https://www.amazon.es/dp/B0C2V9D7ZQ',
  'jackery-1000-plus': 'https://www.amazon.es/dp/B0C27SX47T',
  'bluetti-ac200max': 'https://www.amazon.es/dp/B0B1BRS8LF',
  'panel-100w': 'https://www.amazon.es/dp/B0BW96ZZNS', // Bluetti 100 W plegable
  'panel-220w': 'https://www.amazon.es/dp/B0B12CKM3C', // EcoFlow 220 W bifacial
  'panel-400w': 'https://www.amazon.es/dp/B0B12CKM3C', // mismo 220 W (hacer 2 en paralelo)
  'panel-600w': '', // sin ASIN estable de kit rígido 600 W; deja fallback interno
}
