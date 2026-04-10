using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppMaternidad.Context.General.Servicios.Domain
{
    public interface IServicioRepository
    {
        Task<List<Servicio>> GetAllAsync();
        Task<List<Servicio>> FindAsync(int IdTipoServicio, int IdDepartamento, int IdEspecialidad, int IdServicio);
    }
}