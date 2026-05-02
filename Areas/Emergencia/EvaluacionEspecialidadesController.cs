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
using System.Collections.Generic;
using System.Data;
using System;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Emergencia
{
    public class EvaluacionEspecialidadesController : BaseController
    {
        //private IHostingEnvironment _hostingEnvironment;
        private IWebHostEnvironment _hostingEnvironment;

        //public EvaluacionEmergenciaController(IHostingEnvironment env)
        public EvaluacionEspecialidadesController(IWebHostEnvironment env)
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
            DalEvaluacionEspecialidades daoEvaluacion = new DalEvaluacionEspecialidades();
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
            DalEvaluacionEspecialidades daoEvaluacion = new DalEvaluacionEspecialidades();
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
            DalEvaluacionEspecialidades daoEvaluacion = new DalEvaluacionEspecialidades();
            //Boolean hoja;

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoEvaluacion.SeleccionarEvaluacionDetallePorEvaluacion(idAtencion, idServicio, nroEvaluacion, idUsuario);
            //hoja = await GenerarHojaRefCon(objRef.IdCuentaAtencion, Convert.ToInt32(ds.Tables[0].Rows[0]["IdReferencia"].ToString()), 1, "RF");

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarExamenFisico(int idAtencion, int idServicio)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionEspecialidades daoEvaluacion = new DalEvaluacionEspecialidades();
            //Boolean hoja;

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoEvaluacion.SeleccionarExamenFisico(idAtencion, idServicio, idUsuario);
            //hoja = await GenerarHojaRefCon(objRef.IdCuentaAtencion, Convert.ToInt32(ds.Tables[0].Rows[0]["IdReferencia"].ToString()), 1, "RF");

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> GuardarEvaluacion(EvaluacionEmergencia objEvaEmer)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionEspecialidades daoEvaluacion = new DalEvaluacionEspecialidades();
            DalTriaje daoTriaje = new DalTriaje();
            //Boolean triaje, hoja;

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                objEvaEmer.IdUsuario = idUsuario;
                ds = await daoEvaluacion.GuardarEvaluacion(objEvaEmer);

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
            DalEvaluacionEspecialidades daoEvaluacion = new DalEvaluacionEspecialidades();
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
        public async Task<ActionResult> GuardarExamenEspecialidades(ExamenFisicoEspecialidad objExamen)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionEspecialidades daoEvaluacion = new DalEvaluacionEspecialidades();
            DalTriaje daoTriaje = new DalTriaje();
            //Boolean triaje, hoja;

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                objExamen.IdUsuario = idUsuario;
                ds = await daoEvaluacion.GuardarExamenFisico(objExamen);

                return Json(new { respuesta = ds, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (GuardarEvaluacion): " + ex });
            }
        }

        [HttpPost]
        public async Task<ActionResult> GuardarEvaluacionDetalle(EvaluacionEmergenciaDetalle objEvaEmer, String lstDiagnosticos)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            if (objEvaEmer.IdUsuario != 0)
            {
                if (objEvaEmer.IdUsuario != int.Parse(HttpContext.Session.GetString("idusu")))
                {
                    return Json(new { respuesta = false, session = true, mensaje = "Usted no puede modificar la evaluación de otro médico.", estado = false });
                }
            }

            DataSet ds;
            //DataSet evadet;
            DalEvaluacionEspecialidades daoEvaluacion = new DalEvaluacionEspecialidades();
            DalUtilitario daoUtil = new DalUtilitario();
            Boolean informe;

            try
            {
                bool resp = false;
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                objEvaEmer.IdUsuario = idUsuario;
                var lstobjDiagnosticos = JsonConvert.DeserializeObject<List<Diagnosticos>>(lstDiagnosticos);

                ds = await daoEvaluacion.GuardarEvaluacionDetalle(objEvaEmer);
                resp = await daoUtil.insertaDiagnosticosPorEvaluacion((int)objEvaEmer.IdAtencion, (int)Enumerados.TiposDiagnostico.EmergenciaIngreso, idUsuario, lstobjDiagnosticos, (int)objEvaEmer.idservicio, (int)objEvaEmer.IdNumero);

                //evadet = await daoEvaluacion.SeleccionarEvaluacionDetalleNeonatalPorEvaluacion(objEvaEmer.IdAtencion, objEvaEmer.IdNumero, idUsuario);
                informe = await GenerarHojaEvaluacion(objEvaEmer.IdCuentaAtencion, objEvaEmer.IdAtencion, Convert.ToInt32(ds.Tables[0].Rows[0]["IdEvaluacionDetalle"].ToString()), objEvaEmer.idservicio, objEvaEmer.IdNumero);

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
                pageHtml = Url.Action("InformeEvaluacion", "EvaluacionEspecialidades", new { area = "Emergencia", idAtencion, idServicio, eval, usuario }, "http");

                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;
                pdf.cookies = HttpContext.Request.Headers["Cookie"].ToString();
                resp = await utilitario.GenerarDocumentoDigital(idCuenta, idEvaluacionDetalle, 0, "E-EVA", 0, pageHtml, stringHtml, idUsuario, pdf);

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

            DalEvaluacionEspecialidades daoEvaluacion = new DalEvaluacionEspecialidades();
            DalAtenciones daoAtenciones = new DalAtenciones();

            @ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss");
            @ViewBag.Usuario = usuario;
            //idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));


            DatosEvaluacion = await daoEvaluacion.SeleccionarInformeEvaluacionEmergencia(idAtencion, idServicio, eval, idUsuario);
            Diagnosticos = await daoAtenciones.AtencionesDiagnosticosSeleccionarPorAtencionPorNumeroEvaluacion(idAtencion, (int)Enumerados.TiposDiagnostico.EmergenciaIngreso, idServicio, eval);
            DataTable dtDx = Diagnosticos.Tables[0];

            //@ViewBag.FechaIngreso = DatosEvaluacion.Tables[0].Rows[0]["FechaIngreso"];
            //@ViewBag.HoraIngreso = DatosEvaluacion.Tables[0].Rows[0]["HoraIngreso"];
            @ViewBag.FuenteFinanciamiento = DatosEvaluacion.Tables[0].Rows[0]["FuenteFinanciamiento"];
            //@ViewBag.MedicoIngreso = DatosEvaluacion.Tables[0].Rows[0]["MedicoIngreso"];
            @ViewBag.Telefono = DatosEvaluacion.Tables[0].Rows[0]["Telefono"];
            @ViewBag.Direccion = DatosEvaluacion.Tables[0].Rows[0]["Direccion"];
            @ViewBag.Departamento = DatosEvaluacion.Tables[0].Rows[0]["Departamento"];
            @ViewBag.Provincia = DatosEvaluacion.Tables[0].Rows[0]["Provincia"];
            @ViewBag.Distrito = DatosEvaluacion.Tables[0].Rows[0]["Distrito"];
            @ViewBag.CentroPoblado = DatosEvaluacion.Tables[0].Rows[0]["CentroPoblado"];
            @ViewBag.Acompaniante = DatosEvaluacion.Tables[0].Rows[0]["Acompaniante"];
            @ViewBag.TelefonoAcomp = DatosEvaluacion.Tables[0].Rows[0]["TelefonoAcomp"];

            @ViewBag.FechaEvaluacion = DatosEvaluacion.Tables[0].Rows[0]["FechaEvaluacion"];
            @ViewBag.HoraEvaluacion = DatosEvaluacion.Tables[0].Rows[0]["HoraEvaluacion"];
            @ViewBag.Glasgow = DatosEvaluacion.Tables[0].Rows[0]["Glasgow"];
            @ViewBag.TieneSis = DatosEvaluacion.Tables[0].Rows[0]["TieneSis"];
            @ViewBag.Edad = DatosEvaluacion.Tables[0].Rows[0]["Edad"];
            @ViewBag.G = DatosEvaluacion.Tables[0].Rows[0]["G"];
            @ViewBag.P = DatosEvaluacion.Tables[0].Rows[0]["P"];
            @ViewBag.Prioridad = DatosEvaluacion.Tables[0].Rows[0]["Prioridad"];
            @ViewBag.TipoPacienteDesc = DatosEvaluacion.Tables[0].Rows[0]["TipoPacienteDesc"];
            @ViewBag.IdFuenteFinanciamiento = DatosEvaluacion.Tables[0].Rows[0]["IdFuenteFinanciamiento"];

            @ViewBag.NroEvaluacion = eval;

            @ViewBag.Paciente = DatosEvaluacion.Tables[0].Rows[0]["Paciente"];
            @ViewBag.NroCuenta = DatosEvaluacion.Tables[0].Rows[0]["NroCuenta"];
            @ViewBag.NroHistoriaClinica = DatosEvaluacion.Tables[0].Rows[0]["NroHistoriaClinica"];
            @ViewBag.FechaNacimiento = DatosEvaluacion.Tables[0].Rows[0]["FechaNacimiento"];
            @ViewBag.HoraNacimiento = DatosEvaluacion.Tables[0].Rows[0]["HoraNacimiento"];
            @ViewBag.Sexo = DatosEvaluacion.Tables[0].Rows[0]["Sexo"];
            @ViewBag.Servicio = DatosEvaluacion.Tables[0].Rows[0]["Servicio"];
            @ViewBag.Cama = DatosEvaluacion.Tables[0].Rows[0]["Cama"];

            @ViewBag.TipoPaciente = DatosEvaluacion.Tables[0].Rows[0]["TipoPaciente"];

            @ViewBag.TiempoEnfermedad = DatosEvaluacion.Tables[0].Rows[0]["TiempoEnfermedad"];
            @ViewBag.Inicio = DatosEvaluacion.Tables[0].Rows[0]["Inicio"];
            @ViewBag.Curso = DatosEvaluacion.Tables[0].Rows[0]["Curso"];
            
            @ViewBag.Dolor = DatosEvaluacion.Tables[0].Rows[0]["Dolor"];
            @ViewBag.Convulsiones = DatosEvaluacion.Tables[0].Rows[0]["Convulsiones"];
            @ViewBag.Fiebre = DatosEvaluacion.Tables[0].Rows[0]["Fiebre"];
            @ViewBag.Vomitos = DatosEvaluacion.Tables[0].Rows[0]["Vomitos"];
            @ViewBag.Diarrea = DatosEvaluacion.Tables[0].Rows[0]["Diarrea"];
            @ViewBag.Hemorragia = DatosEvaluacion.Tables[0].Rows[0]["Hemorragia"];

            @ViewBag.DificultadRespiratoria = DatosEvaluacion.Tables[0].Rows[0]["DificultadRespiratoria"];            
            @ViewBag.DistensionAbdominal = DatosEvaluacion.Tables[0].Rows[0]["DistensionAbdominal"];
            @ViewBag.Cianosis = DatosEvaluacion.Tables[0].Rows[0]["Cianosis"];
            @ViewBag.MalOlorOmbligo = DatosEvaluacion.Tables[0].Rows[0]["MalOlorOmbligo"];
            @ViewBag.Ictericia = DatosEvaluacion.Tables[0].Rows[0]["Ictericia"];
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

            @ViewBag.Apetito = DatosEvaluacion.Tables[0].Rows[0]["Apetito"];
            @ViewBag.Sed = DatosEvaluacion.Tables[0].Rows[0]["Sed"];
            @ViewBag.Orina = DatosEvaluacion.Tables[0].Rows[0]["Orina"];
            @ViewBag.Deposiciones = DatosEvaluacion.Tables[0].Rows[0]["Deposiciones"];
            @ViewBag.Suenio = DatosEvaluacion.Tables[0].Rows[0]["Suenio"];

            @ViewBag.Antecedentes = DatosEvaluacion.Tables[0].Rows[0]["Antecedentes"];
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
            @ViewBag.Pulso = DatosEvaluacion.Tables[0].Rows[0]["Pulso"];
            @ViewBag.PerimAbdominal = DatosEvaluacion.Tables[0].Rows[0]["PerimAbdominal"];
            @ViewBag.PerimCefalico = DatosEvaluacion.Tables[0].Rows[0]["PerimCefalico"];
            @ViewBag.Dolor = DatosEvaluacion.Tables[0].Rows[0]["Dolor"];
            @ViewBag.LlenadoCapilar = DatosEvaluacion.Tables[0].Rows[0]["LlenadoCapilar"];
            @ViewBag.TriajeGlasgow = DatosEvaluacion.Tables[0].Rows[0]["TriajeGlasgow"];
            @ViewBag.BiermanPierson = DatosEvaluacion.Tables[0].Rows[0]["BiermanPierson"];           
            @ViewBag.ObservacionTriaje = DatosEvaluacion.Tables[0].Rows[0]["ObservacionTriaje"];
            @ViewBag.Glasgow = DatosEvaluacion.Tables[0].Rows[0]["Glasgow"];

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
                return PartialView("~/Views/Emergencia/Plantillas/InformeEvaluacionEspecialidades.cshtml");
            }
            else
            {
                return PartialView("~/Views/Emergencia/Plantillas/InformeReEvaluacionEspecialidades.cshtml");
            }

        }

    }
}
