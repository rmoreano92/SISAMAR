using CapaDatos;
using ClosedXML.Excel;
using DocumentFormat.OpenXml.Office2013.Excel;
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

namespace WebAppMaternidad.Areas.Farmacia
{
    public class ReportesFarmaciaController: Controller
    {
        private IWebHostEnvironment _hostingEnvironment;

        public ReportesFarmaciaController(IWebHostEnvironment env)
        {
            _hostingEnvironment = env;
        }

        [HttpPost]
        public async Task<ActionResult> ListarDisponibilidadFarmacia() 
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DalReportesFarmacia daoReportesFarmacia = new DalReportesFarmacia();

            try
            {
                DataSet dataSet = await daoReportesFarmacia.ListarDisponibilidadFarmacia();

                return Json(new { session = true, estado = true, dataSet });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, mensaje = "Error al listar, " + ex.Message + "." });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ListarSaldosPorAlmacen(int idAlmacen, int idTipoBusqueda)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DalReportesFarmacia daoReportesFarmacia = new DalReportesFarmacia();

            try
            {
                DataSet dataSet = await daoReportesFarmacia.ListarSaldosPorAlmacen(idAlmacen, idTipoBusqueda);

                return Json(new { session = true, estado = true, dataSet });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, mensaje = "Error al listar, " + ex.Message + "." });
            }

        }

        [HttpPost]
        public async Task<ActionResult> GenerarICI(DateTime FechaInicio, DateTime FechaFin, int IdAlmacen)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalReportesFarmacia daoReportesFarmacia = new DalReportesFarmacia();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await daoReportesFarmacia.GenerarICI(FechaInicio, FechaFin, IdAlmacen);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> GenerarICI_MGP(DateTime FechaInicio, DateTime FechaFin, int IdAlmacen)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalReportesFarmacia daoReportesFarmacia = new DalReportesFarmacia();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await daoReportesFarmacia.GenerarICI_MGP(FechaInicio, FechaFin, IdAlmacen);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }



        [HttpPost]
        public async Task<ActionResult> GenerarICIDonaciones(DateTime FechaInicio, DateTime FechaFin, int IdAlmacen)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalReportesFarmacia daoReportesFarmacia = new DalReportesFarmacia();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await daoReportesFarmacia.GenerarICIDonaciones(FechaInicio, FechaFin, IdAlmacen);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> GenerarIDI(DateTime FechaInicio, DateTime FechaFin, int IdAlmacen)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalReportesFarmacia daoReportesFarmacia = new DalReportesFarmacia();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await daoReportesFarmacia.GenerarIDI(FechaInicio, FechaFin, IdAlmacen);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }



        [HttpPost]
        public async Task<ActionResult> GenerarIDIDonaciones(DateTime FechaInicio, DateTime FechaFin, int IdAlmacen)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalReportesFarmacia daoReportesFarmacia = new DalReportesFarmacia();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await daoReportesFarmacia.GenerarIDIDonaciones(FechaInicio, FechaFin, IdAlmacen);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        public async Task<IActionResult> rptDisponibilidad()
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            
            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
            sWebRootFolder = sWebRootFolder + "/Plantilla/Disponibilidad.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                //var FilaIni = 4;
                DalReportesFarmacia dalReportesFarmacia = new DalReportesFarmacia();
                //int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet dsDisponibilidad = await dalReportesFarmacia.ListarDisponibilidadFarmacia();

                var wsHoja1 = workbook.Worksheets.First();

                wsHoja1.Cell(4, 1).InsertData(dsDisponibilidad.Tables[0]);

                for (int i = 0; i < dsDisponibilidad.Tables[0].Rows.Count; i++)
                {
                    /*
                    wsHoja1.Cell(FilaIni + j, 1).Value = dsTabla.Tables[0].Rows[j]["Fila"].ToString();
                    wsHoja1.Cell(FilaIni + j, 2).Value = dsTabla.Tables[0].Rows[j]["HistoriaClinica"].ToString();
                    wsHoja1.Cell(FilaIni + j, 3).Value = dsTabla.Tables[0].Rows[j]["ApellidoPaterno"].ToString();
                    wsHoja1.Cell(FilaIni + j, 4).Value = dsTabla.Tables[0].Rows[j]["ApellidoMaterno"].ToString();
                    */
                    //wsHoja1.Cell(FilaIni + i, 1).Value = dsDisponibilidad.Tables[0].Rows[i]["Codigo"].ToString();
                    //wsHoja1.Cell(FilaIni + i, 1).InsertTable(dsDisponibilidad.Tables[0]);
                }

                //wsHoja1.Cell(FilaIni + dsTabla.Tables[0].Rows.Count + 2, 1).Value = "Fecha :" + DateTime.Now.ToLongDateString();

                //if (idServicio == -1)
                //{
                //    Servicio = "TODOS";
                //}
                //wsHoja1.Cell(3, 20).Value = Servicio;



                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Disponibilidad.xlsx");
                }
            }
        }

        public async Task<IActionResult> rptSaldosPorAlamacen(int idAlmacen, int idTipoBusqueda)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
            sWebRootFolder = sWebRootFolder + "/Plantilla/SaldosPorAlmacen.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                //var FilaIni = 4;
                DalReportesFarmacia dalReportesFarmacia = new DalReportesFarmacia();
                //int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet dsSaldosFarmAlmacen = await dalReportesFarmacia.ListarSaldosPorAlmacen(idAlmacen, idTipoBusqueda);

                var wsHoja1 = workbook.Worksheets.First();

                //wsHoja1.Cell(4, 1).InsertData(dsSaldosFarmAlmacen.Tables[0]);
                wsHoja1.Cell(4, 1).InsertTable(dsSaldosFarmAlmacen.Tables[0]);

                //for (int i = 0; i < dsDisponibilidad.Tables[0].Rows.Count; i++)
                //{
                //    /*
                //    wsHoja1.Cell(FilaIni + j, 1).Value = dsTabla.Tables[0].Rows[j]["Fila"].ToString();
                //    wsHoja1.Cell(FilaIni + j, 2).Value = dsTabla.Tables[0].Rows[j]["HistoriaClinica"].ToString();
                //    wsHoja1.Cell(FilaIni + j, 3).Value = dsTabla.Tables[0].Rows[j]["ApellidoPaterno"].ToString();
                //    wsHoja1.Cell(FilaIni + j, 4).Value = dsTabla.Tables[0].Rows[j]["ApellidoMaterno"].ToString();
                //    */
                //    //wsHoja1.Cell(FilaIni + i, 1).Value = dsDisponibilidad.Tables[0].Rows[i]["Codigo"].ToString();
                //    //wsHoja1.Cell(FilaIni + i, 1).InsertTable(dsDisponibilidad.Tables[0]);
                //}

                //wsHoja1.Cell(FilaIni + dsTabla.Tables[0].Rows.Count + 2, 1).Value = "Fecha :" + DateTime.Now.ToLongDateString();

                //if (idServicio == -1)
                //{
                //    Servicio = "TODOS";
                //}
                //wsHoja1.Cell(3, 20).Value = Servicio;



                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "SaldosPorAlmacen.xlsx");
                }
            }
        }

        public async Task<IActionResult> rptGeneraICI(DateTime FechaInicio, DateTime FechaFin, int IdAlmacen)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
            sWebRootFolder = sWebRootFolder + "/Plantilla/Farmacia/formatoICI.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                //var FilaIni = 4;
                DalReportesFarmacia dalReportesFarmacia = new DalReportesFarmacia();
                //int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet dsCabeceraICI = await dalReportesFarmacia.GenerarCabeceraICI(FechaInicio, FechaFin, IdAlmacen);
                DataSet dsICI = await dalReportesFarmacia.GenerarICI(FechaInicio, FechaFin, IdAlmacen);

                var wsHoja1 = workbook.Worksheets.First();

                wsHoja1.Cell(2, 5).Value = dsCabeceraICI.Tables[0].Rows[0]["Ventas"].ToString();
                wsHoja1.Cell(2, 7).Value = dsCabeceraICI.Tables[0].Rows[0]["Sis"].ToString();
                wsHoja1.Cell(2, 9).Value = dsCabeceraICI.Tables[0].Rows[0]["IntervSan"].ToString();
                
                
                //wsHoja1.Cell(4, 1).InsertData(dsSaldosFarmAlmacen.Tables[0]);
                wsHoja1.Cell(4, 1).InsertTable(dsICI.Tables[0]);


                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ICI.xlsx");
                }
            }
        }

        public async Task<IActionResult> rptGeneraICIDonaciones(DateTime FechaInicio, DateTime FechaFin, int IdAlmacen)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
            sWebRootFolder = sWebRootFolder + "/Plantilla/Farmacia/formatoICIDonaciones.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                //var FilaIni = 4;
                DalReportesFarmacia dalReportesFarmacia = new DalReportesFarmacia();
                //int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet dsICI = await dalReportesFarmacia.GenerarICIDonaciones(FechaInicio, FechaFin, IdAlmacen);

                var wsHoja1 = workbook.Worksheets.First();


                //wsHoja1.Cell(4, 1).InsertData(dsSaldosFarmAlmacen.Tables[0]);
                wsHoja1.Cell(4, 1).InsertTable(dsICI.Tables[0]);


                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ICIDonaciones.xlsx");
                }
            }
        }

        //------------------------------------ IDI
        public async Task<IActionResult> rptGeneraIDI(DateTime FechaInicio, DateTime FechaFin, int IdAlmacen)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
            sWebRootFolder = sWebRootFolder + "/Plantilla/Farmacia/formatoIDI.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                //var FilaIni = 4;
                DalReportesFarmacia dalReportesFarmacia = new DalReportesFarmacia();
                //int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet dsCabeceraICI = await dalReportesFarmacia.GenerarCabeceraIDI(FechaInicio, FechaFin, IdAlmacen);
                DataSet dsICI = await dalReportesFarmacia.GenerarIDI(FechaInicio, FechaFin, IdAlmacen);

                var wsHoja1 = workbook.Worksheets.First();

                //wsHoja1.Cell(2, 5).Value = dsCabeceraICI.Tables[0].Rows[0]["Ventas"].ToString();
                //wsHoja1.Cell(2, 7).Value = dsCabeceraICI.Tables[0].Rows[0]["Sis"].ToString();
                //wsHoja1.Cell(2, 9).Value = dsCabeceraICI.Tables[0].Rows[0]["IntervSan"].ToString();


                //wsHoja1.Cell(4, 1).InsertData(dsSaldosFarmAlmacen.Tables[0]);
                wsHoja1.Cell(4, 1).InsertTable(dsICI.Tables[0]);


                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ICI.xlsx");
                }
            }
        }

        public async Task<IActionResult> rptGeneraIDIDonaciones(DateTime FechaInicio, DateTime FechaFin, int IdAlmacen)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
            sWebRootFolder = sWebRootFolder + "/Plantilla/Farmacia/formatoICIDonaciones.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                //var FilaIni = 4;
                DalReportesFarmacia dalReportesFarmacia = new DalReportesFarmacia();
                //int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet dsICI = await dalReportesFarmacia.GenerarIDIDonaciones(FechaInicio, FechaFin, IdAlmacen);

                var wsHoja1 = workbook.Worksheets.First();


                //wsHoja1.Cell(4, 1).InsertData(dsSaldosFarmAlmacen.Tables[0]);
                wsHoja1.Cell(4, 1).InsertTable(dsICI.Tables[0]);


                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ICIDonaciones.xlsx");
                }
            }
        }


        [HttpPost]
        public async Task<ActionResult> ListarSaldosPorAlmacenConFechaCorte(int idTipoAlmacen, DateTime fechaCorte)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalReportesFarmacia daoReportesFarmacia = new DalReportesFarmacia();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await daoReportesFarmacia.ListarSaldosPorAlmacenConFechaCorte(idTipoAlmacen, fechaCorte);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        public async Task<IActionResult> rptGeneraSaldosPorAlmacenConFechaCorte(int idTipoAlmacen, DateTime fechaCorte)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
            sWebRootFolder = sWebRootFolder + "/Plantilla/Farmacia/saldosPorAlmacenConFechaCorte.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                //var FilaIni = 4;
                DalReportesFarmacia dalReportesFarmacia = new DalReportesFarmacia();
                //int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet dataSet = await dalReportesFarmacia.ListarSaldosPorAlmacenConFechaCorte(idTipoAlmacen, fechaCorte);

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

        [HttpPost]
        public async Task<ActionResult> EmpleadosSeleccionarTodos()
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalReportesFarmacia daoReportesFarmacia = new DalReportesFarmacia();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await daoReportesFarmacia.EmpleadosSeleccionarTodos();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        ///////////////////////////////////////KHOYOSI////////////////////////////////////////////////////////////////////
        [HttpPost]
        public async Task<ActionResult> ListarUsuarioFarmaciaConsumoServicio()
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalReportesFarmacia daoReportesFarmacia = new DalReportesFarmacia();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await daoReportesFarmacia.ListarUsuarioFarmaciaConsumoServicio();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        public async Task<IActionResult> rptListarConsumoServicioCPTFarmacia(string fechaInicio, string fechaFin, int idUsuario)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
            sWebRootFolder = sWebRootFolder + "/Plantilla/Farmacia/ReporteConsumoServicioFarmacia.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                //var FilaIni = 4;
                DalReportesFarmacia dalReportesFarmacia = new DalReportesFarmacia();
                //int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet dataSet = await dalReportesFarmacia.ListarConsumoServicioFarmacia(fechaInicio, fechaFin, idUsuario);

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

        public async Task<IActionResult> rptListarRecetasEmitidas(string fechaInicio, string fechaFin, int idUsuario, int idEstado)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
            sWebRootFolder = sWebRootFolder + "/Plantilla/Farmacia/ReporteRecetasEmitidas.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                //var FilaIni = 4;
                DalReportesFarmacia dalReportesFarmacia = new DalReportesFarmacia();
                //int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet dataSet = await dalReportesFarmacia.ListarRecetasEmitidas(fechaInicio, fechaFin, idUsuario, idEstado);

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
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ReporteRecetasEmitidas.xlsx");
                }
            }
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        public async Task<IActionResult> rptProductosEnDesabastecimiento(int idTipoAlmacen, DateTime fechaCorte)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
            sWebRootFolder = sWebRootFolder + "/Plantilla/Farmacia/ProductosEnDesabastecimiento.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                //var FilaIni = 4;
                DalReportesFarmacia dalReportesFarmacia = new DalReportesFarmacia();
                //int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet dataSet = await dalReportesFarmacia.ListarProductosEnDesabastecimiento();

                var wsHoja1 = workbook.Worksheets.First();

                //wsHoja1.Cell(2, 5).Value = dsCabeceraICI.Tables[0].Rows[0]["Ventas"].ToString();
                //wsHoja1.Cell(2, 7).Value = dsCabeceraICI.Tables[0].Rows[0]["Sis"].ToString();
                //wsHoja1.Cell(2, 9).Value = dsCabeceraICI.Tables[0].Rows[0]["IntervSan"].ToString();


                //wsHoja1.Cell(4, 1).InsertData(dsSaldosFarmAlmacen.Tables[0]);
                wsHoja1.Cell(14, 1).InsertTable(dataSet.Tables[0]);


                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "SaldosPorAlmacen.xlsx");
                }
            }
        }

        public async Task<IActionResult> rptProductosEnSobrestock(int idTipoAlmacen, DateTime fechaCorte)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
            sWebRootFolder = sWebRootFolder + "/Plantilla/Farmacia/ProductosEnSobrestock.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                //var FilaIni = 4;
                DalReportesFarmacia dalReportesFarmacia = new DalReportesFarmacia();
                //int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet dataSet = await dalReportesFarmacia.ListarProductosEnSobrestock();

                var wsHoja1 = workbook.Worksheets.First();

                //wsHoja1.Cell(2, 5).Value = dsCabeceraICI.Tables[0].Rows[0]["Ventas"].ToString();
                //wsHoja1.Cell(2, 7).Value = dsCabeceraICI.Tables[0].Rows[0]["Sis"].ToString();
                //wsHoja1.Cell(2, 9).Value = dsCabeceraICI.Tables[0].Rows[0]["IntervSan"].ToString();


                //wsHoja1.Cell(4, 1).InsertData(dsSaldosFarmAlmacen.Tables[0]);
                wsHoja1.Cell(14, 1).InsertTable(dataSet.Tables[0]);


                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "SaldosPorAlmacen.xlsx");
                }
            }
        }


        public async Task<IActionResult> rptListarMedicamentosPorVencer(int rango, int tipo)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
            sWebRootFolder = sWebRootFolder + "/Plantilla/Farmacia/ProductosPorVencer.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                //var FilaIni = 4;
                DalReportesFarmacia dalReportesFarmacia = new DalReportesFarmacia();
                //int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet dataSet = await dalReportesFarmacia.ListarMedicamentosPorVencer(rango, tipo);

                var wsHoja1 = workbook.Worksheets.First();

                //wsHoja1.Cell(2, 5).Value = dsCabeceraICI.Tables[0].Rows[0]["Ventas"].ToString();
                //wsHoja1.Cell(2, 7).Value = dsCabeceraICI.Tables[0].Rows[0]["Sis"].ToString();
                //wsHoja1.Cell(2, 9).Value = dsCabeceraICI.Tables[0].Rows[0]["IntervSan"].ToString();


                //wsHoja1.Cell(4, 1).InsertData(dsSaldosFarmAlmacen.Tables[0]);
                wsHoja1.Cell(8, 1).InsertTable(dataSet.Tables[0]);


                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "SaldosPorAlmacen.xlsx");
                }
            }
        }


        public async Task<IActionResult> rptMovimientoFajos(DateTime? FechaInicio, DateTime? FechaFin, int? idAlmacen, string movTipo, int idUsuario, int idTipoFinanciamiento, int idTipoServicio, int idServicio)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
            sWebRootFolder = sWebRootFolder + "/Plantilla/Farmacia/ReporteFajos.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                //var FilaIni = 4;
                DalReportesFarmacia dalReportesFarmacia = new DalReportesFarmacia();

                if(idUsuario == 0)
                {
                    idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                }

                DataSet dataSet = await dalReportesFarmacia.SeleccionarMovimientosReporteFajos(FechaInicio, FechaFin, idAlmacen, movTipo, idUsuario, idTipoFinanciamiento, idTipoServicio, idServicio);

                var wsHoja1 = workbook.Worksheets.First();

                DataTable table = dataSet.Tables[0]; // Asumiendo que el DataTable es la primera tabla del DataSet
                StringBuilder sb = new StringBuilder();

                foreach (DataRow row in table.Rows)
                {
                    if (sb.Length > 0)
                    {
                        sb.Append(","); // Añade la coma antes de cada número, excepto el primero
                    }
                    sb.Append(row["DocumentoNumero"].ToString()); // Añade el valor de la columna DocumentoNumero
                }



                wsHoja1.Cell(2, 1).Value = sb.ToString();
                //wsHoja1.Cell(2, 7).Value = dsCabeceraICI.Tables[0].Rows[0]["Sis"].ToString();
                //wsHoja1.Cell(2, 9).Value = dsCabeceraICI.Tables[0].Rows[0]["IntervSan"].ToString();


                //wsHoja1.Cell(4, 1).InsertData(dsSaldosFarmAlmacen.Tables[0]);
                if(dataSet.Tables.Count > 1)
                {
                    wsHoja1.Cell(8, 1).InsertTable(dataSet.Tables[1]);
                }
                


                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ReporteFajos.xlsx");
                }
            }
        }


        public async Task<IActionResult> rptRecetasPorServicio(int? IdAlmacen, int? IdTipo, DateTime? FechaInicio, DateTime? FechaFin)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
            sWebRootFolder = sWebRootFolder + "/Plantilla/Farmacia/ReporteRecetasPorServicio.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                //var FilaIni = 4;
                DalReportesFarmacia dalReportesFarmacia = new DalReportesFarmacia();


                DataSet dataSet = await dalReportesFarmacia.RptRecetasPorServicio(IdAlmacen, IdTipo, FechaInicio, FechaFin);

                var wsHoja1 = workbook.Worksheets.First();

                DataTable table = dataSet.Tables[0]; // Asumiendo que el DataTable es la primera tabla del DataSet
               


                wsHoja1.Cell(3, 1).Value = table.Rows[0]["Fechas"].ToString();
                wsHoja1.Cell(5, 1).Value = table.Rows[0]["Farmacia"].ToString();
                //wsHoja1.Cell(2, 7).Value = dsCabeceraICI.Tables[0].Rows[0]["Sis"].ToString();
                //wsHoja1.Cell(2, 9).Value = dsCabeceraICI.Tables[0].Rows[0]["IntervSan"].ToString();


                //wsHoja1.Cell(4, 1).InsertData(dsSaldosFarmAlmacen.Tables[0]);
                wsHoja1.Cell(8, 1).InsertTable(dataSet.Tables[1]);


                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ReporteFajos.xlsx");
                }
            }
        }

        [HttpPost]
        public async Task<ActionResult> CajaCajaSeleccionarTodos()
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalReportesFarmacia daoReportesFarmacia = new DalReportesFarmacia();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await daoReportesFarmacia.CajaCajaSeleccionarTodos();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> CajaTurnoSeleccionarTodos()
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalReportesFarmacia daoReportesFarmacia = new DalReportesFarmacia();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await daoReportesFarmacia.CajaTurnoSeleccionarTodos();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> CajerosSeleccionarTodos()
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalReportesFarmacia daoReportesFarmacia = new DalReportesFarmacia();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await daoReportesFarmacia.CajerosSeleccionarTodos();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> CajaTiposComprobanteSeleccionarTodos()
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalReportesFarmacia daoReportesFarmacia = new DalReportesFarmacia();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await daoReportesFarmacia.CajaTiposComprobanteSeleccionarTodos();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> rptRegistroDeVentas(DateTime? FechaInicio, DateTime? FechaFin, int? IdCaja, int? IdTurno, int? IdCajero, int? IdTipoComprobante, int? IdTipoReporte, int? IdVendedorFarmacia, int? IdTipo, int? IdFarmacia)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
            sWebRootFolder = sWebRootFolder + "/Plantilla/Farmacia/ReporteRegistroVentas.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                //var FilaIni = 4;
                DalReportesFarmacia dalReportesFarmacia = new DalReportesFarmacia();


                DataSet dataSet = await dalReportesFarmacia.RegistroDeVentas(FechaInicio, FechaFin, IdCaja, IdTurno, IdCajero, IdTipoComprobante, IdTipoReporte, IdVendedorFarmacia, IdTipo, IdFarmacia);

                var wsHoja1 = workbook.Worksheets.First();

                DataTable table = dataSet.Tables[0]; // Asumiendo que el DataTable es la primera tabla del DataSet



                //wsHoja1.Cell(3, 1).Value = table.Rows[0]["Fechas"].ToString();
                //wsHoja1.Cell(5, 1).Value = table.Rows[0]["Farmacia"].ToString();
                //wsHoja1.Cell(2, 7).Value = dsCabeceraICI.Tables[0].Rows[0]["Sis"].ToString();
                //wsHoja1.Cell(2, 9).Value = dsCabeceraICI.Tables[0].Rows[0]["IntervSan"].ToString();


                //wsHoja1.Cell(4, 1).InsertData(dsSaldosFarmAlmacen.Tables[0]);
                wsHoja1.Cell(8, 1).InsertTable(dataSet.Tables[1]);


                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ReporteFajos.xlsx");
                }
            }
        }

        public async Task<IActionResult> ReporteConsumoPorServicioFarmacia(DateTime FechaInicio, DateTime FechaFin, int IdAlmacenOrigen, int IdTipoServicio)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
            sWebRootFolder = sWebRootFolder + "/Plantilla/Farmacia/ReporteConsumoPorServicioDeFarmaciaDetalle.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                //var FilaIni = 4;
                DalReportesFarmacia dalReportesFarmacia = new DalReportesFarmacia();
                //int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet dataSet = await dalReportesFarmacia.ReporteConsumoPorServicioFarmacia(FechaInicio, FechaFin, IdAlmacenOrigen, IdTipoServicio);

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


        public async Task<IActionResult> rptListarTotalVentasFarmacia(int idFarmacia, string fechaInicio, string fechaFin, int tipoReporte, string farmacia)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
            sWebRootFolder = sWebRootFolder + "/Plantilla/Farmacia/ReporteTotalVentas.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                //var FilaIni = 4;
                DalReportesFarmacia dalReportesFarmacia = new DalReportesFarmacia();
                //int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet dataSet = await dalReportesFarmacia.ListarReporteTotalVentas(idFarmacia, fechaInicio, fechaFin, tipoReporte);

                if (dataSet.Tables[0].Rows.Count > 0)
                {
                    var wsHoja1 = workbook.Worksheets.First();

                    //wsHoja1.Cell(2, 5).Value = dsCabeceraICI.Tables[0].Rows[0]["Ventas"].ToString();
                    //wsHoja1.Cell(2, 7).Value = dsCabeceraICI.Tables[0].Rows[0]["Sis"].ToString();
                    //wsHoja1.Cell(2, 9).Value = dsCabeceraICI.Tables[0].Rows[0]["IntervSan"].ToString();


                    //wsHoja1.Cell(4, 1).InsertData(dsSaldosFarmAlmacen.Tables[0]);
                    wsHoja1.Cell(5, 2).Value = farmacia;


                    wsHoja1.Cell(7, 1).InsertTable(dataSet.Tables[0]);

                    // Listado Admision 
                    using (var stream = new MemoryStream())
                    {
                        workbook.SaveAs(stream);
                        var content = stream.ToArray();
                        return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ReporteTotalVentas.xlsx");
                    }
                }
                else
                {
                    return NoContent();
                }

                    
            }
        }


        public async Task<IActionResult> rptListarPsicotropicosFarmacia(int idFarmacia, string tipo, string fechaInicio, string horaInicio, string fechaFin, string horaFin, string farmacia, string tipoReporte)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
            sWebRootFolder = sWebRootFolder + "/Plantilla/Farmacia/ReportePsicotropicos.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                //var FilaIni = 4;
                DalReportesFarmacia dalReportesFarmacia = new DalReportesFarmacia();
                //int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet dataSet = await dalReportesFarmacia.ListarReportePsicotropicos(idFarmacia, tipo, fechaInicio, horaInicio, fechaFin, horaFin);

                var wsHoja1 = workbook.Worksheets.First();
                wsHoja1.Cell(5, 3).Value = farmacia;
                wsHoja1.Cell(6, 3).Value = tipoReporte;
                wsHoja1.Cell(7, 3).Value = fechaInicio + " " + horaInicio + " al " + fechaFin + " " + horaFin;

                if (dataSet.Tables[0].Rows.Count > 0 && dataSet.Tables[1].Rows.Count > 0 && dataSet.Tables[2].Rows.Count > 0)
                {
                    
                    DataTable cabecera = dataSet.Tables[0]; // Selecciona la primera tabla del DataSet
                    DataTable detalle = dataSet.Tables[1]; // Selecciona la segunda tabla del DataSet
                    DataTable balance = dataSet.Tables[2]; // Selecciona la tercer tabla del DataSet
                    int columnaExcel, stock, fila, filaTemp;
                    string movNumero;

                    /////////////////////////////////////CABECERA REPORTE/////////////////////////////////////////////////
                    columnaExcel = 0;
                    stock = 0;
                    foreach (DataRow row in cabecera.Rows)
                    {
                        columnaExcel = Int32.Parse(row["ColumnaExcel"].ToString());
                        stock = Int32.Parse(row["Stock"].ToString());
                        wsHoja1.Cell(10, columnaExcel).Value = row["Producto"].ToString();
                        wsHoja1.Cell(11, columnaExcel).Value = stock;

                        wsHoja1.Cell(12, columnaExcel).Value = "Debe";
                        wsHoja1.Cell(12, columnaExcel + 1).Value = "Haber";



                        wsHoja1.Cell(10, columnaExcel).Style.Border.OutsideBorder = ClosedXML.Excel.XLBorderStyleValues.Thin;
                        wsHoja1.Cell(10, columnaExcel).Style.Border.OutsideBorderColor = ClosedXML.Excel.XLColor.Black;

                        wsHoja1.Cell(10, columnaExcel + 1).Style.Border.OutsideBorder = ClosedXML.Excel.XLBorderStyleValues.Thin;
                        wsHoja1.Cell(10, columnaExcel + 1).Style.Border.OutsideBorderColor = ClosedXML.Excel.XLColor.Black;

                        wsHoja1.Cell(12, columnaExcel).Style.Border.OutsideBorder = ClosedXML.Excel.XLBorderStyleValues.Thin;
                        wsHoja1.Cell(12, columnaExcel).Style.Border.OutsideBorderColor = ClosedXML.Excel.XLColor.Black;

                        wsHoja1.Cell(12, columnaExcel + 1).Style.Border.OutsideBorder = ClosedXML.Excel.XLBorderStyleValues.Thin;
                        wsHoja1.Cell(12, columnaExcel + 1).Style.Border.OutsideBorderColor = ClosedXML.Excel.XLColor.Black;
                    }

                    /////////////////////////////////////DETALLE REPORTE///////////////////////////////////////////
                    columnaExcel = 0;
                    movNumero = "";
                    fila = 13;
                    filaTemp = fila;
                    foreach (DataRow row in detalle.Rows)
                    {
                        columnaExcel = Int32.Parse(row["ColumnaExcel"].ToString());
                        if (movNumero != row["MovNumero"].ToString())
                        {
                            filaTemp = fila;

                            wsHoja1.Cell(fila, 1).Value = row["Mes"].ToString();
                            wsHoja1.Cell(fila, 2).Value = row["Dia"].ToString();
                            wsHoja1.Cell(fila, 3).Value = row["Medico"].ToString();
                            wsHoja1.Cell(fila, 4).Value = row["Paciente"].ToString();
                            wsHoja1.Cell(fila, 5).Value = row["NroReceta"].ToString();

                            wsHoja1.Cell(fila, columnaExcel).Value = row["Debe"].ToString();
                            wsHoja1.Cell(fila, columnaExcel + 1).Value = row["Haber"].ToString();

                            //---------------------------------------------------------------------//
                            wsHoja1.Cell(fila, 1).Style.Font.FontSize = 10;
                            wsHoja1.Cell(fila, 2).Style.Font.FontSize = 10;
                            wsHoja1.Cell(fila, 3).Style.Font.FontSize = 10;
                            wsHoja1.Cell(fila, 4).Style.Font.FontSize = 10;
                            wsHoja1.Cell(fila, 5).Style.Font.FontSize = 10;

                            wsHoja1.Cell(fila, columnaExcel).Style.Font.FontSize = 10;
                            wsHoja1.Cell(fila, columnaExcel + 1).Style.Font.FontSize = 10;

                            movNumero = row["MovNumero"].ToString();

                            fila++;
                        }
                        else
                        {
                            wsHoja1.Cell(filaTemp, columnaExcel).Value = row["Debe"].ToString();
                            wsHoja1.Cell(filaTemp, columnaExcel + 1).Value = row["Haber"].ToString();

                            //---------------------------------------------------------------------//
                            wsHoja1.Cell(filaTemp, columnaExcel).Style.Font.FontSize = 10;
                            wsHoja1.Cell(filaTemp, columnaExcel + 1).Style.Font.FontSize = 10;
                        }

                    }

                    ///////////////////////BALANCE///////////////////////////////////////////
                    columnaExcel = 0;
                    fila++;
                    wsHoja1.Cell(fila, 4).Value = "SALDO";
                    wsHoja1.Cell(fila + 1, 4).Value = "BALANCE " + fechaFin + " " + horaFin;

                    wsHoja1.Cell(fila, 4).Style.Border.OutsideBorder = ClosedXML.Excel.XLBorderStyleValues.Thin;
                    wsHoja1.Cell(fila, 4).Style.Border.OutsideBorderColor = ClosedXML.Excel.XLColor.Black;

                    wsHoja1.Cell(fila + 1, 4).Style.Border.OutsideBorder = ClosedXML.Excel.XLBorderStyleValues.Thin;
                    wsHoja1.Cell(fila + 1, 4).Style.Border.OutsideBorderColor = ClosedXML.Excel.XLColor.Black;

                    foreach (DataRow row in balance.Rows)
                    {
                        columnaExcel = Int32.Parse(row["ColumnaExcel"].ToString());
                        
                        wsHoja1.Cell(fila, columnaExcel).Value = row["SaldoDebeFinal"].ToString();
                        wsHoja1.Cell(fila, columnaExcel + 1).Value = row["SaldoHaberFinal"].ToString();

                        wsHoja1.Cell(fila + 1, columnaExcel).Value = row["Balance"].ToString();

                        //------------------------------------------------------------------------------------------------//
                        wsHoja1.Cell(fila, columnaExcel).Style.Border.OutsideBorder = ClosedXML.Excel.XLBorderStyleValues.Thin;
                        wsHoja1.Cell(fila, columnaExcel).Style.Border.OutsideBorderColor = ClosedXML.Excel.XLColor.Black;

                        wsHoja1.Cell(fila, columnaExcel + 1).Style.Border.OutsideBorder = ClosedXML.Excel.XLBorderStyleValues.Thin;
                        wsHoja1.Cell(fila, columnaExcel + 1).Style.Border.OutsideBorderColor = ClosedXML.Excel.XLColor.Black;

                        wsHoja1.Cell(fila + 1, columnaExcel).Style.Border.OutsideBorder = ClosedXML.Excel.XLBorderStyleValues.Thin;
                        wsHoja1.Cell(fila + 1, columnaExcel).Style.Border.OutsideBorderColor = ClosedXML.Excel.XLColor.Black;

                        wsHoja1.Cell(fila + 1, columnaExcel + 1).Style.Border.OutsideBorder = ClosedXML.Excel.XLBorderStyleValues.Thin;
                        wsHoja1.Cell(fila + 1, columnaExcel + 1).Style.Border.OutsideBorderColor = ClosedXML.Excel.XLColor.Black;
                    }

                    //wsHoja1.Cell(10, 1).InsertTable(dataSet.Tables[0]);

                    // Listado Admision 
                    using (var stream = new MemoryStream())
                    {
                        workbook.SaveAs(stream);
                        var content = stream.ToArray();
                        return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ReportePsicotropicos.xlsx");
                    }
                }
                else
                {
                    return NoContent();
                }

                    
            }
        }


        public async Task<IActionResult> rptListarAntimicrobianosFarmacia(int idFarmacia, int idServicio, string fechaInicio, string fechaFin, string farmacia, string servicio)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
            sWebRootFolder = sWebRootFolder + "/Plantilla/Farmacia/ReporteAntimicrobianos.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                //var FilaIni = 4;
                DalReportesFarmacia dalReportesFarmacia = new DalReportesFarmacia();
                //int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet dataSet = await dalReportesFarmacia.ListarReporteAntimicrobianos(idFarmacia, idServicio, fechaInicio, fechaFin);

                var wsHoja1 = workbook.Worksheets.First(); // Hoja en la posición 1
                var wsHoja2 = workbook.Worksheet(2); // Hoja en la posición 2
                var wsHoja3 = workbook.Worksheet(3); // Hoja en la posición 3

                wsHoja1.Cell(5, 3).Value = farmacia;
                wsHoja1.Cell(6, 3).Value = servicio;
                //wsHoja1.Cell(7, 3).Value = fechaInicio + " " + horaInicio + " al " + fechaFin + " " + horaFin;
                wsHoja1.Cell(7, 3).Value = fechaInicio + " al " + fechaFin;

                if (dataSet.Tables[0].Rows.Count > 0 && dataSet.Tables[1].Rows.Count > 0)
                {

                    if (dataSet.Tables[0].Rows.Count > 0 || dataSet.Tables[1].Rows.Count > 0)
                    {
                        DataTable cabecera = dataSet.Tables[0]; // Selecciona la primera tabla del DataSet
                        DataTable detalle = dataSet.Tables[1]; // Selecciona la segunda tabla del DataSet
                                                               //DataTable balance = dataSet.Tables[2]; // Selecciona la tercer tabla del DataSet
                        int columnaExcel, fila, filaTemp;
                        string movNumero;

                        /////////////////////////////////////CABECERA REPORTE/////////////////////////////////////////////////
                        columnaExcel = 0;
                        foreach (DataRow row in cabecera.Rows)
                        {
                            columnaExcel = Int32.Parse(row["ColumnaExcel"].ToString());
                            //stock = Int32.Parse(row["Stock"].ToString());
                            wsHoja1.Cell(10, columnaExcel).Value = row["Producto"].ToString();
                            //wsHoja1.Cell(11, columnaExcel).Value = stock;

                            //wsHoja1.Cell(12, columnaExcel).Value = "Debe";
                            //wsHoja1.Cell(12, columnaExcel + 1).Value = "Haber";



                            wsHoja1.Cell(10, columnaExcel).Style.Border.OutsideBorder = ClosedXML.Excel.XLBorderStyleValues.Thin;
                            wsHoja1.Cell(10, columnaExcel).Style.Border.OutsideBorderColor = ClosedXML.Excel.XLColor.Black;

                            wsHoja1.Cell(10, columnaExcel + 1).Style.Border.OutsideBorder = ClosedXML.Excel.XLBorderStyleValues.Thin;
                            wsHoja1.Cell(10, columnaExcel + 1).Style.Border.OutsideBorderColor = ClosedXML.Excel.XLColor.Black;

                            //wsHoja1.Cell(12, columnaExcel).Style.Border.OutsideBorder = ClosedXML.Excel.XLBorderStyleValues.Thin;
                            //wsHoja1.Cell(12, columnaExcel).Style.Border.OutsideBorderColor = ClosedXML.Excel.XLColor.Black;

                            //wsHoja1.Cell(12, columnaExcel + 1).Style.Border.OutsideBorder = ClosedXML.Excel.XLBorderStyleValues.Thin;
                            //wsHoja1.Cell(12, columnaExcel + 1).Style.Border.OutsideBorderColor = ClosedXML.Excel.XLColor.Black;
                        }

                        /////////////////////////////////////DETALLE REPORTE///////////////////////////////////////////
                        columnaExcel = 0;
                        movNumero = "";
                        fila = 11;
                        filaTemp = fila;
                        foreach (DataRow row in detalle.Rows)
                        {
                            columnaExcel = Int32.Parse(row["ColumnaExcel"].ToString());
                            if (movNumero != row["MovNumero"].ToString())
                            {
                                filaTemp = fila;

                                wsHoja1.Cell(fila, 1).Value = row["Mes"].ToString();
                                wsHoja1.Cell(fila, 2).Value = row["Dia"].ToString();
                                wsHoja1.Cell(fila, 3).Value = row["Medico"].ToString();
                                wsHoja1.Cell(fila, 4).Value = row["Historia"].ToString();
                                wsHoja1.Cell(fila, 5).Value = row["Paciente"].ToString();
                                wsHoja1.Cell(fila, 6).Value = row["NroReceta"].ToString();

                                //wsHoja1.Cell(fila, columnaExcel).Value = row["/"].ToString();
                                //wsHoja1.Cell(fila, columnaExcel + 1).Value = row["Haber"].ToString();
                                wsHoja1.Cell(fila, columnaExcel).Value = row["Cantidad"].ToString();

                                //---------------------------------------------------------------------//
                                wsHoja1.Cell(fila, 1).Style.Font.FontSize = 10;
                                wsHoja1.Cell(fila, 2).Style.Font.FontSize = 10;
                                wsHoja1.Cell(fila, 3).Style.Font.FontSize = 10;
                                wsHoja1.Cell(fila, 4).Style.Font.FontSize = 10;
                                wsHoja1.Cell(fila, 5).Style.Font.FontSize = 10;
                                wsHoja1.Cell(fila, 6).Style.Font.FontSize = 10;

                                wsHoja1.Cell(fila, columnaExcel).Style.Font.FontSize = 10;
                                //wsHoja1.Cell(fila, columnaExcel + 1).Style.Font.FontSize = 10;

                                movNumero = row["MovNumero"].ToString();

                                fila++;
                            }
                            else
                            {
                                //wsHoja1.Cell(filaTemp, columnaExcel).Value = row["Debe"].ToString();
                                //wsHoja1.Cell(filaTemp, columnaExcel + 1).Value = row["Haber"].ToString();

                                wsHoja1.Cell(filaTemp, columnaExcel).Value = row["Cantidad"].ToString();

                                //---------------------------------------------------------------------//
                                wsHoja1.Cell(filaTemp, columnaExcel).Style.Font.FontSize = 10;
                                //wsHoja1.Cell(filaTemp, columnaExcel + 1).Style.Font.FontSize = 10;
                            }

                        }


                        ///////////////////////////CONSOLIDADO CONSUMO MEIDCAMENTOS//////////////////////////////
                        DataTable consumo = dataSet.Tables[2]; // Selecciona la segunda tabla del DataSet
                        fila = 2;
                        int totalConsumo = 0;
                        double precioTotal = 0.00;
                        double costoTotal = 0.00;

                        int cantidadFilas = consumo.Rows.Count;

                        // Insertar filas nuevas antes del pie de página
                        wsHoja2.Row(fila).InsertRowsAbove(cantidadFilas);
                        
                        foreach (DataRow row in consumo.Rows)
                        {
                            wsHoja2.Row(fila).Style.Font.Bold = false;

                            wsHoja2.Cell(fila, 1).Value = row["posicion"].ToString();
                            wsHoja2.Cell(fila, 2).Value = row["codigo"].ToString();
                            wsHoja2.Cell(fila, 3).Value = row["nombre"].ToString();
                            wsHoja2.Cell(fila, 4).Value = row["Cantidad"].ToString();
                            wsHoja2.Cell(fila, 5).Value = row["Precio"].ToString();
                            wsHoja2.Cell(fila, 6).Value = row["Total"].ToString();

                            totalConsumo += Int32.Parse(row["Cantidad"].ToString());
                            precioTotal += Double.Parse(row["Precio"].ToString());
                            costoTotal += Double.Parse(row["Total"].ToString());

                            fila++;
                        }

                        //wsHoja2.Cell(fila, 3).Value = "TOTAL";
                        wsHoja2.Cell(fila, 4).Value = totalConsumo.ToString();
                        wsHoja2.Cell(fila, 5).Value = precioTotal.ToString();
                        wsHoja2.Cell(fila, 6).Value = costoTotal.ToString();


                        ///////////////////////////CONSOLIDADO RECETAS//////////////////////////////
                        DataTable recetas = dataSet.Tables[3]; // Selecciona la segunda tabla del DataSet
                        fila = 2;
                        int totalRecetas = 0;

                        cantidadFilas = recetas.Rows.Count;

                        // Insertar filas nuevas antes del pie de página
                        wsHoja3.Row(fila).InsertRowsAbove(cantidadFilas);

                        foreach (DataRow row in recetas.Rows)
                        {
                            wsHoja3.Row(fila).Style.Font.Bold = false;

                            wsHoja3.Cell(fila, 1).Value = row["posicion"].ToString();
                            wsHoja3.Cell(fila, 2).Value = row["codigo"].ToString();
                            wsHoja3.Cell(fila, 3).Value = row["nombre"].ToString();
                            wsHoja3.Cell(fila, 4).Value = row["CantidadRecetas"].ToString();

                            totalRecetas += Int32.Parse(row["CantidadRecetas"].ToString());

                            fila++;
                        }

                        //wsHoja2.Cell(fila, 3).Value = "TOTAL";
                        wsHoja3.Cell(fila, 4).Value = totalRecetas.ToString();


                    }

                                        

                    ///////////////////////BALANCE///////////////////////////////////////////
                    //columnaExcel = 0;
                    //fila++;
                    //wsHoja1.Cell(fila, 4).Value = "SALDO";
                    //wsHoja1.Cell(fila + 1, 4).Value = "BALANCE " + fechaFin + " " + horaFin;

                    //wsHoja1.Cell(fila, 4).Style.Border.OutsideBorder = ClosedXML.Excel.XLBorderStyleValues.Thin;
                    //wsHoja1.Cell(fila, 4).Style.Border.OutsideBorderColor = ClosedXML.Excel.XLColor.Black;

                    //wsHoja1.Cell(fila + 1, 4).Style.Border.OutsideBorder = ClosedXML.Excel.XLBorderStyleValues.Thin;
                    //wsHoja1.Cell(fila + 1, 4).Style.Border.OutsideBorderColor = ClosedXML.Excel.XLColor.Black;

                    //foreach (DataRow row in balance.Rows)
                    //{
                    //    columnaExcel = Int32.Parse(row["ColumnaExcel"].ToString());

                    //    wsHoja1.Cell(fila, columnaExcel).Value = row["SaldoDebeFinal"].ToString();
                    //    wsHoja1.Cell(fila, columnaExcel + 1).Value = row["SaldoHaberFinal"].ToString();

                    //    wsHoja1.Cell(fila + 1, columnaExcel).Value = row["Balance"].ToString();

                    //    //------------------------------------------------------------------------------------------------//
                    //    wsHoja1.Cell(fila, columnaExcel).Style.Border.OutsideBorder = ClosedXML.Excel.XLBorderStyleValues.Thin;
                    //    wsHoja1.Cell(fila, columnaExcel).Style.Border.OutsideBorderColor = ClosedXML.Excel.XLColor.Black;

                    //    wsHoja1.Cell(fila, columnaExcel + 1).Style.Border.OutsideBorder = ClosedXML.Excel.XLBorderStyleValues.Thin;
                    //    wsHoja1.Cell(fila, columnaExcel + 1).Style.Border.OutsideBorderColor = ClosedXML.Excel.XLColor.Black;

                    //    wsHoja1.Cell(fila + 1, columnaExcel).Style.Border.OutsideBorder = ClosedXML.Excel.XLBorderStyleValues.Thin;
                    //    wsHoja1.Cell(fila + 1, columnaExcel).Style.Border.OutsideBorderColor = ClosedXML.Excel.XLColor.Black;

                    //    wsHoja1.Cell(fila + 1, columnaExcel + 1).Style.Border.OutsideBorder = ClosedXML.Excel.XLBorderStyleValues.Thin;
                    //    wsHoja1.Cell(fila + 1, columnaExcel + 1).Style.Border.OutsideBorderColor = ClosedXML.Excel.XLColor.Black;
                    //}

                   

                    // Listado Admision 
                    using (var stream = new MemoryStream())
                    {
                        workbook.SaveAs(stream);
                        var content = stream.ToArray();
                        return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ReporteAntimicrobianos.xlsx");
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
