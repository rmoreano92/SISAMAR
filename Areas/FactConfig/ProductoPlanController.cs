using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System;
using System.Data;
using System.Threading.Tasks;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.Controllers;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.FactConfig
{
    public class ProductoPlanController : BaseController
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> TiposFinanciamientoSegunFiltro(string filtro)
        {
            DataSet lstData;
            DalProductoPlan dalProductoPlan = new DalProductoPlan();

            lstData = await dalProductoPlan.TiposFinanciamientoSegunFiltro(filtro);

            return Json(new { lstData = lstData, sesion = true });
        }
    
        [HttpPost]
        public async Task<IActionResult> ListarFactCatalogoPlanes(string Codigo, string Descripcion)
        {

            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {
                var dal = new DalPaquetes();
                var idUsuario = IdUsuarioSesion();

                var dataSet = await dal.ListarFactCatalogoPaquete(Codigo, Descripcion);

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }

        }



        
        ///////////////////////////////////////////////////////////////////////////////////////////
        


        [HttpPost]
        public async Task<IActionResult> FactConfigProductoPlan_Listar(string IdTipoFinanciamiento, string Descripcion)
        {

            if (!UsuarioAutenticado())
                return SessionExpiredResult();
            try
            {
                var dal = new DalProductoPlan();
                var idUsuario = IdUsuarioSesion();
                var dataSet = await dal.FactConfigProductoPlan_Listar( IdTipoFinanciamiento,  Descripcion);
                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }

        }



        [HttpPost]
        public async Task<IActionResult> FactConfigProductoPlan_InsertarActualizar(
        int? IdTipoFinanciamiento,
        string Descripcion,
        int esOficina,
        int esSalida,
        int SeIngresPrecios,
        int EsFarmacia,
        int idCajaTiposComprobante,
        string tipoVenta,
        int SeImprimeComprobante,
        int esFuenteFinanciamiento,
        int GeneraPago,
        int idTipoConcepto
        )
            {
                if (!UsuarioAutenticado())
                    return SessionExpiredResult();

                try
                {
                    var dal = new DalProductoPlan();
                    var idUsuario = IdUsuarioSesion();

                    var resultado = await dal.FactConfigProductoPlan_InsertarActualizar(
                        IdTipoFinanciamiento,
                        Descripcion,
                        esOficina,
                        esSalida,
                        SeIngresPrecios,
                        EsFarmacia,
                        idCajaTiposComprobante,
                        tipoVenta,
                        SeImprimeComprobante,
                        esFuenteFinanciamiento,
                        GeneraPago,
                        idTipoConcepto
                    );

                    return SuccessResponse(new { success = resultado });
                }
                catch (Exception ex)
                {
                    return ErrorResponse($"¡Error! {ex.Message}");
                }
            }



        [HttpPost]
        public async Task<IActionResult> FactConfigProductoPlan_Listar_TipoConcepto()
        {
            var dal = new DalProductoPlan();
            var idUsuario = IdUsuarioSesion();
            var dt = await dal.FactConfigProductoPlan_Listar_TipoConcepto();
            var lista = dt.AsEnumerable().Select(row => new {
                Id = row["id"],
                Nombre = row["nombre"]
            });

            return Json(lista);
        }
        [HttpPost]
        public async Task<IActionResult> FactConfigProductoPlan_Listar_TipoComprobante()
        {
            var dal = new DalProductoPlan();
            var idUsuario = IdUsuarioSesion();
            var dt = await dal.FactConfigProductoPlan_Listar_TipoComprobante();
            var lista = dt.AsEnumerable().Select(row => new {
                Id = row["id"],
                Nombre = row["nombre"]
            });

            return Json(lista);
        }




    }



















}





















