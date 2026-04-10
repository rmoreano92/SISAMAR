using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using WebAppMaternidad.Context.General.TiposServicio.Domain;

namespace WebAppMaternidad.Context.General.TiposServicio.Domain
{
    public interface ITipoServicioRepository
    {
        Task<List<TipoServicio>> GetAllAsync();
    }
}