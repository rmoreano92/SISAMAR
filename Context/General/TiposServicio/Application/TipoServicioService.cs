using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using WebAppMaternidad.Context.General.TiposServicio.Application.interfaces;
using WebAppMaternidad.Context.General.TiposServicio.Domain;

namespace WebAppMaternidad.Context.General.TiposServicio.Application
{
    public class TipoServicioService: ITipoServicioService
    {
        private readonly ITipoServicioRepository _repo;
        public TipoServicioService(ITipoServicioRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<TipoServicio>> GetAllAsync()
        {
            return await _repo.GetAllAsync();
        }
    }
}