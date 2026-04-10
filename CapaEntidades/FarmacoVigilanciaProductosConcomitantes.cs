namespace WebAppMaternidad.CapaEntidades
{
    public class FarmacoVigilanciaProductosConcomitantes
    {
        public int IdProductoConcomitante { get; set; }
        public int IdAtencion { get; set; }
        public int NroNotificacion { get; set; }
        public string NombreComercial { get; set; }        
        public string DosisFrecuencia { get; set; }
        public string ViaAdministracion { get; set; }
        public string FechaInicio { get; set; }
        public string FechaFinal { get; set; }
        public string MotivoPrescripcion { get; set; }
       
    }
}
