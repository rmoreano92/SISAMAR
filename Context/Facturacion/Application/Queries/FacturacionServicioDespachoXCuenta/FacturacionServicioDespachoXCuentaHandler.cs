using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using WebAppMaternidad.Context.Facturacion.Domain;

namespace WebAppMaternidad.Context.Facturacion.Application.Queries.FacturacionServicioDespachoXCuenta
{
    public class FacturacionServicioDespachoXCuentaHandler : IRequestHandler<FacturacionServicioDespachoXCuentaQuery, DataSet>
    {
        public readonly IConsumoServicioRepository _consumoServicioRepository;

        public FacturacionServicioDespachoXCuentaHandler(IConsumoServicioRepository consumoServicioRepository)
        {
            _consumoServicioRepository = consumoServicioRepository;
        }
        public async Task<DataSet> Handle(FacturacionServicioDespachoXCuentaQuery query, CancellationToken cancellationToken)
        {
            var dataSet = await _consumoServicioRepository.FacturacionServicioDespachoXcuenta(query.IdCuentaAtencion, query.OrderByPuntoCarga);
                return dataSet;
        }
    }
}