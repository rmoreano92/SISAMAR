using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppMaternidad.Context.General.DepartamentosHospital.Domain
{
    public interface IDepartamentoHospitalRepository
    {
        public Task<List<DepartamentoHospital>> GetAllAsync();
    }
}