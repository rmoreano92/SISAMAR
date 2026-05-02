using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using CapaDatos;
using CapaEntidades;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Mvc;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Emergencia.Controllers
{
    public class DashBoardEmergenciaController : BaseController
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult CitasEmergencia()
        {
            return View("Emergencia");
        }

        public IActionResult DashBoardAtenciones()
        {
            return View("Atenciones");
        }

        public IActionResult DashBoardDerivacionEmergencia()
        {
            return View("DerivacionEmergencia");
        }


        [HttpPost]
        public ActionResult ListadoPrincipal(int Mes, int idTipoServicio, int idEspecialidad)
        {
            DataSet lstCitas;
            DalDashBoard daoCitas = new DalDashBoard();
            lstCitas = daoCitas.ObtenerCitasEmergencia(Mes, idTipoServicio, idEspecialidad);
            return Json(lstCitas);
        }


        [HttpGet]
        public async Task<ActionResult> ListarMeses()
        {
            DataSet lstMeses;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMeses = await daoCitas.DevuelveDSCombo("Web_ListarMeses");
            return Json(lstMeses);
        }

        [HttpGet]
        public async Task<ActionResult> ListarTipoServicio()
        {
            DataSet lstMeses;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMeses = await daoCitas.DevuelveDSCombo("web_listarTipoServicio");
            return Json(lstMeses);
        }

        [HttpGet]
        public ActionResult ListarServicio()
        {
            DataSet lstMeses;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMeses = daoCitas.DevuelveDSServicio((int)Enumerados.TiposServicio.Consultorios_Emergencia);
            return Json(lstMeses);
        }



        [HttpPost]
        public ActionResult ListadoCitasAtendidos(int Mes, int idTipoServicio, int idEspecialidad)
        {
            DataSet lstCitas;
            DalDashBoard daoCitas = new DalDashBoard();
            lstCitas = daoCitas.ObtenerCitasAtendidasEmergencia(Mes, idTipoServicio, idEspecialidad);
            return Json(lstCitas);
        }


        [HttpPost]
        public ActionResult ListadoCitasAtendidasxCE(DateTime FechaInicio, DateTime FechaFin)
        {
            DataSet lstCitas;
            DalDashBoard daoCitas = new DalDashBoard();
            lstCitas = daoCitas.ObtenerCitasAtendidasEmergencia(FechaInicio, FechaFin);
            return Json(lstCitas);
        }

        #region Atenciones

        [HttpPost]
        public ActionResult ListaAtendidosAnio(int idTipoServicio)
        {
            DataSet lstCitas;
            DalDashBoard daoCitas = new DalDashBoard();
            lstCitas = daoCitas.ListaAtendidosAnio(idTipoServicio);
            return Json(lstCitas);
        }

        [HttpPost]
        public ActionResult ListadoAtendidosxAnio(int idTipoServicio, int Anio)
        {
            DataSet lstCitas;
            DalDashBoard daoCitas = new DalDashBoard();
            lstCitas = daoCitas.ListadoAtendidosxAnio(Anio,idTipoServicio);
            return Json(lstCitas);
        }

        [HttpPost]
        public ActionResult ListadoAtendidosxMes(int idTipoServicio, int Anio, int Mes)
        {
            DataSet lstCitas;
            DalDashBoard daoCitas = new DalDashBoard();
            lstCitas = daoCitas.ListadoAtendidosxMes(Anio,Mes,idTipoServicio);
            return Json(lstCitas);
        }
        #endregion

        #region Derivacion con Atenciones

        [HttpPost]
        public ActionResult CantidadDerivacionEmergencia(DateTime FechaInicio, DateTime FechaFin)
        {
            DataSet lst;
            DalDashBoard daoDashboard = new DalDashBoard();
            lst = daoDashboard.DevuelveCantidadDerivacionEmergencia(FechaInicio,FechaFin);
            return Json(lst);
        }
        
        [HttpPost]
        public ActionResult ListarDerivacionEmergencia(DateTime FechaInicio, DateTime FechaFin,int Tipo)
        {
            DataSet lst;
            DalDashBoard daoDashboard = new DalDashBoard();
            lst = daoDashboard.ListarDerivacionEvaluacion(FechaInicio, FechaFin,Tipo);
            return Json(lst);
        }

        public IActionResult Excel(DateTime FechaInicio, DateTime FechaFin)
        {
            using (var workbook = new XLWorkbook())
            {
                
                var currentRow = 1;
                var FilaIni = 2;
                DalDashBoard dalDash = new DalDashBoard();
                DataSet dsTabla = dalDash.ListarDerivacionEmergenciaTodos(FechaInicio, FechaFin);
                // Listado Dertivaciones 
                var worksheetDerivacion = workbook.Worksheets.Add("Lista Derivación"); 
                for (int i=0;i<dsTabla.Tables[0].Columns.Count;i++ )
                {
                    worksheetDerivacion.Cell(currentRow, i+1).Value = dsTabla.Tables[0].Columns[i].ColumnName;
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
                var worksheetAdmision = workbook.Worksheets.Add("Lista Admision");
                for (int i = 0; i < dsTabla.Tables[1].Columns.Count; i++)
                {
                    worksheetAdmision.Cell(currentRow, i + 1).Value = dsTabla.Tables[1].Columns[i].ColumnName;
                    worksheetAdmision.Cell(currentRow, i + 1).Style
                        .Border.SetOutsideBorder(XLBorderStyleValues.Dotted)
                        .Fill.SetBackgroundColor(XLColor.BeauBlue)
                        .Font.SetFontColor(XLColor.Gray)
                        .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center)
                        .Fill.SetBackgroundColor(XLColor.BeauBlue)
                        .Font.SetBold(true);

                }
                for (int i = 0; i < dsTabla.Tables[1].Columns.Count; i++)
                {
                    for (int j = 0; j < dsTabla.Tables[1].Rows.Count; j++)
                    {
                        worksheetAdmision.Cell(FilaIni + j, i + 1).Value = dsTabla.Tables[1].Rows[j][i].ToString();
                    }
                }
                worksheetAdmision.Rows().AdjustToContents();
                worksheetAdmision.Columns().AdjustToContents();
                // Listado Emergencia 
                var worksheetEmergencia = workbook.Worksheets.Add("Lista Emergencia");
                
                for (int i = 0; i < dsTabla.Tables[2].Columns.Count; i++)
                {
                    worksheetEmergencia.Cell(currentRow, i + 1).Value = dsTabla.Tables[2].Columns[i].ColumnName;
                    worksheetEmergencia.Cell(currentRow, i + 1).Style
                        .Fill.SetBackgroundColor(XLColor.BeauBlue)
                        .Border.SetOutsideBorder(XLBorderStyleValues.Dotted)                       
                        .Font.SetFontColor(XLColor.Gray)
                        .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center)
                        .Fill.SetBackgroundColor(XLColor.BeauBlue)
                        .Font.SetBold(true);
                }
                for (int i = 0; i < dsTabla.Tables[2].Columns.Count; i++)
                {
                    for (int j = 0; j < dsTabla.Tables[2].Rows.Count; j++)
                    {
                        worksheetEmergencia.Cell(FilaIni + j, i + 1).Value = dsTabla.Tables[2].Rows[j][i].ToString();
                    }
                }
                worksheetEmergencia.Rows().AdjustToContents();
                worksheetEmergencia.Columns().AdjustToContents();
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content,"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","ReporteDerivacionEmergencia.xlsx");
                }
            }
        }

        #endregion



    }
}