using CapaDatos;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Threading.Tasks;
using System;
using WebAppMaternidad.CapaEntidades;
using WebAppMaternidad.CapaDatos;
using Microsoft.AspNetCore.Http;
using ClosedXML.Excel;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using System.Linq;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Emergencia
{
    public class DerivacionController: BaseController
    {
        private IWebHostEnvironment _hostingEnvironment;

        public DerivacionController(IWebHostEnvironment env)
        {
            _hostingEnvironment = env;
        }

        [HttpPost]
        public async Task<ActionResult> DerivacionAgregar(Derivacion derivacion) // JDELGADO001.2
        {
            DataSet dataSet;
            DalDerivacion dalDerivacion = new DalDerivacion();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            dataSet = null;

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                derivacion.idUsuario = idUsuario;
                dataSet = await dalDerivacion.DerivacionAgregar(derivacion);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }
        
        public async Task<ActionResult> ListarDerivacion() // JDELGADO001.2
        {
            DataSet dataSet;
            DalDerivacion dalDerivacion = new DalDerivacion();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            dataSet = null;

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalDerivacion.ListarDerivacion();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        //====KHOYOSI 20032026================================================================================
        public async Task<ActionResult> ListarDerivaciones(int codigo, int cuenta, string dni, string nombres, int idServicio, string fechaInicio, string fechaFin)
        {
            DataSet dataSet;
            DalDerivacion dalDerivacion = new DalDerivacion();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            dataSet = null;

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalDerivacion.ListarDerivaciones(codigo, cuenta, dni, nombres, idServicio, fechaInicio ,fechaFin);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ListarDerivacionById(int IdDerivacion) // JDELGADO001.2
        {
            DataSet dataSet;
            DalDerivacion dalDerivacion = new DalDerivacion();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = null;

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalDerivacion.ListarDerivacionById(IdDerivacion);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> DerivacionEliminar(int idDerivacion) 
        {
            DataSet dataSet;
            DalDerivacion dalDerivacion = new DalDerivacion();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            dataSet = null;

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {                
                dataSet = await dalDerivacion.DerivacionEliminar(idDerivacion, idUsuario);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }
        //====================================================================================================

        public async Task<IActionResult> GeneraRptListarDerivacionByUsuario(int IdUsuario, DateTime FechaIni, DateTime FechaFin)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
            sWebRootFolder = sWebRootFolder + "/Plantilla/Emergencia/RptDerivacionEmergencia.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                //var FilaIni = 4;
                DalDerivacion dalDerivacion = new DalDerivacion();
                //int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet dataSet = await dalDerivacion.ListarDerivacionByUsuario(IdUsuario, FechaIni, FechaFin);

                var wsHoja1 = workbook.Worksheets.First();


                wsHoja1.Cell(6, 1).InsertTable(dataSet.Tables[0]);

               
                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "SaldosPorAlmacen.xlsx");
                }
            }
        }
    }
}
