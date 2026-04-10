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
    public class ConsumoServicioRepository: IConsumoServicioRepository
    {
        private readonly UnitOfWork _unitOfWork;

        public ConsumoServicioRepository(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<DataSet> FacturacionServicioDespachoXcuenta(int idCuentaAtencion, int OrderByPuntoCarga)
        {
            try
            {
                await _unitOfWork.OpenConnectionAsync();
                using (var connection = _unitOfWork.GetConnection())
                using (var cmd = new SqlCommand("Web_FacturacionServicioDespachoXcuenta", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@idCuentaAtencion", idCuentaAtencion);
                    cmd.Parameters.AddWithValue("@OrderByPuntoCarga", OrderByPuntoCarga);

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