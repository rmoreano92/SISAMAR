using System;

namespace WebAppMaternidad.CapaEntidades
{
    public class FarmMovimientoDetalle
    {
        public string MovNumero { get; set; }
        public string MovTipo { get; set; }
        public int? idProducto { get; set; }
        public string Lote { get; set; }
        public DateTime? FechaVencimiento { get; set; }
        public int? Item { get; set; }
        public int? Cantidad { get; set; }

        public string Precio { get; set; }
        public string Total { get; set; }
        public string RegistroSanitario { get; set; }
        public int? idTipoSalidaBienInsumo { get; set; }
        public string DocumentoNumero { get; set; }
        public int? IdUsuarioAuditoria { get; set; }

    }
}


