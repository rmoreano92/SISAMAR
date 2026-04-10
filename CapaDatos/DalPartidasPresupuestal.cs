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
    public class DalPartidasPresupuestal
    {
        public Task<DataSet> PartidasPresupuestalListar(string codigo, string nombre)
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_PartidasPresupuestalesListar";
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

        public Task<DataSet> CatalogoServiciosListarTodos()
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_CatalogoServiciosListarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        //da.SelectCommand.Parameters.Add("@Nombre", SqlDbType.VarChar).Value = (object)nombre ?? DBNull.Value;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> FactPartidasPresupuestalesSeleccionar(int idPartida)
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_FactPartidasPresupuestalesSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdPartidaPresupuestal", SqlDbType.Int).Value = (object)idPartida ?? DBNull.Value;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> PartidasPresupuestalGuardar(int idPartida, string codigo, string nombre, List<PartidasPresupuestalCpt> lstDetalle, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();
            string xmlDetalle;
            xmlDetalle = XmlUtil.Serializer(typeof(List<PartidasPresupuestalCpt>), lstDetalle);
            DataSet ds = new DataSet();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_PartidasPresupuestalGuardar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdPartida", (object)idPartida ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@Codigo", (object)codigo ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@Nombre", (object)nombre ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@DetalleProductos", xmlDetalle ?? (object)DBNull.Value);

                        da.SelectCommand.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        da.SelectCommand.Parameters.AddWithValue("@IdListItem", idListBar);

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> PartidasPresupuestalEliminar(int idPartida, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();

            DataSet ds = new DataSet();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_PartidasPresupuestalEliminar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdPartida", (object)idPartida ?? DBNull.Value);

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
