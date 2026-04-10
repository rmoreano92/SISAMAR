using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppMaternidad.Context.FactConfig.FuentesFinanciamiento.Domain
{
    public class FuenteFinanciamiento
    {
        public int IdFuenteFinanciamiento { get; set; }
        public string Descripcion { get; set; }
        public int IdTipoFinanciamiento { get; set; }

        public FuenteFinanciamiento(int idFuenteFinanciamiento, string descripcion, int idTipoFinanciamiento)
        {
            IdFuenteFinanciamiento = idFuenteFinanciamiento;
            Descripcion = descripcion;
            IdTipoFinanciamiento = idTipoFinanciamiento;
        }
    }
}