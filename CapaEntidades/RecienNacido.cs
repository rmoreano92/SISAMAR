using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class RecienNacido
    {
        public int idRegistroRN { get; set; }
        public int? idCuentaAtencion { get; set; }
        public int? idPaciente { get; set; }
        public int? idTriajeRn { get; set; }
        public int? idCuentaAtencionMadre { get; set; }
        
        /////////////////////////MADRE///////////////////////////////
        public string Embarazo { get; set; }
        public string PatologiaGestacion { get; set; }
        public int NroEmbarazo { get; set; }
        public bool? AtencionPrenatal { get; set; }
        public int NroApn { get; set; }
        public string LugarApn { get; set; }
        public string Gesta { get; set; }
        public string Paridad { get; set; }
        public string Paridad1 { get; set; }
        public string Paridad2 { get; set; }
        public string Paridad3 { get; set; }
        public string Paridad4 { get; set; }
        public string AtendidoPor { get; set; }
        public int? idMedico { get; set; }
        public string medicoResponsable { get; set; }
        public bool? Parto { get; set; }
        public string ComplicacionParto { get; set; }
        public string Observaciones { get; set; }
        public string PosicionParto { get; set; }
        public bool? ConAcompaniante { get; set; }
        public bool? ConAnaglgesia { get; set; }
        public bool? TrasladoConjunto { get; set; }


        public int? idTipoParto { get; set; }
        public int? EdadMadre { get; set; }
        //////////////////////////////////////////////////////////////////

        /////////////////////////NEONATO///////////////////////////////
        public int IdTipoDocumentoRn { get; set; }
        public string NroDocumentoRn { get; set; }
        public string FechaNacimiento { get; set; }
        public string HoraNacimiento { get; set; }
        public int NroHijo { get; set; }
        public string FechaClamp { get; set; }
        public string HoraClamp { get; set; }
        public int IdTipoSexo { get; set; }
        public int IdTipoGestacion { get; set; }
        public int Fetos { get; set; }
        public int? NroGemelar { get; set; }
        public int? idCondicion { get; set; }
        public string Obito { get; set; }
        public decimal Peso { get; set; }
        public decimal? Talla { get; set; }
        public decimal? PerimetroCefalico { get; set; }
        public decimal? PerimetroToracico { get; set; }
        public int? EdadGes { get; set; }
        public int IdTiempoClampaje { get; set; }
        public bool? ClampadoTardio { get; set; }
        public int? PielaPiel { get; set; }
        public bool? Lactancia1raHora { get; set; }
        public int IdServicioNacimiento { get; set; }
        public int IdOtraProcedencia { get; set; }
        public int TiempoHospitalizacion { get; set; }
        public bool? Inmediato { get; set; }
        public bool? Reanimacion { get; set; }
        public int IdTipoReanimacion { get; set; }
        public string AlMinuto { get; set; }
        public string Alos5Minutos { get; set; }
        public string Alos10Minutos { get; set; }
        public string Alos15Minutos { get; set; }
        public string Alos20Minutos { get; set; }
        public bool? PatologiaNeonatal { get; set; }
        public string Especificar { get; set; }
        public bool? Transporte { get; set; }
        public int IdTipoTransporte { get; set; }

        public int? idRiesgo { get; set; }

        public int? ContactoPielaPiel { get; set; }
        public int? IdTiempoContactoPielaPiel { get; set; }
        public int? EfectividadContactoPielaPiel { get; set; }
        public string TiempoLactancia { get; set; }
        public string Fur { get; set; }
        /////////////////////////////////////////////////////////////////////

        public int? IdServicioIngreso { get; set; }
        public int? IdDiagnosticoIngreso { get; set; }
        public int? IdMedicoIngreso { get; set; }


        public bool? bActivo { get; set; }
        public int? idUsuario { get; set; }


    }
}
