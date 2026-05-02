using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Seguimiento
{
    public class SeguimientoController : BaseController
    {
        public IActionResult Index()
        {
            return View();
        }
        public async Task<IActionResult> SeguimientoPaciente(int idListBar)
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

            return View("SeguimientoPacienteGeneral");
        }
    }
}