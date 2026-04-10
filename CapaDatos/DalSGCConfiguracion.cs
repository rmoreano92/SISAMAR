using System.Data;
using System.Threading.Tasks;
using System.Data.SqlClient;
using CapaDatos;
using WebAppMaternidad.CapaEntidades;
using System;

namespace WebAppMaternidad.CapaDatos
{
    public class DalSGCConfiguracion
    {
        public Task<DataSet> ListarVentanillas()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexionGestionColas())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ListarVentanillas";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<int> AbrirCerrarVentanilla(int idVentanilla, int idEmpleado)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexionGestionColas())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "AbrirCerrarVentanilla";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdVentanilla", SqlDbType.Int).Value = idVentanilla;
                        da.SelectCommand.Parameters.Add("@IdEmpleado", SqlDbType.Int).Value = idEmpleado;
                        SqlParameter outputParameter = new SqlParameter("@resp", SqlDbType.Int);
                        outputParameter.Direction = ParameterDirection.Output;
                        da.SelectCommand.Parameters.Add(outputParameter);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        int resp = Convert.ToInt32(da.SelectCommand.Parameters["@resp"].Value);

                        return resp;
                    }
                }

            });
        }

        public Task<int> GuardarVideo(string rutaVideo, int idEmpleado)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexionGestionColas())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "VideoModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@RutaVideo", SqlDbType.VarChar).Value = rutaVideo;
                        da.SelectCommand.Parameters.Add("@IdEmpleado", SqlDbType.Int).Value = idEmpleado;
                        SqlParameter outputParameter = new SqlParameter("@resp", SqlDbType.Int);
                        outputParameter.Direction = ParameterDirection.Output;
                        da.SelectCommand.Parameters.Add(outputParameter);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        int resp = Convert.ToInt32(da.SelectCommand.Parameters["@resp"].Value);

                        return resp;
                    }
                }

            });
        }

    }
}
