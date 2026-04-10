using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
   public  class RecetaDetalle
    {
        public int idUsuario { get; set; }
        public int idItem { get; set; }
        public int cantidadPedida { get; set; }
        public double precio { get; set; }
        public double total { get; set; }
        public int saldoEnRegistroReceta { get; set; }
        public int saldoEnDespachoReceta { get; set; }
        public int cantidadDespachada { get; set; }
        public int idDosisRecetada { get; set; }
        public int idEstadoDetalle { get; set; }
        public string motivoAnulacion { get; set; }
        public string observaciones { get; set; }
        public int? idViaAdministracion { get; set; }
        public int? IdFrecuencia { get; set; }
        public string dx { get; set; }

    }
}
