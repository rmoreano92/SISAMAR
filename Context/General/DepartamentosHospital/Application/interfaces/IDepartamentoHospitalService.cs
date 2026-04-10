using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAppMaternidad.Context.General.DepartamentosHospital.Domain;

namespace WebAppMaternidad.Context.General.DepartamentosHospital.Application.interfaces
{
    public interface IDepartamentoHospitalService
    {
        public Task<List<DepartamentoHospital>> GetAllAsync();
    }
}