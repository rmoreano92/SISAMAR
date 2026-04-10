namespace WebAppMaternidad.CapaEntidades
{
    public class FarmMovimientoVentas
    {
        public string movNumero { get; set; }
        public string movTipo { get; set; }
        public string tipoVenta { get; set; }
        public string idPreVenta { get; set; }
        public int? idTipoFinanciamiento { get; set; }
        public string idPrescriptor { get; set; }
        public int? idTipoReceta { get; set; }
        public int? idDiagnostico { get; set; }
        public int? idCuentaAtencion { get; set; }
        public int? IdServicioPaciente { get; set; }
        public int? idFuenteFinanciamiento { get; set; }
        public int? idPaciente { get; set; }
        public string FechaHoraPrescribe { get; set; }
        public string IdPaquete { get; set; }

        public string PresExternoCmp { get; set; }
        public string PresExternoMedico { get; set; }
        public string PresExternoFecha { get; set; }
        public string NroFormato { get; set; }
    }
}
