using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAppMaternidad.Context.General.Especialidades.Domain;

namespace WebAppMaternidad.Context.General.Especialidades.Application
{
    public class EspecialidadService: IEspecialidadService
    {
        private readonly IEspecialidadRepository _repo;
        public EspecialidadService(IEspecialidadRepository repo)
        {
            _repo = repo;
        }
        public async Task<List<Especialidad>> GetAllAsync()
        {
            return await _repo.GetAllAsync();
        }

        public async Task<List<Especialidad>> FindAsync(int IdDepartamento, int IdEspecialidad)
        {
            return await _repo.FindAsync(IdDepartamento, IdEspecialidad);
        }
    }
}