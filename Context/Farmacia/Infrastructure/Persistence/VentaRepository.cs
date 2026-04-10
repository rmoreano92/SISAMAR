using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using WebAppMaternidad.Context.Farmacia.Domain;
using WebAppMaternidad.Infrastructure.Persistence;

namespace WebAppMaternidad.Context.Farmacia.Infrastructure.Persistence
{
    public class VentaRepository : IVentaRepository
    {
        private readonly UnitOfWork _unitOfWork;

        public VentaRepository(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<DataSet> FarmMovimientoVentasDetalleXcuenta(int idCuentaAtencion, int OrderByDocumentoNumero)
        {
            try
            {
                await _unitOfWork.OpenConnectionAsync();
                using (var connection = _unitOfWork.GetConnection())
                using (var cmd = new SqlCommand("web_farmMovimientoVentasDetalleXcuenta", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@idCuentaAtencion", idCuentaAtencion);
                    cmd.Parameters.AddWithValue("@OrderByDocumentoNumero", OrderByDocumentoNumero);

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