using System;

namespace WebAppMaternidad.CapaEntidades
{
    public class MonitoreoSoporteVentilatorioUCI
    {
        public DateTime? Fecha { get; set; }
        public string Hora { get; set; }
        public string VentiladorMecanicoMarca { get; set; }
        public DateTime? FechaInicioVM { get; set; }
        public DateTime? FechaTerminaVM { get; set; }
        public int ModoVentilatorioConvencional { get; set; }
        public string ModoVentilatorioNoConvencional { get; set; }
        //public string FraccionInspiratoriaO2 { get; set; }
        //public string VolumenTidal { get; set; }
        //public string PresionInspiratoria { get; set; }
        //public string PresionInspiratoriaPico { get; set; }
        //public string PresionFinalEspiracion { get; set; }
        //public string FrecuenciaRespiratoriaProgramada { get; set; }
        //public string Flujo { get; set; }
        //public string PresionMediaViaAerea { get; set; }
        //public string VolumenMinuto { get; set; }
        //public string PresionSoporte { get; set; }
        //public string ComplianceEstatica { get; set; }
        //public string ComplianceDinamica { get; set; }
        //public string ResistenciaViaAerea { get; set; }
        //public string DiferenciaPresiones { get; set; }
        //public string PresionParcialOxigeno { get; set; }
        //public string IndiceOxigenatorio { get; set; }
        //public string MurrayScore { get; set; }
        //public string CantidadCO2EnAireExhalado { get; set; }
        public string PeepMaxSinReclutamiento { get; set; }
        public int Pronacion { get; set; }
        public string HorasPrePronacion { get; set; }
        public string NroCicloProno { get; set; }
        public int Reclutamiento { get; set; }
        public string PeepMaxConReclutamiento { get; set; }
        public int TitulacionPeep { get; set; }
    }
}
