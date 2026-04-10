using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class VisitasMedicas
    {
        public int idVisita { get; set; }

        public int? idPaciente { get; set; }

        public int? idServicioActual { get; set; }

        public string nroCama { get; set; }

        public int? idcuenta { get; set; }

        public DateTime? FechaEvaluacion { get; set; }

        public int? idTipoParto { get; set; }

        public DateTime? FechaParto { get; set; }

        public int? SexoRN { get; set; }

        public int idCondicionMadre { get; set; }

        public string ComplicacionesMadre { get; set; }

        public int? NecesitaVisita { get; set; }

        public int? altaMedica { get; set; }

        public string urlPase { get; set; }
        
        public int idEstadoLlamada { get; set; }
        public int? idUsuario { get; set; }

        public bool? bActivo { get; set; }

        public string Operaciones { set; get; }

        public DateTime? FechaAlta { set; get; }

        public String FechaAltaString { set; get; }
        public String FechaEvaluacionString { set; get; }

        public String DocFamiliar { set; get; }

    }
}
