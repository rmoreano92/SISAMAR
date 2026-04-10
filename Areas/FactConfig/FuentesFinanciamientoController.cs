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

namespace WebAppMaternidad.Areas.FactConfig
{
    public class FuentesFinanciamientoController : BaseController
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
        public async Task<IActionResult> FuentesFinanciamientoIAFA_Listar(string IdTipoFinanciamiento, string Descripcion)
        {

            if (!UsuarioAutenticado())
                return SessionExpiredResult();
            try
            {
                var dal = new DalFuenteFinanciamientoIAFA();
                var idUsuario = IdUsuarioSesion();
                var dataSet = await dal.FuentesFinanciamientoIAFA_Listar( IdTipoFinanciamiento,  Descripcion);
                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }

        }

        [HttpPost]
        public async Task<IActionResult> FuentesFinanciamientoIAFA_ListarDetalle(string IdFuenteFinanciamiento)
        {

            if (!UsuarioAutenticado())
                return SessionExpiredResult();
            try
            {
                var dal = new DalFuenteFinanciamientoIAFA();
                var idUsuario = IdUsuarioSesion();
                var dataSet = await dal.FuentesFinanciamientoIAFA_ListarDetalle(IdFuenteFinanciamiento);
                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }

        }


        [HttpPost]
        public async Task<IActionResult> FuentesFinanciamientoIAFA_InsertarActualizar(
    int? IdFuenteFinanciamiento,
    string Descripcion,
    int? IdTipoFinanciamiento,
    int? idTipoConceptoFarmacia,
    int? UtilizadoEn,
    string CodigoFuenteFinanciamientoSEM,
    int? idAreaTramitaSeguros,
    int? EsUsadoEnCaja,
    string CodigoHIS,
    int idTipoFinanciador,
    string codigo,
    int? Estado)
        {
            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {
                var dal = new DalFuenteFinanciamientoIAFA();
                var idUsuario = IdUsuarioSesion();

                var resultado = await dal.FuentesFinanciamientoIAFA_InsertarActualizar(
                    IdFuenteFinanciamiento,
                    Descripcion,
                    IdTipoFinanciamiento,
                    idTipoConceptoFarmacia,
                    UtilizadoEn,
                    CodigoFuenteFinanciamientoSEM,
                    idAreaTramitaSeguros,
                    EsUsadoEnCaja,
                    CodigoHIS,
                    idTipoFinanciador,
                    codigo,
                    Estado
                );

                return SuccessResponse(new { success = resultado });
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }
        }

        [HttpPost]
            public async Task<IActionResult> FuentesFinanciamientoIAFA_InsertarActualizarDetalle(
        int vIdFuenteFinanciamiento,
        int vIdTipoFinanciamiento)
            {
                if (!UsuarioAutenticado())
                    return SessionExpiredResult();

                try
                {
                    var dal = new DalFuenteFinanciamientoIAFA();
                    var idUsuario = IdUsuarioSesion();

                    var resultado = await dal.FuentesFinanciamientoIAFA_InsertarActualizarDetalle(
                        vIdFuenteFinanciamiento,
                        vIdTipoFinanciamiento
                    );

                    return SuccessResponse(new { success = resultado });
                }
                catch (Exception ex)
                {
                    return ErrorResponse($"¡Error! {ex.Message}");
                }
            }


        [HttpPost]
        public async Task<IActionResult> FuentesFinanciamientoIAFA_EliminarDetalle(
        int vIdFuenteFinanciamiento,
        int vIdTipoFinanciamiento)
        {
            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {
                var dal = new DalFuenteFinanciamientoIAFA();
                var idUsuario = IdUsuarioSesion();

                var resultado = await dal.FuentesFinanciamientoIAFA_EliminarDetalle(
                    vIdFuenteFinanciamiento,
                    vIdTipoFinanciamiento
                );

                return SuccessResponse(new { success = resultado });
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }
        }

        [HttpPost]
            public async Task<IActionResult> FuentesFinanciamientoIAFA_Listar_TipoFinanciador()
        {
            var dal = new DalFuenteFinanciamientoIAFA();
            var idUsuario = IdUsuarioSesion();
            var dt = await dal.FuentesFinanciamientoIAFA_Listar_TipoFinanciador();
            var lista = dt.AsEnumerable().Select(row => new {
                Id = row["id"],
                Nombre = row["nombre"]
            });

            return Json(lista);
        }
        [HttpPost]
        public async Task<IActionResult> FuentesFinanciamientoIAFA_Listar_FarmTipoConceptos()
        {
            var dal = new DalFuenteFinanciamientoIAFA();
            var idUsuario = IdUsuarioSesion();
            var dt = await dal.FuentesFinanciamientoIAFA_Listar_FarmTipoConceptos();
            var lista = dt.AsEnumerable().Select(row => new {
                Id = row["id"],
                Nombre = row["nombre"]
            });

            return Json(lista);
        }
        [HttpPost]
        public async Task<IActionResult> FuentesFinanciamientoIAFA_Listar_UtilizadosEn()
        {
            var dal = new DalFuenteFinanciamientoIAFA();
            var idUsuario = IdUsuarioSesion();
            var dt = await dal.FuentesFinanciamientoIAFA_Listar_UtilizadosEn();
            var lista = dt.AsEnumerable().Select(row => new {
                Id = row["id"],
                Nombre = row["nombre"]
            });

            return Json(lista);
        }
        [HttpPost]
        public async Task<IActionResult> FuentesFinanciamientoIAFA_Listar_AreaTramitaSeguros()
        {
            var dal = new DalFuenteFinanciamientoIAFA();
            var idUsuario = IdUsuarioSesion();
            var dt = await dal.FuentesFinanciamientoIAFA_Listar_AreaTramitaSeguros();
            var lista = dt.AsEnumerable().Select(row => new {
                Id = row["id"],
                Nombre = row["nombre"]
            });

            return Json(lista);
        }
        [HttpPost]
        public async Task<IActionResult> FuenteFinanciamientoIAFA_Listar_TiposFinanciamiento()
        {
            var dal = new DalFuenteFinanciamientoIAFA();
            var idUsuario = IdUsuarioSesion();
            var dt = await dal.FuenteFinanciamientoIAFA_Listar_TiposFinanciamiento();
            var lista = dt.AsEnumerable().Select(row => new {
                Id = row["id"],
                Nombre = row["nombre"]
            });

            return Json(lista);
        }



    }



















}





















