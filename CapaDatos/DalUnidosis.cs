using System.Data;
using System.Threading.Tasks;
using System.Data.SqlClient;
using CapaDatos;
using System;

namespace WebAppMaternidad.CapaDatos
{
    public class DalUnidosis
    {

        public Task<DataSet> ListarRecetas(int nroReceta, int nroCuenta, string nroDni, int nroHistoria, string apellidoPaterno, string apellidoMaterno)
        {

            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListaRecetasUnidosis";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@nroReceta", SqlDbType.Int).Value = nroReceta;
                        da.SelectCommand.Parameters.Add("@nroCuenta", SqlDbType.Int).Value = nroCuenta;
                        da.SelectCommand.Parameters.Add("@nroDni", SqlDbType.VarChar).Value = nroDni;
                        da.SelectCommand.Parameters.Add("@nroHistoria", SqlDbType.Int).Value = nroHistoria;
                        da.SelectCommand.Parameters.Add("@apellidoPaterno", SqlDbType.VarChar).Value = apellidoPaterno;
                        da.SelectCommand.Parameters.Add("@apellidoMaterno", SqlDbType.VarChar).Value = apellidoMaterno;
                        //da.SelectCommand.Parameters.Add("@idServicioGeneral", SqlDbType.Int).Value = idServicioGeneral;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> SeleccionarRecetaCabecera(int idReceta)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_RecetaCabeceraUnidosisSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idReceta", SqlDbType.Int).Value = idReceta;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
                        
        }

        //public Task<Boolean> EliminaReceta(int idReceta, int usuario)
        //{
        //    Boolean nRpta = false;
        //    SqlCommand cmd = null;

        //    Conexion cx = new Conexion();
        //    return Task.Run(() =>
        //    {
        //        using (SqlConnection conn = cx.obtenerConexion())
        //        {
        //            using (SqlDataAdapter da = new SqlDataAdapter())
        //            {
        //                string sql = "web_eliminaReceta";
        //                da.SelectCommand = new SqlCommand(sql, conn);
        //                da.SelectCommand.CommandType = CommandType.StoredProcedure;

        //                da.SelectCommand.Parameters.Add("@idReceta", SqlDbType.Int).Value = idReceta;
        //                da.SelectCommand.Parameters.Add("@idUsuario", SqlDbType.Int).Value = usuario;

        //                DataSet ds = new DataSet();
        //                da.Fill(ds);

        //                return true;
        //            }
        //        }

        //    });

        //}

        public Task<DataSet> ListarFarmaciasUnidosisTodos()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "farmUnidosisSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        //da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = IdUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarProductosUnidosisTodos()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_farmUnidosisSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        //da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = IdUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> GeneraPreUnidosisEnFormaAutomatica(int idEmpleado)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_GeneraPreUnidosisEnFormaAutomatica";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idEmpleado", SqlDbType.Int).Value = idEmpleado;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

    }
}
