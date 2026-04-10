using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebAppMaternidad.Context.Facturacion.Application;
using WebAppMaternidad.Context.Facturacion.Application.Queries.FacturacionServicioDespachoXCuenta;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Context.Facturacion.Presentation.Controllers
{
    public class ConsumoServicioController : BaseController
    {

        // private readonly IConsumoServicioService _consumoServicioService;

        private readonly IMediator _mediator;

        public ConsumoServicioController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> FacturacionServicioDespachoXcuenta(int idCuentaAtencion)
        {
            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {
                var idUsuario = IdUsuarioSesion();

                var dataSet = await _mediator.Send(new FacturacionServicioDespachoXCuentaQuery
                {
                    IdCuentaAtencion = idCuentaAtencion,
                    OrderByPuntoCarga = 0
                });

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }
        }
    }
}