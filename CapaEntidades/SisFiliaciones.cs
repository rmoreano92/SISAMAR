using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades // JDELGADO003-C
{
    public class SisFiliaciones
    {
        public int? idSiasis { get; set; }
        public string Codigo { get; set; }
        public string AfiliacionDisa { get; set; }
        public string AfiliacionTipoFormato { get; set; }
        public string AfiliacionNroFormato { get; set; }
        public string AfiliacionNroIntegrante { get; set; }
        public string DocumentoTipo { get; set; }
        public string CodigoEstablAdscripcion { get; set; }
        public DateTime? AfiliacionFecha { get; set; }
        public string Paterno { get; set; }
        public string Materno { get; set; }
        public string Pnombre { get; set; }
        public string Onombres { get; set; }
        public string Genero { get; set; }
        public DateTime? Fnacimiento { get; set; }
        public string IdDistritoDomicilio { get; set; }
        public string Estado { get; set; }
        public string Fbaja { get; set; }
        public string DocumentoNumero { get; set; }
        public string MotivoBaja { get; set; }
        public DateTime? FbajaOK { get; set; }
    }
}
