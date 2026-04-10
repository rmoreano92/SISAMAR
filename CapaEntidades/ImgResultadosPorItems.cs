namespace WebAppMaternidad.CapaEntidades
{
    public class ImgResultadosPorItems
    {
        public int IdOrden { get; set; }
        public int IdProducto { get; set; }
        public int OrdenResultado { get; set; }
        public double? ValorNumero { get; set; }
        public string ValorTexto { get; set; }
        public string ValorCombo { get; set; }
        public string ValorCheck { get; set; }
        //public string CodigoIngreso { get; set; }
        public string FechaResultado { get; set; }
        public int IdRealizaAnalisis { get; set; }
        //public int? IdValidaAnalisis { get; set; }
    }
}
