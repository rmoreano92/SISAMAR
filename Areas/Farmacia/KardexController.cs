using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data;
using CapaDatos;
using CapaEntidades;
using ClosedXML.Excel;
using System.IO;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Farmacia
{
    public class KardexController : BaseController
    {
        private IWebHostEnvironment _hostingEnvironment;

        public KardexController(IWebHostEnvironment env)
        {
            _hostingEnvironment = env;
        }

        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> KardexAlmacenFarmacia(int idListBar)
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
                ViewBag.itemBar = (int)Enumerados.shgIdsBar.Hospitalizacion_NotaIngreso;
                DalUtilitario dlUtilitario = new DalUtilitario();
                //List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                //TiposDiagnosticos = dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.EmergenciaIngreso);

                //ViewBag.TiposDiagnosticos = TiposDiagnosticos;
                ViewBag.Vista = (int)Enumerados.Grupo.Emergencia;
                //ViewBag.Servicio = (int)Enumerados.TiposServicio.Consultorios_Emergencia;
                ViewBag.Area = "Farmacia";
                return View("~/Views/Farmacia/Kardex.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        //////////////////////////////////KHOYOSI////////////////////////////////////////
        [HttpPost]
        public async Task<ActionResult> ListarTodosAlmacenMenosExternos()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet respuesta;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            respuesta = await daoFarmacia.ListarTodosAlmacenMenosExternos();
            return Json(respuesta);
        }

        [HttpPost]
        public async Task<ActionResult> BuscarBienInsumoPorCodigoDescripcion(string codigo, string descripcion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet respuesta;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            respuesta = await daoFarmacia.BuscarBienInsumoPorCodigoDescripcion(codigo, descripcion);
            return Json(respuesta);
        }

        [HttpPost]
        public async Task<ActionResult> LlenaDataComboTipoSalidaBienSegunAlmacen(int idAlmacen)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet respuesta;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            respuesta = await daoFarmacia.LlenaDataComboTipoSalidaBienSegunAlmacen(idAlmacen);
            return Json(respuesta);
        }

        [HttpPost]
        public async Task<ActionResult> ListarKardexFarmacia(int IdAlmacen, int IdProducto, int IdTipoBienInsumo, DateTime FechaInicio, DateTime FechaFin)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet respuesta;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            respuesta = await daoFarmacia.ListarKardexFarmacia(IdAlmacen, IdProducto, IdTipoBienInsumo, FechaInicio, FechaFin);
            return Json(respuesta);
        }


        [HttpPost]
        public async Task<ActionResult> ListarSaldosConLotes(int IdAlmacen, int IdProducto, int IdTipoBienInsumo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet respuesta;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            respuesta = await daoFarmacia.ListarSaldosConLotes(IdAlmacen, IdProducto, IdTipoBienInsumo);
            return Json(respuesta);
        }


        [HttpPost]
        public async Task<ActionResult> ActualizarFechaVencimientoDeLote(int IdAlmacen, int IdProducto, int IdTipoBienInsumo, string Lote, DateTime FechaActual, DateTime FechaNueva)
        {            
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet respuesta;
            DalFarmacia daoFarmacia = new DalFarmacia();
            string fecActual = FechaActual.ToString("yyyy-dd-MM 00:mm:ss");
            string fecNueva = FechaNueva.ToString("yyyy-dd-MM 00:mm:ss");

            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            respuesta = await daoFarmacia.ActualizarFechaVencimientoDeLote(IdAlmacen, IdProducto, IdTipoBienInsumo, Lote, fecActual, fecNueva, idUsuario);
            return Json(respuesta);
        }

        [HttpPost]
        public async Task<ActionResult> FarmaciaActualizaLote(int IdAlmacen, int IdProducto, int IdTipoBienInsumo, string Lote, DateTime FechaActual, string LoteNuevo)
        {            
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet respuesta;
            DalFarmacia daoFarmacia = new DalFarmacia();
            string fecActual = FechaActual.ToString("yyyy-dd-MM 00:mm:ss");

            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            respuesta = await daoFarmacia.FarmaciaActualizaLote(IdAlmacen, IdProducto, IdTipoBienInsumo, Lote, fecActual, LoteNuevo, idUsuario);
            return Json(respuesta);
        }

        public async Task<IActionResult> rptKardex(int IdAlmacen, int IdProducto, int IdTipoBienInsumo, DateTime FechaInicio, DateTime FechaFin)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
            sWebRootFolder = sWebRootFolder + "/Plantilla/Farmacia/Kardex.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                //var FilaIni = 4;
                DalFarmacia daoFarmacia = new DalFarmacia();
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet dataSet = await daoFarmacia.RptKardexFarmacia(IdAlmacen, IdProducto, IdTipoBienInsumo, FechaInicio, FechaFin);

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
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Kardex.xlsx");
                }
            }
        }
    }
}
