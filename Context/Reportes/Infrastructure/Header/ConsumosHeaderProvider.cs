using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using iText.Layout;
using iText.Layout.Element;
using WebAppMaternidad.Context.Reportes.Domain;

namespace WebAppMaternidad.Context.Reportes.Infrastructure.Header
{
    public class ConsumosHeaderProvider : IHeaderProvider
    {
        public bool CanHandle(TipoReporte tipoReporte) => tipoReporte == TipoReporte.EstadoCuenta;
        public void AddHeader(Document document, int modeloReporte, DatosCabeceraReporte cabeceraReporte)
        {
            var headerTable = new Table(1).UseAllAvailableWidth();
            headerTable.AddCell(new Cell().Add(new Paragraph("📊 Reporte de Consumos"))
                                          .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER)
                                          .SetBold()
                                          .SetFontSize(12)
                                          .SetBorder(iText.Layout.Borders.Border.NO_BORDER));

            document.Add(headerTable);
        }
        public void RemoveHandler(Document document)
        {
            // No specific handler to remove in this case
        }
    }
}