namespace WebAppMaternidad.CapaEntidades
{
    public class ConsejeriaPsicoprofilaxis
    {
        public int IdConsejeriaPsicoprofilaxis {  get; set; }
        public int IdAtencion { get; set; }
        public int IdCitaTerapia { get; set; }
        public string Fur { get; set; }
        public string Fpp { get; set; }
        public int EdadGestSem { get; set; }
        public int EdadGestDias { get; set; }
        public string Paridad1 { get; set; }
        public string Paridad2 { get; set; }
        public string Paridad3 { get; set; }
        public string Paridad4 { get; set; }
        public int IdFactorRiesgo { get; set; }
        public string FactorRiesgo { get; set; }
        public int IdProductoDetalleAtencion { get; set; }
        public int NroSesionEducativa { get; set; }
        public string MotivoAtencion { get; set; }
        public int GestantePreparada { get; set; }
        public int IdTipoDocumentoAcompaniante { get; set; }
        public string NroDocumentoAcompaniante { get; set; }
        public string NombresAcompaniante { get; set; }
        public int IdParentescoAcompaniante { get; set; }
        public int NroSesionAcompaniante { get; set; }
        public int IdMedicoAtiende { get; set; }
        public string HoraInicioAtencion { get; set; }

    }
}
