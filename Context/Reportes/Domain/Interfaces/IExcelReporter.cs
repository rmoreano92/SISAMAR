using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppMaternidad.Context.Reportes.Domain
{
    public interface IExcelReporter
    {
        string ExportExcelReport(string plantilla, DataSet dataSet, List<DatosCabeceraReporte> cabeceras, ModeloReporte modeloReporte);
    }
}