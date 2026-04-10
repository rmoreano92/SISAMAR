using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using WebAppMaternidad.Context.General.Especialidades.Domain;
using WebAppMaternidad.Infrastructure.Persistence;

namespace WebAppMaternidad.Context.General.Especialidades.Infrastructure.Persistence
{
    public class EspecialidadRepository : IEspecialidadRepository
    {
        private readonly UnitOfWork _unitOfWork;

        public EspecialidadRepository(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<List<Especialidad>> GetAllAsync()
        {
            var list = new List<Especialidad>();

            try
            {
                await _unitOfWork.OpenConnectionAsync();
                using (var connection = _unitOfWork.GetConnection())
                using (var cmd = new SqlCommand("web_ListarEspecialidades", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var idEspecialidad = reader.GetInt32(reader.GetOrdinal("IdEspecialidad"));
                            var nombre = reader.GetString(reader.GetOrdinal("Nombre"));
                            var idDepartamento = reader.GetInt32(reader.GetOrdinal("IdDepartamento"));
                            var tiempoPromedioAtencion = reader.IsDBNull(reader.GetOrdinal("TiempoPromedioAtencion"))
                                                        ? null
                                                        : reader.GetString(reader.GetOrdinal("TiempoPromedioAtencion"));

                            Especialidad especialidad = new Especialidad(idEspecialidad, nombre, idDepartamento, tiempoPromedioAtencion);
                            list.Add(especialidad);
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
        public async Task<List<Especialidad>> FindAsync(int IdDepartamento, int IdEspecialidad)
        {
            var list = new List<Especialidad>();

            try
            {
                await _unitOfWork.OpenConnectionAsync();
                using (var connection = _unitOfWork.GetConnection())
                using (var cmd = new SqlCommand("web_ListarEspecialidades", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;


                    cmd.Parameters.AddWithValue("IdDepartamento", IdDepartamento);
                    cmd.Parameters.AddWithValue("IdEspecialidad", IdEspecialidad);

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var idEspecialidad = reader.GetInt32(reader.GetOrdinal("IdEspecialidad"));
                            var nombre = reader.GetString(reader.GetOrdinal("Nombre"));
                            var idDepartamento = reader.GetInt32(reader.GetOrdinal("IdDepartamento"));
                            var tiempoPromedioAtencion = reader.IsDBNull(reader.GetOrdinal("TiempoPromedioAtencion"))
                                                        ? null
                                                        : reader.GetString(reader.GetOrdinal("TiempoPromedioAtencion"));

                            Especialidad especialidad = new Especialidad(idEspecialidad, nombre, idDepartamento, tiempoPromedioAtencion);
                            list.Add(especialidad);
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