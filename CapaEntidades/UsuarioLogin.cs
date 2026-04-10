using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class UsuarioLogin
    {
        public string Usuario { get; set; }
        public string Password { get; set; }

        public DataSet RolesyPermiso { get; set; }
    }
}
