using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using WebAppMaternidad.Context.Facturacion.Domain;

namespace WebAppMaternidad.Context.Facturacion.Application.Services
{
    public class ConsumoServicioService : IConsumoServicioService
    {
        public readonly IConsumoServicioRepository _consumoServicioRepository;

        public ConsumoServicioService(IConsumoServicioRepository consumoServicioRepository)
        {
            _consumoServicioRepository = consumoServicioRepository;
        }
        public async Task<DataSet> FacturacionServicioDespachoXcuenta(int idCuentaAtencion, int OrderByPuntoCarga)
        {
            var dataSet = await _consumoServicioRepository.FacturacionServicioDespachoXcuenta(idCuentaAtencion, OrderByPuntoCarga);
                return dataSet;
        }
    }
}