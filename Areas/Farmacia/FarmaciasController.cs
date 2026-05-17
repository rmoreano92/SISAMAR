using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAppMaternidad.CapaEntidades;
using ClosedXML.Excel;
using System.IO;
using WebAppMaternidad.CapaDatos;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using QRCoder;
using System.Drawing;
using System.Net.Mime;
using System.Text;
using WebAppMaternidad.Areas.Comun;
using System.Data.SqlClient;
using WebAppMaternidad.Connected_Services;
//using CapaDatos;
using Conexion = CapaDatos.Conexion;
using WebAppMaternidad.Controllers;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Farmacia
{
    public class FarmaciasController : BaseController
    {

        private IWebHostEnvironment _hostingEnvironment;

        public FarmaciasController(IWebHostEnvironment env)
        {
            _hostingEnvironment = env;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> FarmaciasSeleccionarSegunFiltro(string filtro)
        {
            DataSet ListaFarmacia;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaFarmacia = null;

            ListaFarmacia = await daoFarmacia.FarmaciasSeleccionarSegunFiltro(filtro);

            return Json(new { lstData = ListaFarmacia, session = true });
        }

        [HttpGet]
        public async Task<ActionResult> FarmTipoDocumentosDevuelveTodos()
        {
            DataSet ListaTipoDocumentos;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaTipoDocumentos = null;

            ListaTipoDocumentos = await daoFarmacia.FarmTipoDocumentosDevuelveTodos();

            return Json(new { lstData = ListaTipoDocumentos, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FarmTipoConceptosDevuelveParaRegistroDeNiNs(string TipoAlmacen, string TipoMov, string TipoSuministro)
        {
            DataSet ListaFarmacia;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaFarmacia = null;

            ListaFarmacia = await daoFarmacia.FarmTipoConceptosDevuelveParaRegistroDeNiNs(TipoAlmacen, TipoMov, TipoSuministro);

            return Json(new { lstData = ListaFarmacia, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FarmMovimientoDetalleDevuelveSaldosConLotesSegunAlmacenCliente(int lnIdAlmacen, string lcFiltro)
        {
            DataSet ListaProductos;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaProductos = null;

            ListaProductos = await daoFarmacia.FarmMovimientoDetalleDevuelveSaldosConLotesSegunAlmacenCliente(lnIdAlmacen, lcFiltro);

            return Json(new { lstData = ListaProductos, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FactCatalogoBienesInsumosSeleccionarBienesLike(string lcFiltro)
        {
            DataSet ListaProductos;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaProductos = null;

            ListaProductos = await daoFarmacia.FactCatalogoBienesInsumosSeleccionarBienesLike(lcFiltro);

            return Json(new { lstData = ListaProductos, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FarmMovimientoSeleccionarPorTipoYnumeroDocumento(string documentoNumero, string idTipoLocales, string MovTipo, string idTipoSuministro, string documentoIdTipo)
        {
            DataSet ListaProductos;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaProductos = null;

            ListaProductos = await daoFarmacia.FarmMovimientoSeleccionarPorTipoYnumeroDocumento(documentoNumero, idTipoLocales, MovTipo, idTipoSuministro, documentoIdTipo);

            return Json(new { lstData = ListaProductos, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FarmaciaMovimientoSeleccionarPorTipoYnumeroDocumento(string documentoNumero, string documentoIdTipo)
        {
            DataSet ListaProductos;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaProductos = null;

            ListaProductos = await daoFarmacia.FarmaciaMovimientoSeleccionarPorTipoYnumeroDocumento(documentoNumero, documentoIdTipo);

            return Json(new { lstData = ListaProductos, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FarmRelModDevuelveSegunFiltro(string Filtro)
        {
            DataSet ListaProductos;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaProductos = null;

            ListaProductos = await daoFarmacia.FarmRelModDevuelveSegunFiltro(Filtro);

            return Json(new { lstData = ListaProductos, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FarmRelModActualizaSegunFiltro(string filtro, string lcDocumento)
        {
            int resp;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            resp = 0;

            resp = await daoFarmacia.FarmRelModActualizaSegunFiltro(filtro, lcDocumento);

            return Json(new { lstData = resp, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FarmDevuelveYactualizaCorrelativosDeDocumentosES(int IdTipoDocumento)
        {
            int resp;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            resp = 0;

            resp = await daoFarmacia.FarmDevuelveYactualizaCorrelativosDeDocumentosES(IdTipoDocumento);

            return Json(new { lstData = resp, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FarmDevuelveSaldosSegunAlmacenProductoLote(int idAlmacen, int idProducto, string lote, DateTime fechaVencimiento, int idTipoSalidaBienInsumo)
        {
            DataSet ds;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            //resp = 0;

            ds = await daoFarmacia.FarmDevuelveSaldosSegunAlmacenProductoLote(idAlmacen, idProducto, lote, fechaVencimiento, idTipoSalidaBienInsumo);

            return Json(new { lstData = ds, session = true });
        }

        [HttpPost]
        public async Task<IActionResult> FarmMovimientoAgregarModificar(FarmMovimiento farmMovimiento, int esNotaIngresoAutomatica, string detalleNotaSalida)
        {

            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {
                int resp;
                DalFarmacia daoFarmacia = new DalFarmacia();
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                resp = 0;

                farmMovimiento.idUsuario = idUsuario;

                var lstObjDetalleNotaSalida = JsonConvert.DeserializeObject<List<FarmMovimientoDetalle>>(detalleNotaSalida);

                resp = await daoFarmacia.FarmMovimientoAgregarModificar(farmMovimiento, esNotaIngresoAutomatica, lstObjDetalleNotaSalida);

                return SuccessResponse(resp);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult> FarmDevuelveMovimientos(string MovTipo, int IdAlmacen, DateTime FechaInicio, DateTime FechaFin)
        {
            DataSet ds;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            //resp = 0;
            FechaInicio = FechaInicio.Date.Add(new TimeSpan(0, 1, 0)); // 00:01:00
            FechaFin = FechaFin.Date.Add(new TimeSpan(23, 59, 0)); // 23:59:00
            ds = await daoFarmacia.FarmDevuelveMovimientos(MovTipo, IdAlmacen, FechaInicio, FechaFin);

            return Json(new { lstData = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FarmMovimientoDetalleByMovNumero(string MovNumero, string MovTipo)
        {
            DataSet ds;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            //resp = 0;

            ds = await daoFarmacia.FarmMovimientoDetalleByMovNumero(MovNumero, MovTipo);

            return Json(new { lstData = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FarmTipoConceptoDevuelveParaRegistroDeNiNsSeleccionar(int IdTipoConcepto,string TipoAlmacen, string TipoMov, string TipoSuministro)
        {
            DataSet ListaFarmacia;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaFarmacia = null;

            ListaFarmacia = await daoFarmacia.FarmTipoConceptoDevuelveParaRegistroDeNiNsSeleccionar(IdTipoConcepto, TipoAlmacen, TipoMov, TipoSuministro);

            return Json(new { lstData = ListaFarmacia, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListarTiposCompraSegunFiltro(string filtro)
        {
            DataSet lstData;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            lstData = null;

            lstData = await daoFarmacia.ListarTiposCompraSegunFiltro(filtro);

            return Json(new { lstData = lstData, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListarTiposProcesoSegunFiltro(string filtro)
        {
            DataSet lstData;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            lstData = null;

            lstData = await daoFarmacia.ListarTiposProcesoSegunFiltro(filtro);

            return Json(new { lstData = lstData, session = true });
        }

        [HttpGet]
        public async Task<ActionResult> FarmUnidosisSeleccionarTodos()
        {
            DataSet lstData;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            lstData = null;

            lstData = await daoFarmacia.FarmUnidosisSeleccionarTodos();

            return Json(new { lstData = lstData, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FarmMovimientoSeleccionarSoloPorTipoYnumeroDocumentoYmovTipo(string documentoNumero, string documentoIdTipo, string MovTipo)
        {
            DataSet ListaProductos;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaProductos = null;

            ListaProductos = await daoFarmacia.FarmMovimientoSeleccionarSoloPorTipoYnumeroDocumentoYmovTipo(documentoNumero, documentoIdTipo, MovTipo);

            return Json(new { lstData = ListaProductos, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> RecetaFiltrar(string Filtro)
        {
            DataSet ListaProductos;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaProductos = null;

            ListaProductos = await daoFarmacia.RecetaFiltrar(Filtro);

            return Json(new { lstData = ListaProductos, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> DevuelveServiciosDelHospitalFiltro(string Filtro)
        {
            DataSet ListaProductos;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaProductos = null;

            ListaProductos = await daoFarmacia.DevuelveServiciosDelHospitalFiltro(Filtro);

            return Json(new { lstData = ListaProductos, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> RecetasDevuelveDatosDelDetalle(int IdReceta, int IdPuntoCarga, int PtoCargaFarmacia)
        {
            DataSet ListaProductos;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaProductos = null;

            ListaProductos = await daoFarmacia.RecetasDevuelveDatosDelDetalle(IdReceta, IdPuntoCarga, PtoCargaFarmacia);

            return Json(new { lstData = ListaProductos, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FactCatalogoBienesInsumosXcodigoYtipofinanciamiento(int IdTipoFinanciamiento, string codigo)
        {
            DataSet ListaProductos;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaProductos = null;

            ListaProductos = await daoFarmacia.FactCatalogoBienesInsumosXcodigoYtipofinanciamiento(IdTipoFinanciamiento, codigo);

            return Json(new { lstData = ListaProductos, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FarmDevuelveSaldosSegunAlmacenProducto(int idAlmacen, int idProducto)
        {
            DataSet ListaProductos;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaProductos = null;

            ListaProductos = await daoFarmacia.FarmDevuelveSaldosSegunAlmacenProducto(idAlmacen, idProducto);

            return Json(new { lstData = ListaProductos, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FarmDevuelveSaldosSegunAlmacenProductoTipoSalida(int idAlmacen, int idProducto, int idTipoSalidaBienInsumo)
        {
            DataSet ListaProductos;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaProductos = null;

            ListaProductos = await daoFarmacia.FarmDevuelveSaldosSegunAlmacenProductoTipoSalida(idAlmacen, idProducto, idTipoSalidaBienInsumo);

            return Json(new { lstData = ListaProductos, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> RecetaCabeceraPoridReceta(string lnidReceta)
        {
            DataSet ListaProductos;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaProductos = null;

            ListaProductos = await daoFarmacia.RecetaCabeceraPoridReceta(lnidReceta);

            return Json(new { lstData = ListaProductos, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> RecetaCabeceraDetalleSeleccionaPorNroReceta(string IdReceta)
        {
            DataSet ListaProductos;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaProductos = null;

            ListaProductos = await daoFarmacia.RecetaCabeceraDetalleSeleccionaPorNroReceta(IdReceta);

            return Json(new { lstData = ListaProductos, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FarmDevuelveSaldosConLotesSegunAlmacen(int IdAlmacen, int Orden, string Filtro)
        {
            DataSet ListaProductos;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaProductos = null;

            ListaProductos = await daoFarmacia.FarmDevuelveSaldosConLotesSegunAlmacen(IdAlmacen, Orden, Filtro);

            return Json(new { lstData = ListaProductos, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FarmMovimientoVentasAgregar(FarmMovimientoVentas farmMovimientoVentas)
        {
            int resp;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            resp = 0;


            //var lstObjDetalleNotaSalida = JsonConvert.DeserializeObject<List<FarmMovimientoDetalle>>(detalleNotaSalida);

            resp = await daoFarmacia.FarmMovimientoVentasAgregar(farmMovimientoVentas, idUsuario);

            return Json(new { lstData = resp, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FarmMovimientoVentasDetalleAgregar(FarmMovimientoVentasDetalle farmMovimientoVentasDetalle)
        {
            int resp;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            resp = 0;


            //var lstObjDetalleNotaSalida = JsonConvert.DeserializeObject<List<FarmMovimientoDetalle>>(detalleNotaSalida);

            resp = await daoFarmacia.FarmMovimientoVentasDetalleAgregar(farmMovimientoVentasDetalle, idUsuario);

            return Json(new { lstData = resp, session = true });
        }


        [HttpPost]
        public async Task<ActionResult> FactOrdenesBienesAgregar(int IdPuntoCarga, int IdPaciente, int IdCuentaAtencion, int? idComprobantePago, string MovNumero, string MovTipo, int idPreVenta, int IdEstadoFacturacion, string DNI, string NombPaciente)
        {
            int resp;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            resp = 0;

            MovNumero = MovNumero == "null" ? null : MovNumero;
            MovTipo = MovTipo == "null" ? null : MovTipo;


            //var lstObjDetalleNotaSalida = JsonConvert.DeserializeObject<List<FarmMovimientoDetalle>>(detalleNotaSalida);

            resp = await daoFarmacia.FactOrdenesBienesAgregar(IdPuntoCarga, IdPaciente, IdCuentaAtencion, idComprobantePago, MovNumero, MovTipo, idPreVenta, idUsuario, IdEstadoFacturacion, "0", DNI, NombPaciente);

            return Json(new { lstData = resp, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FactOrdenesBienesAgregarVentas(int IdPuntoCarga, int IdPaciente, int IdCuentaAtencion, int? idComprobantePago, string MovNumero, string MovTipo, int idPreVenta, int IdEstadoFacturacion, string DNI, string NombPaciente)
        {
            int resp;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            resp = 0;

            MovNumero = MovNumero == "null" ? null : MovNumero;
            MovTipo = MovTipo == "null" ? null : MovTipo;


            //var lstObjDetalleNotaSalida = JsonConvert.DeserializeObject<List<FarmMovimientoDetalle>>(detalleNotaSalida);

            resp = await daoFarmacia.FactOrdenesBienesAgregarVentas(IdPuntoCarga, IdPaciente, IdCuentaAtencion, idComprobantePago, MovNumero, MovTipo, idPreVenta, idUsuario, IdEstadoFacturacion, "0", DNI, NombPaciente);

            return Json(new { lstData = resp, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FarmMovimientoProgramasSeleccionar(string MovNumero)
        {
            DataSet lstData;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            lstData = await daoFarmacia.FarmMovimientoProgramasSeleccionar(MovNumero);

            return Json(new { lstData = lstData, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FarmMovimientoProgramasGuardar(FarmMovimientoProgramas farmMovimientoProgramas)
        {
            DataSet lstData;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            
            lstData = await daoFarmacia.FarmMovimientoProgramasGuardar(farmMovimientoProgramas, idUsuario);

            return Json(new { lstData = lstData, session = true });
        }

        [HttpGet]
        public async Task<ActionResult> FarmTipoRecetaDevuelveTodos()
        {
            DataSet lstData;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            lstData = null;

            lstData = await daoFarmacia.FarmTipoRecetaDevuelveTodos();

            return Json(new { lstData = lstData, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> TipoFinanciamientosDevuelveSoloFarmacia(string Filtro)
        {
            DataSet ListaProductos;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaProductos = null;

            ListaProductos = await daoFarmacia.TipoFinanciamientosDevuelveSoloFarmacia(Filtro);

            return Json(new { lstData = ListaProductos, session = true });
        }

        [HttpGet]
        public async Task<ActionResult> MedicosSeleccionarTodosOrdenadoAlfabeticamente()
        {
            DataSet lstData;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            lstData = null;

            lstData = await daoFarmacia.MedicosSeleccionarTodosOrdenadoAlfabeticamente();

            return Json(new { lstData = lstData, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> PacientesFiltrarTodos(string NroHistoriaClinica, string apellidoPaterno, string apellidoMaterno, string primerNombre, string segundoNombre, int idDocIdentidad, string NroDocumento, string FichaFamiliar)
        {
            DataSet dataSet;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            dataSet = null;

            dataSet = await daoFarmacia.PacientesFiltrarTodos(NroHistoriaClinica, apellidoPaterno, apellidoMaterno, primerNombre, segundoNombre, idDocIdentidad, NroDocumento, FichaFamiliar);

            return Json(new { lstData = dataSet, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ProveedorSeleccionarporRuc(string ruc)
        {
            DataSet dataSet;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            dataSet = null;

            dataSet = await daoFarmacia.ProveedorSeleccionarporRuc(ruc);

            return Json(new { resultado = dataSet, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListarConsumoFarmacia(int idCuenta)
        {
            DataSet dataSet;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            dataSet = null;

            dataSet = await daoFarmacia.ListarConsumoFarmacia(idCuenta);

            return Json(new { resultado = dataSet, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ValidarLote(int idAlmacen, int idProducto, string lote, DateTime fechaVencimiento)
        {
            DataSet dataSet;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            dataSet = null;

            dataSet = await daoFarmacia.ValidarLote(idAlmacen, idProducto, lote, fechaVencimiento);

            return Json(new { resultado = dataSet, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> AtencionesSelecionarPorCuenta(int idCuentaAtencion)
        {
            DataSet dataSet;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            dataSet = null;

            dataSet = await daoFarmacia.AtencionesSelecionarPorCuenta(idCuentaAtencion);

            return Json(new { lstData = dataSet, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FuentesFinanciamientoSeleccionarPorId(int IdFuenteFinanciamiento)
        {
            DataSet dataSet;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            dataSet = null;

            dataSet = await daoFarmacia.FuentesFinanciamientoSeleccionarPorId(IdFuenteFinanciamiento);

            return Json(new { lstData = dataSet, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> DevuelvePrecioSegunTipoConcepto(int idProducto, int idTipoPrecioParaNiNs, int sghPrecioCompra, int sghPrecioDistribucion, int sghPrecioVentaContado, int sghPrecioDonacion)
        {
            DataSet dataSet;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            dataSet = null;

            dataSet = await daoFarmacia.DevuelvePrecioSegunTipoConcepto(idProducto, idTipoPrecioParaNiNs, sghPrecioCompra, sghPrecioDistribucion, sghPrecioVentaContado, sghPrecioDonacion);

            return Json(new { lstData = dataSet, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FarmPreVentaSeleccionarPorId(int idPreventa)
        {
            DataSet dataSet;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            dataSet = null;

            dataSet = await daoFarmacia.FarmPreVentaSeleccionarPorId(idPreventa);

            return Json(new { lstData = dataSet, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FarmPreVentaDetalleDevuelveTodosItems(int idPreventa)
        {
            DataSet dataSet;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            dataSet = null;

            dataSet = await daoFarmacia.FarmPreVentaDetalleDevuelveTodosItems(idPreventa);

            return Json(new { lstData = dataSet, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FarmMovimientoSeleccionarPorId(string movNumero, string movTipo)
        {
            DataSet dataSet;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            dataSet = null;

            dataSet = await daoFarmacia.FarmMovimientoSeleccionarPorId(movNumero, movTipo);

            return Json(new { lstData = dataSet, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FarmMovimientoVentasSeleccionarPorId(string movNumero, string movTipo)
        {
            DataSet dataSet;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            dataSet = null;

            dataSet = await daoFarmacia.FarmMovimientoVentasSeleccionarPorId(movNumero, movTipo);

            return Json(new { lstData = dataSet, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FarmMovimientosDetalleDevuelveTodosItems(string movNumero, string movTipo)
        {
            DataSet dataSet;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            dataSet = null;

            dataSet = await daoFarmacia.FarmMovimientosDetalleDevuelveTodosItems(movNumero, movTipo);

            return Json(new { lstData = dataSet, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FacturacionBienesFinanciamientosAgregar(string MovNumero, string MovTipo, int IdProducto, int IdTipoFinanciamiento, int IdFuenteFinanciamiento, int CantidadFinanciada, string PrecioFinanciado, string TotalFinanciado)
        {
            int resp;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            resp = 0;

            //farmMovimiento.idUsuario = idUsuario;

            //var lstObjDetalleNotaSalida = JsonConvert.DeserializeObject<List<FarmMovimientoDetalle>>(detalleNotaSalida);

            resp = await daoFarmacia.FacturacionBienesFinanciamientosAgregar(MovNumero, MovTipo, IdProducto, IdTipoFinanciamiento, IdFuenteFinanciamiento, CantidadFinanciada, PrecioFinanciado, TotalFinanciado, idUsuario);

            return Json(new { lstData = resp, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FacturacionBienesPagosAgregar(int IdOrden, int IdProducto, int CantidadPagar, string PrecioVenta, string TotalPagar)
        {
            int resp;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            resp = 0;

            //farmMovimiento.idUsuario = idUsuario;

            //var lstObjDetalleNotaSalida = JsonConvert.DeserializeObject<List<FarmMovimientoDetalle>>(detalleNotaSalida);

            resp = await daoFarmacia.FacturacionBienesPagosAgregar(IdOrden, IdProducto, CantidadPagar, PrecioVenta, TotalPagar, idUsuario);

            return Json(new { lstData = resp, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> RecetaCabeceraModificar(Receta receta)
        {
            int resp;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            resp = 0;

            //farmMovimiento.idUsuario = idUsuario;

            //var lstObjDetalleNotaSalida = JsonConvert.DeserializeObject<List<FarmMovimientoDetalle>>(detalleNotaSalida);

            resp = await daoFarmacia.RecetaCabeceraModificar(receta, idUsuario);

            return Json(new { lstData = resp, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FarmRecetaRelacionOrdenPagoBuscar(int NroReceta)
        {
            DataSet dataSet;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            dataSet = null;

            dataSet = await daoFarmacia.FarmRecetaRelacionOrdenPagoBuscar(NroReceta);

            return Json(new { lstData = dataSet, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FarmMovimientoDetalleDevuelveSalidasSegunAlmacenProductoLote(int idAlmacen, int idProducto, string lote, string fechaVencimiento)
        {
            DataSet dataSet;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            dataSet = null;

            dataSet = await daoFarmacia.FarmMovimientoDetalleDevuelveSalidasSegunAlmacenProductoLote(idAlmacen, idProducto, lote, fechaVencimiento);

            return Json(new { lstData = dataSet, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FarmPreVentaAgregar(FarmPreVenta farmPreVenta)
        {
            int resp;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            resp = 0;

            //farmMovimiento.idUsuario = idUsuario;

            //var lstObjDetalleNotaSalida = JsonConvert.DeserializeObject<List<FarmMovimientoDetalle>>(detalleNotaSalida);

            resp = await daoFarmacia.FarmPreVentaAgregar(farmPreVenta, idUsuario);

            return Json(new { lstData = resp, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FarmPreVentaDetalleAgregar(int idPreventa, int idProducto, int item, int Cantidad, string Precio, string Importe)
        {
            int resp;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            resp = 0;

            //farmMovimiento.idUsuario = idUsuario;

            //var lstObjDetalleNotaSalida = JsonConvert.DeserializeObject<List<FarmMovimientoDetalle>>(detalleNotaSalida);

            resp = await daoFarmacia.FarmPreVentaDetalleAgregar(idPreventa, idProducto, item, Cantidad, Precio, Importe, idUsuario);

            return Json(new { lstData = resp, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> DevuelveCabeceraDeVentasOpreventa(string tipoVenta, int IdAlmacen, DateTime FechaInicio, DateTime FechaFin, int IdCuentaAtencion, string DocumentoNumero)
        {
            DataSet dataSet;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            dataSet = null;

            dataSet = await daoFarmacia.DevuelveCabeceraDeVentasOpreventa(tipoVenta, IdAlmacen, FechaInicio, FechaFin, IdCuentaAtencion, DocumentoNumero);

            return Json(new { lstData = dataSet, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> DevuelveCabeceraDeVentasOpreventaIntervencionesSanitarias(string tipoVenta, int IdAlmacen, DateTime FechaInicio, DateTime FechaFin, int IdCuentaAtencion, string DocumentoNumero)
        {
            DataSet dataSet;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            dataSet = null;

            dataSet = await daoFarmacia.DevuelveCabeceraDeVentasOpreventaIntervencionesSanitarias(tipoVenta, IdAlmacen, FechaInicio, FechaFin, IdCuentaAtencion, DocumentoNumero);

            return Json(new { lstData = dataSet, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FarmMovimientoVentasDetalleSeleccionarPorCuenta(int idCuentaAtencion)
        {
            DataSet dataSet;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            dataSet = null;

            dataSet = await daoFarmacia.FarmMovimientoVentasDetalleSeleccionarPorCuenta(idCuentaAtencion);

            return Json(new { lstData = dataSet, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> PacientesSeleccionarPorNroHistoria(string NroDocumento)
        {
            DataSet dataSet;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            dataSet = null;

            dataSet = await daoFarmacia.PacientesSeleccionarPorNroHistoria(NroDocumento);

            return Json(new { lstData = dataSet, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> PacientesXdni(string NroDocumento)
        {
            DataSet dataSet;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            dataSet = null;

            dataSet = await daoFarmacia.PacientesXdni(NroDocumento);

            return Json(new { lstData = dataSet, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> RecetaDetalleActualizaCantDespachada(int idReceta, int idItem, int CantidadDespachada, int IdEstadoDetalle)
        {
            int resp;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            resp = 0;

            //farmMovimiento.idUsuario = idUsuario;

            //var lstObjDetalleNotaSalida = JsonConvert.DeserializeObject<List<FarmMovimientoDetalle>>(detalleNotaSalida);

            resp = await daoFarmacia.RecetaDetalleActualizaCantDespachada(idReceta, idItem, CantidadDespachada, IdEstadoDetalle);

            return Json(new { lstData = resp, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> RecetaDetalleItemAgregar(int idReceta, int idItem, string DocumentoDespacho, int CantidadDespachada) // // JDELGADO003-C
        {
            int resp;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            resp = 0;

            //farmMovimiento.idUsuario = idUsuario;

            //var lstObjDetalleNotaSalida = JsonConvert.DeserializeObject<List<FarmMovimientoDetalle>>(detalleNotaSalida);

            resp = await daoFarmacia.RecetaDetalleItemAgregar(idReceta, idItem, DocumentoDespacho, CantidadDespachada, idUsuario);

            return Json(new { lstData = resp, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FarmRecetaRelacionOrdenPagoAgregar(int NroReceta, int NroOrdenPago, string NroDocumento, int TipoPlan) // // JDELGADO003-C
        {
            int resp;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            resp = 0;

            //farmMovimiento.idUsuario = idUsuario;

            //var lstObjDetalleNotaSalida = JsonConvert.DeserializeObject<List<FarmMovimientoDetalle>>(detalleNotaSalida);

            resp = await daoFarmacia.FarmRecetaRelacionOrdenPagoAgregar(NroReceta, NroOrdenPago, NroDocumento, TipoPlan);

            return Json(new { lstData = resp, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> AtencionesDiagnosticosSeleccionarPorAtencion(int idAtencion)
        {
            DataSet lsAtencionsCE;
            DalFarmacia daoFarmacia = new DalFarmacia();

            lsAtencionsCE = await daoFarmacia.AtencionesDiagnosticosSeleccionarPorAtencion(idAtencion, (int)Enumerados.TiposDiagnostico.AtencionConsultaExterna); // JDELGADO J0 AWAIT SENTENCE
            return Json(lsAtencionsCE);
        }


        [HttpPost]
        public async Task<ActionResult> ListarTiposPsicotropicos()
        {
            DataSet lstData;
            DalFarmacia daoFarmacia = new DalFarmacia();

            lstData = await daoFarmacia.ListarTiposPsicotropicos();
            return Json(lstData);
        }


        [HttpPost]
        public async Task<IActionResult> CrearModificarVentaFarmacia(
            string MovNumero, string MovTipo, int? IdCuentaAtencion, int? IdServicioPaciente, DateTime? FechaHoraPrescribe, int? IdPaquete, string PresExternoCmp, string PresExternoMedico,
            string PresExternoFecha, string NroFormato, int? IdReceta, string DocumentoNumero, string Observaciones, int? idEstadoMovimiento, int? idAlmacenOrigen, int? idAlmacenDestino, int? IdFuenteFinanciamiento,
            int? IdPreVenta, int? IdPrescriptor, int? IdTipoReceta, int? idPuntoCarga, int? idComprobantePago, int? idEstadoFacturacion, string DNI, string NombPaciente, string movimientoDetalle,
            int IdListBarItem)
        {
            
            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {
                var lstObjDetalleNotaSalida = JsonConvert.DeserializeObject<List<FarmMovimientoDetalle>>(movimientoDetalle);

                var dal = new DalFarmacia();
                var idUsuario = IdUsuarioSesion();

                var dataSet = await dal.CrearModificarVentaFarmacia(MovNumero, MovTipo, IdCuentaAtencion, IdServicioPaciente, FechaHoraPrescribe, IdPaquete, PresExternoCmp, PresExternoMedico,
                                PresExternoFecha, NroFormato, IdReceta, DocumentoNumero, Observaciones, idEstadoMovimiento, idAlmacenOrigen, idAlmacenDestino, IdFuenteFinanciamiento,
                                IdPreVenta, IdPrescriptor, IdTipoReceta, idPuntoCarga, idComprobantePago, idEstadoFacturacion, DNI, NombPaciente, lstObjDetalleNotaSalida, idUsuario, IdListBarItem);

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CrearModificarNotaIngresoSalidaFarmacia(
            string MovNumero, string MovTipo, int? idEstadoMovimiento, string idTipoLocales, string idTipoSuministro, int? documentoIdTipo, int? idAlmacenOrigen,
            int? idAlmacenDestino, int? IdTipoConceptoFarmacia, string Observaciones, string movimientoDetalle, int IdListBarItem)
        {
            
            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {
                var lstObjDetalleNotaSalida = JsonConvert.DeserializeObject<List<FarmMovimientoDetalle>>(movimientoDetalle);

                var dal = new DalFarmacia();
                var idUsuario = IdUsuarioSesion();

                var dataSet = await dal.CrearModificarNotaIngresoSalidaFarmacia(MovNumero, MovTipo, idEstadoMovimiento, idTipoLocales, idTipoSuministro, documentoIdTipo, idAlmacenOrigen,
                idAlmacenDestino, IdTipoConceptoFarmacia, Observaciones, lstObjDetalleNotaSalida, idUsuario, IdListBarItem);

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }
        }

        public async Task<IActionResult> rptVentasFarmaciaAlmacen(string tipoVenta, int IdAlmacen, DateTime FechaInicio, DateTime FechaFin)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
            sWebRootFolder = sWebRootFolder + "/Plantilla/Farmacia/ReporteVentas.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                //var FilaIni = 4;
                DalFarmacia dao = new DalFarmacia();
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet dataSet = await dao.rptVentasFarmaciaAlmacen(tipoVenta, IdAlmacen, FechaInicio, FechaFin);

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

        //[HttpPost]
        //public async Task<ActionResult> FarmDevuelveMovimientos(string MovTipo, int IdAlmacen, DateTime FechaInicio, DateTime FechaFin)
        //{
        //    DataSet ds;
        //    DalFarmacia daoFarmacia = new DalFarmacia();
        //    int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
        //    //resp = 0;
        //    FechaInicio = FechaInicio.Date.Add(new TimeSpan(0, 1, 0)); // 00:01:00
        //    FechaFin = FechaFin.Date.Add(new TimeSpan(23, 59, 0)); // 23:59:00
        //    ds = await daoFarmacia.FarmDevuelveMovimientos(MovTipo, IdAlmacen, FechaInicio, FechaFin);

        //    return Json(new { lstData = ds, session = true });
        //}

        public async Task<IActionResult> rptNotaSalidaAlmacen(string MovTipo, int IdAlmacen, DateTime FechaInicio, DateTime FechaFin)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            //sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaProduccionGeneralPPF.xlsx";
            sWebRootFolder = sWebRootFolder + "/Plantilla/Farmacia/ReporteNotaSalida.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                //var FilaIni = 4;
                DataSet dataSet;
                DalFarmacia daoFarmacia = new DalFarmacia();
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                dataSet = await daoFarmacia.FarmDevuelveMovimientos(MovTipo, IdAlmacen, FechaInicio, FechaFin);

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
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ReporteConsumonOTAsaLIDA.xlsx");
                }
            }
        }

        public async Task<ActionResult> InformeNotaIngreso(string MovNumero, string MovTipo)
        {
            DataSet dataSet;
            DataSet lsParametros;
            DalParametros daoParametros = new DalParametros();
            DalFarmacia daoFarmacia = new DalFarmacia();

            int idIpressInt = 0;
            var idIpressStr = HttpContext.Session.GetString("IdIPress");
            if (!string.IsNullOrEmpty(idIpressStr) && int.TryParse(idIpressStr, out int result)) idIpressInt = result;

            @ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss");
            

            lsParametros = await daoParametros.SeleccionaFilaParametro2(205, idIpressInt); // JDELGADO J0 AWAIT SENTENCE
            @ViewBag.nombre = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(206, idIpressInt); // JDELGADO J0 AWAIT SENTENCE
            @ViewBag.direccion = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(207, idIpressInt); // JDELGADO J0 AWAIT SENTENCE
            @ViewBag.telefono = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();


            dataSet = await daoFarmacia.SeleccionarDatosMovimientoInforme(MovNumero, MovTipo);

            DataTable detalleRegistro = dataSet.Tables[1];

            @ViewBag.MovNumero = dataSet.Tables[0].Rows[0]["MovNumero"].ToString();
            @ViewBag.FechaMovimiento = dataSet.Tables[0].Rows[0]["FechaMovimiento"].ToString();
            @ViewBag.AlmacenOrigen = dataSet.Tables[0].Rows[0]["AlmacenOrigen"].ToString();
            @ViewBag.AlmacenDestino = dataSet.Tables[0].Rows[0]["AlmacenDestino"].ToString();
            @ViewBag.Concepto = dataSet.Tables[0].Rows[0]["Concepto"].ToString();
            @ViewBag.TipoDocumento = dataSet.Tables[0].Rows[0]["TipoDocumento"].ToString();
            @ViewBag.DocumentoNumero = dataSet.Tables[0].Rows[0]["DocumentoNumero"].ToString();
            @ViewBag.Observaciones = dataSet.Tables[0].Rows[0]["Observaciones"].ToString();
            @ViewBag.Total = dataSet.Tables[0].Rows[0]["Total"].ToString();

            @ViewBag.DetalleRegistro = detalleRegistro;

            if(MovTipo == "S")
            {
                @ViewBag.Tipo = "NOTA DE SALIDA";
            } else
            {
                @ViewBag.Tipo = "NOTA DE INGRESO";
            }

            return PartialView("~/Views/Farmacia/Plantillas/InformeNotaIngreso.cshtml");

        }

        public async Task<ActionResult> ImpreInformeNotaIngresoSalida(string MovNumero, string MovTipo)
        {
            FormatoPdf pdf = new FormatoPdf();
            MemoryStream resultStream = new MemoryStream();
            MemoryStream ms = new MemoryStream();
            UtilitarioController utilitario = new UtilitarioController();
            StringBuilder stringHtml = new StringBuilder();
            string pageHtml;
            string respuesta = "Error al registrar la generación de constancia.";

            string usuario = HttpContext.Session.GetString("user");

            try
            {
                pageHtml = Url.Action("InformeNotaIngreso", "Farmacias", new { MovNumero, MovTipo, usuario }, "http");
                pdf.orientacion = "Portrait";
                pdf.tipoDocumento = "A4";
                pdf.pageHtml = pageHtml;

                pdf.cookies = HttpContext.Request.Headers["Cookie"].ToString();

                    resultStream = await utilitario.GenerarArchivoEnMemoriaPdfV2(pdf);

                byte[] pdfBytes = resultStream.ToArray();
                ms.Write(pdfBytes, 0, pdfBytes.Length);
                ms.Position = 0;
            }
            catch (Exception ex)
            {
                respuesta = "Error al registrar," + ex.Message + ".";
                return Json(new { exep = ex.ToString() });
            }
            //return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
            return new FileStreamResult(ms, MediaTypeNames.Application.Pdf);
        }

        public async Task<ActionResult> ImpreInformeVentas(string MovNumero, string MovTipo)
        {
            FormatoPdf pdf = new FormatoPdf();
            MemoryStream resultStream = new MemoryStream();
            MemoryStream ms = new MemoryStream();
            UtilitarioController utilitario = new UtilitarioController();
            StringBuilder stringHtml = new StringBuilder();
            string pageHtml;
            string respuesta = "Error al registrar la generación de constancia.";

            string usuario = HttpContext.Session.GetString("user");

            try
            {
                pageHtml = Url.Action("InformeVentas", "Farmacias", new { MovNumero, MovTipo, usuario }, "http");
                pdf.orientacion = "Portrait";
                pdf.tipoDocumento = "A4";
                pdf.pageHtml = pageHtml;

                pdf.cookies = HttpContext.Request.Headers["Cookie"].ToString();

                    resultStream = await utilitario.GenerarArchivoEnMemoriaPdfV2(pdf);

                byte[] pdfBytes = resultStream.ToArray();
                ms.Write(pdfBytes, 0, pdfBytes.Length);
                ms.Position = 0;
            }
            catch (Exception ex)
            {
                respuesta = "Error al registrar," + ex.Message + ".";
                return Json(new { exep = ex.ToString() });
            }
            //return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
            return new FileStreamResult(ms, MediaTypeNames.Application.Pdf);
        }

        public async Task<ActionResult> ImpreInformeIntervencionSanitaria(string MovNumero, string MovTipo)
        {
            FormatoPdf pdf = new FormatoPdf();
            MemoryStream resultStream = new MemoryStream();
            MemoryStream ms = new MemoryStream();
            UtilitarioController utilitario = new UtilitarioController();
            StringBuilder stringHtml = new StringBuilder();
            string pageHtml;
            string respuesta = "Error al registrar la generación de constancia.";

            string usuario = HttpContext.Session.GetString("user");

            try
            {
                pageHtml = Url.Action("InformeIntervencionSanitaria", "Farmacias", new { MovNumero, MovTipo, usuario }, "http");
                pdf.orientacion = "Portrait";
                pdf.tipoDocumento = "A4";
                pdf.pageHtml = pageHtml;

                pdf.cookies = HttpContext.Request.Headers["Cookie"].ToString();

                    resultStream = await utilitario.GenerarArchivoEnMemoriaPdfV2(pdf);

                byte[] pdfBytes = resultStream.ToArray();
                ms.Write(pdfBytes, 0, pdfBytes.Length);
                ms.Position = 0;
            }
            catch (Exception ex)
            {
                respuesta = "Error al registrar," + ex.Message + ".";
                return Json(new { exep = ex.ToString() });
            }
            //return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
            return new FileStreamResult(ms, MediaTypeNames.Application.Pdf);
        }

        public async Task<ActionResult> InformeVentas(string MovNumero, string MovTipo)
        {
            DataSet dataSet;
            DataSet lsParametros;
            DalParametros daoParametros = new DalParametros();
            DalFarmacia daoFarmacia = new DalFarmacia();
            Conexion conexion = new Conexion();

            int idIpressInt = 0;
            var idIpressStr = HttpContext.Session.GetString("IdIPress");
            if (!string.IsNullOrEmpty(idIpressStr) && int.TryParse(idIpressStr, out int result)) idIpressInt = result;

            @ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss");


            lsParametros = await daoParametros.SeleccionaFilaParametro2(205, idIpressInt); // JDELGADO J0 AWAIT SENTENCE
            @ViewBag.nombre = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(206, idIpressInt); // JDELGADO J0 AWAIT SENTENCE
            @ViewBag.direccion = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(207, idIpressInt); // JDELGADO J0 AWAIT SENTENCE
            @ViewBag.telefono = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();


            dataSet = await daoFarmacia.SeleccionarDatosMovimientoInforme(MovNumero, MovTipo);

            DataTable detalleRegistro = dataSet.Tables[1];

            @ViewBag.Paciente = dataSet.Tables[0].Rows[0]["Paciente"].ToString();
            @ViewBag.DX = dataSet.Tables[0].Rows[0]["DX"].ToString();
            @ViewBag.NroCuenta = dataSet.Tables[0].Rows[0]["NroCuenta"].ToString();
            @ViewBag.FuentesFinanciamiento = dataSet.Tables[0].Rows[0]["FuentesFinanciamiento"].ToString();
            @ViewBag.FechaIngreso = dataSet.Tables[0].Rows[0]["FechaIngreso"].ToString();
            @ViewBag.TipoServicio = dataSet.Tables[0].Rows[0]["TipoServicio"].ToString();
            @ViewBag.EstadosCuenta = dataSet.Tables[0].Rows[0]["EstadosCuenta"].ToString();
            @ViewBag.Servicios = dataSet.Tables[0].Rows[0]["Servicios"].ToString();


            @ViewBag.MovNumero = dataSet.Tables[0].Rows[0]["MovNumero"].ToString();
            @ViewBag.FechaMovimiento = dataSet.Tables[0].Rows[0]["FechaMovimiento"].ToString();
            @ViewBag.AlmacenOrigen = dataSet.Tables[0].Rows[0]["AlmacenOrigenVentas"].ToString();
            @ViewBag.AlmacenDestino = dataSet.Tables[0].Rows[0]["AlmacenDestino"].ToString();
            @ViewBag.Concepto = dataSet.Tables[0].Rows[0]["Concepto"].ToString();
            @ViewBag.TipoDocumento = dataSet.Tables[0].Rows[0]["TipoDocumento"].ToString();
            @ViewBag.DocumentoNumero = dataSet.Tables[0].Rows[0]["DocumentoNumero"].ToString();
            @ViewBag.Observaciones = dataSet.Tables[0].Rows[0]["Observaciones"].ToString();
            @ViewBag.Total = dataSet.Tables[0].Rows[0]["Total"].ToString();

            @ViewBag.DetalleRegistro = detalleRegistro;

            @ViewBag.IpArchivos = conexion.ObtenerServidorArchivosIp();

            if (MovTipo == "S")
            {
                @ViewBag.Tipo = "NOTA DE SALIDA";
            }
            else
            {
                @ViewBag.Tipo = "NOTA DE INGRESO";
            }

            return PartialView("~/Views/Farmacia/Plantillas/InformeVentas.cshtml");

        }

        public async Task<ActionResult> InformeIntervencionSanitaria(string MovNumero, string MovTipo)
        {
            DataSet dataSet;
            DataSet lsParametros;
            DalParametros daoParametros = new DalParametros();
            DalFarmacia daoFarmacia = new DalFarmacia();
            Conexion conexion = new Conexion();
            
            int idIpressInt = 0;
            var idIpressStr = HttpContext.Session.GetString("IdIPress");
            if (!string.IsNullOrEmpty(idIpressStr) && int.TryParse(idIpressStr, out int result)) idIpressInt = result;

            @ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss");


            lsParametros = await daoParametros.SeleccionaFilaParametro2(205, idIpressInt); // JDELGADO J0 AWAIT SENTENCE
            @ViewBag.nombre = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(206, idIpressInt); // JDELGADO J0 AWAIT SENTENCE
            @ViewBag.direccion = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(207, idIpressInt); // JDELGADO J0 AWAIT SENTENCE
            @ViewBag.telefono = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();


            dataSet = await daoFarmacia.SeleccionarDatosMovimientoInforme(MovNumero, MovTipo);

            DataTable detalleRegistro = dataSet.Tables[1];

            @ViewBag.Paciente = dataSet.Tables[0].Rows[0]["Paciente"].ToString();
            @ViewBag.DX = dataSet.Tables[0].Rows[0]["DX"].ToString();
            @ViewBag.NroCuenta = dataSet.Tables[0].Rows[0]["NroCuenta"].ToString();
            @ViewBag.FuentesFinanciamiento = dataSet.Tables[0].Rows[0]["FuentesFinanciamiento"].ToString();
            @ViewBag.FechaIngreso = dataSet.Tables[0].Rows[0]["FechaIngreso"].ToString();
            @ViewBag.TipoServicio = dataSet.Tables[0].Rows[0]["TipoServicio"].ToString();
            @ViewBag.EstadosCuenta = dataSet.Tables[0].Rows[0]["EstadosCuenta"].ToString();
            @ViewBag.Servicios = dataSet.Tables[0].Rows[0]["Servicios"].ToString();

            @ViewBag.CoordinadorIS = dataSet.Tables[0].Rows[0]["CoordinadorIS"].ToString();
            @ViewBag.ComponenteIS = dataSet.Tables[0].Rows[0]["ComponenteIS"].ToString();
            @ViewBag.SubComponenteIS = dataSet.Tables[0].Rows[0]["SubComponenteIS"].ToString();            
            @ViewBag.DiagnosticoIS = dataSet.Tables[0].Rows[0]["DiagnosticoIS"].ToString();
            @ViewBag.ObservacionIS = dataSet.Tables[0].Rows[0]["ObservacionIS"].ToString();


            @ViewBag.MovNumero = dataSet.Tables[0].Rows[0]["MovNumero"].ToString();
            @ViewBag.FechaMovimiento = dataSet.Tables[0].Rows[0]["FechaMovimiento"].ToString();
            @ViewBag.AlmacenOrigen = dataSet.Tables[0].Rows[0]["AlmacenOrigenVentas"].ToString();
            @ViewBag.AlmacenDestino = dataSet.Tables[0].Rows[0]["AlmacenDestino"].ToString();
            @ViewBag.Concepto = dataSet.Tables[0].Rows[0]["Concepto"].ToString();
            @ViewBag.TipoDocumento = dataSet.Tables[0].Rows[0]["TipoDocumento"].ToString();
            @ViewBag.DocumentoNumero = dataSet.Tables[0].Rows[0]["DocumentoNumero"].ToString();
            @ViewBag.Observaciones = dataSet.Tables[0].Rows[0]["Observaciones"].ToString();
            @ViewBag.Total = dataSet.Tables[0].Rows[0]["Total"].ToString();

            @ViewBag.DetalleRegistro = detalleRegistro;

            @ViewBag.IpArchivos = conexion.ObtenerServidorArchivosIp();

            if (MovTipo == "S")
            {
                @ViewBag.Tipo = "NOTA DE SALIDA";
            }
            else
            {
                @ViewBag.Tipo = "NOTA DE INGRESO";
            }

            return PartialView("~/Views/Farmacia/Plantillas/InformeIntervencionSanitaria.cshtml");

        }

    }

}
