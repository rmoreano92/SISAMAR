using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class Menu
    {
        public int IdListGrupo { get; set; }
        public string  Clave { get; set; }
        public string Descripcion { get; set; }
        public string UrlIcono { get; set; }
        public int Indice { get; set; }

        public string Area { get; set; }

        public string iconoArea { get; set; }
        public List<Menu> MenuDetail { get; set; }

        public List<SubMenus> Menuhijos { get; set; }


    }
}
