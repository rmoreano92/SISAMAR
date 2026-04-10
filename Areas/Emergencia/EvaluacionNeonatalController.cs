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
using SelectPdf;
using System.Text;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Net.Mime;
using WebAppMaternidad.Areas.Comun;
using System.Diagnostics;
using QRCoder;
using System.Drawing;


namespace WebAppMaternidad.Areas.Emergencia
{
    public class EvaluacionNeonatalController : Controller
    {
        private IWebHostEnvironment _hostingEnvironment;

        public EvaluacionNeonatalController(IWebHostEnvironment env)
        {
            _hostingEnvironment = env;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarEvaluacionNeonatal(int idAtencion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionNeonatal daoEvaluacion = new DalEvaluacionNeonatal();
            //Boolean hoja;

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoEvaluacion.SeleccionarEvaluacionNeonatal(idAtencion, idUsuario);
            //hoja = await GenerarHojaRefCon(objRef.IdCuentaAtencion, Convert.ToInt32(ds.Tables[0].Rows[0]["IdReferencia"].ToString()), 1, "RF");

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarEvaluacionDetalleNeonatal(int idAtencion, int idServicio)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionNeonatal daoEvaluacion = new DalEvaluacionNeonatal();
            DalEvaluacionEmergencia daoEvaluacionEmer = new DalEvaluacionEmergencia();
            //Boolean hoja;

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            //ds = await daoEvaluacion.SeleccionarEvaluacionDetalleNeonatal(idAtencion, idUsuario);
            ds = await daoEvaluacionEmer.SeleccionarEvaluacionDetalle(idAtencion, idServicio, idUsuario);
            //hoja = await GenerarHojaRefCon(objRef.IdCuentaAtencion, Convert.ToInt32(ds.Tables[0].Rows[0]["IdReferencia"].ToString()), 1, "RF");

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarEvaluacionDetalleNeonatalPorEvaluacion(int idAtencion, int idServicio, int nroEvaluacion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionNeonatal daoEvaluacion = new DalEvaluacionNeonatal();
            DalEvaluacionEmergencia daoEvaluacionEmer = new DalEvaluacionEmergencia();
            //Boolean hoja;

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            //ds = await daoEvaluacion.SeleccionarEvaluacionDetalleNeonatalPorEvaluacion(idAtencion, nroEvaluacion, idUsuario);
            ds = await daoEvaluacionEmer.SeleccionarEvaluacionDetallePorEvaluacion(idAtencion, idServicio, nroEvaluacion, idUsuario);
            //hoja = await GenerarHojaRefCon(objRef.IdCuentaAtencion, Convert.ToInt32(ds.Tables[0].Rows[0]["IdReferencia"].ToString()), 1, "RF");

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarExamenFisicoNeonatal(int idAtencion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionNeonatal daoEvaluacion = new DalEvaluacionNeonatal();
            //Boolean hoja;

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoEvaluacion.SeleccionarExamenFisicoNeonatal(idAtencion, idUsuario);
            //hoja = await GenerarHojaRefCon(objRef.IdCuentaAtencion, Convert.ToInt32(ds.Tables[0].Rows[0]["IdReferencia"].ToString()), 1, "RF");

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarRnAntecedentesPerinatales(int idAtencion)
        {
            DataSet lsAntecedentesPerinatales;
            DalEvaluacionNeonatal daoEvaluacion = new DalEvaluacionNeonatal();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            lsAntecedentesPerinatales = await daoEvaluacion.SeleccionarRnAntecedentesPerinatales(idAtencion);
            return Json(new { session = true, lsAntecedentesPerinatales = lsAntecedentesPerinatales });
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarRnAntecedentesNacimiento(int idAtencion)
        {
            DataSet lsAntecedentesNacimiento;
            DalEvaluacionNeonatal daoEvaluacion = new DalEvaluacionNeonatal();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            lsAntecedentesNacimiento = await daoEvaluacion.SeleccionarRnAntecedentesNacimiento(idAtencion);
            return Json(new { session = true, lsAntecedentesNacimiento = lsAntecedentesNacimiento });
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarRnAntecedentes(int idPaciente)
        {
            DataSet lsAntecedentesPerinatales, lsAntecedentesNacimiento;
            DalEvaluacionNeonatal daoEvaluacion = new DalEvaluacionNeonatal();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            lsAntecedentesPerinatales = await daoEvaluacion.SeleccionarRnAntecedentesPerinatales(idPaciente);
            lsAntecedentesNacimiento = await daoEvaluacion.SeleccionarRnAntecedentesNacimiento(idPaciente);
            return Json(new { session = true, lsAntecedentesPerinatales = lsAntecedentesPerinatales, lsAntecedentesNacimiento = lsAntecedentesNacimiento });
        }


        [HttpPost]
        public async Task<ActionResult> GuardarEvaluacion(EvaluacionNeonatal objEva, Triaje obTriaje, int Prioridad)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionNeonatal daoEvaluacion = new DalEvaluacionNeonatal();
            DalTriaje daoTriaje = new DalTriaje();
            //Boolean triaje, hoja;

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                ds = await daoEvaluacion.GuardarEvaluacion(objEva, Prioridad, idUsuario);
                //triaje = await daoTriaje.InsertaTriajeHospEmeg(obTriaje); // JDELGADO001.2
                //hoja = await GenerarHojaEvaluacion(objEva.IdAtencion);

                return Json(new { respuesta = ds, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (GuardarEvaluacion): " + ex });
            }
            
        }

        [HttpPost]
        public async Task<ActionResult> GuardarEvaluacionDetalle(EvaluacionNeonatalDetalle objEva,
                                                                 String lstDiagnosticos,
                                                                 int idCuentaAtencion, int idServicio, int idMedico
                                                                 /*string lstRecetaPatalogiaClinica, int idRecetaPatoClinica,
                                                                 string lstRecetaAnatoPatologica, int idRecetaAnaPatologica,
                                                                 string lstRecetaBancoSangre, int idRecetaBancoSangre,
                                                                 string lstRecetaEcoObs, int idRecetaEcoObs,
                                                                 string lstRecetaEcoGeneral, int idRecetaEcoGene,
                                                                 string lstRecetaRx, int idRecetaRx,
                                                                 string lstRecetaFarmacia, int idRecetaFarmacia, string fechaVigencia*/
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
            //Boolean resp, respPatoClinica, respAnaPatolo, respBancoSangre, rspEcoObs, rspEcoGeneral, rspRx, respFarmacia;
            DataSet ds, evadet;
            DalEvaluacionNeonatal daoEvaluacion = new DalEvaluacionNeonatal();
            DalUtilitario daoUtil = new DalUtilitario();
            DalRecetas daoRecetas = new DalRecetas();
            DalParametros daoParametros = new DalParametros();
            Boolean resp, informe/*, evaluacion*/;

            var lstobjDiagnosticos = JsonConvert.DeserializeObject<List<Diagnosticos>>(lstDiagnosticos);

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                       

            try
            {
                ds = await daoEvaluacion.GuardarEvaluacionDetalle(objEva, idUsuario);
                resp = await daoUtil.insertaDiagnosticosPorEvaluacion(objEva.IdAtencion, (int)Enumerados.TiposDiagnostico.EmergenciaIngreso, idUsuario, lstobjDiagnosticos, idServicio, objEva.NroEvaluacion);

                evadet = await daoEvaluacion.SeleccionarEvaluacionDetalleNeonatalPorEvaluacion(objEva.IdAtencion, objEva.NroEvaluacion, idUsuario);
                informe = await GenerarHojaEvaluacion(idCuentaAtencion, objEva.IdAtencion, Convert.ToInt32(evadet.Tables[0].Rows[0]["IdEvaluacionDetalle"].ToString()), idServicio, objEva.NroEvaluacion); 
                //informe = await GenerarHojaEvaluacion(idCuentaAtencion, objEva.IdAtencion, idServicio, objEva.NroEvaluacion);   //GENERAR PDF HOJA EVALUACION

                return Json(new {session = true, estado = true, respuesta = ds });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (GuardarEvaluacionDetalle): " + ex });
            }

        }

        [HttpPost]
        public async Task<ActionResult> GuardarExamenNeonatal(ExamenFisicoNeonatal objExaNeo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionNeonatal daoEvaluacion = new DalEvaluacionNeonatal();
            //Boolean hoja;

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                ds = await daoEvaluacion.GuardarExamenNeonatal(objExaNeo, idUsuario);

                return Json(new { respuesta = ds, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (GuardarExamenNeonatal): " + ex });
            }
        }

        [HttpPost]
        public async Task<ActionResult> GuardarRnAntecedentesPerinatales(NinioAltoRiesgoAntecPerinatales objNinioAltoRiesAntecPerinatales)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            //DataSet ds;
            DalEvaluacionNeonatal daoEvaluacion = new DalEvaluacionNeonatal();
            Boolean resp;

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                resp = await daoEvaluacion.GuardarRnAntecedentesPerinatales(objNinioAltoRiesAntecPerinatales);

                return Json(new { respuesta = resp, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (GuardarRnAntecedentesPerinatales): " + ex });
            }
        }

        [HttpPost]
        public async Task<ActionResult> GuardarRnAntecedentesNacimiento(NinioAltoRiesgoNacimiento objninioAltoRiesgoNacimiento)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            //DataSet ds;
            DalEvaluacionNeonatal daoEvaluacion = new DalEvaluacionNeonatal();
            Boolean resp;

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            resp = await daoEvaluacion.GuardarRnAntecedentesNacimiento(objninioAltoRiesgoNacimiento);
            //hoja = await GenerarHojaEvaluacion(objEva.IdAtencion);

            return Json(new { respuesta = resp, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> GuardarRnAntecedentes(NinioAltoRiesgoAntecPerinatales objNinioAltoRiesAntecPerinatales, NinioAltoRiesgoNacimiento objNinioAltoRiesNacimiento)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            //DataSet ds;
            DalEvaluacionNeonatal daoEvaluacion = new DalEvaluacionNeonatal();
            Boolean resp;

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                resp = await daoEvaluacion.GuardarRnAntecedentesPerinatales(objNinioAltoRiesAntecPerinatales);
                resp = await daoEvaluacion.GuardarRnAntecedentesNacimiento(objNinioAltoRiesNacimiento);

                return Json(new { respuesta = resp, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (GuardarEvaluacion): " + ex });
            }
        }


        //[HttpPost]
        //public async Task<Boolean> GenerarHojaEvaluacion(int idCuenta, int idAtencion, int idServicio, int eval)
        //{
        //    string rsp = "";
        //    bool bSesion = true;
        //    string respuesta = "Error al registrar la generación de constancia.";
        //    if (HttpContext.User.Identity.IsAuthenticated == false)
        //    {
        //        bSesion = false;
        //        respuesta = "Su sesión a finalizado.";
        //        //return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
        //        return false;
        //    }
        //    try
        //    {
        //        //objConstanciaRN.idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
        //        //DalEvaluacionRN daoEvaluacionRn = new DalEvaluacionRN();
        //        //rsp = daoEvaluacionRn.RegistrarImpresionSolicitudRn(objConstanciaRN);
        //        var resp = await GenerarPdf(idCuenta, idAtencion, idServicio, eval);

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
        //    //return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
        //    return true;
        //}

        [HttpPost]
        public async Task<Boolean> GenerarHojaEvaluacion(int idCuenta, int idAtencion, int idEvaluacionDetalle, int idServicio, int eval)
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
                string usuario = HttpContext.Session.GetString("user");

                stringHtml = null;
                pageHtml = null;
                pageHtml = Url.Action("InformeEvaluacion", "EvaluacionNeonatal", new { area = "Emergencia", idAtencion, idServicio, eval, usuario  }, "http");

                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;
                resp = await utilitario.GenerarDocumentoDigital(idCuenta, idEvaluacionDetalle, 0, "E-EVA", 0, pageHtml, stringHtml, idUsuario, pdf);

                return resp;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                return false;
            }            
        }


        //public async Task<ActionResult> GenerarPdf(int idCuenta, int idAtencion, int idServicio, int eval)//int Anio, String NroHistoria, int bd)
        //{
        //    string generacion_pdf = "";
        //    //string sWebRootFolder = _hostingEnvironment.WebRootPath;
        //    string sWebRootFolder = "";

        //    var path = "";
        //    bool resulfirma = false;
        //    StringBuilder html = new StringBuilder();
        //    HtmlToPdf ohtml = new HtmlToPdf();
        //    //bool resp = false;
        //    string usuario;
        //    string tipo;
        //    string Ruta = "";

        //    Conexion con = new Conexion();
        //    sWebRootFolder = con.ObtenerServidorArchivos();
            
        //    try
        //    {
        //        usuario = HttpContext.Session.GetString("usuario");
        //        tipo = "NEOE-" + eval;
        //        //String Ruta = "/ConstanciasRN/ReporteConstancia?&area=Estadistica&Anio=" + Anio.ToString() + "&NroHistoria=" + NroHistoria.ToString() + "&bd=" + bd.ToString();

        //        // PdfDocument obPdfDoc = ohtml.ConvertUrl("https://localhost:44364/ConstanciasRN/ReporteConstancia?&area=Estadistica&idConstancia="+ idConstancia.ToString());

        //        path = Path.Combine(sWebRootFolder, "HojasEvaluacionEmergencia", (idCuenta + (DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + tipo + ".pdf"));
        //        Console.WriteLine("path: " + path);
        //        Comun.ClUtilirario cl = new Comun.ClUtilirario();

        //        PdfPageSize pageSize = (PdfPageSize)Enum.Parse(typeof(PdfPageSize), "A4", true);

        //        PdfPageOrientation pdfOrientationPortrait = (PdfPageOrientation)Enum.Parse(typeof(PdfPageOrientation), "Portrait", true);
        //        ohtml.Options.PdfPageOrientation = pdfOrientationPortrait;
        //        ohtml.Options.PdfPageSize = pageSize;
        //        ohtml.Options.MarginLeft = 20;
        //        ohtml.Options.MarginRight = 20;
        //        ohtml.Options.MarginTop = 20;
        //        ohtml.Options.MarginBottom = 20;
        //        ohtml.Options.WebPageWidth = 793;
        //        ohtml.Options.WebPageHeight = 1122;
        //        //ohtml.Options.AutoFitWidth = HtmlToPdfPageFitMode.AutoFit;

        //        /////////////////////KHOYOSI - OBTENER DIRECCIONES IPs///////////////////////                
        //        var AppNameIp1 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:IpPrivada");
        //        var AppNameIp2 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:IpPublica");
        //        string IpPrivada = AppNameIp1.ToString();
        //        string IpPublica = AppNameIp2.ToString();
        //        /////////////////////////////////////////////////////////////////////////////

        //        //string Ruta = Url.Action("InformeEvaluacion", "EvaluacionNeonatal", new { area = "Emergencia", idAtencion, idServicio, tipo = "NEO", usuario }, "http");
        //        Ruta = Url.Action("InformeEvaluacion", "EvaluacionNeonatal", new { area = "Emergencia", idAtencion, idServicio, eval, usuario }, "http");
        //        Ruta = Ruta.Replace(IpPublica, IpPrivada);

        //        PdfDocument obPdfDoc = ohtml.ConvertUrl(Ruta);

        //        //PdfDocument obPdfDoc = ohtml.ConvertUrl("https://localhost:44364/ConstanciasRN/ReporteConstancia?&area=Estadistica&idConstancia=" + idConstancia.ToString());

        //        //html.Append("<h1>CONSTANCIA DE NACIMIENTO</h1>");                
        //        //PdfDocument obPdfDoc = ohtml.ConvertHtmlString(html.ToString());
        //        obPdfDoc.Save(path);
        //        generacion_pdf = "Ok";
        //        if (generacion_pdf == "Ok")
        //        {
        //            //verificar creacion 
        //            Task<bool> Tbol = cl.UploadFile(path, Int32.Parse(idCuenta.ToString()), tipo, Int32.Parse(idCuenta.ToString()));
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

        //    return Json(new { estadoCreacion = generacion_pdf, ruta = path, resulfirma = resulfirma, url = Ruta });
        //    //return true;
        //    /*byte[] pdf = obPdfDoc.Save();
        //    MemoryStream ms = new MemoryStream();
        //    ms = new MemoryStream();
        //    ms.Write(pdf, 0, pdf.Length);
        //    ms.Position = 0;
        //    obPdfDoc.Close();
        //    return new FileStreamResult(ms,MediaTypeNames.Application.Pdf);*/
        //}

        public async Task<ActionResult> InformeEvaluacion(int idAtencion, int idServicio, int eval, string usuario)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();           

            DataSet DatosEvaluacion;
            DataSet Diagnosticos;
            //DateTime today = DateTime.Today;
            int idUsuario = 0;

            DalEvaluacionNeonatal daoEvaluacion = new DalEvaluacionNeonatal();
            DalAtenciones daoAtenciones = new DalAtenciones();

            @ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss");
            @ViewBag.Usuario = usuario;
            //idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));


            DatosEvaluacion = await daoEvaluacion.SeleccionarInformeEvaluacionNeonatal(idAtencion, idServicio, eval, idUsuario);
            Diagnosticos = await daoAtenciones.AtencionesDiagnosticosSeleccionarPorAtencionPorNumeroEvaluacion(idAtencion, (int)Enumerados.TiposDiagnostico.EmergenciaIngreso, idServicio, eval);
            DataTable dtDx = Diagnosticos.Tables[0];

            @ViewBag.FechaEvaluacion = DatosEvaluacion.Tables[0].Rows[0]["FechaEvaluacion"];
            @ViewBag.HoraEvaluacion = DatosEvaluacion.Tables[0].Rows[0]["HoraEvaluacion"];

            @ViewBag.NroEvaluacion = eval;

            @ViewBag.Paciente = DatosEvaluacion.Tables[0].Rows[0]["Paciente"];
            @ViewBag.NroHistoriaClinica = DatosEvaluacion.Tables[0].Rows[0]["NroHistoriaClinica"];
            @ViewBag.FechaNacimiento = DatosEvaluacion.Tables[0].Rows[0]["FechaNacimiento"];
            @ViewBag.HoraNacimiento = DatosEvaluacion.Tables[0].Rows[0]["HoraNacimiento"];
            @ViewBag.Servicio = DatosEvaluacion.Tables[0].Rows[0]["Servicio"];

            @ViewBag.TiempoEnfermedad = DatosEvaluacion.Tables[0].Rows[0]["TiempoEnfermedad"];
            @ViewBag.Inicio = DatosEvaluacion.Tables[0].Rows[0]["Inicio"];
            @ViewBag.Curso = DatosEvaluacion.Tables[0].Rows[0]["Curso"];

            @ViewBag.DificultadRespiratoria = DatosEvaluacion.Tables[0].Rows[0]["DificultadRespiratoria"];
            @ViewBag.Diarrea = DatosEvaluacion.Tables[0].Rows[0]["Diarrea"];
            @ViewBag.DistensionAbdominal = DatosEvaluacion.Tables[0].Rows[0]["DistensionAbdominal"];
            @ViewBag.Cianosis = DatosEvaluacion.Tables[0].Rows[0]["Cianosis"];
            @ViewBag.MalOlorOmbligo = DatosEvaluacion.Tables[0].Rows[0]["MalOlorOmbligo"];
            @ViewBag.Ictericia = DatosEvaluacion.Tables[0].Rows[0]["Ictericia"];
            @ViewBag.Dolor = DatosEvaluacion.Tables[0].Rows[0]["Dolor"];
            @ViewBag.Convulsiones = DatosEvaluacion.Tables[0].Rows[0]["Convulsiones"];
            @ViewBag.Fiebre = DatosEvaluacion.Tables[0].Rows[0]["Fiebre"];
            @ViewBag.Vomitos = DatosEvaluacion.Tables[0].Rows[0]["Vomitos"];
            @ViewBag.Hemorragia = DatosEvaluacion.Tables[0].Rows[0]["Hemorragia"];
            @ViewBag.Otros = DatosEvaluacion.Tables[0].Rows[0]["Otros"];
            @ViewBag.OtrosSintomas = DatosEvaluacion.Tables[0].Rows[0]["OtrosSintomas"];

            @ViewBag.Relato = DatosEvaluacion.Tables[0].Rows[0]["Relato"];

            @ViewBag.Antecedentes = DatosEvaluacion.Tables[0].Rows[0]["Antecedentes"];
            @ViewBag.PesoNacer = DatosEvaluacion.Tables[0].Rows[0]["PesoNacer"];
            @ViewBag.TallaNacer = DatosEvaluacion.Tables[0].Rows[0]["TallaNacer"];
            @ViewBag.PerimetroCefalicoNacer = DatosEvaluacion.Tables[0].Rows[0]["PerimetroCefalicoNacer"];
            @ViewBag.PerimetroToracioNacer = DatosEvaluacion.Tables[0].Rows[0]["PerimetroToracioNacer"];
            @ViewBag.ApgarNacer = DatosEvaluacion.Tables[0].Rows[0]["ApgarNacer"];
            @ViewBag.AntecedentesPatlogicosNacer = DatosEvaluacion.Tables[0].Rows[0]["AntecedentesPatlogicosNacer"];
            @ViewBag.EdadGestacionalNacer = DatosEvaluacion.Tables[0].Rows[0]["EdadGestacionalNacer"];

            @ViewBag.FrecuenciaCardiaca = DatosEvaluacion.Tables[0].Rows[0]["FrecuenciaCardiaca"];
            @ViewBag.FrecuenciaRespiratoria = DatosEvaluacion.Tables[0].Rows[0]["FrecuenciaRespiratoria"];
            @ViewBag.Temperatura = DatosEvaluacion.Tables[0].Rows[0]["Temperatura"];
            @ViewBag.Peso = DatosEvaluacion.Tables[0].Rows[0]["Peso"];

            @ViewBag.EstadoGeneralSensorio = DatosEvaluacion.Tables[0].Rows[0]["EstadoGeneralSensorio"];
            @ViewBag.DEstadoGeneralSensorio = DatosEvaluacion.Tables[0].Rows[0]["DEstadoGeneralSensorio"];
            @ViewBag.EEstadoGeneralSensorio = DatosEvaluacion.Tables[0].Rows[0]["EEstadoGeneralSensorio"];
            @ViewBag.Piel = DatosEvaluacion.Tables[0].Rows[0]["Piel"];
            @ViewBag.DPiel = DatosEvaluacion.Tables[0].Rows[0]["DPiel"];
            @ViewBag.Craneo = DatosEvaluacion.Tables[0].Rows[0]["Craneo"];
            @ViewBag.DCraneo = DatosEvaluacion.Tables[0].Rows[0]["DCraneo"];
            @ViewBag.PabellonAuricular = DatosEvaluacion.Tables[0].Rows[0]["PabellonAuricular"];
            @ViewBag.DPabellonAuricular = DatosEvaluacion.Tables[0].Rows[0]["DPabellonAuricular"];
            @ViewBag.Cara = DatosEvaluacion.Tables[0].Rows[0]["Cara"];
            @ViewBag.DCara = DatosEvaluacion.Tables[0].Rows[0]["DCara"];
            @ViewBag.BocaORL = DatosEvaluacion.Tables[0].Rows[0]["BocaORL"];
            @ViewBag.DBocaORL = DatosEvaluacion.Tables[0].Rows[0]["DBocaORL"];
            @ViewBag.Cuello = DatosEvaluacion.Tables[0].Rows[0]["Cuello"];
            @ViewBag.DCuello = DatosEvaluacion.Tables[0].Rows[0]["DCuello"];
            @ViewBag.Clavicula = DatosEvaluacion.Tables[0].Rows[0]["Clavicula"];
            @ViewBag.DClavicula = DatosEvaluacion.Tables[0].Rows[0]["DClavicula"];
            @ViewBag.ToraxSilv = DatosEvaluacion.Tables[0].Rows[0]["ToraxSilv"];
            @ViewBag.DToraxSilv = DatosEvaluacion.Tables[0].Rows[0]["DToraxSilv"];
            @ViewBag.AparatoCardioVascular = DatosEvaluacion.Tables[0].Rows[0]["AparatoCardioVascular"];
            @ViewBag.DAparatoCardioVascular = DatosEvaluacion.Tables[0].Rows[0]["DAparatoCardioVascular"];
            @ViewBag.RAparatoCardioVascular = DatosEvaluacion.Tables[0].Rows[0]["RAparatoCardioVascular"];
            @ViewBag.Abdomen = DatosEvaluacion.Tables[0].Rows[0]["Abdomen"];
            @ViewBag.DAbdomen = DatosEvaluacion.Tables[0].Rows[0]["DAbdomen"];
            @ViewBag.Ombligo = DatosEvaluacion.Tables[0].Rows[0]["Ombligo"];
            @ViewBag.DOmbligo = DatosEvaluacion.Tables[0].Rows[0]["DOmbligo"];
            @ViewBag.Ano = DatosEvaluacion.Tables[0].Rows[0]["Ano"];
            @ViewBag.DAno = DatosEvaluacion.Tables[0].Rows[0]["DAno"];
            @ViewBag.Genitales = DatosEvaluacion.Tables[0].Rows[0]["Genitales"];
            @ViewBag.DGenitales = DatosEvaluacion.Tables[0].Rows[0]["DGenitales"];
            @ViewBag.ExtSuperiores = DatosEvaluacion.Tables[0].Rows[0]["ExtSuperiores"];
            @ViewBag.DExtSuperiores = DatosEvaluacion.Tables[0].Rows[0]["DExtSuperiores"];
            @ViewBag.ExtInferiores = DatosEvaluacion.Tables[0].Rows[0]["ExtInferiores"];
            @ViewBag.DExtInferiores = DatosEvaluacion.Tables[0].Rows[0]["DExtInferiores"];
            @ViewBag.Columna = DatosEvaluacion.Tables[0].Rows[0]["Columna"];
            @ViewBag.DColumna = DatosEvaluacion.Tables[0].Rows[0]["DColumna"];
            @ViewBag.SistemaNervioso = DatosEvaluacion.Tables[0].Rows[0]["SistemaNervioso"];
            @ViewBag.DSistemaNervioso = DatosEvaluacion.Tables[0].Rows[0]["DSistemaNervioso"];

            @ViewBag.DxEvaluacion = dtDx;

            @ViewBag.ImpresionDiagnostica = DatosEvaluacion.Tables[0].Rows[0]["ImpresionDiagnostica"];
            @ViewBag.PlanTrabajo = DatosEvaluacion.Tables[0].Rows[0]["PlanTrabajo"];
            @ViewBag.Tratamiento = DatosEvaluacion.Tables[0].Rows[0]["Tratamiento"];

            @ViewBag.TipoDestino = DatosEvaluacion.Tables[0].Rows[0]["TipoDestino"];
            @ViewBag.TipoAlta = DatosEvaluacion.Tables[0].Rows[0]["TipoAlta"];
            @ViewBag.TipoCondicionAlta = DatosEvaluacion.Tables[0].Rows[0]["TipoCondicionAlta"];

            @ViewBag.Medico = DatosEvaluacion.Tables[0].Rows[0]["Medico"];

            @ViewBag.CodeFirma = DatosEvaluacion.Tables[0].Rows[0]["code"];

            if(@ViewBag.CodeFirma != "")
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
            


            if (eval == 1)
            {
                return PartialView("~/Views/Emergencia/Plantillas/InformeEvaluacionNeonatal.cshtml");
            }
            else
            {
                return PartialView("~/Views/Emergencia/Plantillas/HojaEvaluacionNeonatal.cshtml");
            }

        }


        //[HttpPost]
        //public async Task<ActionResult> GenerarRecetaPdf(int idCuentaAtencion, int idReceta, string tipo)
        //{
        //    if (HttpContext.User.Identity.IsAuthenticated == false)
        //    {
        //        return View("Login");
        //    }

        //    String htmlTablaDetalle, htmlTablaItem, telefono, nombre, direccion, html/*, strRx, strEcoGene, strEcoObs, strAnaPatolo, strPatoloClinica, strBs, strFarmacia, strInterconsulta*/;
        //    html = "";
        //    htmlTablaItem = "";
        //    string generacion_pdf = "";
        //    string sWebRootFolder = "";
        //    var path = "";
        //    //string tipo;
        //    bool resulfirma = false;
        //    //bool resp = false;

        //    bool farmaciaHospi = false;
        //    DataSet lsParametros = new DataSet();
        //    DataSet lsAtencion, lsDiagnosticos, lsRecetas, lsRecetasDestalle;
        //    DalAtenciones daoAtenciones = new DalAtenciones();
        //    DalRecetas daoRecetas = new DalRecetas();
        //    DalParametros daoParametros = new DalParametros();
        //    Comun.ClUtilirario cl = new Comun.ClUtilirario();
        //    Conexion con = new Conexion();

        //    sWebRootFolder = con.ObtenerServidorArchivos();
        //    tipo = "REC-" + tipo;
        //    path = Path.Combine(sWebRootFolder, "Recetas", (idCuentaAtencion + idReceta + (DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + tipo + ".pdf"));

        //    lsParametros = await daoParametros.SeleccionaFilaParametro2(205); // JDELGADO J0 AWAIT SENTENCE
        //    nombre = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

        //    lsParametros.Clear();

        //    lsParametros = await daoParametros.SeleccionaFilaParametro2(206); // JDELGADO J0 AWAIT SENTENCE
        //    direccion = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

        //    lsParametros.Clear();

        //    lsParametros = await daoParametros.SeleccionaFilaParametro2(207); // JDELGADO J0 AWAIT SENTENCE
        //    telefono = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

        //    string idAtencion = "0";
        //    //String diagnosticos = "";

        //    //strRx = "";
        //    //strEcoGene = "";
        //    //strEcoObs = "";
        //    //strAnaPatolo = "";
        //    //strPatoloClinica = "";
        //    //strBs = "";
        //    //strFarmacia = "";
        //    //strInterconsulta = "";

        //    lsAtencion = await daoAtenciones.ListaAtencionByIdCuentaAtencion(idCuentaAtencion);
        //    lsRecetas = await daoRecetas.ListaRecetaCabeceraById2(idReceta); // JDELGADO J0 AWAIT SENTENCE



        //    html = html + "<br>" +
        //        "           <table font size=8pt  width='30%' >" +
        //        "               <tr>" +
        //        "                   <td align='center'> <b>" + nombre + "</b>" +
        //        "                   </td>" +
        //        "               </tr>" +
        //        "               <tr>" +
        //        "                   <td align='center'> <b>" + direccion + "</b>" +
        //        "                   </td>" +
        //        "               </tr>" +
        //        "               <tr>" +
        //        "                   <td align='center'> <b>Telf. :" + telefono + "</b>" +
        //        "                   </td>" +
        //        "               </tr>" +
        //        "           </table>";

        //    html = html + "<br>" +
        //        "           <table font size=8pt  width='30%' >" +
        //        "               <tr>" +
        //        "                   <td align='center'> <b>Orden Medica</b>" +
        //        "                   </td>" +
        //        "               </tr>" +
        //        "           </table>";

        //    String hmtlCabeceraFarmacia = "";
        //    hmtlCabeceraFarmacia = hmtlCabeceraFarmacia + "<br>" +
        //       "           <table font size=8pt  width='100%' >" +
        //       "               <tr>" +
        //       "                   <td align='center'> <b>" + nombre + "</b>" +
        //       "                   </td>" +
        //       "               </tr>" +
        //       "               <tr>" +
        //       "                   <td align='center'> <b>" + direccion + "</b>" +
        //       "                   </td>" +
        //       "               </tr>" +
        //       "               <tr>" +
        //       "                   <td align='center'> <b>Telf. :" + telefono + "</b>" +
        //       "                   </td>" +
        //       "               </tr>" +
        //       "           </table>";

        //    hmtlCabeceraFarmacia = hmtlCabeceraFarmacia + "<br>" +
        //        "           <table font size=8pt  width='100%' >" +
        //        "               <tr>" +
        //        "                   <td align='center'> <b>Receta Medica</b>" +
        //        "                   </td>" +
        //        "               </tr>" +
        //        "           </table>";

        //    idAtencion = lsAtencion.Tables[0].Rows[0]["idAtencion"].ToString();




        //    string fechaRecetaAux = "";
        //    //Substring(0, 10);

        //    foreach (DataRow dr in lsRecetas.Tables[0].Rows)
        //    {
        //        fechaRecetaAux = dr["fechaReceta"].ToString();
        //        fechaRecetaAux = fechaRecetaAux.Substring(0, 10);
        //        if ((dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia)) && (lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "2" || lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "3" || lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "4"))
        //        {
        //            html = "";
        //            html = html + "<table width='100%' ><tr><td width='50%'>" + hmtlCabeceraFarmacia + "</td><td width='50%'>" + hmtlCabeceraFarmacia + "</td></tr></table>";
        //            html = html + "<table  width='100%'>" +
        //                            "<tr>" +
        //                            "   <td width='50%'>" +
        //                            "       <table>" +
        //                            "           <tr>" +
        //                            "               <td width='100px'><b>F. Vigencia: </b></td><td>" + fechaRecetaAux + "</td>" +
        //                            "           </tr>" +
        //                            "           <tr>" +
        //                            "               <td><b>Paciente: </b></td><td>" + lsAtencion.Tables[0].Rows[0]["ApellidoPaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["ApellidoMaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["nombres"].ToString() + " - <b>HC: </b>" + lsAtencion.Tables[0].Rows[0]["NroHistoriaClinica"].ToString() + "</td>" +
        //                           "           </tr>" +
        //                            "           <tr>" +
        //                            "               <td><b>Tipo Plan: </b></td><td>" + lsAtencion.Tables[0].Rows[0]["PlanA"].ToString() + " -  <b>Edad:</b> " + lsAtencion.Tables[0].Rows[0]["Edad"].ToString() + " - <b>Cuenta: </b>" + idCuentaAtencion + " </td>" +
        //                           "           </tr>" +
        //                            "       </table>" +
        //                            "   </td>" +
        //                            "   <td width='50%'>" +
        //                            "       <table>" +
        //                            "           <tr>" +
        //                            "               <td width='100px'><b>F. Vigencia: </b></td><td>" + fechaRecetaAux + "</td>" +
        //                            "           </tr>" +
        //                            "           <tr>" +
        //                            "               <td><b>Paciente: </b></td><td>" + lsAtencion.Tables[0].Rows[0]["ApellidoPaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["ApellidoMaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["nombres"].ToString() + " - <b>HC: </b>" + lsAtencion.Tables[0].Rows[0]["NroHistoriaClinica"].ToString() + "</td>" +
        //                           "           </tr>" +
        //                            "       </table>" +
        //                            "   </td>" +
        //                            "</tr>" +
        //                          "</table>";
        //        }
        //        else
        //        {
        //            html = html + "<br>" +
        //         "           <table font size=8pt  width='40%' style='font - size:8px' >" +
        //         "               <tr><td width='3%'></td>" +
        //         "                   <td align='left'><b>Fecha Aten.:</b>" +
        //         "                   </td>" +
        //         "                   <td align = 'left' >" + fechaRecetaAux +
        //         "                   </td>" +
        //         "               </tr>" +
        //         //RQ0006 RMOREANOC
        //         "               <tr><td width='3%'></td>" +
        //         "                   <td align='left'><b>Nro.Historia:</b>" +
        //         "                   </td>" +
        //         "                   <td align = 'left' >" + lsAtencion.Tables[0].Rows[0]["NroHistoriaClinica"].ToString() +
        //         "                   </td>" +
        //         "               </tr>" +
        //         //FIN RQ0006
        //         "               <tr><td width='3%'></td>" +
        //         "                   <td align='left'><b>Nro. Cuenta:</b>" +
        //         "                   </td>" +
        //         "                   <td align = 'left' >" + idCuentaAtencion +
        //         "                   </td>" +
        //         "               </tr>" +
        //         "               <tr><td width='3%'></td>" +
        //         "                   <td align='left'><b>Nro. Orden:</b>" +
        //         "                   </td>" +
        //         "                   <td align = 'left' >" + dr["idReceta"].ToString() +
        //         "                   </td>" +
        //         "               </tr>" +
        //         "               <tr><td width='3%'></td>" +
        //         "                   <td align='left'><b>Consultorio:</b>" +
        //         "                   </td>" +
        //         "                   <td align = 'left'>" + lsAtencion.Tables[0].Rows[0]["DesServicio"].ToString() +
        //         "                   </td>" +
        //         "               </tr>" +
        //         "               <tr><td width='3%'></td>" +
        //         "                   <td align='left'><b>Prof. Salud:</b>" +
        //         "                   </td>" +
        //         "                   <td align = 'left' >" + dr["Medico"].ToString() +
        //         "                   </td>" +
        //         "               </tr>" +
        //         "               <tr><td width='3%'></td>" +
        //         "                   <td align='left'><b>Paciente:</b>" +
        //         "                   </td>" +
        //         "                   <td align = 'left' >" + lsAtencion.Tables[0].Rows[0]["ApellidoPaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["ApellidoMaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["nombres"].ToString() +
        //         "                   </td>" +
        //         "               </tr>" +
        //         "               <tr><td width='3%'></td>" +
        //         "                   <td align='left'><b>Tipo Plan:</b>" +
        //         "                   </td>" +
        //         "                   <td align = 'left' >" + lsAtencion.Tables[0].Rows[0]["PlanA"].ToString() +
        //         "                   </td>" +
        //         "               </tr>" +
        //         "           </table><br>";
        //        }


        //        if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaRayosX))
        //        {
        //            html = html + "&nbsp;&nbsp;&nbsp;&nbsp Servicio: (Rayos X)" + "Nro.Receta:" + dr["idReceta"].ToString() + " <hr>";
        //            htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>Concepto</td><td>Cantidad</td></tr>";
        //            lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaRayosX); // JDELGADO J0 AWAIT SENTENCE
        //            foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
        //            {
        //                htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td> " + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
        //            }
        //        }

        //        //eco obste
        //        if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogObstetrica))
        //        {
        //            html = html + "&nbsp;&nbsp;&nbsp;&nbsp Servicio: (Ecografia Obstetrica)" + "Nro.Receta:" + dr["idReceta"].ToString() + "<hr>";
        //            htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>Concepto</td><td>Cantidad</td></tr>";
        //            lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogObstetrica); // JDELGADO J0 AWAIT SENTENCE
        //            foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
        //            {
        //                htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>" + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
        //            }
        //        }

        //        //eco geenral
        //        if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogGeneral))
        //        {

        //            html = html + "&nbsp;&nbsp;&nbsp;&nbsp Servicio: (Ecografia General)<hr>";
        //            htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>Concepto</td><td>Cantidad</td></tr>";
        //            lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogGeneral); // JDELGADO J0 AWAIT SENTENCE
        //            foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
        //            {
        //                htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td> " + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
        //            }


        //        }

        //        //patoclini
        //        if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaPatologiaClinica))
        //        {
        //            html = html + "&nbsp;&nbsp;&nbsp;&nbsp Servicio: (Patologica Clinica)" + "Nro.Receta:" + dr["idReceta"].ToString() + "<hr>";
        //            htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td> Concepto</td><td>Cantidad</td></tr>";
        //            lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaPatologiaClinica); // JDELGADO J0 AWAIT SENTENCE
        //            foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
        //            {
        //                htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td> " + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
        //            }
        //        }

        //        //anatalomiaPa
        //        if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaAnatomiaPatologica1))
        //        {
        //            html = html + "&nbsp;&nbsp;&nbsp;&nbsp Servicio: (Anatomia Patologica)" + "Nro.Receta:" + dr["idReceta"].ToString() + "<hr>";
        //            htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td> Concepto</td><td>Cantidad</td></tr>";
        //            lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaAnatomiaPatologica1); // JDELGADO J0 AWAIT SENTENCE
        //            foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
        //            {
        //                htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>" + drD["Producto"].ToString() + "</td>" + "<td  align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
        //            }


        //        }

        //        //sangre
        //        if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaBancoSangre1))
        //        {
        //            html = html + "&nbsp;&nbsp Servicio: (Banco de Sangre)" + "Nro.Receta:" + dr["idReceta"].ToString() + "<hr>";
        //            htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>Concepto</td><td>Cantidad</td></tr>";
        //            lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaBancoSangre1); // JDELGADO J0 AWAIT SENTENCE
        //            foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
        //            {
        //                htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>" + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
        //            }


        //        }

        //        //interconsulta añadido por jdelgado011
        //        if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaInterconsulta))
        //        {
        //            html = html + "&nbsp;&nbsp Servicio: (Interconsulta)" + "Nro.Receta:" + dr["idReceta"].ToString() + "<hr>";
        //            htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>Concepto</td><td>Cantidad</td></tr>";
        //            lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaInterconsulta); // JDELGADO011
        //            foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
        //            {
        //                htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>" + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
        //            }
        //        }

        //        //farmacia
        //        if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia))
        //        {
        //            //if (lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() != "3")
        //            if ((lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() != "2" && lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() != "3" && lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() != "4"))
        //            {
        //                farmaciaHospi = false;
        //                html = html + "&nbsp;&nbsp;&nbsp;&nbsp Servicio: (Farmacia)" + "Nro.Receta:" + dr["idReceta"].ToString() + "<hr>";
        //                htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>Concepto</td><td>Cant.</td></tr>";
        //                lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia); // JDELGADO J0 AWAIT SENTENCE
        //                foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
        //                {
        //                    htmlTablaItem = htmlTablaItem + "<tr>" + "<td width='5%'></td><td> " + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
        //                }
        //            }
        //            else
        //            {
        //                farmaciaHospi = true;

        //                html = html + "<table>";
        //                //html = html + "&nbsp;<b> Nro.Receta: </b>" + dr["idReceta"].ToString() + "<br>";
        //                //html = html + "&nbsp;<b> Receta del Servicio: </b>" + lsRecetas.Tables[0].Rows[0]["nomServicio"].ToString() + "";
        //                html = html + "<tr><td width='100px'><b> Nro.Receta: </b></td><td>" + dr["idReceta"].ToString() + "<br></td></tr>";
        //                html = html + "<tr><td width='100px'><b> Rec. del Serv.: </b></td><td>" + lsRecetas.Tables[0].Rows[0]["nomServicio"].ToString() + "</td></tr>";
        //                html = html + "</table>";

        //                htmlTablaItem = "<table FRAME='hsides' RULES='rows'>";
        //                htmlTablaItem = htmlTablaItem + "<tr><td></td><td><b>Concepto</b></td><td><b>Cant.</b></td></tr>";
        //                lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia); // JDELGADO J0 AWAIT SENTENCE
        //                foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
        //                {
        //                    htmlTablaItem = htmlTablaItem + "<tr>" + "<td></td><td> " + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
        //                }
        //                htmlTablaItem = htmlTablaItem + "</table><br><br><br><br>";
        //                htmlTablaItem = htmlTablaItem + "<b>" + lsRecetas.Tables[0].Rows[0]["Medico"].ToString() + "</b>";
        //            }
        //        }
        //    };

        //    string htmlDosisFamr;
        //    htmlDosisFamr = "";
        //    //RQ0003 RMOREANOC
        //    foreach (DataRow dr in lsRecetas.Tables[0].Rows)
        //    {
        //        if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia))
        //        {
        //            htmlDosisFamr = htmlDosisFamr + "<table font size=8pt  FRAME='hsides' RULES='rows' width='100%' ><tr><td align='center'> <b>INDICACIONES</b></td></tr></table>";
        //            htmlDosisFamr = htmlDosisFamr + "<table font size=8pt  FRAME='hsides' RULES='rows' width='100%' >";
        //            htmlDosisFamr = htmlDosisFamr + "<tr><td width='5%'></td><td><b>Concepto</b></td><td align='center'><b>Dosis</b></td><td align='center'><b>Vias</b></td><td align='center'><b>Frecuencia</b></td></tr>";
        //            lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia); // JDELGADO J0 AWAIT SENTENCE
        //            foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
        //            {
        //                htmlDosisFamr = htmlDosisFamr + "<tr>" + "<td width='5%'></td><td> " + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["Dosis"].ToString() + "</td>" + "<td align = 'center'>" + drD["Vias"].ToString() + "</td>" + "<td align = 'center'>" + drD["Observaciones"].ToString() + "</td></tr>";
        //            }
        //            htmlDosisFamr = htmlDosisFamr + "</table><br><br><br>";
        //            htmlDosisFamr = htmlDosisFamr + "<b>" + lsRecetas.Tables[0].Rows[0]["Medico"].ToString() + "</b>";
        //        }
        //    };
        //    //RQ0003 RMOREANO 
        //    if (farmaciaHospi)
        //    {
        //        htmlTablaDetalle = "<table font size=8pt width='100%' style='font - size:8px'>" +
        //                            " <tr><td width='50%' valign='top' >" + htmlTablaItem + "</td> <td width='50%' valign='top'>" + htmlDosisFamr + "</td></tr>" +
        //                            " </table>";
        //    }
        //    else
        //    {
        //        htmlTablaDetalle = "<br><table font size=8pt width='30%' style='font - size:8px'><tr><td >" + htmlTablaItem + "</td></tr></table>";
        //        htmlTablaDetalle = htmlTablaDetalle + "<br><table font size=8pt width='30%' style='font - size:8px'><tr><td>" + htmlDosisFamr + "</td></tr></table>";
        //    }
        //    int clasificacionDiagnostico = (lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "1" ? 1 : lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "2" ? 8 : 2);
        //    lsDiagnosticos = await daoAtenciones.AtencionesDiagnosticosSeleccionarPorAtencion(Convert.ToInt32(idAtencion), clasificacionDiagnostico); // JDELGADO J0 AWAIT SENTENCE

        //    string htmldiagnosticosDetalle = "";
        //    string htmldiagnosticostable = "";

        //    foreach (DataRow dr in lsDiagnosticos.Tables[0].Rows)
        //    {
        //        htmldiagnosticosDetalle = htmldiagnosticosDetalle + "<tr><td>" + dr["codigoCIE10"].ToString() + "</td><td>" + dr["descripcion"].ToString() + "</td></tr>";

        //    };
        //    if (farmaciaHospi)
        //    {
        //        htmldiagnosticostable = htmldiagnosticostable + "<hr><b>Diagnositicos</b>";
        //        htmldiagnosticostable = htmldiagnosticostable + "<table width='50%'><tr><td><b>CIE 10</b></td><td><b>Descripcion</b></td></tr>" + htmldiagnosticosDetalle + "</table><br>";
        //    }
        //    else
        //    {
        //        htmldiagnosticostable = htmldiagnosticostable + "";
        //    }

        //    int idUsuario;
        //    idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

        //    html = html + htmldiagnosticostable + htmlTablaDetalle + " <br><b>Usuario WEB:" + idUsuario + "</b>";

        //    //html = html + strRx + "<br>" + strEcoGene + "<br>" + strEcoObs + "<br>" + strAnaPatolo + "<br>" + strPatoloClinica + "<br>" + strBs;
        //    HtmlToPdf ohtml = new HtmlToPdf();
        //    SelectPdf.PdfDocument obPdfDoc = ohtml.ConvertHtmlString(html);

        //    obPdfDoc.Save(path);
        //    generacion_pdf = "Ok";

        //    if (generacion_pdf == "Ok")
        //    {
        //        //verificar creacion 
        //        Task<bool> Tbol = cl.UploadFile(path, Int32.Parse(idCuentaAtencion.ToString()), tipo, Int32.Parse(idReceta.ToString()));
        //        //quita creacion 
        //        //Espera resultado de la tarea, no termina hasta termine
        //        resulfirma = await Tbol;
        //        //resp = true;
        //    }

        //    return Json(new { estadoCreacion = generacion_pdf, ruta = path, resulfirma = resulfirma });
        //    //byte[] pdf = obPdfDoc.Save();

        //    //MemoryStream ms = new MemoryStream();
        //    //ms = new MemoryStream();
        //    //ms.Write(pdf, 0, pdf.Length);
        //    //ms.Position = 0;

        //    //obPdfDoc.Close();

        //    //return new FileStreamResult(
        //    //        ms,
        //    //        MediaTypeNames.Application.Pdf
        //    //    );
        //}

    }
}