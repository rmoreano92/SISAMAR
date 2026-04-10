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
    public class DalCaja
    {
        public Task<DataSet> CajasListar(string codigo, string nombre)
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
                            string sql = "web_CajasListar";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@Codigo", SqlDbType.VarChar).Value = (object)codigo ?? DBNull.Value;
                            da.SelectCommand.Parameters.Add("@Nombre", SqlDbType.VarChar).Value = (object)nombre ?? DBNull.Value;

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

        public Task<DataSet> CajaSeleccionar(int idCaja)
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
                            string sql = "web_CajaSeleccionar";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdCaja", SqlDbType.Int).Value = (object)idCaja ?? DBNull.Value;

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

        public Task<DataSet> CajaSeleccionarPorEquipo(string ip)
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
                            string sql = "web_CajaSeleccionarPorEquipo";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@Ip", SqlDbType.VarChar).Value = (object)ip ?? DBNull.Value;

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

        public Task<DataSet> CajaNroDocumentosSeleccionar(int idCaja)
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
                            string sql = "web_CajaNroDocumentosSeleccionar";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdCaja", SqlDbType.Int).Value = (object)idCaja ?? DBNull.Value;

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


        public Task<DataSet> CajaGuardar(Caja caja, List<CajaNroDocumento> lstDetalle, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();
            string xmlDetalle;
            xmlDetalle = XmlUtil.Serializer(typeof(List<CajaNroDocumento>), lstDetalle);

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_CajaGuardar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdCaja", caja.IdCaja);
                        da.SelectCommand.Parameters.AddWithValue("@Codigo", caja.Codigo);
                        da.SelectCommand.Parameters.AddWithValue("@Descripcion", caja.Descripcion);
                        da.SelectCommand.Parameters.AddWithValue("@LoginPC", caja.loginPC);
                        da.SelectCommand.Parameters.AddWithValue("@ImpresoraServicio", caja.ImpresoraDefault);
                        da.SelectCommand.Parameters.AddWithValue("@ImpresoraFarmacia", caja.Impresora2);
                        da.SelectCommand.Parameters.AddWithValue("@DetalleDocumentos", xmlDetalle ?? (object)DBNull.Value);

                        da.SelectCommand.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        da.SelectCommand.Parameters.AddWithValue("@IdListItem", idListBar);


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> CajaEliminar(int idCaja, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_CajaEliminar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdCaja", idCaja);

                        da.SelectCommand.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        da.SelectCommand.Parameters.AddWithValue("@IdListItem", idListBar);


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> CierreCaja(int idGestionCaja, string ip, int idCajero, int idListBar)
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_CierreCajaPorGestion";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdGestionCaja", idGestionCaja);
                        da.SelectCommand.Parameters.AddWithValue("@IdUsuario", idCajero);
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
