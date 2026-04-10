using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Threading.Tasks;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.Areas.ProgramacionGeneral
{
    public class TurnosController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public async Task<ActionResult> ListarTurnos(string nombre)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet listaRes;

            DalTurnos dal = new DalTurnos();

            listaRes = await dal.ListarTurnos(nombre);

            return Json(new { lsResultado = listaRes, session = true });

        }

        public async Task<ActionResult> ListarTiposServiciosAsistenciales()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet listaRes;

            DalTurnos dal = new DalTurnos();

            listaRes = await dal.ListarTiposServiciosAsistenciales();

            return Json(new { lsResultado = listaRes, session = true });

        }

        public async Task<ActionResult> ListarRefConTurnosUPS()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet listaRes;

            DalTurnos dal = new DalTurnos();

            listaRes = await dal.ListarRefConTurnosUPS();

            return Json(new { lsResultado = listaRes, session = true });

        }

        public async Task<ActionResult> TurnosSeleccionarPorId(int idTurno)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet listaRes;
            DalTurnos dal = new DalTurnos();

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            listaRes = await dal.TurnosSeleccionarPorId(idTurno);

            return Json(new { lsResultado = listaRes, session = true });

        }

        public async Task<ActionResult> TurnosSeleccionarPorTipoServicio(int idTipoServicio)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet listaRes;
            DalTurnos dal = new DalTurnos();

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            listaRes = await dal.TurnosSeleccionarPorTipoServicio(idTipoServicio);

            return Json(new { lsResultado = listaRes, session = true });

        }

        public async Task<ActionResult> TurnosModificar(Turno turno)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet listaRes;
            DalTurnos dal = new DalTurnos();

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            listaRes = await dal.TurnosModificar(turno, idUsuario);

            return Json(new { lsResultado = listaRes, session = true });

        }

        public async Task<ActionResult> TurnosEliminar(int idturno)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet listaRes;
            DalTurnos dal = new DalTurnos();

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            listaRes = await dal.TurnosEliminar(idturno, idUsuario);

            return Json(new { lsResultado = listaRes, session = true });

        }



    }
}
