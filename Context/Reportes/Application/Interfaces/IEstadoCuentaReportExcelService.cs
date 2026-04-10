using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppMaternidad.Context.Reportes.Domain
{
    public interface IEstadoCuentaReportExcelService
    {
        public Task GenerarEstadoCuentaExcelAsync(string ip, string plantilla, DataSet dataSet, List<DatosCabeceraReporte> cabeceras, ModeloReporte modeloReporte);
    }
}