using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    // JDELGADO001.2 CREACION
    public class FacturacionCuentasAtencion
    {
        public string TotalPorPagar { get; set; }
        public int IdCuentaAtencion { get; set; }
        public int IdEstado { get; set; }
        public string TotalPagado { get; set; }
        public string TotalAsegurado { get; set; }
        public string TotalExonerado { get; set; }
        public string HoraCierre { get; set; }
        public DateTime? FechaCierre { get; set; }
        public string HoraApertura { get; set; }
        public DateTime? FechaApertura { get; set; }
        public int IdPaciente { get; set; }
        public int? IdUsuarioCrea { get; set; }
        public DateTime? FechaCreacion { get; set; }
    }
}
