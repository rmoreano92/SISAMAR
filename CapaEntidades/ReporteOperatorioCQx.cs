using System;

namespace WebAppMaternidad.CapaEntidades
{
    public class ReporteOperatorioCQx
    {
        public int? IdReporteOperatorio { get; set; }
        public int? IdSolicitudSOP { get; set; }
        public int? IdCuentaAtencion { get; set; }
        public string NroReporteOperatorio { get; set; }
        public string NroFolio { get; set; }
        public int? IdGasa { get; set; }
        public string CantidadGasa { get; set; }
        public int? IdDepressing { get; set; }
        public string CantidadDepressing { get; set; }
        public int? IdPrimeraAnestesia { get; set; }
        public int? IdTipoPrimeraAnestesia { get; set; }
        public int? IdSegundaAnestesia { get; set; }
        public int? IdTipoSegundaAnestesia { get; set; }
        public int? IdCirugiaRealizada { get; set; }
        public string Tecnicas { get; set; }
        public string Hallazgos { get; set; }
        public string IncidentesAccidentes { get; set; }
        public string MaterialesCqx { get; set; }
        public int? AnatomiaPatologica { get; set; }
        public string TejidoOrganoExaminar { get; set; }
        public int? EventoAdversoTransoperativo { get; set; }
        public int? EventoAdversoTransanestesico { get; set; }
        public int? PinzamientoCorteCordonUmbilical { get; set; }
        public int? Destino { get; set; }
        public int? IdTurno { get; set; }
        public int? IdSala { get; set; }
        public int? IdTipoCirugia { get; set; }
        public int? IdQuirofano { get; set; }
        public int? IdOrden { get; set; }
        public DateTime? FechaCirugia { get; set; }
        public string HoraCirugia { get; set; }
        public string HoraFinalCirugia { get; set; }
        public string ProcedimientoCqx { get; set; }
        public int? IdMedicoPrincipal { get; set; }
        public int? IdCirujanoII { get; set; }
        public int? IdMedicoAyudanteI { get; set; }
        public int? IdMedicoAyudanteII { get; set; }
        public int? IdAnestesiologo { get; set; }
        public int? IdAyudanteAnestesiologo { get; set; }
        public int? IdInstrumentistaI { get; set; }
        public int? IdInstrumentistaII { get; set; }
        public int? IdTecnicoEnfermeria { get; set; }
    }
}
