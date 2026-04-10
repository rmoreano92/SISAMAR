using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class AtenIntePlanIntePaciente
    {
        public int idUsuario { get; set; }
        public int idPlanIntegralPaciente { get; set; }
        public int idAtenInteGrupo { get; set; }
        public int idPaciente { get; set; }
        public string fechaElaboracion { get; set; }
        public int idAtenInteItemPlan { get; set; }
        public int idAtencion { get; set; }
    }
}
