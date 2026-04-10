using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAppMaternidad.Context.General.Especialidades.Domain;

namespace WebAppMaternidad.Context.General.Especialidades.Application
{
    public interface IEspecialidadService
    {
        Task<List<Especialidad>> GetAllAsync();
        Task<List<Especialidad>> FindAsync(int IdDepartamento, int IdEspecialidad);
    }
}