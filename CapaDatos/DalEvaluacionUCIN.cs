using System.Data.SqlClient;
using System.Data;
using System;
using System.Threading.Tasks;
using CapaDatos;
using WebAppMaternidad.CapaEntidades;
using System.Collections.Generic;
using CapaEntidades;

namespace WebAppMaternidad.CapaDatos
{
    public class DalEvaluacionUCIN
    {

        public Task<DataSet> ListarServiciosUCIN()
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return Task.Run(() =>
            {
                try
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            string sql = "web_ServiciosUCINListar";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            //da.SelectCommand.Parameters.Add("@NroEvaluacion", SqlDbType.Int).Value = (NroEvaluacion > 0) ? NroEvaluacion : 0;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                }
                catch (Exception ex)
                {
                    ds = null; throw new Exception(ex.Message);
                }

            });
        }

        public Task<DataSet> ListarAtencionesUCIN(int idCuentaAtencion, int historiaClinica, string apellidoPaterno, string fechaIngreso, string fechaFin, string dni, int idServicio)
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return Task.Run(() =>
            {
                try
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            string sql = "web_AtencionesUCINListar";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@idCuentaAtencion", SqlDbType.Int).Value = idCuentaAtencion;
                            da.SelectCommand.Parameters.Add("@historiaClinica", SqlDbType.Int).Value = historiaClinica;
                            da.SelectCommand.Parameters.Add("@apellidoPaterno", SqlDbType.VarChar).Value = ((apellidoPaterno == null) ? "" : apellidoPaterno);
                            da.SelectCommand.Parameters.Add("@fechaIngreso", SqlDbType.VarChar).Value = ((fechaIngreso == null) ? "" : fechaIngreso);
                            da.SelectCommand.Parameters.Add("@fechaFin", SqlDbType.VarChar).Value = ((fechaFin == null) ? "" : fechaFin);
                            da.SelectCommand.Parameters.Add("@dni", SqlDbType.VarChar).Value = ((dni == null) ? "" : dni);
                            da.SelectCommand.Parameters.Add("@idServicio", SqlDbType.VarChar).Value = idServicio;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                }
                catch (Exception ex)
                {
                    ds = null; throw new Exception(ex.Message);
                }

            });
        }












    }
}
