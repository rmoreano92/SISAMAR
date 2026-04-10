namespace WebAppMaternidad.CapaEntidades
{
    public class MedicamentosExamenFisicoUCI
    {
        public int idItem { get; set; }
        public string descripcion { get; set; }
        public int idMedida { get; set; }
        public string medida { get; set; }
        public string dosis { get; set; }
        public string velocidad { get; set; }
        public int idTipoAcceso { get; set; }
        public string tipoAcceso { get; set; }
        public int idUbicacion { get; set; }
        public string ubicacion { get; set; }
        public string cambios { get; set; }
    }
}
