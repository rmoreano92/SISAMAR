using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppMaternidad.Context.General.Especialidades.Domain
{
    public interface IEspecialidadRepository
    {
        Task<List<Especialidad>> GetAllAsync();
        Task<List<Especialidad>> FindAsync(int IdDepartamento, int IdEspecialidad);
    }
}