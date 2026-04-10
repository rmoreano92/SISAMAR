namespace WebAppMaternidad.CapaEntidades
{
    public class HallazgosOdontologicos
    {
        public int IdHallazgoDental { get; set; }
        public int idAtencion { get; set; }

        public int hallazgo { get; set; }
        public int zona { get; set; }
        public int dienteInicial { get; set; }

        public int dienteFinal { get; set; }
        public string ubicacion { get; set; }
    }
}
