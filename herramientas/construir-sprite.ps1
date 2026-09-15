# ============================================================================
# Voltio NÃ³mada Â· generador del sprite de iconos
# Descarga los iconos de Lucide (licencia ISC) y los empaqueta en un Ãºnico
# fichero SVG local. AsÃ­ no dependemos de ningÃºn CDN ni de JavaScript.
#
# Uso:  .\herramientas\construir-sprite.ps1
# Para aÃ±adir un icono nuevo: mete su nombre de Lucide en $iconos y ejecuta.
# ============================================================================

$iconos = @(
  'zap','calculator','table-2','book-open','shield-check','refrigerator','laptop',
  'lightbulb','smartphone','droplets','fan','cooking-pot','coffee','battery-charging',
  'battery-full','sun','trophy','medal','award','star','arrow-right','arrow-up-right',
  'check','x','circle-alert','info','plug-zap','package','clock','trending-up',
  'external-link','chevron-down','chevron-right','wrench','cable','gauge','scale','weight',
  'triangle-alert','circle-check','sun-medium','file-text','mail','shield',
  'thermometer','ruler','list-checks'
)

$carpetaFuente = 'assets\iconos-fuente'
$destino = 'assets\img\iconos.svg'
New-Item -ItemType Directory -Force -Path $carpetaFuente, 'assets\img' | Out-Null

foreach ($icono in $iconos) {
  $fichero = Join-Path $carpetaFuente "$icono.svg"
  if (Test-Path $fichero) { continue }
  Invoke-WebRequest -Uri "https://unpkg.com/lucide-static@latest/icons/$icono.svg" -OutFile $fichero
}

# Cada SVG se convierte en un <symbol> con identificador "i-nombre".
# Los atributos de trazo se aplican por CSS en la clase .icono, no aquÃ­.
$partes = [System.Collections.Generic.List[string]]::new()
$partes.Add('<svg xmlns="http://www.w3.org/2000/svg" style="display:none"><!-- Iconos de Lucide (ISC) Â· generado por herramientas/construir-sprite.ps1 -->')

foreach ($fichero in Get-ChildItem "$carpetaFuente\*.svg" | Sort-Object Name) {
  $interior = [regex]::Match((Get-Content $fichero.FullName -Raw), '(?s)<svg[^>]*>(.*)</svg>').Groups[1].Value.Trim()
  $partes.Add('<symbol id="i-' + $fichero.BaseName + '" viewBox="0 0 24 24">' + [regex]::Replace($interior, '\s+', ' ') + '</symbol>')
}

$partes.Add('</svg>')
Set-Content -Path $destino -Value ($partes -join "`n") -Encoding UTF8
Write-Host "Sprite generado: $destino ($((Get-Item $destino).Length) bytes, $($iconos.Count) iconos)"

