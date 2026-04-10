using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebAppMaternidad.Context.Facturacion.Application.Services;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Context.Facturacion.Presentation.Controllers
{
    [Route("api/estado-cuenta")]
    public class EstadoCuentaController : BaseController
    {
        private readonly EstadoCuentaService _estadoCuentaService;

        public EstadoCuentaController(EstadoCuentaService estadoCuentaService)
        {
            _estadoCuentaService = estadoCuentaService;
        }

        [HttpPost("paciente/deudas/sangre")]
        public async Task<IActionResult> TieneDeudaDeSangre(int idPaciente)
        {
            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {
                var idUsuario = IdUsuarioSesion();

                var dataSet = await _estadoCuentaService.TieneDeudaDeSangre(idPaciente);

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }
        }
    }
}