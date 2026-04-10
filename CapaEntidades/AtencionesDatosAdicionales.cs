using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
   public class AtencionesDatosAdicionales
    {
        public int? idAtencion { get; set; } // JDELGADO003-M

        public string DireccionDomicilio { get; set; }

        public string NombreAcompaniante { get; set; }
        public string TelefonoAcompaniante { get; set; }

        public string Observacion { get; set; }

        public DateTime? ProximaCita { get; set; }

        public int? NumeroDeHijos { get; set; }

        public int? IdSiaSis { get; set; }

        public string FuaCodigoPrestacion { get; set; }

        public string SisCodigo { get; set; }

        public int? IdTipoReferenciaOrigen { get; set; }

        public int? IdTipoReferenciaDestino { get; set; }

        public int? IdEstablecimientoOrigen { get; set; }

        public int? IdEstablecimientoDestino { get; set; }

        public int? IdEstablecimientoNoMinsaOrigen { get; set; }

        public int? IdEstablecimientoNoMinsaDestino { get; set; }

        public int? HuboInfeccionIntraHospitalaria { get; set; }

        public bool? TieneNecropsia { get; set; }

        public int? IdMedicoRespNacimiento { get; set; }

        public bool? RecienNacido { get; set; }

        public string NroReferenciaOrigen { get; set; }

        public string NroReferenciaDestino { get; set; }

        public bool? SeImprimioFicha { get; set; }

        public int? idAtencionEmeg_CE { get; set; }

        public int? idTipoConsultaProxCita { get; set; }

        public string PlanTrabajo { get; set; }
        public string Tratamiento { get; set; }

        public string Sed { get; set; }
        public string Suenio { get; set; }
        public string Orina { get; set; }
        public string Deposiciones { get; set; }
        public string Apetito { get; set; }
        public string enfermedadActual { get; set; }
        public string tiempoEnfermedad { get; set; }
        public string apetito { get; set; }
        public string orina { get; set; }
        public string sed { get; set; }
        public string suenio { get; set; }
        public string deposiciones { get; set; }
        public string NroEnvioSis { get; set; }
        public int? TipoTeleconsulta { get; set; }
        public int? ClasificacionTipoAtencion { get; set; }
        public string Recomendaciones { get; set; }
        public string ObservacionLaboratorio { get; set; }
        public DateTime? FechaRecepcion { get; set; }
        public string HoraRecepcion { get; set; }
        public int? IdPersonaAcreditaMuestra { get; set; }

        public int? ObservacionSegundaMuestraTamizaje { get; set; }

        public string ObservacionSis { get; set; }

        public int OpcionIntervenciónQuirurgica { get; set; }
        public string IntervencionQuirurgica { get; set; }
        public DateTime? FechaIntervencionQuirurgica { get; set; }
        public string HoraIntervencionQuirurgica { get; set; }
        public int? IdMedicoIntervencionQuirurgica { get; set; }
        public int? IdGrupoGo { get; set; }
        public string ObservacionAltaMedica { get; set; }

    }
}
