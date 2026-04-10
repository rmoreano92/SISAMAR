namespace WebAppMaternidad.CapaEntidades
{
    public class FarmacoVigilanciaProductosSospechosos
    {
        public int IdProductoSospechoso { get; set; }
        public int IdAtencion { get; set; }
        public int NroNotificacion { get; set; }
        public string NombreComercial { get; set; }
        public string Laboratorio { get; set; }
        public string Lote { get; set; }
        public string DosisFrecuencia { get; set; }
        public string ViaAdministracion { get; set; }
        public string FechaInicio { get; set; }
        public string FechaFinal { get; set; }
        public string MotivoPrescripcion { get; set; }
        public string CodigoCie10 { get; set; }
        public int IdDiagnostico { get; set; }

    }
}
