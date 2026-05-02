using CapaDatos;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Threading.Tasks;
using System;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Comun
{
    public class SmsController : BaseController
    {

        public async Task<ActionResult> ListarMensajesPorEstadoEnvio(int idEstadoEnvio)
        {

            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return Json(new { session = false });
            //}
            DataSet dataSet = null;
            DalSms dalSms = new DalSms();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalSms.ListarMensajesPorEstadoEnvio(idEstadoEnvio);
                //return Json(new { session = true, estado = true, msg = "", data = dataSet.Tables[0] });
                return Json(dataSet.Tables[0]);
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        public async Task<ActionResult> ModificarEstadoMensajes(int idMensaje, int idEstadoEnvio)
        {

            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return Json(new { session = false });
            //}
            DataSet dataSet = null;
            DalSms dalSms = new DalSms();
            bool res = false;

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalSms.ModificarEstadoMensajes(idMensaje, idEstadoEnvio);
                return Json(dataSet.Tables[0]);
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = res });
            }

        }

        public async Task<ActionResult> ListarMensajesRNPorEstadoEnvio(int idEstadoEnvio)
        {

            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return Json(new { session = false });
            //}
            DataSet dataSet = null;
            DalSms dalSms = new DalSms();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalSms.ListarMensajesPoRNEstadoEnvio(idEstadoEnvio);
                //return Json(new { session = true, estado = true, msg = "", data = dataSet.Tables[0] });
                return Json(dataSet.Tables[0]);
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        public async Task<ActionResult> ModificarEstadoMensajesRN(int idMensaje, int idEstadoEnvio)
        {

            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return Json(new { session = false });
            //}
            DataSet dataSet = null;
            DalSms dalSms = new DalSms();
            bool res = false;

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalSms.ModificarEstadoMensajesRN(idMensaje, idEstadoEnvio);
                return Json(dataSet.Tables[0]);
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = res });
            }

        }
    }
}
