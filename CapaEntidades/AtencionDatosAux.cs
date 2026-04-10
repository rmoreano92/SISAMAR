using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class AtencionDatosAux
    {
        public int idAtencion { get; set; }
        public int idPaciente { get; set; }
        public string antecedQuirurgico { get; set; }
        public string antecedPatologico { get; set; }
        public string antecedObstetrico { get; set; }
        public string antecedAlergico { get; set; }
        public string antecedFamiliar { get; set; }
        public string antecedentes { get; set; }
        public int idUsuario { get; set; }
    }
}
