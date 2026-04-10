using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CapaEntidades;
namespace CapaDatos
{
    public class DalCatalogo
    {
        public Task<DataSet> CatalogoServiciosSeleccionarSoloConPreciosEnParticular(int idPuntoCarga)
        {
           
            Conexion cx = new Conexion();
            
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "CatalogoServiciosSeleccionarSoloConPreciosEnParticular";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idPuntoCarga", SqlDbType.VarChar).Value = idPuntoCarga;


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public async Task<DataSet> FactCatalogoServiciosHospXfiltro(string filtro)
        {
            DataSet ds = new DataSet();
            //SqlCommand cmd = null;

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("FactCatalogoServiciosHospXfiltro", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Filtro", filtro);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
                        
        }

        public async Task<DataSet> FactCatalogoBienesInsumosHospXfiltro(string filtro)
        {
            DataSet ds = new DataSet();
            //SqlCommand cmd = null;
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("FactCatalogoBienesInsumosHospXfiltro", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Filtro", filtro);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
                        
        }

        public Task<DataSet> FactCatalogoPaqueteXtipoPaquete(int tipo, string descripcion)
        {
            
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "FiltrarFactCatalogoPaqueteXtipoPaquete";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@tipoPaquete", SqlDbType.Int).Value = tipo;
                        da.SelectCommand.Parameters.Add("@descripcion", SqlDbType.VarChar).Value = (descripcion == null) ? "" : descripcion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });

        }

        public Task<DataSet> FactDetallePaquete(int tipo, int idPaquete)
        {
           /* DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                if (tipo == 0)
                {
                    cmd = MetodoDatos.CrearComando("web_FacturacionCatalogoPaquetesXpaquete2");
                    cmd.Parameters.AddWithValue("@IdFactPaquete", idPaquete);
                }
                else
                {
                    cmd = MetodoDatos.CrearComando("FacturacionCatalogoPaquetesParaCaja");
                    cmd.Parameters.AddWithValue("@IdFactPaquete", idPaquete);
                    cmd.Parameters.AddWithValue("@mi_DebeConsiderarPaquete", tipo);
                }
                SqlDataAdapter da = new SqlDataAdapter(cmd);

                da.Fill(ds);

            }
            catch (Exception ex)
            {

                ds = null; throw ex;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
           */
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        if (tipo == 0)
                        {
                            
                            string sql = "web_FacturacionCatalogoPaquetesXpaquete2";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdFactPaquete", SqlDbType.VarChar).Value = idPaquete;
                        }
                        else
                        {

                            string sql = "FacturacionCatalogoPaquetesParaCaja";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdFactPaquete", SqlDbType.VarChar).Value = idPaquete;
                            da.SelectCommand.Parameters.Add("@mi_DebeConsiderarPaquete", SqlDbType.VarChar).Value = tipo;
                        }

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }
        //lmoreano
        public DataSet ListaCptByPuntoCargaByFuente(int idPuntoCarga, int idTipoFinanciamiento)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_ListaCptByPuntoCargaByFuente");
                cmd.Parameters.AddWithValue("@idPuntoCarga", idPuntoCarga);
                cmd.Parameters.AddWithValue("@idTipoFinanciamiento", idTipoFinanciamiento);

                SqlDataAdapter da = new SqlDataAdapter(cmd);

                da.Fill(ds);

            }
            catch (Exception ex)
            {

                ds = null; throw new Exception(ex.Message);
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }

        ////////////////////////////////KHOYOSI////////////////////////////////////////
        public Task<DataSet> CatalogoServiciosSeleccionarPorPtoCargaPorServSoloConPreciosEnParticular(int idPuntoCarga, int idServicio)
        {

            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_CatalogoServiciosSeleccionarPorPtoCargaPorServSoloConPreciosEnParticular";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdPuntoCarga", SqlDbType.VarChar).Value = idPuntoCarga;
                        da.SelectCommand.Parameters.Add("@IdServicio", SqlDbType.VarChar).Value = idServicio;


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarCatologoTotal(int idTipoServicio)
        {

            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_CatalogoServiciosSeleccionarTodo";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idTipoServicio", SqlDbType.Int).Value = idTipoServicio;


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> FactCatalogoServiciosHospFiltraPorPuntoCargaTipoFinanciamiento(int idPuntoCarga, int idTipoFinaciamiento, int idFiltroTipo, string filtro, int idTipoServicio)
        {

            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "FactCatalogoServiciosHospFiltraPorPuntoCargaTipoFinanciamiento";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idPuntoCarga", SqlDbType.Int).Value = idPuntoCarga;
                        da.SelectCommand.Parameters.Add("@idTipoFinanciamiento", SqlDbType.Int).Value = idTipoFinaciamiento;
                        da.SelectCommand.Parameters.Add("@idFiltroTipo", SqlDbType.Int).Value = idFiltroTipo;
                        da.SelectCommand.Parameters.Add("@Filtro", SqlDbType.VarChar).Value = filtro;
                        da.SelectCommand.Parameters.Add("@TipoServicioOfrecido", SqlDbType.Int).Value = idTipoServicio;


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


    }

}
