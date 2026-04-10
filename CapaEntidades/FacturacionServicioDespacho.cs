using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class FacturacionServicioDespacho
    {
        public int idOrden { get; set; }

        public int idProducto { get; set; }

        public int cantidad { get; set; }

        public decimal precio { get; set; }

        public decimal total { get; set; }

        public string labConfHIS { get; set; }

        public int? GrupoHIS { get; set; }

        public int? SubGrupoHIS { get; set; }

        public string descripcion { get; set; }

        public string dx { get; set; }

        public string fechaEjecucion { get; set; }
        public string horaEjecucion { get; set; }
        public string condicionIngreso { get; set; }
    }
}
