using System;

namespace WebAppMaternidad.CapaEntidades
{
    public class EventoAdverso
    {
        public int IdEventoAdverso { get; set; }
        public int IdPaciente { get; set; }
        public DateTime? FechaNotificacion { get; set; }
        public string HoraNotificacion { get; set; }
        public int? ServicioNotifica { get; set; }
        public string LugarOcurrencia { get; set; }
        public string HoraEvento { get; set; }
        public DateTime? FechaIngreso { get; set; }
        public string HoraIngreso { get; set; }
        public bool MuerteMaterna { get; set; }
        public bool ObitoFetalIntrahospitalaria { get; set; }
        public bool MuerteNeonatal { get; set; }
        public bool EventoEquipoBiomedico { get; set; }
        public bool SepsisPostOperatoria { get; set; }
        public bool InfeccionHeridaOperatoria { get; set; }
        public bool Endometria { get; set; }
        public bool SepsisNeonatal { get; set; }
        public bool Flebitis { get; set; }
        public bool CefaloHematoma { get; set; }
        public bool LesionPlexoBraquial { get; set; }
        public bool FracturaClavicula { get; set; }
        public bool AsfixiaNeonatal { get; set; }
        public bool SindromeAspiracionLiquido { get; set; }
        public bool ComplicacionesAnestesicas { get; set; }
        public bool LesionIntraoperatoriaRecienNacido { get; set; }
        public bool PerforacionUterinaPostLegrado { get; set; }
        public bool CaidaPaciente { get; set; }
        public bool ErrorIdentificacionSexoRecienNacido { get; set; }
        public bool CuerpoExtranioPostCirugia { get; set; }
        public bool ComplicacionesIntraPostOperatorio { get; set; }
        public bool EventoAdversoRelacionadoIntubacion { get; set; }
        public bool RelacionTransfusional { get; set; }
        public bool ErrorMedicacion { get; set; }
        public bool ReaccionAdversa { get; set; }
        public bool DesgarroVaginal { get; set; }
        public bool Hematomas { get; set; }
        public bool RupturaUterina { get; set; }
        public bool DesgarroCervical { get; set; }
        public bool AnemiaAgudaPostProcedimiento { get; set; }
        public bool RetencionGasaVaginalPostParto { get; set; }
        public bool TraumaObstetricoMaternoOtros { get; set; }
        public string DescripcionTraumaObstetricoMaternoOtros { get; set; }
        public bool LaceracionEsparadrapo { get; set; }
        public bool QuemaduraTermicaElectrica { get; set; }
        public bool NeumoniaVentiladorMecanico { get; set; }
        public bool DehiscenciaEspisorrafia { get; set; }
        public bool ObitoFetalExtrahospitalario { get; set; }
        public bool InfeccionTractoUrinarioPostCateter { get; set; }
        public bool ConjuntivitisRecienNacido { get; set; }
        public bool Onfalitis { get; set; }
        public bool PiodermitisNeonatal { get; set; }
        public bool OtrasFracturasRecienNacido { get; set; }
        public bool OtrosEventosAdversos { get; set; }
        public string DescripcionOtrosEventosAdversos { get; set; }
        public string DescripcionEventoAdverso { get; set; }
        public int? EventoAdversoPrevenible { get; set; }
        public string ComoPrevenirEventoAdverso { get; set; }
    }
}
