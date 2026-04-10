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
    public class DalCentrosCosto
    {
        public Task<DataSet> CentrosCostoListar(string codigo, string nombre)
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_CentrosCostoListar";
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

        public Task<DataSet> FactCatalogoServiciosConPrecioMayorListar()
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_FactCatalogoServiciosConPrecioMayorListar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        //da.SelectCommand.Parameters.Add("@Nombre", SqlDbType.VarChar).Value = (object)nombre ?? DBNull.Value;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> CentrosCostoSeleccionar(int idCentroCosto)
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_CentrosCostoSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdCentroCosto", SqlDbType.Int).Value = (object)idCentroCosto ?? DBNull.Value;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> CentrosCostoGuardar(int idCentroCosto, string codigo, string nombre, List<CentrosCostoCpt> lstDetalle, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();
            string xmlDetalle;
            xmlDetalle = XmlUtil.Serializer(typeof(List<CentrosCostoCpt>), lstDetalle);
            DataSet ds = new DataSet();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_CentrosCostoGuardar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdCentroCosto", (object)idCentroCosto ?? DBNull.Value);
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

        public Task<DataSet> CentrosCostoEliminar(int idCentroCosto, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_CentrosCostoEliminar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdCentroCosto", (object)idCentroCosto ?? DBNull.Value);

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
