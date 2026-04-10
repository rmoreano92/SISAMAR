using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class Citas
    {
        public int? IdCita { get; set; } // JDELGADO001.2 ALLOW NULL

        public DateTime Fecha { get; set; }

        public string HoraInicio { get; set; }

        public string HoraFin { get; set; }

        public Paciente paciente { get; set; }

        public int IdEstadoCita { get; set; }

        public int IdAtencion { get; set; }

        public int IdMedico { get; set; }

        public int IdEspecialidad { get; set; }

        public int IdServicio { get; set; }

        public int IdProgramacion { get; set; }

        public int? IdProducto { get; set; }

        public DateTime FechaSolicitud { get; set; }

        public string HoraSolicitud { get; set; }

        public int? EsCitaAdicional { get; set; }

        public string TipoConsulta { get; set; }
        public string TipoCita { get; set; }

    }

    public class SistemaCitasWebDetalleGuardarRequest
    {
        public string Fecha { get; set; }
        public int IdServicio { get; set; }
        public int IdProgramacion { get; set; }
        public int IdWeb { get; set; }
        public int IdCitaBloqueada { get; set; }
        public int IdMedico { get; set; }
        public string HoraInicio { get; set; }
        public string HoraFinal { get; set; }
        public int IdEstadoCitaWeb { get; set; }
        public int EsFueraProgramacion { get; set; }
        public int IdUsuario { get; set; }
    }


}
