using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class FactOrdenServicioPagos
    {
        public int idOrdenPago { get; set; }

        public int? idComprobantePago { get; set; }

        public int idOrden { get; set; }

        public decimal ImporteExonerado { get; set; }

        public DateTime FechaCreacion { get; set; }

        public int IdUsuario { get; set; }

        public int IdEstadoFacturacion { get; set; }

        public int? idUsuarioExonera { get; set; }

        public int? idUsuarioAuditoria { get; set; }

    }
}
