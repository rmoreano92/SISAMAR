using CapaDatos;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Threading.Tasks;
using WebAppMaternidad.CapaDatos;

namespace WebAppMaternidad.Areas.Seguridad
{
    public class MedicosController : Controller
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
            DataSet lstData;
            DalMedico dal = new DalMedico();
            lstData = await dal.ListarMedicosPorEspecialidad(idEspecialidad);
            return Json(new { lsResultado = lstData, session = true });
        }

    }
}
