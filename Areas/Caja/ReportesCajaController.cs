using CapaDatos;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using WebAppMaternidad.CapaDatos;
using static CapaEntidades.ListBarItemEnum;
using WebAppMaternidad.CapaEntidades;
using Microsoft.AspNetCore.Http;
using SelectPdf;
using System.Diagnostics;
using System.Net.Mime;
using System.Text;
using DocumentFormat.OpenXml.Drawing.Diagrams;
using NPOI.POIFS.Crypt.Dsig;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Caja
{
    public class ReportesCajaController : BaseController
    {
        private IWebHostEnvironment _hostingEnvironment;

        public ReportesCajaController(IWebHostEnvironment env)
        {
            _hostingEnvironment = env;
        }

        public async Task<IActionResult> ReporteConsolidadoVentas(int idTipoReporte, int idTipoConsumo, string fechaInicio, string fechaFin, int idTipoComprobante, int idCaja, int idTurno, int idCajero, int idFarmacia, int idVendedor, string tipoComprobante, string tipoConsumo, string caja, string cajero, int enExcel)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            if(enExcel == 0)
            {                          
                StringBuilder html = new StringBuilder();
                HtmlToPdf ohtml = new HtmlToPdf();                
                string usuario;
                int idUsuario;
                // string tipo;

                Conexion con = new Conexion();
                sWebRootFolder = con.ObtenerServidorArchivos();
                MemoryStream ms = new MemoryStream();
                byte[] pdf;

                try
                {
                    usuario = HttpContext.Session.GetString("user");
                    idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                    // tipo = "RPT-RN";
                    
                    //path = Path.Combine(sWebRootFolder, "Reportes", ((DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + tipo + ".pdf"));
                    //Console.WriteLine("path: " + path);
                    Comun.ClUtilirario cl = new Comun.ClUtilirario();

                    PdfPageSize pageSize = (PdfPageSize)Enum.Parse(typeof(PdfPageSize), "A4", true);

                    //if(idTipoReporte == 1)
                    //{
                        PdfPageOrientation pdfOrientation = (PdfPageOrientation)Enum.Parse(typeof(PdfPageOrientation), "Portrait", true);
                        ohtml.Options.PdfPageOrientation = pdfOrientation;

                        ohtml.Options.WebPageWidth = 793;
                        ohtml.Options.WebPageHeight = 1122;
                    //}
                    //else if(idTipoReporte == 2)
                    //{
                    //    PdfPageOrientation pdfOrientationLandscape = (PdfPageOrientation)Enum.Parse(typeof(PdfPageOrientation), "Landscape", true);
                    //    ohtml.Options.PdfPageOrientation = pdfOrientationLandscape;

                    //    //ohtml.Options.WebPageWidth = 1122;
                    //    //ohtml.Options.WebPageHeight = 780;
                    //}
                                        
                    ohtml.Options.PdfPageSize = pageSize;
                    ohtml.Options.MarginLeft = 5;
                    ohtml.Options.MarginRight = 5;
                    ohtml.Options.MarginTop = 20;
                    ohtml.Options.MarginBottom = 60;


                    string Ruta = Url.Action("FormatoReporteConsolidadoVentas", "ReportesCaja", new { idTipoReporte, idTipoConsumo, fechaInicio, fechaFin, idTipoComprobante, idCaja, idTurno, idCajero, idFarmacia, idVendedor, tipoComprobante, tipoConsumo, caja, cajero, usuario }, "http");
                    PdfDocument obPdfDoc = ohtml.ConvertUrl(Ruta);

                    pdf = obPdfDoc.Save();
                    

                    ms = new MemoryStream();
                    ms.Write(pdf, 0, pdf.Length);
                    ms.Position = 0;

                    obPdfDoc.Close();

                    return new FileStreamResult(ms, MediaTypeNames.Application.Pdf);
                   
                }
                catch (Exception)
                {
                    //Debug.Print(e.Message.ToString());
                    return new FileStreamResult(ms, "Error al generar el reporte.");
                    
                }
            }
            else
            {
                if (idTipoReporte == 1)
                {
                    sWebRootFolder = sWebRootFolder + "/Plantilla/Caja/ReporteConsolidadoVentasPorItems.xlsx";
                }
                else if (idTipoReporte == 2)
                {
                    sWebRootFolder = sWebRootFolder + "/Plantilla/Caja/ReporteConsolidadoVentasPorDocumento.xlsx";
                }

                using (var workbook = new XLWorkbook(sWebRootFolder))
                {
                    //var FilaIni = 4;
                    DalReportesCaja dalRpt = new DalReportesCaja();
                    //int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                    DataSet dataSet = await dalRpt.ListarReporteConsolidadoVentas(idTipoReporte, idTipoConsumo, fechaInicio, fechaFin, idTipoComprobante, idCaja, idTurno, idCajero, idFarmacia, idVendedor);

                    if (dataSet.Tables[0].Rows.Count > 0)
                    {
                        var wsHoja1 = workbook.Worksheets.First();

                        //wsHoja1.Cell(2, 5).Value = dsCabeceraICI.Tables[0].Rows[0]["Ventas"].ToString();
                        //wsHoja1.Cell(2, 7).Value = dsCabeceraICI.Tables[0].Rows[0]["Sis"].ToString();
                        //wsHoja1.Cell(2, 9).Value = dsCabeceraICI.Tables[0].Rows[0]["IntervSan"].ToString();


                        //wsHoja1.Cell(4, 1).InsertData(dsSaldosFarmAlmacen.Tables[0]);
                        wsHoja1.Cell(5, 1).Value = "Comprobante: " + tipoComprobante;
                        wsHoja1.Cell(6, 1).Value = "Consumo: " + tipoConsumo;
                        wsHoja1.Cell(7, 1).Value = "Fecha: " + fechaInicio + " al " + fechaFin;


                        wsHoja1.Cell(9, 1).InsertTable(dataSet.Tables[0]);

                        if (idTipoReporte == 1)
                        {
                            int filas = dataSet.Tables[0].Rows.Count;

                            wsHoja1.Cell(filas + 10, 3).Value = dataSet.Tables[1].Rows[0]["Cantidad"].ToString();
                            wsHoja1.Cell(filas + 10, 4).Value = dataSet.Tables[1].Rows[0]["Total"].ToString();

                            wsHoja1.Cell(filas + 12, 3).Value = "Redondeo";
                            wsHoja1.Cell(filas + 12, 4).Value = dataSet.Tables[2].Rows[0]["Redondeo"].ToString();

                            wsHoja1.Cell(filas + 13, 3).Value = "Total Bruto";
                            wsHoja1.Cell(filas + 13, 4).Value = dataSet.Tables[2].Rows[0]["SubTotal"].ToString();

                            wsHoja1.Cell(filas + 14, 3).Value = "Devoluciones";
                            wsHoja1.Cell(filas + 14, 4).Value = dataSet.Tables[2].Rows[0]["Devolucion"].ToString();

                            wsHoja1.Cell(filas + 15, 3).Value = "Adelantos";
                            wsHoja1.Cell(filas + 15, 4).Value = dataSet.Tables[2].Rows[0]["Adelantos"].ToString();

                            wsHoja1.Cell(filas + 16, 3).Value = "Exoneraciones";
                            wsHoja1.Cell(filas + 16, 4).Value = dataSet.Tables[2].Rows[0]["Exoneraciones"].ToString();

                            wsHoja1.Cell(filas + 16, 3).Value = "Anulaciones";
                            wsHoja1.Cell(filas + 16, 4).Value = dataSet.Tables[2].Rows[0]["Anulado"].ToString();

                            wsHoja1.Cell(filas + 17, 3).Value = "IGV";
                            wsHoja1.Cell(filas + 17, 4).Value = dataSet.Tables[2].Rows[0]["IGV"].ToString();

                            wsHoja1.Cell(filas + 18, 3).Value = "TOTAL";
                            wsHoja1.Cell(filas + 18, 4).Value = dataSet.Tables[2].Rows[0]["Total"].ToString();

                        }

                        if (idTipoReporte == 2)
                        {
                            int filas = dataSet.Tables[0].Rows.Count;

                            //wsHoja1.Cell(filas + 10, 3).Value = dataSet.Tables[1].Rows[0]["Cantidad"].ToString();
                            //wsHoja1.Cell(filas + 10, 4).Value = dataSet.Tables[1].Rows[0]["Total"].ToString();

                            wsHoja1.Cell(filas + 10, 6).Value = Decimal.Parse(dataSet.Tables[1].Rows[0]["Sub Total"].ToString());
                            wsHoja1.Cell(filas + 10, 7).Value = Decimal.Parse(dataSet.Tables[1].Rows[0]["Redondeo"].ToString());
                            wsHoja1.Cell(filas + 10, 8).Value = Decimal.Parse(dataSet.Tables[1].Rows[0]["Anulado"].ToString());
                            wsHoja1.Cell(filas + 10, 9).Value = Decimal.Parse(dataSet.Tables[1].Rows[0]["Exonerado"].ToString());
                            wsHoja1.Cell(filas + 10, 10).Value = Decimal.Parse(dataSet.Tables[1].Rows[0]["Nota Credito"].ToString());
                            wsHoja1.Cell(filas + 10, 11).Value = Decimal.Parse(dataSet.Tables[1].Rows[0]["Pago a Cuenta"].ToString());
                            wsHoja1.Cell(filas + 10, 12).Value = Decimal.Parse(dataSet.Tables[1].Rows[0]["Total Bruto"].ToString());
                            wsHoja1.Cell(filas + 10, 13).Value = Decimal.Parse(dataSet.Tables[1].Rows[0]["IGV"].ToString());
                            wsHoja1.Cell(filas + 10, 14).Value = Decimal.Parse(dataSet.Tables[1].Rows[0]["Total Neto"].ToString());
                        }

                        // Listado Admision 
                        using (var stream = new MemoryStream())
                        {
                            workbook.SaveAs(stream);
                            var content = stream.ToArray();
                            return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ReporteConsolidadoVentas.xlsx");
                        }
                    }
                    else
                    {
                        return NoContent();
                    }
                }
            }

        }

        public async Task<IActionResult> ReporteResumenPorPartida(string fechaInicio, string fechaFin, int idCaja, int idCajero, int soloMayorCero, int incluyeNotasCredito, string caja, string cajero, int enExcel)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            if (enExcel == 0)
            {
                StringBuilder html = new StringBuilder();
                HtmlToPdf ohtml = new HtmlToPdf();
                string usuario;
                int idUsuario;
                // string tipo;

                Conexion con = new Conexion();
                sWebRootFolder = con.ObtenerServidorArchivos();
                MemoryStream ms = new MemoryStream();
                byte[] pdf;

                try
                {
                    usuario = HttpContext.Session.GetString("user");
                    idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                    // tipo = "RPT-RN";

                    //path = Path.Combine(sWebRootFolder, "Reportes", ((DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + tipo + ".pdf"));
                    //Console.WriteLine("path: " + path);
                    Comun.ClUtilirario cl = new Comun.ClUtilirario();

                    PdfPageSize pageSize = (PdfPageSize)Enum.Parse(typeof(PdfPageSize), "A4", true);

                    PdfPageOrientation pdfOrientation = (PdfPageOrientation)Enum.Parse(typeof(PdfPageOrientation), "Portrait", true);
                    ohtml.Options.PdfPageOrientation = pdfOrientation;
                    ohtml.Options.PdfPageSize = pageSize;
                    ohtml.Options.MarginLeft = 20;
                    ohtml.Options.MarginRight = 20;
                    ohtml.Options.MarginTop = 20;
                    ohtml.Options.MarginBottom = 20;
                    ohtml.Options.WebPageWidth = 793;
                    ohtml.Options.WebPageHeight = 1122;

                    string Ruta = Url.Action("FormatoReporteResumenPorPartida", "ReportesCaja", new { fechaInicio, fechaFin, idCaja, idCajero, soloMayorCero, incluyeNotasCredito, caja, cajero, usuario }, "http");
                    PdfDocument obPdfDoc = ohtml.ConvertUrl(Ruta);

                    pdf = obPdfDoc.Save();


                    ms = new MemoryStream();
                    ms.Write(pdf, 0, pdf.Length);
                    ms.Position = 0;

                    obPdfDoc.Close();

                    return new FileStreamResult(ms, MediaTypeNames.Application.Pdf);

                }
                catch (Exception)
                {
                    //Debug.Print(e.Message.ToString());
                    return new FileStreamResult(ms, "Error al generar el reporte.");

                }
            }
            else
            {
                sWebRootFolder = sWebRootFolder + "/Plantilla/Caja/ReporteResumenPorPartida.xlsx";
                using (var workbook = new XLWorkbook(sWebRootFolder))
                {
                    //var FilaIni = 4;
                    DalReportesCaja dalRpt = new DalReportesCaja();
                    //int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                    DataSet dataSet = await dalRpt.ListarReporteResumenPorPartida(fechaInicio, fechaFin, idCaja, idCajero, soloMayorCero, incluyeNotasCredito);

                    if (dataSet.Tables[0].Rows.Count > 0)
                    {
                        var wsHoja1 = workbook.Worksheets.First();

                        //wsHoja1.Cell(2, 5).Value = dsCabeceraICI.Tables[0].Rows[0]["Ventas"].ToString();
                        //wsHoja1.Cell(2, 7).Value = dsCabeceraICI.Tables[0].Rows[0]["Sis"].ToString();
                        //wsHoja1.Cell(2, 9).Value = dsCabeceraICI.Tables[0].Rows[0]["IntervSan"].ToString();


                        //wsHoja1.Cell(4, 1).InsertData(dsSaldosFarmAlmacen.Tables[0]);
                        wsHoja1.Cell(5, 1).Value = "Cajero: " + cajero;
                        wsHoja1.Cell(6, 1).Value = "Fecha: " + fechaInicio + " al " + fechaFin;


                        wsHoja1.Cell(8, 1).InsertTable(dataSet.Tables[0]);

                        int filas = dataSet.Tables[0].Rows.Count;

                        wsHoja1.Cell(filas + 9, 3).Value = dataSet.Tables[1].Rows[0]["Anulaciones"].ToString();
                        wsHoja1.Cell(filas + 9, 4).Value = dataSet.Tables[1].Rows[0]["Exoneraciones"].ToString();
                        if (incluyeNotasCredito == 0)
                        {
                            wsHoja1.Cell(filas + 9, 5).Value = dataSet.Tables[1].Rows[0]["Total Generado"].ToString();
                        }
                        else if (incluyeNotasCredito == 1)
                        {
                            wsHoja1.Cell(filas + 9, 5).Value = dataSet.Tables[1].Rows[0]["Nota Credito"].ToString();
                            wsHoja1.Cell(filas + 9, 6).Value = dataSet.Tables[1].Rows[0]["Total Generado"].ToString();
                        }


                        // Listado Admision 
                        using (var stream = new MemoryStream())
                        {
                            workbook.SaveAs(stream);
                            var content = stream.ToArray();
                            return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ReporteResumenPorPartida.xlsx");
                        }
                    }
                    else
                    {
                        return NoContent();
                    }


                }
            }

                //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
                
        }


        public async Task<IActionResult> ReporteConsolidadoRecaudacion(string fechaInicio, string fechaFin, int idCajero, int tipoReporte, string cajero, string tipoConsumo, int enExcel)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            if (enExcel == 0)
            {
                StringBuilder html = new StringBuilder();
                HtmlToPdf ohtml = new HtmlToPdf();
                string usuario;
                int idUsuario;
                // string tipo;

                Conexion con = new Conexion();
                sWebRootFolder = con.ObtenerServidorArchivos();
                MemoryStream ms = new MemoryStream();
                byte[] pdf;

                try
                {
                    usuario = HttpContext.Session.GetString("user");
                    idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                    // tipo = "RPT-CR";

                    //path = Path.Combine(sWebRootFolder, "Reportes", ((DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + tipo + ".pdf"));
                    //Console.WriteLine("path: " + path);
                    Comun.ClUtilirario cl = new Comun.ClUtilirario();

                    PdfPageSize pageSize = (PdfPageSize)Enum.Parse(typeof(PdfPageSize), "A4", true);

                    PdfPageOrientation pdfOrientation = (PdfPageOrientation)Enum.Parse(typeof(PdfPageOrientation), "Portrait", true);
                    ohtml.Options.PdfPageOrientation = pdfOrientation;
                    ohtml.Options.PdfPageSize = pageSize;
                    ohtml.Options.MarginLeft = 20;
                    ohtml.Options.MarginRight = 20;
                    ohtml.Options.MarginTop = 20;
                    ohtml.Options.MarginBottom = 20;
                    ohtml.Options.WebPageWidth = 793;
                    ohtml.Options.WebPageHeight = 1122;

                    string Ruta = Url.Action("FormatoReporteConsolidadoRecaudacion", "ReportesCaja", new { fechaInicio, fechaFin, idCajero, tipoReporte, cajero, tipoConsumo, usuario }, "http");
                    PdfDocument obPdfDoc = ohtml.ConvertUrl(Ruta);

                    pdf = obPdfDoc.Save();


                    ms = new MemoryStream();
                    ms.Write(pdf, 0, pdf.Length);
                    ms.Position = 0;

                    obPdfDoc.Close();

                    return new FileStreamResult(ms, MediaTypeNames.Application.Pdf);

                }
                catch (Exception e)
                {
                    //Debug.Print(e.Message.ToString());
                    return new FileStreamResult(ms, e.Message.ToString());

                }
            }
            else
            {
                sWebRootFolder = sWebRootFolder + "/Plantilla/Caja/ReporteConsolidadoRecaudacion.xlsx";
                using (var workbook = new XLWorkbook(sWebRootFolder))
                {
                    //var FilaIni = 4;
                    DalReportesCaja dalRpt = new DalReportesCaja();
                    //int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                    DataSet dataSet = await dalRpt.ListarReporteConsolidadoRecaudacion(fechaInicio, fechaFin, idCajero, tipoReporte);

                    if (dataSet.Tables[0].Rows.Count > 0)
                    {
                        var wsHoja1 = workbook.Worksheets.First();

                        //wsHoja1.Cell(2, 5).Value = dsCabeceraICI.Tables[0].Rows[0]["Ventas"].ToString();
                        //wsHoja1.Cell(2, 7).Value = dsCabeceraICI.Tables[0].Rows[0]["Sis"].ToString();
                        //wsHoja1.Cell(2, 9).Value = dsCabeceraICI.Tables[0].Rows[0]["IntervSan"].ToString();


                        //wsHoja1.Cell(4, 1).InsertData(dsSaldosFarmAlmacen.Tables[0]);
                        wsHoja1.Cell(5, 1).Value = "Cajero: " + cajero;
                        wsHoja1.Cell(6, 1).Value = "Fecha: " + fechaInicio + " al " + fechaFin;
                        wsHoja1.Cell(7, 1).Value = "Consumo: " + tipoConsumo;


                        wsHoja1.Cell(9, 1).InsertTable(dataSet.Tables[0]);

                        //int filas = dataSet.Tables[0].Rows.Count;

                        //wsHoja1.Cell(filas + 9, 3).Value = dataSet.Tables[1].Rows[0]["Anulaciones"].ToString();
                        //wsHoja1.Cell(filas + 9, 4).Value = dataSet.Tables[1].Rows[0]["Exoneraciones"].ToString();
                        

                        // Listado Admision 
                        using (var stream = new MemoryStream())
                        {
                            workbook.SaveAs(stream);
                            var content = stream.ToArray();
                            return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ReporteConsolidadoRecaudacion.xlsx");
                        }
                    }
                    else
                    {
                        return NoContent();
                    }


                }
            }

            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";

        }


        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        public async Task<ActionResult> FormatoReporteConsolidadoVentas(int idTipoReporte, int idTipoConsumo, string fechaInicio, string fechaFin, int idTipoComprobante, int idCaja, int idTurno, int idCajero, int idFarmacia, int idVendedor, string tipoComprobante, string tipoConsumo, string caja, string cajero, string usuario)
        {
            DalParametros daoParametros = new DalParametros();
            DataSet lsParametros = new DataSet();
            DalReportesCaja dalRpt = new DalReportesCaja();

            @ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss");
            @ViewBag.Usuario = usuario;
            
            DataSet DatosRpt = await dalRpt.ListarReporteConsolidadoVentas(idTipoReporte, idTipoConsumo, fechaInicio, fechaFin, idTipoComprobante, idCaja, idTurno, idCajero, idFarmacia, idVendedor);

            DataTable RegistroRpt = DatosRpt.Tables[0];
            DataTable TotalRpt = DatosRpt.Tables[1];
            
            int idIpressInt = 0;
            var idIpressStr = HttpContext.Session.GetString("IdIPress");
            if (!string.IsNullOrEmpty(idIpressStr) && int.TryParse(idIpressStr, out int result)) idIpressInt = result;

            lsParametros = await daoParametros.SeleccionaFilaParametro2(205, idIpressInt);
            string nombre = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(206, idIpressInt);
            string direccion = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(207, idIpressInt);
            string telefono = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            @ViewBag.NombreInstitucion = nombre;
            @ViewBag.DireccionInstitucion = direccion;
            @ViewBag.TelefonoInstitucion = telefono;

            @ViewBag.Fecha = fechaInicio + " al " + fechaFin;
            @ViewBag.TipoComprobante = tipoComprobante;
            @ViewBag.TipoConsumo = tipoConsumo;
            @ViewBag.idTipoReporte = idTipoReporte;
            @ViewBag.Cajero = cajero;
            @ViewBag.Caja = caja;

            @ViewBag.RegistrosRpt = RegistroRpt;
            @ViewBag.TotalRpt = TotalRpt;

            if(idTipoReporte == 1)
            {
                DataTable TotalDetalleRpt = DatosRpt.Tables[2];
                @ViewBag.TotalDetalleRpt = TotalDetalleRpt;

                return PartialView("~/Views/Caja/Plantillas/FormatoReporteConsolidadoVentasPorCatalogo.cshtml");
            } 
            else if (idTipoReporte == 2)
            {
                return PartialView("~/Views/Caja/Plantillas/FormatoReporteConsolidadoVentas.cshtml");
            } else
            {
                return PartialView("~/Views/Shared/Error.cshtml");
            }


            

        }

        public async Task<ActionResult> FormatoReporteResumenPorPartida(string fechaInicio, string fechaFin, int idCaja, int idCajero, int soloMayorCero, int incluyeNotasCredito, string caja, string cajero, string usuario)
        {
            DalParametros daoParametros = new DalParametros();
            DataSet lsParametros = new DataSet();
            DalReportesCaja dalRpt = new DalReportesCaja();

            @ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss");
            @ViewBag.Usuario = usuario;

            DataSet DatosRpt = await dalRpt.ListarReporteResumenPorPartida(fechaInicio, fechaFin, idCaja, idCajero, soloMayorCero, incluyeNotasCredito);

            DataTable RegistroRpt = DatosRpt.Tables[0];
            DataTable TotalRpt = DatosRpt.Tables[1];

            int idIpressInt = 0;
            var idIpressStr = HttpContext.Session.GetString("IdIPress");
            if (!string.IsNullOrEmpty(idIpressStr) && int.TryParse(idIpressStr, out int result)) idIpressInt = result;

            lsParametros = await daoParametros.SeleccionaFilaParametro2(205, idIpressInt);
            string nombre = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(206, idIpressInt);
            string direccion = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(207, idIpressInt);
            string telefono = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            @ViewBag.NombreInstitucion = nombre;
            @ViewBag.DireccionInstitucion = direccion;
            @ViewBag.TelefonoInstitucion = telefono;

            @ViewBag.Fecha = fechaInicio + " al " + fechaFin;
            @ViewBag.Caja = caja;
            @ViewBag.Cajero = cajero;
            @ViewBag.incluyeNotasCredito = incluyeNotasCredito;

            @ViewBag.RegistrosRpt = RegistroRpt;
            @ViewBag.TotalRpt = TotalRpt;


            return PartialView("~/Views/Caja/Plantillas/FormatoReporteResumenPorPartida.cshtml");

        }

        public async Task<ActionResult> FormatoReporteConsolidadoRecaudacion(string fechaInicio, string fechaFin, int idCajero, int tipoReporte, string cajero, string tipoConsumo, string usuario)
        {
            DalParametros daoParametros = new DalParametros();
            DataSet lsParametros = new DataSet();
            DalReportesCaja dalRpt = new DalReportesCaja();

            @ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss");
            @ViewBag.Usuario = usuario;

            DataSet DatosRpt = await dalRpt.ListarReporteConsolidadoRecaudacion(fechaInicio, fechaFin, idCajero, tipoReporte);

            DataTable RegistroRpt = DatosRpt.Tables[0];
            //DataTable TotalRpt = DatosRpt.Tables[1];

            int idIpressInt = 0;
            var idIpressStr = HttpContext.Session.GetString("IdIPress");
            if (!string.IsNullOrEmpty(idIpressStr) && int.TryParse(idIpressStr, out int result)) idIpressInt = result;

            lsParametros = await daoParametros.SeleccionaFilaParametro2(205, idIpressInt);
            string nombre = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(206, idIpressInt);
            string direccion = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(207, idIpressInt);
            string telefono = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            @ViewBag.NombreInstitucion = nombre;
            @ViewBag.DireccionInstitucion = direccion;
            @ViewBag.TelefonoInstitucion = telefono;

            @ViewBag.Fecha = fechaInicio + " al " + fechaFin;            
            @ViewBag.Cajero = cajero;
            @ViewBag.TipoConsumo = tipoConsumo;

            @ViewBag.RegistrosRpt = RegistroRpt;
            //@ViewBag.TotalRpt = TotalRpt;


            return PartialView("~/Views/Caja/Plantillas/FormatoReporteConsolidadoRecaudacion.cshtml");

        }

    }
}
