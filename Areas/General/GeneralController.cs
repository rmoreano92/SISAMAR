using CapaDatos;
using CapaEntidades;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.General
{
    public class GeneralController : BaseController
    {
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> Especialidades(int idListBar)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            //ROLES LUIS
            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            DalEmpleado dlEmpleado = new DalEmpleado();


            RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);

            // FIN ROLES LUIS
            DalParametros daoParametros = new DalParametros();
            string pRefcon = await daoParametros.SeleccionaPermisoGeneral("REFCON");

            if (objRol == null)
            {
                return View("AccesoDenegado");
            }
            else
            {
                ViewBag.Agregar = objRol.Agregar;
                ViewBag.Modificar = objRol.Modificar;
                ViewBag.Eliminar = objRol.Eliminar;
                ViewBag.Consultar = objRol.Consultar;
            }

            ViewBag.Vista = Enumerados.Grupo.General;
            ViewBag.Area = "General";
            //return View("~/Views/Comun/PlanificacionFamiliar.cshtml");
            return View("Especialidades");
        }

        public async Task<IActionResult> Servicios(int idListBar)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            //ROLES LUIS
            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            DalEmpleado dlEmpleado = new DalEmpleado();


            RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);

            // FIN ROLES LUIS
            DalParametros daoParametros = new DalParametros();
            string pRefcon = await daoParametros.SeleccionaPermisoGeneral("REFCON");

            if (objRol == null)
            {
                return View("AccesoDenegado");
            }
            else
            {
                ViewBag.Agregar = objRol.Agregar;
                ViewBag.Modificar = objRol.Modificar;
                ViewBag.Eliminar = objRol.Eliminar;
                ViewBag.Consultar = objRol.Consultar;
            }

            ViewBag.Vista = Enumerados.Grupo.General;
            ViewBag.Area = "General";
            //return View("~/Views/Comun/PlanificacionFamiliar.cshtml");
            return View("Servicios");
        }

        public async Task<IActionResult> EstablecimientosNoMinsa(int idListBar)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            //ROLES LUIS
            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            DalEmpleado dlEmpleado = new DalEmpleado();


            RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);

            // FIN ROLES LUIS
            DalParametros daoParametros = new DalParametros();
            string pRefcon = await daoParametros.SeleccionaPermisoGeneral("REFCON");

            if (objRol == null)
            {
                return View("AccesoDenegado");
            }
            else
            {
                ViewBag.Agregar = objRol.Agregar;
                ViewBag.Modificar = objRol.Modificar;
                ViewBag.Eliminar = objRol.Eliminar;
                ViewBag.Consultar = objRol.Consultar;
            }

            ViewBag.Vista = Enumerados.Grupo.General;
            ViewBag.Area = "General";
            //return View("~/Views/Comun/PlanificacionFamiliar.cshtml");
            return View("EstablecimientosNoMinsa");
        }

        public async Task<IActionResult> Establecimientos(int idListBar)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            //ROLES LUIS
            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            DalEmpleado dlEmpleado = new DalEmpleado();


            RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);

            // FIN ROLES LUIS
            DalParametros daoParametros = new DalParametros();
            string pRefcon = await daoParametros.SeleccionaPermisoGeneral("REFCON");

            if (objRol == null)
            {
                return View("AccesoDenegado");
            }
            else
            {
                ViewBag.Agregar = objRol.Agregar;
                ViewBag.Modificar = objRol.Modificar;
                ViewBag.Eliminar = objRol.Eliminar;
                ViewBag.Consultar = objRol.Consultar;
            }

            ViewBag.Vista = Enumerados.Grupo.General;
            ViewBag.Area = "General";
            //return View("~/Views/Comun/PlanificacionFamiliar.cshtml");
            return View("Establecimientos");
        }
    }
}
