using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using System.Data;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Comun
{
    public class ComunController: BaseController
    {

        public async Task<IActionResult> EventosAdversos(int idListBar)
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
                ViewBag.itemBar = (int)Enumerados.shgIdsBar.Hospitalizacion_NotaIngreso;
                DalUtilitario dlUtilitario = new DalUtilitario();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos3 = new List<SubclasificacionDiagnosticos>();

                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.EmergenciaIngreso);
                TiposDiagnosticos3 = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.EmergenciaIngreso);

                ViewBag.PermisoRefCon = pRefcon;

                ViewBag.TiposDiagnosticos = TiposDiagnosticos;
                ViewBag.TiposDiagnosticos3 = TiposDiagnosticos3;
                ViewBag.Vista = (int)Enumerados.Grupo.Hospitalización;
                ViewBag.Servicio = (int)Enumerados.TiposServicio.Hospitalización;
                ViewBag.Area = "Hospitalizacion";
                ViewBag.idUsuario = idUsuario; // JDELGADO003-C




                return View("EventosAdversos");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        [HttpPost]
        public async Task<ActionResult> FactCatalogoServiciosBienesBusqueda(string tipoBusqueda, string filtro)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalComun dal = new DalComun();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.FactCatalogoServiciosBienesBusqueda(tipoBusqueda, filtro);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }




    }
}
