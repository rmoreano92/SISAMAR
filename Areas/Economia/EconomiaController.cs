using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using System.Data;

namespace WebAppMaternidad.Areas.Economia
{
    public class EconomiaController : Controller
    {
        private IWebHostEnvironment _hostingEnvironment;

        public EconomiaController(IWebHostEnvironment env)
        {
            _hostingEnvironment = env;
        }

        public IActionResult Index()
        {
            return View();
        }
        
        public async Task<IActionResult> MigrarDocumentos(int idListBar)
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
                DalEconomia dlEconomia = new DalEconomia();
                DataSet tiposDocumentos = await dlEconomia.CajaTiposComprobantesParaMigracion();

                ViewBag.TiposDocumentos = tiposDocumentos;
                ViewBag.Vista = (int)Enumerados.Grupo.Caja;                
                ViewBag.Area = "Migraíón Documentos";
                return View("~/Views/Economia/Migracion.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }
        }


    }
}
