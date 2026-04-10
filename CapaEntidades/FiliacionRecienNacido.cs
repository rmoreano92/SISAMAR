namespace WebAppMaternidad.CapaEntidades
{
    public class FiliacionRecienNacido
    {
        public int IdCuentaAtencionMadre { get; set; }
        public string FechaNacimiento { get; set; }
        public string HoraNacimiento { get; set; }
        public int IdTipoSexo { get; set; }
        public int NroGemelar { get; set; }
        public int IdServicioIngreso { get; set; }
        public int IdDiagnosticoIngreso { get; set; }
        public int IdMedicoIngreso { get; set; }
        public int Procedencia { get; set; }

    }
}
