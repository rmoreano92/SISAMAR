using CapaDatos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.Areas.General
{
    public class ServiciosController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public async Task<ActionResult> ListarServicios(int idTipoServicio, int idDepartamento, int idEspecialidad, int idServicio)
        {
            DataSet lstData;
            DalServicios dal = new DalServicios();

            lstData = await dal.ListarServicios(idTipoServicio, idDepartamento, idEspecialidad, idServicio);

            return Json(new { lsResultado = lstData, sesion = true });
        }

        [HttpPost]
        public ActionResult ListaServiciobyTipoServicio(int idTipoServicio)
        {
            DataSet LstServicios;
            DalConsumoServicio daoConSer = new DalConsumoServicio();
            LstServicios = daoConSer.ListaServiciobyTipoServicio(idTipoServicio);
            return Json(LstServicios);
        }

        [HttpPost]
        public async Task<ActionResult> ServicioSeleccionarPorTipoServicio(int idTipoServicio)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalServicios dalServicios = new DalServicios();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalServicios.ServicioSeleccionarPorTipoServicio(idTipoServicio);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> DevuelveServiciosQueSonPuntosCarga(string filtro)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalServicios dalServicios = new DalServicios();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalServicios.DevuelveServiciosQueSonPuntosCarga(filtro);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> ServiciosAgregar(Servicio servicio)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            int resp = 0;
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            DalServicios dalServicios = new DalServicios();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                resp = await dalServicios.ServiciosAgregar(servicio, idUsuario);
                return Json(new { session = true, estado = true, msg = "", data = resp });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = resp });
            }
        }

        [HttpPost]
        public async Task<ActionResult> ServiciosSeleccionarPorTipo(int IdTipoServicio, string Nombre)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            DalServicios dalServicios = new DalServicios();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalServicios.ServiciosSeleccionarPorTipo(IdTipoServicio, Nombre);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> DevuelveServiciosDelHospitalFiltro(string filtro)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalAdmisionEmergencia daoServicios = new DalAdmisionEmergencia();
            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await daoServicios.DevuelveServiciosDelHospitalFiltro(filtro);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

    }
}
