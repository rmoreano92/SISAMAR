using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebAppMaternidad.Areas.Seguridad
{
    public class SeguridadController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> Empleados(int idListBar)
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

            ViewBag.Vista = (int)Enumerados.Grupo.Seguridad;            
            ViewBag.Area = "Empleados";

            return View("~/Views/Seguridad/Empleados.cshtml");
        }

        public async Task<IActionResult> Roles(int idListBar)
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

            ViewBag.Vista = (int)Enumerados.Grupo.Seguridad;
            ViewBag.Area = "Roles";

            return View("~/Views/Seguridad/Roles.cshtml");
        }
    }
}
