using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using WebAppMaternidad.Context.Reportes.Application.Factories;
using WebAppMaternidad.Context.Reportes.Domain;

namespace WebAppMaternidad.Context.Reportes.Infrastructure
{
    public class ExcelExporter : IExcelReporter
    {
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly ExcelReportFactory _factory;

        public ExcelExporter(IWebHostEnvironment hostingEnvironment, ExcelReportFactory factory)
        {
            _hostingEnvironment = hostingEnvironment;
            _factory = factory;
        }

        public string ExportExcelReport(string plantilla, DataSet dataSet, List<DatosCabeceraReporte> cabeceras, ModeloReporte modeloReporte)
        {


            string pathTemplate = Path.Combine(_hostingEnvironment.WebRootPath, plantilla);

            using var workbook = new XLWorkbook(pathTemplate);
            var ws = workbook.Worksheets.First();

            // 🔹 Delegar al generador correcto
            var generator = _factory.GetGenerator(modeloReporte);
            generator.Generar(ws, dataSet, cabeceras);

            // 🔹 Guardar
            var AppNameIp1 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:IpPrivada");
            string IpPrivada = AppNameIp1.ToString();

            string carpetaDestino = $"\\\\{IpPrivada}\\SisgalenFiles\\ExcelFiles";
            string nombreArchivo = $"EstadoCuenta_{modeloReporte}_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx";
            string rutaArchivo = Path.Combine(carpetaDestino, nombreArchivo);

            workbook.SaveAs(rutaArchivo);
            return rutaArchivo;


        }

    }
}