namespace WebAppMaternidad.CapaEntidades
{
    public class LabResultadosCabecera
    {
        public int IdCuentaAtencion { get; set; }
        public int IdOrden { get; set; }
        public int IdMovimiento { get; set; }
        public int IdProducto { get; set; }                       
        public string CodigoIngreso { get; set; }
        public string FechaResultado { get; set; }
        public int IdRealizaAnalisis { get; set; }
        public int IdValidaAnalisis { get; set; }
        public string Observaciones { get; set; }
        public int TipoMuestra { get; set; }
        public int EstadoEstudio { get; set; }
        public string diagnosticos { get; set; }
        public string diagnosticosCIE0 { get; set; }
        public string diagnosticoCIE0Morfologica { get; set; }
        public int gradoDiferenciacion { get; set; }
        public int lateralidad { get; set; }
        public int metodoDiagnostico { get; set; }
        public string code { get; set; }
        public string resultado { get; set; }
    }
}
