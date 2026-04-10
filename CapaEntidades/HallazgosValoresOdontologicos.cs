namespace WebAppMaternidad.CapaEntidades
{
    public class HallazgosValoresOdontologicos
    {
        public int IdHallazgoValorDental { get; set; }
        public int idAtencion { get; set; }

        public int IdDiente { get; set; }
        public int Orden { get; set; }
        public string Valor { get; set; }
    }
}
