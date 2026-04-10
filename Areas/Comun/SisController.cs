using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SisReference;
using ReniecReference;
using SoaSisPruebaReference;
using System.Data;
using CapaDatos;
using CapaEntidades;
//using ClosedXML.Excel;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
//using CapaEntidades;
using System.IO;
using System.Diagnostics.Contracts;

namespace WebAppMaternidad.Areas.Comun
{   
    // JDELGADO003-M
    public class SisController : Controller
    {

        private IWebHostEnvironment _hostingEnvironment;

        public SisController(IWebHostEnvironment env)
        {
            _hostingEnvironment = env;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> ListarAfiliadosSis(string disa, string tipoFormato, string contrato, string tipoTabla)
        {
            BuscarAseguradosResponse res = null;
            if ( HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            RecepcionTramaSoapClient client = new RecepcionTramaSoapClient(RecepcionTramaSoapClient.EndpointConfiguration.RecepcionTramaSoap);

            
            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                res = await client.BuscarAseguradosAsync(disa, tipoFormato, contrato, "", tipoTabla);
                return Json(new { session = true, estado = true, msg = "", data = res });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = res });
            }


        }

        [HttpPost]
        public ActionResult listarReniec(string dniAuto, string dniCon)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            ServiceDNISoapClient client = new ServiceDNISoapClient(ServiceDNISoapClient.EndpointConfiguration.ServiceDNISoap);
            //BuscarAseguradosRequestBody requestBody = new BuscarAseguradosRequestBody { Disa = "250", TipoFormato = "2", Contrato = "77344460" };
            //BuscarAseguradosRequest request = new BuscarAseguradosRequest();
            //request.Body = requestBody;
            //BuscarAseguradosResponse response = client.BuscarAsegurados("250", "2", "77344460", "", "");


            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                return Json(new { session = true, estado = true, msg = "", data = client.GetReniec(dniAuto, dniCon) });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = "" });
            }

        }
        
        [HttpPost]
        public async Task<ActionResult> web_SisFiliacionesAgregar(SisFiliaciones sisFiliaciones) // JDELGADO003-C
        {
            //DataSet dataSet = null;
            int nRpta = 0;
            DalSis dalSis = new DalSis();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                nRpta = await dalSis.web_SisFiliacionesAgregar(sisFiliaciones, int.Parse(HttpContext.Session.GetString("idusu")));
                return Json(new { session = true, estado = true, msg = "", data = nRpta });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }
        }

        //////////////////////KHOYOSI///////////////////////////////////////////
        [HttpPost]
        public async Task<ActionResult> SisFuaAtencionSeleccionarPorId(int IdCuentaAtencion) 
        {
            DataSet dataResp = null;
            //int nRpta;
            DalSis dalSis = new DalSis();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            try
            {
                dataResp = await dalSis.SisFuaAtencionSeleccionarPorId(IdCuentaAtencion);

                return Json(new { lsResultado = dataResp, estado = true, session = true, mensaje = "" });
            }
            catch (Exception e)
            {
                return Json(new {  estado = false, session = true, mensaje = "Error al insertar afiliacion: " + e });
            }
        }



        //public async Task<IActionResult> FormatoFua(int idListBar)
        //{
        //    try
        //    {
        //        if (HttpContext.User.Identity.IsAuthenticated == false)
        //        {
        //            return View("Login");
        //        }

        //        //ROLES LUIS
        //        int idUsuario;
        //        idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
        //        DalEmpleado dlEmpleado = new DalEmpleado();
        //        RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
        //        // FIN ROLES LUIS
        //        //RolesItems objRol = Empleado.DevuelveRolxItem(idListBar);
        //        if (objRol == null)
        //        {
        //            return View("AccesoDenegado");
        //        }
        //        else
        //        {
        //            ViewBag.Agregar = objRol.Agregar;
        //            ViewBag.Modificar = objRol.Modificar;
        //            ViewBag.Eliminar = objRol.Eliminar;
        //            ViewBag.Consultar = objRol.Consultar;

        //        }
        //        ViewBag.itemBar = (int)Enumerados.shgIdsBar.Hospitalizacion_NotaIngreso;
        //        DalUtilitario dlUtilitario = new DalUtilitario();
        //        List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
        //        TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.EmergenciaIngreso);
        //        //TiposDiagnosticos = dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.EmergenciaIngreso); // jdelgado descomentar si es necesario para listar tipos diagnostico

        //        ViewBag.TiposDiagnosticos = TiposDiagnosticos;
        //        ViewBag.Vista = (int)Enumerados.Grupo.Emergencia;
        //        ViewBag.Servicio = (int)Enumerados.TiposServicio.Consultorios_Emergencia;
        //        ViewBag.Area = "Comun";
        //        return View("~/Views/Comun/Sis.cshtml");
        //    }
        //    catch (Exception ex)
        //    {
        //        ViewBag.DescripcionError = ex.Message;
        //        return View("Error");
        //    }

        //}

    }
}
