namespace WebAppMaternidad.CapaEntidades
{
    public class ImgResultadosCabecera
    {
        public int IdCuentaAtencion { get; set; }
        public int IdOrden { get; set; }
        public int IdMovimiento { get; set; }
        public int IdProducto { get; set; }
        //public string CodigoIngreso { get; set; }
        public string FechaResultado { get; set; }
        public int IdRealizaAnalisis { get; set; }
        public int IdServicioRealiza { get; set; }
        //public int? IdValidaAnalisis { get; set; }
        public string Informe { get; set; }
        public string Observaciones { get; set; }
        public string Conclusiones { get; set; }
    }
}
