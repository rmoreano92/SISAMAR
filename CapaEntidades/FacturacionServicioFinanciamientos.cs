using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class FacturacionServicioFinanciamientos
    {
        public int idOrden { get; set; }

        public int idProducto { get; set; }

        public int IdTipoFinanciamiento { get; set; }

        public int? idFuenteFinanciamiento { get; set; }

        public int CantidadFinanciada { get; set; }

        public decimal PrecioFinanciado { get; set; }

        public decimal TotalFinanciado { get; set; }

        public DateTime FechaAutoriza { get; set; }

        public int IdUsuarioAutoriza { get; set; }

        public int? idEstadoFacturacion { get; set; }

    }
}
