# Plan de contenidos

Estructura de contenidos por intención de búsqueda. El modelo es sencillo:
**páginas de dinero** que monetizan y **páginas de apoyo** que atraen tráfico y
autoridad, todas enlazando hacia las primeras.

---

## Páginas de dinero (ya creadas)

Intención transaccional. Aquí van los enlaces de afiliado.

| Página | Intención que cubre |
|---|---|
| `comparativa.html` | «mejor estación de energía portátil», «mejores baterías portátiles» |
| `guias/estacion-energia-portatil-furgoneta-camper.html` | «estación de energía para camper», dimensionado + compra |
| `guias/estacion-energia-portatil-apagones-casa.html` | «batería de respaldo para apagones» |
| `guias/ecoflow-delta-2-vs-bluetti-ac180.html` | comparación cabeza a cabeza, el visitante ya está decidiendo |
| `guias/ecoflow-delta-2-vs-jackery-1000-plus.html` | comparación cabeza a cabeza en gama de 1 kWh |
| `guias/mejores-baterias-lifepo4-100ah.html` | «mejor batería LiFePO4 100 Ah» |

Para crear o actualizar cualquiera de estas páginas, usar la skill
`contenido-afiliados` (investigación, plantilla HTML, monetización y publicación).

Las comparativas «X vs Y» son las que mejor convierten de todo el sitio: quien
busca eso ya tiene la tarjeta en la mano.

---

## Páginas de apoyo (ya creadas)

Intención informativa. No venden directamente; traen tráfico, consiguen enlaces
y empujan al lector hacia las páginas de dinero.

- `index.html#calculadora` — la herramienta, el mejor imán de enlaces
- `guias/cuantos-paneles-solares-necesito.html`
- `guias/instalacion-segura-kit-solar-12v.html`
- `metodologia.html` — no posiciona, pero sostiene la confianza y el E-E-A-T

---

## Siguientes 12 artículos, por orden de prioridad

Criterio: primero lo que convierte, después lo que trae volumen.

### Comparativas directas (máxima conversión)
1. ~~EcoFlow Delta 2 vs Jackery Explorer 1000 Plus~~ (publicado)
2. ~~Bluetti AC180 vs AC200MAX: cuándo merece el salto de capacidad~~ (publicado)
3. ~~Estación de energía o instalación fija a 12 V: cuentas reales~~ (publicado)

### Guías de compra por caso de uso
4. ~~Mejor estación de energía para furgoneta camper~~ (publicado)
5. ~~Mejor batería de respaldo para apagones en casa~~ (publicado)
6. Kit solar para cabaña sin red eléctrica: dimensionado completo
7. Mejor estación de energía por debajo de 500 €

### Informativas de volumen (traen tráfico y enlaces)
8. LiFePO4 frente a iones de litio: cuál compensa y por qué
9. Cuánto consume una nevera de compresor en una camper
10. Cómo cargar una estación de energía con el alternador del vehículo
11. ~~¿Se puede usar una placa de inducción con una estación de energía?~~ (publicado)
12. Errores al dimensionar una instalación solar en una furgoneta

---

## Reglas de ejecución

- **Ritmo sostenible:** dos artículos al mes bien hechos superan a ocho
  mediocres. El contenido delgado ya no posiciona y además incumple los
  requisitos de contenido original de Amazon.
- **Enlazado interno:** cada artículo informativo enlaza al menos una vez a la
  comparativa y una vez a la calculadora. Cada comparativa enlaza a las dos
  guías técnicas que respaldan sus afirmaciones.
- **Actualización:** revisa las especificaciones cada trimestre y actualiza
  `dateModified` en el JSON-LD y el campo `revisadoEl` en `datos.js`. Una
  comparativa de 2026 que sigue diciendo 2026 en 2027 pierde posiciones.
- **Ampliar la calculadora** es más rentable que escribir un artículo más: añade
  aparatos nuevos en `DISPOSITIVOS` y perfiles predefinidos (camper, cabaña,
  respaldo doméstico).
- **Nunca precios en el texto.** Cambian cada semana y queman la credibilidad.

---

## Distribución, que es la mitad del trabajo

Publicar no es distribuir. Dedica tiempo explícito a:

- **Reddit:** r/vandwellers, r/solar, r/SolarDIY, r/campervan. Comparte la
  calculadora como herramienta, respondiendo preguntas concretas. Si solo pones
  enlaces, te expulsan.
- **Foros españoles** de autocaravanas y camperización, donde el contenido
  técnico en castellano es escaso y se agradece.
- **Grupos de Facebook** de vanlife y camperización en España.
- **YouTube:** un vídeo mostrando la calculadora en funcionamiento y enlazando
  desde la descripción.

Los primeros enlaces no llegan por SEO, llegan porque alguien encuentra la
herramienta útil y la recomienda.
