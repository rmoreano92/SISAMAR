using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System.Net.Mime;
using SelectPdf;
using WebAppMaternidad.CapaDatos;
using DocumentFormat.OpenXml.Spreadsheet;


namespace WebAppMaternidad.Areas.Facturacion
{
    public class FacturacionController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        public async Task<IActionResult> ConsumoServicio(int idListBar)
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
            ViewBag.Area = "Facturacion";
            return View("ConsumoServicio");
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
            ViewBag.Area = "Facturacion";
            return View("TamizajeNeonatal");
        }

        public async Task<IActionResult> PacienteExternoConCuentaSeguro(int idListBar)
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
            ViewBag.Area = "Facturacion";
            return View("PacienteExternoConCuentaSeguro");
        }

        public async Task<IActionResult> EvaluacionRiesgoSocial(int idListBar)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            DalEvaluacionRiesgoSocial dalRs = new DalEvaluacionRiesgoSocial();
            DalUtilitario dalUtilitario = new DalUtilitario();
            //DataTable categoria, subcategoria, categoriadetalle;            
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

                //DalUtilitario dlUtilitario = new DalUtilitario();
                //List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                DataSet formatoEvaluacion = await dalRs.CargarFormatoEvaluacionRiesgoSocial();
                DataSet turnosLaborales = await dalUtilitario.ListarTiposTurnosLaborales();
                DataSet trabajadorSocial = await dalRs.ListarTrabajadoresSocial();
                DataSet tiposPaciente = await dalRs.ListarTiposPacienteEvaluacion();


                ViewBag.CategoriaRs = formatoEvaluacion.Tables[0];
                ViewBag.SubCategoriaRs = formatoEvaluacion.Tables[1];
                ViewBag.CategoriaDetalleRs = formatoEvaluacion.Tables[2];
                ViewBag.TrabajadoresSocial = trabajadorSocial.Tables[0];
                ViewBag.TurnosLaborales = turnosLaborales.Tables[0];
                ViewBag.TiposPaciente = tiposPaciente.Tables[0];
                
                ViewBag.idUsuario = idUsuario;

            }
            ViewBag.Area = "Facturación";
            ViewBag.Modulo = "Evaluacion Riesgo Social";
            ViewBag.Icono = "fa-mars-and-venus";
            //ViewBag.PuntoCarga = 13;

            return View("EvaluacionRiesgoSocial");

        }

        public async Task<IActionResult> EstadoCuenta(int idListBar)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            string user = HttpContext.Session.GetString("user").ToString();

            DalEmpleado dlEmpleado = new DalEmpleado();
            DalUtilitario dalUtilitario = new DalUtilitario();

            RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);

            DataSet permisoRecalculo = await dalUtilitario.ValidarPermisoEmpleado(idUsuario, 114);


            var tienePermisoRecalculo = "";

            if (permisoRecalculo.Tables.Count == 0 || permisoRecalculo.Tables[0].Rows.Count == 0)
            {
                tienePermisoRecalculo = "";
            }
            else
            {
                tienePermisoRecalculo = permisoRecalculo.Tables[0].Rows[0]["IdPermiso"].ToString();
            }

                

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

            ViewBag.Area = "Facturacion";
            ViewBag.Modulo = "Estado de Cuenta";
            ViewBag.Icono = "fa fa-clipboard";


            ViewBag.Icono = "fa fa-clipboard";


            ViewBag.tienePermisoRecalculo = tienePermisoRecalculo;

            ViewBag.Usuario = user;
            //ViewBag.PuntoCarga = 13;

            return View("EstadoCuenta");

        }
    }
}
