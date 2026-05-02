using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using SelectPdf;
using WebAppMaternidad.Areas.Comun;
using System.Diagnostics;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Estadistica
{
    public class SolicitudConstanciasRNController : BaseController
    {

        private IWebHostEnvironment _hostingEnvironment;

        public SolicitudConstanciasRNController(IWebHostEnvironment env)
        {
            _hostingEnvironment = env;
        }

        public ActionResult BuscarSolicitudesRn(int NroHistoria, String nroDocumento, int idEstadoSolicitud, int idSolicitud, DateTime FechaAtencion)
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
                ListaConstancias = daoRn.ListarSolicitudesRn(NroHistoria, nroDocumento, idEstadoSolicitud, idSolicitud, FechaAtencion);
            }
            catch (Exception)
            {
                throw;
            }
            return Json(new { respuesta = rsp, mensaje = respuesta, lstConstancias = ListaConstancias, Session = bSesion });
        }

        public ActionResult SeleccionarSolicitudRn(int idSolicitud)
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
                DatosConstancias = daoRn.DatosPacientebyIdSolicitud(idSolicitud);
            }
            catch (Exception)
            {
                throw;
            }
            return Json(new { respuesta = rsp, mensaje = respuesta, lstConstancias = DatosConstancias, Session = bSesion });
        }

        [HttpPost]
        public ActionResult GuardarSolicitudRn(SolicitudConstanciasRN objSolicitudRN)
        {
            int rsp = 0;
            bool bSesion = true;
            string respuesta = "Error al registrar solicitud de constancia.";
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                bSesion = false;
                respuesta = "Su sesión a finalizado.";
                return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
            }
            try
            {                
                objSolicitudRN.idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEvaluacionRN daoEvaluacionRn = new DalEvaluacionRN();
                rsp = daoEvaluacionRn.RegistrarSolicitudConstanciaRn(objSolicitudRN);
                if (rsp > 0)
                {
                    respuesta = "Se registro la solicitud con el nro " + rsp.ToString() + ".";
                }
            }
            catch (Exception ex)
            {
                respuesta = "Error al registrar," + ex.Message + ".";
            }
            return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
        }

        [HttpGet]
        public async Task<ActionResult> ListarEstadosSolicitud()
        {
            DataSet lstMetodo;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMetodo = await daoCitas.DevuelveDSCombo("ListarEstadosSolicitud");
            return Json(lstMetodo);
        }
        /*
        [HttpPost]
        public ActionResult SeleccionarConstanciasRN(int IdSolicitud)
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
                ListaConstancias = daoRn.ListarSolicitudesRn(NroHistoria, nroDocumento, idEstadoSolicitud, idSolicitud, FechaAtencion);
            }
            catch (Exception)
            {
                throw;
            }
            return Json(new { respuesta = rsp, mensaje = respuesta, lstConstancias = ListaConstancias, Session = bSesion });
        }
        */

        [HttpPost]
        public async Task<ActionResult> RegistrarRespuestaSolicitudRn(SolicitudConstanciasRN objSolicitudRN)
        {
            int rsp = 0;
            bool bSesion = true, resp = false;
            ConstanciasRn rn = new ConstanciasRn();
            string respuesta = "Error al registrar respuesta de la  solicitud de constancia.";
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                bSesion = false;
                respuesta = "Su sesión a finalizado.";
                return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
            }
            try
            {
                objSolicitudRN.idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEvaluacionRN daoEvaluacionRn = new DalEvaluacionRN();
                rsp = await daoEvaluacionRn.RegistrarRespuestaSolicitudRn(objSolicitudRN);
                if (rsp >= 0)
                {
                    rn.idConstancia = rsp;
                    if (objSolicitudRN.bAprobado)
                    {
                        var constancia = await GenerarConstanciaRn(rn);
                        if (constancia)
                        {
                            resp = true;
                        }
                        
                    }
                    else
                    {
                        resp = true;
                    }
                    respuesta = "Se registro la modificación correctamente.";
                } 
            }
            catch (Exception ex)
            {
                respuesta = "Error al registrar," + ex.Message + ".";
            }
            return Json(new { respuesta = resp, mensaje = respuesta, Session = bSesion });
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
        //            respuesta = "Se registro la modificación correctamente.";
        //        //}
        //    }
        //    catch (Exception ex)
        //    {
        //        respuesta = "Error al registrar," + ex.Message + ".";
        //    }
        //    return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
        //}


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
                //string usuario = HttpContext.Session.GetString("usuario");
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


        public async Task<ActionResult> GenerarPdf(int idConstancia)//int Anio, String NroHistoria, int bd)
        {
            string generacion_pdf = "";
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            var path = "";
            bool resulfirma = false;
            StringBuilder html = new StringBuilder();
            HtmlToPdf ohtml = new HtmlToPdf();
            //bool resp = false;
            try
            {
                //String Ruta = "/ConstanciasRN/ReporteConstancia?&area=Estadistica&Anio=" + Anio.ToString() + "&NroHistoria=" + NroHistoria.ToString() + "&bd=" + bd.ToString();

                // PdfDocument obPdfDoc = ohtml.ConvertUrl("https://localhost:44364/ConstanciasRN/ReporteConstancia?&area=Estadistica&idConstancia="+ idConstancia.ToString());

                path = Path.Combine(sWebRootFolder, "ConstanciasRN", (idConstancia + (DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + "-C.pdf"));
                Comun.ClUtilirario cl = new Comun.ClUtilirario();

                PdfPageSize pageSize = (PdfPageSize)Enum.Parse(typeof(PdfPageSize), "A4", true);

                PdfPageOrientation pdfOrientationPortrait = (PdfPageOrientation)Enum.Parse(typeof(PdfPageOrientation), "Portrait", true);
                ohtml.Options.PdfPageOrientation = pdfOrientationPortrait;

                ohtml.Options.PdfPageSize = pageSize;

                string Ruta = Url.Action("ReporteConstancia", "ConstanciasRN", new { area = "Estadistica", idConstancia = idConstancia }, "http");
                PdfDocument obPdfDoc = ohtml.ConvertUrl(Ruta);
                //PdfDocument obPdfDoc = ohtml.ConvertUrl("https://localhost:44364/ConstanciasRN/ReporteConstancia?&area=Estadistica&idConstancia=" + idConstancia.ToString());

                //html.Append("<h1>CONSTANCIA DE NACIMIENTO</h1>");                
                //PdfDocument obPdfDoc = ohtml.ConvertHtmlString(html.ToString());
                obPdfDoc.Save(path);
                generacion_pdf = "Ok";
                if (generacion_pdf == "Ok")
                {
                    //verificar creacion 
                    Task<bool> Tbol = cl.UploadFile(path, Int32.Parse(idConstancia.ToString()), "C", Int32.Parse(idConstancia.ToString()));
                    //quita creacion 
                    //Espera resultado de la tarea, no termina hasta termine
                    resulfirma = await Tbol;
                    //resp = true;
                }
            }
            catch (Exception e)
            {
                return Json(new { exep = e.ToString() });
                //return e.ToString();
                //return false;
                //return Json(new { estadoCreacion = generacion_pdf, ruta = path, exep = e.ToString(), resulfirma = resulfirma });
            }

            return Json(new { estadoCreacion = generacion_pdf, ruta = path, resulfirma = resulfirma });
            //return true;
            /*byte[] pdf = obPdfDoc.Save();
            MemoryStream ms = new MemoryStream();
            ms = new MemoryStream();
            ms.Write(pdf, 0, pdf.Length);
            ms.Position = 0;
            obPdfDoc.Close();
            return new FileStreamResult(ms,MediaTypeNames.Application.Pdf);*/
        }


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
        public ActionResult EliminarSolicitud(int idSolicitud, int idConstancia, string motivoEliminacion)
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
                rsp = daoConstanciaRn.EliminarSolicitudConstanciaRn(idSolicitud, idConstancia, motivoEliminacion, idUsuario);
                if (rsp > 0)
                {
                    respuesta = "Se eliminó la solicitud correctamente.";
                }
            }
            catch (Exception ex)
            {
                respuesta = "Error al eliminar, " + ex.Message + ".";
            }
            return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
        }
    }
}