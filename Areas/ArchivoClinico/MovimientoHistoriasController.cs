using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Threading.Tasks;
using System;
using WebAppMaternidad.CapaDatos;
using Newtonsoft.Json;
using System.Collections.Generic;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.Areas.ArchivoClinico
{
    public class MovimientoHistoriasController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> MovimientoHistoriasListar(string historia, string apPaterno, string apMaterno, string nombres, string fechamov)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalMovimientoHistorias dal = new DalMovimientoHistorias();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.MovimientoHistoriasListar(historia, apPaterno, apMaterno, nombres, fechamov);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });
        }



        [HttpPost]
        public async Task<ActionResult> FiltrarServicios(string filtro)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalMovimientoHistorias dal = new DalMovimientoHistorias();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.FiltrarServicios(filtro);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }

        [HttpPost]
        public async Task<ActionResult> MovimientoHistoriaSeleccionar(int idMovimiento)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalMovimientoHistorias dal = new DalMovimientoHistorias();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.MovimientoHistoriaSeleccionar(idMovimiento);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }

        [HttpPost]
        public async Task<ActionResult> MovimientoHistoriaGuardar(MovimientoHistoriaClinica movimientoHistoria, int idListBar)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalMovimientoHistorias dal = new DalMovimientoHistorias();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));                
                rsp = await dal.MovimientoHistoriaGuardar(movimientoHistoria, idUsuario, idListBar);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }

        [HttpPost]
        public async Task<ActionResult> MovimientoHistoriaEliminar(int idMovimiento, int idListBar)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalMovimientoHistorias dal = new DalMovimientoHistorias();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.MovimientoHistoriaEliminar(idMovimiento, idUsuario, idListBar);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }



    }
}
