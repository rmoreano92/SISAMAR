using System.Data;
using System.Threading.Tasks;
using System.Data.SqlClient;
using CapaDatos;
using WebAppMaternidad.CapaEntidades;
using System;

namespace WebAppMaternidad.CapaDatos
{
    public class DalSGCMonitoreo
    {
        public Task<DataSet> ListaTurnosMonitoreo(int idVentanilla, string fecha)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexionGestionColas())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ListaTurnosMonitoreo";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdVentanilla", idVentanilla);
                        da.SelectCommand.Parameters.AddWithValue("@Fecha", fecha);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        public Task<DataSet> ListarReporteMonitoreoColas(int idVentanilla, string fechaInicio, string fechaFin)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexionGestionColas())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ReporteMonitoreoColas";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdVentanilla", idVentanilla);
                            cmd.Parameters.AddWithValue("@FechaInicio", fechaInicio);
                            cmd.Parameters.AddWithValue("@FechaFin", fechaFin);                            

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
