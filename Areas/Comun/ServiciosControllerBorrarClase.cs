using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebAppMaternidad.Areas.Comun
{
    public class ServiciosControllerBorrarClase : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult ListaServiciobyTipoServicio(int idTipoServicio)
        {
            DataSet LstServicios;
            DalConsumoServicio daoConSer= new DalConsumoServicio();
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

    }
}