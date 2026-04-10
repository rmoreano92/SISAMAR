using CapaDatos;
using CapaEntidades;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.CapaDatos
{
    public class DalTiposTarifa
    {
        public Task<DataSet> TiposTarifaListar(string codigo, string nombre)
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_TiposTarifaListar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@Codigo", SqlDbType.VarChar).Value = (object)codigo ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Nombre", SqlDbType.VarChar).Value = (object)nombre ?? DBNull.Value;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> TiposTarifaCptListarTodos()
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_TiposTarifaCptListarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        //da.SelectCommand.Parameters.Add("@Nombre", SqlDbType.VarChar).Value = (object)nombre ?? DBNull.Value;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> TiposTarifaSeleccionar(int idTipoTarifa)
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_TiposTarifaSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdTipoTarifa", SqlDbType.Int).Value = (object)idTipoTarifa ?? DBNull.Value;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> TiposTarifaGuardar(int idTipoTarifa, string codigo, string nombre, List<TiposTarifaCpt> lstDetalle, int esFarmacia, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();
            string xmlDetalle;
            xmlDetalle = XmlUtil.Serializer(typeof(List<TiposTarifaCpt>), lstDetalle);
            DataSet ds = new DataSet();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_TiposTarifaGuardar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdTipoTarifa", (object)idTipoTarifa ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@Codigo", (object)codigo ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@Nombre", (object)nombre ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@EsFarmacia", (object)esFarmacia ?? (object)DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@DetalleProductos", xmlDetalle ?? (object)DBNull.Value);

                        da.SelectCommand.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        da.SelectCommand.Parameters.AddWithValue("@IdListItem", idListBar);

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> TiposTarifaEliminar(int idTipoTarifa, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_TiposTarifaEliminar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdTipoTarifa", (object)idTipoTarifa ?? DBNull.Value);

                        da.SelectCommand.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        da.SelectCommand.Parameters.AddWithValue("@IdListItem", idListBar);

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


    }
}
