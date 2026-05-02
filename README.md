# WebAppMaternidad

Aplicación desarrollada en ASP.NET Core (.NET 7)

---

## Requisitos

- Windows x64
- .NET SDK 7.x instalado
- ASP.NET Core Runtime 7.x instalado
- Proyecto configurado para `net7.0` (`WebAppMaternidad.csproj`)

### Si `dotnet` no se reconoce (configuración inicial)

1. Instalar **.NET SDK 7.x (x64)** desde la web oficial:  
   https://dotnet.microsoft.com/download/dotnet/7.0
2. Cerrar y volver a abrir VS Code (o reiniciar la PC) para actualizar variables de entorno.
3. Verificar la instalación en una terminal nueva:

```bash
dotnet --info
dotnet --list-sdks
dotnet --list-runtimes
```

Verificar instalación:

```bash
dotnet --list-sdks
dotnet --list-runtimes
```

Debe existir:

- Microsoft.AspNetCore.App 7.0.xx
- Microsoft.NETCore.App 7.0.xx

---

## Ejecutar el Proyecto

1. Ir a la carpeta del proyecto:

```bash
cd <ruta-del-proyecto>\sihcemgp
```

2. Restaurar dependencias:

```bash
dotnet restore
```

3. Compilar:

```bash
dotnet build
```

4. Ejecutar el proyecto (forma recomendada):

```bash
dotnet run --project WebAppMaternidad.csproj
```

5. Ejecutar el proyecto en modo observación:

```bash
dotnet watch run --project WebAppMaternidad.csproj
```

La aplicación iniciará en:

- http://localhost:5000
- https://localhost:5001

---

## Problema con CORS (desarrollo local)

Si aparece error de CORS al comunicarse con servicios externos (ej. FirmaDigital en `localhost:9091`), abrir Edge con seguridad web deshabilitada.

### Crear acceso directo en Windows

1. Clic derecho en el escritorio → **Nuevo → Acceso directo**
2. En "Escriba la ubicación del elemento", pegar:

```
"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --disable-web-security --user-data-dir="C:\edge_dev" --allow-insecure-localhost --allow-running-insecure-content
```

3. Clic en **Siguiente**, asignar un nombre (ej. `Edge Dev CORS`) → **Finalizar**
4. Doble clic en el acceso directo para abrir Edge con CORS y Mixed Content deshabilitado

> **Nota:** El flag `--allow-running-insecure-content` es necesario cuando la app corre en HTTPS (`localhost:5001`) pero consume recursos desde HTTP (ej. servidor de archivos `http://34.16.x.x:8086`). Sin este flag Edge bloquea los recursos y jQuery puede fallar al cargar.
>
> **Solo usar en desarrollo.** No navegar sitios externos con este modo activado.

---

## Problema con certificado HTTPS

Si aparece error de certificado:

```bash
dotnet dev-certs https --trust
```

Ejecutar solo una vez.

---

## Limpieza completa del proyecto

Si existen errores por caché o binarios antiguos:

```bash
dotnet clean
dotnet nuget locals all --clear
dotnet restore
dotnet build
```

---

## Publicar para Producción

```bash
dotnet publish -c Release -o ./publish
```

La carpeta `publish` contiene los archivos listos para desplegar en:

- IIS (requiere Hosting Bundle .NET 7)
- Servidor Windows
- Servidor Linux

---

## Ejecutar el ejecutable directamente

```powershell
.\bin\Debug\net7.0\WebAppMaternidad.exe
```

---

## Forzar versión de SDK (Opcional)

Si existen múltiples SDK instalados:

```bash
dotnet new globaljson --sdk-version 7.0.400
```

---

## Información Técnica

- TargetFramework: net7.0
- Requiere Microsoft.AspNetCore.App 7.0.x
- Compatible con SDK 7 y 8
- Entorno por defecto: Development

---

## Manual de instalación de DNIe 3.0 para firma digital

Referencia oficial RENIEC:

- Web de descarga de programas: https://serviciosportal.reniec.gob.pe/portalciudadano/
- Manual de instalación (DNIe versión 3): https://identidad.reniec.gob.pe/documents/d/guest/guia_dnie_version3

### Sistemas operativos soportados

- Windows 10
- Windows 11

### Paso a paso (resumen oficial)

1. Descargue el instalador del controlador DNIe v3 desde el portal de RENIEC.
2. Extraiga el archivo descargado (`Extraer todo`).
3. Abra la carpeta descomprimida y ejecute el instalador según su arquitectura (`32 bits` o `64 bits`).
4. Durante la instalación, acepte los mensajes emergentes (`Aceptar` / `Sí`) y permita reinicio si el sistema lo solicita.
5. Conecte el lector SmartCard e inserte el DNIe. Cuando se solicite, ingrese el numero CAN (impreso en el DNIe).
6. Verifique certificados en Windows:
   - Presione `Windows + R`
   - Ejecute `certmgr.msc`
   - Revise en `Personal > Certificados` que existan certificados con siglas `FIR` (firma digital) y `AUT` (autenticación).
7. Para prueba de firma digital, instale/abra Firma Perú y firme un PDF:
   - https://apps.firmaperu.gob.pe/web/firmador.xhtml

### Recomendaciones y soporte

- Use lector de tarjetas compatible con ISO 7816.
- Verifique que el DNIe este insertado correctamente (chip hacia arriba, segun su lector).
- Si no aparecen certificados, reinstale drivers del lector y repita la lectura.
- Soporte RENIEC para incidencias de identidad digital: `identidaddigital@reniec.gob.pe`.
