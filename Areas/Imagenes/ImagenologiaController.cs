using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace WebAppMaternidad.Areas.Imagenes
{
    public class ImagenologiaController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> EcografiaGeneral(int idListBar)
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

                //DalUtilitario dlUtilitario = new DalUtilitario();
                //List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                //TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna);
                //ViewBag.TiposDiagnosticos = TiposDiagnosticos;

            }
            ViewBag.Area = "Imagenología";
            ViewBag.Modulo = "Ecografía General";
            ViewBag.Icono = "fa-person-dots-from-line";
            ViewBag.PuntoCarga = 20;

            return View("Imagenologia");            
        }

        public async Task<IActionResult> RayosX(int idListBar)
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

                //DalUtilitario dlUtilitario = new DalUtilitario();
                //List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                //TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna);
                //ViewBag.TiposDiagnosticos = TiposDiagnosticos;

            }
            ViewBag.Area = "Imagenología";
            ViewBag.Modulo = "Rayos X";
            ViewBag.Icono = "fa-x-ray";
            ViewBag.PuntoCarga = 21;

            return View("Imagenologia");
        }

        public async Task<IActionResult> Tomografia(int idListBar)
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

                //DalUtilitario dlUtilitario = new DalUtilitario();
                //List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                //TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna);
                //ViewBag.TiposDiagnosticos = TiposDiagnosticos;

            }
            ViewBag.Area = "Imagenología";
            ViewBag.Modulo = "Tomografía";
            ViewBag.Icono = "fa-head-side-brain";
            ViewBag.PuntoCarga = 22;

            return View("Imagenologia");
        }

        public async Task<IActionResult> EcografiaObstetrica(int idListBar)
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

                //DalUtilitario dlUtilitario = new DalUtilitario();
                //List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                //TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna);
                //ViewBag.TiposDiagnosticos = TiposDiagnosticos;

            }
            ViewBag.Area = "Imagenología";
            ViewBag.Modulo = "Ecografía Obstétrica";
            ViewBag.Icono = "fa-person-pregnant";
            ViewBag.PuntoCarga = 23;

            return View("Imagenologia");
        }

        public async Task<IActionResult> CitasProcedimientos(int idListBar)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            DalEmpleado dlEmpleado = new DalEmpleado();
            RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);

            DataTable lsMedcos = new DataTable();
            DalAtenciones daoAtenciones = new DalAtenciones();

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

                DalUtilitario dlUtilitario = new DalUtilitario();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna);
                ViewBag.TiposDiagnosticos = TiposDiagnosticos;
            }



            lsMedcos = await daoAtenciones.ListaIdMedicoByUsuario(idUsuario);

            ViewBag.Vista = Enumerados.Grupo.Consulta_externa;
            ViewBag.Area = "Imagenologia";
            //return View("~/Views/Comun/PlanificacionFamiliar.cshtml");
            return View("CitasProcedimientos");
        }


    }
}
