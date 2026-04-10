using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using iText.Layout;

namespace WebAppMaternidad.Context.Reportes.Domain
{
    public interface IHeaderProvider
    {
        bool CanHandle(TipoReporte tipoReporte);
        void AddHeader(Document document, int modeloReporte, DatosCabeceraReporte cabeceraReporte);
        void RemoveHandler(Document document);
    }
}