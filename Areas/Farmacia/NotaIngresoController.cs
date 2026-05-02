using CapaDatos;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using WebAppMaternidad.CapaDatos;

using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Farmacia
{
    public class NotaIngresoController : BaseController
    {
        private IWebHostEnvironment _hostingEnvironment;

        public NotaIngresoController(IWebHostEnvironment env)
        {
            _hostingEnvironment = env;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> ListarNotasIngresos(int IdAlmacen, int NroCuenta, string FechaInicio, string FechaFin)
        {
            DataSet resultado;
            DalNotaIngresoFarmacia dao = new DalNotaIngresoFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            resultado = null;

            resultado = await dao.ListarNotasIngresos(IdAlmacen, NroCuenta, FechaInicio, FechaFin, idUsuario);

            return Json(new { respuesta = resultado, session = true });
        }

        public async Task<IActionResult> rptNotaIngresoFarmaciaAlmacen(int IdAlmacen, int NroCuenta, string FechaInicio, string FechaFin)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
            sWebRootFolder = sWebRootFolder + "/Plantilla/Farmacia/ReporteNotaIngreso.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                //var FilaIni = 4;
                DalNotaIngresoFarmacia dao = new DalNotaIngresoFarmacia();
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet dataSet = await dao.DevuelveMovimientosDeNotaIngresosReporte(IdAlmacen, NroCuenta, FechaInicio, FechaFin, idUsuario);

                var wsHoja1 = workbook.Worksheets.First();

                //wsHoja1.Cell(2, 5).Value = dsCabeceraICI.Tables[0].Rows[0]["Ventas"].ToString();
                //wsHoja1.Cell(2, 7).Value = dsCabeceraICI.Tables[0].Rows[0]["Sis"].ToString();
                //wsHoja1.Cell(2, 9).Value = dsCabeceraICI.Tables[0].Rows[0]["IntervSan"].ToString();


                //wsHoja1.Cell(4, 1).InsertData(dsSaldosFarmAlmacen.Tables[0]);
                wsHoja1.Cell(6, 1).InsertTable(dataSet.Tables[0]);


                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ReporteConsumoServicioFarmacia.xlsx");
                }
            }
        }


    }
}
