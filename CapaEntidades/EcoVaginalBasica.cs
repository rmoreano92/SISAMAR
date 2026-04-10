namespace WebAppMaternidad.CapaEntidades
{
    public class EcoVaginalBasica
    {
        public int NumeroFeto { get; set; }
        public int IdProducto { get; set; }
        public int IdOrden { get; set; }
        public int IdMedico { get; set; }
        public int IdMovimiento { get; set; }
        public int Accion { get; set; }
        public string FUR { get; set; } = string.Empty;
        public string FPP { get; set; } = string.Empty;
        public string EdadGestacional { get; set; } = string.Empty;
        public string Observaciones { get; set; } = string.Empty;
        public string Conclusion { get; set; } = string.Empty;
        public string Sugerencia { get; set; } = string.Empty;
        public int Usuario { get; set; }
        public int Anatomia { get; set; }
        public string AnatomiaTexto { get; set; } = string.Empty;
        public string Lcn { get; set; } = string.Empty;
        public string SacoG { get; set; } = string.Empty;
        public string Svitelino { get; set; } = string.Empty;
        public string Fcf { get; set; } = string.Empty;
        public string CuerpoLuteo { get; set; } = string.Empty;
        public string Hematomas { get; set; } = string.Empty;
        public string Fsd { get; set; } = string.Empty;
        public string Utero { get; set; } = string.Empty;
    }
}
