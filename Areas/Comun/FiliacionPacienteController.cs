using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using System;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.CapaEntidades;
using CapaDatos;

namespace WebAppMaternidad.Areas.Comun
{
    public class FiliacionPacienteController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> FiliacionRecienNacidoGuardar(FiliacionRecienNacido filiacion, int idListBar)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalFiliacionPaciente dal = new DalFiliacionPaciente();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.FiliacionRecienNacidoGuardar(filiacion, idUsuario, idListBar);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }

    }
}
