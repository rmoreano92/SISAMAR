using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAppMaternidad.Context.General.Servicios.Application.interfaces;
using WebAppMaternidad.Context.General.Servicios.Domain;

namespace WebAppMaternidad.Context.General.Servicios.Application
{
    public class ServicioService : IServicioService
    {
        private readonly IServicioRepository _repo;
        public ServicioService(IServicioRepository repo)
        {
            _repo = repo;
        }
        public async Task<List<Servicio>> GetAllAsync()
        {
            return await _repo.GetAllAsync();
        }

        public async Task<List<Servicio>> FindAsync(int IdTipoServicio, int IdDepartamento, int IdEspecialidad, int IdServicio)
        {
            return await _repo.FindAsync(IdTipoServicio, IdDepartamento, IdEspecialidad, IdServicio);
        }

    }
}