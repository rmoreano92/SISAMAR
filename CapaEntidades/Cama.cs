namespace WebAppMaternidad.CapaEntidades
{
    public class Cama
    {
        public int idCama { get; set; }
        public int x { get; set;}
        public int y { get; set; }
        public int idPaciente { get; set; }
        public int idTipoServicio { get; set; }
        public string codigo {  get; set; }
        public int idTipoCama { get; set; }
        public int idEstadoCama { get; set; }
        public int idCondicionOcupacion { get; set; }
        public int idServicioPropietario { get; set; }
        public int idServicioUbicacionActual { get; set; }

    }
}
