using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppMaternidad.Context.Facturacion.Domain
{
    public interface IPacienteRepository
    {
        public Task<DataSet> TieneDeudaDeSangre(int idPaciente);
    }
}