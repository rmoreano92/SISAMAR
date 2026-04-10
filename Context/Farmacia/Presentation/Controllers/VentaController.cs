using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebAppMaternidad.Context.Farmacia.Application.Interfaces;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Context.Farmacia.Application
{
    public class VentaController: BaseController
    {
        private readonly IVentaService _ventaService;

        public VentaController(IVentaService ventaService)
        {
            _ventaService = ventaService;
        }

        [HttpPost]
        public async Task<IActionResult> FarmMovimientoVentasDetalleXcuenta(int idCuentaAtencion)
        {
            // if (!UsuarioAutenticado())
            //     return SessionExpiredResult();

            try
            {
                // var idUsuario = IdUsuarioSesion();

                var dataSet = await _ventaService.FarmMovimientoVentasDetalleXcuenta(idCuentaAtencion, 0);

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }
        }
    }
}