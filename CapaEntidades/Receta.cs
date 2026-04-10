using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
   public class Receta
    {
        public int idUsuario { get; set; }
        public int idMedico { get; set; }
        public int idMedicoIngreso { get; set; }
        public int idReceta { get; set; }
        public int idPuntoCarga { get; set; }
        public int idCuentaAtencion { get; set; }
        public int idServicioReceta { get; set; }
        public int nroEvaluacion { get; set; }
        public int idEstado { get; set; }
        public int idComprobantePago { get; set; }
        public string nroPreUnidosis { get; set; }
        public int? esRecetaAntimicrobiano { get; set; }
        public int? idObstetra { get; set; }
        public int? esRecetaIntervencionSanitaria { get; set; }
        public int? idCoordinadorIS { get; set; }
        public int? idComponenteIS { get; set; }
        public int? idSubComponenteIS { get; set; }
        public int? idDiagnosticoIS { get; set; }
        public string ObservacionesIS { get; set; }
        public  string fechaReceta { get; set; }
        public string fechaVigencia { get; set; }
        public string otrosMedicamentos { get; set; }
    }
}
