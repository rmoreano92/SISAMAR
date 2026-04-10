using CapaDatos;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Threading.Tasks;
using System;
using WebAppMaternidad.CapaDatos;
using CapaEntidades;
using Newtonsoft.Json;
using System.Collections.Generic;
using WebAppMaternidad.CapaEntidades;
using static NPOI.HSSF.Util.HSSFColor;
using Microsoft.AspNetCore.Http;

namespace WebAppMaternidad.Areas.FactConfig
{
    public class ConfiguracionResultadosLaboratorioController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> LabGruposSeleccionarTodos()
        {
            DataSet dataSet;
            DalConfiguracionResultadosLab dal = new DalConfiguracionResultadosLab();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dal.LabGruposSeleccionarTodos();

            return Json(new { dataSet, estado = true, session = true });
        }


        [HttpPost]
        public async Task<ActionResult> LabItemsCptSeleccionarPorProducto(int idProducto)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalLaboratorio dalLaboratorio = new DalLaboratorio();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalLaboratorio.LabItemsCptSeleccionarPorIdProducto(idProducto);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> LabItemsGruposSeleccionarTodos(string Filtro)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalConfiguracionResultadosLab dalLaboratorio = new DalConfiguracionResultadosLab();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalLaboratorio.LabItemsGruposSeleccionarTodos(Filtro);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> LabItemsSeleccionarTodos(string Filtro)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalConfiguracionResultadosLab dalLaboratorio = new DalConfiguracionResultadosLab();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalLaboratorio.LabItemsSeleccionarTodos(Filtro);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }
        [HttpPost]
        public async Task<ActionResult> ListarProcedimientoLabConfigurar(int? IdSubGrupo, string Codigo, string Nombre)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalConfiguracionResultadosLab dalLaboratorio = new DalConfiguracionResultadosLab();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalLaboratorio.ListarProcedimientoLabConfigurar(IdSubGrupo, Codigo, Nombre);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> LabItemsCptModificar(String lstLabItems, int idListBar, string opcion)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalConfiguracionResultadosLab dalLaboratorio = new DalConfiguracionResultadosLab();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                List<LabItemsCpt> lsItemsCpt = JsonConvert.DeserializeObject<List<LabItemsCpt>>(lstLabItems);
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                foreach (var item in lsItemsCpt)
                {
                    Console.WriteLine(item);
                    dataSet = await dalLaboratorio.LabItemsCptModificar(item, idUsuario, idListBar, opcion);
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
