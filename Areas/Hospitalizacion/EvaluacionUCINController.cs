using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Threading.Tasks;
using System;
using WebAppMaternidad.CapaDatos;

namespace WebAppMaternidad.Areas.Hospitalizacion
{
    public class EvaluacionUCINController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> ListarAtencionesUCIN(int idCuentaAtencion, int historiaClinica, string apellidoPaterno, string fechaIngreso, string fechaFin, string dni, int idServicio)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            string respuesta = "";
            DataSet rsp = null;
            DalEvaluacionUCIN dal = new DalEvaluacionUCIN();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.ListarAtencionesUCIN(idCuentaAtencion, historiaClinica, apellidoPaterno, fechaIngreso, fechaFin, dni, idServicio);
            }
            catch (Exception ex)
            {
                respuesta = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = respuesta });
        }






    }
}
