using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class Admision
    {
        public int IdCita { get; set; }
        public int IdAtencion { get; set; }
        public int IdEstadoColaCita { get; set; }
        public string Justificacion { get; set; }
        public int IdUsuarioAuditoria { get; set; }
    }
}
