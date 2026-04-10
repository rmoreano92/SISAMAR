using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class AtencionEntrevista
    {
        public int idAtencion { get; set; }
        public int idCuentaAtencion { get; set; }
        public int idPaciente { get; set; }
        public int NroHistoria { get; set; }
        public int NroControles { get; set; }
        public int TipoClasificacion { get; set; }
        public int EdadGest { get; set; }
        public int NroGestas { get; set; }
        public int IdUsuario { get; set; }

    }
}
