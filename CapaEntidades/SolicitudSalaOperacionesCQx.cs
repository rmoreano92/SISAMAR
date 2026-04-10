using System;

namespace WebAppMaternidad.CapaEntidades
{
    public class SolicitudSalaOperacionesCQx
    {
        public int? IdSolicitudSOP { get; set; }
        public string NroSolicitud { get; set; }
        public int? IdCuentaAtencion { get; set; }
        public int? IdUbicacionPaciente { get; set; }
        public int? IdPaciente { get; set; }
        public int? Edad { get; set; }
        public string Peso { get; set; }
        public DateTime? FechaSolicitud { get; set; }
        public int? IdTipoSolicitud { get; set; }
        public int? IdMedicoSolicita { get; set; }
        public int? IdEstado { get; set; }
        public int? IdTipoIntervencionCQx { get; set; }
        public int? IdTipoIntervencion { get; set; }
        public int? IdTurno { get; set; }
        public int? IdTipoOperación { get; set; }
        public int? IdTipoCirugia { get; set; }
        public int? IdSala { get; set; }
        public int? IdEspecialidad { get; set; }
        public int? IdCondicion { get; set; }
        public int? IdQuirofano { get; set; }
        public int? IdServicioOrigen { get; set; }
        public int? IdCama { get; set; }
        public DateTime? FechaCirugia { get; set; }
        public string HoraCirugia { get; set; }
        public string DescripcionCirugiaProcedimiento { get; set; }
        public string RiesgosDerivados { get; set; }
        public int? IdTipoDocTutor { get; set; }
        public string NroDocumento { get; set; }
        public int? IdParentesco { get; set; }
        public int? IdMedicoPrincipal { get; set; }
        public int? IdCirujanoII { get; set; }
        public int? IdMedicoAyudanteI { get; set; }
        public int? IdMedicoAyudanteII { get; set; }
        public int? IdAnestesiologo { get; set; }
        public int? IdAyudanteAnestesiologo { get; set; }
        public int? IdInstrumentistaI { get; set; }
        public int? IdInstrumentistaII { get; set; }
        public int? IdTecnicoEnfermeria { get; set; }
        public int? IdTipoEdad { get; set; }
        public int? ClaseIntervencion { get; set; }
        public int? ClasePlaciente { get; set; }
        public int? SolicitudCirujano { get; set; }
        public int? SolicitudPrimerAyudante { get; set; }
        public int? SolicitudAnestesiologoCQx { get; set; }
        public int? SolicitudTipoAnestesiaPreviaCQx { get; set; }
        public int? SalaSolicitudCQx { get; set; }
        public DateTime? FechaParaCQx { get; set; }
        public string HoraParaCqx { get; set; }
        public DateTime? FechaSolicitudCQx { get; set; }
        public string HoraSolicitudCQx { get; set; }
        public DateTime? FechaSolicitudCQxAceptada { get; set; }
        public string HoraSolicitudCQxAceptada { get; set; }

        public int? IdTipoPaciente { get; set; }
        public int? IdOrdenSugerido { get; set; }
    }
}
