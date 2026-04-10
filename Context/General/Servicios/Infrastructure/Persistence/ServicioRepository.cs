using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using WebAppMaternidad.Context.General.Servicios.Domain;
using WebAppMaternidad.Infrastructure.Persistence;

namespace WebAppMaternidad.Context.General.Servicios.Infrastructure.Persistence
{
    public class ServicioRepository : IServicioRepository
    {
        private readonly UnitOfWork _unitOfWork;

        public ServicioRepository(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<List<Servicio>> GetAllAsync()
        {
            var list = new List<Servicio>();

            try
            {
                await _unitOfWork.OpenConnectionAsync();
                using (var connection = _unitOfWork.GetConnection())
                using (var cmd = new SqlCommand("web_ListarServicios", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var idServicio = reader.GetInt32(reader.GetOrdinal("IdServicio"));
                            var nombre = reader.GetString(reader.GetOrdinal("Nombre"));

                            Servicio servicio = new Servicio(idServicio, nombre);
                            list.Add(servicio);
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
        
        public async Task<List<Servicio>> FindAsync(int IdTipoServicio, int IdDepartamento, int IdEspecialidad, int IdServicio)
        {
            var list = new List<Servicio>();

            try
            {
                await _unitOfWork.OpenConnectionAsync();
                using (var connection = _unitOfWork.GetConnection())
                using (var cmd = new SqlCommand("web_ListarServicios", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("IdTipoServicio", IdTipoServicio);
                    cmd.Parameters.AddWithValue("IdDepartamento", IdDepartamento);
                    cmd.Parameters.AddWithValue("IdEspecialidad", IdEspecialidad);
                    cmd.Parameters.AddWithValue("IdServicio", IdServicio);

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var idServicio = reader.GetInt32(reader.GetOrdinal("IdServicio"));
                            var nombre = reader.GetString(reader.GetOrdinal("Nombre"));

                            Servicio servicio = new Servicio(idServicio, nombre);
                            list.Add(servicio);
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