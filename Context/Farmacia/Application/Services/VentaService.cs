using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebAppMaternidad.Context.Farmacia.Application.Interfaces;
using WebAppMaternidad.Context.Farmacia.Domain;

namespace WebAppMaternidad.Context.Farmacia.Application
{
    public class VentaService : IVentaService
    {
        private readonly IVentaRepository _ventaRepository;

        public VentaService(IVentaRepository ventaRepository)
        {
            _ventaRepository = ventaRepository;
        }

        public async Task<IActionResult> FarmMovimientoVentasDetalleXcuenta(int idCuentaAtencion, int OrderByDocumentoNumero)
        {
            try
            {
                var dataSet = await _ventaRepository.FarmMovimientoVentasDetalleXcuenta(idCuentaAtencion, OrderByDocumentoNumero);
                return new OkObjectResult(dataSet);
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult($"¡Error! {ex.Message}");
            }
        }
    }
}