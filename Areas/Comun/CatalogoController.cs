using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Comun
{
    public class CatalogoController : BaseController
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> CatalogoServiciosSeleccionarSoloConPreciosEnParticular(int idPuntoCarga,int idFarmacia)
        {
            DataSet ListaCatalogo;
            DalCatalogo daoCatalogo = new DalCatalogo();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaCatalogo = null;

            switch (idPuntoCarga)
            {
                case 0:
                    Console.WriteLine("Case 1");
                    break;
                default:
                    ListaCatalogo = await daoCatalogo.CatalogoServiciosSeleccionarSoloConPreciosEnParticular(idPuntoCarga);
                    break;
            }

            
            return Json(ListaCatalogo);
        }

        [HttpPost]
        public async Task<ActionResult> CatalogoServiciosSeleccionarSoloConPreciosEnParticularV2(int idPuntoCarga, int idFarmacia) // JDELGADO011
        {
            DataSet dataSet = null;
            //int nRpta;
            DalCatalogo daoCatalogo = new DalCatalogo();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await daoCatalogo.CatalogoServiciosSeleccionarSoloConPreciosEnParticular(idPuntoCarga);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        public async Task<ActionResult> ProductoByIdByFuente(int idproducto, int idpuntoCarga,int idTipoFinanciamiento)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet ListaCatalogo;
            DalCatalogo daoCatalogo = new DalCatalogo();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaCatalogo = null;
            switch (idpuntoCarga)
            {
                case (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia:
                    ListaCatalogo = await daoCatalogo.FactCatalogoBienesInsumosHospXfiltro("idProducto=" + idproducto + " and idTipoFinanciamiento=" + idTipoFinanciamiento);
                    break;
      
                default:
                    ListaCatalogo = await daoCatalogo.FactCatalogoServiciosHospXfiltro("idProducto=" + idproducto + " and idTipoFinanciamiento=" + idTipoFinanciamiento);
                    break;
            }


            return Json(new { ListaCatalogo= ListaCatalogo, session=true });
        }


        [HttpPost]
        public async Task<ActionResult> FactCatalogoPaqueteXtipoPaquete(int tipo, string descripcion)
        {
            DataSet listaPaq;
            DalCatalogo daoCatalogo = new DalCatalogo();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            listaPaq = await daoCatalogo.FactCatalogoPaqueteXtipoPaquete(tipo, descripcion);

            return Json(listaPaq);
        }

        [HttpPost]
        public async Task<ActionResult> FactDetallePaquete(int tipo, int idPaquete)
        {
            DataSet listaPaq;
            DalCatalogo daoCatalogo = new DalCatalogo();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            listaPaq = await daoCatalogo.FactDetallePaquete(tipo, idPaquete);

            return Json(listaPaq);
        }

        [HttpPost]
        public ActionResult ListaCptByPuntoCargaByFuente(int idPuntoCarga, int idTipoFinanciamiento)
        {
            DataSet lista;
            DalCatalogo daoCatalogo = new DalCatalogo();
            lista = daoCatalogo.ListaCptByPuntoCargaByFuente(idPuntoCarga, idTipoFinanciamiento);
            return Json(lista);
        }

        ////////////////////////////KHOYOSI/////////////////////////////////////////////
        [HttpPost]
        public async Task<ActionResult> CatalogoServiciosSeleccionarPorPtoCargaPorServSoloConPreciosEnParticular(int idPuntoCarga, int idServicio)
        {
            DataSet ListaCatalogo;
            DalCatalogo daoCatalogo = new DalCatalogo();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaCatalogo = null;

            switch (idPuntoCarga)
            {
                case 0:
                    Console.WriteLine("Case 1");
                    break;
                default:
                    ListaCatalogo = await daoCatalogo.CatalogoServiciosSeleccionarPorPtoCargaPorServSoloConPreciosEnParticular(idPuntoCarga, idServicio);
                    break;
            }

            return Json(ListaCatalogo);
        }


        public async Task<ActionResult> ListarCatalogoCompleto(string tipoServicio)
        {
            DataSet resultado;
            DalCatalogo daoCatalogo = new DalCatalogo();
            int idTipoServicio = 0;

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            var AppName = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("PuntosCargaHospital:" + tipoServicio);
            idTipoServicio = Int32.Parse(AppName.ToString());

            resultado = await daoCatalogo.ListarCatologoTotal(idTipoServicio);
            return Json(new { session = true, resultado = resultado });
        }

        [HttpPost]
        public async Task<ActionResult> FactCatalogoServiciosHospFiltraPorPuntoCargaTipoFinanciamiento(int idPuntoCarga, int idTipoFinaciamiento, int idFiltroTipo, string filtro, int idTipoServicio)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalCatalogo daoCatalogo = new DalCatalogo();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await daoCatalogo.FactCatalogoServiciosHospFiltraPorPuntoCargaTipoFinanciamiento(idPuntoCarga, idTipoFinaciamiento, idFiltroTipo, filtro, idTipoServicio);
                return Json(new { session = true, estado = true, msg = "", respuesta = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, respuesta = dataSet });
            }

        }
        ///////////////////////////////////////////////////////////////////////////////////////////
    }
}