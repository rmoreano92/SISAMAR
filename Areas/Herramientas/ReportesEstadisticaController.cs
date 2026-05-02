using CapaDatos;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Herramientas
{
    public class ReportesEstadisticaController : BaseController
    {
        private IWebHostEnvironment _hostingEnvironment;

        public ReportesEstadisticaController(IWebHostEnvironment env)
        {
            _hostingEnvironment = env;
        }

        public IActionResult Index()
        {
            return View();
        }

        // public async Task<IActionResult> rptListarReporteEstadistica(string fechaInicio, string fechaFin, int idMedico, int tipoReporte, string reporte)
        // {
        //     //if (HttpContext.User.Identity.IsAuthenticated == false)
        //     //{
        //     //    return View("Login");
        //     //}
        //     string sWebRootFolder = _hostingEnvironment.WebRootPath;

        //     //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
        //     sWebRootFolder = sWebRootFolder + "/Plantilla/Estadistica/ReporteEstadistica.xlsx";
        //     using (var workbook = new XLWorkbook(sWebRootFolder))
        //     {
        //         //var FilaIni = 4;
        //         DalHerramientas dalHerramientas = new DalHerramientas();
        //         //int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

        //         DataSet dataSet = await dalHerramientas.ListarReporteEstadistica(fechaInicio, fechaFin, idMedico, tipoReporte);

        //         if (dataSet.Tables[0].Rows.Count > 0)
        //         {
        //             var wsHoja1 = workbook.Worksheets.First();

        //             //wsHoja1.Cell(2, 5).Value = dsCabeceraICI.Tables[0].Rows[0]["Ventas"].ToString();
        //             //wsHoja1.Cell(2, 7).Value = dsCabeceraICI.Tables[0].Rows[0]["Sis"].ToString();
        //             //wsHoja1.Cell(2, 9).Value = dsCabeceraICI.Tables[0].Rows[0]["IntervSan"].ToString();


        //             //wsHoja1.Cell(4, 1).InsertData(dsSaldosFarmAlmacen.Tables[0]);
        //             wsHoja1.Cell(4, 1).Value = reporte;

        //             wsHoja1.Cell(6, 1).InsertTable(dataSet.Tables[0]);


        //             // Listado Admision 
        //             using (var stream = new MemoryStream())
        //             {
        //                 workbook.SaveAs(stream);
        //                 var content = stream.ToArray();
        //                 return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ReporteEstadistica.xlsx");
        //             }
        //         }
        //         else
        //         {
        //             return NoContent();
        //         }


        //     }
        // }

        public async Task<IActionResult> rptListarReporteEstadistica(string fechaInicio, string fechaFin, int idMedico, int tipoReporte, string reporte)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            string archivoExcel = "ReporteEstadistica.xlsx";
            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";

            if (tipoReporte == 8)
            {
                archivoExcel = "ReporteEstadisticaGeneralEmergencia.xlsx";
            }
            if (tipoReporte == 9)
            {
                archivoExcel = "ReporteEstadisticaGeneralCE.xlsx";
            }
            sWebRootFolder = sWebRootFolder + "/Plantilla/Estadistica/" + archivoExcel;


            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                //var FilaIni = 4;
                DalHerramientas dalHerramientas = new DalHerramientas();
                //int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet dataSet = null;

                if (tipoReporte == 1) // REPORTE Minsa Emergencia
                {
                    dataSet = await dalHerramientas.RptEstadisticaEmergencia(fechaInicio, fechaFin);
                }
                else if (tipoReporte == 2) // REPORTE Minsa Consulta Externa
                {
                    dataSet = await dalHerramientas.ReporteEstadisticaCE(fechaInicio, fechaFin, 1);
                }
                else if (tipoReporte == 3) // Apoyo al Diagnóstico
                {
                    dataSet = await dalHerramientas.RptRayosXyLaboratoriobyMGP(fechaInicio, fechaFin);
                }

                else if (tipoReporte == 4) // REPORTE Egresos Hospitalarios
                {
                    dataSet = await dalHerramientas.ReporteParaEstaditica_Hospitalizacion(fechaInicio, fechaFin);
                }

                else if (tipoReporte == 5) // REPORTE PPR Emergencia
                {
                    dataSet = await dalHerramientas.RptEstadisticaPPREmergencia(fechaInicio, fechaFin);
                }



                else if (tipoReporte == 7) // REPORTE Producción de Médicos
                {
                    dataSet = await dalHerramientas.ListaProduccionMedico(idMedico, fechaInicio, fechaFin);
                }
                else if (tipoReporte == 8) // REPORTE General Emergencia
                {
                    dataSet = await dalHerramientas.ReporteEgresosHospitalarios(0, 0, 0, 2, fechaInicio, fechaFin);
                }

                else if (tipoReporte == 9) // REPORTE General Consulta Externa
                {
                    dataSet = await dalHerramientas.ReporteEgresosHospitalarios(0, 0, 0, 1, fechaInicio, fechaFin);
                }

                else if (tipoReporte == 10) // REPORTE EIDISIP
                {
                    dataSet = await dalHerramientas.ReporteEgresosHospitalizacion(fechaInicio, fechaFin);
                }

                else if (tipoReporte == 11) // REPORTE DE PROCEDIMIENTOS
                {
                    dataSet = await dalHerramientas.ReporteProcedimientosRealizados(fechaInicio, fechaFin);
                }


                if (dataSet.Tables[0].Rows.Count > 0)
                {
                    var wsHoja1 = workbook.Worksheets.First();

                    wsHoja1.Cell(4, 1).Value = reporte;

                    if (tipoReporte == 8 || tipoReporte == 9)
                    {
                        DataTable dataTable = dataSet.Tables[0];

                        wsHoja1 = workbook.Worksheets.First();


                        // Agregar los datos fila por fila
                        for (int i = 0; i < dataTable.Rows.Count; i++)
                        {
                            for (int j = 0; j < dataTable.Columns.Count; j++)
                            {
                                var celda = wsHoja1.Cell(i + 8, j + 1);

                                celda.Value = dataTable.Rows[i][j].ToString();

                                // if (j == 3 || j == 5 || j == 7 || j == 8 || j == 9 || j == 12 || j == 13 || j == 14 || j == 18 || j == 19 || j == 20 || j == 24 || j == 25 || j == 26)
                                // {
                                //     celda.Style.Fill.BackgroundColor = XLColor.FromHtml("#FFFF99");
                                // }

                                celda.Style.Border.TopBorder = XLBorderStyleValues.Thin;
                                celda.Style.Border.BottomBorder = XLBorderStyleValues.Thin;
                                celda.Style.Border.LeftBorder = XLBorderStyleValues.Thin;
                                celda.Style.Border.RightBorder = XLBorderStyleValues.Thin;

                            }
                        }
                    }
                    else
                    {
                        wsHoja1.Cell(6, 1).InsertTable(dataSet.Tables[0]);
                    }

                    // Listado Admision 
                    using (var stream = new MemoryStream())
                    {
                        workbook.SaveAs(stream);
                        var content = stream.ToArray();
                        return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ReporteEstadistica.xlsx");
                    }
                }
                else
                {
                    return NoContent();
                }


            }
        }

        public async Task<IActionResult> ReporteConstanciaNacimientos(string fechaInicio, string fechaFin)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            string archivoExcel = "ReporteEstadistica.xlsx";
            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
            sWebRootFolder = sWebRootFolder + "/Plantilla/Estadistica/" + archivoExcel;


            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                //var FilaIni = 4;
                DalHerramientas dalHerramientas = new DalHerramientas();
                //int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet dataSet = null;

                dataSet = await dalHerramientas.ReporteConstanciaNacimientos(fechaInicio, fechaFin);


                if (dataSet.Tables[0].Rows.Count > 0)
                {
                    var wsHoja1 = workbook.Worksheets.First();



                    wsHoja1.Cell(6, 1).InsertTable(dataSet.Tables[0]);

                    // Listado Admision 
                    using (var stream = new MemoryStream())
                    {
                        workbook.SaveAs(stream);
                        var content = stream.ToArray();
                        return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ReporteEstadistica.xlsx");
                    }
                }
                else
                {
                    return NoContent();
                }


            }
        }

    }
}
