namespace WebAppMaternidad.CapaEntidades
{
    public class NotaCredito
    {
        public int IdNota { get; set; }
        public int? IdComprobantePago { get; set; }
        public int? IdTipoNota { get; set; }
        public string NroSerie { get; set; }
        public string NroDocumento { get; set; }
        public string RazonSocial { get; set; }
        public string RUC { get; set; }
        public decimal? SubTotal { get; set; }
        public decimal? IGV { get; set; }
        public decimal Total { get; set; }
        public int? IdUsuarioAutoriza { get; set; }
        public string FechaAprueba { get; set; }
        public decimal? TipoCambio { get; set; }
        public string Observaciones { get; set; }
        public int? IdEstadoNota { get; set; }
        public string FechaPagado { get; set; }
        public int? IdUsuarioModifica { get; set; }
        public string FechaModificacion { get; set; }
        public int? IdUsuarioElimina { get; set; }
        public string FechamEliminacion { get; set; }
        public int? IdGestionCaja { get; set; }
        public int? IdPaciente { get; set; }
        public int? IdCajero { get; set; }
        public int? IdTurno { get; set; }
        public int? IdCaja { get; set; }
        public int? IdFarmacia { get; set; }
        public int? IdMotivo { get; set; }
        public string Direccion { get; set; }
        public bool? TipoAnulacion { get; set; }
        public string FechaCreacion { get; set; }
        public int? IdTipoComprobantePagoAfecto { get; set; }
        public int? IdTipoDocIdentidadAfecto { get; set; }
        public string SerieComprobanteAfecto { get; set; }
        public string NumeroComprobanteAfecto { get; set; }
        public string FechaComprobanteAfecto { get; set; }
        public decimal? Gravadas { get; set; }
        public decimal? Exoneradas { get; set; }
        public decimal? Inafecta { get; set; }
        public int? EstadoEnvioSunat { get; set; }

    }
}
