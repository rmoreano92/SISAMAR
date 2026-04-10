using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using MediatR;

namespace WebAppMaternidad.Context.Facturacion.Application.Queries.FacturacionServicioDespachoXCuenta
{
    public class FacturacionServicioDespachoXCuentaQuery : IRequest<DataSet>
    {
        public int IdCuentaAtencion { get; set; }
        public int OrderByPuntoCarga { get; set; }

        // public FacturacionServicioDespachoXCuentaQuery(int idCuentaAtencion, int orderByPuntoCarga)
        // {
        //     IdCuentaAtencion = idCuentaAtencion;
        //     OrderByPuntoCarga = orderByPuntoCarga;
        // }
    }
}