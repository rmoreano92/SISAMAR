using System;

namespace WebAppMaternidad.CapaEntidades
{
    public class ProgramacionSalaOperacionesCQx
    {
        public int IdProgramacionSala { get; set; }
        public int? IdSolicitudSOP { get; set; }
        public int? IdPaciente { get; set; }
        public int? IdEspecialidad { get; set; }
        public int? IdServicio { get; set; }
        public DateTime? FechaProgramada { get; set; }
        public string HoraProgramada { get; set; }
        public int? IdMedicoProgramado { get; set; }
        public int? IdOrdenProg { get; set; }
        public int? IdTurno { get; set; }
        public int? IdSala { get; set; }
        public int? IdTipoCirugia { get; set; }
        public int? IdQuirofano { get; set; }
        public int? IdBancoSangre { get; set; }
        public string CantidadBS { get; set; }
        public int? ExamenesAuxiliares { get; set; }
        public int? EvaluacionPreanestesica { get; set; }
        public int? ConsentimientoInformado { get; set; }
        public int? IdRiesgoQx { get; set; }
        public int? NivelRiesgoQx { get; set; }
        public DateTime? FechaCirugia { get; set; }
        public int? IdAnestesiologo { get; set; }
        public int? IdAyudanteAnestesiologo { get; set; }
        public int? IdInstrumentistaI { get; set; }
        public int? IdInstrumentistaII { get; set; }
        public string ObservacionProgramacion { get; set; }

    }
}
