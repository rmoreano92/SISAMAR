namespace WebAppMaternidad.CapaEntidades
{
    public class CatalogoBienesInsumos
    {
        public int IdProducto { get; set; }
        public string Codigo { get; set; }
        public string Nombre { get; set; } 
        public string NombreComercial { get; set; }
        public int? IdGrupoFarmacologico { get; set; }
        public int? IdSubGrupoFarmacologico { get; set; }
        public int? IdPartida { get; set; }
        public int? IdCentroCosto { get; set; }
        public decimal? PrecioCompra { get; set; }
        public decimal? PrecioDistribucion { get; set; }
        public decimal? PrecioDonacion { get; set; }
        public decimal? PrecioUltCompra { get; set; }
        public int IdTipoSalidaBienInsumo { get; set; }
        public int? StockMinimo { get; set; }
        public int? TipoProducto { get; set; }
        public string Denominacion { get; set; }
        public string Concentracion { get; set; }
        public string Presentacion { get; set; }
        public string FormaFarmaceutica { get; set; }
        public string MaterialEnvase { get; set; }
        public string PresentacionEnvase { get; set; }
        public string Fabricante { get; set; }
        public int? IdPaisOrigen { get; set; }
        public bool? Petitorio { get; set; }
        public string TipoProductoSismed { get; set; }

        public int EsUnidosis { get; set; }
        public int IdProductoUnidosis { get; set; }
        public string CodigoUnidosis { get; set; }
        public string PresentacionUnidosis { get; set; }
        public string EquivalenciaUnidosis { get; set; }
        public string UnidadMedidaUnidosis { get; set; }

    }
}
