using System;

namespace CapaEntidades
{
    public class EvaluacionHospitalizacionDetalle
    {
        public int IdEvaluacionDetalle { get; set; }
        public int IdCuentaAtencion { get; set; }
        public int IdAtencion { get; set; }
        public int IdNumero { get; set; }
        public string Seguimiento { get; set; }
        public string Indicaciones { get; set; }
        public int IdUsuario { get; set; }
        public DateTime fecha { get; set; }
        public string PlandeTrabajo { get; set; }
        public string Tratamiento { get; set; }
        public DateTime FechaActualizacion { get; set; }
        public int idservicio { get; set; }
        public string HoraInicioAtencion { get; set; }
    }
}
