using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using WebAppMaternidad.Context.General.TiposServicio.Domain;
using WebAppMaternidad.Infrastructure.Persistence;

namespace WebAppMaternidad.Context.General.TiposServicio
{
    public class TipoServicioRepository: ITipoServicioRepository
    {
        private readonly UnitOfWork _unitOfWork;

        public TipoServicioRepository(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<List<TipoServicio>> GetAllAsync()
        {
            var list = new List<TipoServicio>();

            try
            {
                await _unitOfWork.OpenConnectionAsync();
                using (var connection = _unitOfWork.GetConnection())
                using (var cmd = new SqlCommand("Web_ListarTipoServicio", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var idTipoServicio = reader.GetInt32(reader.GetOrdinal("IdTipoServicio"));
                            var descripcion = reader.GetString(reader.GetOrdinal("Descripcion"));

                            TipoServicio tiposServicio = new TipoServicio(idTipoServicio, descripcion);
                            list.Add(tiposServicio);
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