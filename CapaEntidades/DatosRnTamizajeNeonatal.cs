using System;

namespace WebAppSaludOcupacional.CapaEntidades
{
    public class DatosRnTamizajeNeonatal
    {
        public int? IdRnTamizaje { get; set; }
        public int? IdDocIdentidad { get; set; }
        public string NroDocumento { get; set; }
        public string ApellidoPaterno { get; set; }
        public string ApellidoMaterno { get; set; }
        public string PrimerNombre { get; set; }
        public string SegundoNombre { get; set; }
        public DateTime? FechaNacimiento { get; set; }
        public string HoraNacimiento { get; set; }
        public int? IdTipoSexo { get; set; }
        public string HoraUltimaLactancia { get; set; }
        public string Peso { get; set; }
        public string Talla { get; set; }
        public int? Prematuro { get; set; }
        public int? Transfundido { get; set; }
        public int? IdEstablecimientoOrigen { get; set; }
        public string NroDisaAfiliacion { get; set; }
        public string TipoAfiliacion { get; set; }
        public string NroAfiliacion { get; set; }
        public int? IdTipoAfiliacion { get; set; }
    }
}
