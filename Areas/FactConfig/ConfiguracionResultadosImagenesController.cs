using CapaDatos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.CapaEntidades;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.FactConfig
{
    public class ConfiguracionResultadosImagenesController : BaseController
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> ImgGruposSeleccionarTodos()
        {
            DataSet dataSet;
            DalConfiguracionResultadosImg dal = new DalConfiguracionResultadosImg();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dal.ImgGruposSeleccionarTodos();

            return Json(new { dataSet, estado = true, session = true });
        }


        [HttpPost]
        public async Task<ActionResult> ImgItemsCptSeleccionarPorProducto(int idProducto)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalConfiguracionResultadosImg dal = new DalConfiguracionResultadosImg();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dal.ImgItemsCptSeleccionarPorIdProducto(idProducto);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ListarProcedimientoLabConfigurar(string Codigo, string Nombre)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalConfiguracionResultadosImg dalConfiguracionResultadosImg = new DalConfiguracionResultadosImg();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalConfiguracionResultadosImg.ListarProcedimientoImgConfigurar(Codigo, Nombre);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ImgItemsGruposSeleccionarTodos(string Filtro)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalConfiguracionResultadosImg dal = new DalConfiguracionResultadosImg();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dal.ImgItemsGruposSeleccionarTodos(Filtro);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ImgItemsSeleccionarTodos(string Filtro)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalConfiguracionResultadosImg dal = new DalConfiguracionResultadosImg();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dal.ImgItemsSeleccionarTodos(Filtro);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ListarProcedimientoImgConfigurar(int? IdSubGrupo, string Codigo, string Nombre)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalConfiguracionResultadosImg dal = new DalConfiguracionResultadosImg();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dal.ListarProcedimientoImgConfigurar(IdSubGrupo, Codigo, Nombre);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }


        [HttpPost]
        public async Task<ActionResult> ImgItemsCptModificar(String lstLabItems, int idListBar, string opcion)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalConfiguracionResultadosImg dal = new DalConfiguracionResultadosImg();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                List<ImgItemsCpt> lsItemsCpt = JsonConvert.DeserializeObject<List<ImgItemsCpt>>(lstLabItems);
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                foreach (var item in lsItemsCpt)
                {
                    Console.WriteLine(item);
                    dataSet = await dal.ImgItemsCptModificar(item, idUsuario, idListBar, opcion);
                }
                //dataSet = await dalLaboratorio.ListarProcedimientoLabConfigurar(IdSubGrupo, Codigo, Nombre);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

    }
}
