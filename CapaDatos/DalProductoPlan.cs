using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CapaEntidades;
using CapaDatos;
using Microsoft.AspNetCore.Mvc;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.CapaDatos
{
    public class DalProductoPlan
    {
        public Task<DataSet> TiposFinanciamientoSegunFiltro(string Filtro)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "TiposFinanciamientoSegunFiltro";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@lcFiltro", SqlDbType.VarChar).Value = (Filtro == null) ? "" : Filtro;


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }




















        public async Task<DataSet> FactConfigProductoPlan_Listar(string IdTipoFinanciamiento, string Descripcion)
        {
            DataSet dataSet = new DataSet();
            Console.WriteLine("✅ Conexión a BD abierta");
            try
            {
                using (SqlConnection conn = new Conexion().obtenerConexion())
                using (SqlCommand cmd = new SqlCommand("web_FactConfigProductoPlan_Listar", conn))
                using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@vIdTipoFinanciamiento", IdTipoFinanciamiento);
                    cmd.Parameters.AddWithValue("@vDescripcion", Descripcion);
                    await conn.OpenAsync();
                    da.Fill(dataSet);
                    return dataSet;
                }
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"Error al listar todos los detalles: {ex.Message}", ex);
            }
        }
        public async Task<DataSet> FactConfigProductoPlan_Listar_EstadoCuenta()
        {
            DataSet dataSet = new DataSet();

            try
            {
                using (SqlConnection conn = new Conexion().obtenerConexion())
                using (SqlCommand cmd = new SqlCommand("web_FactConfigProductoPlan_Listar", conn))
                using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    // ⚠️ NO AGREGAR PARÁMETROS ⚠️
                    // cmd.Parameters.AddWithValue("@idFactPaquete", idFactPaquete); ← ELIMINAR ESTA LÍNEA

                    await conn.OpenAsync();
                    da.Fill(dataSet);

                    return dataSet;
                }
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"Error al listar todos los detalles: {ex.Message}", ex);
            }
        }

        //public async Task<DataSet> FactConfigProductoPlan_Listar_TipoConcepto()
        //{
        //    DataSet dataSet = new DataSet();

        //    try
        //    {
        //        using (SqlConnection conn = new Conexion().obtenerConexion())
        //        using (SqlCommand cmd = new SqlCommand("web_FactConfigProductoPlan_Listar", conn))
        //        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
        //        {
        //            cmd.CommandType = CommandType.StoredProcedure;

        //            // ⚠️ NO AGREGAR PARÁMETROS ⚠️
        //            // cmd.Parameters.AddWithValue("@idFactPaquete", idFactPaquete); ← ELIMINAR ESTA LÍNEA

        //            await conn.OpenAsync();
        //            da.Fill(dataSet);

        //            return dataSet;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new ApplicationException($"Error al listar todos los detalles: {ex.Message}", ex);
        //    }
        //}





        //public async Task<DataSet> web_FactConfigProductoPlan_Listar_EstadoCuenta(int idFactPaquete)
        //{
        //    DataSet dataSet = new DataSet();

        //    try
        //    {
        //        using (SqlConnection conn = new Conexion().obtenerConexion())
        //        using (SqlCommand cmd = new SqlCommand("Web_ListarDetallePaquete", conn))
        //        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
        //        {
        //            cmd.CommandType = CommandType.StoredProcedure;
        //            cmd.Parameters.AddWithValue("@idFactPaquete", idFactPaquete);

        //            await conn.OpenAsync();
        //            da.Fill(dataSet);

        //            return dataSet;
        //        }
        //    }
        //    catch (SqlException sqlEx)
        //    {
        //        throw new ApplicationException(
        //            $"Error de SQL al listar detalle paquete: {sqlEx.Message}",
        //            sqlEx);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new ApplicationException(
        //            $"Error al listar detalle paquete ID {idFactPaquete}: {ex.Message}",
        //            ex);
        //    }
        //}

        //public async Task<DataSet> web_FactConfigProductoPlan_Listar_TipoConcepto(int idFactPaquete)
        //{
        //    DataSet dataSet = new DataSet();

        //    try
        //    {
        //        using (SqlConnection conn = new Conexion().obtenerConexion())
        //        using (SqlCommand cmd = new SqlCommand("Web_ListarDetallePaquete", conn))
        //        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
        //        {
        //            cmd.CommandType = CommandType.StoredProcedure;
        //            cmd.Parameters.AddWithValue("@idFactPaquete", idFactPaquete);

        //            await conn.OpenAsync();
        //            da.Fill(dataSet);

        //            return dataSet;
        //        }
        //    }
        //    catch (SqlException sqlEx)
        //    {
        //        throw new ApplicationException(
        //            $"Error de SQL al listar detalle paquete: {sqlEx.Message}",
        //            sqlEx);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new ApplicationException(
        //            $"Error al listar detalle paquete ID {idFactPaquete}: {ex.Message}",
        //            ex);
        //    }
        //}




        //public async Task<bool> web_FactConfigProductoPlan_InsertarActualizar(
        //    string idFactPaquete, 
        //    string nuevoEstado
        //    )
        //{
        //    SqlTransaction transaction = null;

        //    try
        //    {
        //        using (SqlConnection conn = new Conexion().obtenerConexion())
        //        {
        //            await conn.OpenAsync();
        //            transaction = conn.BeginTransaction();

        //            using (SqlCommand cmd = new SqlCommand("web_FactConfigProductoPlan_InsertarActualizar", conn, transaction))
        //            {
        //                cmd.CommandType = CommandType.StoredProcedure;
        //                cmd.Parameters.AddWithValue("@idFactPaquete", idFactPaquete);
        //                cmd.Parameters.AddWithValue("@nuevoEstado", nuevoEstado);

        //                int affectedRows = await cmd.ExecuteNonQueryAsync();

        //                transaction.Commit();
        //                return affectedRows > 0;
        //            }
        //        }
        //    }
        //    catch
        //    {
        //        transaction?.Rollback();
        //        throw;
        //    }
        //    finally
        //    {
        //        transaction?.Dispose();
        //    }
        //}



        public async Task<int> FactConfigProductoPlan_InsertarActualizar(
        int? IdTipoFinanciamiento,
        string Descripcion,
        int esOficina,
        int esSalida,
        int SeIngresPrecios,
        int EsFarmacia,
        int idCajaTiposComprobante,
        string tipoVenta,
        int SeImprimeComprobante,
        int esFuenteFinanciamiento,
        int GeneraPago,
        int idTipoConcepto
        )
        {
            SqlTransaction transaction = null;

            try
            {
                using (SqlConnection conn = new Conexion().obtenerConexion())
                {
                    await conn.OpenAsync();
                    transaction = conn.BeginTransaction();

                    using (SqlCommand cmd = new SqlCommand("web_FactConfigProductoPlan_InsertarActualizar", conn, transaction))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@IdTipoFinanciamiento", (object?)IdTipoFinanciamiento ?? DBNull.Value);
                        cmd.Parameters.AddWithValue("@Descripcion", Descripcion);
                        cmd.Parameters.AddWithValue("@esOficina", esOficina);
                        cmd.Parameters.AddWithValue("@esSalida", esSalida);
                        cmd.Parameters.AddWithValue("@SeIngresPrecios", SeIngresPrecios);
                        cmd.Parameters.AddWithValue("@EsFarmacia", EsFarmacia);
                        cmd.Parameters.AddWithValue("@idCajaTiposComprobante",idCajaTiposComprobante);
                        cmd.Parameters.AddWithValue("@tipoVenta", tipoVenta);
                        cmd.Parameters.AddWithValue("@SeImprimeComprobante",SeImprimeComprobante);
                        cmd.Parameters.AddWithValue("@esFuenteFinanciamiento", esFuenteFinanciamiento);
                        cmd.Parameters.AddWithValue("@GeneraPago", GeneraPago);
                        cmd.Parameters.AddWithValue("@idTipoConcepto", idTipoConcepto);

                        //int affectedRows = await cmd.ExecuteNonQueryAsync();

                        var result = await cmd.ExecuteScalarAsync();
                        transaction.Commit();
                        //return affectedRows > 0;
                        return Convert.ToInt32(result);
                    }
                }
            }
            catch
            {
                transaction?.Rollback();
                throw;
            }
            finally
            {
                transaction?.Dispose();
            }
        }



        public async Task<DataTable> FactConfigProductoPlan_Listar_TipoConcepto()
        {
            var dt = new DataTable();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_FactConfigProductoPlan_Listar_TipoConcepto", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                await conn.OpenAsync();
                da.Fill(dt);
            }

            return dt;
        }
        public async Task<DataTable> FactConfigProductoPlan_Listar_TipoComprobante()
        {
            var dt = new DataTable();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_FactConfigProductoPlan_Listar_TipoComprobante", conn))

            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                await conn.OpenAsync();
                da.Fill(dt);
            }

            return dt;
        }


    }
}
