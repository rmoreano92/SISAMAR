using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Threading.Tasks;
using System;
using WebAppMaternidad.CapaDatos;
using DocumentFormat.OpenXml.Office2013.Excel;
using Newtonsoft.Json;
using System.Collections.Generic;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.Areas.FactConfig
{
    public class PartidasPresupuestalController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> PartidasPresupuestalListar(string codigo, string nombre)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalPartidasPresupuestal dal = new DalPartidasPresupuestal();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.PartidasPresupuestalListar(codigo, nombre);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });
        }

        [HttpPost]
        public async Task<ActionResult> CatalogoServiciosListarTodos()
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalPartidasPresupuestal dal = new DalPartidasPresupuestal();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.CatalogoServiciosListarTodos();
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });
        }

        [HttpPost]
        public async Task<ActionResult> FactPartidasPresupuestalesSeleccionar(int idPartida)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalPartidasPresupuestal dal = new DalPartidasPresupuestal();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));                
                rsp = await dal.FactPartidasPresupuestalesSeleccionar(idPartida);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });
        }

        [HttpPost]
        public async Task<ActionResult> PartidasPresupuestalGuardar(int idPartida, string codigo, string nombre, string detalle, int idListBar)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalPartidasPresupuestal dal = new DalPartidasPresupuestal();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                var lstobjDetalle = JsonConvert.DeserializeObject<List<PartidasPresupuestalCpt>>(detalle);
                rsp = await dal.PartidasPresupuestalGuardar(idPartida, codigo, nombre, lstobjDetalle, idUsuario, idListBar);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });
        }

        [HttpPost]
        public async Task<ActionResult> PartidasPresupuestalEliminar(int idPartida, int idListBar)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalPartidasPresupuestal dal = new DalPartidasPresupuestal();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.PartidasPresupuestalEliminar(idPartida, idUsuario, idListBar);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });
        }

    }
}
