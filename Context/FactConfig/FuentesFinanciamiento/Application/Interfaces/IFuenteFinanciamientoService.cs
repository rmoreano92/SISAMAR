using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAppMaternidad.Context.FactConfig.FuentesFinanciamiento.Domain;

namespace WebAppMaternidad.Context.FactConfig.FuentesFinanciamiento.Application.Interfaces
{
    public interface IFuenteFinanciamientoService
    {
        Task<List<FuenteFinanciamiento>> GetAllAsync();
    }
}