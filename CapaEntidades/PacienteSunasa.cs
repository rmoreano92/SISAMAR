using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    // JDELGADO001.2 CREACION
    public class PacienteSunasa
    {
        public int? idSunasaPacienteHistorico { get; set; }
        public int idPaciente { get; set; }
        public string CodigoIAFA { get; set; }
        public int? idPaisTitular { get; set; }
        public int? idTipoDocumentoTitular { get; set; }
        public string NroDocumentoTitular { get; set; }
        public string ApellidoCasada { get; set; }
        public int? ValidacionRegIdentidad { get; set; }
        public string NroCarnetIdentidad { get; set; }
        public int? EstadoDelSeguro { get; set; }
        public int? IdAfiliacion { get; set; }
        public string ProductoYplan { get; set; }
        public DateTime? FechaInicioAfiliacion { get; set; }
        public DateTime? FechaFinalAfiliacion { get; set; }
        public int? idRegimen { get; set; }
        public string CodigoEstablecimientoIAFA { get; set; }
        public string CodigoEstablecimientoRENAES { get; set; }
        public int? idParentesco { get; set; }
        public string RUCempleador { get; set; }
        public int? AnteriorIdTipoDocumentoAsegurado { get; set; }
        public string AnteriorNroDocumentoAsegurado { get; set; }
        public string DNIusarioOperacion { get; set; }
        public int? idOperacion { get; set; }
        public DateTime? FechaEnvio { get; set; }
        public string SisSepelioParienteEncargado { get; set; }
        public string SisSepelioDni { get; set; }
        public DateTime? SisSepelioFnacimiento { get; set; }
        public int? SisSepelioSexo { get; set; }
        public string SisNroAfiliacion { get; set; }
        public int? YaNoTieneSeguro { get; set; }
    }
}
