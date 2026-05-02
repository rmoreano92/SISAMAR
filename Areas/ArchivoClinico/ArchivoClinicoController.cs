using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Threading.Tasks;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.ArchivoClinico
{
    public class ArchivoClinicoController : BaseController
    {
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> MovimientoHistorias(int idListBar)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            DalServicios dalServicios = new DalServicios();
            DalMovimientoHistorias dalMovimientoHistorias = new DalMovimientoHistorias();
            //DalUtilitario dalUtilitario = new DalUtilitario();
            //DataTable categoria, subcategoria, categoriadetalle;            
            DalEmpleado dlEmpleado = new DalEmpleado();
            RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
            //DataSet permisoActualizaCatalogo = await dalUtilitario.ValidarPermisoEmpleado(idUsuario, 306);

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

                //ViewBag.ActualizaCatalogo = (permisoActualizaCatalogo.Tables[0].Rows.Count > 0 ? true : false);

                //DalUtilitario dlUtilitario = new DalUtilitario();
                //List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                DataSet Servicios = await dalServicios.ListarServicios(0, 0, 0, 0);
                DataSet Motivos = await dalMovimientoHistorias.ListarMotivos();
                DataSet Usuario = await dlEmpleado.EmpleadosSeleccionar(idUsuario);

                ViewBag.Servicios = Servicios.Tables[0];
                ViewBag.Motivos = Motivos.Tables[0];
                ViewBag.Dni = Usuario.Tables[0].Rows[0]["DNI"].ToString();

            }
            ViewBag.Area = "Archivo Clínico";
            ViewBag.Modulo = "Movimiento Historias";
            ViewBag.Icono = "fa-files-medical";
            //ViewBag.PuntoCarga = 13;

            return View("MovimientoHistorias");

        }

        public async Task<IActionResult> Archiveros(int idListBar)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            DalServicios dalServicios = new DalServicios();
            //DalUtilitario dalUtilitario = new DalUtilitario();
            //DataTable categoria, subcategoria, categoriadetalle;            
            DalEmpleado dlEmpleado = new DalEmpleado();
            RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
            //DataSet permisoActualizaCatalogo = await dalUtilitario.ValidarPermisoEmpleado(idUsuario, 306);

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

                //ViewBag.ActualizaCatalogo = (permisoActualizaCatalogo.Tables[0].Rows.Count > 0 ? true : false);

                //DalUtilitario dlUtilitario = new DalUtilitario();
                //List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                DataSet Servicios = await dalServicios.ListarServicios(0,0,0,0);
                
                ViewBag.Servicios = Servicios.Tables[0];

            }
            ViewBag.Area = "Archivo Clínico";
            ViewBag.Modulo = "Archiveros";
            ViewBag.Icono = "fa-id-card-alt";
            //ViewBag.PuntoCarga = 13;

            return View("Archivero");

        }

        public async Task<IActionResult> HistoriaClinica(int idListBar)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            DalServicios dalServicios = new DalServicios();
            //DalUtilitario dalUtilitario = new DalUtilitario();
            //DataTable categoria, subcategoria, categoriadetalle;            
            DalEmpleado dlEmpleado = new DalEmpleado();
            RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
            //DataSet permisoActualizaCatalogo = await dalUtilitario.ValidarPermisoEmpleado(idUsuario, 306);

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

                //ViewBag.ActualizaCatalogo = (permisoActualizaCatalogo.Tables[0].Rows.Count > 0 ? true : false);

                //DalUtilitario dlUtilitario = new DalUtilitario();
                //List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                DataSet Servicios = await dalServicios.ListarServicios(0,0,0,0);
                
                ViewBag.Servicios = Servicios.Tables[0];
                
            }
            ViewBag.Area = "Archivo Clínico";
            ViewBag.Modulo = "Historia Clínica";
            ViewBag.Icono = "fa-id-card-alt";
            //ViewBag.PuntoCarga = 13;

            return View("HistoriaClinica");

        }

    }
}
