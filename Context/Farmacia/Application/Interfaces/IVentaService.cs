using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace WebAppMaternidad.Context.Farmacia.Application.Interfaces
{
    public interface IVentaService
    {
        Task<IActionResult> FarmMovimientoVentasDetalleXcuenta(int idCuentaAtencion, int OrderByDocumentoNumero);
    }
}