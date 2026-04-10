using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;

namespace CapaDatos
{
    public class DalCarnetPrenatal
    {
        public Task<DataSet> SeleccionarHistoriaCarnetPrenatal(int idPaciente)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_SeleccionarHistoriaCarnetPrenatal";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idPaciente", SqlDbType.Int).Value = idPaciente;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> SeleccionarTriajeCarnetPrenatal(int idAtencion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_SeleccionarTriajeCarnetPrenatal";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idAtencion", SqlDbType.Int).Value = idAtencion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public async Task<DataSet> SeleccionarLabResultadosCarnetPrenatal(int idPaciente)
        {
            Conexion cx = new Conexion();

            try
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_SeleccionarLabResultadosCarnetPrenatal";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                        da.SelectCommand.CommandTimeout = 120; // Aumenta el tiempo de espera a 120 segundos

                        da.SelectCommand.Parameters.Add("@idPaciente", SqlDbType.Int).Value = idPaciente;

                        DataSet ds = new DataSet();
                        await Task.Run(() => da.Fill(ds));

                        return ds;
                    }
                }
            }
            catch (Exception ex)
            {
                // Aquí puedes manejar o registrar el error
                throw new Exception("Error al obtener resultados del carnet prenatal", ex);
            }
        }

        public Task<DataSet> SeleccionarHistoriaCarnetDetallePrenatal(int idPaciente)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_SeleccionarHistoriaCarnetDetallePrenatal";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idPaciente", SqlDbType.Int).Value = idPaciente;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

    }
}
