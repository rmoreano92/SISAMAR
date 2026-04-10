using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using ClosedXML.Excel;

namespace WebAppMaternidad.Context.Reportes.Domain.Interfaces
{
    public interface IExcelReportGenerator
    {
        void Generar(IXLWorksheet worksheet, DataSet dataSet, List<DatosCabeceraReporte> cabecera);
    }
}