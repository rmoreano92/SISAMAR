using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class EvaluacionNeonatal
    {
        public int IdEvaluacion { get; set; }
        public int IdAtencion { get; set; }
        public int Glasgow { get; set; }
        public string TiempoEnfermedad { get; set; }
        public string InicioEnfermedad { get; set; }
        public string CursoEnfermedad { get; set; }
        public bool DificultadRespiratoria { get; set; }
        public bool Diarrea { get; set; }
        public bool DistensionAbdominal { get; set; }
        public bool Cianosis { get; set; }
        public bool MalOlorOmbligo { get; set; }
        public bool Ictericia { get; set; }
        public bool Dolor { get; set; }
        public bool Convulsiones { get; set; }
        public bool Fiebre { get; set; }
        public bool Vomitos { get; set; }
        public bool Hemorragia { get; set; }
        public bool Otros { get; set; }
        public string OtrosSintomas { get; set; }
        public string Relato { get; set; }
        public string AtecedentesGenerales { get; set; }


    }
}
