namespace WebAppMaternidad.CapaEntidades
{
    public class LabItemsCpt
    {
        public int IdProductoCpt { get; set; }
        public int OrdenXresultado { get; set; }
        public int IdGrupo { get; set; }
        public int? IdItemGrupo { get; set; }
        public int IdItem { get; set; }
        public string ValorSiEsCombo { get; set; }
        public string ValorReferencial { get; set; }
        public string Metodo { get; set; }
        public bool? SoloNumero { get; set; }
        public bool? SoloTexto { get; set; }
        public bool? SoloCombo { get; set; }
        public bool? SoloCheck { get; set; }
        public string CodigoIntegracion { get; set; }
    }
}
