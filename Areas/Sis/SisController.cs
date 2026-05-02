using CapaDatos;
using CapaEntidades;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Sis
{
    public class SisController: BaseController
    {
        private IWebHostEnvironment _hostingEnvironment;

        public SisController(IWebHostEnvironment env)
        {
            _hostingEnvironment = env;
        }

        public async Task<IActionResult> FormatoFua(int idListBar)
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
                

                DalSis dalSis = new DalSis();

                DataSet Ups = await dalSis.SisFuaUPServiciosSeleccionarTodos();
                ViewBag.Ups = Ups.Tables[0];

                DataSet CodigoPrestacional = await dalSis.Listar_m_serviciosSIS();
                ViewBag.CodigoPrestacional = CodigoPrestacional.Tables[0];

                DataSet Componentes = await dalSis.Listar_a_componentes();
                ViewBag.Componentes = Componentes.Tables[0];

                DataSet TiposDocumento = await dalSis.Listar_a_tipodocumento();
                ViewBag.TiposDocumento = TiposDocumento.Tables[0];

                DataSet TipoSexo = await dalSis.Listar_a_sexo();
                ViewBag.TipoSexo = TipoSexo.Tables[0];

                DataSet CondicionMaterna = await dalSis.Listar_a_condicionmaterna();
                ViewBag.CondicionMaterna = CondicionMaterna.Tables[0];

                DataSet ConceptoPrestacional = await dalSis.Listar_a_modalidadatencion();
                ViewBag.ConceptoPrestacional = ConceptoPrestacional.Tables[0];

                DataSet Etnia = await dalSis.EtniaHISseleccionarTodos();
                ViewBag.Etnia = Etnia.Tables[0];

                DataSet TipoAtencion = await dalSis.Listar_a_tipoatencion();
                ViewBag.TipoAtencion = TipoAtencion.Tables[0];

                DataSet Nivel = await dalSis.Listar_m_IIEE_Nivel();
                ViewBag.Nivel = Nivel.Tables[0];

                DataSet Turnos = await dalSis.Listar_m_IIEE_Turno();
                ViewBag.Turnos = Turnos.Tables[0];


                ViewBag.Area = "Sis";
                return View("~/Views/Sis/FormatoFua.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        //JDELGADO012 INTEGRACION SOASI
        public async Task<IActionResult> IntegracionSoaSis(int idListBar)
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
                return View("IntegracionSoaSis");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        public async Task<IActionResult> IntegracionSoaSisV2(int idListBar)
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
                return View("IntegracionSoaSisV2");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        public async Task<IActionResult> GeneraRptTamizajeNeonatal(DateTime FechaInicio, DateTime FechaFin)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
            sWebRootFolder = sWebRootFolder + "/Plantilla/Sis/RptTamizajeNeonatal.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                //var FilaIni = 4;
                DalInmunizaciones dalInmunizaciones = new DalInmunizaciones();
                //int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet dataSet = await dalInmunizaciones.ListarAtencionesFuaTamizajeNeonatal(FechaInicio, FechaFin);

                var wsHoja1 = workbook.Worksheets.First();

                //wsHoja1.Cell(2, 5).Value = dsCabeceraICI.Tables[0].Rows[0]["Ventas"].ToString();
                //wsHoja1.Cell(2, 7).Value = dsCabeceraICI.Tables[0].Rows[0]["Sis"].ToString();
                //wsHoja1.Cell(2, 9).Value = dsCabeceraICI.Tables[0].Rows[0]["IntervSan"].ToString();


                //wsHoja1.Cell(4, 1).InsertData(dsSaldosFarmAlmacen.Tables[0]);
                wsHoja1.Cell(1, 1).InsertTable(dataSet.Tables[0]);


                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "SaldosPorAlmacen.xlsx");
                }
            }
        }

        public async Task<IActionResult> GeneraRptTamizajeNeonatalPorTipo(DateTime FechaInicio, DateTime FechaFin, int Tipo)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
            sWebRootFolder = sWebRootFolder + "/Plantilla/Sis/RptTamizajeNeonatal.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                //var FilaIni = 4;
                DalInmunizaciones dalInmunizaciones = new DalInmunizaciones();
                //int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet dataSet = await dalInmunizaciones.ListarAtencionesFuaTamizajeNeonatalPorTipo(FechaInicio, FechaFin, Tipo);

                var wsHoja1 = workbook.Worksheets.First();


                

                //wsHoja1.Cell(2, 5).Value = dsCabeceraICI.Tables[0].Rows[0]["Ventas"].ToString();
                //wsHoja1.Cell(2, 7).Value = dsCabeceraICI.Tables[0].Rows[0]["Sis"].ToString();
                //wsHoja1.Cell(2, 9).Value = dsCabeceraICI.Tables[0].Rows[0]["IntervSan"].ToString();


                //wsHoja1.Cell(4, 1).InsertData(dsSaldosFarmAlmacen.Tables[0]);
                wsHoja1.Cell(1, 1).InsertTable(dataSet.Tables[0]);

                if(Tipo == 1)
                {
                    var wsHoja2 = workbook.Worksheets.Worksheet(2);
                    wsHoja2.Cell(1, 1).InsertTable(dataSet.Tables[1]);

                    var wsHoja3 = workbook.Worksheets.Worksheet(3);
                    wsHoja3.Cell(1, 1).InsertTable(dataSet.Tables[2]);

                    var wsHoja4 = workbook.Worksheets.Worksheet(4);
                    wsHoja4.Cell(1, 1).InsertTable(dataSet.Tables[3]);

                    var wsHoja5 = workbook.Worksheets.Worksheet(5);
                    wsHoja5.Cell(1, 1).InsertTable(dataSet.Tables[4]);
                }
                


                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "SaldosPorAlmacen.xlsx");
                }
            }
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

            ViewBag.IdUsuario = idUsuario;
            ViewBag.Area = "Sis";
            return View("TamizajeNeonatalSis");
        }


        public async Task<IActionResult> ReporteRecienNacidos(int idListBar)
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
            ViewBag.Area = "Sis";
            return View("ReporteRecienNacidos");
        }



        public async Task<IActionResult> IntegracionSetisis(int idListBar)
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
                return View("IntegracionSetisis");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

    }
}
