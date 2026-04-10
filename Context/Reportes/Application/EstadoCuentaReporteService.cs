using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAppMaternidad.Context.Reportes.Domain;
using WebAppMaternidad.Context.Reportes.Infrastructure;

namespace WebAppMaternidad.Context.Reportes.Application
{
    public class EstadoCuentaReporteService
    {
        private readonly IGeneradorReporte _reporteGenerator;

        public EstadoCuentaReporteService(IGeneradorReporte reporteGenerator)
        {
            _reporteGenerator = reporteGenerator;
        }

        public async Task<byte[]> GenerarEstadoCuentaPdfAsync(string html, int modeloReporte, DatosCabeceraReporte cabeceraReporte)
        {
            bool landscape = (modeloReporte == 1 || modeloReporte == 3); // tu lógica
            return await _reporteGenerator.GenerarPdfAsync(html, TipoReporte.EstadoCuenta, modeloReporte, cabeceraReporte, landscape);
        }

        public async Task<byte[]> GenerarEstadoCuentaMultiplePdfAsync(List<BloqueReporte> reportes, bool landscape = false)
        {
            // bool landscape = (modeloReporte == 1 || modeloReporte == 3); // tu lógica
            return await _reporteGenerator.GenerarPdfMultipleAsync(reportes, landscape);
        }
    }
}