using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppMaternidad.Context.Reportes.Domain
{
    public class Institucion
    {
        public string Nombre { get; private set; }
        public string Direccion { get; private set; }
        public string Telefono { get; private set; }

        public Institucion(string nombre, string direccion, string telefono)
        {
            Nombre = nombre;
            Direccion = direccion;
            Telefono = telefono;
        }
    }
}