using System;

namespace WebAppMaternidad.CapaEntidades
{
    public class CuentasAtencionesGeneral
    {
        public string TotalPorPagar { get; set; }
        public int IdCuentaAtencion { get; set; }
        public int IdEstado { get; set; }
        public string TotalPagado { get; set; }
        public string TotalAsegurado { get; set; }
        public string TotalExonerado { get; set; }
        public string HoraCierre { get; set; }
        public DateTime? FechaCierre { get; set; }
        public string HoraApertura { get; set; }
        public DateTime? FechaApertura { get; set; }
        public int IdPaciente { get; set; }
        public int? IdUsuarioCrea { get; set; }
        public DateTime? FechaCreacion { get; set; }

        public int idAtencion { get; set; }
        public int idPaciente { get; set; }
        public int edad { get; set; }
        public DateTime fechaIngreso { get; set; }
        public string horaIngreso { get; set; }
        public int? idDestinoAtencion { get; set; }
        public int? idTipoCondicionAlServicio { get; set; }
        public int? idTipoCondicionALEstab { get; set; }
        public int idServicioIngreso { get; set; }
        public int idMedicoIngreso { get; set; }
        public int idEspecialidadMedico { get; set; }
        public int? idMedicoEgreso { get; set; }
        public DateTime? fechaEgreso { get; set; }
        public string horaEgreso { get; set; }
        public int idOrigenAtencion { get; set; }
        public DateTime? FechaEgresoAdministrativo { get; set; }
        public string horaEgresoAdministrativo { get; set; }
        public int? idCondicionAlta { get; set; }
        public int? idTipoAlta { get; set; }
        public int idServicioEgreso { get; set; }
        public int? idCamaIngreso { get; set; }
        public int? idCamaEgreso { get; set; }
        public int? idTipoGravedad { get; set; }
        public int idTipoEdad { get; set; }
        public int idCuentaAtencion { get; set; }
        public int idTipoServicio { get; set; }
        public int? idFormaPago { get; set; }
        public int? idFuenteFinanciamiento { get; set; }
        public int idEstadoAtencion { get; set; }
        public int? esPacienteExterno { get; set; }
        public int? idSunasaPacienteHistorico { get; set; }
        public int decretoUrgencia { get; set; }
        public int estadoLlamada { get; set; }
        public string horaInicioAtencion { get; set; }
        public int? esDecretoUrgencia { get; set; }


        public int idUsuario { get; set; }
        public int idTipoServicioAtencion { get; set; }
        public int condicionEstablecimiento { get; set; }
        public int condicionservicio { get; set; }


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

    }
}
