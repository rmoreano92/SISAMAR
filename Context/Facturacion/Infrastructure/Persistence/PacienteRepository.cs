using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using WebAppMaternidad.Context.Facturacion.Domain;
using WebAppMaternidad.Infrastructure.Persistence;

namespace WebAppMaternidad.Context.Facturacion.Infrastructure.Persistence
{
    public class PacienteRepository: IPacienteRepository
    {
        private readonly UnitOfWork _unitOfWork;

        public PacienteRepository(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<DataSet> TieneDeudaDeSangre(int idPaciente)
        {
            try
            {
                await _unitOfWork.OpenConnectionAsync();
                using (var connection = _unitOfWork.GetConnection())
                using (var cmd = new SqlCommand("VerificarDeudaSangreEnCuentasPorPaciente", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@idPaciente", idPaciente);

                    var dataSet = new DataSet();
                    using (var adapter = new SqlDataAdapter(cmd))
                    {
                        adapter.Fill(dataSet);
                    }

                    return dataSet;
                }
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