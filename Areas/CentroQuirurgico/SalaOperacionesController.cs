using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using WebAppMaternidad.CapaEntidades;
using WebAppMaternidad.CapaDatos;
using System.Data;
using CapaDatos;
using Microsoft.AspNetCore.Http;
using CapaEntidades;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text;
using WebAppMaternidad.Areas.Comun;
using System.Runtime.Intrinsics.X86;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.CentroQuirurgico
{
    public class SalaOperacionesController: BaseController
    {
        [HttpPost]
        public async Task<ActionResult> CrearModificarSalaOperacionesCQx(SolicitudSalaOperacionesCQx solicitudSalaOperacionesCQx, int IdFormaPago, int IdFuenteFinanciamiento, string DireccionDomicilio, string IdSiaSis, string SisCodigo, int IdTipoServicio, String lstDiagnosticosPre)
        {
            DataSet dataSet = new DataSet();
            DataSet dataSetAtencion = new DataSet();


            DalCentroQuirurgico dalCentroQuirurgico = new DalCentroQuirurgico();
            DalAtenciones dalAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                string NroSolicitud = "";

                if (solicitudSalaOperacionesCQx.IdSolicitudSOP == 0)
                {
                    NroSolicitud = await dalCentroQuirurgico.ObtenerNroSolicituSalaOperaciones();

                    if (NroSolicitud != "")
                    {
                        solicitudSalaOperacionesCQx.NroSolicitud = NroSolicitud;
                    }
                }

                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                int idOrigenAtencion = solicitudSalaOperacionesCQx.IdServicioOrigen == 30 ? 1 : solicitudSalaOperacionesCQx.IdServicioOrigen == 2 ? 31 : solicitudSalaOperacionesCQx.IdServicioOrigen == 4 ? 32 : 54;


                //Esto debe pasar al momento de crear el reporte operatorio
                if (IdTipoServicio == 1)
                {
                    solicitudSalaOperacionesCQx.IdCuentaAtencion = 0;
                    dataSetAtencion = await dalAtenciones.CrearModificaCuentas(solicitudSalaOperacionesCQx.IdCuentaAtencion, solicitudSalaOperacionesCQx.IdPaciente, idUsuario, solicitudSalaOperacionesCQx.Edad, solicitudSalaOperacionesCQx.FechaSolicitud, solicitudSalaOperacionesCQx.HoraSolicitudCQx,
                    88, solicitudSalaOperacionesCQx.IdMedicoSolicita, 24, idOrigenAtencion, solicitudSalaOperacionesCQx.IdCama, solicitudSalaOperacionesCQx.IdTipoEdad, 3, IdFormaPago, IdFuenteFinanciamiento, solicitudSalaOperacionesCQx.HoraSolicitudCQxAceptada,
                    DireccionDomicilio, null, IdSiaSis, null, SisCodigo);

                    solicitudSalaOperacionesCQx.IdCuentaAtencion = Int32.Parse(dataSetAtencion.Tables[0].Rows[0]["IdCuentaAtencion"].ToString());
                }


                if (solicitudSalaOperacionesCQx.IdCuentaAtencion == 0)
                {
                    solicitudSalaOperacionesCQx.IdCuentaAtencion = Int32.Parse(dataSetAtencion.Tables[0].Rows[0]["IdCuentaAtencion"].ToString());
                }

                var lstobjDiagnosticosPre = JsonConvert.DeserializeObject<List<Diagnosticos>>(lstDiagnosticosPre);


                dataSet = await dalCentroQuirurgico.CrearModificarSalaOperacionesCQx(solicitudSalaOperacionesCQx, lstobjDiagnosticosPre);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> CrearModificarProgramacionSalaOperacionesCQx(ProgramacionSalaOperacionesCQx programacionSalaOperacionesCQx,
            int? IdMedicoPrincipal, int? IdCirujanoII, int? IdMedicoAyudanteI, int? IdMedicoAyudanteII, int? IdAnestesiologo, int? IdAyudanteAnestesiologo,
            int? IdInstrumentistaI, int? IdInstrumentistaII, int? IdTecnicoEnfermeria, DateTime? FechaAceptada, string HoraAceptada)
        {
            DataSet dataSet = new DataSet();

            DalCentroQuirurgico dalCentroQuirurgico = new DalCentroQuirurgico();
            DalAtenciones dalAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                //var lstobjDiagnosticos = JsonConvert.DeserializeObject<List<Diagnosticos>>(lstDiagnosticos);

                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                dataSet = await dalCentroQuirurgico.CrearModificarProgramacionSalaOperacionesCQx(programacionSalaOperacionesCQx, idUsuario);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> CrearModificarReporteOperatorioCQx(ReporteOperatorioCQx reporteOperatorioCQx, String lstDiagnosticosPre, String lstDiagnosticosPost)
        {
            DataSet dataSet = new DataSet();

            DalCentroQuirurgico dalCentroQuirurgico = new DalCentroQuirurgico();
            DalAtenciones dalAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                var lstobjDiagnosticosPre = JsonConvert.DeserializeObject<List<Diagnosticos>>(lstDiagnosticosPre);
                var lstobjDiagnosticosPost = JsonConvert.DeserializeObject<List<Diagnosticos>>(lstDiagnosticosPost);

                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                dataSet = await dalCentroQuirurgico.CrearModificarReporteOperatorioCQx(reporteOperatorioCQx, lstobjDiagnosticosPre, lstobjDiagnosticosPost, (int)Enumerados.TiposDiagnostico.EmergenciaIngreso, idUsuario);

                int IdCuentaAtencion = reporteOperatorioCQx.IdCuentaAtencion ?? 0;
                int IdReporteOperatorio = Int32.Parse(dataSet.Tables[0].Rows[0]["IdReporteOperatorio"].ToString());

                await GenerarReporteOperatorio(IdCuentaAtencion, IdReporteOperatorio);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ListarSolicitudesSalaOperaciones(string NroHistoria, string NroSolicitud, int? IdCuentaAtencion, string NroDocumento, string ApellidoPaterno, string ApellidoMaterno, DateTime? FechaSolicitud)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalCentroQuirurgico dalCentroQuirurgico = new DalCentroQuirurgico();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalCentroQuirurgico.ListarSolicitudesSalaOperaciones(NroHistoria, NroSolicitud, IdCuentaAtencion, NroDocumento, ApellidoPaterno, ApellidoMaterno, FechaSolicitud);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpGet]
        public async Task<ActionResult> SeleccionarSolicitudesSalaOperacionCQxByNroSolicitud(string NroSolicitud)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalCentroQuirurgico dalCentroQuirurgico = new DalCentroQuirurgico();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalCentroQuirurgico.SeleccionarSolicitudesSalaOperacionCQxByNroSolicitud(NroSolicitud);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> ListarProgramacionSalaOperaciones(string NroHistoria, int? IdCuentaAtencion, string NroDocumento, string ApellidoPaterno, string ApellidoMaterno, DateTime? FechaSolicitud)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalCentroQuirurgico dalCentroQuirurgico = new DalCentroQuirurgico();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalCentroQuirurgico.ListarProgramacionSalaOperaciones(NroHistoria, IdCuentaAtencion, NroDocumento, ApellidoPaterno, ApellidoMaterno, FechaSolicitud);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpGet]
        public async Task<ActionResult> SeleccionarReporteOperatorioSalaOperacionCQxByNroCuenta(string NroCuenta)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalCentroQuirurgico dalCentroQuirurgico = new DalCentroQuirurgico();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalCentroQuirurgico.SeleccionarReporteOperatorioSalaOperacionCQxByNroCuenta(NroCuenta);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> ListarReporteOperatorioCQx(string NroHistoria, int? IdCuentaAtencion, string NroDocumento, string ApellidoPaterno, string ApellidoMaterno, DateTime? FechaSolicitud)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalCentroQuirurgico dalCentroQuirurgico = new DalCentroQuirurgico();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalCentroQuirurgico.ListarReporteOperatorioCQx(NroHistoria, IdCuentaAtencion, NroDocumento, ApellidoPaterno, ApellidoMaterno, FechaSolicitud);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        public async Task<ActionResult> ListarProcedimientosCQx(int NroSolicitud)
        {
            DataSet listaRecetasDetalle;
            DalCentroQuirurgico dalCentroQuirurgico = new DalCentroQuirurgico();

            listaRecetasDetalle = null;

            listaRecetasDetalle = await dalCentroQuirurgico.ListarProcedimientosCQx(NroSolicitud); // JDELGADO J0 AWAIT SENTENCES

            return Json(listaRecetasDetalle);
        }

        [HttpPost]
        public async Task<ActionResult> ListarM_ClaseIntervencionCQx()
        {
            DataSet dataSet = null;
            //int nRpta;
            DalCentroQuirurgico dalCentroQuirurgico = new DalCentroQuirurgico();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalCentroQuirurgico.ListarM_ClaseIntervencionCQx();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> ListarM_ClasificacionPacienteCQx()
        {
            DataSet dataSet = null;
            //int nRpta;
            DalCentroQuirurgico dalCentroQuirurgico = new DalCentroQuirurgico();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalCentroQuirurgico.ListarM_ClasificacionPacienteCQx();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }




        [HttpPost]
        public async Task<ActionResult> ListarM_TipoCirugiaCQx()
        {
            DataSet dataSet = null;
            //int nRpta;
            DalCentroQuirurgico dalCentroQuirurgico = new DalCentroQuirurgico();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalCentroQuirurgico.ListarM_TipoCirugiaCQx();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }
        [HttpPost]
        public async Task<ActionResult> ListarM_TurnosCirugiaCQx(int IdTipoTurno)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalCentroQuirurgico dalCentroQuirurgico = new DalCentroQuirurgico();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalCentroQuirurgico.ListarM_TurnosCirugiaCQx(IdTipoTurno);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> ListarM_OrdenCQx()
        {
            DataSet dataSet = null;
            //int nRpta;
            DalCentroQuirurgico dalCentroQuirurgico = new DalCentroQuirurgico();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalCentroQuirurgico.ListarM_OrdenCQx();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> ListarM_SalaCQx()
        {
            DataSet dataSet = null;
            //int nRpta;
            DalCentroQuirurgico dalCentroQuirurgico = new DalCentroQuirurgico();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalCentroQuirurgico.ListarM_SalaCQx();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> ListarM_QuirofanoCQx(int IdSala)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalCentroQuirurgico dalCentroQuirurgico = new DalCentroQuirurgico();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalCentroQuirurgico.ListarM_QuirofanoCQx(IdSala);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }



        [HttpPost]
        public async Task<ActionResult> ListarM_AnestesiaCQx()
        {
            DataSet dataSet = null;
            //int nRpta;
            DalCentroQuirurgico dalCentroQuirurgico = new DalCentroQuirurgico();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalCentroQuirurgico.ListarM_AnestesiaCQx();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> ListarEstadosSolicitudCQx()
        {
            DataSet dataSet = null;
            //int nRpta;
            DalCentroQuirurgico dalCentroQuirurgico = new DalCentroQuirurgico();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalCentroQuirurgico.ListarEstadosSolicitudCQx();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> ListarM_TipoAnestesiaCQx(int IdAnestesiaCqx)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalCentroQuirurgico dalCentroQuirurgico = new DalCentroQuirurgico();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalCentroQuirurgico.ListarM_TipoAnestesiaCQx(IdAnestesiaCqx);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<Boolean> GenerarReporteOperatorio(int idCuenta, int IdReporteOperatorio)
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
                string usuario = HttpContext.Session.GetString("usuario");

                stringHtml = null;
                pageHtml = null;
                pageHtml = Url.Action("InformeReporteOperatorio", "SalaOperaciones", new { area = "CentroQuirurgico", IdReporteOperatorio }, "http");

                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;
                pdf.cookies = HttpContext.Request.Headers["Cookie"].ToString();
                resp = await utilitario.GenerarDocumentoDigital(idCuenta, IdReporteOperatorio, 0, "I-CQX", 0, pageHtml, stringHtml, idUsuario, pdf);

                return resp;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                return false;
            }
        }


        public async Task<ActionResult> InformeReporteOperatorio(int IdReporteOperatorio)
        {
            ////QRCodeGenerator qrGenerator = new QRCodeGenerator();

            //DataSet DatosInforme, DiagnosticosPrim, DiagnosticosUlt;
            //////DateTime today = DateTime.Today;
            ////int idUsuario = 0;

            DalCentroQuirurgico dalCentroQuirurgico = new DalCentroQuirurgico();
            DalDiagnostico daoDiagnostico = new DalDiagnostico();
            DalConsumoServicio dalconsumo = new DalConsumoServicio();
           





            DataSet DatosInforme = await dalCentroQuirurgico.SeleccionarReporteOperatorioByIdReporteOperatorio(IdReporteOperatorio);

            int IdAtencion = Int32.Parse(DatosInforme.Tables[0].Rows[0]["IdAtencion"].ToString());

            DataSet Diagnosticos = await daoDiagnostico.DiagnosticosSeleccionarPorAtencion(IdAtencion, 8);
            DataTable dtDx = Diagnosticos.Tables[0];

            int IdCuentaAtencion = Int32.Parse(DatosInforme.Tables[0].Rows[0]["IdCuentaAtencion"].ToString());

            DataSet Cpt = await dalconsumo.BuscaAtencionesCptCEparaFormatoHIS(IdCuentaAtencion);
            DataTable dtCpt = Cpt.Tables[0];

            int NroSolicitud = Int32.Parse(DatosInforme.Tables[0].Rows[0]["NroSolicitud"].ToString());

            DataSet CptPre = await dalCentroQuirurgico.ListarProcedimientosCQx(NroSolicitud); // JDELGADO J0 AWAIT SENTENCES
            DataTable dtCptPre = CptPre.Tables[0];

            @ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss");


            // = await daoAtenciones.AtencionesDiagnosticosSeleccionarPorAtencionPorNumeroEvaluacion(IdAtencion, (int)Enumerados.TiposDiagnostico.HospitalizacionEgreso, 0, Int32.Parse(DatosInforme.Tables[0].Rows[0]["NroEvaluacionPrim"].ToString()));
            //DataTable dtDxPrim = DiagnosticosPrim.Tables[0];

            //DiagnosticosUlt = await daoAtenciones.AtencionesDiagnosticosSeleccionarPorAtencionPorNumeroEvaluacion(IdAtencion, (int)Enumerados.TiposDiagnostico.HospitalizacionEgreso, 0, Int32.Parse(DatosInforme.Tables[0].Rows[0]["NroEvaluacionUlt"].ToString()));
            //DataTable dtDxUlt = DiagnosticosUlt.Tables[0];

            @ViewBag.FechaCirugia = DatosInforme.Tables[0].Rows[0]["FechaCirugia"];
            @ViewBag.HoraCirugia = DatosInforme.Tables[0].Rows[0]["HoraCirugia"];
            @ViewBag.HoraFinalCirugia = DatosInforme.Tables[0].Rows[0]["HoraFinalCirugia"];
            @ViewBag.TipoIntervencion = DatosInforme.Tables[0].Rows[0]["TipoIntervencion"];
            @ViewBag.TipoCirugia = DatosInforme.Tables[0].Rows[0]["TipoCirugia"];
            @ViewBag.Sala = DatosInforme.Tables[0].Rows[0]["Sala"];
            @ViewBag.Quirofano = DatosInforme.Tables[0].Rows[0]["Quirofano"];
            @ViewBag.CirujanoI = DatosInforme.Tables[0].Rows[0]["CirujanoI"];
            @ViewBag.CirujanoII = DatosInforme.Tables[0].Rows[0]["CirujanoII"];
            @ViewBag.AyudanteI = DatosInforme.Tables[0].Rows[0]["AyudanteI"];
            @ViewBag.AyudanteII = DatosInforme.Tables[0].Rows[0]["AyudanteII"];
            @ViewBag.AnestesiologoI = DatosInforme.Tables[0].Rows[0]["AnestesiologoI"];
            @ViewBag.AnestesiologoII = DatosInforme.Tables[0].Rows[0]["AnestesiologoII"];
            @ViewBag.InstrumentistaI = DatosInforme.Tables[0].Rows[0]["InstrumentistaI"];
            @ViewBag.InstrumentistaII = DatosInforme.Tables[0].Rows[0]["InstrumentistaII"];
            @ViewBag.IdGasa = DatosInforme.Tables[0].Rows[0]["IdGasa"];
            @ViewBag.CantidadGasa = DatosInforme.Tables[0].Rows[0]["CantidadGasa"];
            @ViewBag.IdDepressing = DatosInforme.Tables[0].Rows[0]["IdDepressing"];
            @ViewBag.CantidadDepressing = DatosInforme.Tables[0].Rows[0]["CantidadDepressing"];
            @ViewBag.AnestesiaI = DatosInforme.Tables[0].Rows[0]["AnestesiaI"];
            @ViewBag.TipoAnestesiaCQxI = DatosInforme.Tables[0].Rows[0]["TipoAnestesiaCQxI"];
            @ViewBag.ProcedimientoCqx = DatosInforme.Tables[0].Rows[0]["ProcedimientoCqx"];
            @ViewBag.Hallazgos = DatosInforme.Tables[0].Rows[0]["Hallazgos"];
            @ViewBag.PinzamientoCorteCordonUmbilical = DatosInforme.Tables[0].Rows[0]["PinzamientoCorteCordonUmbilical"];
            @ViewBag.IncidentesAccidentes = DatosInforme.Tables[0].Rows[0]["IncidentesAccidentes"];
            @ViewBag.AnatomiaPatologica = DatosInforme.Tables[0].Rows[0]["AnatomiaPatologica"];
            @ViewBag.EventoAdversoTransanestesico = DatosInforme.Tables[0].Rows[0]["EventoAdversoTransanestesico"];

            @ViewBag.Dx = dtDx;
            @ViewBag.Cpt = dtCpt;
            @ViewBag.CptPre = dtCptPre;


            return PartialView("~/Views/CentroQuirurgico/Plantillas/FormatoReporteOperatorio.cshtml");

        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarReporteOperatorioByIdReporteOperatorio(int IdReporteOperatorio)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalCentroQuirurgico dalCentroQuirurgico = new DalCentroQuirurgico();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalCentroQuirurgico.SeleccionarReporteOperatorioByIdReporteOperatorio(IdReporteOperatorio);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarSolicitudesParaReporteOperatorio(string NroHistoria, string NroSolicitud, int? IdCuentaAtencion, string NroDocumento, string ApellidoPaterno, string ApellidoMaterno, DateTime? FechaSolicitud)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalCentroQuirurgico dalCentroQuirurgico = new DalCentroQuirurgico();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalCentroQuirurgico.SeleccionarSolicitudesParaReporteOperatorio(NroHistoria, NroSolicitud, IdCuentaAtencion, NroDocumento, ApellidoPaterno, ApellidoMaterno, FechaSolicitud);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpGet]
        public async Task<ActionResult> SeleccionarSolicitudesSalaOperacionCQxByNroCuentaHospitalizacion(int IdCuentaAtencion, string NroSolicitud)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalCentroQuirurgico dalCentroQuirurgico = new DalCentroQuirurgico();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalCentroQuirurgico.SeleccionarSolicitudesSalaOperacionCQxByNroCuentaHospitalizacion(IdCuentaAtencion, NroSolicitud);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }


        [HttpPost]
        public async Task<ActionResult> ProgramacionMedicaSopModificar(ProgramacionMedica prog)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet ds;

            DalCentroQuirurgico dal = new DalCentroQuirurgico();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            ds = await dal.ProgramacionMedicaSopModificar(prog, idUsuario);

            return Json(new { lsResultado = ds, session = true });

        }

        [HttpPost]
        public async Task<ActionResult> ListarProgramacionMedicaSopMensual(int idTipoServicio, int idDepartamento, int idEspecialidad, int idServicio, int idMedico, int activaProcedimiento, int anio, int mes)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet ds;

            DalCentroQuirurgico dal = new DalCentroQuirurgico();

            ds = await dal.ListarProgramacionMedicaSopMensual(idTipoServicio, idDepartamento, idEspecialidad, idServicio, idMedico, activaProcedimiento, anio, mes);

            return Json(new { lsResultado = ds, session = true });

        }

        [HttpPost]
        public async Task<ActionResult> ListarProgramacionMedicaSopPorRango(int idTipoServicio, int idDepartamento, int idEspecialidad, int idServicio, int idMedico, int activaProcedimiento, string fechaInicio, string fechaFin)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet ds;

            DalCentroQuirurgico dal = new DalCentroQuirurgico();

            ds = await dal.ListarProgramacionMedicaSopPorRango(idTipoServicio, idDepartamento, idEspecialidad, idServicio, idMedico, activaProcedimiento, fechaInicio, fechaFin);

            return Json(new { lsResultado = ds, session = true });

        }


        [HttpPost]
        public async Task<ActionResult> ProgramacionMedicaSopSeleccionar(int idProgramacion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet ds;

            DalCentroQuirurgico dal = new DalCentroQuirurgico();

            ds = await dal.ProgramacionMedicaSopSeleccionar(idProgramacion);

            return Json(new { lsResultado = ds, session = true });

        }

        [HttpPost]
        public async Task<ActionResult> ProgramacionMedicaSopEliminar(int idProgramacion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet ds;

            DalCentroQuirurgico dal = new DalCentroQuirurgico();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            ds = await dal.ProgramacionMedicaSopEliminar(idProgramacion, idUsuario);

            return Json(new { lsResultado = ds, session = true });

        }

    }

}
