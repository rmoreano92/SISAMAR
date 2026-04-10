using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class ParametrosMonitoreo
    {
        public int idMonitoreo { get; set; }
        public int idAtencionDetalleUCI { get; set; }
        public int nroEvaluacion { get; set; }
        public int idItem { get; set; }
        public int idParametro { get; set; }

        public string nombreParametro { get; set; }

        public string valorParametro { get; set; }

    }
}
