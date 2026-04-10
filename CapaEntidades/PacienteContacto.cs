namespace WebAppMaternidad.CapaEntidades
{
    public class PacienteContacto
    {
        public int IdContacto { get; set; }
        public int IdPaciente { get; set; }
        public string ApellidoPaterno { get; set; }
        public string ApellidoMaterno { get; set; }
        public string Nombres { get; set; }
        public string Telefono { get; set; }
        public bool EsParentesco { get; set; }
    }
}
