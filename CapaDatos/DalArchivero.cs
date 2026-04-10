using CapaDatos;
using CapaEntidades;
using NPOI.SS.Formula.Functions;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.CapaDatos
{
    public class DalArchivero
    {
        public Task<DataSet> ArchiverosListar(string dni, string apPaterno, string apMaterno, string nombres)
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
                            string sql = "web_ArchiverosListar";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@Dni", SqlDbType.VarChar).Value = (object)dni ?? DBNull.Value;
                            da.SelectCommand.Parameters.Add("@ApPaterno", SqlDbType.VarChar).Value = (object)apPaterno ?? DBNull.Value;
                            da.SelectCommand.Parameters.Add("@ApMaterno", SqlDbType.VarChar).Value = (object)apMaterno ?? DBNull.Value;
                            da.SelectCommand.Parameters.Add("@Nombres", SqlDbType.VarChar).Value = (object)nombres ?? DBNull.Value;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                }
                catch (Exception)
                {
                    ds = null; throw;
                }

            });
        }

        public Task<DataSet> ArchiveroSeleccionar(int idEmpleado)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ArchiveroSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdEmpleado", idEmpleado);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ArchiveroGuardar(int idEmpleado, List<Archivero> lstDetalle, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();
            string xmlDetalle;
            xmlDetalle = XmlUtil.Serializer(typeof(List<Archivero>), lstDetalle);

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ArchiveroGuardar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdEmpleado", idEmpleado);
                        da.SelectCommand.Parameters.AddWithValue("@DetalleServicios", xmlDetalle ?? (object)DBNull.Value);

                        da.SelectCommand.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        da.SelectCommand.Parameters.AddWithValue("@IdListItem", idListBar);


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ArchiveroEliminar(int idEmpleado, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ArchiveroEliminar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdEmpleado", idEmpleado);

                        da.SelectCommand.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        da.SelectCommand.Parameters.AddWithValue("@IdListItem", idListBar);


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


    }
}
