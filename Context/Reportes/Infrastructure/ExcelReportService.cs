using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Build.Framework;
using Microsoft.Extensions.Logging;
using WebAppMaternidad.Context.Reportes.Domain;

namespace WebAppMaternidad.Context.Reportes.Infrastructure
{
    public class ExcelReportService : IExcelReportService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<ExcelReportService> _logger;

        public ExcelReportService(HttpClient httpClient, ILogger<ExcelReportService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task CopiarYRegistrarRutaAsync(string ip, string filePath)
        {
            try
            {
                _logger.LogInformation("Iniciando generación de Excel. IP={Ip}, filePath={filePath}", ip, filePath);

                if (ip == "::1" || string.IsNullOrEmpty(ip))
                {
                    ip = "localhost";
                }
                var response = await _httpClient.PostAsJsonAsync(
                    $"http://{ip}:55000/api/EstadoCuenta/AbrirReporteExcel",
                    new { filePath });

                response.EnsureSuccessStatusCode();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al generar el Excel para la cuenta.");
                throw; // re-lanzas si quieres que IIS registre el 500 también
            }
        }
    }
}