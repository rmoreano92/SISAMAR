namespace WebAppMaternidad.CapaEntidades
{
    public class FacturacionCatalogoPaquetes
    {
        public int? idFactPaquete { get; set; }
        public int? idPuntoCarga { get; set; }
        public int? idEspecialidadServicio { get; set; }
        public int? idProducto { get; set; }
        public int? cantidad { get; set; }
        public float? precio { get; set; }
        public float? importe { get; set; }
    }
}
