using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Microsoft.Build.Framework;
using Microsoft.Extensions.Logging;
using WebAppMaternidad.Context.Reportes.Domain;

namespace WebAppMaternidad.Context.Reportes.Application
{
    public class EstadoCuentaReportExcelService : IEstadoCuentaReportExcelService
    {
        private readonly IExcelReporter _excelReporter;
        private readonly IExcelReportService _excelReportService;
        private readonly ILogger<EstadoCuentaReportExcelService> _logger;

        public EstadoCuentaReportExcelService(IExcelReporter excelReporter, IExcelReportService excelReportService, ILogger<EstadoCuentaReportExcelService> logger)
        {
            _excelReporter = excelReporter;
            _excelReportService = excelReportService;
            _logger = logger;

        }

        public async Task GenerarEstadoCuentaExcelAsync(string ip, string plantilla, DataSet dataSet, List<DatosCabeceraReporte> cabeceras, ModeloReporte modeloReporte)
        {
            try
            {
                var ruta = _excelReporter.ExportExcelReport(plantilla, dataSet, cabeceras, modeloReporte);
                if (ruta != null)
                {
                    await _excelReportService.CopiarYRegistrarRutaAsync(ip, ruta);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al generar el Excel para la cuenta.");
                throw; // re-lanzas si quieres que IIS registre el 500 también
            }

        }

    }
}