using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Threading.Tasks;
using WebAppMaternidad.CapaDatos;

namespace WebAppMaternidad.Areas.Herramientas
{
    public class ReprogramacionMedicaController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> ListarServiciosPorFechaEspecialidad(int idTipoServicio, int idEspecialidad, int activaProcedimiento, string fecha)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet ds;

            DalReprogramacionMedica dal = new DalReprogramacionMedica();

            ds = await dal.ListarServiciosPorFechaEspecialidad(idTipoServicio, idEspecialidad, activaProcedimiento, fecha);

            return Json(new { respuesta = ds, session = true });

        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarProgramacionMedica(int idProgramacion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet ds;

            DalReprogramacionMedica dal = new DalReprogramacionMedica();

            ds = await dal.SeleccionarProgramacionMedica(idProgramacion);

            return Json(new { respuesta = ds, session = true });

        }

        [HttpPost]
        public async Task<ActionResult> ListarProgramacionMedicaCuposDisponibles(int idProgramacion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet ds;

            DalReprogramacionMedica dal = new DalReprogramacionMedica();

            ds = await dal.ListarProgramacionMedicaCuposDisponibles(idProgramacion);

            return Json(new { respuesta = ds, session = true });

        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarCitasProgramadass(int idProgramacion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet ds;

            DalReprogramacionMedica dal = new DalReprogramacionMedica();

            ds = await dal.SeleccionarCitasProgramadass(idProgramacion);

            return Json(new { respuesta = ds, session = true });

        }


        [HttpPost]
        public async Task<ActionResult> GuardarReprogramacionMedicaPorPaciente(int idCuenta, int idProgramacion, string horaInicio, string horaFin)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet ds;
            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            DalReprogramacionMedica dal = new DalReprogramacionMedica();

            ds = await dal.GuardarReprogramacionMedicaPorPaciente(idCuenta, idProgramacion, horaInicio, horaFin, idUsuario);

            return Json(new { respuesta = ds, session = true });

        }

        [HttpPost]
        public async Task<ActionResult> ListarProgramacionMedicaPorFecha(string fecha, int idMedico = 0)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet ds;

            DalReprogramacionMedica dal = new DalReprogramacionMedica();

            ds = await dal.ListarProgramacionMedicaPorFecha(fecha, idMedico);

            return Json(new { respuesta = ds, session = true });

        }

        [HttpPost]
        public async Task<ActionResult> ListarMedicosPorEspecialidad(int idEspecialidad)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet ds;

            DalReprogramacionMedica dal = new DalReprogramacionMedica();

            ds = await dal.ListarMedicosPorEspecialidad(idEspecialidad);

            return Json(new { respuesta = ds, session = true });

        }

        [HttpPost]
        public async Task<ActionResult> GuardarReprogramacionMedicaPorServicio(int idProgramacion, string horaInicio, string horaFin, int tipoReprogramacion, string fechaNueva, int idMedicoNuevo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet ds;
            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            DalReprogramacionMedica dal = new DalReprogramacionMedica();

            ds = await dal.GuardarReprogramacionMedicaPorServicio(idProgramacion, horaInicio, horaFin, tipoReprogramacion, fechaNueva, idMedicoNuevo, idUsuario);

            return Json(new { respuesta = ds, session = true });

        }

        [HttpPost]
        public async Task<ActionResult> GuardarReprogramacionCitaProcedimientoPorPaciente(int idCita, int idProgramacion, string horaInicio, string horaFin)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet ds;
            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            DalReprogramacionMedica dal = new DalReprogramacionMedica();

            ds = await dal.GuardarReprogramacionCitaProcedimientoPorPaciente(idCita, idProgramacion, horaInicio, horaFin, idUsuario);

            return Json(new { respuesta = ds, session = true });

        }


    }
}
