using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAppMaternidad.Context.General.Servicios.Domain;

namespace WebAppMaternidad.Context.General.Servicios.Application.interfaces
{
    public interface IServicioService
    {
        Task<List<Servicio>> GetAllAsync();
        Task<List<Servicio>> FindAsync(int IdTipoServicio, int IdDepartamento, int IdEspecialidad, int IdServicio);
    }
}