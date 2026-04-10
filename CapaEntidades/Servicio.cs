namespace WebAppMaternidad.CapaEntidades
{
    public class Servicio
    {
        public int IdServicio { get; set; }
        public string Nombre { get; set; }
        public int IdEspecialidad { get; set; }
        public int IdTipoServicio { get; set; }
        public string Codigo { get; set; }
        public string SVG { get; set; }
        public int? IdProducto { get; set; }
        public int? SoloTipoSexo { get; set; }
        public int? MaximaEdad { get; set; }
        public string CodigoServicioSEM { get; set; }
        public string UbicacionSEM { get; set; }
        public string CodigoServicioHIS { get; set; }
        public string CostoCeroCE { get; set; }
        public int? MinimaEdad { get; set; }
        public int? IdEstado { get; set; }
        public bool? Triaje { get; set; }
        public bool? EsObservacionEmergencia { get; set; }
        public bool? UsaModuloNinoSano { get; set; }
        public bool? UsaModuloMaterno { get; set; }
        public bool? UsaGalenHos { get; set; }
        public int? TipoEdad { get; set; }
        public bool? UsaFUA { get; set; }
        public string CodigoServicioSuSalud { get; set; }
        public string CodigoServicioFUA { get; set; }
        public int? FuaTipoAnexo2015 { get; set; }
        public string CodigoServicioRenaes { get; set; }
        public int? ActivaProcedimiento { get; set; }
        public int? TipoArchivo { get; set; }
        public bool? UsaModuloAnestesio { get; set; }
        public string TipoModuloEmergencia { get; set; }
        public int? IdEspecialidadMinsa { get; set; }
        public bool? EsTeleconsulta { get; set; }
        public bool? EsConsejeriaObstetrica { get; set; }
        public bool? UsaModuloOdontologico { get; set; }
        public int? Tv { get; set; }
        public bool? UsaModuloConsejeriaOncologica { get; set; }
        public bool? UsaModuloConsejeriaEstrategiasSanitaria { get; set; }
        public bool? EsPuntoCarga { get; set; }
        public string TipoModulo { get; set; }
    }
}
