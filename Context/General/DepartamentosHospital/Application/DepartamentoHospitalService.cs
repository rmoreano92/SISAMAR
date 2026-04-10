using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAppMaternidad.Context.General.DepartamentosHospital.Application.interfaces;
using WebAppMaternidad.Context.General.DepartamentosHospital.Domain;
using WebAppMaternidad.Context.General.DepartamentosHospital.Infrastructure;

namespace WebAppMaternidad.Context.General.DepartamentosHospital.Application
{
    public class DepartamentoHospitalService : IDepartamentoHospitalService
    {
        private readonly IDepartamentoHospitalRepository _repo;

        public DepartamentoHospitalService(IDepartamentoHospitalRepository repo)
        {
            _repo = repo;
        }
        
        public async Task<List<DepartamentoHospital>> GetAllAsync()
        {
            return await _repo.GetAllAsync();
        }
    }
}