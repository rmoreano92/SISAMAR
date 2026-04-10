using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class SubclasificacionDiagnosticos
    {
        public int IdSubclasificacionDx { get; set; }

        public string Codigo { get; set; }

        public string Descripcion { get; set; }

        public int? IdClasificacionDx { get; set; }

        public int? IdTipoServicio { get; set; }


    }

}
