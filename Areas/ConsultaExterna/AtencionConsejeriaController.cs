using CapaDatos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Threading.Tasks;
using WebAppMaternidad.CapaDatos;

namespace WebAppMaternidad.Areas.ConsultaExterna
{
    public class AtencionConsejeriaController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }


        [HttpPost]
        public async Task<ActionResult> ListarProgramacionMedica(string fecha)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalAtencionConsejeria dal = new DalAtencionConsejeria();
            int idMedico;
            idMedico = int.Parse(HttpContext.Session.GetString("idmed"));
            ds = await dal.ListarProgramacionMedica(fecha, idMedico);
            return Json(new { respuesta= ds, sesion = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListarAtencionesConsejeria(int idProgramacion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalAtencionConsejeria dal = new DalAtencionConsejeria();
                        
            //int idMedico;
            //idMedico = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await dal.ListarAtencionesConsejeria(idProgramacion);
            return Json(new { respuesta = ds, sesion = true });
        }
               

        [HttpPost]
        public async Task<ActionResult> ListarDestinosAtencion()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalAtencionConsejeria dal = new DalAtencionConsejeria();
            //int idMedico;
            //idMedico = int.Parse(HttpContext.Session.GetString("idmed"));
            ds = await dal.ListarDestinoAtencion();
            return Json(new { respuesta = ds, sesion = true });
        }



    }
}
