using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.CapaEntidades;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Seguridad
{
    public class RolesController : BaseController
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> ListarRoles()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet lstData;
            DalRoles daoRoles = new DalRoles();

            lstData = await daoRoles.ListarRoles();

            return Json(new { lstData = lstData, mensaje = "", sesion = true });
        }

        public async Task<ActionResult> ListarListBarItems()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet lstData;
            DalRoles daoRoles = new DalRoles();

            lstData = await daoRoles.ListarListBarItems();

            return Json(new { lstData = lstData, mensaje = "", sesion = true });
        }

        public async Task<ActionResult> ListarPermisos()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet lstData;
            DalRoles daoRoles = new DalRoles();

            lstData = await daoRoles.ListarPermisos();

            return Json(new { lstData = lstData, mensaje = "", sesion = true });
        }

        public async Task<ActionResult> ListarListBarReportes()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet lstData;
            DalRoles daoRoles = new DalRoles();

            lstData = await daoRoles.ListarListBarReporte();

            return Json(new { lstData = lstData, mensaje = "", sesion = true });
        }

        public async Task<ActionResult> SeleccionarRolesItems(int idRol)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet lstData;
            DalRoles daoRoles = new DalRoles();

            lstData = await daoRoles.SeleccionarRolesItems(idRol);

            return Json(new { lstData = lstData, mensaje = "", sesion = true });
        }

        public async Task<ActionResult> SeleccionarRolesPermisos(int idRol)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet lstData;
            DalRoles daoRoles = new DalRoles();

            lstData = await daoRoles.SeleccionarRolesPermisos(idRol);

            return Json(new { lstData = lstData, mensaje = "", sesion = true });
        }

        public async Task<ActionResult> SeleccionarRolesReportes(int idRol)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet lstData;
            DalRoles daoRoles = new DalRoles();

            lstData = await daoRoles.SeleccionarRolesReportes(idRol);

            return Json(new { lstData = lstData, mensaje = "", sesion = true });
        }

        public async Task<ActionResult> GuardarModificarRol(int idRol, string nombreRol, String lstModulosRol, String lstPermisosRol, String lstReportesRol)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            //DataSet lstData;
            DalRoles daoRoles = new DalRoles();
            bool rpta = false;
            bool rpta2 = false;
            bool rpta3 = false;
            bool rpta4 = false;
            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            idRol = await daoRoles.GuardarModificarRol(idRol, nombreRol, idUsuario);
            var lstobjModulosRol = JsonConvert.DeserializeObject<List<RolesItems>>(lstModulosRol);
            var lstobjPermisosRol = JsonConvert.DeserializeObject<List<RolesPermisos>>(lstPermisosRol);
            var lstobjReportesRol = JsonConvert.DeserializeObject<List<RolesReportes>>(lstReportesRol);

            rpta2 = await daoRoles.GuardarModificarRolesItems(idRol, lstobjModulosRol);
            rpta3 = await daoRoles.GuardarModificarRolesPermisos(idRol, lstobjPermisosRol);
            rpta4 = await daoRoles.GuardarModificarRolesReportes(idRol, lstobjReportesRol);

            if(rpta2 && rpta3 && rpta4)
            {
                rpta = true;
            }

            return Json(new { rpta = rpta, mensaje = "", sesion = true });
        }

        public async Task<ActionResult> EliminarRol(int idRol)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DalRoles daoRoles = new DalRoles();
            bool rpta = false;
            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            rpta = await daoRoles.EliminarRolesItems(idRol, idUsuario);


            return Json(new { rpta = rpta, mensaje = "", sesion = true });
        }
    }
}
