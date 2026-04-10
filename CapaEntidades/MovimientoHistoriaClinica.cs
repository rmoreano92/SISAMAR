namespace WebAppMaternidad.CapaEntidades
{
    public class MovimientoHistoriaClinica
    {
        public int IdMovimiento { get; set; }
        public int IdPaciente { get; set; }
        public string FechaMovimiento { get; set; }
        public int IdMotivo { get; set; }
        public int IdServicioOrigen { get; set; }
        public int IdServicioDestino { get; set; }
        public string Observacion { get; set; }
        public int? NroFolios { get; set; }
        public int IdEmpleadoArchivo { get; set; }
        public int IdEmpleadoTransporte { get; set; }
        public int IdEmpleadoRecepcion { get; set; }
        public int IdGrupoMovimiento { get; set; }
        public int? IdAtencion { get; set; }
    }
}
