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
using System.Threading.Tasks;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Sis
{
    public class ReportesSisController: BaseController
    {
        private IWebHostEnvironment _hostingEnvironment;

        public ReportesSisController(IWebHostEnvironment env)
        {
            _hostingEnvironment = env;
        }
        public async Task<ActionResult> ListarRecienNacidoParaSIS()
        {
            DataSet dataResp = null;
            //int nRpta;
            DalSis dalSis = new DalSis();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            try
            {
                dataResp = await dalSis.ListarRecienNacidoParaSIS();

                return Json(new { lsResultado = dataResp, estado = true, session = true, mensaje = "" });
            }
            catch (Exception e)
            {
                return Json(new { estado = false, session = true, mensaje = "Error al insertar afiliacion: " + e });
            }
        }

        public async Task<IActionResult> GeneraRptRecienNacidos()
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
            sWebRootFolder = sWebRootFolder + "/Plantilla/Sis/RptRecienNacidos.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                //var FilaIni = 4;
                DalSis dalSis = new DalSis();
                //int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet dataSet = await dalSis.GeneraRptRecienNacidoParaSIS();

                var wsHoja1 = workbook.Worksheets.First();

                //wsHoja1.Cell(2, 5).Value = dsCabeceraICI.Tables[0].Rows[0]["Ventas"].ToString();
                //wsHoja1.Cell(2, 7).Value = dsCabeceraICI.Tables[0].Rows[0]["Sis"].ToString();
                //wsHoja1.Cell(2, 9).Value = dsCabeceraICI.Tables[0].Rows[0]["IntervSan"].ToString();


                //wsHoja1.Cell(4, 1).InsertData(dsSaldosFarmAlmacen.Tables[0]);
                wsHoja1.Cell(4, 1).InsertTable(dataSet.Tables[0]);


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
