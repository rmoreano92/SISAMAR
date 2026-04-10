using CapaDatos;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Threading.Tasks;
using WebAppMaternidad.CapaDatos;

namespace WebAppMaternidad.Areas.General
{
    public class DepartamentosController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> ListarDepartamentos()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsResultado;
            DalDepartamentos dal = new DalDepartamentos();
            lsResultado = await dal.ListarDepartamentos();

            return Json(new { lsResultado = lsResultado, estado = true, session = true });

        }




    }
}
