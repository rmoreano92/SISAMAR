using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.Extensions.Configuration;
using QRCoder;
using SelectPdf;
using SiHospCrypKey;
using WebAppMaternidad.Areas.Comun;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Estadistica
{
    public class ConstanciasRNController : BaseController
    {
        private IWebHostEnvironment _hostingEnvironment;

        public ConstanciasRNController(IWebHostEnvironment env)
        {
            _hostingEnvironment = env;
        }

        public ActionResult BuscarPacienteRn(int Anio, String Apellidos, DateTime FecNac, int NroHistoria)
        {
            string Respuesta = "OK";
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                Respuesta = "Su sesión a expirado.";
            }
            DataSet ListaPacientes = new DataSet();
            DataSet ListaPacientesAnt = new DataSet();
            DalEvaluacionRN daoRn = new DalEvaluacionRN();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaPacientes = daoRn.BuscarPacienteRn(Anio, Apellidos, FecNac, NroHistoria);
            return Json(new { lstPacientes = ListaPacientes, lstPacientesAnt = ListaPacientesAnt, rsp = Respuesta });
        }

        public ActionResult ObtenerDatosPaciente(int idPaciente, int Anio, String NroHistoria, int bd)
        {
            string Respuesta = "OK";
            DataSet DatosPaciente = new DataSet();
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                Respuesta = "Su sesión a expirado.";
            }
            else
            {
                DalEvaluacionRN daoRn = new DalEvaluacionRN();
                DatosPaciente = daoRn.DatosPacientebyIdPacienteIdBd(Anio, NroHistoria, bd);
            }
            return Json(new { objPaciente = DatosPaciente, rsp = Respuesta });
        }
        [HttpGet]
        public async Task<ActionResult> ListarTiposSolicitante()
        {
            DataSet lstMetodo;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMetodo = await daoCitas.DevuelveDSCombo("web_ListarSolicitantes");
            return Json(lstMetodo);
        }
        [HttpGet]
        public async Task<ActionResult> ListarTiposDocumento()
        {
            DataSet lstMetodo;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMetodo = await daoCitas.DevuelveDSCombo("web_ListarDocumentos");
            return Json(lstMetodo);
        }

        public Tuple<int, String> ValidarComprobante(String NroDocumento, String NroCorrelativo)
        {
            DataSet DatosComprobante;
            Tuple<int, String> datos = new Tuple<int, string>(0, null);
            try
            {
                DalEvaluacionRN daoEvaluacion = new DalEvaluacionRN();
                DatosComprobante = daoEvaluacion.DatosValidarComprobante(NroDocumento, NroCorrelativo);
                if (DatosComprobante.Tables.Count == 0)
                {
                    datos = new Tuple<int, string>(0, "No existe comprobante.");
                }
                else
                {
                    if (DatosComprobante.Tables[0].Rows.Count > 0)
                    {
                        if (Convert.ToInt32(DatosComprobante.Tables[0].Rows[0]["idProducto"]) == 52852)
                        {
                            if (Convert.ToInt32(DatosComprobante.Tables[0].Rows[0]["IdEstadoFacturacion"]) == (int)Enumerados.EstadosFacturacion.Pagado)
                            {
                                datos = new Tuple<int, string>(1, "comprobante correcto.");
                            }
                            else
                            {
                                datos = new Tuple<int, string>(0, "El comprobante se encuentra en estado :" + DatosComprobante.Tables[0].Rows[0]["Descripcion"] + ".");
                            }

                        }
                        else
                        {
                            datos = new Tuple<int, string>(0, "el comprobante pertenece a otro concepto de: " + DatosComprobante.Tables[0].Rows[0]["Nombre"].ToString());
                        }

                    }

                }

            }
            catch (Exception ex)
            {
                datos = new Tuple<int, string>(0, ex.Message);
            }
            return datos;
        }

        [HttpPost]
        public ActionResult ValidarComprobantedePago(String NroDocumento, String NroCorrelativo)
        {
            Tuple<int, String> datos = new Tuple<int, string>(0, null);
            try
            {
                datos = ValidarComprobante(NroDocumento, NroCorrelativo);
            }
            catch (Exception)
            {
                throw;
            }
            return Json(new { rsp = datos.Item1, mensaje = datos.Item2 });
        }

        //public async Task<ActionResult> Reporte(int idConstancia)//int Anio, String NroHistoria, int bd)
        //{
        //    string generacion_pdf = "";
        //    string sWebRootFolder = _hostingEnvironment.WebRootPath;
        //    var path = "";
        //    bool resulfirma = false;
        //    StringBuilder html = new StringBuilder(); 
        //    HtmlToPdf ohtml = new HtmlToPdf();
        //    try
        //    {                
        //        //String Ruta = "/ConstanciasRN/ReporteConstancia?&area=Estadistica&Anio=" + Anio.ToString() + "&NroHistoria=" + NroHistoria.ToString() + "&bd=" + bd.ToString();

        //        // PdfDocument obPdfDoc = ohtml.ConvertUrl("https://localhost:44364/ConstanciasRN/ReporteConstancia?&area=Estadistica&idConstancia="+ idConstancia.ToString());

        //        path = Path.Combine(sWebRootFolder, "ConstanciasRN", (idConstancia + (DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + "-C.pdf"));
        //        Comun.ClUtilirario cl = new Comun.ClUtilirario();

        //        PdfPageSize pageSize = (PdfPageSize)Enum.Parse(typeof(PdfPageSize), "A4", true);

        //        PdfPageOrientation pdfOrientationPortrait = (PdfPageOrientation)Enum.Parse(typeof(PdfPageOrientation), "Portrait", true);
        //        ohtml.Options.PdfPageOrientation = pdfOrientationPortrait;

        //        ohtml.Options.PdfPageSize = pageSize;

        //        string Ruta = Url.Action("ReporteConstancia", "ConstanciasRN", new { area = "Estadistica", idConstancia = idConstancia }, "http");
        //        PdfDocument obPdfDoc = ohtml.ConvertUrl(Ruta);
        //        //PdfDocument obPdfDoc = ohtml.ConvertUrl("https://localhost:44364/ConstanciasRN/ReporteConstancia?&area=Estadistica&idConstancia=" + idConstancia.ToString());

        //        //html.Append("<h1>CONSTANCIA DE NACIMIENTO</h1>");                
        //        //PdfDocument obPdfDoc = ohtml.ConvertHtmlString(html.ToString());
        //        obPdfDoc.Save(path);
        //        generacion_pdf = "Ok";
        //        if (generacion_pdf == "Ok")
        //        {
        //            //verificar creacion 
        //            Task<bool> Tbol = cl.UploadFile(path, Int32.Parse(idConstancia.ToString()), "C", Int32.Parse(idConstancia.ToString()));
        //            //quita creacion 
        //            //Espera resultado de la tarea, no termina hasta termine
        //            resulfirma = await Tbol;
        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        return Json(new { exep = e.ToString() });
        //       //return Json(new { estadoCreacion = generacion_pdf, ruta = path, exep = e.ToString(), resulfirma = resulfirma });
        //    }

        //    return Json(new { estadoCreacion = generacion_pdf, ruta = path, resulfirma = resulfirma });
        //    /*byte[] pdf = obPdfDoc.Save();
        //    MemoryStream ms = new MemoryStream();
        //    ms = new MemoryStream();
        //    ms.Write(pdf, 0, pdf.Length);
        //    ms.Position = 0;
        //    obPdfDoc.Close();
        //    return new FileStreamResult(ms,MediaTypeNames.Application.Pdf);*/
        //}


        [HttpPost]
        public async Task<ActionResult> GuardarConstanciaRn(ConstanciasRn objConstanciaRN)
        {
            int rsp = 0;
            bool bSesion = true /*,resp=false*/;
            ConstanciasRn rn = new ConstanciasRn();
            string respuesta = "Error al registrar evaluación del recien nacido.";
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                bSesion = false;
                respuesta = "Su sesión a finalizado.";
                return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
            }
            try
            {
                Tuple<int, String> datos = new Tuple<int, string>(0, null);
                datos = ValidarComprobante(objConstanciaRN.NroSerie, objConstanciaRN.NroCorrelativo);
                if (datos.Item1 == 0 && objConstanciaRN.idConstancia == 0)
                {
                    return Json(new { respuesta = datos.Item1, mensaje = datos.Item2, Session = bSesion });
                }
                objConstanciaRN.idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DalEvaluacionRN daoEvaluacionRn = new DalEvaluacionRN();
                rsp = daoEvaluacionRn.RegistrarConstanciaRn(objConstanciaRN);
                if (rsp > 0)
                {
                    rn.idConstancia = rsp;
                    var constancia = await GenerarConstanciaRn(rn);
                    if (constancia)
                    {
                        //resp = true;
                    }
                    respuesta = "Se registro la constancia con el nro " + rsp.ToString() + ".";
                }
            }
            catch (Exception ex)
            {
                respuesta = "Error al registrar," + ex.Message + ".";
            }
            return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
        }

        [HttpPost]
        public ActionResult ListaAtencionesDelDia(ConstanciasRn objConstanciaRN)
        {
            int rsp = 0;
            bool bSesion = true;
            string respuesta = "Error al registrar evaluación del recien nacido.";
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                bSesion = false;
                respuesta = "Su sesión a finalizado.";
                return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
            }
            try
            {
                Tuple<int, String> datos = new Tuple<int, string>(0, null);
                datos = ValidarComprobante(objConstanciaRN.NroSerie, objConstanciaRN.NroCorrelativo);
                if (datos.Item1 == 0)
                {
                    return Json(new { respuesta = datos.Item1, mensaje = datos.Item2, Session = bSesion });
                }
                objConstanciaRN.idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEvaluacionRN daoEvaluacionRn = new DalEvaluacionRN();
                rsp = daoEvaluacionRn.RegistrarConstanciaRn(objConstanciaRN);
                if (rsp > 0)
                {
                    respuesta = "Se registro la constancia con el nro " + rsp.ToString() + ".";
                }
            }
            catch (Exception ex)
            {
                respuesta = "Error al registrar," + ex.Message + ".";
            }
            return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
        }

        public ActionResult BuscarConstanciasRn(int NroHistoria, String Serie, String Correlativo, int idConstancia, DateTime FechaAtencion)
        {
            int rsp = 0;
            bool bSesion = true;
            string respuesta = "";
            DataSet ListaConstancias = new DataSet();
            DalEvaluacionRN daoRn = new DalEvaluacionRN();
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                bSesion = false;
                respuesta = "Su sesión a finalizado.";
                return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
            }
            try
            {
                ListaConstancias = daoRn.ListarConstanciaRn(NroHistoria, Serie, Correlativo, idConstancia, FechaAtencion);
            }
            catch (Exception)
            {
                throw;
            }
            return Json(new { respuesta = rsp, mensaje = respuesta, lstConstancias = ListaConstancias, Session = bSesion });
        }

        public ActionResult SeleccionarConstanciaRn(int idConstancia)
        {
            int rsp = 0;
            bool bSesion = true;
            string respuesta = "";
            DataSet DatosConstancias = new DataSet();
            DalEvaluacionRN daoRn = new DalEvaluacionRN();
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                bSesion = false;
                respuesta = "Su sesión a finalizado.";
                return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
            }
            try
            {
                DatosConstancias = daoRn.DatosPacientebyIdConstancia(idConstancia);
            }
            catch (Exception)
            {
                throw;
            }
            return Json(new { respuesta = rsp, mensaje = respuesta, lstConstancias = DatosConstancias, Session = bSesion });
        }

        //[HttpPost]
        //public async Task<ActionResult> GenerarConstanciaRn(ConstanciasRn objConstanciaRN)
        //{
        //    string rsp = "";
        //    bool bSesion = true;
        //    string respuesta = "Error al registrar la generación de constancia.";
        //    if (HttpContext.User.Identity.IsAuthenticated == false)
        //    {
        //        bSesion = false;
        //        respuesta = "Su sesión a finalizado.";
        //        return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
        //    }
        //    try
        //    {
        //        //objConstanciaRN.idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
        //        //DalEvaluacionRN daoEvaluacionRn = new DalEvaluacionRN();
        //        //rsp = daoEvaluacionRn.RegistrarImpresionSolicitudRn(objConstanciaRN);
        //        var resp = await GenerarPdf(objConstanciaRN.idConstancia);

        //        rsp = "Ok";
        //        //if (resp.estadoCreacion.ToString() == "Ok")
        //        //{
        //        respuesta = "Se registro la modificación correctamente.";
        //        //}
        //    }
        //    catch (Exception ex)
        //    {
        //        respuesta = "Error al registrar," + ex.Message + ".";
        //    }
        //    return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
        //}


        //public async Task<ActionResult> GenerarPdf(int idConstancia)//int Anio, String NroHistoria, int bd)
        //{
        //    string generacion_pdf = "";
        //    string sWebRootFolder = _hostingEnvironment.WebRootPath;
        //    var path = "";
        //    bool resulfirma = false;
        //    StringBuilder html = new StringBuilder();
        //    HtmlToPdf ohtml = new HtmlToPdf();
        //    //bool resp = false;
        //    try
        //    {
        //        //String Ruta = "/ConstanciasRN/ReporteConstancia?&area=Estadistica&Anio=" + Anio.ToString() + "&NroHistoria=" + NroHistoria.ToString() + "&bd=" + bd.ToString();

        //        // PdfDocument obPdfDoc = ohtml.ConvertUrl("https://localhost:44364/ConstanciasRN/ReporteConstancia?&area=Estadistica&idConstancia="+ idConstancia.ToString());

        //        path = Path.Combine(sWebRootFolder, "ConstanciasRN", (idConstancia + (DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + "-C.pdf"));
        //        Comun.ClUtilirario cl = new Comun.ClUtilirario();

        //        PdfPageSize pageSize = (PdfPageSize)Enum.Parse(typeof(PdfPageSize), "A4", true);

        //        PdfPageOrientation pdfOrientationPortrait = (PdfPageOrientation)Enum.Parse(typeof(PdfPageOrientation), "Portrait", true);
        //        ohtml.Options.PdfPageOrientation = pdfOrientationPortrait;

        //        ohtml.Options.PdfPageSize = pageSize;

        //        string Ruta = Url.Action("ReporteConstancia", "ConstanciasRN", new { area = "Estadistica", idConstancia = idConstancia }, "http");
        //        PdfDocument obPdfDoc = ohtml.ConvertUrl(Ruta);
        //        //PdfDocument obPdfDoc = ohtml.ConvertUrl("https://localhost:44364/ConstanciasRN/ReporteConstancia?&area=Estadistica&idConstancia=" + idConstancia.ToString());

        //        //html.Append("<h1>CONSTANCIA DE NACIMIENTO</h1>");                
        //        //PdfDocument obPdfDoc = ohtml.ConvertHtmlString(html.ToString());
        //        obPdfDoc.Save(path);
        //        generacion_pdf = "Ok";
        //        if (generacion_pdf == "Ok")
        //        {
        //            //verificar creacion 
        //            Task<bool> Tbol = cl.UploadFile(path, Int32.Parse(idConstancia.ToString()), "C", Int32.Parse(idConstancia.ToString()));
        //            //quita creacion 
        //            //Espera resultado de la tarea, no termina hasta termine
        //            resulfirma = await Tbol;
        //            //resp = true;
        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        return Json(new { exep = e.ToString() });
        //        //return e.ToString();
        //        //return false;
        //        //return Json(new { estadoCreacion = generacion_pdf, ruta = path, exep = e.ToString(), resulfirma = resulfirma });
        //    }

        //    return Json(new { estadoCreacion = generacion_pdf, ruta = path, resulfirma = resulfirma });
        //    //return true;
        //    /*byte[] pdf = obPdfDoc.Save();
        //    MemoryStream ms = new MemoryStream();
        //    ms = new MemoryStream();
        //    ms.Write(pdf, 0, pdf.Length);
        //    ms.Position = 0;
        //    obPdfDoc.Close();
        //    return new FileStreamResult(ms,MediaTypeNames.Application.Pdf);*/
        //}

        public ActionResult ImprimirConstanciaRn(ConstanciasRn objConstanciaRN)
        {
            string rsp = "";
            bool bSesion = true;
            string respuesta = "Error al registrar la generación de constancia.";
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                bSesion = false;
                respuesta = "Su sesión a finalizado.";
                return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
            }
            try
            {
                objConstanciaRN.idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEvaluacionRN daoEvaluacionRn = new DalEvaluacionRN();
                rsp = daoEvaluacionRn.RegistrarImpresionSolicitudRn(objConstanciaRN);
                respuesta = rsp;
                /*if (rsp > 0)
                {
                    respuesta = "Se registro la modificación correctamente.";
                }*/
            }
            catch (Exception ex)
            {
                respuesta = "Error al registrar," + ex.Message + ".";
            }
            return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
        }


        [HttpPost]
        public ActionResult EliminarConstanciaRn(int idConstancia, string motivoEliminacion)
        {
            int rsp = 0;
            bool bSesion = true;
            string respuesta = "Error al registrar respuesta de la  solicitud de constancia.";
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                bSesion = false;
                respuesta = "Su sesión a finalizado.";
                return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
            }
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalConstanciaRN daoConstanciaRn = new DalConstanciaRN();
                rsp = daoConstanciaRn.EliminarConstanciaRn(idConstancia, motivoEliminacion, idUsuario);
                if (rsp > 0)
                {
                    respuesta = "Se eliminó la constancia correctamente.";
                }
            }
            catch (Exception ex)
            {
                respuesta = "Error al eliminar, " + ex.Message + ".";
            }
            return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
        }


        [HttpPost]
        public async Task<Boolean> GenerarConstanciaRn(ConstanciasRn objConstanciaRN)
        {
            try
            {
                FormatoPdf pdf = new FormatoPdf();
                FirmaDigital firma = new FirmaDigital();
                StringBuilder stringHtml = new StringBuilder();
                string pageHtml;
                UtilitarioController utilitario = new UtilitarioController();
                bool resp;

                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                string usuario = HttpContext.Session.GetString("user").ToString().ToUpper();

                stringHtml = null;
                pageHtml = null;
                pageHtml = Url.Action("ReporteConstancia", "ConstanciasRN", new { area = "Emergencia", idConstancia = objConstanciaRN.idConstancia, usuario }, "http");

                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;
                pdf.cookies = HttpContext.Request.Headers["Cookie"].ToString();
                resp = await utilitario.GenerarDocumentoDigital(0, objConstanciaRN.idConstancia, 0, "CN", 0, pageHtml, stringHtml, idUsuario, pdf);

                return resp;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                return false;
            }
        }


        public ActionResult ReporteConstancia(int idConstancia, string usuario)
        {// int Anio, String NroHistoria, int bd) {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            DataSet DatosPaciente = new DataSet();
            DalEvaluacionRN daoRn = new DalEvaluacionRN();
            DatosPaciente = daoRn.DatosPacientebyIdConstancia(idConstancia);
            Encriptar objCripto = new Encriptar();

            var conex1 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("RutasServer:SERVER_FILES_IP");
            @ViewBag.ServerFiles = conex1.ToString();

            int anio = Int32.Parse(DatosPaciente.Tables[0].Rows[0]["AnioNac"].ToString());
            @ViewBag.Anio = anio;
            @ViewBag.NombreDecenio = DatosPaciente.Tables[0].Rows[0]["NombreDecenio"].ToString();
            @ViewBag.NombreAnio = DatosPaciente.Tables[0].Rows[0]["NombreAnio"].ToString();
            @ViewBag.NroConstancia = "N° " + idConstancia.ToString();

            @ViewBag.NroAsiento = DatosPaciente.Tables[0].Rows[0]["NroAsiento"];
            @ViewBag.NroFolio = DatosPaciente.Tables[0].Rows[0]["NroFolio"];

            @ViewBag.HistoriaMadre = DatosPaciente.Tables[0].Rows[0]["HistoriaMadre"];
            @ViewBag.NombresMadre = DatosPaciente.Tables[0].Rows[0]["NombresMadre"];
            @ViewBag.ApPaternoMadre = DatosPaciente.Tables[0].Rows[0]["ApPaternoMadre"];
            @ViewBag.ApMaternoMadre = DatosPaciente.Tables[0].Rows[0]["ApMaternoMadre"];
            @ViewBag.TipoDocMadre = DatosPaciente.Tables[0].Rows[0]["TipoDocIdentidadMadre"];
            @ViewBag.NroDocumentoMadre = DatosPaciente.Tables[0].Rows[0]["DocMadre"];
            @ViewBag.EdadMadre = DatosPaciente.Tables[0].Rows[0]["EdadMadre"];
            @ViewBag.EdadMadreMedida = DatosPaciente.Tables[0].Rows[0]["EdadMadre"] + " Años";
            @ViewBag.NacionalidadMadre = DatosPaciente.Tables[0].Rows[0]["NacionalidadMadre"].ToString().ToUpper();
            @ViewBag.DepartamentoMadre = DatosPaciente.Tables[0].Rows[0]["DepartamentoMadre"];
            @ViewBag.ProvinciaMadre = DatosPaciente.Tables[0].Rows[0]["ProvinciaMadre"];
            @ViewBag.DistritoMadre = DatosPaciente.Tables[0].Rows[0]["DistritoMadre"];
            @ViewBag.DireccionMadre = DatosPaciente.Tables[0].Rows[0]["DireccionDomicilioMadre"].ToString().ToUpper();

            @ViewBag.NombresPadre = DatosPaciente.Tables[0].Rows[0]["NombresPadre"];
            @ViewBag.ApPaternoPadre = DatosPaciente.Tables[0].Rows[0]["ApPaternoPadre"];
            @ViewBag.ApMaternoPadre = DatosPaciente.Tables[0].Rows[0]["ApMaternoPadre"];

            @ViewBag.NroHistoria = DatosPaciente.Tables[0].Rows[0]["NroHistoriaClinica"];
            @ViewBag.NroDocumento = DatosPaciente.Tables[0].Rows[0]["NroDocumento"];
            @ViewBag.FechaNac = DatosPaciente.Tables[0].Rows[0]["FechaNac"];
            @ViewBag.HoraNac = DatosPaciente.Tables[0].Rows[0]["HoraNac"];
            @ViewBag.Sexo = DatosPaciente.Tables[0].Rows[0]["Sexo"].ToString().ToUpper();
            @ViewBag.Peso = DatosPaciente.Tables[0].Rows[0]["Peso"].ToString();
            @ViewBag.PesoMedida = DatosPaciente.Tables[0].Rows[0]["Peso"] + " gr";
            @ViewBag.Talla = DatosPaciente.Tables[0].Rows[0]["Talla"].ToString();
            @ViewBag.TallaMedida = DatosPaciente.Tables[0].Rows[0]["Talla"] + " cm";
            @ViewBag.EdadGestacional = DatosPaciente.Tables[0].Rows[0]["EdadGestacional"];
            @ViewBag.EdadGestacionalMedida = DatosPaciente.Tables[0].Rows[0]["EdadGestacional"] + " Semanas"; ;
            @ViewBag.TipoParto = DatosPaciente.Tables[0].Rows[0]["TipoParto"].ToString().ToUpper();
            @ViewBag.Producto = DatosPaciente.Tables[0].Rows[0]["Producto"].ToString().ToUpper();
            @ViewBag.Condicion = DatosPaciente.Tables[0].Rows[0]["Condicion"].ToString().ToUpper();

            //jaa
            @ViewBag.Fetos = DatosPaciente.Tables[0].Rows[0]["Fetos"].ToString();
            @ViewBag.GemelarDes = DatosPaciente.Tables[0].Rows[0]["GemelarDes"].ToString();

            //



            DateTime FechaNac = DateTime.Parse(DatosPaciente.Tables[0].Rows[0]["FechaNac"].ToString());
            String[] FechaNacString = FechaNac.ToLongDateString().Split("de");
            @ViewBag.MesNac = FechaNacString[1];
            @ViewBag.DiaNac = FechaNac.Day;
            @ViewBag.AnioNac = FechaNac.Year;

            String[] Fecha = DateTime.Now.ToLongDateString().Split(',');
            @ViewBag.Fecha = Fecha[1];
            @ViewBag.Usuario = usuario;

            @ViewBag.CodeFirma = DatosPaciente.Tables[0].Rows[0]["code"];
            if (@ViewBag.CodeFirma != "")
            {
                QRCodeData qrCodeData = qrGenerator.CreateQrCode(@ViewBag.CodeFirma, QRCodeGenerator.ECCLevel.Q);
                QRCode qrCode = new QRCode(qrCodeData);

                using (Bitmap bitMap = qrCode.GetGraphic(20))
                {
                    using (MemoryStream ms = new MemoryStream())
                    {
                        bitMap.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                        @ViewBag.CodigoQR = ms.ToArray();
                    }
                }
            }

            if (anio >= 2020)
            {
                return PartialView("~/Views/Estadistica/ReporteConstanciaRn.cshtml");
            }
            else
            {
                return PartialView("~/Views/Estadistica/ReporteConstancia2Rn.cshtml");
            }

            /*
            if (anio >= 2020)
            {
                return PartialView("~/Views/Estadistica/ReporteConstanciaRn.cshtml");
            } else if(anio >= 2005 && anio < 2020)
            {
                return PartialView("~/Views/Estadistica/ReporteConstancia2Rn.cshtml");
            } else
            {
                return PartialView("~/Views/Estadistica/ReporteConstancia3Rn.cshtml");
            }
            */

        }

    }
}