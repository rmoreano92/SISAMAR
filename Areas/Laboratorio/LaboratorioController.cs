using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using static CapaEntidades.ListBarItemEnum;

namespace WebAppMaternidad.Areas.Laboratorio
{
    public class LaboratorioController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> PatologiaClinica(int idListBar)
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

                DalUtilitario dlUtilitario = new DalUtilitario();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna);
                ViewBag.TiposDiagnosticos = TiposDiagnosticos;

            }
            ViewBag.Area = "Laboratorio";
            ViewBag.Modulo = "Patología Clínica";
            ViewBag.Icono = "fa-microscope";
            ViewBag.PuntoCarga = 2;

            return View("Laboratorio");
            //return View("PatologiaClinica");
        }

        public async Task<IActionResult> AnatomiaPatologica(int idListBar)
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
            DalLaboratorio dlLaboratorio = new DalLaboratorio();
            DataSet dsTipoEstudio = await dlLaboratorio.ValidarResponsableTipoEstudioLab(idUsuario.ToString());
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

            ViewBag.Area = "Laboratorio";
            ViewBag.Modulo = "Anatomía Patológica";
            ViewBag.Icono = "fa-vial";
            ViewBag.PuntoCarga = 3;
            ViewBag.ResponsableTipoEstudio = dsTipoEstudio.Tables[0].Rows[0]["ResponsableTipoEstudio"];

            return View("Laboratorio");
            //return View("PatologiaClinica");
        }

        public async Task<IActionResult> BancoSangre(int idListBar)
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

                DalUtilitario dlUtilitario = new DalUtilitario();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna);
                ViewBag.TiposDiagnosticos = TiposDiagnosticos;

            }
            ViewBag.Area = "Laboratorio";
            ViewBag.Modulo = "Banco de Sangre";
            ViewBag.Icono = "fa-hand-holding-droplet";
            ViewBag.PuntoCarga = 11;

            return View("Laboratorio");
            //return View("PatologiaClinica");
        }

        public async Task<IActionResult> RegistroMuestraTamizajeNeonatal(int idListBar)
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

                DalUtilitario dlUtilitario = new DalUtilitario();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna);
                ViewBag.TiposDiagnosticos = TiposDiagnosticos;

            }

            ViewBag.IdUsuario = idUsuario;
            ViewBag.Area = "Sis";
            return View("TamizajeNeonatalLaboratorio");
        }
        public async Task<IActionResult> TamizajeNeonatal(int idListBar)
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

                DalUtilitario dlUtilitario = new DalUtilitario();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna);
                ViewBag.TiposDiagnosticos = TiposDiagnosticos;

            }

            ViewBag.Area = "Laboratorio";
            ViewBag.Modulo = "TamizajeNeonatal";
            ViewBag.Icono = "fa fi fi-ss-footprint";
            ViewBag.PuntoCarga = 14;

            return View("Laboratorio");
            //return View("PatologiaClinica");
        }

        public async Task<IActionResult> Genetica(int idListBar)
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

                DalUtilitario dlUtilitario = new DalUtilitario();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna);
                ViewBag.TiposDiagnosticos = TiposDiagnosticos;

            }
            
            ViewBag.Area = "Laboratorio";
            ViewBag.Modulo = "Genética";
            ViewBag.Icono = "fa-dna";
            ViewBag.PuntoCarga = 13;

            return View("Laboratorio");
            //return View("PatologiaClinica");
        }

        public async Task<IActionResult> MedicinaReproductiva(int idListBar)
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
            ViewBag.Area = "Laboratorio";
            ViewBag.Modulo = "Medicina Reproductiva";
            ViewBag.Icono = "fa-mars-and-venus";
            //ViewBag.PuntoCarga = 13;

            return View("MedicinaReproductiva");
            
        }


    }
}
