using CapaDatos;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Threading.Tasks;
using System;
using WebAppMaternidad.CapaDatos;
using ClosedXML.Excel;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using System.Linq;

namespace WebAppMaternidad.Areas.SistemaColas
{
    public class SGCMonitoreoController : Controller
    {
        private IWebHostEnvironment _hostingEnvironment;

        public SGCMonitoreoController(IWebHostEnvironment env)
        {
            _hostingEnvironment = env;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> ListaTurnosPorVentanilla(int idVentanilla, string fecha)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalSGCMonitoreo dal = new DalSGCMonitoreo();

            try
            {
                ds = await dal.ListaTurnosMonitoreo(idVentanilla, fecha);

                return Json(new { respuesta = ds, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (Listar Turnos monitoreo): " + ex });
            }

        }

        [HttpPost]
        public async Task<IActionResult> ReporteMonitoreoColas(int idVentanilla, string fechaInicio, string fechaFin, string ventanilla)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
            sWebRootFolder = sWebRootFolder + "/Plantilla/SGC/ReporteMonitoreoColas.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                //var FilaIni = 4;
                DalSGCMonitoreo dal = new DalSGCMonitoreo();
                //int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet dataSet = await dal.ListarReporteMonitoreoColas(idVentanilla, fechaInicio, fechaFin);

                if (dataSet.Tables[0].Rows.Count > 0)
                {
                    var wsHoja1 = workbook.Worksheets.First();

                    //wsHoja1.Cell(2, 5).Value = dsCabeceraICI.Tables[0].Rows[0]["Ventas"].ToString();
                    //wsHoja1.Cell(2, 7).Value = dsCabeceraICI.Tables[0].Rows[0]["Sis"].ToString();
                    //wsHoja1.Cell(2, 9).Value = dsCabeceraICI.Tables[0].Rows[0]["IntervSan"].ToString();


                    //wsHoja1.Cell(4, 1).InsertData(dsSaldosFarmAlmacen.Tables[0]);
                    wsHoja1.Cell(5, 2).Value = ventanilla;


                    wsHoja1.Cell(7, 1).InsertTable(dataSet.Tables[0]);

                    // Listado Admision 
                    using (var stream = new MemoryStream())
                    {
                        workbook.SaveAs(stream);
                        var content = stream.ToArray();
                        return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ReporteMonitoreoColas.xlsx");
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
