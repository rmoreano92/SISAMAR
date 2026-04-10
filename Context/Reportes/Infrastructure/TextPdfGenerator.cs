using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using iText.Html2pdf;
using iText.IO.Font;
using iText.IO.Font.Constants;
using iText.Kernel.Font;
using iText.Kernel.Geom;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Font;
using WebAppMaternidad.Context.Reportes.Domain;
using WebAppMaternidad.Context.Reportes.Infrastructure.Header;

namespace WebAppMaternidad.Context.Reportes.Infrastructure
{
    public class TextPdfGenerator : IGeneradorReporte
    {
        private readonly IEnumerable<IHeaderProvider> _headers;

        public TextPdfGenerator(IEnumerable<IHeaderProvider> headers)
        {
            _headers = headers;
        }
        public async Task<byte[]> GenerarPdfAsync(string html, TipoReporte tipoReporte, int modeloReporte, DatosCabeceraReporte cabeceraReporte, bool landscape = false)
        {

            var writerProperties = new WriterProperties()
                .SetFullCompressionMode(false) // desactiva compresión total
                .SetCompressionLevel(0);       // sin compresión (más rápido de imprimir)

            using var ms = new MemoryStream();
            using var writer = new PdfWriter(ms, writerProperties);
            using var pdf = new PdfDocument(writer);

            var pageSize = landscape ? PageSize.LETTER.Rotate() : PageSize.LETTER;

            // var pageSize = PageSize.LETTER;

            using var document = new Document(pdf, pageSize);



            var props = new ConverterProperties();

            PdfFont font = PdfFontFactory.CreateFont(StandardFonts.HELVETICA, PdfEncodings.WINANSI, PdfFontFactory.EmbeddingStrategy.PREFER_EMBEDDED);
            document.SetFont(font);
            // ✅ Agregar cabecera primero
            var headerProvider = _headers.First(h => h.CanHandle(tipoReporte));
            headerProvider.AddHeader(document, modeloReporte, cabeceraReporte);

            // ⚡ Convertir HTML → lista de elementos
            var elements = HtmlConverter.ConvertToElements(html, props);

            // ✅ Agregar cada elemento al documento
            // ✅ Agregar cada elemento al documento
            foreach (var element in elements)
            {
                if (element is IBlockElement block)
                {
                    document.Add(block);
                }
            }

            document.Close();
            return await Task.FromResult(ms.ToArray());
        }

        public async Task<byte[]> GenerarPdfMultipleAsync(
            List<BloqueReporte> reportes,
            bool landscape = false)
        {
            using var ms = new MemoryStream();
            using var writer = new PdfWriter(ms);
            using var pdf = new PdfDocument(writer);

            var pageSize = landscape ? PageSize.A4.Rotate() : PageSize.A4;

            using var document = new Document(pdf, pageSize);

            var props = new ConverterProperties();

            for (int i = 0; i < reportes.Count; i++)
            {
                var bloque = reportes[i];

                // ✅ Cabecera
                var headerProvider = _headers.First(h => h.CanHandle(bloque.TipoReporte));
                headerProvider.AddHeader(document, bloque.ModeloReporte, bloque.CabeceraReporte);

                // ✅ Contenido HTML → PDF
                var elements = HtmlConverter.ConvertToElements(bloque.Html, props);
                foreach (var element in elements)
                {
                    if (element is IBlockElement block)
                    {
                        document.Add(block);
                    }
                }

                // 👉 Salto de página si hay más reportes
                if (i < reportes.Count - 1)
                {
                    document.Add(new AreaBreak(iText.Layout.Properties.AreaBreakType.NEXT_PAGE));
                }

                headerProvider.RemoveHandler(document);
            }

            document.Close();
            return await Task.FromResult(ms.ToArray());
        }


    }
}