using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
  public  class ConstanciasRn
    {        
        public int idConstancia { get; set; }
        public int? Anio { get; set; }
        public int? NroHistoria { get; set; }
        public int? idRegistroRn { get; set; }
        public int? Base { get; set; }
        public int? TipoConstancia { get; set; }
        public string NroSerie { get; set; }
        public string NroCorrelativo { get; set; }
        public int? idSolicitudConstancia { get; set; }
        public int? estadoConstancia { get; set; }
        public int? idUsuario { get; set; }

        public int? idSolicitante { get; set; }
        public int? idTipoDocSolicitante { get; set; }
        public String NroDocSolicitante { get; set; }


    }
}
