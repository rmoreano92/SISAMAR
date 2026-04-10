using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class AtencionesAnestesiologia
    {
        public int IdAtencionAnestesiologia { get; set; }
        public int IdAtencion { get; set; }
        public int? ClasificacionPaciente { get; set; }
        public int? Controles { get; set; }
        public int? EdadGestacional  { get; set; }
        public int? NroGestas { get; set; }
        public string EnfermedadActual { get; set; }
        public string TiempoEnfermedad { get; set; }
        public string Relato { get; set; }
        public int? Disnea { get; set; }
        public int? Ortopnea { get; set; }
        public int? Convulsiones { get; set; }
        public int? Fotopsias { get; set; }
        public int? Cianosis { get; set; }
        public int? Cefalea { get; set; }
        public int? Hemorragias { get; set; }
        public int? Fiebre { get; set; }
        public int? Dolor { get; set; }
        public int? Nausea_Vomito { get; set; }
        public int? Otros { get; set; }
        public int? Ninguno { get; set; }
        public string DescripcionOtros { get; set; }
        public string Apetito { get; set; }
        public string Sed { get; set; }
        public string Orina { get; set; }
        public string Deposiciones { get; set; }
        public string Suenio { get; set; }
        public string RXToraxResumen { get; set; }
        public string RiesgoQuirurgico { get; set; }
        public int? Operacion { get; set; }
        public int? ClasificacionASA { get; set; }
        public string Conclusion { get; set; }
        public int? TipoAnestesiaPrevista { get; set; }
        public int? TipoEvaluacionAnestesia { get; set; }
    }
}
