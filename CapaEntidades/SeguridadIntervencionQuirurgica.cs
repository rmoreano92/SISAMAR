using System;

namespace WebAppMaternidad.CapaEntidades
{
    public class SeguridadIntervencionQuirurgica
    {
        public int IdSeguridadIntervencion { get; set; }
        public int IdAtencion { get; set; }
        public int NroEvaluacion { get; set; }

        public int? TipoPaciente { get; set; }
        public int? EstadoPaciente { get; set; }
        public int? PacienteConoceCirujano { get; set; }
        public int? SeMarcoSitioQuirurgico { get; set; }

        public bool? ConfirmacionNombreAdultos { get; set; }
        public bool? ConfirmacionZonaOperatoriaAdultos { get; set; }
        public bool? ConfirmacionProcedimientoAdultos { get; set; }
        public bool? ConfirmacionConsentimientoAdultos { get; set; }

        public bool? ConfirmacionNombreNeonatos { get; set; }
        public bool? ConfirmacionZonaOperatoriaNeonatos { get; set; }
        public bool? ConfirmacionProcedimientoNeonatos { get; set; }
        public bool? ConfirmacionConsentimientoNeonatos { get; set; }

        public bool? OximetroPulsoColocadoFuncionando { get; set; }
        public bool? Aspirador { get; set; }
        public bool? EquipoViaArea { get; set; }
        public bool? MaquinaAnestesiaOperativa { get; set; }
        public bool? DrogasEmergencia { get; set; }
        public bool? Oxigeno { get; set; }

        public int? AlergiaConocida { get; set; }
        public int? RiesgoPerdidaSangre { get; set; }
        public int? DificultadesViaArea { get; set; }
        public int? DisponeReposicionSanguinea { get; set; }
        public int? PrevisoDosVias { get; set; }

        public int? CumplieronProtocoloAsepsiaQuirurgica { get; set; }
        public int? SePresentaronPorNombreFuncion { get; set; }

        public bool? ConfirmaNombresPaciente { get; set; }
        public bool? ConfirmaTiempoOperatorio { get; set; }
        public bool? ConfirmaZonaOperatoria { get; set; }
        public bool? ConfirmaPerdidaSanguineaEstimada { get; set; }
        public bool? ConfirmaProcedimiento { get; set; }

        public int? TuvoSituacionInesperadaActoAnestesico { get; set; }

        public bool? ResultadosIndicadoresEsterilizacion { get; set; }
        public bool? InstrumentalGrasasCompresasAgujas { get; set; }
        public bool? MaterialInstrumentalEquipoAdicional { get; set; }

        public int? ConsideracionEspecial { get; set; }
        public int? AdministroProfilaxisConAntibioticos { get; set; }
        public int? TieneExamenRadiograficoParaExhibir { get; set; }

        public bool? NombreProcedimientoQuirurgico { get; set; }
        public bool? RecuentoInstrumentosGasasCompresasAgujas { get; set; }
        public bool RecomendacionesPostOperatorioInmediata { get; set; }

        public int? MuestraAnatomiaPatologicaRotulada { get; set; }
        public int? ProblemasConMaquinaAnestesiaMonitoreo { get; set; }
        public int? EventosIntraoperatoriosImportantes { get; set; }
        public int? ProblemasConInstrumento { get; set; }
        public string ObservacionesSalida { get; set; }

        public string NumeroSolicitud { get; set; }
        public int? MedicoPrincipal { get; set; }
        public int? CirujanoII { get; set; }
        public int? MedicoAyudanteI { get; set; }
        public int? MedicoAyudanteII { get; set; }
        public int? Anestesiologo { get; set; }
        public int? AyudanteAnestesiologo { get; set; }
        public int? InstrumentistaI { get; set; }
        public int? InstrumentistaII { get; set; }
        public DateTime? FechaInicioAtencion { get; set; }
        public string HoraInicioAtencion { get; set; }
    }
}
