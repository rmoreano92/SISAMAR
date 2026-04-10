namespace WebAppMaternidad.CapaEntidades
{
    public class CajaComprobantePago
    {
        public int IdComprobantePago { get; set; }
        public string NroSerie { get; set; }
        public string NroDocumento { get; set; }
        public string RazonSocial { get; set; }
        public string RUC { get; set; }
        public decimal? SubTotal { get; set; }
        public decimal? IGV { get; set; }
        public decimal Total { get; set; }
        public string FechaCobranza { get; set; }
        public decimal? TipoCambio { get; set; }
        public string Observaciones { get; set; }
        public int? IdTipoComprobante { get; set; }
        public int? IdCuentaAtencion { get; set; }
        public int? IdEstadoComprobante { get; set; }
        public int? IdGestionCaja { get; set; }
        public int? IdTipoPago { get; set; }
        public int? IdTipoOrden { get; set; }
        public decimal? Descuentos { get; set; }
        public int? IdPaciente { get; set; }
        public int? IdCajero { get; set; }
        public int? IdTurno { get; set; }
        public int? IdCaja { get; set; }
        public int? IdFormaPago { get; set; }
        public int? IdFarmacia { get; set; }
        public decimal? Exoneraciones { get; set; }
        public decimal? Adelantos { get; set; }
        public int? IdTipoFinanciamiento { get; set; }
        public int? FormaPago { get; set; }
        public string CorreoElectronico { get; set; }
        public string Direccion { get; set; }
        public string DniReceptor { get; set; }
        public int? AfectoIgv { get; set; }
        public int? EstadoEnvioSunat { get; set; }

        public int? IdTipoDocIdentidad { get; set; }
        public string NroDocumentoIdentidad { get; set; }

        public int? IdOrdenPagoServicio { get; set; }
        public int? IdOrdenPagoFarmacia { get; set; }
        public string IdOrdenPagoVenta { get; set; }
        public int? IdReceta { get; set; }

        public string IdTipoPagoCaja { get; set; }

    }
}
