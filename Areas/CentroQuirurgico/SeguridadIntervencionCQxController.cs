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
using WebAppMaternidad.CapaEntidades;
using WebAppMaternidad.Controllers;
using WebAppMaternidad.Middleware;

namespace WebAppMaternidad.Areas.CentroQuirurgico
{
    public class SeguridadIntervencionCQxController : BaseController
    {
        private IWebHostEnvironment _hostingEnvironment;

        public SeguridadIntervencionCQxController(IWebHostEnvironment env)
        {
            _hostingEnvironment = env;
        }

        [HttpPost]
        public async Task<IActionResult> ListarAtencionesSeguridadIntervencionCQx(
            int? IdCuentaAtencion, int? NroHistoriaClinica, string NroDocumento, string ApellidoPaterno, string ApellidoMaterno, string Nombres, DateTime? FechaInicio, DateTime? FechaFin, int? IdServicio,
            int? IdAtencion, int? NroEvaluacion
        )
        {
            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {
                var dal = new DalSeguridadIntervencionCQx();
                var idUsuario = IdUsuarioSesion();

                if ((FechaInicio.HasValue && !FechaFin.HasValue) || (!FechaInicio.HasValue && FechaFin.HasValue))
                {
                    return ApiResponseHelper.BadRequest("Debe ingresar tanto la Fecha Inicio como la Fecha Fin.");
                }

                var dataSet = await dal.ListarAtencionesSeguridadIntervencionCQx(
                    IdCuentaAtencion, NroHistoriaClinica, NroDocumento, ApellidoPaterno, ApellidoMaterno, Nombres, FechaInicio, FechaFin, IdServicio, IdAtencion, NroEvaluacion
                );

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CrearModificarSeguridadIntervencionQuirurgica(SeguridadIntervencionQuirurgica seguridadIntervencion, int idListBar)
        {
            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {
                var dal = new DalSeguridadIntervencionCQx();
                var idUsuario = IdUsuarioSesion();


                var dataSet = await dal.CrearModificarSeguridadIntervencionQuirurgica(seguridadIntervencion, idUsuario, idListBar);

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }
        }

        public async Task<ActionResult> GenerarReporte(DateTime FechaInicio, DateTime FechaFin)
        {
            
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            sWebRootFolder = sWebRootFolder + "/Plantilla/CentroQuirurgico/ListarAtencionesSeguridadIntervencionCQx.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                DalSeguridadIntervencionCQx dalSeguridadIntervencionCQx = new DalSeguridadIntervencionCQx ();
                //int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet dataSet = await dalSeguridadIntervencionCQx.ListarAtencionesSeguridadIntervencionCQx(FechaInicio, FechaFin);

                DataTable dataTable = dataSet.Tables[0];

                var wsHoja1 = workbook.Worksheets.First();


                // Agregar los datos fila por fila
                for (int i = 0; i < dataTable.Rows.Count; i++)
                {
                    for (int j = 0; j < dataTable.Columns.Count; j++)
                    {
                        var celda = wsHoja1.Cell(2 + i + 1, j + 1);

                        celda.Value = dataTable.Rows[i][j].ToString();

                        if ((j == 3 || j == 5 || j == 7 || j == 8 || j == 9 || j == 12 || j == 13 || j == 14 || j == 18 || j == 19 || j == 20|| j == 24|| j == 25|| j == 26))
                        {
                            celda.Style.Fill.BackgroundColor = XLColor.FromHtml("#FFFF99");
                        }

                        celda.Style.Border.TopBorder = XLBorderStyleValues.Thin;
                        celda.Style.Border.BottomBorder = XLBorderStyleValues.Thin;
                        celda.Style.Border.LeftBorder = XLBorderStyleValues.Thin;
                        celda.Style.Border.RightBorder = XLBorderStyleValues.Thin;

                    }
                }

                //wsHoja1.Cell(5, 1).InsertTable(dataSet.Tables[0]);




                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "SaldosPorAlmacen.xlsx");
                }
            }
        }

    }
}
