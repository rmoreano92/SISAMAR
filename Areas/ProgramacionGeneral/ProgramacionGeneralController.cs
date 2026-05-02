using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.ProgramacionGeneral
{
    public class ProgramacionGeneralController : BaseController
    {
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> ProgramacionMedica(int idListBar)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }

                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEmpleado dlEmpleado = new DalEmpleado();
                RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);

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
                //ViewBag.Vista = (int)Enumerados.Grupo.Emergencia;
                ViewBag.IdTipoServicio = (int)Enumerados.TiposServicio.Hospitalización;
                ViewBag.Area = "Programación General";
                ViewBag.Modulo = "Programación Médica";
                return View("~/Views/ProgramacionGeneral/ProgramacionMedica.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        public async Task<IActionResult> Turno(int idListBar)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }

                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEmpleado dlEmpleado = new DalEmpleado();
                RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);

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
                //ViewBag.Vista = (int)Enumerados.Grupo.Emergencia;
                ViewBag.IdTipoServicio = (int)Enumerados.TiposServicio.Hospitalización;
                ViewBag.Area = "Programación General";
                ViewBag.Modulo = "Turnos";
                return View("~/Views/ProgramacionGeneral/Turno.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }


    }
}
