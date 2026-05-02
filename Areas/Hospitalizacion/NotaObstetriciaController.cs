using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Data;
using System.Threading.Tasks;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.CapaEntidades;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Hospitalizacion
{
    public class NotaObstetriciaController: BaseController
    {
        [HttpPost]
        public async Task<ActionResult> CrearModificarNotaObstetricia(NotaObstetricia notaObstetricia, Triaje objtriaje) // JDELGADO003-C
        {
            int nRpta = 0;
            var nRptaIdAtencionDetalleUCI = 0;
            DalNotaObstetricia dalNotaObstetricia = new DalNotaObstetricia();
            DalTriaje dalTriaje = new DalTriaje();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));


                objtriaje.idAtencion = notaObstetricia.IdAtencion;

                var rpta = await dalNotaObstetricia.CrearModificarNotaObstetricia(notaObstetricia);

                var resp = await dalTriaje.InsertaModificaTriajeNotaObstetricia(objtriaje);

                return Json(new { session = true, estado = true, msg = "", data = rpta });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = Json(new { IdAtencionUCI = nRpta, IdAtencionDetalleUCI = nRptaIdAtencionDetalleUCI }) });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ListaAtencionesNotaObstetricia(string IdCuentaAtencion, string NroHistoria, string ApellidoPaterno, string ApellidoMaterno, string Nombres, string FechaIngreso, string IdServicio)
        {
            int nRpta = 0;
            DalNotaObstetricia dalNotaObstetricia = new DalNotaObstetricia();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                DataSet ds = await dalNotaObstetricia.ListaAtencionesNotaObstetricia(IdCuentaAtencion, NroHistoria, ApellidoPaterno, ApellidoMaterno, Nombres, FechaIngreso, IdServicio);
                return Json(new { session = true, estado = true, msg = "", data = ds });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ListarNotasObstetricia(int IdAtencion)
        {
            int nRpta = 0;
            DalNotaObstetricia dalNotaObstetricia = new DalNotaObstetricia();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                DataSet ds = await dalNotaObstetricia.ListarNotasObstetricia(IdAtencion);
                return Json(new { session = true, estado = true, msg = "", data = ds });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }

        }
    }
}
