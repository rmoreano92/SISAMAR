using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class RolesItems
    {
        public int IdRolItem { get; set; }
        public int? IdListItem { get; set; }
        public int IdListGrupo { get; set; }
        public int? IdRol { get; set; }
        public bool? Agregar { get; set; }
        public bool? Modificar { get; set; }
        public bool? Eliminar { get; set; }
        public bool? Consultar { get; set; }

    }
}
