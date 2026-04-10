using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class EvaluacionNeonatalDetalle
    {
        public int IdEvaluacionDetalle { get; set; }
        public int IdAtencion { get; set; }
        public int NroEvaluacion { get; set; }
        public string ImpresionDiagnostica { get; set; }
        public string Seguimiento { get; set; }
        public string Indicaciones { get; set; }
        public string Tratamiento { get; set; }
        public string PlanTrabajo { get; set; }
        public string FechaInicioAtencion { get; set; }
        public string HoraInicioAtencion { get; set; }
        public int idservicio { get; set; }
        public int IdUsuario { get; set; }
    }
}
