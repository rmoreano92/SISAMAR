using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Threading.Tasks;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.Areas.ConsultaExterna
{
    public class ConsejeriaPsicoprofilaxisController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> ListarFactoresRiesgo()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalAtencionConsejeria dal = new DalAtencionConsejeria();
            //int idMedico;
            //idMedico = int.Parse(HttpContext.Session.GetString("idmed"));
            ds = await dal.ListarFactorRiesgo();
            return Json(new { respuesta = ds, sesion = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListarDetalleTiposAtencion()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalAtencionConsejeria dal = new DalAtencionConsejeria();
            //int idMedico;
            //idMedico = int.Parse(HttpContext.Session.GetString("idmed"));
            ds = await dal.ListarDetalleTipoAtencion();
            return Json(new { respuesta = ds, sesion = true });
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarConsejeriaPsicoprofilaxis(int idAtencion, int idCitaTerapia)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalAtencionConsejeria dal = new DalAtencionConsejeria();

            //int idMedico;
            //idMedico = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await dal.SeleccionarConsejeriaPsicoprofilaxis(idAtencion, idCitaTerapia);
            return Json(new { respuesta = ds, sesion = true });
        }

        [HttpPost]
        public async Task<ActionResult> GuardarConsejeriaPsicoprofilaxis(ConsejeriaPsicoprofilaxis consejeriaPsicoprofilaxis, int IdListBar)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalAtencionConsejeria dal = new DalAtencionConsejeria();

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await dal.GuardarConsejeriaPsicoprofilaxis(consejeriaPsicoprofilaxis, idUsuario, IdListBar);
            return Json(new { respuesta = ds, sesion = true });
        }

        [HttpPost]
        public async Task<ActionResult> EliminarConsejeriaPsicoprofilaxis(int idAtencion, int idCitaTerapia, int IdListBar)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalAtencionConsejeria dal = new DalAtencionConsejeria();

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await dal.EliminarConsejeriaPsicoprofilaxis(idAtencion, idCitaTerapia, idUsuario, IdListBar);
            return Json(new { respuesta = ds, sesion = true });
        }



    }
}
