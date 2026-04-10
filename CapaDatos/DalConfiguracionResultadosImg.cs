using System.Data;
using System.Threading.Tasks;
using System.Data.SqlClient;
using CapaDatos;
using System;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.CapaDatos
{
    public class DalConfiguracionResultadosImg
    {
        public Task<DataSet> ImgGruposSeleccionarTodos()
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "ImgGruposSeleccionarTodos";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

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

        public Task<DataSet> EmpleadosImagenesTodos()
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_EmpleadosImagenesTodos";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

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

        public Task<DataSet> EmpleadosImagenesPorGrupo(int idGrupo)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_EmpleadosImagenesPorGrupo";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idGrupo", idGrupo);

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

        public Task<DataSet> ImgItemsCptSeleccionarPorIdProducto(int idProducto)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ImgItemsCptSeleccionarPorIdProducto";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdProducto", idProducto);

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

        public async Task<DataSet> ListarProcedimientoImgConfigurar(string Codigo, string Nombre)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarProcedimientoImgConfigurar", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@Codigo", Codigo ?? "");
                cmd.Parameters.AddWithValue("@Nombre", Nombre ?? "");

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }

        public async Task<DataSet> ImgItemsGruposSeleccionarTodos(string Filtro)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("ImgItemsGruposSeleccionarTodos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@Filtro", Filtro ?? "");

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }
        public async Task<DataSet> ImgItemsSeleccionarTodos(string Filtro)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("ImgItemsSeleccionarTodos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@Filtro", Filtro ?? "");

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }
        public async Task<DataSet> ListarProcedimientoImgConfigurar(int? IdSubGrupo, string Codigo, string Nombre)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarProcedimientoImgConfigurar", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdSubGrupo", IdSubGrupo ?? 0);
                cmd.Parameters.AddWithValue("@Codigo", Codigo ?? "");
                cmd.Parameters.AddWithValue("@Nombre", Nombre ?? "");

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }

        public async Task<DataSet> ImgItemsCptModificar(ImgItemsCpt imgItemsCpt, int idUsuario, int idListBar, string opcion)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ImgItemsCptModificar", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdProductoCpt", imgItemsCpt.IdProductoCpt);
                cmd.Parameters.AddWithValue("@ordenXresultado", imgItemsCpt.OrdenXresultado);
                cmd.Parameters.AddWithValue("@IdGrupo", imgItemsCpt.IdGrupo);
                cmd.Parameters.AddWithValue("@idItemGrupo", imgItemsCpt.IdItemGrupo);
                cmd.Parameters.AddWithValue("@idItem", imgItemsCpt.IdItem);
                cmd.Parameters.AddWithValue("@ValorSiEsCombo", imgItemsCpt.ValorSiEsCombo ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@ValorReferencial", imgItemsCpt.ValorReferencial ?? "");
                cmd.Parameters.AddWithValue("@Metodo", imgItemsCpt.Metodo ?? "");
                cmd.Parameters.AddWithValue("@SoloNumero", imgItemsCpt.SoloNumero);
                cmd.Parameters.AddWithValue("@SoloTexto", imgItemsCpt.SoloTexto);
                cmd.Parameters.AddWithValue("@SoloCombo", imgItemsCpt.SoloCombo);
                cmd.Parameters.AddWithValue("@SoloCheck", imgItemsCpt.SoloCheck);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", idUsuario);
                cmd.Parameters.AddWithValue("@idListBar", idListBar);
                cmd.Parameters.AddWithValue("@opcion", opcion);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }


    }
}
