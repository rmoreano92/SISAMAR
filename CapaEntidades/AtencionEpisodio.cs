using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class AtencionEpisodio
    {
        public int idAtencion { get; set; }        
        public int idPaciente { get; set; }
        public int numeroEpisodio { get; set; }
        public int epiNuevo { get; set; }
        public int epiCierre { get; set; }
        public int idUsuario { get; set; }
    }
}
