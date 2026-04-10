using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using WebAppMaternidad.Context.Facturacion.Domain;

namespace WebAppMaternidad.Context.Facturacion.Application.Services
{
    public class EstadoCuentaService
    {
        public readonly IPacienteRepository _pacienteRepository;

        public EstadoCuentaService(IPacienteRepository pacienteRepository)
        {
            _pacienteRepository = pacienteRepository;
        }
        public async Task<DataSet> TieneDeudaDeSangre(int idPaciente)
        {
            var dataSet = await _pacienteRepository.TieneDeudaDeSangre(idPaciente);
                return dataSet;
        }
    }
}