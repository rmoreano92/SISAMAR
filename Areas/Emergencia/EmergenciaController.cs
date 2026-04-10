using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using SelectPdf;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using static CapaEntidades.Enumerados;

namespace WebAppMaternidad.Areas.Emergencia
{
    public class EmergenciaController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> PlanificacionFamiliar(int idListBar)
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

                    DalUtilitario dlUtilitario = new DalUtilitario();
                    List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                    TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.EmergenciaIngreso);
                    ViewBag.TiposDiagnosticos = TiposDiagnosticos;
                    List<Comorbilidad> lstComorbilidad = new List<Comorbilidad>();
                    lstComorbilidad = dlUtilitario.DevuelveComorbilidades();
                    ViewBag.ListComorbilidad = lstComorbilidad;

                }
                ViewBag.Vista = (int)Enumerados.Grupo.Emergencia;
                ViewBag.Servicio = (int)Enumerados.TiposServicio.Consultorios_Emergencia ;
                ViewBag.Area = "Emergencia";
                return View("~/Views/Comun/PlanificacionFamiliar.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }        
        public async Task<IActionResult> Recetas(int idListBar)
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


                DalUtilitario dlUtilitario = new DalUtilitario();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.EmergenciaIngreso);
                //TiposDiagnosticos = dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna); // jdelgado descomentar si es necesario para listar tipos diagnostico
                ViewBag.TiposDiagnosticos = TiposDiagnosticos;

                ViewBag.Vista = (int)Enumerados.Grupo.Emergencia;
                ViewBag.Servicio = (int)Enumerados.TiposServicio.Consultorios_Emergencia;
                ViewBag.Area = "Emergencia";
                return View("~/Views/Comun/RecetaGeneral.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        public async Task<IActionResult> AdmisionEmergencia(int idListBar)
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


                DalParametros daoParametros = new DalParametros();
                string pRefcon = await daoParametros.SeleccionaPermisoGeneral("REFCON");

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
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos4 = new List<SubclasificacionDiagnosticos>();

                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.EmergenciaIngreso);
                TiposDiagnosticos4 = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.EmergenciaIngreso);

                ViewBag.PermisoRefCon = pRefcon;

                ViewBag.TiposDiagnosticos = TiposDiagnosticos;
                ViewBag.TiposDiagnosticos4 = TiposDiagnosticos4;

                ViewBag.Vista = (int)Enumerados.Grupo.Emergencia;
                ViewBag.Servicio = (int)Enumerados.TiposServicio.Consultorios_Emergencia;
                ViewBag.Area = "Emergencia";
                return View("~/Views/Emergencia/AdmisionEmergencia.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }
        public async Task<IActionResult> EvaluacionEmergencia(int idListBar)
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


                DalParametros daoParametros = new DalParametros();
                string pRefcon = await daoParametros.SeleccionaPermisoGeneral("REFCON");

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
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos4 = new List<SubclasificacionDiagnosticos>();

                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.EmergenciaIngreso);
                TiposDiagnosticos4 = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.EmergenciaIngreso);

                ViewBag.PermisoRefCon = pRefcon;

                ViewBag.TiposDiagnosticos = TiposDiagnosticos;
                ViewBag.TiposDiagnosticos4 = TiposDiagnosticos4;

                ViewBag.Vista = (int)Enumerados.Grupo.Emergencia;
                ViewBag.Servicio = (int)Enumerados.TiposServicio.Consultorios_Emergencia;
                ViewBag.Area = "Emergencia";
                return View("~/Views/Emergencia/EvaluacionEmergencia.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }
        public async Task<IActionResult> Camas(int idListBar)
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
                DalUtilitario dalUtilitario = new DalUtilitario();
                
                RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
                int PermisoLiberaCama = await dalUtilitario.ValidarPermisoUsuario(idUsuario, "CAMA-LIBERAR-CAMA");
                
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

                    ViewBag.PermisoLiberaCama = PermisoLiberaCama;
                }
                
                ViewBag.IdTipoServicio = (int)Enumerados.TiposServicio.Consultorios_Emergencia;
                ViewBag.Area = "Emergencia";
                ViewBag.Modulo = "Camas de Observación";
                return View("~/Views/Comun/Camas.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        public async Task<IActionResult> PriorizacionEmergencia(int idListBar)
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


                DalParametros daoParametros = new DalParametros();
                string pRefcon = await daoParametros.SeleccionaPermisoGeneral("REFCON");

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
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos4 = new List<SubclasificacionDiagnosticos>();

                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.EmergenciaIngreso);
                TiposDiagnosticos4 = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.EmergenciaIngreso);

                ViewBag.PermisoRefCon = pRefcon;

                ViewBag.TiposDiagnosticos = TiposDiagnosticos;
                ViewBag.TiposDiagnosticos4 = TiposDiagnosticos4;

                ViewBag.Vista = (int)Enumerados.Grupo.Emergencia;
                ViewBag.Servicio = (int)Enumerados.TiposServicio.Consultorios_Emergencia;
                ViewBag.Area = "Emergencia";
                return View("~/Views/Emergencia/PriorizacionEmergencia.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        /*RMOREANO FICHA DE EGRESO*/
        private async Task<string> RenderViewToStringAsync(string viewPath, object model = null)
        {
            var services = HttpContext.RequestServices;
            var razorEngine = (IRazorViewEngine)services.GetService(typeof(IRazorViewEngine));
            var tempDataProvider = (ITempDataProvider)services.GetService(typeof(ITempDataProvider));
            var actionContext = new ActionContext(HttpContext, RouteData, ControllerContext.ActionDescriptor);

            var getView = razorEngine.GetView(executingFilePath: null, viewPath: viewPath, isMainPage: true);
            var findView = razorEngine.FindView(actionContext, viewPath, isMainPage: true);
            var viewResult = getView.Success ? getView : findView;
            if (!viewResult.Success)
            {
                var searched = string.Join(", ", viewResult?.SearchedLocations ?? Array.Empty<string>());
                throw new InvalidOperationException($"No se encontró la vista '{viewPath}'. Buscadas: {searched}");
            }

            using (var sw = new StringWriter())
            {
                var viewDictionary = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary()) { Model = model };
                var tempData = new TempDataDictionary(HttpContext, tempDataProvider);
                var viewContext = new ViewContext(actionContext, viewResult.View, viewDictionary, tempData, sw, new HtmlHelperOptions());
                await viewResult.View.RenderAsync(viewContext);
                return sw.ToString();
            }
        }

        [HttpGet]
        public async Task<IActionResult> GenerarPapeletaEgresoPdf(int idCuentaAtencion)
        {
            try
            {
                var daoEvalEmergencia = new DalEvaluacionEmergencia();
                var dsAt = await Task.Run(() => daoEvalEmergencia.PapeletaEgreso(idCuentaAtencion));


                if (dsAt != null && dsAt.Tables.Count > 0 && dsAt.Tables[0].Rows.Count > 0)

                {
                    var row = dsAt.Tables[0].Rows[0];
                    Func<string[], string> GetAny = cols =>
                    {
                        foreach (var c in cols) if (row.Table.Columns.Contains(c) && row[c] != DBNull.Value) return row[c].ToString();
                        return "";
                    };
                    ViewBag.PacienteNombre = row["Paciente"].ToString(); 
                    ViewBag.GradoParentesco = row["Parentesco"].ToString();
                    ViewBag.NroCIP = row["TitularCIP"].ToString();
                    ViewBag.Garante = row["Garante"].ToString();
                    ViewBag.Dependencia = row["UnidadDependencia"].ToString();    
                    ViewBag.FechaIngreso = row["FechaIngreso"].ToString();
                    ViewBag.DiagnosticoAlta = row["DiagnosticoAlta"].ToString();
                    ViewBag.Observaciones = row["ObservacionesAlta"].ToString();
                    ViewBag.FechaSalida = row["FechaAlta"].ToString();
                    ViewBag.HoraSalida = row["HoraAlta"].ToString();
                    ViewBag.EstadoSalida = row["EstadoAlta"].ToString();
                }
                else
                {
                    // valores por defecto
                    ViewBag.PacienteNombre = "";
                    ViewBag.GradoParentesco = "";
                    ViewBag.NroCIP = "";
                    ViewBag.Garante = "";
                    ViewBag.Dependencia = "";
                    ViewBag.FechaIngreso = "";
                    ViewBag.DiagnosticoAlta = "";
                    ViewBag.Observaciones = "";
                    ViewBag.FechaSalida = DateTime.Now.ToString("dd/MM/yyyy");
                    ViewBag.HoraSalida = DateTime.Now.ToString("HH:mm");
                }

                ViewBag.Usuario = HttpContext.Session.GetString("usuario") ?? "";
                ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");

                return PartialView("~/Views/Emergencia/Plantillas/PapeletaEgreso.cshtml");
               
            }
            catch (Exception ex)
            {
                return PartialView("~/Views/Emergencia/Plantillas/PapeletaEgreso.cshtml");
            }
        }
    }
}