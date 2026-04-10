namespace WebAppMaternidad.CapaEntidades
{
    public class RiesgosPerinatales
    {
        public int IdAtencion { get; set; }
        public int Peso4000Gramos { get; set; }
        public int Peso2500Gramos { get; set; }
        public int PreTerminos { get; set; }
        public int PostTerminos { get; set; }
        public int Natimuerto { get; set; }
        public int MuerteNeonatal { get; set; }
        public int Distocidos { get; set; }
        public int Otros { get; set; }
        public string Peso4000GramosDescripcion { get; set; }
        public string Peso2500GramosDescripcion { get; set; }
        public string PreTerminosDescripcion { get; set; }
        public string PostTerminosDescripcion { get; set; }
        public string NatimuertoDescripcion { get; set; }
        public string MuerteNeonatalDescripcion { get; set; }
        public string DistocidosDescripcion { get; set; }
        public string OtrosDescripcion { get; set; }
        public int IdUsuario { get; set; }
    }
}
