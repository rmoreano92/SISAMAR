using CapaDatos;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System.Collections.Generic;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.Areas.Imagenes
{
    public class ImagenologiaMovimientoController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> ListarMovimientosImagenelogia(int idMovimiento, int idCuenta, string historia, string nombres, DateTime fechaInicio, DateTime fechaFin, int idTipoServicio, int idGrupoExamen, int idRealizaExamen, int idPuntoCarga)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalImagenes dal = new DalImagenes();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dal.ListarMovimientosImagenelogia(idMovimiento, idCuenta, historia, nombres, fechaInicio, fechaFin, idTipoServicio, idGrupoExamen, idRealizaExamen, idPuntoCarga);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        public async Task<ActionResult> SeleccionarMovimiento(int idMovimiento)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalImagenes dal = new DalImagenes();

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                ds = await dal.SeleccionarMovimiento(idMovimiento);

                return Json(new { respuesta = ds, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (SeleccionarMovimiento): " + ex });
            }

        }

        [HttpPost]
        public async Task<ActionResult> EmpleadosImagenologiaPorCargo(int idCargo)
        {
            DataSet dataSet;
            DalImagenes dal = new DalImagenes();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dal.EmpleadosImagenologiaPorCargo(idCargo);

            return Json(new { dataSet, estado = true, session = true });
        }


        [HttpPost]
        public async Task<ActionResult> ImgFacturacionServicioDespachoFiltraPorIdOrdenIdPuntoCarga(int idOrden, int idPuntoCarga, int idMovimiento)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalImagenes dal = new DalImagenes();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                dataSet = await dal.ImgFacturacionServicioDespachoFiltraPorIdOrdenIdPuntoCarga(idOrden, idPuntoCarga, idMovimiento, idUsuario);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> FactCatalogoServiciosSeleccionarServiciosLike(string lcFiltro)
        {
            DataSet ListaProductos;
            DalLaboratorio dal = new DalLaboratorio();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaProductos = null;

            ListaProductos = await dal.FactCatalogoServiciosSeleccionarServiciosLike(lcFiltro);

            return Json(new { lstData = ListaProductos, session = true });
        }


        [HttpPost]
        public async Task<ActionResult> GuardarMovimiento(ImagenologiaMovimiento imagenologia)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dsMov;
            DalImagenes dal = new DalImagenes();

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                var lstobjInsumos = JsonConvert.DeserializeObject<List<InsumoCPT>>(imagenologia.InsumosCPT);
                var lstobjProductos = JsonConvert.DeserializeObject<List<ProductoCPT>>(imagenologia.ProductosCPT);

                imagenologia.IdUsuario = idUsuario;
                imagenologia.IdUsuarioAuditoria = idUsuario;
                //ds = await daoLaboratorio.GuardarMovimiento(laboratorio, lstobjInsumos, lstobjProductos);
                int idMovimiento = await dal.GuardarMovimiento(imagenologia, lstobjInsumos, lstobjProductos);

                dsMov = await dal.SeleccionarMovimiento(idMovimiento);
                
                //return Json(new { respuesta = ds.Tables[1], session = true, estado = true });
                return Json(new { respuesta = idMovimiento, movimiento = idMovimiento, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (GuardarMovimiento): " + ex });
            }

        }

        [HttpPost]
        public async Task<ActionResult> EliminarMovimiento(int idMovimiento)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalImagenes dal = new DalImagenes();

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                ds = await dal.EliminarMovimiento(idMovimiento, idUsuario);

                //return Json(new { respuesta = ds.Tables[1], session = true, estado = true });
                return Json(new { respuesta = ds, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (EliminarMovimiento): " + ex });
            }

        }



    }
}
