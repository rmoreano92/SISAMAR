using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAppMaternidad.Context.FactConfig.FuentesFinanciamiento.Application.Interfaces;
using WebAppMaternidad.Context.FactConfig.FuentesFinanciamiento.Domain;

namespace WebAppMaternidad.Context.FactConfig.FuentesFinanciamiento.Application
{
    public class FuenteFinanciamientoService: IFuenteFinanciamientoService
    {
        private readonly IFuenteFinanciamientoRepository _repo;
        public FuenteFinanciamientoService(IFuenteFinanciamientoRepository repo) {
            _repo = repo;
        }
        public async Task<List<FuenteFinanciamiento>> GetAllAsync()
        {
            return await _repo.GetAllAsync();
        }
    }
}