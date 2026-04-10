using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using WebAppMaternidad.Context.General.DepartamentosHospital.Domain;
using WebAppMaternidad.Infrastructure.Persistence;

namespace WebAppMaternidad.Context.General.DepartamentosHospital.Infrastructure
{
    public class DepartamentoHospitalRepository: IDepartamentoHospitalRepository
    {
        private readonly UnitOfWork _unitOfWork;

        public DepartamentoHospitalRepository(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<List<DepartamentoHospital>> GetAllAsync()
        {
            var list = new List<DepartamentoHospital>();

            try
            {
                await _unitOfWork.OpenConnectionAsync();
                using (var connection = _unitOfWork.GetConnection())
                using (var cmd = new SqlCommand("Web_DepartamentosHospitalSeleccionarTodos", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var idDepartamento = reader.GetInt32(reader.GetOrdinal("IdDepartamento"));
                            var descripcion = reader.GetString(reader.GetOrdinal("DescripcionLarga"));

                            DepartamentoHospital departamento = new DepartamentoHospital(idDepartamento, descripcion);
                            list.Add(departamento);
                        }
                    }
                }

                return list;
            }
            catch
            {
                throw;
            }
            finally
            {
                await _unitOfWork.CloseAsync();
            }
        }
    }
}