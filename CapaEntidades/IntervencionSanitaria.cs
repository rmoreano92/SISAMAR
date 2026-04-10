namespace WebAppMaternidad.CapaEntidades
{
    public class IntervencionSanitaria
    {
        public int idReceta { get; set; }
        public int? idCoordinadorIS { get; set; }
        public int? idComponenteIS { get; set; }
        public int? idSubComponenteIS { get; set; }
        public int? idDiagnosticoIS { get; set; }
        public string ObservacionesIS { get; set; }
    }
}
