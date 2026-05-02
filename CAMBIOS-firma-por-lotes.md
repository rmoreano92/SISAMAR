# Cambios — rama `feature/firma-por-lotes`

## Objetivo

Reemplazar el flujo de firma por lote basado en 7zip/paquetes por el nuevo flujo directo de **Firma Perú**, enviando los PDFs individuales al invoker externo sin necesidad de empaquetar archivos.

---

## Resumen de archivos

### Archivos modificados

| Archivo | Qué cambió |
|---|---|
| `Areas/Comun/FirmaDigitalController.cs` | Nuevo action `FirmaDigitalLoteFirmaPeru` |
| `Views/Comun/FirmaPeru/FirmaDigitalFirmaPeru.cshtml` | Agregado bloque `firmaCodesJson` |
| `wwwroot/js/Comun/FirmaDigitalFirmaPeru.js` | `SubirFirmados` con soporte multi-documento |
| `wwwroot/js/Comun/Utilitarios.js` | Nueva función `IniciarServicioFirmaLoteFirmaPeru` |
| `wwwroot/js/ConsultaExterna/RegistroAtencion.js` | 4 botones migrados al nuevo flujo |
| `README.md` | Documentación Edge / CORS |

### Archivos nuevos

| Archivo | Descripción |
|---|---|
| `Views/Comun/FirmaPeru/FirmaDigitalFirmaPeru.cshtml` | Vista del proceso de firma (individual y lote) |
| `Views/Comun/FirmaPeru/FinFirmaDigitalFirmaPeru.cshtml` | Vista de fin del proceso de firma |
| `wwwroot/js/Comun/FirmaDigitalFirmaPeru.js` | Lógica JS del flujo FirmaPeru |
| `wwwroot/js/Comun/FirmaDigitalBit4id.js` | Lógica JS firma Bit4Id individual |
| `wwwroot/js/Comun/FirmaDigitalMultipleBit4id.js` | Lógica JS firma Bit4Id múltiple |
| `wwwroot/lib/firmaperu.js` | Librería cliente del invoker FirmaPeru |

---

## Detalle de cambios

### 1. `Areas/Comun/FirmaDigitalController.cs`

**Nuevo action `FirmaDigitalLoteFirmaPeru`** (`GET`)

- Recibe `server`, `cuentasAtencion` y `tipos` por querystring.
- Llama al SP `web_FirmaDigitalGenerarPaquete` para obtener los documentos del lote.
- Filtra solo documentos con `statusFirma == 0` (pendientes de firma); si no hay ninguno retorna error JSON.
- Extrae la ruta relativa del PDF desde el campo `rutaArchivoOriginal` buscando los marcadores `/UNSIGNED/` o `/SIGNED/` en la ruta absoluta del servidor de archivos.
- Construye la URL pública de cada PDF combinando `server` (parámetro `PathServerFiles`) + ruta relativa.
- Serializa en `ViewBag` los arrays `pdfsJson` y `firmaCodesJson` (mapeo `nombre → codeFirma` por documento).
- Renderiza la vista `FirmaDigitalFirmaPeru.cshtml` reutilizando el mismo flujo que la firma individual.

> **Nota de producción:** La URL de los PDFs usa `server.TrimEnd('/') + rutaRelativa`. El valor de `PathServerFiles` debe ser una IP o dominio público accesible desde el invoker externo (`http://34.16.116.115:9091`). Para pruebas locales se puede comentar esa línea y descomentar la URL estática en el código.

---

### 2. `Views/Comun/FirmaPeru/FirmaDigitalFirmaPeru.cshtml`

- Agregado el bloque `<script id="firmaCodesJson" type="application/json">` para exponer el mapeo `nombre → codeFirma` al JavaScript del lado cliente.

---

### 3. `wwwroot/js/Comun/FirmaDigitalFirmaPeru.js`

**Función `SubirFirmados` — soporte para firma por lote**

- Antes: solo subía el primer PDF usando `nroFirma` como ID.
- Ahora: si existe el elemento `firmaCodesJson` con datos, itera cada documento firmado y lo sube individualmente al endpoint `/api/UploadFileFirmaPeru/0` usando el `codeFirma` específico de cada uno.
- El flujo de firma individual (con `nroFirma`) se mantiene como fallback para compatibilidad.

---

### 4. `wwwroot/js/Comun/Utilitarios.js`

**Nueva función `IniciarServicioFirmaLoteFirmaPeru(cuentasAtencion, tipos)`**

- Construye la URL hacia `FirmaDigitalLoteFirmaPeru` con los parámetros `server`, `cuentasAtencion` y `tipos`.
- Abre el modal `#modalFirmaDigital` y carga la URL en el iframe.
- Reemplaza la lógica anterior que llamaba a `CrearPaqueteArchivos7zip` + `IniciarServicioFirmaMultipleFirmaPeru`.

---

### 5. `wwwroot/js/ConsultaExterna/RegistroAtencion.js`

Actualizados los 4 botones de firma para usar el nuevo flujo cuando `permisoFirmaDigital == 2`:

| Botón | Antes | Ahora | Tipos |
|---|---|---|---|
| `#btnFirmaAtencion` | `CrearPaqueteArchivos7zip` + `IniciarServicioFirmaMultipleFirmaPeru` | `IniciarServicioFirmaLoteFirmaPeru` | `'CE-A','REC','RF','CRF','FUA'` |
| `#btnFirmaLote` | `CrearPaqueteArchivos7zip` + `IniciarServicioFirmaMultipleFirmaPeru` | `IniciarServicioFirmaLoteFirmaPeru` | `'CE-A','REC','RF','CRF','FUA'` |
| `#btnFirmaLoteAtenciones` | `CrearPaqueteArchivos7zip` + `IniciarServicioFirmaMultipleFirmaPeru` | `IniciarServicioFirmaLoteFirmaPeru` | `'CE-A'` |
| `#btnFirmaLoteOtros` | `CrearPaqueteArchivos7zip` + `IniciarServicioFirmaMultipleFirmaPeru` | `IniciarServicioFirmaLoteFirmaPeru` | `'REC','RF','CRF','FUA'` |

---

## Flujo nuevo resumido

```
Click botón
  └─► IniciarServicioFirmaLoteFirmaPeru(cuentasAtencion, tipos)   [Utilitarios.js]
        └─► GET /FirmaDigital/FirmaDigitalLoteFirmaPeru            [Controller]
              └─► SP web_FirmaDigitalGenerarPaquete
              └─► Filtrar statusFirma == 0
              └─► Construir URLs de PDFs
              └─► Renderizar FirmaDigitalFirmaPeru.cshtml
                    └─► FirmaPeruDigital.Iniciar()                 [FirmaDigitalFirmaPeru.js]
                          └─► ObtenerToken()
                          └─► firma.ejecutar(pdfs, params, token)  → invoker externo
                          └─► SubirFirmados()                      → /api/UploadFileFirmaPeru/0 (uno por documento)
                          └─► ProcesoFirmaModificar(2)
                          └─► CerrarFlujo()
```

---

## Pendiente para producción

- Verificar que `PathServerFiles` (variable JS en el layout) apunte a una IP/dominio público accesible desde el invoker externo `34.16.116.115:9091`.
- Validar el flujo completo: PIN → firma → subida al backend → cierre del modal.
