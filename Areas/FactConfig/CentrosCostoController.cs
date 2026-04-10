using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Threading.Tasks;
using System;
using WebAppMaternidad.CapaDatos;
using Newtonsoft.Json;
using System.Collections.Generic;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.Areas.FactConfig
{
    public class CentrosCostoController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> CentrosCostoListar(string codigo, string nombre)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalCentrosCosto dal = new DalCentrosCosto();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.CentrosCostoListar(codigo, nombre);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });
        }

        [HttpPost]
        public async Task<ActionResult> FactCatalogoServiciosConPrecioMayorListar()
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalCentrosCosto dal = new DalCentrosCosto();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.FactCatalogoServiciosConPrecioMayorListar();
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });
        }

        [HttpPost]
        public async Task<ActionResult> CentrosCostoSeleccionar(int idCentroCosto)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalCentrosCosto dal = new DalCentrosCosto();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.CentrosCostoSeleccionar(idCentroCosto);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });
        }

        [HttpPost]
        public async Task<ActionResult> CentrosCostoGuardar(int idCentroCosto, string codigo, string nombre, string detalle, int idListBar)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalCentrosCosto dal = new DalCentrosCosto();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                var lstobjDetalle = JsonConvert.DeserializeObject<List<CentrosCostoCpt>>(detalle);
                rsp = await dal.CentrosCostoGuardar(idCentroCosto, codigo, nombre, lstobjDetalle, idUsuario, idListBar);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });
        }

        [HttpPost]
        public async Task<ActionResult> CentrosCostoEliminar(int idCentroCosto, int idListBar)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalCentrosCosto dal = new DalCentrosCosto();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.CentrosCostoEliminar(idCentroCosto, idUsuario, idListBar);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });
        }


    }
}
