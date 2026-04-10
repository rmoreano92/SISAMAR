using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
   public class Atencion
    {
        public int idAtencion { get; set; }
        public int idCuentaAtencion { get; set; }
        public int idPaciente { get; set; }
        public int idEstadoAtencion { get; set; }
        public int idUsuario { get; set; }
        public int idServicioEgreso { get; set; }
        public int idServicioIngreso { get; set; }
        public int idFuenteFinanciamiento { get; set; }
        public int idTipoServicioAtencion { get; set; }
        public int idTipoAlta { get; set; }
        public int idCondicionAlta { get; set; }
        public int idOrigenAtencion { get; set; }
        public int idDestinoAtencion { get; set; }
        public string fechaEgreso { get; set; }
        public string fechaIngreso { get; set; }
        public string horaIngreso { get; set; }
        public int condicionEstablecimiento { get; set; }
        public int condicionservicio { get; set; }

        public string HoraInicioAtencion { get; set; }
        public int? idTipoAtencionAdolescencia { get; set; }
        public int? idTipoAtencionAnestesio { get; set; }
        public int? idMedicoIngreso { get; set; }
        public int? idEspecialidadIngreso { get; set; }
        public int? esPacienteCronico { get; set; }
    }
}
