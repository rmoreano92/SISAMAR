using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
   public class PlanificacionFamiliar
    {
        public int IdAtencion { get; set; }
        public int IdPaciente { get; set; }
        public int Edad { get; set; }
        public DateTime FechaIngreso { get; set; }
        public string HoraIngreso { get; set; }
        public int? IdDestinoAtencion { get; set; }
        public int? IdTipoCondicionAlServicio { get; set; }
        public int? IdTipoCondicionALEstab { get; set; }
        public int IdServicioIngreso { get; set;}
        public int IdMedicoIngreso { get; set; }
        public int? IdEspecialidadMedico { get; set; }
        public int? IdMedicoEgreso { get; set; }
        public DateTime? FechaEgreso { get; set; }
        public string HoraEgreso { get; set; }
        public int? IdOrigenAtencion { get; set; }
        public DateTime? FechaEgresoAdministrativo { get; set; }
        public string HoraEgresoAdministrativo { get; set; }
        public int? IdCondicionAlta { get; set; }
        public int? IdTipoAlta { get; set; }
        public int? IdServicioEgreso { get; set; }
        public int? IdCamaIngreso { get; set; }
        public int? IdCamaEgreso { get; set; }
        public int? IdTipoGravedad { get; set; }
        public int? IdTipoEdad { get; set; }
        public int IdCuentaAtencion { get; set; }
        public int? IdTipoServicio { get; set; }
        public int? IdFormaPago { get; set; }
        public int? idFuenteFinanciamiento { get; set; }
        public int? idEstadoAtencion { get; set; }
        public bool? EsPacienteExterno { get; set; }
        public int? idSunasaPacienteHistorico { get; set; }
        public bool? DecretoUrgencia { get; set; }
        public int? EstadoLlamada { get; set; }
        public int? idTipoAtencion { get; set; }
        public int? idTipoConsejeria { get; set; }
        public int? NroConsejeria { get; set; }
        public int? idProfesionalConsejeria { get; set; }
        public int? idEstadoUsuaria { get; set; }
        public int? idMetodoAdmin { get; set; }
        public String idTipoMetodoAdmin { get; set; }
        public int? NroInsumosAdm { get; set; }
        public int? idProfesionalAdm { get; set; }
        public int? idMetodoRetirado { get; set; }
        public int? idProfesionalRetiro { get; set; }
        public int? idMetodoEfect { get; set; }
        public String idTipoEfectSec { get; set; }
        public int? idEfecto { get; set; }
        public String idTipoEfecto { get; set; }
        public int? idFalla { get; set; }
        public int? idUsuario { get; set; }

        public bool? EsCaptada { get; set; }
        public bool? EsControl { get; set; }
        public int? NroControl { get; set; }
        public int? ConDiscapacidad { get; set; }
        public int? idRiesgoReproductivo { get; set; }

        public int? noAceptaMetodo { get; set; }
        public int? esControlDiu { get; set; }
        public int? esControlImplante { get; set; }
        public int? esPacienteProtegida { get; set; }
        public int? esGestante { get; set; }
    }
}
