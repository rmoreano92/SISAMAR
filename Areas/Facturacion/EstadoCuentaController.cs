using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System;
using System.Data;
using System.Threading.Tasks;
using WebAppMaternidad.CapaDatos;
using Microsoft.AspNetCore.Http;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using WebAppMaternidad.Controllers;
using WebAppMaternidad.CapaEntidades;
using ClosedXML.Excel;
// using SelectPdf;
// using SelectPdf;
using System.IO;
using System.Net.Mime;
using System.Text;
using Microsoft.AspNetCore.Hosting;
using iText.Kernel.Pdf;
using iText.Html2pdf;
using iText.Kernel.Geom;
using System.Net.Http;
using WebAppMaternidad.Context.Reportes.Application;
using WebAppMaternidad.Context.Reportes.Domain;
using iText.Kernel.Utils;

namespace WebAppMaternidad.Areas.Facturacion
{
    public class EstadoCuentaController : BaseController
    {

        private IWebHostEnvironment _hostingEnvironment;
        private readonly DalFacturacion _dalFacturacion;
        private readonly EstadoCuentaReporteService _estadoCuentaReporteService;

        public EstadoCuentaController(IWebHostEnvironment env, DalFacturacion dalFacturacion, EstadoCuentaReporteService estadoCuentaReporteService)
        {
            _hostingEnvironment = env;
            _dalFacturacion = dalFacturacion;
            _estadoCuentaReporteService = estadoCuentaReporteService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> AreaTramitaSegurosDevuelveTodosSegunFiltro(string filtro)
        {
            DataSet lstData;
            DalFacturacion dalFacturacion = new DalFacturacion();

            lstData = await dalFacturacion.AreaTramitaSegurosDevuelveTodosSegunFiltro(filtro);

            return Json(new { lstData = lstData, sesion = true });
        }

        [HttpPost]
        public async Task<ActionResult> RetornaConsumoPacienteServiciosConSeguroPorNroCuenta(int? idCuentaAtencion, bool lbAunNoTieneReembolso)
        {
            DataSet dataSet = null;
            DataSet dsFiltrado = new DataSet();
            //int nRpta;
            DalFacturacion dalFacturacion = new DalFacturacion();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            DataTable filasFiltradas = new DataTable();
            try
            {
                dataSet = await dalFacturacion.ServicioFinanciamientosPorNroCuenta(idCuentaAtencion);
                if (dataSet != null && dataSet.Tables.Count > 0)
                {
                    if (dataSet.Tables[0].Rows.Count > 0)
                    {
                        if (!lbAunNoTieneReembolso)
                        {

                            DataTable dt = dataSet.Tables[0]; // Suponiendo que la primera tabla tiene los datos

                            filasFiltradas = dt.AsEnumerable()
                                                   .Where(row => row.Field<int>("idEstadoFacturacionFinanciamiento") != 9 && row.Field<int>("idEstadoFacturacionFinanciamiento") != 12 && row.Field<int>("idEstadoFacturacionFinanciamiento") != 4)
                                                   .CopyToDataTable(); // Convierte la colección filtrada en un DataTable

                        }
                        else
                        {
                            DataTable dt = dataSet.Tables[0]; // Suponiendo que la primera tabla tiene los datos

                            filasFiltradas = dt.AsEnumerable()
                                                   .Where(row => row.Field<int>("idEstadoFacturacionFinanciamiento") != 9)
                                                   .CopyToDataTable(); // Convierte la colección filtrada en un DataTable
                        }
                    }
                }
                dsFiltrado.Tables.Add(filasFiltradas);

                return Json(new { session = true, estado = true, msg = "", data = dsFiltrado });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> FarmaciaFinanciamientosPorNroCuenta(int? idCuentaAtencion)
        {
            DataSet dataSet = null;
            DataSet dsFiltrado = new DataSet();
            //int nRpta;
            DalFacturacion dalFacturacion = new DalFacturacion();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            DataTable filasFiltradas = new DataTable();
            try
            {
                dataSet = await dalFacturacion.FarmaciaFinanciamientosPorNroCuenta(idCuentaAtencion);
                if (dataSet != null && dataSet.Tables.Count > 0)
                {
                    if (dataSet.Tables[0].Rows.Count > 0)
                    {
                        DataTable dt = dataSet.Tables[0]; // Suponiendo que la primera tabla tiene los datos

                        filasFiltradas = dt.AsEnumerable()
                                               .Where(row => row.Field<int>("idEstadoMovimiento") == 1)
                                               .CopyToDataTable(); // Convierte la colección filtrada en un DataTable
                    }

                }
                dsFiltrado.Tables.Add(filasFiltradas);

                return Json(new { session = true, estado = true, msg = "", data = dsFiltrado });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> CajaComprobantesPagoSeleccionarPagosACuentaPorIdCuenta(int? idCuentaAtencion, int idParametro)
        {
            DataSet dataSet = null, dsParametros = null;
            DataSet dsFiltrado = new DataSet();
            //int nRpta;
            DalFacturacion dalFacturacion = new DalFacturacion();
            DalParametros dalParametros = new DalParametros();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            DataTable filasFiltradas = new DataTable();
            try
            {
                dsParametros = await dalParametros.SeleccionaFilaParametro2(idParametro);
                dataSet = await dalFacturacion.CajaComprobantesPagoSeleccionarPagosACuentaPorIdCuenta(idCuentaAtencion, Int32.Parse(dsParametros.Tables[0].Rows[0]["ValorTexto"].ToString()));

                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> FacturacionCuentasAtencionPendientePagoSeguro(int? IdCuentaAtencion, string HoraCierre, string DeudaPendiente)
        {
            DataSet dsFiltrado = new DataSet();
            int res = 0;
            //int nRpta;
            DalFacturacion dalFacturacion = new DalFacturacion();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            DataTable filasFiltradas = new DataTable();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                res = await dalFacturacion.FacturacionCuentasAtencionPendientePagoSeguro(IdCuentaAtencion, idUsuario, HoraCierre, DeudaPendiente);

                return Json(new { session = true, estado = true, msg = "", data = res });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = res });
            }

        }

        [HttpPost]
        public async Task<ActionResult> FacturacionCuentasAtencionCerradoAutomatico(int? IdCuentaAtencion, string HoraCierre)
        {
            DataSet dsFiltrado = new DataSet();
            int res = 0;
            //int nRpta;
            DalFacturacion dalFacturacion = new DalFacturacion();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            DataTable filasFiltradas = new DataTable();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                res = await dalFacturacion.FacturacionCuentasAtencionCerradoAutomatico(IdCuentaAtencion, idUsuario, HoraCierre);

                return Json(new { session = true, estado = true, msg = "", data = res });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = res });
            }

        }

        [HttpPost]
        public async Task<ActionResult> AtencionesSeleccionarPorTipoServicio(int? idTipoServicio, DateTime? FechaIni, DateTime? FechaFin)
        {
            DataSet dataSet = null;
            DataSet dsFiltrado = new DataSet();

            //int nRpta;
            DalFacturacion dalFacturacion = new DalFacturacion();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            DataTable filasFiltradas = new DataTable();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                dataSet = await dalFacturacion.AtencionesSeleccionarPorTipoServicio(idTipoServicio, FechaIni, FechaFin);

                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> FactOrdenServicioPreventasServicio(DateTime? FechaInicio, DateTime? FechaFin)
        {
            DataSet dataSet = null;
            DataSet dsFiltrado = new DataSet();
            //int nRpta;
            DalFacturacion dalFacturacion = new DalFacturacion();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            DataTable filasFiltradas = new DataTable();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                dataSet = await dalFacturacion.FactOrdenServicioPreventasServicio(FechaInicio, FechaFin);

                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> farmMovimientoVentasExoneracionesEnFarmacia(DateTime? FechaInicio, DateTime? FechaFin)
        {
            DataSet dataSet = null;
            DataSet dsFiltrado = new DataSet();

            //int nRpta;
            DalFacturacion dalFacturacion = new DalFacturacion();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            DataTable filasFiltradas = new DataTable();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                dataSet = await dalFacturacion.farmMovimientoVentasExoneracionesEnFarmacia(FechaInicio, FechaFin);

                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> AtencionesSeleccionarPacExtPorFechas(DateTime? ldFechaIni, DateTime? ldFechaFin)
        {
            DataSet dataSet = null;
            DataSet dsFiltrado = new DataSet();
            //int nRpta;
            DalFacturacion dalFacturacion = new DalFacturacion();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            DataTable filasFiltradas = new DataTable();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                dataSet = await dalFacturacion.AtencionesSeleccionarPacExtPorFechas(ldFechaIni, ldFechaFin);

                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> AtencionesFiltraDatosCabecera(int IdCuentaAtencion)
        {
            DataSet dataSet = null;
            DataSet dsFiltrado = new DataSet();
            
            //int nRpta;
            DalFacturacion dalFacturacion = new DalFacturacion();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            DataTable filasFiltradas = new DataTable();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                dataSet = await dalFacturacion.AtencionesFiltraDatosCabecera(IdCuentaAtencion);

                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<IActionResult> FacturacionServicioDespachoXcuenta(int idCuentaAtencion)
        {
            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {
                var idUsuario = IdUsuarioSesion();

                var dataSet = await _dalFacturacion.FacturacionServicioDespachoXcuenta(idCuentaAtencion, 0);

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }
        }


        [HttpPost]
        public async Task<ActionResult> FarmMovimientoVentasDetalleXcuenta(int idCuentaAtencion)
        {
            DataSet dataSet = null;
            DataSet dsFiltrado = new DataSet();
            
            //int nRpta;
            DalFacturacion dalFacturacion = new DalFacturacion();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            DataTable filasFiltradas = new DataTable();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                dataSet = await dalFacturacion.FarmMovimientoVentasDetalleXcuenta(idCuentaAtencion, 0);

                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> TiposFinanciamientoDevuelveComoSeTrabajaEnEstadoCuenta(int IdtipoFinanciamiento)
        {
            DataSet dataSet = null;
            DataSet dsFiltrado = new DataSet();
            
            //int nRpta;
            DalFacturacion dalFacturacion = new DalFacturacion();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            DataTable filasFiltradas = new DataTable();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                dataSet = await dalFacturacion.TiposFinanciamientoDevuelveComoSeTrabajaEnEstadoCuenta(IdtipoFinanciamiento);

                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ListarConsolidadoPorEstadoCuenta(int idCuentaAtencion)
        {
            DataSet dataSet = null;
            DataSet dsFiltrado = new DataSet();

            //int nRpta;
            DalFacturacion dalFacturacion = new DalFacturacion();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            DataTable filasFiltradas = new DataTable();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                dataSet = await dalFacturacion.ListarConsolidadoPorEstadoCuenta(idCuentaAtencion);

                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> AtencionesListaCuentasXpaciente(int IdPaciente)
        {
            DataSet dataSet = null;
            DataSet dsFiltrado = new DataSet();
            //int nRpta;
            DalFacturacion dalFacturacion = new DalFacturacion();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            DataTable filasFiltradas = new DataTable();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                dataSet = await dalFacturacion.AtencionesListaCuentasXpaciente(IdPaciente);

                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ValidarInicioSesion(string usuario, string contrasenia)
        {

            var userToken = new Tuple<String, Empleado>(null, null);

            TokenProvider _tokenProvider = new TokenProvider();
            userToken = await _tokenProvider.LoginUser(usuario, contrasenia);
            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                return Json(new { session = true, estado = true, msg = "", data = userToken });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = userToken });
            }
        }

        [HttpPost]
        public async Task<IActionResult> ValidarPermisoAbrirCuentas()
        {
            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {
                var idUsuario = IdUsuarioSesion();

                var dataSet = await _dalFacturacion.ValidarPermisoAbrirCuentas(idUsuario);

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }
        }


        [HttpPost]
        public async Task<IActionResult> FacturacionCuentasAtencionPagada(int IdCuentaAtencion, int IdPaciente, int IdListItem)
        {

            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {
                var dal = new DalFacturacion();
                var idUsuario = IdUsuarioSesion();

                var dataSet = await dal.FacturacionCuentasAtencionPagada(IdCuentaAtencion, IdPaciente, idUsuario, IdListItem);

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }

        }
        [HttpPost]
        public async Task<IActionResult> FacturacionCuentasAtencionPendientePagoSeguroEstadoCuenta(int IdCuentaAtencion, int IdPaciente, int IdListItem)
        {

            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {
                var dal = new DalFacturacion();
                var idUsuario = IdUsuarioSesion();

                var dataSet = await dal.FacturacionCuentasAtencionPendientePagoSeguroEstadoCuenta(IdCuentaAtencion, IdPaciente, idUsuario, IdListItem);

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }

        }

        [HttpPost]
        public async Task<IActionResult> FacturacionCuentasAtencionAbrir(int IdCuentaAtencion, int IdListItem)
        {

            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {
                var dal = new DalFacturacion();
                var idUsuario = IdUsuarioSesion();

                var dataSet = await dal.FacturacionCuentasAtencionAbrir(IdCuentaAtencion, idUsuario, IdListItem);

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }

        }

        [HttpPost]
        public async Task<IActionResult> FacturacionCuentasAtencionCerrar(int IdCuentaAtencion, int IdPaciente, int IdListItem)
        {

            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {
                var dal = new DalFacturacion();
                var idUsuario = IdUsuarioSesion();

                var dataSet = await dal.FacturacionCuentasAtencionCerrar(IdCuentaAtencion, IdPaciente, idUsuario, IdListItem);

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }

        }

        [HttpPost]
        public async Task<IActionResult> FacturacionCuentasAtencionAnulada(int IdCuentaAtencion, int IdPaciente, int IdListItem)
        {

            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {
                var dal = new DalFacturacion();
                var idUsuario = IdUsuarioSesion();

                var dataSet = await dal.FacturacionCuentasAtencionAnulada(IdCuentaAtencion, IdPaciente, idUsuario, IdListItem);

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }

        }

        [HttpPost]
        public async Task<IActionResult> FacturacionCuentasAtencionAltaConDeudaYGarante(int IdCuentaAtencion, int IdPaciente, int IdListItem)
        {

            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {
                var dal = new DalFacturacion();
                var idUsuario = IdUsuarioSesion();

                var dataSet = await dal.FacturacionCuentasAtencionAltaConDeudaYGarante(IdCuentaAtencion, IdPaciente, idUsuario, IdListItem);

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }

        }

        [HttpPost]
        public async Task<IActionResult> GenerarExoneracionCuentaPaciente(int IdCuentaAtencion, string lstServicios, string lstFarmacias, int IdListBarItem)
        {

            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {

                var lstObjServicios = JsonConvert.DeserializeObject<List<ServiciosEstadoCuenta>>(lstServicios);
                var lstObjFarmacias = JsonConvert.DeserializeObject<List<FarmaciaEstadoCuenta>>(lstFarmacias);

                var dal = new DalFacturacion();
                var idUsuario = IdUsuarioSesion();


                var dataSet = await dal.GenerarExoneracionCuentaPaciente(IdCuentaAtencion, lstObjServicios, lstObjFarmacias, idUsuario, IdListBarItem);

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CambiarFuenteFinancimiento(int IdFuenteFinanciamiento, int IdTipoFinanciamiento, int IdCuentaAtencion, int IdListBarItem)
        {

            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {
                var dal = new DalFacturacion();
                var idUsuario = IdUsuarioSesion();

                var dataSet = await dal.CambiarFuenteFinancimiento(IdFuenteFinanciamiento, IdTipoFinanciamiento, IdCuentaAtencion, idUsuario, IdListBarItem);

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> PacientesFiltrarTodosSoloHistorias(int nroHistoriaClinica, string apellidoPaterno, string apellidoMaterno, string primerNombre,
            string segundoNombre, int idDocIdentidad, string nroDocumento)
        {

            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {
                var dal = new DalFacturacion();
                var idUsuario = IdUsuarioSesion();

                var dataSet = await dal.PacientesFiltrarTodosSoloHistorias(nroHistoriaClinica, apellidoPaterno, apellidoMaterno, primerNombre, segundoNombre, idDocIdentidad, nroDocumento);

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }
        }

        public async Task<IActionResult> GeneraFormatoReportesEstadoCuenta(int idCuentaAtencion, int modeloReporte)
        {
            try
            {

                DalParametros daoParametros = new DalParametros();
                DalFacturacion dalFacturacion = new DalFacturacion();

                DataSet dsParametros = new DataSet();

                var reportes = new List<BloqueReporte>();

                var pdfsGenerados = new List<byte[]>();

                string usuario = HttpContext.Session.GetString("user");
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));


                dsParametros = await daoParametros.SeleccionaFilaParametro2(205);
                string NombreInstitucion = dsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

                dsParametros.Clear();

                dsParametros = await daoParametros.SeleccionaFilaParametro2(206);
                string DireccionInstitucion = dsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

                dsParametros.Clear();

                dsParametros = await daoParametros.SeleccionaFilaParametro2(207);
                string TelefonoInstitucion = dsParametros.Tables[0].Rows[0]["valorTexto"].ToString();


                DataSet DatosCabecera = await dalFacturacion.AtencionesFiltraDatosCabecera(idCuentaAtencion);

                string IdCuentaAtencion = DatosCabecera.Tables[0].Rows[0]["IdCuentaAtencion"].ToString();
                string NombrePaciente = DatosCabecera.Tables[0].Rows[0]["Paciente"].ToString();
                string NumeroHistoriaClinica = DatosCabecera.Tables[0].Rows[0]["NroHistoriaClinica"].ToString();
                string EstadoCuenta = DatosCabecera.Tables[0].Rows[0]["estadoCta"].ToString();
                string FuenteFinanciamiento = DatosCabecera.Tables[0].Rows[0]["dFuenteFinanciamiento"].ToString();
                string ProductoPlan = DatosCabecera.Tables[0].Rows[0]["dTipoFinanciamiento"].ToString();
                string ServicioEgreso = DatosCabecera.Tables[0].Rows[0]["ServEgreso"].ToString();

                string FechaIngreso = DatosCabecera.Tables[0].Rows[0]["FechaIngreso"].ToString();
                string FechaEgreso = DatosCabecera.Tables[0].Rows[0]["FechaEgreso"].ToString();
                string IdAtencion = DatosCabecera.Tables[0].Rows[0]["IdAtencion"].ToString();
                string Diagnostico = DatosCabecera.Tables[0].Rows[0]["Diagnostico"].ToString();
                string Cama = DatosCabecera.Tables[0].Rows[0]["CamaActual"].ToString();
                string Direccion = DatosCabecera.Tables[0].Rows[0]["DireccionDomicilio"].ToString();
                string Ocupacion = DatosCabecera.Tables[0].Rows[0]["Ocupacion"].ToString();
                string TipoServicio = DatosCabecera.Tables[0].Rows[0]["dTipoServicio"].ToString();
                string Usuario = usuario;

                Institucion institucion = new Institucion(NombreInstitucion, DireccionInstitucion, TelefonoInstitucion);
                CabeceraPrincipal cabeceraPrincipal = new CabeceraPrincipal(
                    IdCuentaAtencion, NombrePaciente, NumeroHistoriaClinica, EstadoCuenta, FuenteFinanciamiento, ProductoPlan, ServicioEgreso,
                    FechaIngreso, FechaEgreso, IdAtencion, Diagnostico, Cama, Direccion, Ocupacion, TipoServicio, Usuario
                    );

                DatosCabeceraReporte cabeceraReporte = new DatosCabeceraReporte(institucion, cabeceraPrincipal);



                string ruta = Url.Action("ReportesEstadoCuenta", "EstadoCuenta", new { idCuentaAtencion, modeloReporte, usuario }, "http");

                using var client = new HttpClient();
                string html = await client.GetStringAsync(ruta);

                reportes.Add(new BloqueReporte(html, TipoReporte.EstadoCuenta, modeloReporte, cabeceraReporte));

                var pdfBytes1 = await _estadoCuentaReporteService.GenerarEstadoCuentaPdfAsync(html, modeloReporte, cabeceraReporte);

                pdfsGenerados.Add(pdfBytes1);

                var IdCuentaAtencion_Origen = DatosCabecera.Tables[0].Rows[0]["IdCuentaAtencion_Origen"].ToString();

                if (IdCuentaAtencion_Origen != "")
                {
                    DataSet DatosCabecera2 = await dalFacturacion.AtencionesFiltraDatosCabecera(Int32.Parse(IdCuentaAtencion_Origen));

                    IdCuentaAtencion = DatosCabecera2.Tables[0].Rows[0]["IdCuentaAtencion"].ToString();
                    NombrePaciente = DatosCabecera2.Tables[0].Rows[0]["Paciente"].ToString();
                    NumeroHistoriaClinica = DatosCabecera2.Tables[0].Rows[0]["NroHistoriaClinica"].ToString();
                    EstadoCuenta = DatosCabecera2.Tables[0].Rows[0]["estadoCta"].ToString();
                    FuenteFinanciamiento = DatosCabecera2.Tables[0].Rows[0]["dFuenteFinanciamiento"].ToString();
                    ProductoPlan = DatosCabecera2.Tables[0].Rows[0]["dTipoFinanciamiento"].ToString();
                    ServicioEgreso = DatosCabecera2.Tables[0].Rows[0]["ServEgreso"].ToString();

                    FechaIngreso = DatosCabecera2.Tables[0].Rows[0]["FechaIngreso"].ToString();
                    FechaEgreso = DatosCabecera2.Tables[0].Rows[0]["FechaEgreso"].ToString();
                    IdAtencion = DatosCabecera2.Tables[0].Rows[0]["IdAtencion"].ToString();
                    Diagnostico = DatosCabecera2.Tables[0].Rows[0]["Diagnostico"].ToString();
                    Cama = DatosCabecera2.Tables[0].Rows[0]["CamaActual"].ToString();
                    Direccion = DatosCabecera2.Tables[0].Rows[0]["DireccionDomicilio"].ToString();
                    Ocupacion = DatosCabecera2.Tables[0].Rows[0]["Ocupacion"].ToString();
                    TipoServicio = DatosCabecera2.Tables[0].Rows[0]["dTipoServicio"].ToString();
                    Usuario = usuario;

                    CabeceraPrincipal cabecera2 = new CabeceraPrincipal(
                    IdCuentaAtencion, NombrePaciente, NumeroHistoriaClinica, EstadoCuenta, FuenteFinanciamiento, ProductoPlan, ServicioEgreso,
                    FechaIngreso, FechaEgreso, IdAtencion, Diagnostico, Cama, Direccion, Ocupacion, TipoServicio, Usuario
                    );

                    DatosCabeceraReporte cabeceraReporte2 = new DatosCabeceraReporte(institucion, cabecera2);

                    ruta = Url.Action("ReportesEstadoCuenta", "EstadoCuenta", new { IdCuentaAtencion, modeloReporte, usuario }, "http");

                    string html2 = await client.GetStringAsync(ruta);

                    // reportes.Add(new BloqueReporte(html2, TipoReporte.EstadoCuenta, modeloReporte, cabeceraReporte2));

                    var pdfBytes2 = await _estadoCuentaReporteService.GenerarEstadoCuentaPdfAsync(html2, modeloReporte, cabeceraReporte2);

                    pdfsGenerados.Add(pdfBytes2);
                }



                var pdfFinal = await UnirPdfsAsync(pdfsGenerados);
                // bool landscape = (modeloReporte == 1 || modeloReporte == 3); // tu lógica
                // var pdfFinal = await _estadoCuentaReporteService.GenerarEstadoCuentaMultiplePdfAsync(reportes, landscape);

                Response.Headers.Add("Content-Disposition", "inline; filename=EstadoCuenta.pdf");
                return File(pdfFinal, "application/pdf");
            }
            catch (Exception e)
            {
                return BadRequest("Error al generar el reporte: " + e.Message);
            }
        }

        // public async Task<IActionResult> GeneraFormatoReportesEstadoCuenta(int idCuentaAtencion, int tipoReporte)
        // {

        //     HtmlToPdf ohtml = new HtmlToPdf();
        //     string usuario;
        //     int idUsuario;

        //     Conexion con = new Conexion();
        //     MemoryStream ms = new MemoryStream();
        //     byte[] pdf;

        //     try
        //     {
        //         usuario = HttpContext.Session.GetString("user");
        //         idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

        //         Comun.ClUtilirario cl = new Comun.ClUtilirario();

        //         PdfPageSize pageSize = (PdfPageSize)Enum.Parse(typeof(PdfPageSize), "A4", true);

        //         if (tipoReporte == 1)
        //         {
        //             PdfPageOrientation pdfOrientationLandscape = (PdfPageOrientation)Enum.Parse(typeof(PdfPageOrientation), "Landscape", true);
        //             ohtml.Options.PdfPageOrientation = pdfOrientationLandscape;

        //             ohtml.Options.WebPageWidth = 1122;
        //             ohtml.Options.WebPageHeight = 780;
        //         }
        //         else if (tipoReporte == 2 || tipoReporte == 3 || tipoReporte == 5 || tipoReporte == 6 || tipoReporte == 7 || tipoReporte == 8)
        //         {

        //             PdfPageOrientation pdfOrientation = (PdfPageOrientation)Enum.Parse(typeof(PdfPageOrientation), "Portrait", true);
        //             ohtml.Options.PdfPageOrientation = pdfOrientation;

        //             ohtml.Options.WebPageWidth = 793;
        //             ohtml.Options.WebPageHeight = 900;
        //         }

        //         ohtml.Options.PdfPageSize = pageSize;
        //         ohtml.Options.MarginLeft = 5;
        //         ohtml.Options.MarginRight = 5;
        //         ohtml.Options.MarginTop = 20;
        //         ohtml.Options.MarginBottom = 60;


        //         string Ruta = Url.Action("ReportesEstadoCuenta", "EstadoCuenta", new { idCuentaAtencion, tipoReporte, usuario }, "http");
        //         PdfDocument obPdfDoc = ohtml.ConvertUrl(Ruta);

        //         pdf = obPdfDoc.Save();


        //         ms = new MemoryStream();
        //         ms.Write(pdf, 0, pdf.Length);
        //         ms.Position = 0;

        //         obPdfDoc.Close();

        //         return new FileStreamResult(ms, MediaTypeNames.Application.Pdf);

        //     }
        //     catch (Exception e)
        //     {
        //         return new FileStreamResult(ms, "Error al generar el reporte." + e);
        //     }

        // }

        public async Task<ActionResult> ReportesEstadoCuenta(int idCuentaAtencion, int modeloReporte, string usuario)
        {
            DalParametros daoParametros = new DalParametros();
            DataSet lsParametros = new DataSet();
            DalFacturacion dalRpt = new DalFacturacion();
            DalUtilitario dalUtili = new DalUtilitario();

            @ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss");
            @ViewBag.Usuario = usuario;

            DataSet DatosCabecera = await dalRpt.AtencionesFiltraDatosCabecera(idCuentaAtencion);
            DataSet DatosRptFarmacia = await dalRpt.FarmMovimientoVentasDetalleXcuenta(idCuentaAtencion, 1);
            DataSet DatosRptServicios = await dalRpt.FacturacionServicioDespachoXcuenta(idCuentaAtencion, 1);

            DataSet DatosRptPtoCargaConsolidado = await dalRpt.ReporteEstadoCuentaPorPuntoCarga(idCuentaAtencion);

            DataSet DatosRptPorServicio = await dalRpt.ReporteEstadoCuentaPorServicio(idCuentaAtencion);

            ////////////ESTANCIA///////////////////////////
            DataSet EstanciaHosp = await dalUtili.EstanciaHospitalariaSeleccionarPorAtencion(Int32.Parse(DatosCabecera.Tables[0].Rows[0]["IdAtencion"].ToString()), 0);

            DataSet DatosCabecera2 = new DataSet();
            DataSet DatosRptPtoCargaConsolidado2 = new DataSet();
            DataRow RegistroRptCabecera2 = null;
            DataTable RegistroRptPtoCargaConsolidado2 = new DataTable();

            DataRow RegistroRptCabecera = DatosCabecera.Tables[0].Rows[0];
            DataTable RegistroRptFarmacia = DatosRptFarmacia.Tables[0];
            DataTable RegistroRptServicios = DatosRptServicios.Tables[0];
            DataTable RegistroRptPtoCargaConsolidado = DatosRptPtoCargaConsolidado.Tables[0];
            DataTable RegistroRptPorServicio = DatosRptPorServicio.Tables[0];
            DataTable dtEstanciaHosp = EstanciaHosp.Tables[0];


            var IdCuentaAtencion_Origen = DatosCabecera.Tables[0].Rows[0]["IdCuentaAtencion_Origen"].ToString();

            if (IdCuentaAtencion_Origen != "")
            {
                DatosCabecera2 = await dalRpt.AtencionesFiltraDatosCabecera(Int32.Parse(DatosCabecera.Tables[0].Rows[0]["IdCuentaAtencion_Origen"].ToString()));
                DatosRptPtoCargaConsolidado2 = await dalRpt.ReporteEstadoCuentaPorPuntoCarga(Int32.Parse(DatosCabecera.Tables[0].Rows[0]["IdCuentaAtencion_Origen"].ToString()));

                RegistroRptCabecera2 = DatosCabecera2.Tables[0].Rows[0];
                RegistroRptPtoCargaConsolidado2 = DatosRptPtoCargaConsolidado2.Tables[0];
            }


            // lsParametros = await daoParametros.SeleccionaFilaParametro2(205);
            // string nombre = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            // lsParametros.Clear();

            // lsParametros = await daoParametros.SeleccionaFilaParametro2(206);
            // string direccion = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            // lsParametros.Clear();

            // lsParametros = await daoParametros.SeleccionaFilaParametro2(207);
            // string telefono = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            // @ViewBag.NombreInstitucion = nombre;
            // @ViewBag.DireccionInstitucion = direccion;
            // @ViewBag.TelefonoInstitucion = telefono;


            @ViewBag.RegistroRptCabecera = RegistroRptCabecera;

            @ViewBag.RegistroRptFarmacia = RegistroRptFarmacia;
            @ViewBag.RegistroRptServicios = RegistroRptServicios;
            @ViewBag.RegistroRptPtoCargaConsolidado = RegistroRptPtoCargaConsolidado;
            @ViewBag.RegistroRptPorServicio = RegistroRptPorServicio;


            @ViewBag.RegistroRptCabecera2 = RegistroRptCabecera2;
            @ViewBag.RegistroRptPtoCargaConsolidado2 = RegistroRptPtoCargaConsolidado2;


            @ViewBag.EstanciaHosp = dtEstanciaHosp;

            if (modeloReporte == 1)
            {
                return PartialView("~/Views/Facturacion/Plantillas/ReporteEstadoCuentaPtoCargaDetallado.cshtml");
            }
            else if (modeloReporte == 2)
            {
                return PartialView("~/Views/Facturacion/Plantillas/ReporteEstadoCuentaPtoCargaConsolidado.cshtml");
            }
            else if (modeloReporte == 3)
            {
                return PartialView("~/Views/Facturacion/Plantillas/ReporteEstadoCuentaPorServicio.cshtml");
            }
            else if (modeloReporte == 4)
            {
                return PartialView("~/Views/Facturacion/Plantillas/ReporteEstadoCuentaLiquidacion.cshtml");
            }
            else if (modeloReporte == 5)
            {
                return PartialView("~/Views/Facturacion/Plantillas/ReporteEstadoCuentaExoneracion.cshtml");
            }
            else if (modeloReporte == 6)
            {
                return PartialView("~/Views/Facturacion/Plantillas/ReporteEstadoCuentaResumenLiquidacion.cshtml");
            }
            else if (modeloReporte == 7)
            {
                return PartialView("~/Views/Facturacion/Plantillas/ReporteEstadoCuentaHospEmergTotal.cshtml");
            }
            else if (modeloReporte == 8)
            {
                return PartialView("~/Views/Facturacion/Plantillas/ReporteEstadoCuentaHospEmergSis.cshtml");
            }

            return PartialView("~/Views/Facturacion/Plantillas/ReporteEstadoCuentaPtoCargaDetallado.cshtml");
        }

        public async Task<byte[]> UnirPdfsAsync(List<byte[]> pdfs)
        {
            using var msFinal = new MemoryStream();
            using var pdfDocFinal = new PdfDocument(new PdfWriter(msFinal));
            var merger = new PdfMerger(pdfDocFinal);

            foreach (var pdfBytes in pdfs)
            {
                using var ms = new MemoryStream(pdfBytes);
                using var pdfDoc = new PdfDocument(new PdfReader(ms));

                merger.Merge(pdfDoc, 1, pdfDoc.GetNumberOfPages());
            }

            pdfDocFinal.Close();
            return await Task.FromResult(msFinal.ToArray());
        }

    }


}
