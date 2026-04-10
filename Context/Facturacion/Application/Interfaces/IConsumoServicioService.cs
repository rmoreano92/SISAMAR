using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace WebAppMaternidad.Context.Facturacion.Application
{
    public interface IConsumoServicioService
    {
        Task<DataSet> FacturacionServicioDespachoXcuenta(int idCuentaAtencion, int OrderByPuntoCarga);
    }
}