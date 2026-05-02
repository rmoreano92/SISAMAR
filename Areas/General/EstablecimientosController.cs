using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.Controllers;
using WebAppMaternidad.CapaEntidades;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.General
{
    public class EstablecimientosController: BaseController
    {

        [HttpPost]
        public async Task<IActionResult> TiposEstablecimientos()
        {

            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {
                var dal = new DalEstablecimientos();
                var idUsuario = IdUsuarioSesion();

                var dataSet = await dal.TiposEstablecimientos();

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> TiposSubsector()
        {

            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {
                var dal = new DalEstablecimientos();
                var idUsuario = IdUsuarioSesion();

                var dataSet = await dal.TiposSubsector();

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CrearModificarEstablecimientos(Establecimientos establecimientos, int IdListBarItem)
        {

            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {
                var dal = new DalEstablecimientos();
                var idUsuario = IdUsuarioSesion();

                var dataSet = await dal.CrearModificarEstablecimientos(establecimientos, idUsuario, IdListBarItem);

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> SeleccionarEstablecimientoByIdEstablecimiento(int IdEstablecimiento)
        {

            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {
                var dal = new DalEstablecimientos();
                var idUsuario = IdUsuarioSesion();

                var dataSet = await dal.SeleccionarEstablecimientoByIdEstablecimiento(IdEstablecimiento);

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CrearModificarEstablecimientosNoMinsa(Establecimientos establecimientos, int IdListBarItem)
        {

            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {
                var dal = new DalEstablecimientos();
                var idUsuario = IdUsuarioSesion();

                var dataSet = await dal.CrearModificarEstablecimientosNoMinsa(establecimientos, idUsuario, IdListBarItem);

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> SeleccionarEstablecimientosNoMinsaByIdEstablecimiento(int IdEstablecimiento)
        {

            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {
                var dal = new DalEstablecimientos();
                var idUsuario = IdUsuarioSesion();

                var dataSet = await dal.SeleccionarEstablecimientosNoMinsaByIdEstablecimiento(IdEstablecimiento);

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }
        }

    }
}
