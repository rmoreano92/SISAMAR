using System;

namespace WebAppMaternidad.CapaEntidades
{
    public class EvaluacionObstetrica
    {
        public int IdEvaluacion { get; set; }
        public int IdAtencion { get; set; }
        public int? idProCabecera { get; set; }
        public string FechaUR { get; set; }
        public string FechaPP { get; set; }
        public string FechaEco { get; set; }
        public int? EdadGestacional { get; set; }
        public int? DiasGestacional { get; set; }
        public int? Cnp { get; set; }
        public int? CalculaFE { get; set; }
        public int? FechaEcoAct { get; set; }
        public int? SemanaGestacionalEco { get; set; }
        public int? DiasGestacionalEco { get; set; }
        public int? IdUsuarioRegistra { get; set; }
        public DateTime? FechaRegistra { get; set; }
        public int? IdUsuarioModifica { get; set; }
        public DateTime? FechaModifica { get; set; }
        public int? Estado { get; set; }
    }
}
