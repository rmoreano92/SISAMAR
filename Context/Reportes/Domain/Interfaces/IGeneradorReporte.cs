using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAppMaternidad.Context.Reportes.Domain;

namespace WebAppMaternidad.Context.Reportes
{
    public interface IGeneradorReporte
    {
        Task<byte[]> GenerarPdfAsync(string html, TipoReporte tipoReporte, int modeloReporte, DatosCabeceraReporte cabeceraReporte, bool landscape = false);
        Task<byte[]> GenerarPdfMultipleAsync(List<BloqueReporte> reportes, bool landscape = false);
    }
}