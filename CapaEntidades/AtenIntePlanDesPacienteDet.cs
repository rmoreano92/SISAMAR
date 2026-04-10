using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class AtenIntePlanDesPacienteDet
    {
        public int IdPlanDesarrolloPaciente { get; set; }
        public int IdPlanIntegralPaciente { get; set; }
        public int IdItemDesarrollo { get; set; }
        public int OrdenItem { get; set; }
        public Boolean EjecutaAccion { get; set; }

    }
}
