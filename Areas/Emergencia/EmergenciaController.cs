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
using System.Data;
using System.IO;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using WebAppMaternidad.Areas.Comun;
using static CapaEntidades.Enumerados;
using static CapaEntidades.ListBarItemEnum;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Emergencia
{
    public class EmergenciaController : BaseController
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

        /*[HttpPost]
        public async Task<ActionResult> GenerarConsentimientoProcesosQxPdf(int idCuentaAtencion, int idAtencion, int idServicio, int eval)
        {
            MemoryStream ms = new MemoryStream();
            try
            {
                string rutaFormato = Url.Action(
                    "ConsentimientoProcesosQxFormato",
                    "Emergencia",
                    new { area = "Emergencia", idCuentaAtencion, idAtencion, idServicio, eval },
                    Request?.Scheme ?? "http");

                HtmlToPdf htmlToPdf = new HtmlToPdf();
                PdfPageSize pageSize = (PdfPageSize)Enum.Parse(typeof(PdfPageSize), "A4", true);
                PdfPageOrientation orientation = (PdfPageOrientation)Enum.Parse(typeof(PdfPageOrientation), "Portrait", true);

                htmlToPdf.Options.PdfPageOrientation = orientation;
                htmlToPdf.Options.PdfPageSize = pageSize;
                htmlToPdf.Options.MarginLeft = 20;
                htmlToPdf.Options.MarginRight = 20;
                htmlToPdf.Options.MarginTop = 20;
                htmlToPdf.Options.MarginBottom = 20;
                htmlToPdf.Options.WebPageWidth = 793;
                htmlToPdf.Options.WebPageHeight = 1122;

                PdfDocument pdfDocument = htmlToPdf.ConvertUrl(rutaFormato);
                byte[] pdfBytes = pdfDocument.Save();
                ms.Write(pdfBytes, 0, pdfBytes.Length);
                ms.Position = 0;
                pdfDocument.Close();

                return new FileStreamResult(ms, MediaTypeNames.Application.Pdf);
            }
            catch (Exception ex)
            {
                return Json(new { exep = ex.ToString() });
            }
        }*/

        public async Task<ActionResult> GenerarConsentimientoProcesosQxPdf(int idCuentaAtencion, int idAtencion, int idServicio, int eval)
        {
            FormatoPdf pdf = new FormatoPdf();
            MemoryStream resultStream = new MemoryStream();
            MemoryStream ms = new MemoryStream();
            UtilitarioController utilitario = new UtilitarioController();
            string pageHtml;

            try
            {
                string usuario = HttpContext.Session.GetString("usuario");

                pageHtml = Url.Action(
                    "ConsentimientoProcesosQxFormato",
                    "Emergencia",
                    new { area = "Emergencia", idCuentaAtencion, idAtencion, idServicio, eval, usuario },
                    "http"
                );

                pdf.orientacion = "Portrait"; // igual que tu otro caso
                pdf.tipoDocumento = "A4";     // importante: ya no es Ticket
                pdf.pageHtml = pageHtml;

                pdf.cookies = HttpContext.Request.Headers["Cookie"].ToString();

                    resultStream = await utilitario.GenerarArchivoEnMemoriaPdfV2(pdf);

                byte[] pdfBytes = resultStream.ToArray();
                ms.Write(pdfBytes, 0, pdfBytes.Length);
                ms.Position = 0;
            }
            catch (Exception ex)
            {
                return Json(new { exep = ex.ToString() });
            }

            return new FileStreamResult(ms, MediaTypeNames.Application.Pdf);
        }

        public async Task<ActionResult> GenerarAutorizacionExamenesEspecializadosPdf(int idCuentaAtencion, int idAtencion, int idServicio, int eval)
        {
            FormatoPdf pdf = new FormatoPdf();
            MemoryStream resultStream = new MemoryStream();
            MemoryStream ms = new MemoryStream();
            UtilitarioController utilitario = new UtilitarioController();
            string pageHtml;

            try
            {
                string usuario = HttpContext.Session.GetString("usuario");

                pageHtml = Url.Action(
                    "AutorizacionExamenesEspecializadosFormato",
                    "Emergencia",
                    new { area = "Emergencia", idCuentaAtencion, idAtencion, idServicio, eval, usuario },
                    "http"
                );

                pdf.orientacion = "Portrait";
                pdf.tipoDocumento = "A4";
                pdf.pageHtml = pageHtml;

                pdf.cookies = HttpContext.Request.Headers["Cookie"].ToString();

                    resultStream = await utilitario.GenerarArchivoEnMemoriaPdfV2(pdf);

                byte[] pdfBytes = resultStream.ToArray();
                ms.Write(pdfBytes, 0, pdfBytes.Length);
                ms.Position = 0;
            }
            catch (Exception ex)
            {
                return Json(new { exep = ex.ToString() });
            }

            return new FileStreamResult(ms, MediaTypeNames.Application.Pdf);
        }

        [HttpGet]
        public async Task<IActionResult> AutorizacionExamenesEspecializadosFormato(int idCuentaAtencion, int idAtencion, int idServicio, int eval)
        {
            try
            {
                var daoEvalEmergencia = new DalEvaluacionEmergencia();

                // Llamar al procedimiento centralizado que trae todos los datos necesarios
                var dsAutorizacion = await daoEvalEmergencia.AutorizacionExamenPersonalizado(idCuentaAtencion, idAtencion, idServicio, eval);

                var fechaHoy = DateTime.Now;

                string paciente = "";
                string titular = "";
                string diagnostico = "";
                string procedimiento = "";
                string medico = "";
                string nroHistoria = "";
                string nroCuenta = "";
                string edad = "";
                string sexo = "";
                string servicio = "";
                string nroDocumento = "";
                string cip = "";
                string grado = "";
                string unidadDependencia = "";
                string EsEmergencia = "";
                string EsHospitalizacion = "";
                string EsCE = "";
                string resumen = "";
                string fechaEvaluacion = fechaHoy.ToString("dd/MM/yyyy");
                string horaEvaluacion = fechaHoy.ToString("HH:mm");

                // Extraer datos del DataSet retornado por el procedimiento
                if (dsAutorizacion != null && dsAutorizacion.Tables.Count > 0 && dsAutorizacion.Tables[0].Rows.Count > 0)
                {
                    var row = dsAutorizacion.Tables[0].Rows[0];

                    // Extraer todos los campos del procedimiento almacenado
                    paciente = row.Table.Columns.Contains("Paciente") ? row["Paciente"]?.ToString() ?? "" : "";
                    titular = row.Table.Columns.Contains("Titular") ? row["Titular"]?.ToString() ?? "" : "";
                    diagnostico = row.Table.Columns.Contains("Diagnostico") ? row["Diagnostico"]?.ToString() ?? "" : "";
                    procedimiento = row.Table.Columns.Contains("Procedimiento") ? row["Procedimiento"]?.ToString() ?? "" : "";
                    medico = row.Table.Columns.Contains("Medico") ? row["Medico"]?.ToString() ?? "" : "";
                    nroHistoria = row.Table.Columns.Contains("NroHistoria") ? row["NroHistoria"]?.ToString() ?? "" : "";
                    nroCuenta = row.Table.Columns.Contains("NroCuenta") ? row["NroCuenta"]?.ToString() ?? "" : "";
                    edad = row.Table.Columns.Contains("Edad") ? row["Edad"]?.ToString() ?? "" : "";
                    sexo = row.Table.Columns.Contains("Sexo") ? row["Sexo"]?.ToString() ?? "" : "";
                    servicio = row.Table.Columns.Contains("Servicio") ? row["Servicio"]?.ToString() ?? "" : "";
                    nroDocumento = row.Table.Columns.Contains("NroDocumento") ? row["NroDocumento"]?.ToString() ?? "" : "";
                    cip = row.Table.Columns.Contains("CIP") ? row["CIP"]?.ToString() ?? "" : "";
                    grado = row.Table.Columns.Contains("Grado") ? row["Grado"]?.ToString() ?? "" : "";
                    unidadDependencia = row.Table.Columns.Contains("UnidadDependencia") ? row["UnidadDependencia"]?.ToString() ?? "" : "";
                    EsEmergencia = row.Table.Columns.Contains("EsEmergencia") ? row["EsEmergencia"]?.ToString() ?? "" : "";
                    EsHospitalizacion = row.Table.Columns.Contains("EsHospitalizacion") ? row["EsHospitalizacion"]?.ToString() ?? "" : "";
                    EsCE = row.Table.Columns.Contains("EsCE") ? row["EsCE"]?.ToString() ?? "" : "";
                    resumen= row.Table.Columns.Contains("resumen") ? row["resumen"]?.ToString() ?? "" : "";

                    // Extraer fechas si están disponibles
                    if (row.Table.Columns.Contains("FechaEvaluacion") && !string.IsNullOrEmpty(row["FechaEvaluacion"]?.ToString()))
                    {
                        fechaEvaluacion = row["FechaEvaluacion"]?.ToString() ?? fechaEvaluacion;
                    }

                    if (row.Table.Columns.Contains("HoraEvaluacion") && !string.IsNullOrEmpty(row["HoraEvaluacion"]?.ToString()))
                    {
                        horaEvaluacion = row["HoraEvaluacion"]?.ToString() ?? horaEvaluacion;
                    }
                }

                // Asignar datos a ViewBag para la plantilla
                ViewBag.Paciente = paciente;
                ViewBag.resumen = resumen;
                ViewBag.NroDocumento = nroDocumento;
                ViewBag.Cip = cip;
                ViewBag.Grado = grado;
                ViewBag.Titular = titular;
                ViewBag.Diagnostico = diagnostico;
                ViewBag.Procedimiento = procedimiento;
                ViewBag.Medico = medico;
                ViewBag.NroHistoriaClinica = nroHistoria;
                ViewBag.NroCuenta = nroCuenta;
                ViewBag.Edad = edad;
                ViewBag.Sexo = sexo;
                ViewBag.Servicio = servicio;
                ViewBag.UnidadDependencia = unidadDependencia;
                ViewBag.FechaEvaluacion = fechaEvaluacion;
                ViewBag.HoraEvaluacion = horaEvaluacion;
                ViewBag.Fecha = fechaHoy.ToString("dd/MM/yyyy");
                ViewBag.Hora = fechaHoy.ToString("HH:mm");
                ViewBag.FechaImpresion = fechaHoy.ToString("dd/MM/yyyy HH:mm:ss");
                ViewBag.Usuario = HttpContext.Session.GetString("user") ?? "";
                ViewBag.EsEmergencia = EsEmergencia;
                ViewBag.EsHospitalizacion = EsHospitalizacion;
                ViewBag.EsCE = EsCE;

                return PartialView("~/Views/Emergencia/Plantillas/AutorizacionExamenesEspecializados.cshtml");
            }
            catch (Exception)
            {

                ViewBag.resumen = "";
                ViewBag.Paciente = "";
                ViewBag.Titular = "";
                ViewBag.Diagnostico = "";
                ViewBag.Procedimiento = "";
                ViewBag.Medico = "";
                ViewBag.NroHistoriaClinica = "";
                ViewBag.NroCuenta = "";
                ViewBag.Edad = "";
                ViewBag.Sexo = "";
                ViewBag.Servicio = "";
                ViewBag.FechaEvaluacion = DateTime.Now.ToString("dd/MM/yyyy");
                ViewBag.HoraEvaluacion = DateTime.Now.ToString("HH:mm");
                ViewBag.Fecha = DateTime.Now.ToString("dd/MM/yyyy");
                ViewBag.Hora = DateTime.Now.ToString("HH:mm");
                ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");
                ViewBag.EsEmergencia = "";
                ViewBag.EsHospitalizacion = "";
                ViewBag.EsCE = "";  
                ViewBag.Usuario = HttpContext.Session.GetString("user") ?? "";
                return PartialView("~/Views/Emergencia/Plantillas/AutorizacionExamenesEspecializados.cshtml");
            }
        }

        [HttpGet]
        public async Task<IActionResult> ConsentimientoProcesosQxFormato(int idCuentaAtencion, int idAtencion, int idServicio, int eval)
        {
            try
            {
                var daoEvalEmergencia = new DalEvaluacionEmergencia();
                var daoEvalEspecialidades = new DalEvaluacionEspecialidades();
                var daoAtenciones = new DalAtenciones();
                var dsAt = await Task.Run(() => daoEvalEmergencia.FormatoConsentimientoProcQxEmergencia(idCuentaAtencion));
                var dsEvaluacion = await daoEvalEspecialidades.SeleccionarInformeEvaluacionEmergencia(idAtencion, idServicio, eval, 0);
                var dsDiagnosticos = await daoAtenciones.AtencionesDiagnosticosSeleccionarPorAtencionPorNumeroEvaluacion(
                    idAtencion,
                    (int)Enumerados.TiposDiagnostico.EmergenciaIngreso,
                    idServicio,
                    eval
                );
                var fechaHoy = DateTime.Now;

                string paciente = "";
                string parentesco = "";
                string titular = "";
                string diagnostico = "";
                string procedimiento = "";
                string medico = "";
                string nroHistoria = "";
                string nroCuenta = "";
                string edad = "";
                string sexo = "";
                string servicio = "";

                string nroDocumento = "";
                string cip = "";
                string grado = "";
                string rne = "";
                string cmp = "";
                string nroDocumentoMedico = "";
                
                
                string fechaEvaluacion = fechaHoy.ToString("dd/MM/yyyy");
                string horaEvaluacion = fechaHoy.ToString("HH:mm");

                if (dsAt != null && dsAt.Tables.Count > 0 && dsAt.Tables[0].Rows.Count > 0)
                {
                    var row = dsAt.Tables[0].Rows[0];
                    paciente = row.Table.Columns.Contains("Paciente") ? row["Paciente"]?.ToString() ?? "" : "";
                    parentesco = row.Table.Columns.Contains("Parentesco") ? row["Parentesco"]?.ToString() ?? "" : "";
                    titular = row.Table.Columns.Contains("CIP") ? row["CIP"]?.ToString() ?? "" : "";
                    diagnostico = row.Table.Columns.Contains("Diagnostico") ? row["Diagnostico"]?.ToString() ?? "" : "";
                    medico = row.Table.Columns.Contains("Medico") ? row["Medico"]?.ToString() ?? "" : "";
                    edad = row.Table.Columns.Contains("Edad") ? row["Edad"]?.ToString() ?? "" : "";

                    nroDocumento = row.Table.Columns.Contains("NroDocumento") ? row["NroDocumento"]?.ToString() ?? "" : "";
                    nroDocumentoMedico = row.Table.Columns.Contains("NroDocumentoMedico") ? row["NroDocumentoMedico"]?.ToString() ?? "" : "";
                    cip = row.Table.Columns.Contains("CIP") ? row["CIP"]?.ToString() ?? "" : "";
                    grado = row.Table.Columns.Contains("GradoIntruccion") ? row["GradoIntruccion"]?.ToString() ?? "" : "";
                    servicio = row.Table.Columns.Contains("Servicio") ? row["Servicio"]?.ToString() ?? "" : "";
                    rne = row.Table.Columns.Contains("RNE") ? row["RNE"]?.ToString() ?? "" : "";
                    cmp = row.Table.Columns.Contains("Colegiatura") ? row["Colegiatura"]?.ToString() ?? "" : "";
                    procedimiento = row.Table.Columns.Contains("procedimiento") ? row["procedimiento"]?.ToString() ?? "" : "";
                    
                }

                if (dsEvaluacion != null && dsEvaluacion.Tables.Count > 0 && dsEvaluacion.Tables[0].Rows.Count > 0)
                {
                    var rowEvaluacion = dsEvaluacion.Tables[0].Rows[0];
                    paciente = rowEvaluacion.Table.Columns.Contains("Paciente") ? rowEvaluacion["Paciente"]?.ToString() ?? paciente : paciente;
                    nroCuenta = rowEvaluacion.Table.Columns.Contains("NroCuenta") ? rowEvaluacion["NroCuenta"]?.ToString() ?? "" : "";
                    nroHistoria = rowEvaluacion.Table.Columns.Contains("NroHistoriaClinica") ? rowEvaluacion["NroHistoriaClinica"]?.ToString() ?? "" : "";
                    //edad = rowEvaluacion.Table.Columns.Contains("Edad") ? rowEvaluacion["Edad"]?.ToString() ?? "" : "";
                    sexo = rowEvaluacion.Table.Columns.Contains("Sexo") ? rowEvaluacion["Sexo"]?.ToString() ?? "" : "";
                    //servicio = rowEvaluacion.Table.Columns.Contains("Servicio") ? rowEvaluacion["Servicio"]?.ToString() ?? "" : "";
                    //medico = rowEvaluacion.Table.Columns.Contains("Medico") ? rowEvaluacion["Medico"]?.ToString() ?? medico : medico;
                    fechaEvaluacion = rowEvaluacion.Table.Columns.Contains("FechaEvaluacion") ? rowEvaluacion["FechaEvaluacion"]?.ToString() ?? fechaEvaluacion : fechaEvaluacion;
                    horaEvaluacion = rowEvaluacion.Table.Columns.Contains("HoraEvaluacion") ? rowEvaluacion["HoraEvaluacion"]?.ToString() ?? horaEvaluacion : horaEvaluacion;
                }

                /*if (dsDiagnosticos != null && dsDiagnosticos.Tables.Count > 0 && dsDiagnosticos.Tables[0].Rows.Count > 0)
                {
                    procedimiento = string.Join("; ", dsDiagnosticos.Tables[0].AsEnumerable()
                        .Select(x => x.Table.Columns.Contains("Diagnostico") ? x["Diagnostico"]?.ToString() : "")
                        .Where(x => !string.IsNullOrWhiteSpace(x)));
                }*/

                ViewBag.Paciente = paciente;

                ViewBag.NroDocumento = nroDocumento;
                ViewBag.Cip = cip;
                ViewBag.Grado = grado;
                ViewBag.rne = rne;
                ViewBag.cmp = cmp;
                

                ViewBag.Parentesco = parentesco;
                ViewBag.Titular = titular;
                ViewBag.Diagnostico = diagnostico;
                ViewBag.Procedimiento = procedimiento;
                ViewBag.Medico = medico;
                ViewBag.NroDocumentoMedico = nroDocumentoMedico;
                ViewBag.NroHistoriaClinica = nroHistoria;
                ViewBag.NroCuenta = nroCuenta;
                ViewBag.Edad = edad;
                ViewBag.Sexo = sexo;
                ViewBag.Servicio = servicio;
                ViewBag.FechaEvaluacion = fechaEvaluacion;
                ViewBag.HoraEvaluacion = horaEvaluacion;
                ViewBag.Fecha = fechaHoy.ToString("dd/MM/yyyy");
                ViewBag.Hora = fechaHoy.ToString("HH:mm");
                ViewBag.FechaImpresion = fechaHoy.ToString("dd/MM/yyyy HH:mm:ss");
                ViewBag.Usuario = HttpContext.Session.GetString("user") ?? "";

                return PartialView("~/Views/Emergencia/Plantillas/ConsentimientoProcesosQx.cshtml");
            }
            catch (Exception)
            {
                ViewBag.Paciente = "";
                ViewBag.Parentesco = "";
                ViewBag.Titular = "";
                ViewBag.Diagnostico = "";
                ViewBag.Procedimiento = "";
                ViewBag.Medico = "";
                ViewBag.NroHistoriaClinica = "";
                ViewBag.NroCuenta = "";
                ViewBag.Edad = "";
                ViewBag.Sexo = "";
                ViewBag.Servicio = "";
                ViewBag.FechaEvaluacion = DateTime.Now.ToString("dd/MM/yyyy");
                ViewBag.HoraEvaluacion = DateTime.Now.ToString("HH:mm");
                ViewBag.Fecha = DateTime.Now.ToString("dd/MM/yyyy");
                ViewBag.Hora = DateTime.Now.ToString("HH:mm");
                ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");
                ViewBag.Usuario = HttpContext.Session.GetString("user") ?? "";
                return PartialView("~/Views/Emergencia/Plantillas/ConsentimientoProcesosQx.cshtml");
            }
        }
    }
}