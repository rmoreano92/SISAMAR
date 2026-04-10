
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Data;
using System.Threading.Tasks;
using WebAppMaternidad.CapaDatos;

namespace WebAppMaternidad.Areas.ConsultaExterna
{
    public class InmunizacionesController : Controller
    {

        [HttpGet]
        public async Task<ActionResult> ListarProcedimientosInmunizaciones()
        {
            DataSet dataSet = null;
            //int nRpta;
            DalInmunizaciones dalInmunizaciones = new DalInmunizaciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalInmunizaciones.ListarProcedimientosInmunizaciones();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> InsertarVacunasInmunizaciones(
            int IdAtencion, int IdPaciente, int IdProducto, int Dosis, string CoMorbilidad, int GrupoRiesgo, string ContactoTBP, string Lote, DateTime Fecha,
            int Actividad, int Estrategia, int ResponsableVacuna, int SupervisorVacuna, int Idturno)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalInmunizaciones dalInmunizaciones = new DalInmunizaciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalInmunizaciones.InsertarVacunasInmunizaciones(
                    IdAtencion, IdPaciente, IdProducto, Dosis, CoMorbilidad, GrupoRiesgo, ContactoTBP, Lote, Fecha, Actividad, Estrategia, ResponsableVacuna, SupervisorVacuna, Idturno);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ListarVacunasInmunizacionesByIdAtencionIdProductoDosis(int IdPaciente, int IdProducto, int Dosis)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalInmunizaciones dalInmunizaciones = new DalInmunizaciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalInmunizaciones.ListarVacunasInmunizacionesByIdAtencionIdProductoDosis(IdPaciente, IdProducto, Dosis);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> AnularAtencionesTamizajeNeonatal(int IdCuentaAtencion, int IdRegistroTamizaje, int EsRegistroIpress)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalInmunizaciones dalInmunizaciones = new DalInmunizaciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalInmunizaciones.AnularAtencionesTamizajeNeonatal(IdCuentaAtencion, IdRegistroTamizaje, EsRegistroIpress);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ListarAtencionesTamizajeByIdPaciente(int IdPaciente)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalInmunizaciones dalInmunizaciones = new DalInmunizaciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalInmunizaciones.ListarAtencionesTamizajeByIdPaciente(IdPaciente);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        public async Task<ActionResult> ListarPersonalInmunizaciones()
        {
            DataSet dataSet = null;
            //int nRpta;
            DalInmunizaciones dalInmunizaciones = new DalInmunizaciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalInmunizaciones.ListarPersonalInmunizaciones();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        public async Task<ActionResult> ListarTurnosInmunizaciones()
        {
            DataSet dataSet = null;
            //int nRpta;
            DalInmunizaciones dalInmunizaciones = new DalInmunizaciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalInmunizaciones.ListarTurnosInmunizaciones();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> GuardarAtencionInmunizaciones(int IdAtencion)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalInmunizaciones dalInmunizaciones = new DalInmunizaciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalInmunizaciones.GuardarAtencionInmunizaciones(IdAtencion);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }
    }
}
