using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.Controllers;
using Newtonsoft.Json;
using System.Collections.Generic;
using WebAppMaternidad.CapaEntidades;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.FactConfig
{
    public class PaquetesController: BaseController
    {

        [HttpPost]
        public async Task<IActionResult> ListarFactCatalogoPaquete(string Codigo, string Descripcion)
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

        [HttpPost]
        public async Task<IActionResult> ListarDetallePaquete(int idFactPaquete)
        {

            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {
                var dal = new DalPaquetes();
                var idUsuario = IdUsuarioSesion();

                var dataSet = await dal.ListarDetallePaquete(idFactPaquete);

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }

        }

        [HttpPost]
        public async Task<IActionResult> CrearModificarFacturacionCatalogoPaquetes(
            int idFactPaquete, string Codigo, string Descripcion, int idTipoFinanciamiento, int idEstado, int TipoPaquete, string lstDetallePaquete, int IdListBarItem)
        {

            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {

                var lstObjDetallePaquete = JsonConvert.DeserializeObject<List<FacturacionCatalogoPaquetes>>(lstDetallePaquete);

                var dal = new DalPaquetes();
                var idUsuario = IdUsuarioSesion();


                var dataSet = await dal.CrearModificarFacturacionCatalogoPaquetes(idFactPaquete, Codigo, Descripcion, idTipoFinanciamiento, idEstado, TipoPaquete, lstObjDetallePaquete, idUsuario, IdListBarItem);

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }
        }

        //[HttpPost]
        //public async Task<IActionResult> CatalogoServiciosSeleccionarSoloConPreciosEnParticularV2(int? IdPuntoCarga, int? IdCuentaAtencion)
        //{

        //    if (!UsuarioAutenticado())
        //        return SessionExpiredResult();

        //    try
        //    {
        //        var dal = new DalPaquetes();
        //        var idUsuario = IdUsuarioSesion();

        //        var dataSet = await dal.CatalogoServiciosSeleccionarSoloConPreciosEnParticularV2(IdPuntoCarga, IdCuentaAtencion);

        //        return SuccessResponse(dataSet);
        //    }
        //    catch (Exception ex)
        //    {
        //        return ErrorResponse($"¡Error! {ex.Message}");
        //    }

        //}

        //[HttpPost]
        //public async Task<IActionResult> EspecialidadesSeleccionarPorFiltro(string Filtro)
        //{

        //    if (!UsuarioAutenticado())
        //        return SessionExpiredResult();

        //    try
        //    {
        //        var dal = new DalPaquetes();
        //        var idUsuario = IdUsuarioSesion();

        //        var dataSet = await dal.EspecialidadesSeleccionarPorFiltro(Filtro);

        //        return SuccessResponse(dataSet);
        //    }
        //    catch (Exception ex)
        //    {
        //        return ErrorResponse($"¡Error! {ex.Message}");
        //    }

        //}

    }
}
