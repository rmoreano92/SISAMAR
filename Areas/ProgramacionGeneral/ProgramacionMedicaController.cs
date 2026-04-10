using CapaDatos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Threading.Tasks;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.Areas.ProgramacionGeneral
{
    public class ProgramacionMedicaController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> ListarProgramacionMedica(int idTipoServicio, int idDepartamento, int idEspecialidad, int idServicio, int idMedico, int activaProcedimiento, string fecha)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet ds;

            DalProgramacionMedica dal = new DalProgramacionMedica();

            ds = await dal.ListarProgramacionMedica(idTipoServicio, idDepartamento, idEspecialidad, idServicio, idMedico, activaProcedimiento, fecha);

            return Json(new { lsResultado = ds, session = true });

        }

        [HttpPost]
        public async Task<ActionResult> ListarProgramacionMedicaPorRango(int idTipoServicio, int idDepartamento, int idEspecialidad, int idServicio, int idMedico, int activaProcedimiento, string fechaInicio, string fechaFin)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet ds;

            DalProgramacionMedica dal = new DalProgramacionMedica();

            ds = await dal.ListarProgramacionMedicaPorRango(idTipoServicio, idDepartamento, idEspecialidad, idServicio, idMedico, activaProcedimiento, fechaInicio, fechaFin);

            return Json(new { lsResultado = ds, session = true });

        }

        [HttpPost]
        public async Task<ActionResult> ListarProgramacionMedicaMensual(int idTipoServicio, int idDepartamento, int idEspecialidad, int idServicio, int idMedico, int activaProcedimiento, int anio, int mes)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet ds;

            DalProgramacionMedica dal = new DalProgramacionMedica();

            ds = await dal.ListarProgramacionMedicaMensual(idTipoServicio, idDepartamento, idEspecialidad, idServicio, idMedico, activaProcedimiento, anio, mes);

            return Json(new { lsResultado = ds, session = true });

        }

        [HttpPost]
        public async Task<ActionResult> ListarTiposProgramacion()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet ds;

            DalProgramacionMedica dal = new DalProgramacionMedica();

            ds = await dal.ListarTiposProgramacion();

            return Json(new { lsResultado = ds, session = true });

        }

        [HttpPost]
        public async Task<ActionResult> ProgramacionMedicaSeleccionar(int idProgramacion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet ds;

            DalProgramacionMedica dal = new DalProgramacionMedica();

            ds = await dal.ProgramacionMedicaSeleccionar(idProgramacion);

            return Json(new { lsResultado = ds, session = true });

        }

        [HttpPost]
        public async Task<ActionResult> ProgramacionMedicaModificar(ProgramacionMedica prog)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet ds;

            DalProgramacionMedica dal = new DalProgramacionMedica();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            ds = await dal.ProgramacionMedicaModificar(prog, idUsuario);

            return Json(new { lsResultado = ds, session = true });

        }

        [HttpPost]
        public async Task<ActionResult> ProgramacionMedicaEliminar(int idProgramacion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet ds;

            DalProgramacionMedica dal = new DalProgramacionMedica();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            ds = await dal.ProgramacionMedicaEliminar(idProgramacion, idUsuario);

            return Json(new { lsResultado = ds, session = true });

        }

    }
}
