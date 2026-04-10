namespace WebAppMaternidad.CapaEntidades
{
    public class Turno
    {
        public int IdTurno { get; set; }
        public string Codigo { get; set; }
        public string Descripcion { get; set; }
        public string HoraInicio { get; set; }
        public string HoraFin { get; set; }
        public int IdTipoServicio { get; set; }
        public int? IdTipoTurno { get; set; }
    }
}
