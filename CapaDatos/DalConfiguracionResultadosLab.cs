using System.Data;
using System.Threading.Tasks;
using System.Data.SqlClient;
using CapaDatos;
using System;
using static NPOI.HSSF.Util.HSSFColor;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.CapaDatos
{
    public class DalConfiguracionResultadosLab
    {
        public Task<DataSet> LabGruposSeleccionarTodos()
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
                            string sql = "LabGruposSeleccionarTodos";
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


        public async Task<DataSet> FactCatalogoServiciosSubGrupo()
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_FactCatalogoServiciosSubGrupo", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }

        public async Task<DataSet> LabItemsGruposSeleccionarTodos(string Filtro)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("LabItemsGruposSeleccionarTodos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@Filtro", Filtro ?? "");

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }
        public async Task<DataSet> LabItemsSeleccionarTodos(string Filtro)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("LabItemsSeleccionarTodos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@Filtro", Filtro ?? "");

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }
        public async Task<DataSet> ListarProcedimientoLabConfigurar(int? IdSubGrupo, string Codigo, string Nombre)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarProcedimientoLabConfigurar", conn))
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
        public async Task<DataSet> LabItemsCptModificar(LabItemsCpt labItemsCpt, int idUsuario, int idListBar, string opcion)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_LabItemsCptModificar", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdProductoCpt", labItemsCpt.IdProductoCpt);
                cmd.Parameters.AddWithValue("@ordenXresultado", labItemsCpt.OrdenXresultado);
                cmd.Parameters.AddWithValue("@IdGrupo", labItemsCpt.IdGrupo);
                cmd.Parameters.AddWithValue("@idItemGrupo", labItemsCpt.IdItemGrupo);
                cmd.Parameters.AddWithValue("@idItem", labItemsCpt.IdItem);
                cmd.Parameters.AddWithValue("@ValorSiEsCombo", labItemsCpt.ValorSiEsCombo ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@ValorReferencial", labItemsCpt.ValorReferencial ?? "");
                cmd.Parameters.AddWithValue("@Metodo", labItemsCpt.Metodo ?? "");
                cmd.Parameters.AddWithValue("@SoloNumero", labItemsCpt.SoloNumero);
                cmd.Parameters.AddWithValue("@SoloTexto", labItemsCpt.SoloTexto);
                cmd.Parameters.AddWithValue("@SoloCombo", labItemsCpt.SoloCombo);
                cmd.Parameters.AddWithValue("@SoloCheck", labItemsCpt.SoloCheck);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", idUsuario);
                cmd.Parameters.AddWithValue("@idListBar", idListBar);
                cmd.Parameters.AddWithValue("@opcion", opcion);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }

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

    }
}
