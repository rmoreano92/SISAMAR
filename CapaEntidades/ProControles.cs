using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class ProControles
    {
        public int IdPrograma { get; set; }

        public int IdProCabecera { get; set; }

        public int IdControl { get; set; }

        public int? IdAtencion { get; set; }

        public string FechaControl { get; set; }

        public bool? ControlOtroEESS { get; set; }

        public int? IdEstablecimiento { get; set; }

    }
}
