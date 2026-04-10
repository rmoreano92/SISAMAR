using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppMaternidad.Context.Reportes.Domain
{
    public class DatosCabeceraReporte
    {
        public Institucion Institucion { get; private set; }
        public CabeceraPrincipal CabeceraPrincipal { get; private set; }
        // public CabeceraProcedencia Procedencia { get; private set; }

        public DatosCabeceraReporte(Institucion institucion, CabeceraPrincipal cabeceraPrincipal/*, CabeceraProcedencia procedencia*/)
        {
            Institucion = institucion;
            CabeceraPrincipal = cabeceraPrincipal;
            // Procedencia = procedencia;
        }
    }
}