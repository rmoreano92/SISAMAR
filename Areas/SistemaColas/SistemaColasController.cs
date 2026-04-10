using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WebAppMaternidad.Areas.SistemaColas
{
    public class SistemaColasController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        public async Task<IActionResult> Monitoreo(int idListBar)
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
            //RolesItems objRol = Empleado.DevuelveRolxItem(idListBar);
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
            ViewBag.Area = "Sistema Colas";
            ViewBag.Modulo = "Monitoreo";
            ViewBag.Icono = "fa-gauge-high";

            return View("SGCMonitoreo");
            //return View("PatologiaClinica");
        }

        public async Task<IActionResult> Configuracion(int idListBar)
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
            //RolesItems objRol = Empleado.DevuelveRolxItem(idListBar);
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
            ViewBag.Area = "Sistema Colas";
            ViewBag.Modulo = "Configuración";
            ViewBag.Icono = "fa-gears";
            
            return View("SGCConfiguracion");
            //return View("PatologiaClinica");
        }
    }
}
