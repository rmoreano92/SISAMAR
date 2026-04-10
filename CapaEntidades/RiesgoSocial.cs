namespace WebAppMaternidad.CapaEntidades
{
    public class RiesgoSocial
    {
        public int invnum { get; set; }
        public string diacod { get; set; }
        public string evafec { get; set; }
        public int usecod { get; set; }
        public int evatot { get; set; }
        public string nriecod { get; set; }
        public int plnnum { get; set; }
        public string evacom { get; set; }
        public int? idTurnoLabora { get; set; }
        public int idCuentaAtencion { get; set; }
        public string telefono1 { get; set; }
        public string telefono2 { get; set; }
        public string telefono3 { get; set; }
        public string telefono4 { get; set; }
        public string familiar1 { get; set; }
        public string familiar2 { get; set; }
        public string familiar3 { get; set; }
        public string familiar4 { get; set; }
        public string evaPadre { get; set; }
        public string evaMadre { get; set; }
        public string evaTutor { get; set; }
        public string evaTratamiento { get; set; }


        public string direccionActual { get; set; }
        public string referenciaDireccion { get; set; }
        public string tipoPaciente { get; set; }
        public string especificarTipoPaciente { get; set; }
        public string diagnosticos { get; set; }
    }
}
