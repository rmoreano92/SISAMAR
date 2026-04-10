using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;

namespace CapaDatos
{
    public class DalEconomia
    {

        public Task<DataSet> CajaTiposComprobantesParaMigracion()
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_CajaTiposComprobantesParaMigracion";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        //public Task<DataSet> FechaLimiteDocumentosMigrados(string tipoDoc)
        //{
        //    DataSet ds = new DataSet();
        //    Conexion cx = new Conexion();
        //    return Task.Run(() =>
        //    {
        //        using (SqlConnection conn = cx.obtenerConexionFacturactiva())
        //        {
        //            using (SqlDataAdapter da = new SqlDataAdapter())
        //            {
        //                string sql = "fecha_Limite_V2";
        //                da.SelectCommand = new SqlCommand(sql, conn);
        //                da.SelectCommand.CommandType = CommandType.StoredProcedure;

        //                da.SelectCommand.Parameters.Add("@tipoDOc", SqlDbType.VarChar).Value = tipoDoc;

        //                da.Fill(ds);

        //                return ds;
        //            }
        //        }
        //    });
        //}

        public Task<DataSet> BuscarDocumentosEmitidos(string fechaInicio, string fechaFin, string tipo)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_MigracionDocumentosListarCabecera";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@dFecInicio", SqlDbType.VarChar).Value = fechaInicio;
                        da.SelectCommand.Parameters.Add("@dFecFin", SqlDbType.VarChar).Value = fechaFin;
                        da.SelectCommand.Parameters.Add("@nTipo", SqlDbType.VarChar).Value = tipo;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
    }
}
