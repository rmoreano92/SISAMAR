using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class ProCabecera
    {
        public int IdPrograma { get; set; }

        public int IdProcabecera { get; set; }

        public int IdPaciente { get; set; }

        public int? Estado { get; set; }

        public DateTime? FechaInicio { get; set; }

        public DateTime? FechaFin { get; set; }

        public int? UsuarioInicio { get; set; }

        public int? UsuarioFin { get; set; }

    }
}
