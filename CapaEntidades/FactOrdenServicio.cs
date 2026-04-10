using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class FactOrdenServicio
    {
        public int IdOrden { get; set; }

        public int IdPuntoCarga { get; set; }

        public int? IdPaciente { get; set; }

        public int IdCuentaAtencion { get; set; }

        public int? IdServicioPaciente { get; set; }

        public int idTipoFinanciamiento { get; set; }

        public int idFuenteFinanciamiento { get; set; }

        public DateTime FechaCreacion { get; set; }

        public int IdUsuario { get; set; }

        public DateTime? FechaDespacho { get; set; }

        public int? IdUsuarioDespacho { get; set; }

        public int IdEstadoFacturacion { get; set; }

        public DateTime? FechaHoraRealizaCpt { get; set; }

        public int IdUsuarioAuditoria { get; set; }

    }

}
