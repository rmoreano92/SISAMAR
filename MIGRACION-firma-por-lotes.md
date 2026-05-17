# Migración de Firma por Lotes — Eliminación del flujo 7z

## Resumen

Se eliminó la dependencia del archivo `temp.7z` en todos los módulos que usaban el flujo intermedio de firma digital bajo `permisoFirmaDigital == 2` (Firma Perú). Todos los módulos migrados ahora envían los PDFs individualmente al invoker (puerto 9091), sin pasar por el servidor de archivos (puerto 8086) ni generar archivos temporales.

## Contenido

- [Contexto — los 3 flujos que coexistían antes](#contexto-flujos-que-coexistían-antes-de-la-migración)
- [Cambios de infraestructura — controller C# y Utilitarios.js con código antes/después](#cambios-de-infraestructura)
- Módulos migrados agrupados en 3 categorías:
  - [Grupo A (3 archivos): clave por `idCuentaAtencion` — Hospitalización, Emergencia, Visor Recetas](#grupo-a--cuentasatencion-como-clave-primaria)
  - [Grupo B (6 archivos): clave por registro específico — Laboratorio, Imagenología, Medicina Reproductiva, Riesgo Social, Constancia RN x2](#grupo-b--registros-como-clave-primaria)
  - [Grupo C (4 archivos): evaluaciones individuales con `idServicio` — Neonatal Hosp, GinecoObstetra Hosp, Neonatal Emerg, Especialidades](#grupo-c--evaluaciones-individuales-idservicio-como-discriminador)
- [Tabla resumen de todos los archivos y botones migrados](#resumen-de-archivos-modificados)
- [Corrección: mensaje "Sin documentos" mostraba JSON en bruto dentro del modal](#corrección-mensaje-sin-documentos-dentro-del-modal)
- [Lo que no se modificó — flujo Bit4Id y funciones legacy conservadas sin llamadores activos](#lo-que-no-se-modificó)

---

## Contexto: flujos que coexistían antes de la migración

| Flujo | Función JS | Función Backend | Descripción |
|-------|-----------|----------------|-------------|
| **Nuevo (correcto)** | `IniciarServicioFirmaLoteFirmaPeru` | `FirmaDigitalLoteFirmaPeru` | PDFs individuales al invoker 9091, sin 7z |
| **Intermedio (migrado)** | `CrearPaqueteArchivos7zip` → `IniciarServicioFirmaMultipleFirmaPeru` | `CrearPaqueteArchivos7zip` → `FirmaDigitalMultipleFirmaPeru` | Genera `temp.7z` en servidor de archivos 8086 |
| **Legacy Bit4Id (sin cambios)** | `CrearPaqueteArchivos` → `AbrirServicioFirmaBit4IdMultiple` | `CrearPaqueteArchivos` | Solo bajo `permisoFirmaDigital == 1`, sin tocar |

---

## Cambios de infraestructura

### `Areas/Comun/FirmaDigitalController.cs`

Se agregó el parámetro opcional `registros` a la acción `FirmaDigitalLoteFirmaPeru` para soportar módulos que usan un ID de registro (movimiento, orden, evaluación) en lugar de `idCuentaAtencion`.

```csharp
// ANTES
public async Task<IActionResult> FirmaDigitalLoteFirmaPeru(string server, string cuentasAtencion, string tipos)
    ...
    string nombrePaquete = await dalFirma.FirmaDigitalGenerarPaquete(cuentasAtencion, "", tipos, idUsuario);

// DESPUÉS
public async Task<IActionResult> FirmaDigitalLoteFirmaPeru(string server, string cuentasAtencion, string tipos, string registros = "")
    ...
    string nombrePaquete = await dalFirma.FirmaDigitalGenerarPaquete(cuentasAtencion, registros, tipos, idUsuario);
```

### `wwwroot/js/Comun/Utilitarios.js`

Se extendió `IniciarServicioFirmaLoteFirmaPeru` con el parámetro opcional `registros`.

```js
// ANTES
async IniciarServicioFirmaLoteFirmaPeru(cuentasAtencion, tipos) {
    let ruta = '/FirmaDigital/FirmaDigitalLoteFirmaPeru?server=...'
        + '&cuentasAtencion=' + encodeURIComponent(cuentasParam)
        + '&tipos=' + encodeURIComponent(tipos);

// DESPUÉS
async IniciarServicioFirmaLoteFirmaPeru(cuentasAtencion, tipos, registros = '') {
    let ruta = '/FirmaDigital/FirmaDigitalLoteFirmaPeru?server=...'
        + '&cuentasAtencion=' + encodeURIComponent(cuentasParam)
        + '&tipos=' + encodeURIComponent(tipos);
    if (registros !== '' && registros !== null && registros !== undefined) {
        const regParam = Array.isArray(registros) ? registros.join(',') : registros;
        ruta += '&registros=' + encodeURIComponent(regParam);
    }
```

---

## Módulos migrados

### Grupo A — `cuentasAtencion` como clave primaria

Módulos que firman por la cuenta de atención (`idCuentaAtencion`). Llamada: `IniciarServicioFirmaLoteFirmaPeru(cuentasAtencion, tipos)`.

#### `wwwroot/js/Hospitalizacion/AdmisionHospitalizacion.js`

- **Botón `#btnFirmaAtencion`** — firma una sola fila seleccionada
- **Botón `#btnFirmaLote`** — firma todas las cuentas seleccionadas en la tabla
- Tipos: `'E-EVA','REC','RF','CRF','FUA'`

```js
// ANTES (permisoFirmaDigital == 2)
const paquete = await Utilitario.CrearPaqueteArchivos7zip(cuentasAtencion, '', "'E-EVA','REC','RF', 'CRF','FUA'");
if (!isEmpty(paquete)) {
    await Utilitario.IniciarServicioFirmaMultipleFirmaPeru(paquete.data);
}

// DESPUÉS
await Utilitario.IniciarServicioFirmaLoteFirmaPeru(cuentasAtencion, "'E-EVA','REC','RF', 'CRF','FUA'");
```

---

#### `wwwroot/js/Emergencia/AdmisionEmergencia.js`

- **Botón `#btnFirmaAtencion`** — firma una sola fila seleccionada
- **Botón `#btnFirmaLote`** — firma todas las cuentas seleccionadas en la tabla
- Tipos: `'E-EVA','REC','RF','CRF','FUA'`

```js
// ANTES (permisoFirmaDigital == 2)
const paquete = await Utilitario.CrearPaqueteArchivos7zip(cuentasAtencion, '', "'E-EVA','REC','RF', 'CRF','FUA'");
if (!isEmpty(paquete)) {
    await Utilitario.IniciarServicioFirmaMultipleFirmaPeru(paquete.data);
}

// DESPUÉS
await Utilitario.IniciarServicioFirmaLoteFirmaPeru(cuentasAtencion, "'E-EVA','REC','RF', 'CRF','FUA'");
```

---

#### `wwwroot/js/VistasParciales/Recetas/VisorRecetas.js`

- **Botón `#btnFirmaRecetaPorLote`** — firma recetas de la cuenta actual
- Tipos: `'REC'`

```js
// ANTES (permisoFirmaDigital == 2)
const paquete = await Utilitario.CrearPaqueteArchivos7zip(Variables.IdCuentaAtencion, '', "'REC'");
if (!isEmpty(paquete)) {
    await Utilitario.IniciarServicioFirmaMultipleFirmaPeru(paquete.data);
}

// DESPUÉS
await Utilitario.IniciarServicioFirmaLoteFirmaPeru(Variables.IdCuentaAtencion, "'REC'");
```

---

### Grupo B — Registros como clave primaria

Módulos que firman por ID de registro específico (movimiento, orden, evaluación). La cuenta de atención va vacía; el registro se pasa como tercer parámetro. Llamada: `IniciarServicioFirmaLoteFirmaPeru('', tipos, registros)`.

#### `wwwroot/js/Laboratorio/Laboratorio.js`

- **Botón `#btnFirmaMovimiento`** — firma un movimiento individual seleccionado
- **Botón `#btnFirmaLote`** — firma múltiples movimientos seleccionados
- Registros: `idMovimiento` | Tipos: `'LAB-RES','LAB-RES-GRUPO'`

```js
// ANTES (permisoFirmaDigital == 2)
const paquete = await Utilitario.CrearPaqueteArchivos7zip('', numMovimientos, "'LAB-RES','LAB-RES-GRUPO'");
if (!isEmpty(paquete)) {
    await Utilitario.IniciarServicioFirmaMultipleFirmaPeru(paquete.data);
}

// DESPUÉS
await Utilitario.IniciarServicioFirmaLoteFirmaPeru('', "'LAB-RES','LAB-RES-GRUPO'", numMovimientos);
```

---

#### `wwwroot/js/Imagenologia/Imagenologia.js`

- **Botón `#btnFirmaMovimiento`** — firma un movimiento individual seleccionado
- **Botón `#btnFirmaLote`** — firma múltiples movimientos seleccionados
- Registros: `idMovimiento` | Tipos: `'IMG-RES','IMG-RES-GRUPO'`

```js
// ANTES (permisoFirmaDigital == 2)
const paquete = await Utilitario.CrearPaqueteArchivos7zip('', numMovimientos, "'IMG-RES','IMG-RES-GRUPO'");
if (!isEmpty(paquete)) {
    await Utilitario.IniciarServicioFirmaMultipleFirmaPeru(paquete.data);
}

// DESPUÉS
await Utilitario.IniciarServicioFirmaLoteFirmaPeru('', "'IMG-RES','IMG-RES-GRUPO'", numMovimientos);
```

---

#### `wwwroot/js/Laboratorio/MedicinaReproductiva.js`

- **Botón `#btnFirmaLote`** — firma múltiples órdenes seleccionadas
- Registros: `idOrden` | Tipos: `'MED-REPRO'`

```js
// ANTES (permisoFirmaDigital == 2)
const paquete = await Utilitario.CrearPaqueteArchivos7zip('', numOrdenes, "'MED-REPRO'");
if (!isEmpty(paquete)) {
    await Utilitario.IniciarServicioFirmaMultipleFirmaPeru(paquete.data);
}

// DESPUÉS
await Utilitario.IniciarServicioFirmaLoteFirmaPeru('', "'MED-REPRO'", numOrdenes);
```

---

#### `wwwroot/js/Facturacion/EvaluacionRiesgoSocial.js`

- **Botón `#btnFirmaLote`** — firma múltiples evaluaciones seleccionadas
- Registros: `nroEvaluacion` | Tipos: `'INF-RS'`

```js
// ANTES (permisoFirmaDigital == 2)
const paquete = await Utilitario.CrearPaqueteArchivos7zip('', numOrdenes, "'INF-RS'");
if (!isEmpty(paquete)) {
    await Utilitario.IniciarServicioFirmaMultipleFirmaPeru(paquete.data);
}

// DESPUÉS
await Utilitario.IniciarServicioFirmaLoteFirmaPeru('', "'INF-RS'", numOrdenes);
```

---

#### `wwwroot/js/Estadistica/ConstanciaRN.js`

- **Botón `#btnFirmaLote`** — firma múltiples constancias seleccionadas
- Registros: `idConstancia` | Tipos: `'CN'`

```js
// ANTES (permisoFirmaDigital == 2)
const paquete = await Utilitario.CrearPaqueteArchivos7zip('', numConstancia, "'CN'");
if (!isEmpty(paquete)) {
    await Utilitario.IniciarServicioFirmaMultipleFirmaPeru(paquete.data);
}

// DESPUÉS
await Utilitario.IniciarServicioFirmaLoteFirmaPeru('', "'CN'", numConstancia);
```

---

#### `wwwroot/js/Estadistica/SolicitudConstanciaRn.js`

- **Botón `#btnFirmaLote`** — firma múltiples constancias seleccionadas
- Registros: `idConstancia` | Tipos: `'CN'`

```js
// ANTES (permisoFirmaDigital == 2)
const paquete = await Utilitario.CrearPaqueteArchivos7zip('', numConstancia, "'CN'");
if (!isEmpty(paquete)) {
    await Utilitario.IniciarServicioFirmaMultipleFirmaPeru(paquete.data);
}

// DESPUÉS
await Utilitario.IniciarServicioFirmaLoteFirmaPeru('', "'CN'", numConstancia);
```

---

### Grupo C — Evaluaciones individuales (idServicio como discriminador)

Módulos que firman una sola evaluación clínica. El SP recibe `(idCuentaAtencion, nroEvaluacion, idServicio)` como clave compuesta. Llamada: `IniciarServicioFirmaLoteFirmaPeru(idCuentaAtencion, idServicio, nroEvaluacion)`.

#### `wwwroot/js/Hospitalizacion/EvaluacionNeonatalHosp.js`

- **Botón `#FirmarEvalEmer`** — firma la evaluación neonatal seleccionada

```js
// ANTES (permisoFirmaDigital == 2)
const paquete = await Utilitario.CrearPaqueteArchivos7zip(Variables.IdCuentaAtencion, EvaluacionDetalle.IdNumero, EvaluacionDetalle.IdServicio);
if (!isEmpty(paquete)) {
    await Utilitario.IniciarServicioFirmaMultipleFirmaPeru(paquete.data);
}

// DESPUÉS
await Utilitario.IniciarServicioFirmaLoteFirmaPeru(Variables.IdCuentaAtencion, EvaluacionDetalle.IdServicio, EvaluacionDetalle.IdNumero);
```

---

#### `wwwroot/js/Hospitalizacion/EvaluacionGinecoObstetraHosp.js`

- **Botón `#FirmarEvalEmer`** — firma la evaluación gineco-obstétrica seleccionada

```js
// ANTES (permisoFirmaDigital == 2)
const paquete = await Utilitario.CrearPaqueteArchivos7zip(Variables.IdCuentaAtencion, EvaluacionGinecoObstetra.nroEvaluacion, Variables.IdServicioIngreso);
if (!isEmpty(paquete)) {
    await Utilitario.IniciarServicioFirmaMultipleFirmaPeru(paquete.data);
}

// DESPUÉS
await Utilitario.IniciarServicioFirmaLoteFirmaPeru(Variables.IdCuentaAtencion, Variables.IdServicioIngreso, EvaluacionGinecoObstetra.nroEvaluacion);
```

---

#### `wwwroot/js/Emergencia/EvaluacionNeonatal.js`

- **Botón `#FirmarEvalEmer`** — firma la evaluación neonatal seleccionada (módulo Emergencia)

```js
// ANTES (permisoFirmaDigital == 2)
const paquete = await Utilitario.CrearPaqueteArchivos7zip(Variables.IdCuentaAtencion, EvaluacionDetalle.IdNumero, EvaluacionDetalle.IdServicio);
if (!isEmpty(paquete)) {
    await Utilitario.IniciarServicioFirmaMultipleFirmaPeru(paquete.data);
}

// DESPUÉS
await Utilitario.IniciarServicioFirmaLoteFirmaPeru(Variables.IdCuentaAtencion, EvaluacionDetalle.IdServicio, EvaluacionDetalle.IdNumero);
```

---

#### `wwwroot/js/Emergencia/EvaluacionEspecialidades.js`

- **Botón `#FirmarEvalEmer`** — firma la evaluación de especialidades seleccionada

```js
// ANTES (permisoFirmaDigital == 2)
const paquete = await Utilitario.CrearPaqueteArchivos7zip(Variables.IdCuentaAtencion, EvaluacionNeonatal.nroEvaluacion, Variables.IdServicioIngreso);
if (!isEmpty(paquete)) {
    await Utilitario.IniciarServicioFirmaMultipleFirmaPeru(paquete.data);
}

// DESPUÉS
await Utilitario.IniciarServicioFirmaLoteFirmaPeru(Variables.IdCuentaAtencion, Variables.IdServicioIngreso, EvaluacionNeonatal.nroEvaluacion);
```

---

## Resumen de archivos modificados

| Archivo | Grupo | Botones migrados |
|---------|-------|-----------------|
| `Areas/Comun/FirmaDigitalController.cs` | Infraestructura | — |
| `wwwroot/js/Comun/Utilitarios.js` | Infraestructura | — |
| `wwwroot/js/Hospitalizacion/AdmisionHospitalizacion.js` | A | `#btnFirmaAtencion`, `#btnFirmaLote` |
| `wwwroot/js/Emergencia/AdmisionEmergencia.js` | A | `#btnFirmaAtencion`, `#btnFirmaLote` |
| `wwwroot/js/VistasParciales/Recetas/VisorRecetas.js` | A | `#btnFirmaRecetaPorLote` |
| `wwwroot/js/Laboratorio/Laboratorio.js` | B | `#btnFirmaMovimiento`, `#btnFirmaLote` |
| `wwwroot/js/Imagenologia/Imagenologia.js` | B | `#btnFirmaMovimiento`, `#btnFirmaLote` |
| `wwwroot/js/Laboratorio/MedicinaReproductiva.js` | B | `#btnFirmaLote` |
| `wwwroot/js/Facturacion/EvaluacionRiesgoSocial.js` | B | `#btnFirmaLote` |
| `wwwroot/js/Estadistica/ConstanciaRN.js` | B | `#btnFirmaLote` |
| `wwwroot/js/Estadistica/SolicitudConstanciaRn.js` | B | `#btnFirmaLote` |
| `wwwroot/js/Hospitalizacion/EvaluacionNeonatalHosp.js` | C | `#FirmarEvalEmer` |
| `wwwroot/js/Hospitalizacion/EvaluacionGinecoObstetraHosp.js` | C | `#FirmarEvalEmer` |
| `wwwroot/js/Emergencia/EvaluacionNeonatal.js` | C | `#FirmarEvalEmer` |
| `wwwroot/js/Emergencia/EvaluacionEspecialidades.js` | C | `#FirmarEvalEmer` |

## Corrección: mensaje "Sin documentos" dentro del modal

### Problema

Al hacer clic en cualquier botón de firma (ej. "Firmar Lote Otros") cuando no hay documentos pendientes, el modal mostraba el JSON en bruto directamente en el iframe:

```json
{"error":true,"msg":"No hay documentos pendientes de firma."}
```

Esto ocurría porque `FirmaDigitalLoteFirmaPeru` retornaba `Json(...)` en los casos de error, y el iframe simplemente renderizaba el texto sin procesarlo.

### Solución

Se creó la vista `Views/Comun/FirmaPeru/SinDocumentosFirmaPeru.cshtml` — una página HTML self-contained (sin layout) que al cargar cierra el modal automáticamente y dispara una alerta amigable en la ventana padre, usando el mismo patrón que `FinFirmaDigitalFirmaPeru.cshtml`.

Se reemplazaron los dos `return Json(...)` en `FirmaDigitalLoteFirmaPeru`:

```csharp
// ANTES
if (archivos.Tables[0].Rows.Count == 0)
    return Json(new { error = true, msg = "No hay documentos pendientes de firma." });

if (firstRow["statusFirma"].ToString() != "0")
    return Json(new { error = true, msg = "No hay documentos pendientes de firma." });

// DESPUÉS
if (archivos.Tables[0].Rows.Count == 0)
{
    ViewBag.Mensaje = "No hay documentos pendientes de firma.";
    return View("~/Views/Comun/FirmaPeru/SinDocumentosFirmaPeru.cshtml");
}

if (firstRow["statusFirma"].ToString() != "0")
{
    ViewBag.Mensaje = "No hay documentos pendientes de firma.";
    return View("~/Views/Comun/FirmaPeru/SinDocumentosFirmaPeru.cshtml");
}
```

Esta corrección aplica a todos los módulos migrados ya que comparten el mismo endpoint `FirmaDigitalLoteFirmaPeru`.

---

## Lo que no se modificó

- Todos los bloques `permisoFirmaDigital == 1` (Bit4Id legacy) — sin tocar en ningún módulo.
- La función `IniciarServicioFirmaMultipleFirmaPeru` y el endpoint `FirmaDigitalMultipleFirmaPeru` se conservan en el código (sin llamadores activos).
- La función `CrearPaqueteArchivos7zip` se conserva en el código (sin llamadores activos).
