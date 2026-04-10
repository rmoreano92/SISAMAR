using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.Areas.Comun
{
    public class CamasController : Controller
    {
        // GET: CamasController
        public ActionResult Index()
        {
            return View();
        }


        [HttpPost]
        public async Task<ActionResult> ListarCamasPorServicio(int idServicio)
        {
            DataSet dataSet;
            DalCamas dalCamas = new DalCamas();
            
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
                        
            dataSet = await dalCamas.ListarCamasPorServicio(idServicio);

            return Json(new { lsResultado = dataSet, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListarDisponibilidadCamasPorServicioActual(int idServicio)
        {
            DataSet dataSet;
            DalCamas dalCamas = new DalCamas();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCamas.ListarDisponibilidadCamasPorServicioActual(idServicio);

            return Json(new { lsResultado = dataSet, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListarServicioPorTipo(int idTipoServicio, string filtro)
        {
            DataSet dataSet;
            DalCamas dalCamas = new DalCamas();
           
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCamas.ListarServicioPorTipo(idTipoServicio, filtro);

            return Json(new { lsResultado = dataSet, session = true });
        }


        [HttpPost]
        public async Task<ActionResult> TiposServicioSeleccionarTodos()
        {
            DataSet dataSet;
            DalCamas dalCamas = new DalCamas();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCamas.TiposServicioSeleccionarTodos();

            return Json(new { lsResultado = dataSet, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> EstadosCamaSeleccionarTodos()
        {
            DataSet dataSet;
            DalCamas dalCamas = new DalCamas();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCamas.EstadosCamaSeleccionarTodos();

            return Json(new { lsResultado = dataSet, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> TiposCamaSeleccionarTodos()
        {
            DataSet dataSet;
            DalCamas dalCamas = new DalCamas();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCamas.TiposCamaSeleccionarTodos();

            return Json(new { lsResultado = dataSet, session = true });
        }


        [HttpPost]
        public async Task<ActionResult> CamasSeleccionarPorId(int idCama)
        {
            DataSet dataSet;
            DalCamas dalCamas = new DalCamas();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCamas.CamasSeleccionarPorId(idCama);

            return Json(new { lsResultado = dataSet, session = true });
        }


        [HttpPost]
        public async Task<ActionResult> TiposCondicionOcupacionSeleccionarTodos()
        {
            DataSet dataSet;
            DalCamas dalCamas = new DalCamas();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCamas.TiposCondicionOcupacionSeleccionarTodos();

            return Json(new { lsResultado = dataSet, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> CamasMovimientosSeleccionarPorCama(int idCama)
        {
            DataSet dataSet;
            DalCamas dalCamas = new DalCamas();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCamas.CamasMovimientosSeleccionarPorCama(idCama);

            return Json(new { lsResultado = dataSet, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> CamasBuscarCodigoDeCama(string codigoCama, int idServicioPropietario)
        {
            DataSet dataSet;
            DalCamas dalCamas = new DalCamas();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCamas.CamasBuscarCodigoDeCama(codigoCama, idServicioPropietario);

            return Json(new { lsResultado = dataSet, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> BusquedaCantidadEstanciaPorCama(int idCama)
        {
            DataSet dataSet;
            DalCamas dalCamas = new DalCamas();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCamas.CamasCantidadEstanciaSeleccionarPorCama(idCama);

            return Json(new { lsResultado = dataSet, session = true });
        }



        [HttpPost]
        public async Task<ActionResult> ModificarCamaEstanciaHospitalaria(int idEstanciaHosp, int idCama)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalCamas dalCamas = new DalCamas();

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                
                ds = await dalCamas.ModificarCamaEstanciaHospitalaria(idEstanciaHosp, idCama, idUsuario);

                return Json(new { respuesta = ds, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (GuardarEvaluacion): " + ex });
            }

        }


        [HttpPost]
        public async Task<ActionResult> ModificarCama(Cama cama, String lstMovimientosCama)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            //DataSet ds;
            bool resp = false;
            DalCamas dalCamas = new DalCamas();

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                var lstobjMovimientosCama = JsonConvert.DeserializeObject<List<MovimientoCama>>(lstMovimientosCama);
                resp = await dalCamas.ModificarCama(cama, lstobjMovimientosCama, idUsuario);

                return Json(new { respuesta = resp, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (GuardarCama): " + ex });
            }

        }

        [HttpPost]
        public async Task<ActionResult> EliminarCama(int idCama)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            //DataSet ds;
            bool resp = false;
            DalCamas dalCamas = new DalCamas();

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                                
                resp = await dalCamas.EliminarCama(idCama, idUsuario);

                return Json(new { respuesta = resp, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (EliminarCama): " + ex });
            }

        }

        [HttpPost]
        public async Task<ActionResult> CamasLimpiaIdPaciente(int? IdPaciente)
        {
            DataSet dsFiltrado = new DataSet();
            int res = 0;
            //int nRpta;
            DalCamas dalCamas = new DalCamas();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            DataTable filasFiltradas = new DataTable();
            try
            {
                res = await dalCamas.CamasLimpiaIdPaciente(IdPaciente);

                return Json(new { session = true, estado = true, msg = "", data = res });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = res });
            }

        }

        [HttpPost]
        public async Task<ActionResult> LiberarCamaPorPaciente(int idPaciente, int idListBar)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalCamas dalCamas = new DalCamas();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dalCamas.LiberarCamaPorPaciente(idPaciente, idUsuario, idListBar);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }

    }
}
