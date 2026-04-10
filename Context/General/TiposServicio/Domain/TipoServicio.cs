using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppMaternidad.Context.General.TiposServicio.Domain
{
    public class TipoServicio
    {
        public int IdTipoServicio { get; private set; }
        public string Descripcion { get; private set; }

        public TipoServicio(int idTipoServicio, string descripcion)
        {
            IdTipoServicio = idTipoServicio;
            Descripcion = descripcion;
        }
    }
}