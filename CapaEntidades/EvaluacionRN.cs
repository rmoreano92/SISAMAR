using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class EvaluacionRN
    {
        public int idEvaluacionRN { get; set; }
        public int? idCuentaAtencion { get; set; }
        public string Peso { get; set; }
        public int? Talla { get; set; }
        public int? PerimetroCefalico { get; set; }
        public int? PerimetroToracico { get; set; }
        public string Observaciones { get; set; }
        public int? idMedico { get; set; }
        public int? idTipoParto { get; set; }
        public int? idCondicion { get; set; }
        public int? idRiesgo { get; set; }
        public int? NroGemelar { get; set; }
        public int? PielaPïel { get; set; }
        public int? EdadGes { get; set; }
        public int? EdadMadre { get; set; }
        public bool? ClampadoTardio { get; set; }
        public bool? Lactancia1raHora { get; set; }
        public string Gesta { get; set; }
        public string Paridad { get; set; }
        public string AlMinuto { get; set; }
        public string Alos5Minutos { get; set; }

        public string PosicionParto { get; set; }

        public bool? ConAcompaniante { get; set; }

        public bool? ConAnaglgesia { get; set; }

        public bool? bActivo { get; set; }

        public int? idUsuario { get; set; }

    }
}
