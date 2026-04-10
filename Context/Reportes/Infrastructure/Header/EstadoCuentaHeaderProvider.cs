using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using CapaDatos;
using iText.Commons.Actions;
using iText.IO.Font;
using iText.IO.Font.Constants;
using iText.IO.Image;
using iText.Kernel.Events;
using iText.Kernel.Font;
using iText.Kernel.Pdf.Canvas;
using iText.Layout;
using iText.Layout.Borders;
using iText.Layout.Element;
using iText.Layout.Properties;
using Microsoft.AspNetCore.Hosting;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.Context.Reportes.Domain;

namespace WebAppMaternidad.Context.Reportes.Infrastructure.Header
{
    public class EstadoCuentaHeaderProvider : IHeaderProvider
    {
        private readonly IWebHostEnvironment _env;
        private iText.Kernel.Events.IEventHandler handler = null;
        public EstadoCuentaHeaderProvider(IWebHostEnvironment env)
        {
            _env = env;
        }

        public bool CanHandle(TipoReporte tipoReporte) => tipoReporte == TipoReporte.EstadoCuenta;
        public void AddHeader(Document document, int modeloReporte, DatosCabeceraReporte cabeceraReporte)
        {
            var pdfDoc = document.GetPdfDocument();
            
            if (modeloReporte == 1 || modeloReporte == 3)
            {
                handler = new HeaderEstadoCuentaPtoCargaEventHandler(document, modeloReporte, cabeceraReporte, _env);
                pdfDoc.AddEventHandler(PdfDocumentEvent.START_PAGE, handler);
            }
            else if (modeloReporte == 2 || modeloReporte == 7 || modeloReporte == 8)
            {
                handler = new HeaderEstadoCuentaPtoCargaConsolidadoEventHandler(document, modeloReporte, cabeceraReporte, _env);
                pdfDoc.AddEventHandler(PdfDocumentEvent.START_PAGE, handler);
            }
            else if (modeloReporte == 4)
            {
                handler = new HeaderEstadoCuentaLiquidacionEventHandler(document, modeloReporte, cabeceraReporte, _env);
                pdfDoc.AddEventHandler(PdfDocumentEvent.START_PAGE, handler);
            }
            else if (modeloReporte == 5 || modeloReporte == 6)
            {
                handler = new HeaderEstadoCuentaExoneracionesEventHandler(document, modeloReporte, cabeceraReporte, _env);
                pdfDoc.AddEventHandler(PdfDocumentEvent.START_PAGE, handler);
            }

            // 
        }

        public void RemoveHandler(Document document)
        {
            if (handler != null)
            {
                var pdfDoc = document.GetPdfDocument();
                pdfDoc.RemoveEventHandler(PdfDocumentEvent.START_PAGE, handler);
                handler = null;
            }
        }
        private class HeaderEstadoCuentaPtoCargaEventHandler : iText.Kernel.Events.IEventHandler
        {
            private readonly int _modeloReporte;
            private readonly Document _document;

            private readonly IWebHostEnvironment _env;

            private readonly DatosCabeceraReporte _datosCabeceraReporte;

            private readonly string _fechaActual;

            public HeaderEstadoCuentaPtoCargaEventHandler(Document document, int modeloReporte, DatosCabeceraReporte datosCabeceraReporte, IWebHostEnvironment env)
            {
                _document = document;
                _modeloReporte = modeloReporte;
                _env = env;
                _datosCabeceraReporte = datosCabeceraReporte;
                _fechaActual = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");
            }

            public void HandleEvent(Event currentEvent)
            {



                var logoPath = Path.Combine(_env.WebRootPath, "images", "Logo.png");

                if (!File.Exists(logoPath))
                    throw new FileNotFoundException("Logo no encontrado en:", logoPath);

                var pdfDocEvent = (PdfDocumentEvent)currentEvent;
                var pdfPage = pdfDocEvent.GetPage();
                var canvas = new Canvas(new PdfCanvas(pdfPage), pdfPage.GetPageSize());

                // === Tabla principal (logo + institución + usuario/fecha) ===
                Table headerTable = new Table(UnitValue.CreatePercentArray(new float[] { 20, 60, 20 }))
                    .UseAllAvailableWidth();
                headerTable.SetMarginTop(5);    // margen arriba de toda la tabla
                
                headerTable.SetMarginLeft(10);
                headerTable.SetMarginRight(10);
                // Logo
                // var logo = new Image(ImageDataFactory.Create(logoPath))
                //     .SetHeight(10)
                //     .SetAutoScale(true);
                // logo.ScaleToFit(30, 30); // Máx. 50x50
                // headerTable.AddCell(new Cell().Add(logo).SetBorder(Border.NO_BORDER));


                Paragraph logo = new Paragraph("");
                headerTable.AddCell(new Cell().Add(logo).SetBorder(Border.NO_BORDER));

                // Datos institución
                Paragraph inst = new Paragraph($"{_datosCabeceraReporte.Institucion.Nombre}\n" +
                                               $"{_datosCabeceraReporte.Institucion.Direccion}\n" +
                                               $"Teléfono: {_datosCabeceraReporte.Institucion.Telefono}")
                    .SetFontSize(6)
                    .SetTextAlignment(TextAlignment.CENTER);
                headerTable.AddCell(new Cell().Add(inst).SetBorder(Border.NO_BORDER).SetVerticalAlignment(VerticalAlignment.MIDDLE));

                // Usuario + fecha
                Paragraph userInfo = new Paragraph($"Usuario: {_datosCabeceraReporte.CabeceraPrincipal.Usuario}\n" +
                                                   $"F. Impresión: {_fechaActual}")
                    .SetFontSize(8)
                    .SetTextAlignment(TextAlignment.RIGHT);
                headerTable.AddCell(new Cell().Add(userInfo).SetBorder(Border.NO_BORDER).SetVerticalAlignment(VerticalAlignment.TOP));

                canvas.Add(headerTable);

                Table cuentaTable = new Table(UnitValue.CreatePercentArray(new float[] { 10 }))
                    .UseAllAvailableWidth();

                cuentaTable.SetMarginBottom(5); // margen debajo de la cabecera
                cuentaTable.SetMarginLeft(10);
                cuentaTable.SetMarginRight(10);

                cuentaTable.AddCell(new Cell().Add(new Paragraph($"Estado de Cuenta al {_fechaActual}"))
                    .SetFontSize(12)
                    
                    .SetBorder(Border.NO_BORDER)
                    .SetTextAlignment(TextAlignment.CENTER));

                canvas.Add(cuentaTable);
                // === Datos paciente debajo ===
                Table pacienteTable = new Table(UnitValue.CreatePercentArray(new float[] { 50, 50 }))
                    .UseAllAvailableWidth();

                
                pacienteTable.SetMarginBottom(5); // margen debajo de la cabecera
                pacienteTable.SetMarginLeft(10);
                pacienteTable.SetMarginRight(10);

                pacienteTable.AddCell(new Cell().Add(new Paragraph($"N° Cuenta: {_datosCabeceraReporte.CabeceraPrincipal.IdCuentaAtencion}"))
                    .SetFontSize(8)
                    .SetBorder(Border.NO_BORDER));

                pacienteTable.AddCell(new Cell().Add(new Paragraph($"N° Atencion: {_datosCabeceraReporte.CabeceraPrincipal.IdAtencion} {_datosCabeceraReporte.CabeceraPrincipal.Diagnostico}"))
                    .SetFontSize(8)
                    .SetBorder(Border.NO_BORDER));


                pacienteTable.AddCell(new Cell().Add(new Paragraph($"Paciente: {_datosCabeceraReporte.CabeceraPrincipal.NombrePaciente}"))
                    .SetFontSize(8)
                    .SetBorder(Border.NO_BORDER));

                pacienteTable.AddCell(new Cell().Add(new Paragraph($"Nº Historia Clínica: {_datosCabeceraReporte.CabeceraPrincipal.NumeroHistoriaClinica}"))
                    .SetFontSize(8)
                    .SetBorder(Border.NO_BORDER));


                pacienteTable.AddCell(new Cell().Add(new Paragraph($"F.Ingreso: {_datosCabeceraReporte.CabeceraPrincipal.FechaIngreso}"))
                    .SetFontSize(8)
                    .SetBorder(Border.NO_BORDER));

                pacienteTable.AddCell(new Cell().Add(new Paragraph($"Servicio Egreso: {_datosCabeceraReporte.CabeceraPrincipal.ServicioEgreso}"))
                    .SetFontSize(8)
                    .SetBorder(Border.NO_BORDER));


                pacienteTable.AddCell(new Cell().Add(new Paragraph($"F.Alta Médica: {_datosCabeceraReporte.CabeceraPrincipal.FechaEgreso}"))
                    .SetFontSize(8)
                    .SetBorder(Border.NO_BORDER));

                pacienteTable.AddCell(new Cell().Add(new Paragraph($"Cama: {_datosCabeceraReporte.CabeceraPrincipal.Cama}"))
                    .SetFontSize(8)
                    .SetBorder(Border.NO_BORDER));

                canvas.Add(pacienteTable);

                // Ajustar margen para el resto del contenido
                _document.SetMargins(150, 10, 145, 10); // top, right, bottom, left
            }
        }

        private class HeaderEstadoCuentaPtoCargaConsolidadoEventHandler : iText.Kernel.Events.IEventHandler
        {
            private readonly int _modeloReporte;
            private readonly Document _document;

            private readonly IWebHostEnvironment _env;

            private readonly DatosCabeceraReporte _datosCabeceraReporte;
            private readonly string _fechaActual;

            public HeaderEstadoCuentaPtoCargaConsolidadoEventHandler(Document document, int modeloReporte, DatosCabeceraReporte datosCabeceraReporte, IWebHostEnvironment env)
            {
                _document = document;
                _modeloReporte = modeloReporte;
                _env = env;
                _datosCabeceraReporte = datosCabeceraReporte;
                _fechaActual = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");
            }

            public void HandleEvent(Event currentEvent)
            {



                var logoPath = Path.Combine(_env.WebRootPath, "images", "Logo.png");

                if (!File.Exists(logoPath))
                    throw new FileNotFoundException("Logo no encontrado en:", logoPath);

                var pdfDocEvent = (PdfDocumentEvent)currentEvent;
                var pdfPage = pdfDocEvent.GetPage();
                var canvas = new Canvas(new PdfCanvas(pdfPage), pdfPage.GetPageSize());

                // === Tabla principal (logo + institución + usuario/fecha) ===
                Table headerTable = new Table(UnitValue.CreatePercentArray(new float[] { 20, 60, 20 }))
                    .UseAllAvailableWidth();
                headerTable.SetMarginTop(5);    // margen arriba de toda la tabla
                headerTable.SetMarginBottom(5); // margen debajo de la cabecera
                headerTable.SetMarginLeft(10);
                headerTable.SetMarginRight(10);
                // Logo
                // var logo = new Image(ImageDataFactory.Create(logoPath))
                //     .SetHeight(10)
                //     .SetAutoScale(true);
                // logo.ScaleToFit(30, 30); // Máx. 50x50
                // headerTable.AddCell(new Cell().Add(logo).SetBorder(Border.NO_BORDER));


                Paragraph logo = new Paragraph("");
                headerTable.AddCell(new Cell().Add(logo).SetBorder(Border.NO_BORDER));

                // Datos institución
                Paragraph inst = new Paragraph($"{_datosCabeceraReporte.Institucion.Nombre}\n" +
                                               $"{_datosCabeceraReporte.Institucion.Direccion}\n" +
                                               $"Teléfono: {_datosCabeceraReporte.Institucion.Telefono}")
                    .SetFontSize(6)
                    .SetTextAlignment(TextAlignment.CENTER);
                headerTable.AddCell(new Cell().Add(inst).SetBorder(Border.NO_BORDER).SetVerticalAlignment(VerticalAlignment.MIDDLE));

                // Usuario + fecha
                Paragraph userInfo = new Paragraph($"Usuario: {_datosCabeceraReporte.CabeceraPrincipal.Usuario}\n" +
                                                   $"F. Impresión: {_fechaActual}")
                    .SetFontSize(8)
                    .SetTextAlignment(TextAlignment.RIGHT);
                headerTable.AddCell(new Cell().Add(userInfo).SetBorder(Border.NO_BORDER).SetVerticalAlignment(VerticalAlignment.TOP));

                canvas.Add(headerTable);

                // === Datos paciente debajo ===
                Table pacienteTable = new Table(UnitValue.CreatePercentArray(new float[] { 100 }))
                    .UseAllAvailableWidth();

                pacienteTable.SetMarginBottom(5); // margen debajo de la cabecera
                pacienteTable.SetMarginLeft(10);
                pacienteTable.SetMarginRight(10);

                pacienteTable.AddCell(new Cell().Add(new Paragraph($"CONSUMOS CONSOLIDADOS de la Cuenta N°: {_datosCabeceraReporte.CabeceraPrincipal.IdCuentaAtencion}"))
                    .SetFontSize(8)
                    .SetPadding(0)
                    .SetBorder(Border.NO_BORDER));

                pacienteTable.AddCell(new Cell().Add(new Paragraph($"Estado de Cuenta al {_fechaActual}"))
                    .SetFontSize(8)
                    .SetPadding(0)
                    .SetBorder(Border.NO_BORDER));

                pacienteTable.AddCell(new Cell().Add(new Paragraph($"Paciente {_datosCabeceraReporte.CabeceraPrincipal.NumeroHistoriaClinica} - {_datosCabeceraReporte.CabeceraPrincipal.NombrePaciente}"))
                    .SetFontSize(8)
                    .SetPadding(0)
                    .SetBorder(Border.NO_BORDER));

                pacienteTable.AddCell(new Cell().Add(new Paragraph($"Cuenta: (Cerrado) IAFA: {_datosCabeceraReporte.CabeceraPrincipal.FuenteFinanciamiento} (PP: {_datosCabeceraReporte.CabeceraPrincipal.ProductoPlan})"))
                    .SetFontSize(8)
                    .SetPadding(0)
                    .SetBorder(Border.NO_BORDER));

                pacienteTable.AddCell(new Cell().Add(new Paragraph($"Serv.Egreso: {_datosCabeceraReporte.CabeceraPrincipal.ServicioEgreso}"))
                    .SetFontSize(8)
                    .SetPadding(0)
                    .SetBorder(Border.NO_BORDER));

                canvas.Add(pacienteTable);

                PdfFont font = PdfFontFactory.CreateFont(StandardFonts.HELVETICA, PdfEncodings.WINANSI, PdfFontFactory.EmbeddingStrategy.PREFER_EMBEDDED);
           
                // Ajustar margen para el resto del contenido
                _document.SetFont(font);
                _document.SetMargins(110, 90, 36, 10); // top, right, bottom, left
            }
        }

        private class HeaderEstadoCuentaLiquidacionEventHandler : iText.Kernel.Events.IEventHandler
        {
            private readonly int _modeloReporte;
            private readonly Document _document;

            private readonly IWebHostEnvironment _env;

            private readonly DatosCabeceraReporte _datosCabeceraReporte;

            private readonly string _fechaActual;

            public HeaderEstadoCuentaLiquidacionEventHandler(Document document, int modeloReporte, DatosCabeceraReporte datosCabeceraReporte, IWebHostEnvironment env)
            {
                _document = document;
                _modeloReporte = modeloReporte;
                _env = env;
                _datosCabeceraReporte = datosCabeceraReporte;
                _fechaActual = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");
            }

            public void HandleEvent(Event currentEvent)
            {



                var logoPath = Path.Combine(_env.WebRootPath, "images", "Logo.png");

                if (!File.Exists(logoPath))
                    throw new FileNotFoundException("Logo no encontrado en:", logoPath);

                var pdfDocEvent = (PdfDocumentEvent)currentEvent;
                var pdfPage = pdfDocEvent.GetPage();
                var canvas = new Canvas(new PdfCanvas(pdfPage), pdfPage.GetPageSize());

                // === Tabla principal (logo + institución + usuario/fecha) ===
                Table headerTable = new Table(UnitValue.CreatePercentArray(new float[] { 20, 60, 20 }))
                    .UseAllAvailableWidth();
                headerTable.SetMarginTop(5);    // margen arriba de toda la tabla
                
                headerTable.SetMarginLeft(10);
                headerTable.SetMarginRight(10);
                // Logo
                // var logo = new Image(ImageDataFactory.Create(logoPath))
                //     .SetHeight(10)
                //     .SetAutoScale(true);
                // logo.ScaleToFit(30, 30); // Máx. 50x50
                // headerTable.AddCell(new Cell().Add(logo).SetBorder(Border.NO_BORDER));


                Paragraph logo = new Paragraph("");
                headerTable.AddCell(new Cell().Add(logo).SetBorder(Border.NO_BORDER));

                // Datos institución
                Paragraph inst = new Paragraph($"{_datosCabeceraReporte.Institucion.Nombre}\n" +
                                               $"{_datosCabeceraReporte.Institucion.Direccion}\n" +
                                               $"Teléfono: {_datosCabeceraReporte.Institucion.Telefono}")
                    .SetFontSize(6)
                    .SetTextAlignment(TextAlignment.CENTER);
                headerTable.AddCell(new Cell().Add(inst).SetBorder(Border.NO_BORDER).SetVerticalAlignment(VerticalAlignment.MIDDLE));

                // Usuario + fecha
                Paragraph userInfo = new Paragraph($"Usuario: {_datosCabeceraReporte.CabeceraPrincipal.Usuario}\n" +
                                                   $"F. Impresión: {_fechaActual}")
                    .SetFontSize(8)
                    .SetTextAlignment(TextAlignment.RIGHT);
                headerTable.AddCell(new Cell().Add(userInfo).SetBorder(Border.NO_BORDER).SetVerticalAlignment(VerticalAlignment.TOP));

                canvas.Add(headerTable);

                // Table cuentaTable = new Table(UnitValue.CreatePercentArray(new float[] { 10 }))
                //     .UseAllAvailableWidth();

                // cuentaTable.SetMarginBottom(5); // margen debajo de la cabecera
                // cuentaTable.SetMarginLeft(10);
                // cuentaTable.SetMarginRight(10);

                // cuentaTable.AddCell(new Cell().Add(new Paragraph($"Estado de Cuenta al {_fechaActual}"))
                //     .SetFontSize(12)
                //     
                //     .SetBorder(Border.NO_BORDER)
                //     .SetTextAlignment(TextAlignment.CENTER));

                // canvas.Add(cuentaTable);
                // === Datos paciente debajo ===
                Table pacienteTable = new Table(UnitValue.CreatePercentArray(new float[] { 50, 50 }))
                    .UseAllAvailableWidth();

                
                pacienteTable.SetMarginBottom(5); // margen debajo de la cabecera
                pacienteTable.SetMarginLeft(10);
                pacienteTable.SetMarginRight(10);


                pacienteTable.AddCell(new Cell().Add(new Paragraph($"PACIENTE: {_datosCabeceraReporte.CabeceraPrincipal.NombrePaciente}"))
                                    .SetFontSize(8)
                                    .SetBorder(Border.NO_BORDER));
                pacienteTable.AddCell(new Cell().Add(new Paragraph($"N° HISTORIA CLÍNICA: {_datosCabeceraReporte.CabeceraPrincipal.NumeroHistoriaClinica}"))
                    .SetFontSize(8)
                    .SetBorder(Border.NO_BORDER));


                pacienteTable.AddCell(new Cell().Add(new Paragraph($"CIA ASEGURADORA"))
                    .SetFontSize(8)
                    .SetBorder(Border.NO_BORDER));
                pacienteTable.AddCell(new Cell().Add(new Paragraph($"PLACA N°"))
                    .SetFontSize(8)
                    .SetBorder(Border.NO_BORDER));


                pacienteTable.AddCell(new Cell().Add(new Paragraph($"CONTRATANTE"))
                    .SetFontSize(8)
                    .SetBorder(Border.NO_BORDER));
                pacienteTable.AddCell(new Cell().Add(new Paragraph($"POLIZA N°"))
                    .SetFontSize(8)
                    .SetBorder(Border.NO_BORDER));

                pacienteTable.AddCell(new Cell().Add(new Paragraph($"DIAGNOSTICO: {_datosCabeceraReporte.CabeceraPrincipal.Diagnostico}"))
                    .SetFontSize(8)
                    .SetBorder(Border.NO_BORDER));
                pacienteTable.AddCell(new Cell().Add(new Paragraph($"FECHA DE SINIESTRO"))
                    .SetFontSize(8)
                    .SetBorder(Border.NO_BORDER));



                pacienteTable.AddCell(new Cell().Add(new Paragraph($"N° Cuenta: {_datosCabeceraReporte.CabeceraPrincipal.IdCuentaAtencion}"))
                    .SetFontSize(8)
                    .SetBorder(Border.NO_BORDER));

                pacienteTable.AddCell(new Cell().Add(new Paragraph($"N° Atencion: {_datosCabeceraReporte.CabeceraPrincipal.IdAtencion} "))
                    .SetFontSize(8)
                    .SetBorder(Border.NO_BORDER));


                pacienteTable.AddCell(new Cell().Add(new Paragraph($"F.Ingreso: {_datosCabeceraReporte.CabeceraPrincipal.FechaIngreso}"))
                   .SetFontSize(8)
                   .SetBorder(Border.NO_BORDER));
                pacienteTable.AddCell(new Cell().Add(new Paragraph($"F.Alta Médica: {_datosCabeceraReporte.CabeceraPrincipal.FechaEgreso}"))
                    .SetFontSize(8)
                    .SetBorder(Border.NO_BORDER));

                canvas.Add(pacienteTable);

                // Ajustar margen para el resto del contenido
                _document.SetMargins(165, 10, 145, 10); // top, right, bottom, left
            }
        }

        private class HeaderEstadoCuentaExoneracionesEventHandler : iText.Kernel.Events.IEventHandler
        {
            private readonly int _modeloReporte;
            private readonly Document _document;

            private readonly IWebHostEnvironment _env;

            private readonly DatosCabeceraReporte _datosCabeceraReporte;
            private readonly string _fechaActual;

            public HeaderEstadoCuentaExoneracionesEventHandler(Document document, int modeloReporte, DatosCabeceraReporte datosCabeceraReporte, IWebHostEnvironment env)
            {
                _document = document;
                _modeloReporte = modeloReporte;
                _env = env;
                _datosCabeceraReporte = datosCabeceraReporte;
                _fechaActual = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");
            }

            public void HandleEvent(Event currentEvent)
            {



                var logoPath = Path.Combine(_env.WebRootPath, "images", "Logo.png");

                if (!File.Exists(logoPath))
                    throw new FileNotFoundException("Logo no encontrado en:", logoPath);

                var pdfDocEvent = (PdfDocumentEvent)currentEvent;
                var pdfPage = pdfDocEvent.GetPage();
                var canvas = new Canvas(new PdfCanvas(pdfPage), pdfPage.GetPageSize());

                // === Tabla principal (logo + institución + usuario/fecha) ===
                Table headerTable = new Table(UnitValue.CreatePercentArray(new float[] { 20, 60, 20 }))
                    .UseAllAvailableWidth();
                headerTable.SetMarginTop(5);    // margen arriba de toda la tabla
                
                headerTable.SetMarginLeft(10);
                headerTable.SetMarginRight(10);
                // Logo
                // var logo = new Image(ImageDataFactory.Create(logoPath))
                //     .SetHeight(10)
                //     .SetAutoScale(true);
                // logo.ScaleToFit(30, 30); // Máx. 50x50
                // headerTable.AddCell(new Cell().Add(logo).SetBorder(Border.NO_BORDER));


                Paragraph logo = new Paragraph("");
                headerTable.AddCell(new Cell().Add(logo).SetBorder(Border.NO_BORDER));

                // Datos institución
                Paragraph inst = new Paragraph($"{_datosCabeceraReporte.Institucion.Nombre}\n" +
                                               $"{_datosCabeceraReporte.Institucion.Direccion}\n" +
                                               $"Teléfono: {_datosCabeceraReporte.Institucion.Telefono}")
                    .SetFontSize(6)
                    .SetTextAlignment(TextAlignment.CENTER);
                headerTable.AddCell(new Cell().Add(inst).SetBorder(Border.NO_BORDER).SetVerticalAlignment(VerticalAlignment.MIDDLE));

                // Usuario + fecha
                Paragraph userInfo = new Paragraph($"Usuario: {_datosCabeceraReporte.CabeceraPrincipal.Usuario}\n" +
                                                   $"F. Impresión: {_fechaActual}")
                    .SetFontSize(8)
                    .SetTextAlignment(TextAlignment.RIGHT);
                headerTable.AddCell(new Cell().Add(userInfo).SetBorder(Border.NO_BORDER).SetVerticalAlignment(VerticalAlignment.TOP));

                canvas.Add(headerTable);


                // === Datos paciente debajo ===
                Table pacienteTable = new Table(UnitValue.CreatePercentArray(new float[] { 50, 50 }))
                    .UseAllAvailableWidth();

                
                pacienteTable.SetMarginBottom(5); // margen debajo de la cabecera
                pacienteTable.SetMarginLeft(10);
                pacienteTable.SetMarginRight(10);

                pacienteTable.AddCell(new Cell().Add(new Paragraph($"Paciente: {_datosCabeceraReporte.CabeceraPrincipal.NombrePaciente}"))
                                    .SetFontSize(8)
                                    .SetBorder(Border.NO_BORDER));
                pacienteTable.AddCell(new Cell().Add(new Paragraph($"Nº Historia Clínica: {_datosCabeceraReporte.CabeceraPrincipal.NumeroHistoriaClinica}"))
                    .SetFontSize(8)
                    .SetBorder(Border.NO_BORDER));


                pacienteTable.AddCell(new Cell().Add(new Paragraph($"Dirección: {_datosCabeceraReporte.CabeceraPrincipal.Direccion}"))
                                    .SetFontSize(8)
                                    .SetBorder(Border.NO_BORDER));
                pacienteTable.AddCell(new Cell().Add(new Paragraph($"N° Cuenta: {_datosCabeceraReporte.CabeceraPrincipal.IdCuentaAtencion}"))
                    .SetFontSize(8)
                    .SetBorder(Border.NO_BORDER));


                pacienteTable.AddCell(new Cell().Add(new Paragraph($"Ocupación: {_datosCabeceraReporte.CabeceraPrincipal.Ocupación}"))
                                    .SetFontSize(8)
                                    .SetBorder(Border.NO_BORDER));
                pacienteTable.AddCell(new Cell().Add(new Paragraph($"F.Ingreso: {_datosCabeceraReporte.CabeceraPrincipal.FechaIngreso}"))
                    .SetFontSize(8)
                    .SetBorder(Border.NO_BORDER));


                canvas.Add(pacienteTable);

                Table cuentaTable = new Table(UnitValue.CreatePercentArray(new float[] { 10 }))
                    .UseAllAvailableWidth();

                cuentaTable.SetMarginBottom(5); // margen debajo de la cabecera
                cuentaTable.SetMarginLeft(10);
                cuentaTable.SetMarginRight(10);

                cuentaTable.AddCell(new Cell().Add(new Paragraph($"RESULTADO DEL ESTUDIO SOCIO ECONÓMICO"))
                    .SetFontSize(10)
                    
                    .SetBorder(Border.NO_BORDER)
                    .SetTextAlignment(TextAlignment.LEFT));
                cuentaTable.AddCell(new Cell().Add(new Paragraph($"DETALLE DE EXONERACIONES REALIZADAS POR RUBROS\n"
                                                            + $"SERVICIO DE EGRESO: {_datosCabeceraReporte.CabeceraPrincipal.ServicioEgreso} ({_datosCabeceraReporte.CabeceraPrincipal.TipoServicio})"))
                    .SetFontSize(12)
                    
                    .SetBorder(Border.NO_BORDER)
                    .SetTextAlignment(TextAlignment.CENTER));

                canvas.Add(cuentaTable);

                // Ajustar margen para el resto del contenido
                _document.SetMargins(185, 10, 145, 10); // top, right, bottom, left
            }

        }

    }
}