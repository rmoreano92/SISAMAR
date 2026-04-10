using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    // JDELGADO001.2 CREACION
    public class Atenciones
    {
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

        public int? esPacienteCronico { get; set; }
    }
}
