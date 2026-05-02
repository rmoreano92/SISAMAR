using CapaDatos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Threading.Tasks;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Seguridad
{
    public class MedicosController : BaseController
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> ListarMedicosTodos()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lstData;
            DalMedico dal = new DalMedico();
            lstData = await dal.ListarMedicosTodos();
            return Json(new { lsResultado = lstData, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListarMedicosPorEspecialidad(int idEspecialidad)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            int idIpressInt = 0;
            var idIpressStr = HttpContext.Session.GetString("IdIPress");
            if (!string.IsNullOrEmpty(idIpressStr) && int.TryParse(idIpressStr, out int result)) idIpressInt = result;

            DataSet lstData;
            DalMedico dal = new DalMedico();
            lstData = await dal.ListarMedicosPorEspecialidad(idEspecialidad, idIpressInt);
            return Json(new { lsResultado = lstData, session = true });
        }

    }
}
