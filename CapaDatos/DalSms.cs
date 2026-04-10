using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos
{
    public class DalSms
    {
        public Task<DataSet> ListarMensajesPorEstadoEnvio(int idEstadoEnvio)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "Web_ListarMensajesPorEstadoEnvio";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idEstadoEnvio", idEstadoEnvio);
                            da.SelectCommand = cmd;
                            da.Fill(dataSet);
                        }
                        catch (Exception ex)
                        {
                            dataSet = null;
                            throw new Exception(ex.Message);
                        }
                        return dataSet;
                    }
                }
            });
        }

        public Task<DataSet> ModificarEstadoMensajes(int idMensaje, int idEstadoEnvio)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();
            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "Web_ModificarEstadoMensajes";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idMensaje", idMensaje);
                            cmd.Parameters.AddWithValue("@idEstadoEnvio", idEstadoEnvio);

                            da.SelectCommand = cmd;
                            da.Fill(dataSet);

                        }
                        catch (Exception ex)
                        {
                            dataSet = null;
                            throw new Exception(ex.Message);
                        }
                        return dataSet;
                    }
                }
            });
        }

        public Task<DataSet> ListarMensajesPoRNEstadoEnvio(int idEstadoEnvio)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "Web_ListarMensajesRNPorEstadoEnvio";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idEstadoEnvio", idEstadoEnvio);
                            da.SelectCommand = cmd;
                            da.Fill(dataSet);
                        }
                        catch (Exception ex)
                        {
                            dataSet = null;
                            throw new Exception(ex.Message);
                        }
                        return dataSet;
                    }
                }
            });
        }

        public Task<DataSet> ModificarEstadoMensajesRN(int idMensaje, int idEstadoEnvio)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();
            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "Web_ModificarEstadoMensajesRN";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idMensaje", idMensaje);
                            cmd.Parameters.AddWithValue("@idEstadoEnvio", idEstadoEnvio);

                            da.SelectCommand = cmd;
                            da.Fill(dataSet);

                        }
                        catch (Exception ex)
                        {
                            dataSet = null;
                            throw new Exception(ex.Message);
                        }
                        return dataSet;
                    }
                }
            });
        }
    }
}
