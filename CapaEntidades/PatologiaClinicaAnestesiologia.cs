using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class PatologiaClinicaAnestesiologia
    {
        public int? IdProducto { get; set; }
        public string Codigo { get; set; }
        public string Descripcion { get; set; }
        public int? Cantidad { get; set; }
        public string Fecha { get; set; }
        public string ValorTexto { get; set; }
    }
}
