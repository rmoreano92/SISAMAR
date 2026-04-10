namespace WebAppMaternidad.CapaEntidades
{
    public class ServiciosEstadoCuenta
    {
        public string FechaCreacion { get; set; }
        public string HoraCreacion { get; set; }
        public string DesPuntoCarga { get; set; }
        public string NroDocumento { get; set; }
        public int? IdProducto { get; set; }
        public string Codigo { get; set; }
        public string Nombre { get; set; }
        public decimal? Cantidad { get; set; }
        public decimal? PrecioUnitario { get; set; }
        public decimal? SubTotal { get; set; }
        public decimal? CantidadFinanciadaSis { get; set; }
        public decimal? PrecioFinanciadoSis { get; set; }
        public decimal? TotalFinanciadoSis { get; set; }
        public decimal? TotalFinanciadoSoat { get; set; }
        public decimal? ImporteExonera { get; set; }
        public string UsuarioExonera { get; set; }
        public decimal? CantidadPagar { get; set; }
        public decimal? TotalPagar { get; set; }
        public decimal? CantidadDevuelta { get; set; }
        public int? IdEstadoFacturacion { get; set; }
        public string EstadosFacturacion { get; set; }
        public string DocReembolso { get; set; }
        public string ServInternamiento { get; set; }
        public int? IdOrden { get; set; }
        public string NroComprobante { get; set; }
        public string Dfinanciamiento { get; set; }
        public string DescripcionPorItem { get; set; }
        public string MovNumero { get; set; }
        public string Movtipo { get; set; }
        public string ServicioEstancia { get; set; }
        public int? IdOrdenPago { get; set; }
        public string FechaDespacho { get; set; }
        public string HoraDespacho { get; set; }
    }
}
