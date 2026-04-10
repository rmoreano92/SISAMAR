using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppMaternidad.Context.FactConfig.FuentesFinanciamiento.Domain
{
    public interface IFuenteFinanciamientoRepository
    {
        Task<List<FuenteFinanciamiento>> GetAllAsync();
    }
}