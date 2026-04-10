using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using WebAppMaternidad.Context.FactConfig.FuentesFinanciamiento.Domain;
using WebAppMaternidad.Infrastructure.Persistence;

namespace WebAppMaternidad.Context.FactConfig.FuentesFinanciamiento.Infrastructure.Persistence
{
    public class FuenteFinanciamientoRepository: IFuenteFinanciamientoRepository
    {
        private readonly UnitOfWork _unitOfWork;

        public FuenteFinanciamientoRepository(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<List<FuenteFinanciamiento>> GetAllAsync()
        {
            var list = new List<FuenteFinanciamiento>();

            try
            {
                await _unitOfWork.OpenConnectionAsync();
                using (var connection = _unitOfWork.GetConnection())
                using (var cmd = new SqlCommand("Web_ListarFuentesFinanciamiento", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var idFuenteFinanciamiento = reader.GetInt32(reader.GetOrdinal("IdFuenteFinanciamiento"));
                            var descripcion = reader.GetString(reader.GetOrdinal("Descripcion"));
                            var idTipoFinanciamiento = reader.IsDBNull(reader.GetOrdinal("IdTipoFinanciamiento"))
                                                        ? 0
                                                        : reader.GetInt32(reader.GetOrdinal("IdTipoFinanciamiento"));
                            

                            FuenteFinanciamiento fuenteFinanciamiento = new FuenteFinanciamiento(idFuenteFinanciamiento, descripcion, idTipoFinanciamiento);
                            list.Add(fuenteFinanciamiento);
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