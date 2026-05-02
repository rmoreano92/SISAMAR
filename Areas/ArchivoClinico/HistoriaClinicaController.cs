using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Threading.Tasks;
using System;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.ArchivoClinico
{
    public class HistoriaClinicaController : BaseController
    {
        [HttpPost]
        public async Task<ActionResult> HistoriasClinicasSegunFiltro(int? NroHistoriaClinica, string ApellidoPaterno, string ApellidoMaterno, string Nombres)
        {
            int nRpta = 0;
            DalHistoriaClinica dalHistoriaClinica = new DalHistoriaClinica();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {

                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet ds = await dalHistoriaClinica.HistoriasClinicasSegunFiltro(NroHistoriaClinica, ApellidoPaterno, ApellidoMaterno, Nombres);

                return Json(new { session = true, estado = true, msg = "", data = ds });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }

        }

        [HttpGet]
        public async Task<ActionResult> TiposHistoriaClinicaSeleccionarTodos()
        {
            int nRpta = 0;
            DalHistoriaClinica dalHistoriaClinica = new DalHistoriaClinica();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {

                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet ds = await dalHistoriaClinica.TiposHistoriaClinicaSeleccionarTodos();

                return Json(new { session = true, estado = true, msg = "", data = ds });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }

        }

        [HttpGet]
        public async Task<ActionResult> EstadosHistoriaClinicaSeleccionarTodos()
        {
            int nRpta = 0;
            DalHistoriaClinica dalHistoriaClinica = new DalHistoriaClinica();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {

                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet ds = await dalHistoriaClinica.EstadosHistoriaClinicaSeleccionarTodos();

                return Json(new { session = true, estado = true, msg = "", data = ds });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }

        }

        [HttpPost]
        public async Task<ActionResult> CrearNroHistoriaV2(int IdTipoNumeracion)
        {
            int nRpta = 0;
            DalHistoriaClinica dalHistoriaClinica = new DalHistoriaClinica();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {

                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                nRpta = await dalHistoriaClinica.CrearNroHistoriaV2(IdTipoNumeracion, idUsuario);

                return Json(new { session = true, estado = true, msg = "", data = nRpta });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }

        }

        [HttpPost]
        public async Task<ActionResult> HistoriasClinicasModificar(
            int? IdTipoNumeracionAnterior, int? NroHistoriaClinicaAnterior, int IdTipoNumeracion, int NroHistoriaClinica,
            DateTime FechaCreacion, DateTime? FechaPasoAPasivo, int IdTipoHistoria, int IdEstadoHistoria, int IdPaciente)
        {
            int nRpta = 0;
            DalHistoriaClinica dalHistoriaClinica = new DalHistoriaClinica();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {

                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                nRpta = await dalHistoriaClinica.HistoriasClinicasModificar(
                                IdTipoNumeracionAnterior, NroHistoriaClinicaAnterior, IdTipoNumeracion, NroHistoriaClinica,
                                FechaCreacion, FechaPasoAPasivo, IdTipoHistoria, IdEstadoHistoria, IdPaciente, idUsuario);

                return Json(new { session = true, estado = true, msg = "", data = nRpta });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }

        }
    }
}
