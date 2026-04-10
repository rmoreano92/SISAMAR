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
    public class TiposTarifaController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> TiposTarifaListar(string codigo, string nombre)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalTiposTarifa dal = new DalTiposTarifa();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.TiposTarifaListar(codigo, nombre);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });
        }

        [HttpPost]
        public async Task<ActionResult> TiposTarifaCptListarTodos()
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalTiposTarifa dal = new DalTiposTarifa();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.TiposTarifaCptListarTodos();
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });
        }

        [HttpPost]
        public async Task<ActionResult> TiposTarifaSeleccionar(int idTipoTarifa)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalTiposTarifa dal = new DalTiposTarifa();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.TiposTarifaSeleccionar(idTipoTarifa);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });
        }

        [HttpPost]
        public async Task<ActionResult> TiposTarifaGuardar(int idTipoTarifa, string codigo, string nombre, string detalle, int esFarmacia, int idListBar)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalTiposTarifa dal = new DalTiposTarifa();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                var lstobjDetalle = JsonConvert.DeserializeObject<List<TiposTarifaCpt>>(detalle);
                rsp = await dal.TiposTarifaGuardar(idTipoTarifa, codigo, nombre, lstobjDetalle, esFarmacia, idUsuario, idListBar);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });
        }

        [HttpPost]
        public async Task<ActionResult> TiposTarifaEliminar(int idTipoTarifa, int idListBar)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalTiposTarifa dal = new DalTiposTarifa();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));                
                rsp = await dal.TiposTarifaEliminar(idTipoTarifa, idUsuario, idListBar);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });
        }


    }
}
