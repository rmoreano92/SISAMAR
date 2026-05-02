using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net.Mime;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using CapaDatos;
using CapaEntidades;
using ClosedXML.Excel;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Razor.Internal;
using SelectPdf;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Reportes
{
    public class ReportesController : BaseController
    {
        private IWebHostEnvironment _hostingEnvironment;

        public ReportesController(IWebHostEnvironment env)
        {
            _hostingEnvironment = env;
        }


        [HttpPost]
        public ActionResult ListaReportes(int idListBar)
        {
            int rsp = 0;
            bool bSesion = true;
            string respuesta = "Error al Listar los reportes.";
            
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                bSesion = false;
                respuesta = "Su sesión a finalizado.";
                return Json(new { respuesta = rsp,  mensaje = respuesta, Session = bSesion });
            };
            DataSet lstReporte = new DataSet();
            try
            {
                
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalReportes daoReportes = new DalReportes();
                lstReporte = daoReportes.ListarReportesbyUsuarioItem(idListBar, idUsuario);
                if (lstReporte.Tables[0].Rows.Count == 0)
                {
                    return Json(new { respuesta = lstReporte.Tables[0].Rows.Count, listReporte= lstReporte, mensaje = "No cuenta con ningun reporte autorizado", Session = bSesion });
                }                
            }
            catch (Exception ex)
            {
                respuesta = "Error al listar los reportes," + ex.Message + ".";
            }
            return Json(new { respuesta = lstReporte.Tables[0].Rows.Count, listReporte = lstReporte, mensaje = respuesta, Session = bSesion });
        }
               
        public async Task<IActionResult> ARCHIVOCLINICO(int idListBar)
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
                ViewBag.Modulo = "Archivo Clínico";
                ViewBag.Area = "Reportes";
                ViewBag.idListBar = idListBar;
                return View("ListarReportes");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        public async Task<IActionResult> CONSULTAEXTERNA(int idListBar)
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
                ViewBag.Modulo = "Consulta Externa";
                ViewBag.Area = "Reportes";
                ViewBag.idListBar = idListBar;
                ViewBag.idTipoServicio =(int)Enumerados.TiposServicio.Consultorios_Externos;
                return View("ListarReportes");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        public async Task<IActionResult> ECONOMIA(int idListBar)
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
                ViewBag.Modulo = "Economia";
                ViewBag.Area = "Reportes";
                ViewBag.idListBar = idListBar;
                ViewBag.idTipoServicio = 0;
                return View("ListarReportes");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        public async Task<IActionResult> EMERGENCIA(int idListBar)
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
                ViewBag.Modulo = "Emergencia";
                ViewBag.Area = "Reportes";
                ViewBag.idListBar = idListBar;
                ViewBag.idTipoServicio = (int)Enumerados.TiposServicio.Consultorios_Emergencia;
                return View("ListarReportes");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        public async Task<IActionResult> FARMACIA(int idListBar)
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
                ViewBag.Modulo = "Farmacia";
                ViewBag.Area = "Reportes";
                ViewBag.idListBar = idListBar;
                ViewBag.idTipoServicio =0;
                return View("ListarReportes");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        public async Task<IActionResult> HERRAMIENTAS(int idListBar)
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
                ViewBag.Modulo = "Herramientas";
                ViewBag.Area = "Reportes";
                ViewBag.idListBar = idListBar;
                ViewBag.idTipoServicio = 0;
                return View("ListarReportes");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        public async Task<IActionResult> HOSPITALIZACION(int idListBar)
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
                ViewBag.Modulo = "Hospitalización";
                ViewBag.Area = "Reportes";
                ViewBag.idListBar = idListBar;
                ViewBag.idTipoServicio = (int)Enumerados.TiposServicio.Hospitalización;
                return View("ListarReportes");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        public async Task<IActionResult> IMAGENOLOGIA(int idListBar)
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
                ViewBag.Modulo = "Imagenología";
                ViewBag.Area = "Reportes";
                ViewBag.idListBar = idListBar;
                ViewBag.idTipoServicio = (int)Enumerados.TiposServicio.ApoyoAsistencial;
                return View("ListarReportes");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        public async Task<IActionResult> LABORATORIO(int idListBar)
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
                ViewBag.Modulo = "Laboratorio";
                ViewBag.Area = "Reportes";
                ViewBag.idListBar = idListBar;
                ViewBag.idTipoServicio = (int)Enumerados.TiposServicio.ApoyoAsistencial;
                return View("ListarReportes");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }
               
        public async Task<IActionResult> Estadistica(int idListBar)
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
                ViewBag.Modulo = "Estadistica";
                ViewBag.Area = "Reportes";
                ViewBag.idListBar = idListBar;
                ViewBag.idTipoServicio = (int)Enumerados.TiposServicio.ProgramasNacionalesSalud;
                return View("ListarReportes");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        public async Task<IActionResult> Telsalud(int idListBar)
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
            ViewBag.Area = "Telesalud";
            return View("ReportesTelesalud");
        }

        public async Task<IActionResult> AtencionesSinAlta(int idListBar)
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
            ViewBag.Area = "Atenciones sin alta";
            return View("ReporteAtencionesSinAlta");
        }

        [HttpPost]
        public ActionResult RetornarFrmReport(String idMenu,int idRpt)
        {
            int rsp = 0;
            bool bSesion = true;
            string respuesta = "Error al Listar los reportes.";

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                bSesion = false;
                respuesta = "Su sesión a finalizado.";
                return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
            };
            return PartialView(idMenu);
        }
        
        [HttpPost]
        public ActionResult ValidaSession()
        {
            bool bSesion = true;
            string respuesta = "Error al Listar los reportes.";

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                bSesion = false;
                respuesta = "Su sesión a finalizado.";
                return Json(new { respuesta = 0, mensaje = respuesta, Session = bSesion });
            };
            return Json(new { respuesta = 0, mensaje = respuesta, Session = bSesion });
        }

        #region Reporte ID_ParteDiarioAtencion
        [HttpGet]
        public async Task<ActionResult> ListarDepartamentos()
        {
            DataSet lstDepartamentos;
            DalUtilitario daoCitas = new DalUtilitario();
            lstDepartamentos =await  daoCitas.DevuelveDSCombo("web_DepartamentosHospitalSeleccionarTodos");
            return Json(lstDepartamentos);
        }
        
        [HttpPost]
        public ActionResult ListarEspecialidadesxIdDepartamento(int idDepartamento)
        {
            DataSet lstEspecialidades;
            DalReportes daoReporte = new DalReportes();
            lstEspecialidades = daoReporte.ListarEspecialidadesxIdDepartamento(idDepartamento);
            return Json(lstEspecialidades);
        }

        [HttpPost]
        public ActionResult ListarServiciosxTipoServicioyIdTipoEspecialidad(int idTipoServicio)
        {
            DataSet lstEspecialidades;
            DalReportes daoReporte = new DalReportes();
            lstEspecialidades = daoReporte.ListarServiciosxTipoServicioyIdTipoEspecialidad(idTipoServicio);
            return Json(lstEspecialidades);
        }


        public IActionResult ParteAtencionDiario(int idTipoServicio,int idDepartamento,int idEspecialidad,int idServicio,int idDestino,  DateTime Fecha)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            using (var workbook = new XLWorkbook())
            {

                var currentRow = 1;
                var FilaIni = 2;
                DalReportes dalRpt = new DalReportes();
                DataSet dsTabla = dalRpt.ParteDiarioAtenciones(idTipoServicio,idDepartamento,idEspecialidad,idServicio,idDestino,Fecha);
                // Listado Dertivaciones 
                var worksheetDerivacion = workbook.Worksheets.Add("Lista parte diario atención");
                for (int i = 0; i < dsTabla.Tables[0].Columns.Count; i++)
                {
                    worksheetDerivacion.Cell(currentRow, i + 1).Value = dsTabla.Tables[0].Columns[i].ColumnName;
                    worksheetDerivacion.Cell(currentRow, i + 1).Style
                        .Border.SetOutsideBorder(XLBorderStyleValues.Dotted)
                        .Font.SetFontColor(XLColor.Gray)
                        .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center)
                        .Fill.SetBackgroundColor(XLColor.BeauBlue)
                        .Font.SetBold(true);
                }
                for (int i = 0; i < dsTabla.Tables[0].Columns.Count; i++)
                {
                    for (int j = 0; j < dsTabla.Tables[0].Rows.Count; j++)
                    {
                        worksheetDerivacion.Cell(FilaIni + j, i + 1).Value = dsTabla.Tables[0].Rows[j][i].ToString();
                    }
                }

                worksheetDerivacion.Rows().AdjustToContents();
                worksheetDerivacion.Columns().AdjustToContents();
                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Reporte_Parte_Diario_Atencion_"+Fecha.ToShortDateString()+".xlsx");
                }
            }
        }
        #endregion

        #region Reportes de Planificacion 
        [HttpGet]
        public async Task<ActionResult> ListarAnios()
        {
            DataSet lstAnios;
            DalUtilitario daoCitas = new DalUtilitario();
            lstAnios = await daoCitas.DevuelveDSCombo("Web_ListarAnios");
            return Json(lstAnios);
        }

        [HttpGet]
        public async Task<ActionResult> ListarMeses()
        {
            DataSet lstMeses;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMeses = await  daoCitas.DevuelveDSCombo("Web_ListarMesesAct");
            return Json(lstMeses);
        }

        public async Task<ActionResult> GenerarReportePPFFConsolidado(String Mes, int idServicio, int idAnio, int idMes, int TipoServicio)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionServicio.xlsx";

            using (var workbookOri = new XLWorkbook(sWebRootFolder))
            {
                var wsHoja1 = workbookOri.Worksheets.First();
                wsHoja1.Cell(3, 7).Value = "INFORME CONSOLIDADO DEL MES DE " + Mes.ToUpper();
                wsHoja1.Cell(2, 14).Value = Mes.ToUpper();
                wsHoja1.Cell(3, 14).Value = idAnio.ToString();
                DataSet lstMetodos;
                DalUtilitario daoMetodos = new DalUtilitario();
                lstMetodos = await daoMetodos.DevuelveDSCombo("Web_ListarMetodosExcel");
                DalPlanificacionFamiliar daoPlani = new DalPlanificacionFamiliar();
                for (int m = 0; m < lstMetodos.Tables[0].Rows.Count; m++)
                {
                    DataSet lstResultado;

                    lstResultado = daoPlani.DevuelveCantidadesInsumosxIdMetodo((int)lstMetodos.Tables[0].Rows[m]["idMetodo"], idServicio, idAnio, idMes, TipoServicio);
                    for (int j = 0; j < lstResultado.Tables[0].Rows.Count; j++)
                    {
                        if (lstResultado.Tables[0].Rows[j]["Descripcion"].ToString() == "Nuevo")
                        {
                            String Rango = lstResultado.Tables[0].Rows[j]["rango"].ToString();
                            switch (Rango)
                            {
                                case "12-17":
                                    wsHoja1.Cell((int)lstMetodos.Tables[0].Rows[m]["FilaAtendidas"], 6).Value = lstResultado.Tables[0].Rows[j]["Cantidad"].ToString();
                                    break;
                                case "18-29":
                                    wsHoja1.Cell((int)lstMetodos.Tables[0].Rows[m]["FilaAtendidas"], 8).Value = lstResultado.Tables[0].Rows[j]["Cantidad"].ToString();
                                    break;
                                case "30-50":
                                    wsHoja1.Cell((int)lstMetodos.Tables[0].Rows[m]["FilaAtendidas"], 10).Value = lstResultado.Tables[0].Rows[j]["Cantidad"].ToString();
                                    break;
                                case ">50":
                                    wsHoja1.Cell((int)lstMetodos.Tables[0].Rows[m]["FilaAtendidas"], 12).Value = lstResultado.Tables[0].Rows[j]["Cantidad"].ToString();
                                    break;
                                default:
                                    break;
                            }
                        }
                        else
                        {
                            String Rango = lstResultado.Tables[0].Rows[j]["rango"].ToString();
                            switch (Rango)
                            {
                                case "12-17":
                                    wsHoja1.Cell((int)lstMetodos.Tables[0].Rows[m]["FilaAtendidas"], 7).Value = lstResultado.Tables[0].Rows[j]["Cantidad"].ToString();
                                    break;
                                case "18-29":
                                    wsHoja1.Cell((int)lstMetodos.Tables[0].Rows[m]["FilaAtendidas"], 9).Value = lstResultado.Tables[0].Rows[j]["Cantidad"].ToString();
                                    break;
                                case "30-50":
                                    wsHoja1.Cell((int)lstMetodos.Tables[0].Rows[m]["FilaAtendidas"], 11).Value = lstResultado.Tables[0].Rows[j]["Cantidad"].ToString();
                                    break;
                                case ">50":
                                    wsHoja1.Cell((int)lstMetodos.Tables[0].Rows[m]["FilaAtendidas"], 13).Value = lstResultado.Tables[0].Rows[j]["Cantidad"].ToString();
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                    for (int k = 0; k < lstResultado.Tables[1].Rows.Count; k++)
                    {
                        if (lstResultado.Tables[1].Rows[k]["Descripcion"].ToString() == "Nuevo")
                        {
                            if ((int)lstMetodos.Tables[0].Rows[m]["FilaInsumos"] > 0)
                            {
                                String Rango = lstResultado.Tables[1].Rows[k]["rango"].ToString();
                                switch (Rango)
                                {
                                    case "12-17":
                                        wsHoja1.Cell((int)lstMetodos.Tables[0].Rows[m]["FilaInsumos"], 6).Value = lstResultado.Tables[1].Rows[k]["Cantidad"].ToString();
                                        break;
                                    case "18-29":
                                        wsHoja1.Cell((int)lstMetodos.Tables[0].Rows[m]["FilaInsumos"], 8).Value = lstResultado.Tables[1].Rows[k]["Cantidad"].ToString();
                                        break;
                                    case "30-50":
                                        wsHoja1.Cell((int)lstMetodos.Tables[0].Rows[m]["FilaInsumos"], 10).Value = lstResultado.Tables[1].Rows[k]["Cantidad"].ToString();
                                        break;
                                    case ">50":
                                        wsHoja1.Cell((int)lstMetodos.Tables[0].Rows[m]["FilaInsumos"], 12).Value = lstResultado.Tables[1].Rows[k]["Cantidad"].ToString();
                                        break;
                                    default:
                                        break;
                                }
                            }

                        }
                        else
                        {
                            String Rango = lstResultado.Tables[1].Rows[k]["rango"].ToString();
                            if ((int)lstMetodos.Tables[0].Rows[m]["FilaInsumos"] > 0)
                            {
                                switch (Rango)
                                {
                                    case "12-17":
                                        wsHoja1.Cell((int)lstMetodos.Tables[0].Rows[m]["FilaInsumos"], 7).Value = lstResultado.Tables[1].Rows[k]["Cantidad"].ToString();
                                        break;
                                    case "18-29":
                                        wsHoja1.Cell((int)lstMetodos.Tables[0].Rows[m]["FilaInsumos"], 9).Value = lstResultado.Tables[1].Rows[k]["Cantidad"].ToString();
                                        break;
                                    case "30-50":
                                        wsHoja1.Cell((int)lstMetodos.Tables[0].Rows[m]["FilaInsumos"], 11).Value = lstResultado.Tables[1].Rows[k]["Cantidad"].ToString();
                                        break;
                                    case ">50":
                                        wsHoja1.Cell((int)lstMetodos.Tables[0].Rows[m]["FilaInsumos"], 13).Value = lstResultado.Tables[1].Rows[k]["Cantidad"].ToString();
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                    }

                    DataSet lstResultadoCaptadas;
                    lstResultadoCaptadas = daoPlani.DevuelveCantidadesUsuCaptadasAtendidosInsumosxMetodo((int)lstMetodos.Tables[0].Rows[m]["idMetodo"], idServicio, idAnio, idMes, TipoServicio);
                    if ((int)lstMetodos.Tables[0].Rows[m]["idMetodo"] > 0)
                    {
                        for (int r = 0; r < lstResultadoCaptadas.Tables[0].Rows.Count; r++)
                        {
                            wsHoja1.Cell((int)lstMetodos.Tables[0].Rows[m]["FilaAtendidas"], 14).Value = lstResultadoCaptadas.Tables[0].Rows[r]["Cantidad"].ToString();

                        }
                        for (int d = 0; d < lstResultadoCaptadas.Tables[1].Rows.Count; d++)
                        {
                            if ((int)lstMetodos.Tables[0].Rows[m]["FilaInsumos"] > 0)
                            {
                                wsHoja1.Cell((int)lstMetodos.Tables[0].Rows[m]["FilaInsumos"], 14).Value = lstResultadoCaptadas.Tables[1].Rows[d]["Cantidad"].ToString();
                            }

                        }
                    }
                    //DevuelveCantidadesUsuCaptadasAtendidosInsumosxMetodo
                }


                DataSet lstResultadoConsejeria;
                lstResultadoConsejeria = daoPlani.DevuelveCantidadesConsejerias(idServicio, idAnio, idMes, TipoServicio);
                for (int p = 0; p < lstResultadoConsejeria.Tables[0].Rows.Count; p++)
                {
                    String Rango = lstResultadoConsejeria.Tables[0].Rows[p]["rango"].ToString();
                    String sexo = lstResultadoConsejeria.Tables[0].Rows[p]["sexo"].ToString();
                    if (sexo == "F")
                    {
                        switch (Rango)
                        {
                            case "12-17":
                                wsHoja1.Cell(35, 3).Value = lstResultadoConsejeria.Tables[0].Rows[p]["Cantidad"].ToString();
                                break;
                            case "18-29":
                                wsHoja1.Cell(35, 5).Value = lstResultadoConsejeria.Tables[0].Rows[p]["Cantidad"].ToString();
                                break;
                            case "30-50":
                                wsHoja1.Cell(35, 7).Value = lstResultadoConsejeria.Tables[0].Rows[p]["Cantidad"].ToString();
                                break;
                            case ">50":
                                wsHoja1.Cell(35, 9).Value = lstResultadoConsejeria.Tables[0].Rows[p]["Cantidad"].ToString();
                                break;
                            default:
                                break;
                        }
                    }
                    else
                    {
                        switch (Rango)
                        {
                            case "12-17":
                                wsHoja1.Cell(35, 4).Value = lstResultadoConsejeria.Tables[0].Rows[p]["Cantidad"].ToString();
                                break;
                            case "18-29":
                                wsHoja1.Cell(35, 6).Value = lstResultadoConsejeria.Tables[0].Rows[p]["Cantidad"].ToString();
                                break;
                            case "30-50":
                                wsHoja1.Cell(35, 8).Value = lstResultadoConsejeria.Tables[0].Rows[p]["Cantidad"].ToString();
                                break;
                            case ">50":
                                wsHoja1.Cell(35, 10).Value = lstResultadoConsejeria.Tables[0].Rows[p]["Cantidad"].ToString();
                                break;
                            default:
                                break;
                        }
                    }
                }


                for (int p = 0; p < lstResultadoConsejeria.Tables[1].Rows.Count; p++)
                {
                    String Rango = lstResultadoConsejeria.Tables[1].Rows[p]["rango"].ToString();
                    String sexo = lstResultadoConsejeria.Tables[1].Rows[p]["sexo"].ToString();
                    if (sexo == "F")
                    {
                        switch (Rango)
                        {
                            case "12-17":
                                wsHoja1.Cell(36, 3).Value = lstResultadoConsejeria.Tables[1].Rows[p]["Cantidad"].ToString();
                                break;
                            case "18-29":
                                wsHoja1.Cell(36, 5).Value = lstResultadoConsejeria.Tables[1].Rows[p]["Cantidad"].ToString();
                                break;
                            case "30-50":
                                wsHoja1.Cell(36, 7).Value = lstResultadoConsejeria.Tables[1].Rows[p]["Cantidad"].ToString();
                                break;
                            case ">50":
                                wsHoja1.Cell(36, 9).Value = lstResultadoConsejeria.Tables[1].Rows[p]["Cantidad"].ToString();
                                break;
                            default:
                                break;
                        }
                    }
                    else
                    {
                        switch (Rango)
                        {
                            case "12-17":
                                wsHoja1.Cell(36, 4).Value = lstResultadoConsejeria.Tables[1].Rows[p]["Cantidad"].ToString();
                                break;
                            case "18-29":
                                wsHoja1.Cell(36, 6).Value = lstResultadoConsejeria.Tables[1].Rows[p]["Cantidad"].ToString();
                                break;
                            case "30-50":
                                wsHoja1.Cell(36, 8).Value = lstResultadoConsejeria.Tables[1].Rows[p]["Cantidad"].ToString();
                                break;
                            case ">50":
                                wsHoja1.Cell(36, 10).Value = lstResultadoConsejeria.Tables[1].Rows[p]["Cantidad"].ToString();
                                break;
                            default:
                                break;
                        }
                    }
                }







                DataSet lstResultadoYuzpe;
                lstResultadoYuzpe = daoPlani.DevuelveCantidadesInsumosxIdMetodoYuzpe(idServicio, idAnio, idMes);
                wsHoja1.Cell(31, 8).Value = lstResultadoYuzpe.Tables[0].Rows[0]["Atendidos"].ToString();
                wsHoja1.Cell(31, 9).Value = lstResultadoYuzpe.Tables[0].Rows[0]["insumos"].ToString();
                wsHoja1.Cell(41, 1).Value = "Fecha :" + DateTime.Now.ToLongDateString();
                using (var stream = new MemoryStream())
                {
                    workbookOri.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ReportePPFFConsolidado.xlsx");
                }
            }
        }
        public IActionResult rptProduccionEstadisticaObstetras(DateTime FechaInicio, DateTime FechaFin, int TipoServicio)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionxObstetras.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                var FilaIni = 11;
                DalReportes dalRpt = new DalReportes();
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DataSet dsTabla = dalRpt.DevuelveProduccionEstadisticaObstetras(idUsuario, FechaInicio, FechaFin, TipoServicio);
                var wsHoja1 = workbook.Worksheets.First();
                for (int j = 0; j < dsTabla.Tables[0].Rows.Count; j++)
                {
                    wsHoja1.Cell(FilaIni + j, 1).Value = dsTabla.Tables[0].Rows[j]["Fila"].ToString();
                    wsHoja1.Cell(FilaIni + j, 2).Value = dsTabla.Tables[0].Rows[j]["HistoriaClinica"].ToString();
                    wsHoja1.Cell(FilaIni + j, 3).Value = dsTabla.Tables[0].Rows[j]["ApellidoPaterno"].ToString();
                    wsHoja1.Cell(FilaIni + j, 4).Value = dsTabla.Tables[0].Rows[j]["ApellidoMaterno"].ToString();
                    wsHoja1.Cell(FilaIni + j, 5).Value = dsTabla.Tables[0].Rows[j]["Nombres"].ToString();
                    wsHoja1.Cell(FilaIni + j, 6).Value = dsTabla.Tables[0].Rows[j]["edad"].ToString();
                    wsHoja1.Cell(FilaIni + j, 7).Value = dsTabla.Tables[0].Rows[j]["FechaIng"].ToString();
                    wsHoja1.Cell(FilaIni + j, 8).Value = dsTabla.Tables[0].Rows[j]["FechaReg"].ToString();
                    wsHoja1.Cell(FilaIni + j, 9).Value = dsTabla.Tables[0].Rows[j]["UsuariaCaptada"].ToString();
                    wsHoja1.Cell(FilaIni + j, 10).Value = dsTabla.Tables[0].Rows[j]["Personal_consejeria"].ToString();
                    wsHoja1.Cell(FilaIni + j, 11).Value = dsTabla.Tables[0].Rows[j]["Especialidad_EmpConsejeria"].ToString();
                    wsHoja1.Cell(FilaIni + j, 12).Value = dsTabla.Tables[0].Rows[j]["metodo"].ToString();
                    wsHoja1.Cell(FilaIni + j, 13).Value = dsTabla.Tables[0].Rows[j]["TipoMetodo"].ToString();
                    wsHoja1.Cell(FilaIni + j, 14).Value = dsTabla.Tables[0].Rows[j]["NroInsumosAdm"].ToString();
                    wsHoja1.Cell(FilaIni + j, 15).Value = dsTabla.Tables[0].Rows[j]["Personal_Administra"].ToString();
                    wsHoja1.Cell(FilaIni + j, 16).Value = dsTabla.Tables[0].Rows[j]["Especialidad_EmpAdministra"].ToString();
                }

                wsHoja1.Cell(FilaIni + dsTabla.Tables[0].Rows.Count + 3, 1).Value = "Fecha :" + DateTime.Now.ToLongDateString();

                for (int l = 0; l < dsTabla.Tables[1].Rows.Count; l++)
                {
                    wsHoja1.Cell(3, 1).Value = dsTabla.Tables[1].Rows[l]["Empleado"].ToString();
                }

                wsHoja1.Cell(2, 15).Value = FechaInicio.ToShortDateString();
                wsHoja1.Cell(3, 15).Value = FechaFin.ToShortDateString();

                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Reporte_ProduccionPPF_Servicio.xlsx");
                }
            }
        }
        public IActionResult rptProduccionEstadisticaGeneral(DateTime FechaInicio, DateTime FechaFin, int idTipoServicio, int idServicio,String TipoServicio,String Servicio)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                var FilaIni = 8;
                DalReportes dalRpt = new DalReportes();
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DataSet dsTabla = dalRpt.ProduccionEstadisticaGeneral(idTipoServicio,idServicio, idUsuario, FechaInicio, FechaFin);
                var wsHoja1 = workbook.Worksheets.First();
                for (int j = 0; j < dsTabla.Tables[0].Rows.Count; j++)
                {
                    wsHoja1.Cell(FilaIni + j, 1).Value = dsTabla.Tables[0].Rows[j]["Fila"].ToString();
                    wsHoja1.Cell(FilaIni + j, 2).Value = dsTabla.Tables[0].Rows[j]["HistoriaClinica"].ToString();
                    wsHoja1.Cell(FilaIni + j, 3).Value = dsTabla.Tables[0].Rows[j]["ApellidoPaterno"].ToString();
                    wsHoja1.Cell(FilaIni + j, 4).Value = dsTabla.Tables[0].Rows[j]["ApellidoMaterno"].ToString();
                    wsHoja1.Cell(FilaIni + j, 5).Value = dsTabla.Tables[0].Rows[j]["Nombres"].ToString();
                    wsHoja1.Cell(FilaIni + j, 6).Value = dsTabla.Tables[0].Rows[j]["edad"].ToString();
                    wsHoja1.Cell(FilaIni + j, 7).Value = dsTabla.Tables[0].Rows[j]["FechaIng"].ToString();
                    wsHoja1.Cell(FilaIni + j, 8).Value = dsTabla.Tables[0].Rows[j]["FechaReg"].ToString();
                    wsHoja1.Cell(FilaIni + j, 9).Value = dsTabla.Tables[0].Rows[j]["UsuariaCaptada"].ToString();
                    wsHoja1.Cell(FilaIni + j, 10).Value = dsTabla.Tables[0].Rows[j]["Personal_consejeria"].ToString();
                    wsHoja1.Cell(FilaIni + j, 11).Value = dsTabla.Tables[0].Rows[j]["Especialidad_EmpConsejeria"].ToString();
                    wsHoja1.Cell(FilaIni + j, 12).Value = dsTabla.Tables[0].Rows[j]["metodo"].ToString();
                    wsHoja1.Cell(FilaIni + j, 13).Value = dsTabla.Tables[0].Rows[j]["TipoMetodo"].ToString();
                    wsHoja1.Cell(FilaIni + j, 14).Value = dsTabla.Tables[0].Rows[j]["NroInsumosAdm"].ToString();
                    wsHoja1.Cell(FilaIni + j, 15).Value = dsTabla.Tables[0].Rows[j]["Personal_Administra"].ToString();
                    wsHoja1.Cell(FilaIni + j, 16).Value = dsTabla.Tables[0].Rows[j]["Especialidad_EmpAdministra"].ToString();
                    wsHoja1.Cell(FilaIni + j, 17).Value = dsTabla.Tables[0].Rows[j]["Personal_registra"].ToString();
                    wsHoja1.Cell(FilaIni + j, 18).Value = dsTabla.Tables[0].Rows[j]["Personal_modifica"].ToString();
                }

                wsHoja1.Cell(FilaIni + dsTabla.Tables[0].Rows.Count + 2, 1).Value = "Fecha :" + DateTime.Now.ToLongDateString();


                wsHoja1.Cell(2, 15).Value = FechaInicio.ToShortDateString();
                wsHoja1.Cell(2, 17).Value = FechaFin.ToShortDateString();
                wsHoja1.Cell(3, 15).Value = TipoServicio;
                if (idServicio == -1) {
                    Servicio = "TODOS";
                }
                wsHoja1.Cell(3, 17).Value = Servicio;



                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Reporte_ProduccionPPF_General.xlsx");
                }
            }
        }
               
        #endregion
        
        #region Reporte de Pacientes x Recepcionar
        public IActionResult PacientesxRecepcionar(DateTime FechaInicio, DateTime FechaFin)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            using (var workbook = new XLWorkbook())
            {

                var currentRow = 1;
                var FilaIni = 2;
                DalReportes dalRpt = new DalReportes();
                DataSet dsTabla = dalRpt.DevuelvePacientesxRecepcionar(FechaInicio,FechaFin);
                // Listado Dertivaciones 
                var worksheetPacientes = workbook.Worksheets.Add("Pacientes por recepcionar");
                for (int i = 0; i < dsTabla.Tables[0].Columns.Count; i++)
                {
                    worksheetPacientes.Cell(currentRow, i + 1).Value = dsTabla.Tables[0].Columns[i].ColumnName;
                    worksheetPacientes.Cell(currentRow, i + 1).Style
                        .Border.SetOutsideBorder(XLBorderStyleValues.Dotted)
                        .Font.SetFontColor(XLColor.Gray)
                        .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center)
                        .Fill.SetBackgroundColor(XLColor.BeauBlue)
                        .Font.SetBold(true);
                }
                for (int i = 0; i < dsTabla.Tables[0].Columns.Count; i++)
                {
                    for (int j = 0; j < dsTabla.Tables[0].Rows.Count; j++)
                    {
                        worksheetPacientes.Cell(FilaIni + j, i + 1).Value = dsTabla.Tables[0].Rows[j][i].ToString();
                    }
                }

                worksheetPacientes.Rows().AdjustToContents();
                worksheetPacientes.Columns().AdjustToContents();
                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Reporte_pacientes_por_recepcionar_" + DateTime.Now.ToShortDateString() + ".xlsx");
                }
            }
        }

        #endregion

        /* RMOREANO RQ0010 */
        #region Reporte de Parte diario de Citas
        [HttpGet]
        public async Task<ActionResult> ListarMedicos()
        {
            DataSet lstmedicos;
            DalUtilitario daoCitas = new DalUtilitario();
            lstmedicos = await daoCitas.DevuelveDSCombo("Web_ListarMedicosObstetrasEnfermeras");
            return Json(lstmedicos);
        }

        public IActionResult ParteDiarioCitas(int idTipoServicio, int idDepartamento, int idEspecialidad, int idServicio, int idDestino, int idMedico, DateTime FechaInicio, DateTime FechaFin)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            using (var workbook = new XLWorkbook())
            {

                var currentRow = 1;
                var FilaIni = 2;
                DalReportes dalRpt = new DalReportes();
                DataSet dsTabla = dalRpt.ParteDiarioCitas(idTipoServicio, idDepartamento, idEspecialidad, idServicio, idDestino,idMedico ,FechaInicio,FechaFin);
                // Listado Dertivaciones 
                var worksheetDerivacion = workbook.Worksheets.Add("Lista parte de citas");
                for (int i = 0; i < dsTabla.Tables[0].Columns.Count; i++)
                {
                    worksheetDerivacion.Cell(currentRow, i + 1).Value = dsTabla.Tables[0].Columns[i].ColumnName;
                    worksheetDerivacion.Cell(currentRow, i + 1).Style
                        .Border.SetOutsideBorder(XLBorderStyleValues.Dotted)
                        .Font.SetFontColor(XLColor.Gray)
                        .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center)
                        .Fill.SetBackgroundColor(XLColor.BeauBlue)
                        .Font.SetBold(true);
                }

                for (int i = 0; i < dsTabla.Tables[0].Columns.Count; i++)
                {
                    for (int j = 0; j < dsTabla.Tables[0].Rows.Count; j++)
                    {
                        worksheetDerivacion.Cell(FilaIni + j, i + 1).Value = dsTabla.Tables[0].Rows[j][i].ToString();
                    }
                }

                worksheetDerivacion.Rows().AdjustToContents();
                worksheetDerivacion.Columns().AdjustToContents();

                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Reporte_Parte_Citas_" + DateTime.Now.ToShortDateString() + ".xlsx");
                }
            }
        }

        public IActionResult ParteDiarioCitasResumido(int idTipoServicio, int idDepartamento, int idEspecialidad, int idServicio, int idDestino, int idMedico, DateTime FechaInicio, DateTime FechaFin)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            using (var workbook = new XLWorkbook())
            {

                var currentRow = 1;
                var FilaIni = 2;
                DalReportes dalRpt = new DalReportes();
                DataSet dsTabla = dalRpt.ParteDiarioCitasResumido(idTipoServicio, idDepartamento, idEspecialidad, idServicio, idDestino, idMedico, FechaInicio, FechaFin);
                // Listado Dertivaciones 
                /*var worksheetDerivacion = workbook.Worksheets.Add("Lista parte de citas");
                for (int i = 0; i < dsTabla.Tables[0].Columns.Count; i++)
                {
                    worksheetDerivacion.Cell(currentRow, i + 1).Value = dsTabla.Tables[0].Columns[i].ColumnName;
                    worksheetDerivacion.Cell(currentRow, i + 1).Style
                        .Border.SetOutsideBorder(XLBorderStyleValues.Dotted)
                        .Font.SetFontColor(XLColor.Gray)
                        .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center)
                        .Fill.SetBackgroundColor(XLColor.BeauBlue)
                        .Font.SetBold(true);
                }

                for (int i = 0; i < dsTabla.Tables[0].Columns.Count; i++)
                {
                    for (int j = 0; j < dsTabla.Tables[0].Rows.Count; j++)
                    {
                        worksheetDerivacion.Cell(FilaIni + j, i + 1).Value = dsTabla.Tables[0].Rows[j][i].ToString();
                    }
                }*/


                var worksheet = workbook.Worksheets.Add("Lista parte de citas");

                int row = 1;

                // 🔷 TITULOS
                worksheet.Cell(row, 1).Value = "CENTRO MEDICO NAVAL";
                worksheet.Range(row, 1, row, 8).Merge().Style
                    .Font.SetBold().Font.SetFontSize(14)
                    .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                row++;

                worksheet.Cell(row, 1).Value = "REPORTE DE CITAS EMITIDAS";
                worksheet.Range(row, 1, row, 8).Merge().Style
                    .Font.SetBold()
                    .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                row++;

                worksheet.Cell(row, 1).Value = $"DEL {FechaInicio:dd/MM/yyyy} AL {FechaFin:dd/MM/yyyy}";
                worksheet.Range(row, 1, row, 8).Merge().Style
                    .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                row += 2;


                var data = dsTabla.Tables[0].AsEnumerable()
                .GroupBy(x => new {
                    Medico = x["MEDICO"].ToString(),
                    Especialidad = x["ESPECIALIDAD"].ToString(),
                    Consultorio = x["CONSULTORIO"].ToString()
                });

                foreach (var grupo in data)
                {
                    // 🔹 CABECERA MEDICO 
                    worksheet.Cell(row, 1).Value = "MEDICO:";
                    worksheet.Cell(row, 2).Value = grupo.Key.Medico;

                    worksheet.Cell(row, 4).Value = "ESPECIALIDAD:";
                    worksheet.Cell(row, 5).Value = grupo.Key.Especialidad;

                    worksheet.Cell(row, 7).Value = "CONSULTORIO:";
                    worksheet.Cell(row, 8).Value = grupo.Key.Consultorio;

                    worksheet.Range(row, 1, row, 8).Style.Font.SetBold();
                    row++;

                    // 🔹 ENCABEZADOS
                    string[] headers = {
                        "PACIENTE", "EDAD","TELEFONO","FECHA", "HORA","TURNO", "F. REGISTRO", "USUARIO"
                    };

                    for (int i = 0; i < headers.Length; i++)
                    {
                        worksheet.Cell(row, i + 1).Value = headers[i];
                        worksheet.Cell(row, i + 1).Style
                            .Fill.SetBackgroundColor(XLColor.LightGray)
                            .Font.SetBold()
                            .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                    }
                    row++;

                    // 🔹 DATA
                    foreach (var item in grupo)
                    {
                        worksheet.Cell(row, 1).Value = item["PACIENTE"]?.ToString();
                        worksheet.Cell(row, 2).Value = item["EDAD"]?.ToString();
                        worksheet.Cell(row, 3).Value = item["TELEFONO"]?.ToString();
                        //worksheet.Cell(row, 4).Value = item["CONSULTORIO"]?.ToString();
                        worksheet.Cell(row, 4).Value = item["FECHA CITA"]?.ToString();
                        worksheet.Cell(row, 5).Value = item["HORA CITA"]?.ToString();
                        worksheet.Cell(row, 6).Value = item["TURNO"]?.ToString();
                        worksheet.Cell(row, 7).Value = item["FECHA REGISTRO"]?.ToString();
                        worksheet.Cell(row, 8).Value = item["USUARIO"]?.ToString();
                        row++;
                    }

                    row++; // espacio entre médicos
                }

                //worksheetDerivacion.Rows().AdjustToContents();
                //worksheetDerivacion.Columns().AdjustToContents();

                var pageSetup = worksheet.PageSetup;

                pageSetup.PageOrientation = XLPageOrientation.Portrait; // 🔹 vertical
                pageSetup.PaperSize = XLPaperSize.A4Paper;

                // 🔥 CLAVE: ajustar solo el ancho a 1 página
                pageSetup.FitToPages(1, 0);



                worksheet.Columns().AdjustToContents();
                worksheet.Rows().AdjustToContents();




                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Reporte_Parte_Citas_" + DateTime.Now.ToShortDateString() + ".xlsx");
                }
            }
        }

        #endregion
        /* RMOREANO RQ0010 */



        //JAYZANOA_080721: Reporte agregado para puerperas
        public IActionResult rptProduccionEstadisticaObstetras2(DateTime FechaInicio, DateTime FechaFin, int TipoServicio)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaReportePuerpera.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                var FilaIni = 6;
                DalReportes dalRpt = new DalReportes();
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                //DataSet dsTabla = dalRpt.DevuelveProduccionEstadisticaObstetras(idUsuario, FechaInicio, FechaFin, TipoServicio);
                DataSet dsTabla = dalRpt.DevuelveProduccionEstadisticaObstetras2(idUsuario, FechaInicio, FechaFin, TipoServicio);
                var wsHoja1 = workbook.Worksheets.First();
                for (int j = 0; j < dsTabla.Tables[0].Rows.Count; j++)
                {
                    wsHoja1.Cell(FilaIni + j, 1).Value = dsTabla.Tables[0].Rows[j]["IdCuentaAtencion"].ToString();
                    wsHoja1.Cell(FilaIni + j, 2).Value = dsTabla.Tables[0].Rows[j]["NroHistoriaClinica"].ToString();
                    wsHoja1.Cell(FilaIni + j, 3).Value = dsTabla.Tables[0].Rows[j]["ApellidoPaterno"].ToString();
                    wsHoja1.Cell(FilaIni + j, 4).Value = dsTabla.Tables[0].Rows[j]["ApellidoMaterno"].ToString();
                    wsHoja1.Cell(FilaIni + j, 5).Value = dsTabla.Tables[0].Rows[j]["PrimerNombre"].ToString();
                    wsHoja1.Cell(FilaIni + j, 6).Value = dsTabla.Tables[0].Rows[j]["SegundoNombre"].ToString();
                    wsHoja1.Cell(FilaIni + j, 7).Value = dsTabla.Tables[0].Rows[j]["Telefono"].ToString();
                    wsHoja1.Cell(FilaIni + j, 8).Value = dsTabla.Tables[0].Rows[j]["Edad"].ToString();
                    wsHoja1.Cell(FilaIni + j, 9).Value = dsTabla.Tables[0].Rows[j]["FechaIngreso"].ToString();
                    wsHoja1.Cell(FilaIni + j, 10).Value = dsTabla.Tables[0].Rows[j]["FechaEgresoAdministrativo"].ToString();
                    wsHoja1.Cell(FilaIni + j, 11).Value = dsTabla.Tables[0].Rows[j]["IdTipoServicioDescripcion"].ToString();
                    wsHoja1.Cell(FilaIni + j, 12).Value = dsTabla.Tables[0].Rows[j]["ServicioIngresoDescripcion"].ToString();
                    wsHoja1.Cell(FilaIni + j, 13).Value = dsTabla.Tables[0].Rows[j]["ServicioEgresoDescripcion"].ToString();
                    wsHoja1.Cell(FilaIni + j, 14).Value = dsTabla.Tables[0].Rows[j]["idFuenteFinanciamientoDescripcion"].ToString();
                    wsHoja1.Cell(FilaIni + j, 15).Value = dsTabla.Tables[0].Rows[j]["TipoProcedimiento"].ToString();
                }


                wsHoja1.Cell(FilaIni + dsTabla.Tables[0].Rows.Count + 3, 2).Value = "Fecha : " + DateTime.Now.ToLongDateString().ToUpper();

                //for (int l = 0; l < dsTabla.Tables[1].Rows.Count; l++)
                //{
                //    wsHoja1.Cell(3, 1).Value = dsTabla.Tables[1].Rows[l]["Empleado"].ToString();
                //}

                wsHoja1.Cell(2, 2).Value = FechaInicio.ToShortDateString();
                wsHoja1.Cell(3, 2).Value = FechaFin.ToShortDateString();

                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Reporte_Alta_Puerperas.xlsx");
                }
            }
        }

        //JAYZANOA_080721: Reporte de atenciones data bruta
        public IActionResult rptProduccionEstadisticaGeneral2(DateTime FechaInicio, DateTime FechaFin, int idTipoServicio, int idServicio, String TipoServicio, String Servicio)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
            sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF2.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                var FilaIni = 8;
                DalReportes dalRpt = new DalReportes();
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DataSet dsTabla = dalRpt.ProduccionEstadisticaGeneral2(idTipoServicio, idServicio, idUsuario, FechaInicio, FechaFin);
                var wsHoja1 = workbook.Worksheets.First();
                for (int j = 0; j < dsTabla.Tables[0].Rows.Count; j++)
                {
                    /*
                    wsHoja1.Cell(FilaIni + j, 1).Value = dsTabla.Tables[0].Rows[j]["Fila"].ToString();
                    wsHoja1.Cell(FilaIni + j, 2).Value = dsTabla.Tables[0].Rows[j]["HistoriaClinica"].ToString();
                    wsHoja1.Cell(FilaIni + j, 3).Value = dsTabla.Tables[0].Rows[j]["ApellidoPaterno"].ToString();
                    wsHoja1.Cell(FilaIni + j, 4).Value = dsTabla.Tables[0].Rows[j]["ApellidoMaterno"].ToString();
                    wsHoja1.Cell(FilaIni + j, 5).Value = dsTabla.Tables[0].Rows[j]["Nombres"].ToString();
                    wsHoja1.Cell(FilaIni + j, 6).Value = dsTabla.Tables[0].Rows[j]["edad"].ToString();
                    wsHoja1.Cell(FilaIni + j, 7).Value = dsTabla.Tables[0].Rows[j]["FechaIng"].ToString();
                    wsHoja1.Cell(FilaIni + j, 8).Value = dsTabla.Tables[0].Rows[j]["FechaReg"].ToString();
                    wsHoja1.Cell(FilaIni + j, 9).Value = dsTabla.Tables[0].Rows[j]["UsuariaCaptada"].ToString();
                    wsHoja1.Cell(FilaIni + j, 10).Value = dsTabla.Tables[0].Rows[j]["Personal_consejeria"].ToString();
                    wsHoja1.Cell(FilaIni + j, 11).Value = dsTabla.Tables[0].Rows[j]["Especialidad_EmpConsejeria"].ToString();
                    wsHoja1.Cell(FilaIni + j, 12).Value = dsTabla.Tables[0].Rows[j]["metodo"].ToString();
                    wsHoja1.Cell(FilaIni + j, 13).Value = dsTabla.Tables[0].Rows[j]["TipoMetodo"].ToString();
                    wsHoja1.Cell(FilaIni + j, 14).Value = dsTabla.Tables[0].Rows[j]["NroInsumosAdm"].ToString();
                    wsHoja1.Cell(FilaIni + j, 15).Value = dsTabla.Tables[0].Rows[j]["Personal_Administra"].ToString();
                    wsHoja1.Cell(FilaIni + j, 16).Value = dsTabla.Tables[0].Rows[j]["Especialidad_EmpAdministra"].ToString();
                    wsHoja1.Cell(FilaIni + j, 17).Value = dsTabla.Tables[0].Rows[j]["Personal_registra"].ToString();
                    wsHoja1.Cell(FilaIni + j, 18).Value = dsTabla.Tables[0].Rows[j]["Personal_modifica"].ToString();
                    */
                    wsHoja1.Cell(FilaIni + j, 1).Value = dsTabla.Tables[0].Rows[j]["Fila"].ToString();
                    wsHoja1.Cell(FilaIni + j, 2).Value = dsTabla.Tables[0].Rows[j]["HistoriaClinica"].ToString();
                    wsHoja1.Cell(FilaIni + j, 3).Value = dsTabla.Tables[0].Rows[j]["IdCuentaAtencion"].ToString();
                    wsHoja1.Cell(FilaIni + j, 4).Value = dsTabla.Tables[0].Rows[j]["TipoDoc"].ToString();
                    wsHoja1.Cell(FilaIni + j, 5).Value = dsTabla.Tables[0].Rows[j]["DocumentoPaciente"].ToString();


                    wsHoja1.Cell(FilaIni + j, 6).Value = dsTabla.Tables[0].Rows[j]["ApellidoPaterno"].ToString();
                    wsHoja1.Cell(FilaIni + j, 7).Value = dsTabla.Tables[0].Rows[j]["ApellidoMaterno"].ToString();
                    wsHoja1.Cell(FilaIni + j, 8).Value = dsTabla.Tables[0].Rows[j]["Nombres"].ToString();
                    wsHoja1.Cell(FilaIni + j, 9).Value = dsTabla.Tables[0].Rows[j]["edad"].ToString();


                    wsHoja1.Cell(FilaIni + j, 10).Value = dsTabla.Tables[0].Rows[j]["TipoServicio"].ToString();
                    wsHoja1.Cell(FilaIni + j, 11).Value = dsTabla.Tables[0].Rows[j]["CodigoEstadoUsuaria"].ToString();
                    wsHoja1.Cell(FilaIni + j, 12).Value = dsTabla.Tables[0].Rows[j]["estadousuaria"].ToString();
                    wsHoja1.Cell(FilaIni + j, 13).Value = dsTabla.Tables[0].Rows[j]["NroControl"].ToString();
                    wsHoja1.Cell(FilaIni + j, 14).Value = dsTabla.Tables[0].Rows[j]["CodigoRiesgoReproductivo"].ToString();
                    wsHoja1.Cell(FilaIni + j, 15).Value = dsTabla.Tables[0].Rows[j]["RiesgoReproductivo"].ToString();
                    wsHoja1.Cell(FilaIni + j, 16).Value = dsTabla.Tables[0].Rows[j]["CondicionServicio"].ToString();
                    wsHoja1.Cell(FilaIni + j, 17).Value = dsTabla.Tables[0].Rows[j]["CondicionEstablecimiento"].ToString();


                    wsHoja1.Cell(FilaIni + j, 18).Value = dsTabla.Tables[0].Rows[j]["FechaIng"].ToString();
                    wsHoja1.Cell(FilaIni + j, 19).Value = dsTabla.Tables[0].Rows[j]["FechaEgreAdmi"].ToString();
                    wsHoja1.Cell(FilaIni + j, 20).Value = dsTabla.Tables[0].Rows[j]["FechaReg"].ToString();

                    wsHoja1.Cell(FilaIni + j, 21).Value = dsTabla.Tables[0].Rows[j]["UsuariaCaptada"].ToString();


                    wsHoja1.Cell(FilaIni + j, 22).Value = dsTabla.Tables[0].Rows[j]["CodigoEstadoUsuaria"].ToString();
                    wsHoja1.Cell(FilaIni + j, 23).Value = dsTabla.Tables[0].Rows[j]["estadousuaria"].ToString();
                    wsHoja1.Cell(FilaIni + j, 24).Value = dsTabla.Tables[0].Rows[j]["CodigoMetodoRetirado"].ToString();
                    wsHoja1.Cell(FilaIni + j, 25).Value = dsTabla.Tables[0].Rows[j]["MetodoReitrado"].ToString();
                    wsHoja1.Cell(FilaIni + j, 26).Value = dsTabla.Tables[0].Rows[j]["CodigoMetodoEfec"].ToString();
                    wsHoja1.Cell(FilaIni + j, 27).Value = dsTabla.Tables[0].Rows[j]["MetodoEfec"].ToString();
                    wsHoja1.Cell(FilaIni + j, 28).Value = dsTabla.Tables[0].Rows[j]["CodigoEfectoSec"].ToString();
                    wsHoja1.Cell(FilaIni + j, 29).Value = dsTabla.Tables[0].Rows[j]["EfectoSec"].ToString();
                    wsHoja1.Cell(FilaIni + j, 30).Value = dsTabla.Tables[0].Rows[j]["CodigoFalla"].ToString();
                    wsHoja1.Cell(FilaIni + j, 31).Value = dsTabla.Tables[0].Rows[j]["Falla"].ToString();


                    wsHoja1.Cell(FilaIni + j, 32).Value = dsTabla.Tables[0].Rows[j]["TipoServicio"].ToString();
                    wsHoja1.Cell(FilaIni + j, 33).Value = dsTabla.Tables[0].Rows[j]["Servicio"].ToString();
                    wsHoja1.Cell(FilaIni + j, 34).Value = dsTabla.Tables[0].Rows[j]["Personal_consejeria"].ToString();
                    wsHoja1.Cell(FilaIni + j, 35).Value = dsTabla.Tables[0].Rows[j]["Especialidad_EmpConsejeria"].ToString();

                    wsHoja1.Cell(FilaIni + j, 36).Value = dsTabla.Tables[0].Rows[j]["CodigoMetodo"].ToString();
                    wsHoja1.Cell(FilaIni + j, 37).Value = dsTabla.Tables[0].Rows[j]["metodo"].ToString();
                    wsHoja1.Cell(FilaIni + j, 38).Value = dsTabla.Tables[0].Rows[j]["TipoMetodo"].ToString();
                    wsHoja1.Cell(FilaIni + j, 39).Value = dsTabla.Tables[0].Rows[j]["NroInsumosAdm"].ToString();
                    wsHoja1.Cell(FilaIni + j, 40).Value = dsTabla.Tables[0].Rows[j]["Personal_Administra"].ToString();
                    wsHoja1.Cell(FilaIni + j, 41).Value = dsTabla.Tables[0].Rows[j]["Especialidad_EmpAdministra"].ToString();
                    wsHoja1.Cell(FilaIni + j, 42).Value = dsTabla.Tables[0].Rows[j]["Personal_registra"].ToString();
                    wsHoja1.Cell(FilaIni + j, 43).Value = dsTabla.Tables[0].Rows[j]["Personal_modifica"].ToString();
                    
                }

                wsHoja1.Cell(FilaIni + dsTabla.Tables[0].Rows.Count + 2, 1).Value = "Fecha :" + DateTime.Now.ToLongDateString();


                wsHoja1.Cell(2, 40).Value = FechaInicio.ToShortDateString();
                wsHoja1.Cell(2, 42).Value = FechaFin.ToShortDateString();
                wsHoja1.Cell(3, 40).Value = TipoServicio;
                if (idServicio == -1)
                {
                    Servicio = "TODOS";
                }
                wsHoja1.Cell(3, 42).Value = Servicio;



                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Reporte_AtencionesPPFF_DataBruta.xlsx");
                }
            }
        }


        /*======================REPORTE TIPO DE CONDICIÓN DEL PACIENTE AL ESTABLECIMIENTO (KHOYOSI)===========================*/
        public IActionResult rptCondicionEstablecimientoPacienteCE(DateTime FechaInicio, DateTime FechaFin)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaReporteCondicionEstablecimientoPacienteCE.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                var FilaIni = 6;
                DalReportes dalRpt = new DalReportes();
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                //DataSet dsTabla = dalRpt.DevuelveProduccionEstadisticaObstetras(idUsuario, FechaInicio, FechaFin, TipoServicio);
                DataSet dsTabla = dalRpt.DevuelveCondicionEstablecimientoCE(idUsuario, FechaInicio, FechaFin);
                var wsHoja1 = workbook.Worksheets.First();
                for (int j = 0; j < dsTabla.Tables[0].Rows.Count; j++)
                {
                    wsHoja1.Cell(FilaIni + j, 1).Value = dsTabla.Tables[0].Rows[j]["IdCuentaAtencion"].ToString();
                    wsHoja1.Cell(FilaIni + j, 2).Value = dsTabla.Tables[0].Rows[j]["NroHistoriaClinica"].ToString();
                    wsHoja1.Cell(FilaIni + j, 3).Value = dsTabla.Tables[0].Rows[j]["ApellidoPaterno"].ToString();
                    wsHoja1.Cell(FilaIni + j, 4).Value = dsTabla.Tables[0].Rows[j]["ApellidoMaterno"].ToString();
                    wsHoja1.Cell(FilaIni + j, 5).Value = dsTabla.Tables[0].Rows[j]["Nombres"].ToString();                    
                    wsHoja1.Cell(FilaIni + j, 6).Value = dsTabla.Tables[0].Rows[j]["Telefono"].ToString();                    
                    wsHoja1.Cell(FilaIni + j, 7).Value = dsTabla.Tables[0].Rows[j]["FechaIngreso"].ToString();
                    wsHoja1.Cell(FilaIni + j, 8).Value = dsTabla.Tables[0].Rows[j]["HoraIngreso"].ToString();
                    wsHoja1.Cell(FilaIni + j, 9).Value = dsTabla.Tables[0].Rows[j]["ServicioIngreso"].ToString();
                    wsHoja1.Cell(FilaIni + j, 10).Value = dsTabla.Tables[0].Rows[j]["FuenteFinanciamiento"].ToString();
                    wsHoja1.Cell(FilaIni + j, 11).Value = dsTabla.Tables[0].Rows[j]["CondicionEstablecimiento"].ToString();
                }


                wsHoja1.Cell(FilaIni + dsTabla.Tables[0].Rows.Count + 3, 2).Value = "Fecha : " + DateTime.Now.ToLongDateString().ToUpper();

                //for (int l = 0; l < dsTabla.Tables[1].Rows.Count; l++)
                //{
                //    wsHoja1.Cell(3, 1).Value = dsTabla.Tables[1].Rows[l]["Empleado"].ToString();
                //}

                wsHoja1.Cell(2, 2).Value = FechaInicio.ToShortDateString();
                wsHoja1.Cell(3, 2).Value = FechaFin.ToShortDateString();

                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Reporte_Condicion_Establecimiento_CE.xlsx");
                }
            }
        }
        /*==========================================================================================================*/


        public async Task<IActionResult> rptTeleconsulta(DateTime fechaInicio, DateTime fechaFin)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
            sWebRootFolder = sWebRootFolder + "/Plantilla/TeleconsultaAtencion.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                //var FilaIni = 4;
                DalReportes dalReportes = new DalReportes();
                //int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet dataSet = await dalReportes.rptTeleconsultaAtenciones(fechaInicio, fechaFin);

                var wsHoja1 = workbook.Worksheets.First();

                //wsHoja1.Cell(2, 5).Value = dsCabeceraICI.Tables[0].Rows[0]["Ventas"].ToString();
                //wsHoja1.Cell(2, 7).Value = dsCabeceraICI.Tables[0].Rows[0]["Sis"].ToString();
                //wsHoja1.Cell(2, 9).Value = dsCabeceraICI.Tables[0].Rows[0]["IntervSan"].ToString();


                //wsHoja1.Cell(4, 1).InsertData(dsSaldosFarmAlmacen.Tables[0]);
                wsHoja1.Cell(2, 1).InsertTable(dataSet.Tables[0]);


                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "SaldosPorAlmacen.xlsx");
                }
            }
        }

        public async Task<IActionResult> rptTelesalud(DateTime fechaInicio, DateTime fechaFin)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
            sWebRootFolder = sWebRootFolder + "/Plantilla/TelesaludAtencion.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                //var FilaIni = 4;
                DalReportes dalReportes = new DalReportes();
                //int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet dataSet = await dalReportes.rptTelesaludAtenciones(fechaInicio, fechaFin);

                var wsHoja1 = workbook.Worksheets.First();

                //wsHoja1.Cell(2, 5).Value = dsCabeceraICI.Tables[0].Rows[0]["Ventas"].ToString();
                //wsHoja1.Cell(2, 7).Value = dsCabeceraICI.Tables[0].Rows[0]["Sis"].ToString();
                //wsHoja1.Cell(2, 9).Value = dsCabeceraICI.Tables[0].Rows[0]["IntervSan"].ToString();


                //wsHoja1.Cell(4, 1).InsertData(dsSaldosFarmAlmacen.Tables[0]);
                wsHoja1.Cell(2, 1).InsertTable(dataSet.Tables[0]);


                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "SaldosPorAlmacen.xlsx");
                }
            }
        }


        [HttpGet]
        public async Task<ActionResult> ListarAtencionesFuaParaMigracion(int TipoReporte)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalReportes dalReportes = new DalReportes();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalReportes.ReporteAtencionesSinAltaMedicaAdministrativa(TipoReporte);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        public async Task<IActionResult> rptAtencionesSinAlta(int TipoReporte)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
            sWebRootFolder = sWebRootFolder + "/Plantilla/rptAtencionesSinAlta.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                //var FilaIni = 4;
                DalReportes dalReportes = new DalReportes();
                //int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet dataSet = await dalReportes.ReporteAtencionesSinAltaMedicaAdministrativa(TipoReporte);

                var wsHoja1 = workbook.Worksheets.First();

                //wsHoja1.Cell(2, 5).Value = dsCabeceraICI.Tables[0].Rows[0]["Ventas"].ToString();
                //wsHoja1.Cell(2, 7).Value = dsCabeceraICI.Tables[0].Rows[0]["Sis"].ToString();
                //wsHoja1.Cell(2, 9).Value = dsCabeceraICI.Tables[0].Rows[0]["IntervSan"].ToString();

                if(TipoReporte == 1)
                {
                    wsHoja1.Cell(1, 1).Value = "ATENCIONES SIN ALTA ADMINISTRATIVA";
                }

                if (TipoReporte == 2)
                {
                    wsHoja1.Cell(1, 1).Value = "ATENCIONES SIN ALTA MÉDICA";
                }



                //wsHoja1.Cell(4, 1).InsertData(dsSaldosFarmAlmacen.Tables[0]);
                wsHoja1.Cell(2, 1).InsertTable(dataSet.Tables[0]);


                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "SaldosPorAlmacen.xlsx");
                }
            }
        }

        [HttpPost]
        public async Task<IActionResult> ReporteTableroUnidadSeguro(string FechaInicio)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            sWebRootFolder = sWebRootFolder + "/Plantilla/Sis/PlantillaReporteIndicadores.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                DalReportes dalReportes = new DalReportes();
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                //DataSet dsTabla = dalRpt.DevuelveProduccionEstadisticaObstetras(idUsuario, FechaInicio, FechaFin, TipoServicio);
                DataSet dsTabla = await dalReportes.ReporteTableroUnidadSeguros(idUsuario, FechaInicio);
                var wsHoja1 = workbook.Worksheets.First();

                wsHoja1.Cell(11, 3).Value = dsTabla.Tables[0].Rows[0]["Total"].ToString();
                wsHoja1.Cell(12, 3).Value = dsTabla.Tables[0].Rows[1]["Total"].ToString();
                wsHoja1.Cell(13, 3).Value = dsTabla.Tables[0].Rows[2]["Total"].ToString();
                wsHoja1.Cell(14, 3).Value = dsTabla.Tables[0].Rows[3]["Total"].ToString();
                //for (int j = 0; j < dsTabla.Tables[0].Rows.Count; j++)
                //{
                //    //wsHoja1.Cell(FilaIni + j, 1).Value = j + 1;
                //    //wsHoja1.Cell(FilaIni + j, 2).Value = dsTabla.Tables[0].Rows[j]["NroHistoriaMadre"].ToString();
                //    wsHoja1.Cell(FilaIni + j, 3).Value = dsTabla.Tables[0].Rows[j]["ApPaternoMadre"].ToString();

                //}


                wsHoja1.Cell(16 + dsTabla.Tables[0].Rows.Count + 3, 2).Value = "Fecha : " + DateTime.Now.ToLongDateString().ToUpper();

                //for (int l = 0; l < dsTabla.Tables[1].Rows.Count; l++)
                //{
                //    wsHoja1.Cell(3, 1).Value = dsTabla.Tables[1].Rows[l]["Empleado"].ToString();
                //}

                wsHoja1.Cell(7, 1).Value = "DEL " + FechaInicio.ToString();
                //wsHoja1.Cell(3, 2).Value = FechaFin.ToShortDateString();

                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Reporte_Tablero_Unidad_Seguros.xlsx");
                }
            }
        }


        /// <summary>
        /// Reporte Triados en módulo Emergencia
        /// </summary>
        /// <param name="fechaInicio"></param>
        /// <param name="fechaFin"></param>
        /// <param name="horaInicio"></param>
        /// <param name="horaFin"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> ReporteTriadosEmergencia(string fechaInicio, string fechaFin, string horaInicio, string horaFin)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Unauthorized();
            }

            if (string.IsNullOrWhiteSpace(fechaInicio) || string.IsNullOrWhiteSpace(fechaFin) || string.IsNullOrWhiteSpace(horaInicio) || string.IsNullOrWhiteSpace(horaFin))
            {
                return BadRequest("Debe ingresar fecha y hora de inicio/fin.");
            }

            DalReportes dalRpt = new DalReportes();
            DataSet dsTriados = await dalRpt.ReporteTriadosEmergencia(fechaInicio, fechaFin, horaInicio, horaFin);

            if (dsTriados == null || dsTriados.Tables.Count == 0 || dsTriados.Tables[0].Rows.Count == 0)
            {
                return NoContent();
            }

            string fechaInicioCabecera = dsTriados.Tables[0].Rows[0]["FechaInicioCabecera"].ToString();
            string fechaFinCabecera = dsTriados.Tables[0].Rows[0]["FechaFinCabecera"].ToString();

            using (var workbook = new XLWorkbook())
            {
                var ws = workbook.Worksheets.Add("Reporte de triados");

                ws.Cell("A1").Value = "CENTRO MEDICO NAVAL";
                ws.Range("A1:J1").Merge();
                ws.Cell("A1").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                ws.Cell("A1").Style.Font.Bold = true;
                ws.Cell("A1").Style.Font.FontSize = 13;

                ws.Cell("A2").Value = "REPORTE DE TRIADOS - EMERGENCIA";
                ws.Range("A2:J2").Merge();
                ws.Cell("A2").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                ws.Cell("A2").Style.Font.Bold = true;

                ws.Cell("A3").Value = $"DEL {fechaInicioCabecera} AL {fechaFinCabecera}";
                ws.Range("A3:J3").Merge();
                ws.Cell("A3").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                ws.Cell("A3").Style.Font.Bold = true;

                ws.Cell("A5").Value = "HORA INICIO:";
                ws.Cell("B5").Value = horaInicio;
                ws.Cell("D5").Value = "HORA FIN:";
                ws.Cell("E5").Value = horaFin;

                ws.Cell("A6").Value = "N°";
                ws.Cell("B6").Value = "DNI";
                ws.Cell("C6").Value = "CIP";
                ws.Cell("D6").Value = "PACIENTE";
                ws.Cell("E6").Value = "EDAD";
                ws.Cell("F6").Value = "TELEFONO";
                ws.Cell("G6").Value = "SERVICIO";
                ws.Cell("H6").Value = "FECHA";
                ws.Cell("I6").Value = "HORA";
                ws.Cell("J6").Value = "USUARIO";
                ws.Cell("K6").Value = "PRIORIDAD";
                ws.Cell("L6").Value = "TIEMPO ATENCION";

                ws.Range("A6:L6").Style.Font.Bold = true;
                ws.Range("A6:L6").Style.Fill.BackgroundColor = XLColor.LightGray;
                ws.Range("A6:L6").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                ws.Range("A6:L6").Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                ws.Range("A6:L6").Style.Border.InsideBorder = XLBorderStyleValues.Thin;

                int fila = 7;
                foreach (DataRow row in dsTriados.Tables[0].Rows)
                {
                    ws.Cell(fila, 1).Value = row["Numero"].ToString();
                    ws.Cell(fila, 2).Value = row["Dni"].ToString();
                    ws.Cell(fila, 3).Value = row["Cip"].ToString();
                    ws.Cell(fila, 4).Value = row["Paciente"].ToString();
                    ws.Cell(fila, 5).Value = row["Edad"].ToString();
                    ws.Cell(fila, 6).Value = row["Telefono"].ToString();
                    ws.Cell(fila, 7).Value = row["Servicio"].ToString();
                    ws.Cell(fila, 8).Value = row["Fecha"].ToString();
                    ws.Cell(fila, 9).Value = row["Hora"].ToString();
                    ws.Cell(fila, 10).Value = row["Usuario"].ToString();
                    ws.Cell(fila, 11).Value = row["Prioridad"].ToString();
                    ws.Cell(fila, 12).Value = row["Tiempo"].ToString();
                    fila++;
                }

                if (fila > 7)
                {
                    ws.Range($"A7:L{fila - 1}").Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                    ws.Range($"A7:L{fila - 1}").Style.Border.InsideBorder = XLBorderStyleValues.Thin;
                }

                ws.Columns().AdjustToContents();

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Reporte_Triados_Emergencia.xlsx");
                }
            }
        }

        /// <summary>
        /// Reporte de admitidos en módulo Emergencia
        /// </summary>
        /// <param name="fechaInicio"></param>
        /// <param name="fechaFin"></param>
        /// <param name="horaInicio"></param>
        /// <param name="horaFin"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> ReporteAdmitidosEmergencia(string fechaInicio, string fechaFin, string horaInicio, string horaFin)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Unauthorized();
            }

            if (string.IsNullOrWhiteSpace(fechaInicio) || string.IsNullOrWhiteSpace(fechaFin) || string.IsNullOrWhiteSpace(horaInicio) || string.IsNullOrWhiteSpace(horaFin))
            {
                return BadRequest("Debe ingresar fecha y hora de inicio/fin.");
            }

            DalReportes dalRpt = new DalReportes();
            DataSet dsAdmitidos = await dalRpt.ReporteAdmitidosEmergencia(fechaInicio, fechaFin, horaInicio, horaFin);

            if (dsAdmitidos == null || dsAdmitidos.Tables.Count == 0 || dsAdmitidos.Tables[0].Rows.Count == 0)
            {
                return NoContent();
            }

            string fechaInicioCabecera = dsAdmitidos.Tables[0].Rows[0]["FechaInicioCabecera"].ToString();
            string fechaFinCabecera = dsAdmitidos.Tables[0].Rows[0]["FechaFinCabecera"].ToString();

            using (var workbook = new XLWorkbook())
            {
                var ws = workbook.Worksheets.Add("Reporte de admitidos");

                ws.Cell("A1").Value = "CENTRO MEDICO NAVAL";
                ws.Range("A1:J1").Merge();
                ws.Cell("A1").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                ws.Cell("A1").Style.Font.Bold = true;
                ws.Cell("A1").Style.Font.FontSize = 13;

                ws.Cell("A2").Value = "REPORTE DE ADMITIDOS - EMERGENCIA";
                ws.Range("A2:J2").Merge();
                ws.Cell("A2").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                ws.Cell("A2").Style.Font.Bold = true;

                ws.Cell("A3").Value = $"DEL {fechaInicioCabecera} AL {fechaFinCabecera}";
                ws.Range("A3:J3").Merge();
                ws.Cell("A3").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                ws.Cell("A3").Style.Font.Bold = true;

                ws.Cell("A5").Value = "HORA INICIO:";
                ws.Cell("B5").Value = horaInicio;
                ws.Cell("D5").Value = "HORA FIN:";
                ws.Cell("E5").Value = horaFin;

                ws.Cell("A6").Value = "N°";
                ws.Cell("B6").Value = "DNI";
                ws.Cell("C6").Value = "CIP";
                ws.Cell("D6").Value = "PACIENTE";
                ws.Cell("E6").Value = "EDAD";
                ws.Cell("F6").Value = "TELEFONO";
                ws.Cell("G6").Value = "SERVICIO";
                ws.Cell("H6").Value = "FECHA";
                ws.Cell("I6").Value = "HORA";
                ws.Cell("J6").Value = "USUARIO";

                ws.Range("A6:J6").Style.Font.Bold = true;
                ws.Range("A6:J6").Style.Fill.BackgroundColor = XLColor.LightGray;
                ws.Range("A6:J6").Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                ws.Range("A6:J6").Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                ws.Range("A6:J6").Style.Border.InsideBorder = XLBorderStyleValues.Thin;

                int fila = 7;
                foreach (DataRow row in dsAdmitidos.Tables[0].Rows)
                {
                    ws.Cell(fila, 1).Value = row["Numero"].ToString();
                    ws.Cell(fila, 2).Value = row["Dni"].ToString();
                    ws.Cell(fila, 3).Value = row["Cip"].ToString();
                    ws.Cell(fila, 4).Value = row["Paciente"].ToString();
                    ws.Cell(fila, 5).Value = row["Edad"].ToString();
                    ws.Cell(fila, 6).Value = row["Telefono"].ToString();
                    ws.Cell(fila, 7).Value = row["Servicio"].ToString();
                    ws.Cell(fila, 8).Value = row["Fecha"].ToString();
                    ws.Cell(fila, 9).Value = row["Hora"].ToString();
                    ws.Cell(fila, 10).Value = row["Usuario"].ToString();
                    fila++;
                }

                if (fila > 7)
                {
                    ws.Range($"A7:J{fila - 1}").Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                    ws.Range($"A7:J{fila - 1}").Style.Border.InsideBorder = XLBorderStyleValues.Thin;
                }

                ws.Columns().AdjustToContents();

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Reporte_Admitidos_Emergencia.xlsx");
                }
            }
        }

        ////////////////////////////REPORTE TAMIZAJE OFTALMOLOGICO///////////////////////////////////////////////
        [HttpPost]
        public async Task<IActionResult> ReporteTamizajeOftalmologico(string fechaInicio, string fechaFin, int enExcel)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            if (enExcel == 0)
            {
                StringBuilder html = new StringBuilder();
                HtmlToPdf ohtml = new HtmlToPdf();
                string usuario;
                int idUsuario;

                Conexion con = new Conexion();
                sWebRootFolder = con.ObtenerServidorArchivos();
                MemoryStream ms = new MemoryStream();
                byte[] pdf;

                try
                {
                    usuario = HttpContext.Session.GetString("user");
                    idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                    //path = Path.Combine(sWebRootFolder, "Reportes", ((DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + tipo + ".pdf"));
                    //Console.WriteLine("path: " + path);
                    Comun.ClUtilirario cl = new Comun.ClUtilirario();

                    PdfPageSize pageSize = (PdfPageSize)Enum.Parse(typeof(PdfPageSize), "A4", true);

                    PdfPageOrientation pdfOrientation = (PdfPageOrientation)Enum.Parse(typeof(PdfPageOrientation), "Portrait", true);
                    ohtml.Options.PdfPageOrientation = pdfOrientation;
                    ohtml.Options.PdfPageSize = pageSize;
                    ohtml.Options.MarginLeft = 20;
                    ohtml.Options.MarginRight = 20;
                    ohtml.Options.MarginTop = 20;
                    ohtml.Options.MarginBottom = 20;
                    ohtml.Options.WebPageWidth = 793;
                    ohtml.Options.WebPageHeight = 1122;

                    string Ruta = Url.Action("FormatoReporteTamizajeOftalmologico", "Reportes", new { fechaInicio, fechaFin, usuario }, "http");
                    PdfDocument obPdfDoc = ohtml.ConvertUrl(Ruta);

                    pdf = obPdfDoc.Save();


                    ms = new MemoryStream();
                    ms.Write(pdf, 0, pdf.Length);
                    ms.Position = 0;

                    obPdfDoc.Close();

                    return new FileStreamResult(ms, MediaTypeNames.Application.Pdf);

                }
                catch (Exception)
                {
                    //Debug.Print(e.Message.ToString());
                    return new FileStreamResult(ms, "Error al generar el reporte.");

                }
            }
            else
            {
                sWebRootFolder = sWebRootFolder + "/Plantilla/Hospitalizacion/ReporteTamizajeOftalmologico.xlsx";
                using (var workbook = new XLWorkbook(sWebRootFolder))
                {
                    //var FilaIni = 4;
                    DalReportes dalRpt = new DalReportes();
                    //int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                    DataSet dataSet = await dalRpt.ListarReporteTamizajeOftalmologico(fechaInicio, fechaFin);

                    if (dataSet.Tables[0].Rows.Count > 0)
                    {
                        var wsHoja1 = workbook.Worksheets.First();

                        //wsHoja1.Cell(2, 5).Value = dsCabeceraICI.Tables[0].Rows[0]["Ventas"].ToString();
                        //wsHoja1.Cell(2, 7).Value = dsCabeceraICI.Tables[0].Rows[0]["Sis"].ToString();
                        //wsHoja1.Cell(2, 9).Value = dsCabeceraICI.Tables[0].Rows[0]["IntervSan"].ToString();

                        //wsHoja1.Cell(4, 1).InsertData(dsSaldosFarmAlmacen.Tables[0]);
                        //wsHoja1.Cell(5, 1).Value = "Cajero: " + cajero;
                        wsHoja1.Cell(5, 1).Value = "Fecha: " + fechaInicio + " al " + fechaFin;
                        //wsHoja1.Cell(7, 1).Value = "Consumo: " + tipoConsumo;


                        wsHoja1.Cell(10, 1).InsertTable(dataSet.Tables[0]);

                        //int filas = dataSet.Tables[0].Rows.Count;

                        //wsHoja1.Cell(filas + 9, 3).Value = dataSet.Tables[1].Rows[0]["Anulaciones"].ToString();
                        //wsHoja1.Cell(filas + 9, 4).Value = dataSet.Tables[1].Rows[0]["Exoneraciones"].ToString();


                        // Listado Admision 
                        using (var stream = new MemoryStream())
                        {
                            workbook.SaveAs(stream);
                            var content = stream.ToArray();
                            return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ReporteTamizajeOftalmologico.xlsx");
                        }
                    }
                    else
                    {
                        return NoContent();
                    }


                }
            }

            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";

        }


        public async Task<ActionResult> FormatoReporteTamizajeOftalmologico(string fechaInicio, string fechaFin, string usuario)
        {
            DalParametros daoParametros = new DalParametros();
            DataSet lsParametros = new DataSet();
            DalReportes dalRpt = new DalReportes();

            int idIpressInt = 0;
            var idIpressStr = HttpContext.Session.GetString("IdIPress");
            if (!string.IsNullOrEmpty(idIpressStr) && int.TryParse(idIpressStr, out int result)) idIpressInt = result;

            @ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss");
            @ViewBag.Usuario = usuario;

            DataSet DatosRpt = await dalRpt.ListarReporteTamizajeOftalmologico(fechaInicio, fechaFin);

            DataTable RegistroRpt = DatosRpt.Tables[0];
            //DataTable TotalRpt = DatosRpt.Tables[1];

            lsParametros = await daoParametros.SeleccionaFilaParametro2(205, idIpressInt);
            string nombre = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(206, idIpressInt);
            string direccion = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(207, idIpressInt);
            string telefono = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            @ViewBag.NombreInstitucion = nombre;
            @ViewBag.DireccionInstitucion = direccion;
            @ViewBag.TelefonoInstitucion = telefono;

            @ViewBag.Fecha = fechaInicio + " al " + fechaFin;
            //@ViewBag.Cajero = cajero;
            //@ViewBag.TipoConsumo = tipoConsumo;

            @ViewBag.RegistrosRpt = RegistroRpt;
            //@ViewBag.TotalRpt = TotalRpt;


            return PartialView("~/Views/Caja/Plantillas/FormatoReporteTamizajeOftalmologico.cshtml");

        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
                #region Reporte de Pacientes x Recepcionar
        public IActionResult ReporteAnatomiaPatologica(DateTime FechaInicio, DateTime FechaFin)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            using (var workbook = new XLWorkbook())
            {

                var currentRow = 1;
                var FilaIni = 2;
                DalReportes dalRpt = new DalReportes();
                DataSet dsTabla = dalRpt.ReporteAnatomiaPatologia(FechaInicio, FechaFin);
                // Listado Dertivaciones 
                var worksheetPacientes = workbook.Worksheets.Add("Anatomia Patólogia");
                for (int i = 0; i < dsTabla.Tables[0].Columns.Count; i++)
                {
                    worksheetPacientes.Cell(currentRow, i + 1).Value = dsTabla.Tables[0].Columns[i].ColumnName;
                    worksheetPacientes.Cell(currentRow, i + 1).Style
                        .Border.SetOutsideBorder(XLBorderStyleValues.Dotted)
                        .Font.SetFontColor(XLColor.Gray)
                        .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center)
                        .Fill.SetBackgroundColor(XLColor.BeauBlue)
                        .Font.SetBold(true);
                }
                for (int i = 0; i < dsTabla.Tables[0].Columns.Count; i++)
                {
                    for (int j = 0; j < dsTabla.Tables[0].Rows.Count; j++)
                    {
                        worksheetPacientes.Cell(FilaIni + j, i + 1).Value = dsTabla.Tables[0].Rows[j][i].ToString();
                    }
                }

                worksheetPacientes.Rows().AdjustToContents();
                worksheetPacientes.Columns().AdjustToContents();
                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Reporte_anatomia_patologica" + DateTime.Now.ToShortDateString() + ".xlsx");
                }
            }
        }

        #endregion


        /// <summary>   reporte de atenciones de pacientes cronicos </summary>
        /// autor:RMOREANO

        public IActionResult PartePacientesCronicos(int idTipoServicio, int idDepartamento, int idEspecialidad, int idServicio, int idDestino, int idMedico, DateTime FechaInicio, DateTime FechaFin)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            using (var workbook = new XLWorkbook())
            {

               
                // Listado Dertivaciones 
                var worksheetDerivacion = workbook.Worksheets.Add("Reporte de Pacientes Cronicos");
                // 🔷 TITULOS
                worksheetDerivacion.Cell(1, 1).Value = "CENTRO MEDICO NAVAL";
                worksheetDerivacion.Range(1, 1, 1, 10).Merge().Style
                    .Font.SetBold().Font.SetFontSize(16)
                    .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);

                worksheetDerivacion.Cell(2, 1).Value = "REPORTE DE PACIENTES CRONICOS";
                worksheetDerivacion.Range(2, 1, 2, 10).Merge().Style
                    .Font.SetBold().Font.SetFontSize(14)
                    .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);

                worksheetDerivacion.Cell(3, 1).Value = $"DEL {FechaInicio:dd/MM/yyyy} AL {FechaFin:dd/MM/yyyy}";
                worksheetDerivacion.Range(3, 1, 3, 10).Merge().Style
                    .Font.SetFontSize(13)
                    .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                var FilaIni = 5;
                DalReportes dalRpt = new DalReportes();
                DataSet dsTabla = dalRpt.PartePacientesCronicos(idTipoServicio, idDepartamento, idEspecialidad, idServicio, idDestino, idMedico, FechaInicio, FechaFin);


                var currentRow = 4;
                for (int i = 0; i < dsTabla.Tables[0].Columns.Count; i++)
                {
                    worksheetDerivacion.Cell(currentRow, i + 1).Value = dsTabla.Tables[0].Columns[i].ColumnName;
                    worksheetDerivacion.Cell(currentRow, i + 1).Style
                        .Border.SetOutsideBorder(XLBorderStyleValues.Dotted)
                        .Font.SetFontColor(XLColor.Gray)
                        .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center)
                        .Fill.SetBackgroundColor(XLColor.BeauBlue)
                        .Font.SetBold(true);
                }

                for (int i = 0; i < dsTabla.Tables[0].Columns.Count; i++)
                {
                    for (int j = 0; j < dsTabla.Tables[0].Rows.Count; j++)
                    {
                        worksheetDerivacion.Cell(FilaIni + j, i + 1).Value = dsTabla.Tables[0].Rows[j][i].ToString();
                    }
                }

                worksheetDerivacion.Rows().AdjustToContents();
                worksheetDerivacion.Columns().AdjustToContents();

                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Reporte_Pacientes_cronicos_" + DateTime.Now.ToShortDateString() + ".xlsx");
                }
            }
        }


        /// <summary>   reporte Epidemiologico </summary>
        /// autor:RMOREANO
        public IActionResult Epidemiologico(DateTime FechaInicio, DateTime FechaFin, string HoraIni, string HoraFin)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            using (var workbook = new XLWorkbook())
            {


                // Listado Dertivaciones 
                var worksheetDerivacion = workbook.Worksheets.Add("Reporte Epidemiologico");
                // 🔷 TITULOS
                worksheetDerivacion.Cell(1, 1).Value = "CENTRO MEDICO NAVAL";
                worksheetDerivacion.Range(1, 1, 1, 10).Merge().Style
                    .Font.SetBold().Font.SetFontSize(16)
                    .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);

                worksheetDerivacion.Cell(2, 1).Value = "REPORTE EPIDEMIOLÓGICO";
                worksheetDerivacion.Range(2, 1, 2, 10).Merge().Style
                    .Font.SetBold().Font.SetFontSize(14)
                    .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);

                worksheetDerivacion.Cell(3, 1).Value = $"DEL {FechaInicio:dd/MM/yyyy} AL {FechaFin:dd/MM/yyyy}, HORA INICIO: {HoraIni} - HORA FIN: {HoraFin} ";
                worksheetDerivacion.Range(3, 1, 3, 10).Merge().Style
                    .Font.SetFontSize(13)
                    .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                var FilaIni = 5;
                DalReportes dalRpt = new DalReportes();
                DataSet dsTabla = dalRpt.ReporteEpidemiologico(FechaInicio, FechaFin, HoraIni, HoraFin);


                var currentRow = 4;
                for (int i = 0; i < dsTabla.Tables[0].Columns.Count; i++)
                {
                    worksheetDerivacion.Cell(currentRow, i + 1).Value = dsTabla.Tables[0].Columns[i].ColumnName;
                    worksheetDerivacion.Cell(currentRow, i + 1).Style
                        .Border.SetOutsideBorder(XLBorderStyleValues.Dotted)
                        .Font.SetFontColor(XLColor.Gray)
                        .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center)
                        .Fill.SetBackgroundColor(XLColor.BeauBlue)
                        .Font.SetBold(true);
                }

                for (int i = 0; i < dsTabla.Tables[0].Columns.Count; i++)
                {
                    for (int j = 0; j < dsTabla.Tables[0].Rows.Count; j++)
                    {
                        worksheetDerivacion.Cell(FilaIni + j, i + 1).Value = dsTabla.Tables[0].Rows[j][i].ToString();
                    }
                }

                worksheetDerivacion.Rows().AdjustToContents();
                worksheetDerivacion.Columns().AdjustToContents();

                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Reporte_epidemiologico_" + DateTime.Now.ToShortDateString() + ".xlsx");
                }
            }
        }


    }
}