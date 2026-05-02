using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System.Net.Mime;
using SelectPdf;
using System.Text;
using Microsoft.Extensions.Configuration;
//using NPOI.HPSF;
using System.Security.Policy;
using WebAppMaternidad.Areas.Comun;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Hospitalizacion
{
    public class NotaIngresoController : BaseController
    {
        public IActionResult Index()
        {
            return View();
        }
        //[HttpPost]
        //public async Task<ActionResult> ListaPacientesHospitalizadosByCuentaHcApellidoPatDniFecha(int idCuentaAtencion, int historiaClinica, string apellidoPaterno, string fechaIngreso, string dni, int idServicio, string fechaTransferencia) //JDELGADO010
        //{
        //    if (HttpContext.User.Identity.IsAuthenticated == false)
        //    {
        //        return Json(new { session = false });
        //    }

        //    DataSet lstPacientesHops;
        //    DalHospitalizacion daoHosp = new DalHospitalizacion();
        //    lstPacientesHops = await daoHosp.ListaPacientesHospitalizadosByCuentaHcApellidoPatDniFecha(idCuentaAtencion,historiaClinica,apellidoPaterno,fechaIngreso,dni,idServicio, fechaTransferencia);
        //    return Json(new { lstPacientesHops=lstPacientesHops, session=true });
        //}

        [HttpPost]
        public async Task<ActionResult> RegitraModificaNotaIngreso( // version nueva // JDELGADO003-M
            EvaluacionEmergencia objEvalEmg, ExamenGinecoObstetra objGiencoObst, Triaje obTriaje, int idServicio, int idNumero,
            int idNumeroSiguiente, int estadoBtn, String lstDiagnosticos, string lstRecetaRx, int idRecetaRx, string lstRecetaEcoObs, int idRecetaEcoObs,
            string lstRecetaEcoGeneral, int idRecetaEcoGene, string lstRecetaAnatoPatologica, int idRecetaAnaPatologica, string lstRecetaPatalogiaClinica,
            int idRecetaPatoClinica, string lstRecetaBancoSangre, int idRecetaBancoSangre, string lstRecetaFarmacia, int idRecetaFarmacia, string fechaVigencia,
            int idCuentaAtencion, AtencionesDatosAdicionales objDatosAdic, EvaluacionEmergenciaDetalle objEvalEmergDeta, int idMedico)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return Json(new { session = false });
                }


                DalAtenciones daoAtenciones = new DalAtenciones();
                DalUtilitario daoUtil = new DalUtilitario();
                //DalRecetas daoRecetas = new DalRecetas();
                DalTriaje daoTriaje = new DalTriaje();
                DalParametros daoParametros = new DalParametros();

                //bool resp = false;
                Boolean resp/*, resAteCE, rspRx, rspEcoObs, rspEcoGeneral, respAnaPatolo, respPatoClinica, respBancoSangre, respFarmacia*/;
                //string mensajeRectas, fechaReceta;
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                objEvalEmg.IdUsuario = idUsuario;
                objGiencoObst.IdUsuario = idUsuario;
                obTriaje.idUsuario = idUsuario;

                if (estadoBtn == 0)
                {
                    objEvalEmg.idNumero = (idNumero == 0 ? 1 : idNumero);
                    objGiencoObst.idNumero = (idNumero == 0 ? 1 : idNumero);
                    obTriaje.idNumero = (idNumero == 0 ? 1 : idNumero);
                }

                else
                {
                    objEvalEmg.idNumero = (idNumeroSiguiente == 0 ? 1 : idNumeroSiguiente);
                    objGiencoObst.idNumero = (idNumeroSiguiente == 0 ? 1 : idNumeroSiguiente);
                    obTriaje.idNumero = (idNumeroSiguiente == 0 ? 1 : idNumeroSiguiente);
                }

                objEvalEmg.idServicio = idServicio;
                objGiencoObst.idServicio = idServicio;

                var lstobjDiagnosticos = JsonConvert.DeserializeObject<List<Diagnosticos>>(lstDiagnosticos);

                try
                {
                    resp = await daoAtenciones.InsertaEvaluacionEmergenciaHospitalizacion(objEvalEmg); // JDELGADO001.2
                    resp = await daoAtenciones.InsertaExamenGinecoObstetraHospitalizacion(objGiencoObst); // JDELGADO001.2
                    resp = await daoUtil.insertaDiagnosticosPorEvaluacionNotaIngreso(objEvalEmg.IdAtencion, (int)Enumerados.TiposDiagnostico.HospitalizacionIngreso, idUsuario, lstobjDiagnosticos, objEvalEmg.idNumero, idServicio); // JDELGADO003-M
                    resp = await daoTriaje.InsertaTriajeHospEmeg(obTriaje); // JDELGADO001.2
                    resp = await daoAtenciones.InsertUpdateAtencionDatosAdicionales(objDatosAdic); // JDELGADO001.2
                }
                catch (Exception e)
                {
                    return Json(new { session = true, mensaje = e.Message + "- Bloque de registro 1" });
                }

                objEvalEmergDeta.IdNumero = objEvalEmg.idNumero;
                objEvalEmergDeta.IdUsuario = idUsuario;
                objEvalEmergDeta.IdAtencion = objEvalEmg.IdAtencion;
                objEvalEmergDeta.PlandeTrabajo = objDatosAdic.PlanTrabajo;
                objEvalEmergDeta.Indicaciones = objDatosAdic.Tratamiento;
                objEvalEmergDeta.idservicio = objEvalEmg.idServicio;

                try
                {
                    resp = await daoAtenciones.InsertUpdateEvaluacionEmergenciaDetalle(objEvalEmergDeta); // JDELGADO001.2
                }
                catch (Exception e)
                {
                    return Json(new { session = true, mensaje = e.Message + "- Bloque de registro 2" });
                }

                
                return Json(new { session = true, respuesta = resp, mensaje = "" /*, msjReceta = mensajeRectas, listRecetas = lsrectasByCuenta*/ });
            }
            catch (Exception ex)
            {
                // Qué ha sucedido
                var mensaje = "<'_'> Error message: " + ex.Message;

                // Información sobre la excepción interna
                if (ex.InnerException != null)
                {
                    mensaje = mensaje + " Inner exception: " + ex.InnerException.Message;
                }

                // Dónde ha sucedido
                mensaje = mensaje + " Stack trace: " + ex.StackTrace;
                return Json(new { session = true, mensaje = mensaje });
            }


        }
      
        [HttpPost]
        public async Task<ActionResult> listaCantidadAtencionNotaIngresoEmgHos(int idAtencion, int idNumero, int idServicio)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet lstNroAtencion;
            DalAtenciones daoAten = new DalAtenciones();
            lstNroAtencion = await daoAten.listaCantidadAtencionNotaIngresoEmgHos(idAtencion, idNumero, idServicio);
            return Json(new { lstNroAtencion = lstNroAtencion, session = true });
        }

        public async Task<ActionResult> ListaEvalEmergenciaEmeHospiTotalesByServicio(int idAtencion, int idNumero, int idServicio) // JDELGADO J0 NOTA INGRESO Convertir metodo asyncrono
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet lstAtencionEvalEmergTotal;
            DalAtenciones daoAten = new DalAtenciones();
            lstAtencionEvalEmergTotal = await daoAten.ListaEvalEmergenciaEmeHospiTotalesByServicio(idAtencion, idNumero, idServicio); // JDELGADO J0 AWAIT SENTENCES
            return Json(new { lstAtencionEvalEmergTotal = lstAtencionEvalEmergTotal, session = true });
        }

        public async Task<ActionResult> ListaEvalEmergenciaEmeHospi(int idAtencion, int idNumero, int idServicio)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet lstAtencionEvalEmerg;
            DalAtenciones daoAten = new DalAtenciones();
            lstAtencionEvalEmerg = await daoAten.ListaEvalEmergenciaEmeHospi(idAtencion, idNumero, idServicio);
            return Json(new { lstAtencionEvalEmerg = lstAtencionEvalEmerg, session = true });
        }

        public async Task<ActionResult> ListaGinecoObstetraEmeHospi(int idAtencion, int idNumero, int idServicio)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet lstAtencionGinecoEmerg;
            DalAtenciones daoAten = new DalAtenciones();
            lstAtencionGinecoEmerg = await daoAten.ListaGinecoObstetraEmeHospi(idAtencion, idNumero, idServicio);
            return Json(new { lstAtencionGinecoEmerg = lstAtencionGinecoEmerg, session = true });
        }
        [HttpPost]
        public ActionResult ListaEvaluacionesEmgHospByServico(int idCuentaAtencion, int historiaClinica, string apellidoPaterno, string fechaIngreso, string dni, int idServicio)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet lstPacientesEvalEmgHops;
            DalHospitalizacion daoHosp = new DalHospitalizacion();
            lstPacientesEvalEmgHops = daoHosp.ListaEvaluacionesEmgHospByServico(idCuentaAtencion, historiaClinica, apellidoPaterno, fechaIngreso, dni, idServicio);
            return Json(new { lstPacientesEvalEmgHops = lstPacientesEvalEmgHops, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> GuardarEvaluacionDetalleNeo(EvaluacionNeonatalDetalle objEva, // para despues nota ingreso con evaluaciones neo
                                                                 String lstDiagnosticos,
                                                                 int idCuentaAtencion, int idServicio, int idMedico,
                                                                 EvaluacionEmergencia objEvalEmg

                                                                 )
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            if (objEva.IdUsuario != 0)
            {
                if (objEva.IdUsuario != int.Parse(HttpContext.Session.GetString("idusu")))
                {
                    return Json(new { respuesta = false, session = true, mensaje = "Usted no puede modificar la evaluación de otro médico.", estado = false });
                }
            }


            //string mensajeRectas, fechaReceta;
            Boolean resp/*, respPatoClinica, respAnaPatolo, respBancoSangre, rspEcoObs, rspEcoGeneral, rspRx, respFarmacia*/;
            DataSet ds;
            DalEvaluacionNeonatal daoEvaluacion = new DalEvaluacionNeonatal();
            DalUtilitario daoUtil = new DalUtilitario();
            DalRecetas daoRecetas = new DalRecetas();
            DalParametros daoParametros = new DalParametros();
            DalAtenciones daoAtenciones = new DalAtenciones();

            Boolean informe/*, evaluacion*/;

            var lstobjDiagnosticos = JsonConvert.DeserializeObject<List<Diagnosticos>>(lstDiagnosticos);

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            //resp = await daoAtenciones.InsertaEvaluacionEmergenciaHospitalizacion(objEvalEmg);

            ds = await daoEvaluacion.GuardarEvaluacionDetalle(objEva, idUsuario);
            resp = await daoUtil.insertaDiagnosticosPorEvaluacionNotaIngreso(objEva.IdAtencion, (int)Enumerados.TiposDiagnostico.HospitalizacionIngreso, idUsuario, lstobjDiagnosticos, objEva.NroEvaluacion, idServicio);

            informe = await GenerarHojaEvaluacion(idCuentaAtencion, objEva.IdAtencion, idServicio, objEva.NroEvaluacion);   //GENERAR PDF HOJA EVALUACION


            return Json(new { respuesta = ds, session = true, estado = true, mensaje = "" /*, msjReceta = mensajeRectas, listRecetas = lsrectasByCuenta*/ });
        }

        [HttpPost]
        public async Task<Boolean> GenerarHojaEvaluacion(int idCuenta, int idAtencion, int idServicio, int eval)
        {
            //string rsp = "";
            //bool bSesion = true;
            string respuesta = "Error al registrar la generación de constancia.";
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                //bSesion = false;
                respuesta = "Su sesión a finalizado.";
                //return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
                return false;
            }
            try
            {
                //objConstanciaRN.idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                //DalEvaluacionRN daoEvaluacionRn = new DalEvaluacionRN();
                //rsp = daoEvaluacionRn.RegistrarImpresionSolicitudRn(objConstanciaRN);
                var resp = await GenerarPdf(idCuenta, idAtencion, idServicio, eval);

                //rsp = "Ok";
                //if (resp.estadoCreacion.ToString() == "Ok")
                //{
                respuesta = "Se registro la modificación correctamente.";
                //}
            }
            catch (Exception ex)
            {
                respuesta = "Error al registrar," + ex.Message + ".";
            }
            //return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
            return true;
        }

        public async Task<ActionResult> GenerarPdf(int idCuenta, int idAtencion, int idServicio, int eval)//int Anio, String NroHistoria, int bd)
        {
            string generacion_pdf = "";
            //string sWebRootFolder = _hostingEnvironment.WebRootPath;
            string sWebRootFolder = "";

            var path = "";
            bool resulfirma = false;
            StringBuilder html = new StringBuilder();
            HtmlToPdf ohtml = new HtmlToPdf();
            //bool resp = false;
            string usuario;
            string tipo;

            Conexion con = new Conexion();
            sWebRootFolder = con.ObtenerServidorArchivos();

            try
            {
                usuario = HttpContext.Session.GetString("usuario");
                tipo = "NEOE-" + eval;
                //String Ruta = "/ConstanciasRN/ReporteConstancia?&area=Estadistica&Anio=" + Anio.ToString() + "&NroHistoria=" + NroHistoria.ToString() + "&bd=" + bd.ToString();

                // PdfDocument obPdfDoc = ohtml.ConvertUrl("https://localhost:44364/ConstanciasRN/ReporteConstancia?&area=Estadistica&idConstancia="+ idConstancia.ToString());

                path = Path.Combine(sWebRootFolder, "HojasEvaluacionEmergencia", (idCuenta + (DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + tipo + ".pdf"));
                Console.WriteLine("path: " + path);
                Comun.ClUtilirario cl = new Comun.ClUtilirario();

                PdfPageSize pageSize = (PdfPageSize)Enum.Parse(typeof(PdfPageSize), "A4", true);

                PdfPageOrientation pdfOrientationPortrait = (PdfPageOrientation)Enum.Parse(typeof(PdfPageOrientation), "Portrait", true);
                ohtml.Options.PdfPageOrientation = pdfOrientationPortrait;
                ohtml.Options.PdfPageSize = pageSize;
                ohtml.Options.MarginLeft = 20;
                ohtml.Options.MarginRight = 20;
                ohtml.Options.MarginTop = 20;
                ohtml.Options.MarginBottom = 20;
                ohtml.Options.WebPageWidth = 793;
                ohtml.Options.WebPageHeight = 1122;
                //ohtml.Options.AutoFitWidth = HtmlToPdfPageFitMode.AutoFit;

                //string Ruta = Url.Action("InformeEvaluacion", "EvaluacionNeonatal", new { area = "Emergencia", idAtencion, idServicio, tipo = "NEO", usuario }, "http");
                string Ruta = Url.Action("InformeEvaluacion", "EvaluacionNeonatal", new { area = "Emergencia", idAtencion, idServicio, eval, usuario }, "http");
                PdfDocument obPdfDoc = ohtml.ConvertUrl(Ruta);
                //PdfDocument obPdfDoc = ohtml.ConvertUrl("https://localhost:44364/ConstanciasRN/ReporteConstancia?&area=Estadistica&idConstancia=" + idConstancia.ToString());

                //html.Append("<h1>CONSTANCIA DE NACIMIENTO</h1>");                
                //PdfDocument obPdfDoc = ohtml.ConvertHtmlString(html.ToString());
                obPdfDoc.Save(path);
                generacion_pdf = "Ok";
                if (generacion_pdf == "Ok")
                {
                    //verificar creacion 
                    Task<bool> Tbol = cl.UploadFile(path, Int32.Parse(idCuenta.ToString()), tipo, Int32.Parse(idCuenta.ToString()));
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


        //public async Task<ActionResult> GenerarHojaReevaluacionNI(int idCuentaAtencion, int idItem, int idServicio) // JDELGADO003-C
        //{
        //    try
        //    {
        //        StringBuilder html = new StringBuilder();
        //        html = await GeneraHosReevaluacionHTML(idCuentaAtencion, idItem, idServicio);
        //        var stream = GeneraPdfMemoy(html, 1);
        //        return stream;
        //    }
        //    catch (Exception e)
        //    {
        //        return Json(new { error = e.ToString() });
        //    }
        //}

        [HttpPost]
        public async Task<Boolean> GenerarHojaEvaluacionNI(int idCuenta, int idAtencion, int idServicio, int eval)
        {
            bool resp = false;
            string respuesta = "Error al registrar la generación de constancia.";
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                //bSesion = false;
                respuesta = "Su sesión a finalizado.";
                //return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
                return false;
            }
            try
            {

                FormatoPdf pdf = new FormatoPdf();
                FirmaDigital firma = new FirmaDigital();
                StringBuilder stringHtml = new StringBuilder();
                string pageHtml;
                UtilitarioController utilitario = new UtilitarioController();

                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                stringHtml = null;
                pageHtml = null;

                var tipo = "HOSPNI";
                var usuario = HttpContext.Session.GetString("usuario");

                pageHtml = Url.Action("HojaReevaluacionNI", "NotaIngreso", new { area = "Hospitalizacion", idCuenta, idServicio, eval, usuario }, "http");

                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;
                pdf.cookies = HttpContext.Request.Headers["Cookie"].ToString();


                resp = await utilitario.GenerarDocumentoDigital(idCuenta, idAtencion, 0, tipo, eval, pageHtml, stringHtml, idUsuario, pdf);

                //var resp = await GenerarPdfV2(idCuenta, idAtencion, idServicio, eval);

                //rsp = "Ok";
                //if (resp.estadoCreacion.ToString() == "Ok")
                //{
                respuesta = "Se registro la modificación correctamente.";
                //}
            }
            catch (Exception ex)
            {
                respuesta = "Error al registrar," + ex.Message + ".";
            }
            //return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
            return resp;
        }

        public async Task<ActionResult> HojaReevaluacionNI(int idCuenta, int idServicio, int eval, string usuario)
        {

            DalAtenciones daoAtenciones = new DalAtenciones();
            DalTriaje dalTriaje = new DalTriaje();

            DataSet lsTriaje, lsGinecoObstetra, lsEvalEmergencia, lsAtencion, lsEvalEmergDetalle, Diagnosticos;

            EvaluacionEmergenciaDetalle objEvlEmDet = new EvaluacionEmergenciaDetalle();
            Triaje triaje = new Triaje();
            int idAtencion = 0;
            String feto = "", valor = "";

            lsAtencion = await daoAtenciones.ListaAtencionByIdCuentaAtencion(idCuenta);

            idAtencion = Int32.Parse(lsAtencion.Tables[0].Rows[0]["idAtencion"].ToString());

            triaje.idAtencion = (Convert.ToInt32(idAtencion));
            triaje.idNumero = eval;
            triaje.idServicio = idServicio;

            objEvlEmDet.idservicio = idServicio;
            objEvlEmDet.IdNumero = eval;
            objEvlEmDet.IdAtencion = Convert.ToInt32(idAtencion);
            lsEvalEmergDetalle = await daoAtenciones.ListaEvaluacionEmergenciaDetalle(objEvlEmDet);


            lsTriaje = await dalTriaje.ListaTriajeEmgHosp(triaje);
            lsGinecoObstetra = await daoAtenciones.ListaGinecoObstetraEmeHospi(Convert.ToInt32(idAtencion), eval, idServicio);
            lsEvalEmergencia = await daoAtenciones.ListaEvalEmergenciaEmeHospi(Convert.ToInt32(idAtencion), eval, idServicio);
            
            Diagnosticos = await daoAtenciones.AtencionesDiagnosticosSeleccionarPorAtencionPorNumeroEvaluacion(idAtencion, (int)Enumerados.TiposDiagnostico.HospitalizacionIngreso, idServicio, eval);

            DataTable dtDx = Diagnosticos.Tables[0];

            if (lsGinecoObstetra.Tables[0].Rows[0]["lTipoEmbarazo"].ToString() == "1")
            {

                feto = "<b><u class='dotted'>FETO UNICO:</u> </b><br>";
                valor = (lsGinecoObstetra.Tables[0].Rows[0]["lSituacion"].ToString() == "1") ? "Longitudinal" : (lsGinecoObstetra.Tables[0].Rows[0]["lSituacion"].ToString() == "0") ? "Transversal" : "Ninguno";
                feto = feto + "<b>Situación:  </b>" + valor + "<br>";

                valor = (lsGinecoObstetra.Tables[0].Rows[0]["lPosicion"].ToString() == "1") ? "Derecha" : (lsGinecoObstetra.Tables[0].Rows[0]["lPosicion"].ToString() == "0") ? "Izquierda" : "Ninguno";
                feto = feto + "<b>Posición:  </b>" + valor + "<br>";

                valor = (lsGinecoObstetra.Tables[0].Rows[0]["lPresentacion"].ToString() == "1") ? "Cefálica" : (lsGinecoObstetra.Tables[0].Rows[0]["lPresentacion"].ToString() == "0") ? "Podálica" : "Ninguno";
                feto = feto + "<b>Presentación:  </b>" + valor + "<br>";



            }
            else
            {
                feto = "<table font size=8pt border='1' style='width: 100%'> " +
                                        "<tr><td colspan='4'><b>FETO MULTIPLE</b></td></tr>" +
                                        "<tr><td><b></b></td><td><b>SiPoPr</b></td><td><b>LFC</b></td><td><b>MF</b></td></tr>" +
                                        "<tr><td><b>F01</b></td><td>" + lsGinecoObstetra.Tables[0].Rows[0]["dF1Spp"].ToString() + "</td><td>" + lsGinecoObstetra.Tables[0].Rows[0]["lF1Lcf"].ToString() + "</td><td>" + lsGinecoObstetra.Tables[0].Rows[0]["mfF01"].ToString() + "</td></tr>" +
                                        "<tr><td><b>F02</b></td><td>" + lsGinecoObstetra.Tables[0].Rows[0]["dF2Spp"].ToString() + "</td><td>" + lsGinecoObstetra.Tables[0].Rows[0]["lF2Lcf"].ToString() + "</td><td>" + lsGinecoObstetra.Tables[0].Rows[0]["mfF02"].ToString() + "</td></tr>" +
                                        "<tr><td><b>F03</b></td><td>" + lsGinecoObstetra.Tables[0].Rows[0]["dF3Spp"].ToString() + "</td><td>" + lsGinecoObstetra.Tables[0].Rows[0]["lF3Lcf"].ToString() + "</td><td>" + lsGinecoObstetra.Tables[0].Rows[0]["mfF03"].ToString() + "</td></tr>" +
                                    " </table> ";
            }

            ViewBag.FechaIngreso = lsAtencion.Tables[0].Rows[0]["FechaIngreso"].ToString();
            ViewBag.HoraInicioAtencion = lsAtencion.Tables[0].Rows[0]["horaInicioAtencion"].ToString();
            ViewBag.Edad = lsAtencion.Tables[0].Rows[0]["Edad"].ToString();
            ViewBag.GMotiA = lsEvalEmergencia.Tables[0].Rows[0]["gMotiA"].ToString();
            ViewBag.PMotiA = lsEvalEmergencia.Tables[0].Rows[0]["pMotiA"].ToString();
            ViewBag.FechaUR = lsEvalEmergencia.Tables[0].Rows[0]["FechaUR"].ToString();
            ViewBag.FechaPP = lsEvalEmergencia.Tables[0].Rows[0]["FechaPP"].ToString();
            ViewBag.DesServicio = lsAtencion.Tables[0].Rows[0]["DesServicio"].ToString();

            ViewBag.EnfermedadA = lsEvalEmergencia.Tables[0].Rows[0]["enfermedadA"].ToString();
            ViewBag.Sintomas = lsEvalEmergencia.Tables[0].Rows[0]["Sintomas"].ToString();

            ViewBag.FechaUR = lsEvalEmergencia.Tables[0].Rows[0]["fechaUR"].ToString();
            ViewBag.FechaEco = lsEvalEmergencia.Tables[0].Rows[0]["fechaEco"].ToString();
            ViewBag.FechaPP = lsEvalEmergencia.Tables[0].Rows[0]["fechaPP"].ToString();
            ViewBag.EdadGestacional = lsEvalEmergencia.Tables[0].Rows[0]["edadGestacional"].ToString();
            //ViewBag.edadGestacional = lsEvalEmergencia.Tables[0].Rows[0]["edadGestacional"].ToString();
            ViewBag.Cnp = lsEvalEmergencia.Tables[0].Rows[0]["cnp"].ToString();
            ViewBag.Antecedentes = lsEvalEmergencia.Tables[0].Rows[0]["antecedentes"].ToString();
            ViewBag.Ram = lsEvalEmergencia.Tables[0].Rows[0]["ram"].ToString();
            ViewBag.TransfucionSangre = ((lsEvalEmergencia.Tables[0].Rows[0]["transfucionSangre"].ToString()) == "1" ? "SI" : "NO");
            ViewBag.AntecedentesQuirurgicos = lsEvalEmergencia.Tables[0].Rows[0]["antecedentesQuirurgicos"].ToString();

            ViewBag.TriajePresion = lsTriaje.Tables[0].Rows[0]["TriajePresion"];
            ViewBag.TriajeFrecuenciaCardiaca = lsTriaje.Tables[0].Rows[0]["TriajeFrecuenciaCardiaca"];
            ViewBag.TriajeFrecuenciaRespiratoria = lsTriaje.Tables[0].Rows[0]["TriajeFrecuenciaRespiratoria"];
            ViewBag.TriajeTemperatura = lsTriaje.Tables[0].Rows[0]["TriajeTemperatura"];
            ViewBag.TriajePeso = lsTriaje.Tables[0].Rows[0]["TriajePeso"];
            ViewBag.imc = lsTriaje.Tables[0].Rows[0]["imc"];

            ViewBag.lEstadoGeneral = ((lsGinecoObstetra.Tables[0].Rows[0]["lEstadoGeneral"].ToString() == "1") ? "Normal" : "Anormal");
            ViewBag.dEstadoGeneral = ((lsGinecoObstetra.Tables[0].Rows[0]["dEstadoGeneral"].ToString() == "1") ? "Normal" : "Anormal");
            ViewBag.dEdemas = ((lsGinecoObstetra.Tables[0].Rows[0]["dEdemas"].ToString() == "1") ? "Normal" : "Anormal");

            ViewBag.lAparatoCV = ((lsGinecoObstetra.Tables[0].Rows[0]["lAparatoCV"].ToString() == "1") ? "Normal" : "Anormal");
            ViewBag.dAparatoCV = lsGinecoObstetra.Tables[0].Rows[0]["dAparatoCV"];
            ViewBag.dReflejos = lsGinecoObstetra.Tables[0].Rows[0]["dReflejos"];

            ViewBag.lAbdomen = ((lsGinecoObstetra.Tables[0].Rows[0]["lAbdomen"].ToString() == "1") ? "Normal" : "NO");
            ViewBag.dAbdomen = lsGinecoObstetra.Tables[0].Rows[0]["dAbdomen"];

            ViewBag.lAparatoR = ((lsGinecoObstetra.Tables[0].Rows[0]["lAparatoR"].ToString() == "1") ? "Normal" : "Anormal");
            ViewBag.dAparatoR = lsGinecoObstetra.Tables[0].Rows[0]["dAparatoR"];

            ViewBag.lAparatoU = ((lsGinecoObstetra.Tables[0].Rows[0]["lAparatoU"].ToString() == "1") ? "Normal" : "Anormal");
            ViewBag.dAparatoU = lsGinecoObstetra.Tables[0].Rows[0]["dAparatoU"];

            ViewBag.lExtremidades = ((lsGinecoObstetra.Tables[0].Rows[0]["lExtremidades"].ToString() == "1") ? "Normal" : "Anormal");
            ViewBag.dExtremidades = lsGinecoObstetra.Tables[0].Rows[0]["dExtremidades"];

            ViewBag.Lua = lsGinecoObstetra.Tables[0].Rows[0]["lua"].ToString();
            ViewBag.Llcf = lsGinecoObstetra.Tables[0].Rows[0]["llcf"].ToString();
            ViewBag.Ldu = lsGinecoObstetra.Tables[0].Rows[0]["ldu"].ToString();
            ViewBag.Proteinura = lsGinecoObstetra.Tables[0].Rows[0]["proteinura"].ToString();
            ViewBag.MovFetales = lsGinecoObstetra.Tables[0].Rows[0]["movFetales"].ToString();
            ViewBag.LPonderado = lsGinecoObstetra.Tables[0].Rows[0]["lPonderado"].ToString();
            ViewBag.LPelvisGinecoide = (lsGinecoObstetra.Tables[0].Rows[0]["lPelvisGinecoide"].ToString() == "1") ? "SI" : "NO";
            ViewBag.LCompatibilidadF = (lsGinecoObstetra.Tables[0].Rows[0]["lCompatibilidadF"].ToString() == "1") ? "SI" : (lsGinecoObstetra.Tables[0].Rows[0]["lCompatibilidadF"].ToString() == "2") ? "NO" : "Dudosa";

            ViewBag.Feto = feto;

            ViewBag.DescripcionExamenFisico = WordWrap(lsEvalEmergencia.Tables[0].Rows[0]["DescripcionExamenFisico"].ToString()).ToString().Replace("\r\n", "<br>").Replace("\n", "<br>").Replace("\r", "<br>");

            ViewBag.lDilatacion = lsGinecoObstetra.Tables[0].Rows[0]["lDilatacion"].ToString();
            ViewBag.lIncorporacion = lsGinecoObstetra.Tables[0].Rows[0]["lIncorporacion"].ToString();
            ViewBag.lAlPresent = lsGinecoObstetra.Tables[0].Rows[0]["lAlPresent"].ToString();
            ViewBag.dVarPresent = lsGinecoObstetra.Tables[0].Rows[0]["dVarPresent"].ToString();
            ViewBag.membranasRotas = ((lsGinecoObstetra.Tables[0].Rows[0]["membranasRotas"].ToString() == "1") ? "SI" : "NO").ToString();
            ViewBag.lProcubito = ((lsGinecoObstetra.Tables[0].Rows[0]["lProcubito"].ToString() == "1") ? "SI" : "NO").ToString();
            ViewBag.lProlapso = ((lsGinecoObstetra.Tables[0].Rows[0]["lProlapso"].ToString() == "1") ? "SI" : "NO").ToString();
            ViewBag.dSangradoV = ((lsGinecoObstetra.Tables[0].Rows[0]["dSangradoV"].ToString() == "1") ? "SI" : "NO").ToString();
            ViewBag.lLiquidoA = ((lsGinecoObstetra.Tables[0].Rows[0]["lLiquidoA"].ToString() == "1") ? "CLARO" : ((lsGinecoObstetra.Tables[0].Rows[0]["lLiquidoA"].ToString() == "2") ? "MECONIAL" : "SANGUINOLENTO"));

            @ViewBag.Tratamiento = lsEvalEmergencia.Tables[0].Rows[0]["Tratamiento"].ToString().Replace("\r\n", "<br>").Replace("\n", "<br>").Replace("\r", "<br>");
            //@ViewBag.PlandeTrabajo = lsEvalEmergencia.Tables[0].Rows[0]["PlandeTrabajo"].ToString().Replace("\r\n", "<br>").Replace("\n", "<br>").Replace("\r", "<br>");

            @ViewBag.Paciente = lsAtencion.Tables[0].Rows[0]["ApellidoPaterno"].ToString() + ' ' + lsAtencion.Tables[0].Rows[0]["ApellidoMaterno"].ToString() + ' ' + lsAtencion.Tables[0].Rows[0]["nombres"].ToString();
            @ViewBag.NroHistoriaClinica = lsAtencion.Tables[0].Rows[0]["NroHistoriaClinica"].ToString();
            @ViewBag.IdCuentaAtencion = lsAtencion.Tables[0].Rows[0]["IdCuentaAtencion"].ToString();
            @ViewBag.fecha = lsEvalEmergDetalle.Tables[0].Rows[0]["fecha"].ToString();
            @ViewBag.HoraInicioAtencion = lsEvalEmergDetalle.Tables[0].Rows[0]["HoraInicioAtencion"].ToString();

            @ViewBag.DxEvaluacion = dtDx;

            //DataSet DatosEvaluacion;
            //DataSet Diagnosticos;
            ////DateTime today = DateTime.Today;
            //int idUsuario = 0;

            //DalEvaluacionNeonatal daoEvaluacion = new DalEvaluacionNeonatal();
            //DalAtenciones daoAtenciones = new DalAtenciones();

            //@ViewBag.FechaImpresion = DateTime.Now.ToString("dd/mm/yyyy hh:mm:ss");
            //@ViewBag.Usuario = usuario;
            ////idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));


            //DatosEvaluacion = await daoEvaluacion.SeleccionarInformeEvaluacionNeonatal(idAtencion, idServicio, eval, idUsuario);
            //
            //

            //@ViewBag.FechaEvaluacion = DatosEvaluacion.Tables[0].Rows[0]["FechaEvaluacion"];
            //@ViewBag.HoraEvaluacion = DatosEvaluacion.Tables[0].Rows[0]["HoraEvaluacion"];

            //@ViewBag.NroEvaluacion = eval;

            //@ViewBag.Paciente = DatosEvaluacion.Tables[0].Rows[0]["Paciente"];
            //@ViewBag.NroHistoriaClinica = DatosEvaluacion.Tables[0].Rows[0]["NroHistoriaClinica"];
            //@ViewBag.FechaNacimiento = DatosEvaluacion.Tables[0].Rows[0]["FechaNacimiento"];
            //@ViewBag.HoraNacimiento = DatosEvaluacion.Tables[0].Rows[0]["HoraNacimiento"];
            //@ViewBag.Servicio = DatosEvaluacion.Tables[0].Rows[0]["Servicio"];

            //@ViewBag.TiempoEnfermedad = DatosEvaluacion.Tables[0].Rows[0]["TiempoEnfermedad"];
            //@ViewBag.Inicio = DatosEvaluacion.Tables[0].Rows[0]["Inicio"];
            //@ViewBag.Curso = DatosEvaluacion.Tables[0].Rows[0]["Curso"];

            //@ViewBag.DificultadRespiratoria = DatosEvaluacion.Tables[0].Rows[0]["DificultadRespiratoria"];
            //@ViewBag.Diarrea = DatosEvaluacion.Tables[0].Rows[0]["Diarrea"];
            //@ViewBag.DistensionAbdominal = DatosEvaluacion.Tables[0].Rows[0]["DistensionAbdominal"];
            //@ViewBag.Cianosis = DatosEvaluacion.Tables[0].Rows[0]["Cianosis"];
            //@ViewBag.MalOlorOmbligo = DatosEvaluacion.Tables[0].Rows[0]["MalOlorOmbligo"];
            //@ViewBag.Ictericia = DatosEvaluacion.Tables[0].Rows[0]["Ictericia"];
            //@ViewBag.Dolor = DatosEvaluacion.Tables[0].Rows[0]["Dolor"];
            //@ViewBag.Convulsiones = DatosEvaluacion.Tables[0].Rows[0]["Convulsiones"];
            //@ViewBag.Fiebre = DatosEvaluacion.Tables[0].Rows[0]["Fiebre"];
            //@ViewBag.Vomitos = DatosEvaluacion.Tables[0].Rows[0]["Vomitos"];
            //@ViewBag.Hemorragia = DatosEvaluacion.Tables[0].Rows[0]["Hemorragia"];
            //@ViewBag.Otros = DatosEvaluacion.Tables[0].Rows[0]["Otros"];
            //@ViewBag.OtrosSintomas = DatosEvaluacion.Tables[0].Rows[0]["OtrosSintomas"];

            //@ViewBag.Relato = DatosEvaluacion.Tables[0].Rows[0]["Relato"];

            //@ViewBag.Antecedentes = DatosEvaluacion.Tables[0].Rows[0]["Antecedentes"];
            //@ViewBag.PesoNacer = DatosEvaluacion.Tables[0].Rows[0]["PesoNacer"];
            //@ViewBag.TallaNacer = DatosEvaluacion.Tables[0].Rows[0]["TallaNacer"];
            //@ViewBag.PerimetroCefalicoNacer = DatosEvaluacion.Tables[0].Rows[0]["PerimetroCefalicoNacer"];
            //@ViewBag.PerimetroToracioNacer = DatosEvaluacion.Tables[0].Rows[0]["PerimetroToracioNacer"];
            //@ViewBag.ApgarNacer = DatosEvaluacion.Tables[0].Rows[0]["ApgarNacer"];
            //@ViewBag.AntecedentesPatlogicosNacer = DatosEvaluacion.Tables[0].Rows[0]["AntecedentesPatlogicosNacer"];
            //@ViewBag.EdadGestacionalNacer = DatosEvaluacion.Tables[0].Rows[0]["EdadGestacionalNacer"];

            //@ViewBag.FrecuenciaCardiaca = DatosEvaluacion.Tables[0].Rows[0]["FrecuenciaCardiaca"];
            //@ViewBag.FrecuenciaRespiratoria = DatosEvaluacion.Tables[0].Rows[0]["FrecuenciaRespiratoria"];
            //@ViewBag.Temperatura = DatosEvaluacion.Tables[0].Rows[0]["Temperatura"];
            //@ViewBag.Peso = DatosEvaluacion.Tables[0].Rows[0]["Peso"];

            //@ViewBag.EstadoGeneralSensorio = DatosEvaluacion.Tables[0].Rows[0]["EstadoGeneralSensorio"];
            //@ViewBag.DEstadoGeneralSensorio = DatosEvaluacion.Tables[0].Rows[0]["DEstadoGeneralSensorio"];
            //@ViewBag.EEstadoGeneralSensorio = DatosEvaluacion.Tables[0].Rows[0]["EEstadoGeneralSensorio"];
            //@ViewBag.Piel = DatosEvaluacion.Tables[0].Rows[0]["Piel"];
            //@ViewBag.DPiel = DatosEvaluacion.Tables[0].Rows[0]["DPiel"];
            //@ViewBag.Craneo = DatosEvaluacion.Tables[0].Rows[0]["Craneo"];
            //@ViewBag.DCraneo = DatosEvaluacion.Tables[0].Rows[0]["DCraneo"];
            //@ViewBag.PabellonAuricular = DatosEvaluacion.Tables[0].Rows[0]["PabellonAuricular"];
            //@ViewBag.DPabellonAuricular = DatosEvaluacion.Tables[0].Rows[0]["DPabellonAuricular"];
            //@ViewBag.Cara = DatosEvaluacion.Tables[0].Rows[0]["Cara"];
            //@ViewBag.DCara = DatosEvaluacion.Tables[0].Rows[0]["DCara"];
            //@ViewBag.BocaORL = DatosEvaluacion.Tables[0].Rows[0]["BocaORL"];
            //@ViewBag.DBocaORL = DatosEvaluacion.Tables[0].Rows[0]["DBocaORL"];
            //@ViewBag.Cuello = DatosEvaluacion.Tables[0].Rows[0]["Cuello"];
            //@ViewBag.DCuello = DatosEvaluacion.Tables[0].Rows[0]["DCuello"];
            //@ViewBag.Clavicula = DatosEvaluacion.Tables[0].Rows[0]["Clavicula"];
            //@ViewBag.DClavicula = DatosEvaluacion.Tables[0].Rows[0]["DClavicula"];
            //@ViewBag.ToraxSilv = DatosEvaluacion.Tables[0].Rows[0]["ToraxSilv"];
            //@ViewBag.DToraxSilv = DatosEvaluacion.Tables[0].Rows[0]["DToraxSilv"];
            //@ViewBag.AparatoCardioVascular = DatosEvaluacion.Tables[0].Rows[0]["AparatoCardioVascular"];
            //@ViewBag.DAparatoCardioVascular = DatosEvaluacion.Tables[0].Rows[0]["DAparatoCardioVascular"];
            //@ViewBag.RAparatoCardioVascular = DatosEvaluacion.Tables[0].Rows[0]["RAparatoCardioVascular"];
            //@ViewBag.Abdomen = DatosEvaluacion.Tables[0].Rows[0]["Abdomen"];
            //@ViewBag.DAbdomen = DatosEvaluacion.Tables[0].Rows[0]["DAbdomen"];
            //@ViewBag.Ombligo = DatosEvaluacion.Tables[0].Rows[0]["Ombligo"];
            //@ViewBag.DOmbligo = DatosEvaluacion.Tables[0].Rows[0]["DOmbligo"];
            //@ViewBag.Ano = DatosEvaluacion.Tables[0].Rows[0]["Ano"];
            //@ViewBag.DAno = DatosEvaluacion.Tables[0].Rows[0]["DAno"];
            //@ViewBag.Genitales = DatosEvaluacion.Tables[0].Rows[0]["Genitales"];
            //@ViewBag.DGenitales = DatosEvaluacion.Tables[0].Rows[0]["DGenitales"];
            //@ViewBag.ExtSuperiores = DatosEvaluacion.Tables[0].Rows[0]["ExtSuperiores"];
            //@ViewBag.DExtSuperiores = DatosEvaluacion.Tables[0].Rows[0]["DExtSuperiores"];
            //@ViewBag.ExtInferiores = DatosEvaluacion.Tables[0].Rows[0]["ExtInferiores"];
            //@ViewBag.DExtInferiores = DatosEvaluacion.Tables[0].Rows[0]["DExtInferiores"];
            //@ViewBag.Columna = DatosEvaluacion.Tables[0].Rows[0]["Columna"];
            //@ViewBag.DColumna = DatosEvaluacion.Tables[0].Rows[0]["DColumna"];
            //@ViewBag.SistemaNervioso = DatosEvaluacion.Tables[0].Rows[0]["SistemaNervioso"];
            //@ViewBag.DSistemaNervioso = DatosEvaluacion.Tables[0].Rows[0]["DSistemaNervioso"];

            //;

            //@ViewBag.ImpresionDiagnostica = DatosEvaluacion.Tables[0].Rows[0]["ImpresionDiagnostica"];
            //@ViewBag.PlanTrabajo = DatosEvaluacion.Tables[0].Rows[0]["PlanTrabajo"];
            //@ViewBag.Tratamiento = DatosEvaluacion.Tables[0].Rows[0]["Tratamiento"];

            //@ViewBag.TipoDestino = DatosEvaluacion.Tables[0].Rows[0]["TipoDestino"];
            //@ViewBag.TipoAlta = DatosEvaluacion.Tables[0].Rows[0]["TipoAlta"];
            //@ViewBag.TipoCondicionAlta = DatosEvaluacion.Tables[0].Rows[0]["TipoCondicionAlta"];

            //@ViewBag.Medico = DatosEvaluacion.Tables[0].Rows[0]["Medico"];

            
            if (eval == 1)
            {
                return PartialView("~/Views/Hospitalizacion/Plantillas/InformeNotaIngreso.cshtml");
            }
            else
            {
                return PartialView("~/Views/Hospitalizacion/Plantillas/HojaEvaluacionNotaIngreso.cshtml");
            }

        }

        ///////////////////////////////////////  CONTINUAR ESTA PARTE PARA GENERAR EL PDF PARA LA EVALUACION DE EMERGENCIA
        public async Task<ActionResult> GenerarPdfV2(int idCuenta, int idAtencion, int idServicio, int eval)//int Anio, String NroHistoria, int bd)
        {
            UtilitarioController utilitarioController = new UtilitarioController();

            string generacion_pdf = "";
            //string sWebRootFolder = _hostingEnvironment.WebRootPath;
            string sWebRootFolder = "";

            var path = "";
            bool resulfirma = false;
            StringBuilder html = new StringBuilder();
            HtmlToPdf ohtml = new HtmlToPdf();
            //bool resp = false;
            string usuario;
            string tipo;
            string Ruta = "";
            string nroHistoria;

            Conexion con = new Conexion();
            sWebRootFolder = con.ObtenerServidorArchivos();

            try
            {
                DalAtenciones daoAtenciones = new DalAtenciones();
                DataSet lsAtencion = await daoAtenciones.ListaAtencionByIdCuentaAtencion(idCuenta);

                nroHistoria = lsAtencion.Tables[0].Rows[0]["NroHistoriaClinica"].ToString();

                usuario = HttpContext.Session.GetString("usuario");
                tipo = "HOSPNI-" + eval;
                //String Ruta = "/ConstanciasRN/ReporteConstancia?&area=Estadistica&Anio=" + Anio.ToString() + "&NroHistoria=" + NroHistoria.ToString() + "&bd=" + bd.ToString();

                // PdfDocument obPdfDoc = ohtml.ConvertUrl("https://localhost:44364/ConstanciasRN/ReporteConstancia?&area=Estadistica&idConstancia="+ idConstancia.ToString());

                path = Path.Combine(sWebRootFolder, "HojaReevaluacionNI", (idCuenta + (DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + tipo + ".pdf"));
                Console.WriteLine("path: " + path);
                Comun.ClUtilirario cl = new Comun.ClUtilirario();

                PdfPageSize pageSize = (PdfPageSize)Enum.Parse(typeof(PdfPageSize), "A4", true);

                PdfPageOrientation pdfOrientationPortrait = (PdfPageOrientation)Enum.Parse(typeof(PdfPageOrientation), "Portrait", true);
                ohtml.Options.PdfPageOrientation = pdfOrientationPortrait;
                ohtml.Options.PdfPageSize = pageSize;
                ohtml.Options.MarginLeft = 20;
                ohtml.Options.MarginRight = 20;
                ohtml.Options.MarginTop = 20;
                ohtml.Options.MarginBottom = 20;
                ohtml.Options.WebPageWidth = 793;
                ohtml.Options.WebPageHeight = 1122;
                //ohtml.Options.AutoFitWidth = HtmlToPdfPageFitMode.AutoFit;

                /////////////////////KHOYOSI - OBTENER DIRECCIONES IPs///////////////////////                
                var AppNameIp1 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:IpPrivada");
                var AppNameIp2 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:IpPublica");
                string IpPrivada = AppNameIp1.ToString();
                string IpPublica = AppNameIp2.ToString();
                /////////////////////////////////////////////////////////////////////////////

                //string Ruta = Url.Action("InformeEvaluacion", "EvaluacionNeonatal", new { area = "Emergencia", idAtencion, idServicio, tipo = "NEO", usuario }, "http");
                Ruta = Url.Action("HojaReevaluacionNI", "NotaIngreso", new { area = "Hospitalizacion", idCuenta, idServicio, eval, usuario }, "http");
                Ruta = Ruta.Replace(IpPublica, IpPrivada);

                await utilitarioController.GuardarArchivoV2(
                        nroHistoria + "/Hospitalizacion/" + idCuenta + "/Atenciones",
                        (idCuenta + (DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + tipo + ".pdf"),
                        ohtml, Ruta, Int32.Parse(idCuenta.ToString()), tipo, Int32.Parse(idCuenta.ToString())
                    );

            }
            catch (Exception e)
            {
                return Json(new { exep = e.ToString() });
                //return e.ToString();
                //return false;
                //return Json(new { estadoCreacion = generacion_pdf, ruta = path, exep = e.ToString(), resulfirma = resulfirma });
            }

            return Json(new { estadoCreacion = generacion_pdf, ruta = path, resulfirma = resulfirma, url = Ruta });
            //return true;
            /*byte[] pdf = obPdfDoc.Save();
            MemoryStream ms = new MemoryStream();
            ms = new MemoryStream();
            ms.Write(pdf, 0, pdf.Length);
            ms.Position = 0;
            obPdfDoc.Close();
            return new FileStreamResult(ms,MediaTypeNames.Application.Pdf);*/
        }


        public static string WordWrap(string text) // JDELGADO003-M
        {
            string res = "";

            foreach (var sub in text.Split())
            {
                if (sub.Length > 60)
                {
                    int parts = sub.Length / 60;
                    int from = 0;
                    int to = 60;
                    int size = sub.Length;
                    for (int i = 0; i < parts; i++)
                    {
                        res = res + sub.Substring(from, to) + " ";
                        from = from + 60;
                        size = size - 60;
                        if (size < 60)
                        {
                            to = size;
                        }
                    }
                }
                else
                {
                    res = res + sub + " ";
                }
            }
            return res;
        }

    }

}
