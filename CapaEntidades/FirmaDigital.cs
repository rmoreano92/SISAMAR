using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class FirmaDigital
    {
        public string code { get; set; }        
        public int idCuentaAtencion { get; set; }
        public int idRegistro { get; set; }
        public int idTipoServicio { get; set; }        
        public int idServicio { get; set; }
        public int idEvaluacion { get; set; }
        public int idEmpleado { get; set; }
        public string fecha { get; set; }
        public string tipo { get; set; }
        public string nombreArchivo { get; set; }
        public string rutaArchivo { get; set; }
        public int statusFirma { get; set; }
        public int processFirma { get; set; }
        public int idUsuarioRegistra { get; set; }
        public DateTime fechaRegistra { get; set; }
        public int idUsuarioModifica { get; set; }
        public DateTime fechaModifica { get; set; }
        public int idItem { get; set; }

    }
}
