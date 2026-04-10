namespace WebAppMaternidad.CapaEntidades
{
    public class Brazalete
    {
        int idBrazalete { get; set;  }
        public int idPaciente { get; set; }
        public int nroHistoria { get; set; }
        public string apellidos { get; set; }
        public string nombres { get; set; }
        public string tipoDocumento { get; set; }
        public string nroDocumento { get; set; }
        public string fechaNacimiento { get; set; }
        public string horaNacimiento { get; set; }
        public string tipoSexo { get; set; }
        public string gemelar { get; set; }


    }
}
