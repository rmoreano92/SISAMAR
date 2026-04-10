using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using System;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.Areas.Herramientas
{
    public class AuditoriaController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }


        [HttpPost]
        public async Task<ActionResult> AuditoriaGuardar(Auditoria auditoria)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalAuditoria dal = new DalAuditoria();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                auditoria.IdEmpleado = idUsuario;
                rsp = await dal.AuditoriaGuardar(auditoria);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }


    }
}
