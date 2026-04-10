

using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WebAppMaternidad.Areas.CentroQuirurgico
{
    public class CentroQuirurgicoController: Controller
    {
        public async Task<IActionResult> SolicitudSalaOperaciones(int idListBar)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }
                //RolesItems objRol = Empleado.DevuelveRolxItem(idListBar);
                // ROLES BD
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEmpleado dlEmpleado = new DalEmpleado();
                RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
                // FIN 
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
                ViewBag.itemBar = (int)Enumerados.shgIdsBar.Hospitalizacion_ListaNotaIngreso;
                DalUtilitario dlUtilitario = new DalUtilitario();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.EmergenciaIngreso);

                ViewBag.TiposDiagnosticos = TiposDiagnosticos;
                ViewBag.Vista = (int)Enumerados.Grupo.Hospitalización;
                ViewBag.Servicio = (int)Enumerados.TiposServicio.Hospitalización;
                ViewBag.Area = "Centro Quirurgico";
                return View("SolicitudSalaOperaciones");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        public async Task<IActionResult> ProgramacionMedicaSop(int idListBar)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }
                //RolesItems objRol = Empleado.DevuelveRolxItem(idListBar);
                // ROLES BD
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEmpleado dlEmpleado = new DalEmpleado();
                RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
                // FIN 
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
                ViewBag.itemBar = (int)Enumerados.shgIdsBar.Hospitalizacion_ListaNotaIngreso;
                DalUtilitario dlUtilitario = new DalUtilitario();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.EmergenciaIngreso);

                ViewBag.TiposDiagnosticos = TiposDiagnosticos;
                ViewBag.Vista = (int)Enumerados.Grupo.Hospitalización;
                ViewBag.Servicio = (int)Enumerados.TiposServicio.Hospitalización;
                ViewBag.Area = "Centro Quirurgico";
                ViewBag.Modulo = "Programación Médica SOP";
                return View("ProgramacionMedicaSop");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        public async Task<IActionResult> ProgramacionSala(int idListBar)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }
                //RolesItems objRol = Empleado.DevuelveRolxItem(idListBar);
                // ROLES BD
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEmpleado dlEmpleado = new DalEmpleado();
                RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
                // FIN 
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
                ViewBag.itemBar = (int)Enumerados.shgIdsBar.Hospitalizacion_ListaNotaIngreso;
                DalUtilitario dlUtilitario = new DalUtilitario();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.EmergenciaIngreso);

                ViewBag.TiposDiagnosticos = TiposDiagnosticos;
                ViewBag.Vista = (int)Enumerados.Grupo.Hospitalización;
                ViewBag.Servicio = (int)Enumerados.TiposServicio.Hospitalización;
                ViewBag.Area = "Centro Quirurgico";
                return View("ProgramacionSalaOperaciones");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        public async Task<IActionResult> ReporteOperatorio(int idListBar)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }
                //RolesItems objRol = Empleado.DevuelveRolxItem(idListBar);
                // ROLES BD
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEmpleado dlEmpleado = new DalEmpleado();
                RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
                // FIN 
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
                ViewBag.itemBar = (int)Enumerados.shgIdsBar.Hospitalizacion_ListaNotaIngreso;
                DalUtilitario dlUtilitario = new DalUtilitario();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.EmergenciaIngreso);

                ViewBag.TiposDiagnosticos = TiposDiagnosticos;
                ViewBag.Vista = (int)Enumerados.Grupo.Hospitalización;
                ViewBag.Servicio = (int)Enumerados.TiposServicio.Hospitalización;
                ViewBag.Area = "Centro Quirurgico";
                return View("ReporteOperatorio");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        public async Task<IActionResult> SeguridadIntervencionCQx(int idListBar)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }
                //RolesItems objRol = Empleado.DevuelveRolxItem(idListBar);
                // ROLES BD
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEmpleado dlEmpleado = new DalEmpleado();
                RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
                // FIN 
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
                ViewBag.itemBar = (int)Enumerados.shgIdsBar.Hospitalizacion_ListaNotaIngreso;
                DalUtilitario dlUtilitario = new DalUtilitario();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.EmergenciaIngreso);

                ViewBag.TiposDiagnosticos = TiposDiagnosticos;
                ViewBag.Vista = (int)Enumerados.Grupo.Hospitalización;
                ViewBag.Servicio = (int)Enumerados.TiposServicio.Hospitalización;
                ViewBag.Area = "Centro Quirurgico";
                return View("SeguridadIntervencionCQx");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }
    }
}
