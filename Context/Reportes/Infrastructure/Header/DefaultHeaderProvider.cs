using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using iText.Layout;
using iText.Layout.Element;
using WebAppMaternidad.Context.Reportes.Domain;

namespace WebAppMaternidad.Context.Reportes.Infrastructure.Header
{
    public class DefaultHeaderProvider : IHeaderProvider
    {
        public bool CanHandle(TipoReporte tipoReporte) => tipoReporte == TipoReporte.EstadoCuenta;
        public void AddHeader(Document document, int modeloReporte, DatosCabeceraReporte cabeceraReporte)
        {
            document.Add(new Paragraph("📄 Reporte General")
                         .SetBold()
                         .SetFontSize(11));
        }
        public void RemoveHandler(Document document)
        {
            // No specific handler to remove in the default case
        }
    }
}