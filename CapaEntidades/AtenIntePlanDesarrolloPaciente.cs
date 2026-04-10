using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class AtenIntePlanDesarrolloPaciente
    {
        public int idPlanDesarrolloPaciente { get; set; }
        public int idPlanIntegralPaciente { get; set; }
        public int evaluacion { get; set; }
        public int idPlanAtencion { get; set; }
        public int idAtenInteItemPlan { get; set; }
        public DateTime fechaProgramada { get; set; }
        public DateTime fechaEjecucion { get; set; }
        public int numeroSesion { get; set; }
        public int idAtencion { get; set; }
        public int idEstablecimiento { get; set; }

        public int idPaciente { get; set; }

        public int idUsuario { get; set; }

    }
}
