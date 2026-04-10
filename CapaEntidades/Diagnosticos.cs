using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class Diagnosticos
    {
        public int IdDiagnostico { get; set; }

        public string CodigoCIE2004 { get; set; }

        public string Descripcion { get; set; }

        public int? IdCapitulo { get; set; }

        public int? IdGrupo { get; set; }

        public int? IdCategoria { get; set; }

        public string CodigoExportacion { get; set; }

        public string CodigoCIE9 { get; set; }

        public string CodigoCIE10 { get; set; }

        public bool? Gestacion { get; set; }

        public bool? Morbilidad { get; set; }

        public bool? Intrahospitalario { get; set; }

        public bool? Restriccion { get; set; }

        public int? EdadMaxDias { get; set; }

        public int? EdadMinDias { get; set; }

        public int? IdTipoSexo { get; set; }

        public string ClaseDxHIS { get; set; }

        public string DescripcionMINSA { get; set; }

        public string codigoCIEsinPto { get; set; }

        public DateTime? FechaInicioVigencia { get; set; }

        public bool EsActivo { get; set; }
        public int? idTipoDiagnostico { get; set; }

        public string lab { get; set; }






    }
}
