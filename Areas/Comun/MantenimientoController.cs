using System;
using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using SisReference;
using System.Data;

namespace WebAppMaternidad.Areas.Comun
{
    public class MantenimientoController: Controller
    {
        public async Task<IActionResult> Mantenimiento(int idListBar)
        {
            try
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
                ViewBag.itemBar = (int)Enumerados.shgIdsBar.Hospitalizacion_NotaIngreso;
                DalUtilitario dlUtilitario = new DalUtilitario();

                
                ViewBag.Area = "Comun";
                return View("~/Views/Comun/Mantenimiento.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        public async Task<IActionResult> VerificacionPacienteSIS(int idListBar)
        {
            try
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
                ViewBag.itemBar = (int)Enumerados.shgIdsBar.Hospitalizacion_NotaIngreso;
                DalUtilitario dlUtilitario = new DalUtilitario();


                ViewBag.Area = "Comun";
                return View("~/Views/Comun/VerificacionPacienteSIS.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        [HttpPost]
        public async Task<ActionResult> ModificarNroHistoria(string nroHistoriaActual, int idTipoNumeracion, string nroHistoria)
        {
            DataSet dataSet = null;
            int resp = 0;
            DalPaciente dalPaciente = new DalPaciente();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                resp = await dalPaciente.ModificarNroHistoria(nroHistoriaActual, idTipoNumeracion, nroHistoria);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }


        }

        [HttpPost]
        public async Task<ActionResult> ListarAtenciones(string lcFiltro)
        {
            string filtro = "";

            filtro = lcFiltro + " order by ate.FechaIngreso desc, ate.HoraIngreso desc, pac.ApellidoPaterno, pac.ApellidoMaterno, pac.PrimerNombre";

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsAtenciones;
            DalSis daoSis = new DalSis();
            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            lsAtenciones = await daoSis.BuscarAtencionesSnAfiliacionPorFiltro(filtro);
            return Json(new { lsAtenciones = lsAtenciones, session = true });
        }

    }
}
