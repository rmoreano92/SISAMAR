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
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.Areas.Hospitalizacion
{
    public class EvaluacionGinecoObstetraHospController : Controller
    {
        private IWebHostEnvironment _hostingEnvironment;

        public EvaluacionGinecoObstetraHospController(IWebHostEnvironment env)
        {
            _hostingEnvironment = env;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarEvaluacion(int idAtencion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionHospitalizacion daoEvaluacion = new DalEvaluacionHospitalizacion();
            //Boolean hoja;

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoEvaluacion.SeleccionarEvaluacion(idAtencion, idUsuario);
            //hoja = await GenerarHojaRefCon(objRef.IdCuentaAtencion, Convert.ToInt32(ds.Tables[0].Rows[0]["IdReferencia"].ToString()), 1, "RF");

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarEvaluacionDetalle(int idAtencion, int idServicio)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionHospitalizacion daoEvaluacion = new DalEvaluacionHospitalizacion();
            //Boolean hoja;

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoEvaluacion.SeleccionarEvaluacionDetalle(idAtencion, idServicio, idUsuario);
            //hoja = await GenerarHojaRefCon(objRef.IdCuentaAtencion, Convert.ToInt32(ds.Tables[0].Rows[0]["IdReferencia"].ToString()), 1, "RF");

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarEvaluacionDetallePorEvaluacion(int idAtencion, int idServicio, int nroEvaluacion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionHospitalizacion daoEvaluacion = new DalEvaluacionHospitalizacion();
            //Boolean hoja;

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoEvaluacion.SeleccionarEvaluacionDetallePorEvaluacion(idAtencion, idServicio, nroEvaluacion, idUsuario);
            //hoja = await GenerarHojaRefCon(objRef.IdCuentaAtencion, Convert.ToInt32(ds.Tables[0].Rows[0]["IdReferencia"].ToString()), 1, "RF");

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarExamenGinecoObstetra(int idAtencion, int idServicio)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionGinecoObstetraHosp daoEvaluacion = new DalEvaluacionGinecoObstetraHosp();
            //Boolean hoja;

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoEvaluacion.SeleccionarExamenGinecoObstetra(idAtencion, idServicio, idUsuario);
            //hoja = await GenerarHojaRefCon(objRef.IdCuentaAtencion, Convert.ToInt32(ds.Tables[0].Rows[0]["IdReferencia"].ToString()), 1, "RF");

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> EstanciaHospitalariaSeleccionarPorAtencion(int idAtencion, int SecuenciaMayorA)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionGinecoObstetraHosp daoEvaluacion = new DalEvaluacionGinecoObstetraHosp();
            //Boolean hoja;

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoEvaluacion.EstanciaHospitalariaSeleccionarPorAtencion(idAtencion, SecuenciaMayorA);
            //hoja = await GenerarHojaRefCon(objRef.IdCuentaAtencion, Convert.ToInt32(ds.Tables[0].Rows[0]["IdReferencia"].ToString()), 1, "RF");

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> GuardarEvaluacion(EvaluacionHospitalizacion objEvaHosp, AntecedentesHospitalizacion antecedentesHospitalizacion, GestacionActualCpnHospitalizacion gestacionActualCpn, TrabajoPartoHospitalizacion trabajoPartoHospitalizacion,
                                    String IafaPlanHosp, String RiesgoSocialHosp, String MedicoIngresoHosp, int? TieneIQxHosp, DateTime? FechaIQxHosp, int? MetodoPlanificacionHosp, String lstDiagnosticosIngreso)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionGinecoObstetraHosp daoEvaluacion = new DalEvaluacionGinecoObstetraHosp();
            DalTriaje daoTriaje = new DalTriaje();
            DalUtilitario dalUtili = new DalUtilitario();
            //Boolean triaje, hoja;

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                objEvaHosp.IdUsuario = idUsuario;
                ds = await daoEvaluacion.GuardarEvaluacion(objEvaHosp, antecedentesHospitalizacion, gestacionActualCpn, trabajoPartoHospitalizacion, IafaPlanHosp, RiesgoSocialHosp, MedicoIngresoHosp, TieneIQxHosp, FechaIQxHosp, MetodoPlanificacionHosp);

                if (lstDiagnosticosIngreso != "[]")
                {
                    var lstobjDiagnosticosIngreso = JsonConvert.DeserializeObject<List<Diagnosticos>>(lstDiagnosticosIngreso);
                    var resp = await dalUtili.insertaDiagnosticos(objEvaHosp.IdAtencion, (int)Enumerados.TiposDiagnostico.HospitalizacionIngreso, idUsuario, lstobjDiagnosticosIngreso);
                }
                

                return Json(new { respuesta = ds, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (GuardarEvaluacion): " + ex });
            }

        }

        [HttpPost]
        public async Task<ActionResult> GenerarHojaCabecera(int idCuentaAtencion, int idAtencion)
        {
            DataSet ds;
            //DataSet evadet;
            DalEvaluacionHospitalizacion daoEvaluacion = new DalEvaluacionHospitalizacion();
            DalUtilitario daoUtil = new DalUtilitario();
            Boolean informe;
            int idEvaluacionDetalle = 0;
            int idServicio = 0;
            int idUsuario = 0;

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            try
            {
                ds = await daoEvaluacion.SeleccionarEvaluacionDetallePorEvaluacion(idAtencion, 0, 1, 0);

                if (ds.Tables.Count > 0)
                {
                    idEvaluacionDetalle = Convert.ToInt32(ds.Tables[0].Rows[0]["idEvaluacionDetalle"].ToString());
                    idServicio = Convert.ToInt32(ds.Tables[0].Rows[0]["idServicio"].ToString());
                    idUsuario = Convert.ToInt32(ds.Tables[0].Rows[0]["idUsuario"].ToString());
                    if (idUsuario != int.Parse(HttpContext.Session.GetString("idusu")))
                    {
                        return Json(new { respuesta = false, session = true, mensaje = "Usted no puede modificar la evaluación de otro médico.", estado = false });
                    }
                }
                else
                {
                    return Json(new { respuesta = false, session = true, mensaje = "No es posible actualizar la hoja de evaluación cuando no existe ninguna evaluación.", estado = false });
                }

                informe = await GenerarHojaEvaluacion(idCuentaAtencion, idAtencion, idEvaluacionDetalle, idServicio, 1);

                return Json(new { respuesta = ds, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (GeneraHojaCabeceraEvaluacion): " + ex });
            }
        }

        [HttpPost]
        public async Task<ActionResult> GuardarExamenGinecoObstetra(ExamenGinecoObstetra objExamen)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionGinecoObstetraHosp daoEvaluacion = new DalEvaluacionGinecoObstetraHosp();
            DalTriaje daoTriaje = new DalTriaje();
            //Boolean triaje, hoja;

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                objExamen.IdUsuario = idUsuario;
                ds = await daoEvaluacion.GuardarExamenGinecoObstetra(objExamen);

                return Json(new { respuesta = ds, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (GuardarEvaluacion): " + ex });
            }
        }

        [HttpPost]
        public async Task<ActionResult> GuardarEvaluacionDetalle(EvaluacionHospitalizacionDetalle objEvaHosp, String lstDiagnosticos)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            if (objEvaHosp.IdUsuario != 0)
            {
                if (objEvaHosp.IdUsuario != int.Parse(HttpContext.Session.GetString("idusu")))
                {
                    return Json(new { respuesta = false, session = true, mensaje = "Usted no puede modificar la evaluación de otro médico.", estado = false });
                }
            }

            DataSet ds;
            //DataSet evadet;
            DalEvaluacionGinecoObstetraHosp daoEvaluacion = new DalEvaluacionGinecoObstetraHosp();
            DalUtilitario daoUtil = new DalUtilitario();
            Boolean informe;

            try
            {
                bool resp = false;
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                objEvaHosp.IdUsuario = idUsuario;
                var lstobjDiagnosticos = JsonConvert.DeserializeObject<List<Diagnosticos>>(lstDiagnosticos);

                ds = await daoEvaluacion.GuardarEvaluacionDetalle(objEvaHosp);
                resp = await daoUtil.insertaDiagnosticosPorEvaluacion((int)objEvaHosp.IdAtencion, (int)Enumerados.TiposDiagnostico.EmergenciaIngreso, idUsuario, lstobjDiagnosticos, (int)objEvaHosp.idservicio, (int)objEvaHosp.IdNumero);

                //evadet = await daoEvaluacion.SeleccionarEvaluacionDetalleNeonatalPorEvaluacion(objEvaHosp.IdAtencion, objEvaHosp.IdNumero, idUsuario);
                informe = await GenerarHojaEvaluacion(objEvaHosp.IdCuentaAtencion, objEvaHosp.IdAtencion, Convert.ToInt32(ds.Tables[0].Rows[0]["IdEvaluacionDetalle"].ToString()), objEvaHosp.idservicio, objEvaHosp.IdNumero);

                return Json(new { respuesta = ds, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (GuardarEvaluacion): " + ex });
            }
        }

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
                pageHtml = Url.Action("InformeEvaluacion", "EvaluacionGinecoObstetraHosp", new { area = "Hospitalizacion", idAtencion, idServicio, eval, usuario }, "http");

                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;
                resp = await utilitario.GenerarDocumentoDigital(idCuenta, idEvaluacionDetalle, 0, "H-EVA", 0, pageHtml, stringHtml, idUsuario, pdf);

                return resp;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                return false;
            }
        }

        public async Task<ActionResult> InformeEvaluacion(int idAtencion, int idServicio, int eval, string usuario)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();

            DataSet DatosEvaluacion;
            DataSet Diagnosticos;
            //DateTime today = DateTime.Today;
            int idUsuario = 0;

            DalEvaluacionGinecoObstetraHosp daoEvaluacion = new DalEvaluacionGinecoObstetraHosp();
            DalAtenciones daoAtenciones = new DalAtenciones();

            @ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss");
            @ViewBag.Usuario = usuario;
            //idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));


            DatosEvaluacion = await daoEvaluacion.SeleccionarInformeEvaluacionHospitalizacion(idAtencion, idServicio, eval, idUsuario);
            Diagnosticos = await daoAtenciones.AtencionesDiagnosticosSeleccionarPorAtencionPorNumeroEvaluacion(idAtencion, (int)Enumerados.TiposDiagnostico.EmergenciaIngreso, idServicio, eval);
            DataTable dtDx = Diagnosticos.Tables[0];

            @ViewBag.FechaEvaluacion = DatosEvaluacion.Tables[0].Rows[0]["FechaEvaluacion"];
            @ViewBag.HoraEvaluacion = DatosEvaluacion.Tables[0].Rows[0]["HoraEvaluacion"];
            @ViewBag.Glasgow = DatosEvaluacion.Tables[0].Rows[0]["Glasgow"];
            @ViewBag.TieneSis = DatosEvaluacion.Tables[0].Rows[0]["TieneSis"];
            @ViewBag.Edad = DatosEvaluacion.Tables[0].Rows[0]["Edad"];
            @ViewBag.G = DatosEvaluacion.Tables[0].Rows[0]["G"];
            @ViewBag.P = DatosEvaluacion.Tables[0].Rows[0]["P"];
            @ViewBag.Prioridad = DatosEvaluacion.Tables[0].Rows[0]["Prioridad"];
            @ViewBag.TipoPacienteDesc = DatosEvaluacion.Tables[0].Rows[0]["TipoPacienteDesc"];

            @ViewBag.NroEvaluacion = eval;

            @ViewBag.Paciente = DatosEvaluacion.Tables[0].Rows[0]["Paciente"];
            @ViewBag.NroCuenta = DatosEvaluacion.Tables[0].Rows[0]["NroCuenta"];
            @ViewBag.NroHistoriaClinica = DatosEvaluacion.Tables[0].Rows[0]["NroHistoriaClinica"];
            @ViewBag.FechaNacimiento = DatosEvaluacion.Tables[0].Rows[0]["FechaNacimiento"];
            @ViewBag.HoraNacimiento = DatosEvaluacion.Tables[0].Rows[0]["HoraNacimiento"];
            @ViewBag.Servicio = DatosEvaluacion.Tables[0].Rows[0]["Servicio"];
            @ViewBag.Cama = DatosEvaluacion.Tables[0].Rows[0]["Cama"];

            @ViewBag.TipoPaciente = DatosEvaluacion.Tables[0].Rows[0]["TipoPaciente"];

            @ViewBag.TiempoEnfermedad = DatosEvaluacion.Tables[0].Rows[0]["TiempoEnfermedad"];
            @ViewBag.Inicio = DatosEvaluacion.Tables[0].Rows[0]["Inicio"];
            @ViewBag.Curso = DatosEvaluacion.Tables[0].Rows[0]["Curso"];

            @ViewBag.Fur = DatosEvaluacion.Tables[0].Rows[0]["Fur"];
            @ViewBag.Fpp = DatosEvaluacion.Tables[0].Rows[0]["Fpp"];
            @ViewBag.Fue = DatosEvaluacion.Tables[0].Rows[0]["Fue"];
            @ViewBag.Fpe = DatosEvaluacion.Tables[0].Rows[0]["Fpe"];
            @ViewBag.EdadGestacional = DatosEvaluacion.Tables[0].Rows[0]["EdadGestacional"];
            @ViewBag.Cpn = DatosEvaluacion.Tables[0].Rows[0]["Cpn"];
            @ViewBag.Pin = DatosEvaluacion.Tables[0].Rows[0]["Pin"];
            @ViewBag.DeltaPeso = DatosEvaluacion.Tables[0].Rows[0]["DeltaPeso"];
            @ViewBag.MadPulmonar = DatosEvaluacion.Tables[0].Rows[0]["MadPulmonar"];
            @ViewBag.DMadPulmonar = DatosEvaluacion.Tables[0].Rows[0]["DMadPulmonar"];
            @ViewBag.MadCervical = DatosEvaluacion.Tables[0].Rows[0]["MadCervical"];
            @ViewBag.DMadCervical = DatosEvaluacion.Tables[0].Rows[0]["DMadCervical"];

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

            @ViewBag.ContraccionUterina = DatosEvaluacion.Tables[0].Rows[0]["ContraccionUterina"];
            @ViewBag.SangradoVaginal = DatosEvaluacion.Tables[0].Rows[0]["SangradoVaginal"];
            @ViewBag.PerdidaLiquido = DatosEvaluacion.Tables[0].Rows[0]["PerdidaLiquido"];
            @ViewBag.MovimientoFetal = DatosEvaluacion.Tables[0].Rows[0]["MovimientoFetal"];
            @ViewBag.SintomaUrinario = DatosEvaluacion.Tables[0].Rows[0]["SintomaUrinario"];
            @ViewBag.FlujoVaginal = DatosEvaluacion.Tables[0].Rows[0]["FlujoVaginal"];
            @ViewBag.Tumoracion = DatosEvaluacion.Tables[0].Rows[0]["Tumoracion"];
            @ViewBag.AlteracionMenstrual = DatosEvaluacion.Tables[0].Rows[0]["AlteracionMenstrual"];
            @ViewBag.DismMovimientoFetal = DatosEvaluacion.Tables[0].Rows[0]["DismMovimientoFetal"];
            @ViewBag.Otros = DatosEvaluacion.Tables[0].Rows[0]["Otros"];
            @ViewBag.OtrosSintomas = DatosEvaluacion.Tables[0].Rows[0]["OtrosSintomas"];

            @ViewBag.Relato = DatosEvaluacion.Tables[0].Rows[0]["Relato"];
            @ViewBag.EnfermedadActual = DatosEvaluacion.Tables[0].Rows[0]["EnfermedadActual"];
            @ViewBag.PesoFetalAnt = DatosEvaluacion.Tables[0].Rows[0]["PesoFetalAnt"];

            @ViewBag.Ram = DatosEvaluacion.Tables[0].Rows[0]["Ram"];
            @ViewBag.Transfusiones = DatosEvaluacion.Tables[0].Rows[0]["Transfusiones"];
            @ViewBag.Antecedentes = DatosEvaluacion.Tables[0].Rows[0]["Antecedentes"];
            @ViewBag.AntecedentesQuirurgicos = DatosEvaluacion.Tables[0].Rows[0]["AntecedentesQuirurgicos"];
            //@ViewBag.PesoNacer = DatosEvaluacion.Tables[0].Rows[0]["PesoNacer"];
            //@ViewBag.TallaNacer = DatosEvaluacion.Tables[0].Rows[0]["TallaNacer"];
            //@ViewBag.PerimetroCefalicoNacer = DatosEvaluacion.Tables[0].Rows[0]["PerimetroCefalicoNacer"];
            //@ViewBag.PerimetroToracioNacer = DatosEvaluacion.Tables[0].Rows[0]["PerimetroToracioNacer"];
            //@ViewBag.ApgarNacer = DatosEvaluacion.Tables[0].Rows[0]["ApgarNacer"];
            //@ViewBag.AntecedentesPatlogicosNacer = DatosEvaluacion.Tables[0].Rows[0]["AntecedentesPatlogicosNacer"];
            //@ViewBag.EdadGestacionalNacer = DatosEvaluacion.Tables[0].Rows[0]["EdadGestacionalNacer"];

            @ViewBag.FrecuenciaCardiaca = DatosEvaluacion.Tables[0].Rows[0]["FrecuenciaCardiaca"];
            @ViewBag.FrecuenciaRespiratoria = DatosEvaluacion.Tables[0].Rows[0]["FrecuenciaRespiratoria"];
            @ViewBag.Temperatura = DatosEvaluacion.Tables[0].Rows[0]["Temperatura"];
            @ViewBag.PresionArterial = DatosEvaluacion.Tables[0].Rows[0]["PresionArterial"];
            @ViewBag.Talla = DatosEvaluacion.Tables[0].Rows[0]["Talla"];
            @ViewBag.Peso = DatosEvaluacion.Tables[0].Rows[0]["Peso"];
            @ViewBag.Saturacion = DatosEvaluacion.Tables[0].Rows[0]["Saturacion"];
            @ViewBag.ObservacionTriaje = DatosEvaluacion.Tables[0].Rows[0]["ObservacionTriaje"];

            @ViewBag.EstadoGeneralSensorio = DatosEvaluacion.Tables[0].Rows[0]["EstadoGeneralSensorio"];
            @ViewBag.DEstadoGeneralSensorio = DatosEvaluacion.Tables[0].Rows[0]["DEstadoGeneralSensorio"];
            @ViewBag.EEstadoGeneralSensorio = DatosEvaluacion.Tables[0].Rows[0]["EEstadoGeneralSensorio"];
            @ViewBag.AparatoCardioVascular = DatosEvaluacion.Tables[0].Rows[0]["AparatoCardioVascular"];
            @ViewBag.DAparatoCardioVascular = DatosEvaluacion.Tables[0].Rows[0]["DAparatoCardioVascular"];
            @ViewBag.RAparatoCardioVascular = DatosEvaluacion.Tables[0].Rows[0]["RAparatoCardioVascular"];
            @ViewBag.AparatoRespiratorio = DatosEvaluacion.Tables[0].Rows[0]["AparatoRespiratorio"];
            @ViewBag.DAparatoRespiratorio = DatosEvaluacion.Tables[0].Rows[0]["DAparatoRespiratorio"];
            @ViewBag.AparatoUrinario = DatosEvaluacion.Tables[0].Rows[0]["AparatoUrinario"];
            @ViewBag.DAparatoUrinario = DatosEvaluacion.Tables[0].Rows[0]["DAparatoUrinario"];
            @ViewBag.Abdomen = DatosEvaluacion.Tables[0].Rows[0]["Abdomen"];
            @ViewBag.DAbdomen = DatosEvaluacion.Tables[0].Rows[0]["DAbdomen"];
            @ViewBag.Extremidades = DatosEvaluacion.Tables[0].Rows[0]["Extremidades"];
            @ViewBag.DExtremidades = DatosEvaluacion.Tables[0].Rows[0]["DExtremidades"];
            @ViewBag.Neurologico = DatosEvaluacion.Tables[0].Rows[0]["Neurologico"];
            @ViewBag.DNeurologico = DatosEvaluacion.Tables[0].Rows[0]["DNeurologico"];
            @ViewBag.Piel = DatosEvaluacion.Tables[0].Rows[0]["Piel"];
            @ViewBag.DPiel = DatosEvaluacion.Tables[0].Rows[0]["DPiel"];

            @ViewBag.GeBus = DatosEvaluacion.Tables[0].Rows[0]["GeBus"];
            @ViewBag.DGeBus = DatosEvaluacion.Tables[0].Rows[0]["DGeBus"];
            @ViewBag.Vagina = DatosEvaluacion.Tables[0].Rows[0]["Vagina"];
            @ViewBag.DVagina = DatosEvaluacion.Tables[0].Rows[0]["DVagina"];
            @ViewBag.Cervix = DatosEvaluacion.Tables[0].Rows[0]["Cervix"];
            @ViewBag.DCervix = DatosEvaluacion.Tables[0].Rows[0]["DCervix"];
            @ViewBag.Utero = DatosEvaluacion.Tables[0].Rows[0]["Utero"];
            @ViewBag.DUtero = DatosEvaluacion.Tables[0].Rows[0]["DUtero"];
            @ViewBag.Anexos = DatosEvaluacion.Tables[0].Rows[0]["Anexos"];
            @ViewBag.DAnexos = DatosEvaluacion.Tables[0].Rows[0]["DAnexos"];
            @ViewBag.FsDouglas = DatosEvaluacion.Tables[0].Rows[0]["FsDouglas"];
            @ViewBag.DFsDouglas = DatosEvaluacion.Tables[0].Rows[0]["DFsDouglas"];
            @ViewBag.Parametros = DatosEvaluacion.Tables[0].Rows[0]["Parametros"];
            @ViewBag.DParametros = DatosEvaluacion.Tables[0].Rows[0]["DParametros"];
            @ViewBag.Mamas = DatosEvaluacion.Tables[0].Rows[0]["Mamas"];
            @ViewBag.DMamas = DatosEvaluacion.Tables[0].Rows[0]["DMamas"];

            @ViewBag.ObservacionGinecologica = DatosEvaluacion.Tables[0].Rows[0]["ObservacionGinecologica"];

            @ViewBag.Au = DatosEvaluacion.Tables[0].Rows[0]["Au"];
            @ViewBag.Lcf = DatosEvaluacion.Tables[0].Rows[0]["Lcf"];
            @ViewBag.Du = DatosEvaluacion.Tables[0].Rows[0]["Du"];
            @ViewBag.TipoEmbarazo = DatosEvaluacion.Tables[0].Rows[0]["TipoEmbarazo"];
            @ViewBag.FUSituacion = DatosEvaluacion.Tables[0].Rows[0]["FUSituacion"];
            @ViewBag.FUPosicion = DatosEvaluacion.Tables[0].Rows[0]["FUPosicion"];
            @ViewBag.FUPresentacion = DatosEvaluacion.Tables[0].Rows[0]["FUPresentacion"];
            @ViewBag.Dips1 = DatosEvaluacion.Tables[0].Rows[0]["Dips1"];
            @ViewBag.Dips2 = DatosEvaluacion.Tables[0].Rows[0]["Dips2"];
            @ViewBag.Dips3 = DatosEvaluacion.Tables[0].Rows[0]["Dips3"];
            @ViewBag.SppF1 = DatosEvaluacion.Tables[0].Rows[0]["SppF1"];
            @ViewBag.SppF2 = DatosEvaluacion.Tables[0].Rows[0]["SppF2"];
            @ViewBag.SppF3 = DatosEvaluacion.Tables[0].Rows[0]["SppF3"];
            @ViewBag.LcfF1 = DatosEvaluacion.Tables[0].Rows[0]["LcfF1"];
            @ViewBag.LcfF2 = DatosEvaluacion.Tables[0].Rows[0]["LcfF2"];
            @ViewBag.LcfF3 = DatosEvaluacion.Tables[0].Rows[0]["LcfF3"];
            @ViewBag.Soplos = DatosEvaluacion.Tables[0].Rows[0]["Soplos"];
            @ViewBag.Hidramnios = DatosEvaluacion.Tables[0].Rows[0]["Hidramnios"];
            @ViewBag.PonderadoFetal = DatosEvaluacion.Tables[0].Rows[0]["PonderadoFetal"];
            @ViewBag.PonderadoClinico = DatosEvaluacion.Tables[0].Rows[0]["PonderadoClinico"];
            @ViewBag.PonderadoEcografo = DatosEvaluacion.Tables[0].Rows[0]["PonderadoEcografo"];

            @ViewBag.Dilatacion = DatosEvaluacion.Tables[0].Rows[0]["Dilatacion"];
            @ViewBag.Incorporacion = DatosEvaluacion.Tables[0].Rows[0]["Incorporacion"];
            @ViewBag.AlturaPresente = DatosEvaluacion.Tables[0].Rows[0]["AlturaPresente"];
            @ViewBag.VariedadPresente = DatosEvaluacion.Tables[0].Rows[0]["VariedadPresente"];
            @ViewBag.MembranaRota = DatosEvaluacion.Tables[0].Rows[0]["MembranaRota"];
            @ViewBag.Procubito = DatosEvaluacion.Tables[0].Rows[0]["Procubito"];
            @ViewBag.Prolapso = DatosEvaluacion.Tables[0].Rows[0]["Prolapso"];
            @ViewBag.SangradoVaginal = DatosEvaluacion.Tables[0].Rows[0]["SangradoVaginal"];
            @ViewBag.LAClaro = DatosEvaluacion.Tables[0].Rows[0]["Claro"];
            @ViewBag.LAMeconial = DatosEvaluacion.Tables[0].Rows[0]["Meconial"];
            @ViewBag.LASanguinolento = DatosEvaluacion.Tables[0].Rows[0]["Sanguinolento"];
            @ViewBag.LAMalOlor = DatosEvaluacion.Tables[0].Rows[0]["MalOlor"];
            @ViewBag.PelvimetriaSuperior = DatosEvaluacion.Tables[0].Rows[0]["PelvimetriaSuperior"];
            @ViewBag.PelvimetriaMedio = DatosEvaluacion.Tables[0].Rows[0]["PelvimetriaMedio"];
            @ViewBag.PelvimetriaInferior = DatosEvaluacion.Tables[0].Rows[0]["PelvimetriaInferior"];
            @ViewBag.PelvisGinecoide = DatosEvaluacion.Tables[0].Rows[0]["PelvisGinecoide"];
            @ViewBag.DPelvisGinecoide = DatosEvaluacion.Tables[0].Rows[0]["DPelvisGinecoide"];
            @ViewBag.FetoPelvDudosa = DatosEvaluacion.Tables[0].Rows[0]["FetoPelvDudosa"];
            @ViewBag.FetoPelvSi = DatosEvaluacion.Tables[0].Rows[0]["FetoPelvSi"];
            @ViewBag.FetoPelvNo = DatosEvaluacion.Tables[0].Rows[0]["FetoPelvNo"];
            @ViewBag.ObservacionDilatacion = DatosEvaluacion.Tables[0].Rows[0]["ObservacionDilatacion"];
            @ViewBag.ObservacionObstetrica = DatosEvaluacion.Tables[0].Rows[0]["ObservacionObstetrica"];

            @ViewBag.DxEvaluacion = dtDx;

            @ViewBag.Evaluacion = DatosEvaluacion.Tables[0].Rows[0]["Evaluacion"];
            @ViewBag.ImpresionDiagnostica = DatosEvaluacion.Tables[0].Rows[0]["ImpresionDiagnostica"];
            @ViewBag.PlanTrabajo = DatosEvaluacion.Tables[0].Rows[0]["PlanTrabajo"];
            @ViewBag.Tratamiento = DatosEvaluacion.Tables[0].Rows[0]["Tratamiento"];

            @ViewBag.TipoDestino = DatosEvaluacion.Tables[0].Rows[0]["TipoDestino"];
            @ViewBag.TipoAlta = DatosEvaluacion.Tables[0].Rows[0]["TipoAlta"];
            @ViewBag.TipoCondicionAlta = DatosEvaluacion.Tables[0].Rows[0]["TipoCondicionAlta"];

            @ViewBag.Medico = DatosEvaluacion.Tables[0].Rows[0]["Medico"];

            @ViewBag.CodeFirma = DatosEvaluacion.Tables[0].Rows[0]["code"];

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


            if (eval == 1)
            {
                return PartialView("~/Views/Hospitalizacion/Plantillas/InformeEvaluacionGinecoObstetra.cshtml");
            }
            else
            {
                return PartialView("~/Views/Hospitalizacion/Plantillas/InformeReEvaluacionGinecoObstetra.cshtml");
            }

        }


    }
}
