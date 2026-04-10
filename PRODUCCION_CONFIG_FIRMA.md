# Configuracion Para Pasar A Produccion (Firma Digital)

Este documento resume que valores debes revisar antes de desplegar a produccion.

## 1) Variables en `appsettings.json`

Revisa la seccion `Configuraciones`:

- `UrlAppFiles`
  - Local: `http://192.168.0.101:5000`
  - Produccion: URL/IP real del file server (ejemplo: `http://34.16.116.115:8086`)

- `UrlAppSocket`
  - Local: URL socket local
  - Produccion: URL socket productiva

- `EnableLocalFileServer`
  - Local: `"true"`
  - Produccion: `"false"`

Revisa `ConnectionStrings`:

- `API_FIRMA_DIGITAL`
  - Debe apuntar al invoker/servicio de firma del ambiente productivo (o el valor oficial del entorno).

## 2) Startup

No necesitas nuevos cambios en `Startup.cs` para el pase a produccion.
Solo valida que `EnableLocalFileServer` este en `"false"` en prod.

## 3) Archivos JS de Firma

Verifica que existan en `wwwroot/lib`:

- `firmaperu.js`
- `addComponent.js`

## 4) Checklist rapido antes de deploy

1. `UrlAppFiles` apunta al file server productivo.
2. `UrlAppSocket` apunta al socket productivo.
3. `EnableLocalFileServer` esta en `"false"`.
4. `API_FIRMA_DIGITAL` apunta al endpoint correcto del entorno.
5. Reiniciar la aplicacion despues de cambiar configuracion.

## 5) Validacion post deploy

1. Abrir un PDF desde la URL final (`UrlAppFiles + rutaArchivo`).
2. Ejecutar una firma completa.
3. Confirmar:
   - se genera/sube PDF firmado,
   - se actualiza estado en BD,
   - cierra modal de firma y refresca tabla.
