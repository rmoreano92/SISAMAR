using System;


namespace WebAppMaternidad.CapaEntidades
{
    public class GestionAntimicrobiano
    {
        public int IdSolicitudAntimicrobiano { get; set; }
        public int? IdReceta { get; set; }
        public int? IdMotivo { get; set; }
        public int? IdDiagnostico { get; set; }
        public String CondicionPaciente { get; set; }
        public string TratamientoPrevio { get; set; } 
        public string FechaSolicitud { get; set; }
        public int? AutorizaAntimicrobiano { get; set; }
        public int? IdMotivoRechazo { get; set; }
        public string FechaRespuesta { get; set; }
        public string SugerenciasTratamiento { get; set; } 
        public string FechaRegistro { get; set; }
        public int IdUsuarioRegistro { get; set; }
        public string FechaModifica { get; set; }
        public int IdUsuarioModifica { get; set; }
        public int EstaAutorizando { get; set; }
        public int GenerarSolicitudAntimicrobiano { get; set; }
        public int Estado { get; set; }
    }
}
