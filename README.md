# WebAppMaternidad

Aplicación desarrollada en ASP.NET Core (.NET 7)

---

## 📋 Requisitos

- Windows x64
- .NET SDK 7.x instalado
- ASP.NET Core Runtime 7.x instalado

Verificar instalación:

dotnet --list-sdks  
dotnet --list-runtimes  

Debe existir:

- Microsoft.AspNetCore.App 7.0.xx  
- Microsoft.NETCore.App 7.0.xx  

---

## 🚀 Ejecutar el Proyecto

1️⃣ Ir a la carpeta del proyecto:

cd D:\Proyectos\Web\sihcemgp-main  

2️⃣ Restaurar dependencias:

dotnet restore  

3️⃣ Compilar:

dotnet build  

4️⃣ Ejecutar el proyecto (forma recomendada):

dotnet run --project WebAppMaternidad.csproj  

5  Ejecutar el proyecto (forma recomendada):

dotnet watch run --project WebAppMaternidad.csproj


La aplicación iniciará en:

- http://localhost:5000  
- https://localhost:5001  

---

## 🔐 Problema con certificado HTTPS

Si aparece error de certificado:

dotnet dev-certs https --trust  

Ejecutar solo una vez.

---

## 🧹 Limpieza completa del proyecto

Si existen errores por caché o binarios antiguos:

dotnet clean  
dotnet nuget locals all --clear  
dotnet restore  
dotnet build  

---

## 🏗 Publicar para Producción

dotnet publish -c Release -o ./publish  

La carpeta publish contiene los archivos listos para desplegar en:

- IIS (requiere Hosting Bundle .NET 7)  
- Servidor Windows  
- Servidor Linux  

---

## ▶ Ejecutar el ejecutable directamente

.\bin\Debug\net7.0\WebAppMaternidad.exe  

---

## ⚙ Forzar versión de SDK (Opcional)

Si existen múltiples SDK instalados:

dotnet new globaljson --sdk-version 7.0.400  

---

## 📌 Información Técnica

- TargetFramework: net7.0  
- Requiere Microsoft.AspNetCore.App 7.0.x  
- Compatible con SDK 7 y 8  
- Entorno por defecto: Development  