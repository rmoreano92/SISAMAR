using System;

namespace WebAppMaternidad.CapaEntidades
{
    public class TrabajoPartoHospitalizacion
    {
        public DateTime? FechaUltimoIngresoCqTp { get; set; }
        public int? CorticoidesAntenatalesCiclosTp { get; set; }
        public string CorticoidesAntenatalesSemanasTp { get; set; }
        public int? InicioTipoTp { get; set; }
        public string EdadGestacionalPartoTp { get; set; }
        public int? PresentacionSituacionTp { get; set; }
        public int? TamanioFetalTp { get; set; }
        public int? RoturaMembranaTp { get; set; }
        public string RoturaMembranaDiaTp { get; set; }
        public string RoturaMembranaMesTp { get; set; }
        public string RoturaMembranaAnioTp { get; set; }
        public int? RoturaMenor37Sem { get; set; }
        public string RoturaMembranaHoraTp { get; set; }
        public string RoturaMembranaMinutoTp { get; set; }
        public int? Mayor18Horas { get; set; }
        public int? Mayor38Grados { get; set; }
        public int? TerminacionAp { get; set; }
        public int? CausaInduccionAp { get; set; }
        public int? AcompanianteAp { get; set; }
        public int? PosicionPartoAp { get; set; }
        public int? EpisiotomiaAp { get; set; }
        public int? DesgarroAp { get; set; }
        public int? OcitocAlumbramAp { get; set; }
        public int? PlacentaPreviaAp { get; set; }
        public int? LigaduraCordonAp { get; set; }
        public int? MedicacionAp { get; set; }
        public int? MgSulfatoAp { get; set; }
        public int? OcitocicosAp { get; set; }
        public int? AntibioticosAp { get; set; }
        public int? AnalgesiaAp { get; set; }
        public int? AnestesiaRegionalAp { get; set; }
        public int? AnestesiaGeneralAp { get; set; }
        public int? TransfusionAp { get; set; }
        public string ObservacionesAtencionPartoAp { get; set; }
        public DateTime? FechaPartoNacimiento { get; set; }
        public string HoraPartoNacimiento { get; set; }
        public int? TipoGestacionNacimiento { get; set; }
        public string NumFetosNacimiento { get; set; }
        public int? GemelarNacimiento { get; set; }
        public int? CondicionNacimiento { get; set; }
        public int? ObitoMenor500Nacimiento { get; set; }
        public int? ObitoMayor500Nacimiento { get; set; }
        public string PesoNacerNacimiento { get; set; }
        public string TallaNacerNacimiento { get; set; }
        public string PerimetroCefalicoNacimiento { get; set; }
        public string EdadGestAlNacerNacimiento { get; set; }
        public string Apgar1MinNacimiento { get; set; }
        public string Apgar5MinNacimiento { get; set; }
        public int? RespuestaLlanoInmediatoNacimiento { get; set; }
        public int? RespuestaLlanoReanimacionNacimiento { get; set; }
        public int? RespuestaLlanoPatologiaNeonatalNacimiento { get; set; }
    }
}
