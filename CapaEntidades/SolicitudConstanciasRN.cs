using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class SolicitudConstanciasRN
    {
        public int idSolicitud { get; set; }
        public int? Anio { get; set; }
        public int? NroHistoria { get; set; }
        public int idRegistroRn { get; set; }
        public int? Base { get; set; }
        public string NroDocumento { get; set; }
        public int? idEstadoSolicitud { get; set; }
        public int? idUsuario { get; set; }
        public String Comentario { get; set; }

        public bool bAprobado { set; get; }
        public int? idSolicitante { get; set; }
        public int? idTipoDocSolicitante { get; set; }
        public String NroDocSolicitante { get; set; }
    }
}
